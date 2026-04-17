import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain

from langchain_core.prompts import ChatPromptTemplate, PromptTemplate

# Load API keys from the .env file
load_dotenv()

# ==========================================
# Setup FastAPI (CORS, etc.)
app = FastAPI(title="56-1 ONE Report RAG API")

# Allow Next.js frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define what the frontend will send us
class ChatRequest(BaseModel):
    question: str

# ==========================================
# 2. Initialize Database and LLM (Runs once when server starts)
print("Initializing AI Models and connecting to Pinecone...")

# Setup Embedding & Pinecone using k=10 for MMR retrieval (fetch_k=30) 
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
vector_store = PineconeVectorStore(index_name="56-1-report-rag", embedding=embeddings)
retriever = vector_store.as_retriever(search_type="mmr", search_kwargs={"k": 10, "fetch_k": 30})

llm = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", temperature=0)

# Setup the RAG Chain
system_prompt = (
    "You are an expert Thai Financial Analyst. Use the following pieces of retrieved financial context to answer the question. "
    "Make sure to clearly identify which data belongs to which company based on the document source or context. "
    "If the context does not contain the answer, explicitly state that the data is not available. "
    "\n\nContext: {context}"
)
prompt = ChatPromptTemplate.from_messages([("system", system_prompt), ("human", "{input}")])
document_prompt = PromptTemplate.from_template("ชื่อไฟล์เอกสาร (Source): {source}\nเนื้อหา: {page_content}")

question_answer_chain = create_stuff_documents_chain(llm, prompt, document_prompt=document_prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

# ==========================================
# 3. API ENDPOINTS
@app.get("/")
def read_root():
    return {"message": "RAG Backend is running"}

@app.post("/chat")
def chat_with_rag(request: ChatRequest):
    try:
        # Run the question through our proven LangChain pipeline
        response = rag_chain.invoke({"input": request.question})
        
        # Extract the answer and the sources used
        answer = response["answer"]
        sources = [doc.metadata.get("source", "Unknown") for doc in response["context"]]
        
        return {
            "answer": answer,
            "sources": list(set(sources)) # Remove duplicates
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))