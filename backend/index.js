import { config } from "dotenv";
import { PineconeClient } from "@pinecone-database/pinecone";

import { Document } from "langchain/document";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
config();

// console.log(process.env.OPENAI_API_KEY);
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";

// const loader = new CSVLoader("data.csv");
// const docs = await loader.load();
// const csvContent = docs.map((doc) => doc.pageContent);
// console.log(csvContent);

const createPineconeIndex = async (client, indexName, vectorDimension) => {
  // 1. Initiate index existence check
  console.log(`Checking "${indexName}"...`);

  // 2. Get list of existing indexes
  const existingIndexes = await client.listIndexes();

  // 3. If index doesn't exist, create it
  if (!existingIndexes.includes(indexName)) {
    // 4. Log index creation initiation
    console.log(`Creating "${indexName}"...`);

    // 5. Create index
    const createClient = await client.createIndex({
      createRequest: {
        name: indexName,
        dimension: vectorDimension,
        metric: "cosine",
      },
    });
    // 6. Log successful creation
    console.log(`Created with client:`, createClient);

    // 7. Wait 60 seconds for index initialization
    await new Promise((resolve) => setTimeout(resolve, 60000));
  } else {
    // 8. Log if index already exists
    console.log(`"${indexName}" already exists.`);
  }
};

const updatePinecone = async (client, indexName, docs) => {
  console.log("Retrieving Pinecone index...");
  // 3. Retrieve Pinecone index
  const index = client.Index(indexName);
  // 4. Log the retrieved index name
  console.log(`Pinecone index retrieved: ${indexName}`);

  // 5. Process each document in the docs array
  const batch = [];
  let idxID = 0;
  for (const doc of docs) {
    console.log(`Processing document: ${doc.metadata.source}`);
    const txtPath = doc.metadata.source;
    const text = doc.pageContent;
    console.log(text);

    // 6. Create RecursiveCharacterTextSplitter instance
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100,
      //   lengthFunction: len,
    });
    console.log("Splitting text into chunks...");

    // 7. Split text into chunks (documents)
    const chunks = await textSplitter.createDocuments([text]);
    // console.log(chunks);
    console.log(`Text split into ${chunks.length} chunks`);
    console.log(`Calling OpenAI's Embedding endpoint documents with ${chunks.length} text chunks ...`);

    // 8. Create OpenAI embeddings for documents
    const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
      chunks.map((chunk) => chunk.pageContent.replace(/\n/g, ","))
    );
    // console.log(embeddingsArrays);
    console.log("Finished embedding documents");
    console.log(`Creating ${chunks.length} vectors array with id, values, and metadata...`);

    // 9. Create and upsert vectors in batches of 100
    // const batchSize = 100;
    // let batch = [];
    for (let idx = 0; idx < chunks.length; idx++) {
      const chunk = chunks[idx];
      const vector = {
        id: `${txtPath}_${idxID}`,
        values: embeddingsArrays[idx],
        metadata: {
          ...chunk.metadata,
          loc: JSON.stringify(chunk.metadata.loc),
          pageContent: chunk.pageContent,
          txtPath: txtPath,
        },
      };
      batch.push(vector);

      // When batch is full or it's the last item, upsert the vectors
      //   if (batch.length === batchSize || idx === chunks.length - 1) {
      // await index.upsert({
      //   upsertRequest: {
      //     vectors: batch,
      //   },
      // });
      // console.log(batch);
      // console.log(batch.length);
      // Empty the batch
      // batch = [];
      //   }
    }

    // 10. Log the number of vectors updated
    console.log(`Pinecone index updated with ${chunks.length} vectors`);

    // Increment the ID of each vector
    idxID += 1;
  }

  console.log(batch);
  console.log(batch.length);
  await index.upsert({
    upsertRequest: {
      vectors: batch,
    },
  });
};

const queryPineconeVectorStoreAndQueryLLM = async (client, indexName, question) => {
  // 3. Start query process
  console.log("Querying Pinecone vector store...");
  // 4. Retrieve the Pinecone index
  const index = client.Index(indexName);
  // 5. Create query embedding
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);

  // 6. Query Pinecone index and return top 10 matches
  let queryResponse = await index.query({
    queryRequest: {
      topK: 10,
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
    },
  });

  // 7. Log the number of matches
  console.log(`Found ${queryResponse.matches.length} matches...`);

  // 8. Log the question being asked
  console.log(`Asking question: ${question}...`);
  if (queryResponse.matches.length) {
    // 9. Create an OpenAI instance and load the QAStuffChain
    const llm = new OpenAI({});
    const chain = loadQAStuffChain(llm);
    // 10. Extract and concatenate page content from matched documents
    const concatenatedPageContent = queryResponse.matches.map((match) => match.metadata.pageContent).join(" ");
    // 11. Execute the chain with input documents and question
    const result = await chain.call({
      input_documents: [new Document({ pageContent: concatenatedPageContent })],
      question: question,
    });
    // 12. Log the answer
    console.log(`Answer: ${result.text}`);
  } else {
    // 13. Log that there are no matches, so GPT-3 will not be queried
    console.log("Since there are no matches, GPT-3 will not be queried.");
  }
};

// 7. Set up DirectoryLoader to load documents from the ./documents directory
const loader = new DirectoryLoader("./documents", {
  //   ".txt": (path) => new TextLoader(path),
  //   ".pdf": (path) => new PDFLoader(path),
  ".csv": (path) => new CSVLoader(path),
});
const docs = await loader.load();

// 8. Set up variables for the filename, question, and index settings
// const question = "What is employee_id 72255's department?";
const question =
  "Recommend me an employee to upskill based on their age (lower is better), training score (higher is better), and number of KPIs (higher is better)";
const indexName = "ppcone";
const vectorDimension = 1536;
// 9. Initialize Pinecone client with API key and environment
const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});
// 10. Run the main async function
(async () => {
  // 11. Check if Pinecone index exists and create if necessary
  await createPineconeIndex(client, indexName, vectorDimension);
  // 12. Update Pinecone vector store with document embeddings
  //   await updatePinecone(client, indexName, docs);
  // 13. Query Pinecone vector store and GPT model for an answer
  await queryPineconeVectorStoreAndQueryLLM(client, indexName, question);
})();
