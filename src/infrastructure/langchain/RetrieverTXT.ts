// import dotenv from 'dotenv';
// import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
// import { MemoryVectorStore } from 'langchain/vectorstores/memory';
// import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';
// import { StringOutputParser } from '@langchain/core/output_parsers';
// import { ChatPromptTemplate } from '@langchain/core/prompts';
// import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
// import * as fs from 'node:fs';
// import { resolve, dirname } from 'path';
// import { fileURLToPath } from 'url';
// import { TaskType } from '@google/generative-ai';

// dotenv.config();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const formatDocumentsAsString = (documents) => {
//     return documents.map((document) => document.pageContent).join('\n\n');
// };

// // Initialize the LLM to use to answer the question.
// const model = new ChatGoogleGenerativeAI({
//     apiKey: process.env.GEMINI_API_KEY,
//     model: 'gemini-1.5-flash',
// });

// const embeddings = new GoogleGenerativeAIEmbeddings({
//     apiKey: process.env.GEMINI_API_KEY,
//     model: 'text-embedding-004',
//     title: 'Document title',
//     taskType: TaskType.RETRIEVAL_DOCUMENT,
// });
// const text = fs.readFileSync(resolve(__dirname, '../../file/state_of_the_union.txt'), 'utf8');
// const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
// const docs = await textSplitter.createDocuments([text]);
// const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

// const vectorStoreRetriever = vectorStore.asRetriever();

// const SYSTEM_TEMPLATE = `Use the following pieces of context to answer the question at the end.
// If you don't know the answer, just say that you don't know, don't try to make up an answer.
// ----------------
// {context}`;

// const prompt = ChatPromptTemplate.fromMessages([
//     ['system', SYSTEM_TEMPLATE],
//     ['human', '{question}'],
// ]);

// const chain = RunnableSequence.from([
//     {
//         context: vectorStoreRetriever.pipe(formatDocumentsAsString),
//         question: new RunnablePassthrough(),
//     },
//     prompt,
//     model,
//     new StringOutputParser(),
// ]);

// const answer = await chain.invoke('What did the president say about Justice Breyer?');
// console.log({ answer });
