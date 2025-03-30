import asyncio
import os
from dotenv import load_dotenv
from typing import List, Tuple, Dict
from pathlib import Path
import googlemaps
import numpy as np
import requests
from flask import Flask, request
from googletrans import Translator
from flask_supabase import Supabase

from googletrans import Translator

async def translate_text(input_text, src_language, dest_language):
    # Initialize the Translator
    translator = Translator()
    
    # Perform the translation
    result = await translator.translate(input_text, src=src_language, dest=dest_language)
    
    # Return the translated text
    return result.text

import ee
ee.Authenticate()  # This will prompt you to authenticate via browser
ee.Initialize(project='hackathon-455211')    # Initialize the library

app = Flask(__name__)

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")

app.config['SUPABASE_URL'] = 'https://oqxecmihuvzypvyuxcrz.supabase.co'
app.config['SUPABASE_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xeGVjbWlodXZ6eXB2eXV4Y3J6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzI2NDkwNCwiZXhwIjoyMDU4ODQwOTA0fQ.hWDaxuJQXcyvd3OqY4KzRgBftjecWPNYQrpkeyEqaUs'
supabase_extension = Supabase(app)

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
db = initialize_chroma()
def add_to_chroma(chunks: List[Document]) -> None:
    """Add document chunks to ChromaDB"""
    try:

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
    
    prompt = f"""
    I am a smallhold farmer from India. You are a mature and responsible advisor to me.
    I want you to give me practically and actionable advice in an SMS format (max. 50 words, preferably less).
    It should be based on ground truth passed as the following context:
    
    {context}
    
    Furthermore, I want you to take into high importance the NDVI values extracted from live satellite data,
    as well as live weather forecasting data.    
    Very crucially, also incorporate my own farming details from my account that are also passed to answer my question.
    
    For example, if the NDVI value is low, recommend using some Urea/NPK to add based on land details and documents in the context.
    Or If the weather forecast says that it is rainy today, you may notify the farmer and recommend to use less water.
        
    Question: {query}"""
    
    response = generate_response(prompt)
    
    return {
        "answer": response,
        "sources": sources,
        "context": context
    }

documents = load_documents()
if documents:
    chunks = split_documents(documents)
    add_to_chroma(chunks)

@app.get("/send_sms")
def prompt():
    """Main execution flow"""
    # Ingestion pipeline (run once)
    prompt=request.args.get('prompt')
    farmer_id=request.args.get('uid')
    
    # Interactive query loop
            # query = input("\nEnter your question (or 'quit' to exit): ")
    query=prompt
    res=(supabase_extension.client
    .from_('user')
    .select('*')
    .eq('uid', farmer_id)
    .execute()).data
    print("1111111")
    print(type(res))
    print(res)
    res=res[0]
    query="NDVI & Weather Info: "+ get_ndvi()+ "\n\n" + "Farmer Details: " + " ".join(res) + "\n\n" + query    
    print(query)            
    results = rag_pipeline(query)
    
    print("\n" + "="*50)
    print(f"Question: {query}")
    print("="*50)
    print(f"Answer: {results['answer']}")
    str=""
    print("\nSources:")
    for source in results['sources']:
        print(f"- {source}")
    print("="*50)
    
    # Perform the translation
    english_response = results['answer']
    target_language = supabase_extension.client.from_('user').select('language').execute()

    if target_language == 'hindi':
        target_language = 'hi'
    elif target_language == 'malayalam':
        target_language = 'ml'
    elif target_language == 'telugu':
        target_language = 'te'
    elif target_language == 'marathi':
        target_language = 'mr'
    else:
        target_language = 'en'

    # Run async function synchronously
    desired_response = asyncio.run(translate_text(english_response, 'en', target_language)) #CHANGE TO Target_language

    return desired_response  # This will return the translated text as a string

    '''
    english_response = results['answer']
    target_language = supabase_extension.client.from_('user').select('language').execute()
    if(target_language=='hindi'):
        target_language = 'hi'
    elif(target_language=='malayalam'):
        target_language = 'ml'
    elif(target_language=='telugu'):
        target_language = 'te'
    else:
        target_language = 'en'
    desired_response = translate_text(english_response, 'en', 'hi') #If hindi, add logic to determine which language
    return f"{desired_response}"'
    '''
    


@app.get("/getCropRecom")
def crop_recom():
    farmer_id=request.args.get('uid', type=str, default=0)
    #get n p k ph from db for farmer_id
    #get weather data
    response = supabase_extension.client.from_('user').select('*').execute()
    print(response)
    return response
    # with open('./Crop-



def getWeather():
    latitude = request.args.get('latitude', type=float, default=0)
    longitude = request.args.get('longitude', type=float, default=0)

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": "temperature_2m",
        "current": ["temperature_2m", "relative_humidity_2m", "rain"]
    }
    qStr = "https://api.open-meteo.com/v1/forecast?latitude="+str(latitude)+"&longitude="+str(
        longitude)+"&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m,rain"

    response = requests.get(qStr)
    currdata = response.json()

    current_temperature = currdata['current']['temperature_2m']
    current_humidity = currdata['current']['relative_humidity_2m']
    rainfall = currdata['current']['rain']
    hourly_temperatures = np.average(currdata['hourly']['temperature_2m'])

    qStr = "https://api.open-meteo.com/v1/forecast?latitude="+str(latitude)+"&longitude="+str(
        longitude)+"&hourly=temperature_2m%2Cprecipitation_probability%2Crain%2Cprecipitation%2Cevapotranspiration%2Csoil_temperature_0cm%2Csoil_moisture_0_to_1cm%2Csoil_moisture_1_to_3cm%2Csoil_temperature_6cm&timezone=Asia%2FSingapore"

    response = requests.get(qStr)
    forecastdata = response.json()

    hourly_data = forecastdata['hourly']

    # temperature_2m = hourly_data.get('temperature_2m', [])
    precipitation_probability = hourly_data.get(
        'precipitation_probability', [])
    # rain = hourly_data.get('rain', [])
    # precipitation = hourly_data.get('precipitation', [])
    # evapotranspiration = hourly_data.get('evapotranspiration', [])
    soil_temperature_0cm = np.average(
        hourly_data.get('soil_temperature_0cm', []))
    soil_moisture_0_to_1cm = np.average(
        hourly_data.get('soil_moisture_0_to_1cm', []))
    soil_moisture_1_to_3cm = np.average(
        hourly_data.get('soil_moisture_1_to_3cm', []))
    soil_temperature_6cm = np.average(
        hourly_data.get('soil_temperature_6cm', []))

    return {
        # 'temperature_2m': current_temperature,
        # 'precipitation_probability': curre,
        # 'rain': rain,
        # 'precipitation': precipitation,
        # 'evapotranspiration': evapotranspiration,
        'soil_temperature_0cm': soil_temperature_0cm,
        'soil_moisture_0_to_1cm': soil_moisture_0_to_1cm,
        'soil_moisture_1_to_3cm': soil_moisture_1_to_3cm,
        'soil_temperature_6cm': soil_temperature_6cm,
        'current_temperature': current_temperature,
        'current_humidity': current_humidity,
        'rainfall': rainfall,
        'hourly_temperatures': hourly_temperatures
    }



# @app.get("/getCropRecom")
# def crop_recom():
#     farmer_id=request.args.get('id', type=float, default=0)
#     #get n p k ph from db for farmer_id
#     #get weather data
#     with open('model.pkl', 'rb') as f:
#         clf2 = pickle.load(f)
#         clf2.predict()


# ----------------------------------------------------------------------------------------

def get_ndvi():
    
# Replace with your actual Google Maps API key
    GOOGLE_MAPS_API_KEY = "AIzaSyBTURCCorfToqGPM2D4GocQKbfw5508DHc"

    gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)

# Function to get current location's latitude and longitude
    def get_current_location():
        geocode_result = gmaps.geolocate()  # Get device location
        lat, lon = geocode_result["location"]["lat"], geocode_result["location"]["lng"]
        return lat, lon

    params={
        'latitude':get_current_location()[0],
        'longitude':get_current_location()[1]
    }
    R=getWeather()
    
    # Get user's latitude and longitude
    latitude, longitude = get_current_location()
    # Function to create an Earth Engine geometry from lat/lon

    def get_location_geometry(lat, lon):
        return ee.Geometry.Point([lon, lat])


    location_geom = get_location_geometry(latitude, longitude)

    filtered = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") \
        .filterBounds(location_geom) \
        .filterDate("2023-01-01", "2023-12-31")

    # NDVI Calculation
    def addNDVI(image):
        ndvi = image.normalizedDifference(['B8', 'B4']).rename('ndvi')
        return image.addBands(ndvi)


    withNdvi = filtered.map(addNDVI)
    composite = withNdvi.median()

    ndvi_value = composite.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=location_geom.buffer(500),
        scale=10,
        bestEffort=True
    ).get('ndvi').getInfo()


    return str(({'latitude':latitude,"longitude":longitude,"ndvi_value":ndvi_value},R))

if __name__ == "__main__":
    app.run(debug=True)