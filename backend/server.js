import { config } from "dotenv";
config();
import { PineconeClient } from "@pinecone-database/pinecone";
import {
  createPineconeIndex,
  updatePinecone,
  queryPineconeVectorStoreAndQueryLLM,
} from "./langchain/pineconeFunctions.js";

// Langchain Loaders
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
// Set up DirectoryLoader to load documents from the ./documents directory
const loader = new DirectoryLoader("./langchain/documents", {
  //   ".txt": (path) => new TextLoader(path),
  //   ".pdf": (path) => new PDFLoader(path),
  ".csv": (path) => new CSVLoader(path),
});
const docs = await loader.load();

// Set up variables for the filename, question, and index settings
// const question = "What is employee_id 72255's department?";
const question = `Identify the top 3 employees in the Software Engineering Department who need improvement in their performance score and should be prioritized for upskilling. The selection should be based on the following criteria:

1. Skills Score: Prioritize employees with a lower skills score, indicating a greater need for upskilling. Justification can be based on comparing an individual's skills score with the average skills score of all employees in the same department.

2. Satisfaction Score: Focus on employees with a lower satisfaction score, as upskilling opportunities may increase their job satisfaction and reduce turnover rates.

3. Age: Younger employees may have a higher capacity for learning and acquiring new skills quickly, so they should be given priority.

4. Employee Type: Full-time employees are likely to stay with the company longer, making it more beneficial to invest in their upskilling. Therefore, prioritize full-time employees over part-time and contract employees.

Please provide the employee IDs of the selected individuals, along with a detailed justification for their selection based on the above criteria.
`;

const indexName = "ppcone";
const vectorDimension = 1536;
// Initialize Pinecone client with API key and environment
const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

const ASYNC_createPineconeIndex = async (client, indexName, vectorDimension) => {
  await createPineconeIndex(client, indexName, vectorDimension);
};
const ASYNC_updatePinecone = async (client, indexName, docs) => {
  await updatePinecone(client, indexName, docs);
};
const ASYNC_queryPineconeVectorStoreAndQueryLLM = async (client, indexName, question) => {
  await queryPineconeVectorStoreAndQueryLLM(client, indexName, question);
};

// ASYNC_createPineconeIndex(client, indexName, vectorDimension);
// ASYNC_updatePinecone(client, indexName, docs);
// ASYNC_queryPineconeVectorStoreAndQueryLLM(client, indexName, question);
