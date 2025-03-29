from vonage import Auth, Vonage
from vonage_sms import SmsMessage, SmsResponse

auth = Auth(api_key="", api_secret="")
client = Vonage(auth)

message = SmsMessage(
    to="919619981506",
    from_="AgriJyothi",
    text="Your insights for today: "
)

response: SmsResponse = client.sms.send(message)

if response.model_dump(exclude_unset=True)["messages"][0]["status"] == "0":
    print("Message sent successfully.")
else:
    print(f"Message failed with error: {response.model_dump(exclude_unset=True)['messages'][0]['error-text']}")
