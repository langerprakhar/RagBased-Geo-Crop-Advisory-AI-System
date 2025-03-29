import os
from dotenv import load_dotenv
from typing import List, Tuple, Dict
from pathlib import Path

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")

# Document Processing
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

# Vector Database
from chromadb.config import Settings
from langchain_community.vectorstores import Chroma

# Gemini
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI

# Configuration
DATA_PATH = r"C:\Users\Prakhar\Desktop\Hackathon\Data"  # Update this path
CHROMA_PATH = "chroma_db"
EMBEDDING_MODEL = "models/embedding-001"
LLM_MODEL = "gemini-1.5-flash"

def get_embedding_function() -> GoogleGenerativeAIEmbeddings:
    """Initialize and return the Gemini embedding function"""
    return GoogleGenerativeAIEmbeddings(
        model=EMBEDDING_MODEL,
        google_api_key=GOOGLE_API_KEY
    )

def load_documents() -> List[Document]:
    """Load all PDF documents from the specified directory"""
    try:
        if not Path(DATA_PATH).exists():
            raise FileNotFoundError(f"Directory not found: {DATA_PATH}")
            
        document_loader = PyPDFDirectoryLoader(DATA_PATH)
        docs = document_loader.load()
        print(f"✓ Loaded {len(docs)} documents from {DATA_PATH}")
        return docs
    except Exception as e:
        print(f"✗ Error loading documents: {str(e)}")
        return []

def split_documents(documents: List[Document]) -> List[Document]:
    """Split documents into smaller chunks for processing"""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        length_function=len,
        is_separator_regex=False,
    )
    chunks = text_splitter.split_documents(documents)
    print(f"✓ Split into {len(chunks)} chunks")
    return chunks

def initialize_chroma() -> Chroma:
    """Initialize ChromaDB with persistent storage"""
    if not Path(CHROMA_PATH).exists():
        Path(CHROMA_PATH).mkdir(parents=True, exist_ok=True)
        print(f"Created Chroma directory at {CHROMA_PATH}")
    
    return Chroma(
        collection_name="research_docs",
        persist_directory=CHROMA_PATH,
        embedding_function=get_embedding_function()
    )

def add_to_chroma(chunks: List[Document]) -> None:
    """Add document chunks to ChromaDB"""
    try:
        db = initialize_chroma()
        existing_count = len(db.get()['ids'])
        db.add_documents(chunks)
        db.persist()
        new_count = len(db.get()['ids'])
        print(f"✓ Added {new_count - existing_count} new documents (Total: {new_count})")
    except Exception as e:
        print(f"✗ Failed to add documents: {str(e)}")
        raise

def query_chroma(query: str, k: int = 5) -> Tuple[str, List[str]]:
    """Query ChromaDB and return context and sources"""
    try:
        db = initialize_chroma()
        results = db.similarity_search_with_score(query, k=k)
        
        context = "\n\n---\n\n".join([doc.page_content for doc, _ in results])
        sources = [doc.metadata.get("source", "Unknown") for doc, _ in results]
        
        return context, sources
    except Exception as e:
        print(f"✗ Query failed: {str(e)}")
        raise

def generate_response(prompt: str) -> str:
    """Generate response using Gemini"""
    try:
        llm = ChatGoogleGenerativeAI(
            model=LLM_MODEL,
            temperature=0.7,
            google_api_key=GOOGLE_API_KEY
        )
        response = llm.invoke(prompt)
        return response.content
    except Exception as e:
        print(f"✗ Generation failed: {str(e)}")
        raise

def rag_pipeline(query: str) -> Dict:
    """End-to-end RAG pipeline"""
    print(f"\nProcessing query: '{query}'")
    context, sources = query_chroma(query)
    
    prompt = f"""Answer the question based only on the following context:
    
    {context}
    
    Question: {query}"""
    
    response = generate_response(prompt)
    
    return {
        "answer": response,
        "sources": sources,
        "context": context
    }

def main():
    """Main execution flow"""
    # Ingestion pipeline (run once)
    documents = load_documents()
    if documents:
        chunks = split_documents(documents)
        add_to_chroma(chunks)
    
    # Interactive query loop
    while True:
        try:
            query = input("\nEnter your question (or 'quit' to exit): ")
            if query.lower() in ('quit', 'exit'):
                break
                
            results = rag_pipeline(query)
            
            print("\n" + "="*50)
            print(f"Question: {query}")
            print("="*50)
            print(f"Answer: {results['answer']}")
            print("\nSources:")
            for source in results['sources']:
                print(f"- {source}")
            print("="*50)
            
        except KeyboardInterrupt:
            print("\nExiting...")
            break
        except Exception as e:
            print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()