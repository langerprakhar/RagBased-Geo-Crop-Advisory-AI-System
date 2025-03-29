from flask import Flask, render_template, request
from tenacity import retry, stop_after_attempt, wait_exponential
import requests_cache
import requests

app = Flask(__name__)


@app.route("/")
def get_ip():
    print("HELLO")
    visitor_ip = request.remote_addr
    return f"Your IP address is: {visitor_ip}"


@app.get('/getWeatherData')
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
    hourly_temperatures = currdata['hourly']['temperature_2m']

    qStr = "https://api.open-meteo.com/v1/forecast?latitude="+str(latitude)+"&longitude="+str(longitude)+"&hourly=temperature_2m%2Cprecipitation_probability%2Crain%2Cprecipitation%2Cevapotranspiration%2Csoil_temperature_0cm%2Csoil_moisture_0_to_1cm%2Csoil_moisture_1_to_3cm%2Csoil_temperature_6cm&timezone=Asia%2FSingapore"

    response = requests.get(qStr)
    forecastdata = response.json()

    hourly_data = forecastdata['hourly']

    temperature_2m = hourly_data.get('temperature_2m', [])
    precipitation_probability = hourly_data.get(
        'precipitation_probability', [])
    rain = hourly_data.get('rain', [])
    precipitation = hourly_data.get('precipitation', [])
    evapotranspiration = hourly_data.get('evapotranspiration', [])
    soil_temperature_0cm = hourly_data.get('soil_temperature_0cm', [])
    soil_moisture_0_to_1cm = hourly_data.get('soil_moisture_0_to_1cm', [])
    soil_moisture_1_to_3cm = hourly_data.get('soil_moisture_1_to_3cm', [])
    soil_temperature_6cm = hourly_data.get('soil_temperature_6cm', [])

    return {
        'temperature_2m': temperature_2m,
        'precipitation_probability': precipitation_probability,
        'rain': rain,
        'precipitation': precipitation,
        'evapotranspiration': evapotranspiration,
        'soil_temperature_0cm': soil_temperature_0cm,
        'soil_moisture_0_to_1cm': soil_moisture_0_to_1cm,
        'soil_moisture_1_to_3cm': soil_moisture_1_to_3cm,
        'soil_temperature_6cm': soil_temperature_6cm,
        'current_temperature': current_temperature,
        'current_humidity': current_humidity,
        'rainfall': rainfall,
        'hourly_temperatures': hourly_temperatures
    }


if __name__ == "__main__":
    app.run(debug=True)
