require("dotenv").config();
// Express
const express = require("express");
const bodyParser = require("body-parser");

// Pinecone
const PineconeClient = require("@pinecone-database/pinecone").Pinecone;
const pineconeFuncs = require("./pinecone/pineconeFunctions.js");
// Langchain Loaders
const CSVLoader = require("langchain/document_loaders/fs/csv").CSVLoader;
const TextLoader = require("langchain/document_loaders/fs/text").TextLoader;
const PDFLoader = require("langchain/document_loaders/fs/pdf").PDFLoader;
const DirectoryLoader = require("langchain/document_loaders/fs/directory").DirectoryLoader;
// Reading CSV
const fs = require("fs");
const parse = require("csv-parse").parse;
const os = require("os");
const multer = require("multer");
const upload = multer({ dest: os.tmpdir() });

var docs = null;
const loadDocuments = async () => {
  // Set up DirectoryLoader to load documents from the ./documents directory
  const loader = new DirectoryLoader("./pinecone/documents", {
    //   ".txt": (path) => new TextLoader(path),
    //   ".pdf": (path) => new PDFLoader(path),
    ".csv": (path) => new CSVLoader(path),
  });
  docs = await loader.load();
};
(async () => {
  await loadDocuments();
  //   console.log(docs);
})();

// const question = "What is employee_id 72255's department?";
const question = `Identify the top 3 employees in the Software Engineering Department who need improvement in their performance score and should be prioritized for upskilling. The selection should be based on the following criteria:

1. Skills Score: Prioritize employees with a lower skills score, indicating a greater need for upskilling. Justification can be based on comparing an individual's skills score with the average skills score of all employees in the same department.

2. Satisfaction Score: Focus on employees with a lower satisfaction score, as upskilling opportunities may increase their job satisfaction and reduce turnover rates.

3. Age: Younger employees may have a higher capacity for learning and acquiring new skills quickly, so they should be given priority.

4. Employee Type: Full-time employees are likely to stay with the company longer, making it more beneficial to invest in their upskilling. Therefore, prioritize full-time employees over part-time and contract employees.

Please provide the employee IDs of the selected individuals, along with a detailed justification for their selection based on the above criteria.
`;

// Initialize Pinecone client with API key and environment
const indexName = "ppcone";
const vectorDimension = 1536;
var client = new PineconeClient();

const ASYNC_createPineconeIndex = async (client, indexName, vectorDimension) => {
  return await pineconeFuncs.createPineconeIndex(client, indexName, vectorDimension);
};
const ASYNC_updatePinecone = async (client, indexName, docs) => {
  return await pineconeFuncs.updatePinecone(client, indexName, docs);
};
const ASYNC_queryPineconeVectorStoreAndQueryLLM = async (client, indexName, question) => {
  return await pineconeFuncs.queryPineconeVectorStoreAndQueryLLM(client, indexName, question);
};

// ASYNC_createPineconeIndex(client, indexName, vectorDimension);
//   ASYNC_updatePinecone(client, indexName, docs);
// ASYNC_queryPineconeVectorStoreAndQueryLLM(client, indexName, question);

// Create express server
const expressApp = express();
const port = process.env.PORT;
expressApp.use(bodyParser.json()); // parse application/json

expressApp.post("/query", async (req, res) => {
  //   console.log(req.body);
  let question = req.body.query;
  let ans = await ASYNC_queryPineconeVectorStoreAndQueryLLM(client, indexName, question);
  res.send(ans);
});

expressApp.post("/read", upload.single("file"), (req, res) => {
  const file = req.file;

  const data = fs.readFileSync(file.path);
  parse(data, (err, records) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ success: false, message: "An error occurred" });
    }

    return res.json({ data: records });
  });
});
expressApp.listen(port, () => {
  console.log(`Express listening on port ${port}`);
});
