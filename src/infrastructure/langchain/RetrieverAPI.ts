// import { TaskType } from '@google/generative-ai';
// // import { getAllTopics } from '../utils/axios.config';
// import dotenv from 'dotenv';
// import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
// import { MemoryVectorStore } from 'langchain/vectorstores/memory';
// import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';
// import { JsonOutputParser, StringOutputParser } from '@langchain/core/output_parsers';
// import { ChatPromptTemplate } from '@langchain/core/prompts';
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// dotenv.config();
// const formatDocumentsAsString = (documents) => {
//     return documents.map((document) => document.pageContent).join('\n\n');
// };

// const category = ['WEB', 'APP', 'SYSTEM', 'AI', 'DATA', 'SECURITY', 'NETWORK', 'OTHER'];

// const CLASSIFICATION_TEMPLATE = `
// Use the following text descriptions to classify the project into the correct category.
// If you don't know the category, just return json with message you don't know, don't try to make up an answer.
// ----------------
// {context}

// Based on the descriptions above, classify the project into one of the following categories:
// ${category.map((c) => `\n- ${c}`).join('')}
// Note that the form answer such as two array: 
// array_topics_category:
//   name_category: 
//   topics:
//   and total topics of category.
//   only return json.
// array_lecturers_category:
//   lecturerName:
//   name_category:
// `;

// const CHUNK_SIZE = 10000;
// const CHUNK_OVERLAP = 1000;

// const genAIModel = new GoogleGenerativeAIEmbeddings({
//     apiKey: process.env.GEMINI_API_KEY,
//     model: 'text-embedding-004',
//     title: 'Document title',
//     taskType: TaskType.RETRIEVAL_DOCUMENT,
// });

// const chat = new ChatGoogleGenerativeAI({
//     apiKey: process.env.GEMINI_API_KEY,
//     model: 'gemini-1.5-flash',
// });

// export const userQuery = async () => {
//     const response;
//     // await getAllTopics();
//     const topics = response.data.topics;

//     //saving topic to memory
//     const jsons_file = JSON.stringify(topics);

//     const textSplitter = new RecursiveCharacterTextSplitter({
//         chunkSize: CHUNK_SIZE,
//         chunkOverlap: CHUNK_OVERLAP,
//     });

//     const docs = await textSplitter.createDocuments([jsons_file]);
//     const vectorStore = await MemoryVectorStore.fromDocuments(docs, genAIModel);
//     const vectorStoreRetriever = vectorStore.asRetriever();

//     const prompt = ChatPromptTemplate.fromMessages([
//         ['system', CLASSIFICATION_TEMPLATE],
//         ['human', '{question}'],
//     ]);

//     const chain = RunnableSequence.from([
//         {
//             context: vectorStoreRetriever.pipe(formatDocumentsAsString),
//             question: new RunnablePassthrough(),
//         },
//         prompt,
//         chat,
//         new JsonOutputParser(),
//     ]);

//     const answer = await chain.invoke('What category does this project belong to?');
//     return answer;
// };
