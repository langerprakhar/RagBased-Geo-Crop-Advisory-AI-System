import requests
import json

url = "http://localhost:11434/api/generate"
data = {
    "model": "llama3.2",
    "prompt": "Tell me a fun fact about space."
}

response = requests.post(url, json=data, stream=True)
full_response = ""

for line in response.iter_lines():
    if line:
        try:
            json_line = json.loads(line.decode('utf-8'))
            # Append the response fragment
            full_response += json_line.get("response", "")
            # Optionally check if done and break early
            if json_line.get("done"):
                break
        except json.decoder.JSONDecodeError:
            print("Error decoding line:", line)
            
print("Full response:", full_response)
