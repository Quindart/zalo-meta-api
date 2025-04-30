// import dotenv from 'dotenv';
// import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
// import { ChatPromptTemplate } from '@langchain/core/prompts';
// import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
// import { MemoryVectorStore } from 'langchain/vectorstores/memory';
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// import { resolve, dirname } from 'path';
// import { fileURLToPath } from 'url';
// import { TaskType } from '@google/generative-ai';
// import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';
// import { StringOutputParser } from '@langchain/core/output_parsers';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// dotenv.config();

// const genAIModel = new GoogleGenerativeAIEmbeddings({
//   apiKey: process.env.GEMINI_API_KEY,
//   model: 'text-embedding-004',
//   title: 'Document title',
//   taskType: TaskType.RETRIEVAL_DOCUMENT,
// });

// const CHUNK_SIZE = 10000;
// const CHUNK_OVERLAP = 1000;

// const formatDocumentsAsString = (documents) => {
//   return documents.map((document) => document.pageContent).join('\n\n');
// };

// const userQuery = async (pdfFiles, question) => {
//   //TODO: [CREATE SPLITTER]
//   const splitter = new RecursiveCharacterTextSplitter({
//     separator: [
//       '\n',
//       ' \n',
//       '\n\n',
//       ' \n\n',
//       '\n \n',
//       ' \n \n',
//       '\n\n\n',
//       ' \n\n\n',
//       '\n \n\n',
//       ' \n \n\n',
//     ],
//     chunkSize: CHUNK_SIZE,
//     chunkOverlap: CHUNK_OVERLAP,
//   });

//   // TODO: [set buffer pdf]
//   const loader = new PDFLoader(resolve(__dirname, '../../pdf/HandBook.pdf'), {
//     splitPages: true,
//     parsedItemSeparator: '',
//     ...this,
//   });

//   //TODO: init multiple documents
//   const docs = await loader.load();
//   const doc_to_splitting = await splitter.splitDocuments(docs);

//   //TODO: processing documents
//   const docs_to_store = [];
//   for (const doc of doc_to_splitting) {
//     let new_doc = {
//       pageContent: '',
//       metadata: {},
//     };
//     let pageContent = (await splitter.splitText(doc.pageContent)).join(' ');
//     new_doc.pageContent = pageContent;
//     new_doc.metadata = doc.metadata;
//     docs_to_store.push(new_doc);
//   }

//   //TODO: saving to vector store
//   const vectordb = await MemoryVectorStore.fromDocuments(docs_to_store, genAIModel);

//   const retriever = vectordb.asRetriever();

//   const SYSTEM_TEMPLATE = `Use the following pieces of context to answer the question at the end.
// If you don't know the answer, just say that you don't know, don't try to make up an answer.
// ----------------
// {context}`;

//   const prompt = ChatPromptTemplate.fromMessages([
//     ['system', SYSTEM_TEMPLATE],
//     ['human', '{question}'],
//   ]);

//   const model = new ChatGoogleGenerativeAI({
//     apiKey: process.env.GEMINI_API_KEY,
//     model: 'gemini-1.5-flash',
//   });
//   const chain = RunnableSequence.from([
//     {
//       context: retriever.pipe(formatDocumentsAsString),
//       question: new RunnablePassthrough(),
//     },
//     prompt,
//     model,
//     new StringOutputParser(),
//   ]);

//   const answer = await chain.invoke(question);
//   console.log({ answer });
// };

// userQuery(
//   ['D:\\HocKi8\\big_data\\docs\\lt\\my_bigdata\\md\\SmartDocBot\\pdf\\HandBook.pdf'],
//   'What number rule have content: Individual users should not change the location or installation of computer',
// );
