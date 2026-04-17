# RAGs-Chatbot (RAGs-Project)
This is a repository that the owner have explore and implemented to study and understand thte RAGs concept and application with an integration to the web-based application usage.
In this part of the githiub and the RAGs implementation owner of this repository decide to work on only the first phase due to the time limit and situation in the master dgreee study of the owner.

# Description
The project aim to create a system to demonstrate RAGs usage with LLM in a production level using Next.js framework in a chatbot-ui as a web-based. In this project the work has been done to completely demonstrate the usage and the concept of the RAG integrating with the LLM but there is some adjustion needed eg., evaluation and parameter tuning to upgrade the efficient of the RAG retrieval performance since the first phase is only the rougly evaluaiton on the retriveval performane. Owner adjust and continue to develop if there is more convinient and possible time.
# Step to use this applciation
1. navigate to the backend folder then create your own .env files and put the parameter like this
GOOGLE_API_KEY=Your gemini api key
PINECONE_API_KEY=Your pinecone api key

# About the evaluation part
Evaluation Strategy
- Phase 1: Initial Implementation & Manual Verification
Due to project objectives and timeline constraints—managed alongside my ongoing Master's research—implementing fully automated evaluation frameworks (such as Ragas or TruLens) was outside the scope of this initial release.
- The primary goal of this first phase is to build a functional demonstration to study the practical integration of a Retrieval-Augmented Generation (RAG) system into a chatbot UI. To ensure response quality within these constraints, I engineered a Golden Dataset consisting of 15 edge-case financial queries spanning 5 different institutions. 
This dataset is used to manually verify two key metrics:
 1. Retrieval Precision
 2. Generation Faithfulness
- Future Work: Automated Pipeline & Expanded Data Integration
Time permitting, a subsequent phase will focus on developing a comprehensive, fully automated testing pipeline. My objective for this future iteration is to expand the system to process Thai-language financial documents, specifically targeting the Stock Exchange of Thailand (SET) 56-1 annual reports. Implementing this will require additional time to establish reliable data sources and configure the expanded infrastructure.

- **FYI:** 
 - How RAGs actually does need in evaluation.
 In a real enterprise, you cannot just test 5 questions yourself and deploy it instead we need to prove mathematically that the our AI and Retrieval information from RAGs is not hallucinating.

We can use automated evaluation frameworks (like Ragas or TruLens) to score RAGs systems on two main things:

1. Retrieval Metrics (Is the Database working?): 
 * Context Precision: Did ChromaDB fetch the exact right chunk, or did it pull in useless junk?
 * Context Recall: Did ChromaDB miss any important chunks?

2. Generation Metrics (Is the LLM working?):
 * Faithfulness: Did the AI make up a number, or is the answer 100% grounded in the retrieved chunks?
 * Answer Relevance: Did the AI actually answer the user's prompt, or did it go off-topic?
# Frontend
# Backend
# Data
The data coming from https://www.set.or.th/th/home by using STRUCTURE pdf files for the ONE Report data in 56-1 form. 
 - **FYI:** SET website provide the 56-1 form to donwload for free in each individuals compnay (stock symbol), this contain two Report style for one stokc symbol for example in the folder \...\experimental\data\BBL ==> Contain ONEREPORTBBLT.PDF and STRUCTUREBBLT.PDF which in this RAGs demonstration we use the STRUCTURE PDF files in order to utilize the stucture prerprocess make more convinient way to ingest the data 
 - **Preprocessing:** 
# Database
In the concept of RAGs as state that the all the data will be chunk and store in the database as an embeded this reuired us to utilize the vector database for this project. In this case we use.... as our vector database.
 - **Noted:**