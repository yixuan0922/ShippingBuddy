const Document = require("langchain/document").Document;
const Pinecone = require("@pinecone-database/pinecone").Pinecone;
const OpenAIEmbeddings = require("langchain/embeddings/openai").OpenAIEmbeddings;
const OpenAI = require("langchain/llms/openai").OpenAI;
const loadQAStuffChain = require("langchain/chains").loadQAStuffChain;
const RecursiveCharacterTextSplitter = require("langchain/text_splitter").RecursiveCharacterTextSplitter;

// import { Document } from "langchain/document";
// import { PineconeStore } from "langchain/vectorstores/pinecone";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { OpenAI } from "langchain/llms/openai";
// import { loadQAStuffChain } from "langchain/chains";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// import { SerpAPI } from "langchain/tools";
const SerpAPI = require("langchain/tools").SerpAPI;
// import { initializeAgentExecutorWithOptions } from "langchain/agents";
const initializeAgentExecutorWithOptions = require("langchain/agents").initializeAgentExecutorWithOptions;


const createPineconeIndex = async (client, indexName, vectorDimension) => {
  // 1. Initiate index existence check
  console.log(`Checking "${indexName}"...`);
  // console.log(client);

  // 2. Get list of existing indexes
  const existingIndexes = await client.listIndexes();
  // console.log(existingIndexes);
  const exists = existingIndexes.some((item) => item.name === indexName);

  // 3. If index doesn't exist, create it
  if (!exists) {
    // 4. Log index creation initiation
    console.log(`Creating "${indexName}"...`);

    // 5. Create index
    await client.createIndex({
      name: indexName,
      dimension: vectorDimension,
      metric: "cosine",
    });

    // 7. Wait 60 seconds for index initialization
    await new Promise((resolve) => setTimeout(resolve, 60000));

    // Log successful creation
    let logres = await Pinecone.describeIndex(indexName);
    console.log(`Created with client:`, logres);
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
    // console.log(text);

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

  // console.log(batch);
  console.log("batch length:", batch.length);
  await index.upsert(batch);
  console.log("upsert done!");
};

//Loading SerpAPI Agent and OpenAI
// const gg = async () => {
//   const model = new OpenAI({
//     temperature: 0.5,
//   });
  
//   const tools = [
//     new SerpAPI(process.env.SERPAPI_API_KEY, {
//       hl: "en",
//       gl: "us",
//     }),
//   ];
  
//   const executor = await initializeAgentExecutorWithOptions(tools, model, {
//     agentType: "zero-shot-react-description",
//   });
//   console.log("Loaded the agent..");
// }
// gg();
// const model = new OpenAI({
//   temperature: 0.5,
// });

// const tools = [
//   new SerpAPI(process.env.SERPAPI_API_KEY, {
//     hl: "en",
//     gl: "us",
//   }),
// ];

// const executor = await initializeAgentExecutorWithOptions(tools, model, {
//   agentType: "zero-shot-react-description",
// });
// console.log("Loaded the agent..");


var model = new OpenAI({
  temperature: 0.5,
});
var tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, {
    hl: "en",
    gl: "us",
  }),
];
const queryPineconeVectorStoreAndQueryLLM = async (client, indexName, question) => {
  // 3. Start query process
  console.log("Querying Pinecone vector store...");
  // 4. Retrieve the Pinecone index
  const index = client.Index(indexName);
  // 5. Create query embedding
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);

  // 6. Query Pinecone index and return top 10 matches
  let queryResponse = await index.query({
    topK: 10,
    vector: queryEmbedding,
    includeMetadata: true,
    includeValues: true,
  });

  // 7. Log the number of matches
  console.log(`Found ${queryResponse.matches.length} matches...`);

  // 8. Log the question being asked
  console.log(`Asking question: ${question}...`);
  let answer = "No Match Found, Not queried";
  if (queryResponse.matches.length) {
    // 9. Create an OpenAI instance and load the QAStuffChain
    const llm = new OpenAI({ maxTokens: -1 });
    const chain = loadQAStuffChain(llm);
    // 10. Extract and concatenate page content from matched documents
    const concatenatedPageContent = queryResponse.matches.map((match) => match.metadata.pageContent).join(" ");
    // 11. Execute the chain with input documents and question
    const result = await chain.call({
      input_documents: [new Document({ pageContent: concatenatedPageContent })],
      question: question,
    });

    // 12. Log the answer
    answer = result.text;

    console.log(`Answer: ${result.text}`);


    
    const executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "zero-shot-react-description",
    });
    console.log("Loaded the agent..");
    
  
    const courseRecommendation = await executor.call({
      input: `Recommend me 3 specific courses with course name from https://www.myskillsfuture.gov.sg/content/portal/en/index.html for these employees based on their job departments.`,
    });
    console.log(courseRecommendation);

    answer = answer + "\n\n" + courseRecommendation.output;

  } else {
    // 13. Log that there are no matches, so GPT-3 will not be queried
    console.log("Since there are no matches, GPT-3 will not be queried.");
  }

  return answer;
};

module.exports = {
  createPineconeIndex,
  updatePinecone,
  queryPineconeVectorStoreAndQueryLLM,
};
