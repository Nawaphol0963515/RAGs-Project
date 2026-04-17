***
# RAGs-Chatbot (RAGs-Project)

This repository explores and implements the Retrieval-Augmented Generation (RAG) concept, integrating it into a production-level web-based chatbot application. 

In this repository, the owner has decided to focus on the first phase of implementation due to time constraints and the demands of the owner's ongoing Master's degree research. 

## Description
The project aims to demonstrate the practical usage of RAG integrated with Large Language Models (LLMs) in a production-like environment, utilizing the Next.js framework for a web-based chatbot UI. The work completely demonstrates the core concept and pipeline of RAG functioning with an LLM. However, further adjustments—such as advanced parameter tuning and automated evaluation—are needed to upgrade the retrieval performance. The first phase currently relies on manual, rough evaluation of retrieval accuracy. The owner will continue to adjust and develop the system as time permits.

## Steps to Use This Application
To run this project locally, you will need to clone the repository and use Docker to spin up both the frontend and backend simultaneously.

**1. Clone the repository**
```bash
git clone https://github.com/Nawaphol0963515/RAGs-Project.git
cd RAGs-Project
```

**2. Set up your Environment Variables**
You must provide your own API keys for the AI and the Database. Navigate into the `backend` folder, create a new file named exactly `.env`, and add your keys:
```bash
# Inside backend/.env
GOOGLE_API_KEY=your_gemini_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
```

**3. Start the Application via Docker**
Ensure you have the Docker Desktop engine open and running on your computer. Then, from the **root** folder of the project, run the master build command:
```bash
docker-compose up --build
```

**4. Try the App!**
Once the terminal finishes building and says the containers are running, open your web browser and navigate to:
👉 **http://localhost:3000**
*(You can now start chatting with the AI about Thai financial reports!)*

---

## About the Evaluation Part

### Evaluation Strategy
**Phase 1: Initial Implementation & Manual Verification**
Due to project objectives and timeline constraints—managed alongside my ongoing Master's research—implementing fully automated evaluation frameworks (such as Ragas or TruLens) was outside the scope of this initial release. 

The primary goal of this first phase is to build a functional demonstration to study the practical integration of a RAG system into a chatbot UI. To ensure response quality within these constraints, I engineered a **Golden Dataset** consisting of 15 edge-case financial queries spanning 5 different institutions. 

This dataset is used to manually verify two key metrics:
1. **Retrieval Precision**
2. **Generation Faithfulness**

**Future Work: Automated Pipeline & Expanded Data Integration**
Time permitting, a subsequent phase will focus on developing a comprehensive, fully automated testing pipeline. My objective for this future iteration is to expand the system to process more Thai-language financial documents, specifically targeting the Stock Exchange of Thailand (SET) 56-1 annual reports. Implementing this will require additional time to establish reliable data sources and configure the expanded infrastructure.

**FYI: How RAG actually needs to be evaluated in Production**
In a real enterprise, you cannot just test 5 questions yourself and deploy. We need to prove mathematically that our AI and retrieved information are not hallucinating. We can use automated evaluation frameworks (like Ragas or TruLens) to score RAG systems on two main categories:

1. **Retrieval Metrics (Is the Database working?):** * *Context Precision:* Did the database fetch the exact right chunk, or did it pull in useless junk?
   * *Context Recall:* Did the database miss any important chunks?
2. **Generation Metrics (Is the LLM working?):**
   * *Faithfulness:* Did the AI make up a number, or is the answer 100% grounded in the retrieved chunks?
   * *Answer Relevance:* Did the AI actually answer the user's prompt, or did it go off-topic?

---

## Frontend
* **Tech Stack:** Next.js (App Router), React, TypeScript, and Tailwind CSS.
* **Architecture & Style:** The frontend is a modern, responsive web application designed with a professional "Dark Mode" financial aesthetic (`slate-950`). It acts purely as the presentation layer. It manages user chat state and automatically communicates with the Python backend via REST API (`POST /chat`), displaying the AI's answers and citing the source documents directly in the UI.

## Backend
* **Tech Stack:** FastAPI (Python 3.11), Uvicorn, LangChain, and Google Gemini (1.5 Flash).
* **Architecture & Style:** The backend acts as the "Brain" of the application. It receives user questions from the Next.js frontend, connects to the vector database to retrieve financial context, and constructs a strict prompt forcing the LLM (Gemini) to answer *only* using the retrieved documents. It utilizes LangChain's retrieval chain logic to manage the flow of data securely and efficiently.

## Data
The data comes from the Stock Exchange of Thailand ([https://www.set.or.th/th/home](https://www.set.or.th/th/home)) by utilizing **STRUCTURE PDF** files for the "56-1 ONE Report" data. 
* **FYI:** The SET website provides the 56-1 form to download for free for each individual company (stock symbol). This typically contains two report styles. For example, in the folder `\experimental\data\BBL`, there is an `ONEREPORTBBLT.PDF` and a `STRUCTUREBBLT.PDF`. In this RAG demonstration, we exclusively use the **STRUCTURE PDF** files. Utilizing this structured format makes the preprocessing and data ingestion significantly more convenient and accurate.
* **Preprocessing:** The PDFs are loaded using LangChain's `PyPDFLoader`. To ensure the AI reads perfectly sized context windows without cutting sentences in half, the text is processed using a `RecursiveCharacterTextSplitter`. Based on mathematical POC testing, the optimal parameters were set to `chunk_size = 1000` and `chunk_overlap = 200`.

## Database 
In the concept of RAG, all data must be chunked and stored as mathematical embeddings, which requires us to utilize a Vector Database. For this project, we use **Pinecone** as our cloud vector database.
* **Database Configurations:**
  * **Vector Type:** Dense Vectors
  * **Similarity Metric:** Cosine Similarity
  * **Dimensions:** 384
  * **Retrieval Method:** Maximal Marginal Relevance (MMR) with `fetch_k=30` and `k=10`.
* **Noted:** The dimension size is strictly set to **384** because we use the `paraphrase-multilingual-MiniLM-L12-v2` embedding model. This specific model is highly optimized for understanding Thai language nuances and outputs exactly 384 dimensions. Using MMR for retrieval ensures that the top 10 chunks sent to the AI are not only highly relevant but also diverse, preventing the LLM from reading duplicate information.
***