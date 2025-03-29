import ee
import folium
import geemap.foliumap as geemap
import googlemaps
import streamlit as st

st.title("Sentinel-2 NDVI Visualization")

# Replace with your actual Google Maps API key
GOOGLE_MAPS_API_KEY = "AIzaSyBTURCCorfToqGPM2D4GocQKbfw5508DHc"

# Initialize Google Maps client
gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)

# Function to get current location's latitude and longitude
def get_current_location():
    geocode_result = gmaps.geolocate()  # Get device location
    lat, lon = geocode_result["location"]["lat"], geocode_result["location"]["lng"]
    return lat, lon

# Get user's latitude and longitude
latitude, longitude = get_current_location()
st.write(f"Current Location: **Latitude = {latitude}, Longitude = {longitude}**")

# Initialize Earth Engine
try:
    ee.Initialize()
except Exception as e:
    ee.Authenticate()
    ee.Initialize(project="hackathon-455211")

# Function to create an Earth Engine geometry from lat/lon
def get_location_geometry(lat, lon):
    return ee.Geometry.Point([lon, lat])

location_geom = get_location_geometry(latitude, longitude)

# Filter Sentinel-2 imagery based on location
filtered = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") \
    .filterBounds(location_geom) \
    .filterDate("2023-01-01", "2023-12-31")

# Compute median composite and clip to 5km buffer around the location
newmerge_median = filtered.median()
newmerge_clip = newmerge_median.clip(location_geom.buffer(5000))

# Visualization parameters for RGB
rgbVis = {'bands': ['B4', 'B3', 'B2'], 'min': 0, 'max': 3000, 'gamma': 1.4}

# NDVI Calculation
def addNDVI(image):
    ndvi = image.normalizedDifference(['B8', 'B4']).rename('ndvi')
    return image.addBands(ndvi)

withNdvi = filtered.map(addNDVI)
composite = withNdvi.median()
ndviComposite = composite.select('ndvi').clip(location_geom.buffer(5000))

# NDVI visualization parameters
ndviVis = {'min': -1, 'max': 1, 'palette': [
    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',
    '74A901', '66A000', '529400', '3E8601', '207401', '056201',
    '004C00', '023B01', '012E01', '011D01', '011301'
]}

# Compute NDVI value for the location
ndvi_value = composite.reduceRegion(
    reducer=ee.Reducer.mean(),
    geometry=location_geom.buffer(500),
    scale=10,
    bestEffort=True
).get('ndvi').getInfo()

st.write(f"NDVI Value at ({latitude}, {longitude}): **{ndvi_value}**")

# Create an interactive map
Map = geemap.Map(center=[latitude, longitude], zoom=10)
Map.addLayer(newmerge_clip, rgbVis, "RGB Composite")
Map.addLayer(ndviComposite, ndviVis, "NDVI")
Map.add_child(folium.LayerControl())

# Display map in Streamlit
Map.to_streamlit(height=600)
