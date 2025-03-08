from twilio.rest import Client
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Twilio Credentials (Replace with actual credentials)
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

def initiate_sos_call():
    """Trigger an emergency call via Twilio"""
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    emergency_contacts = [ "+917666169832"]  # Add phone numbers

    for number in emergency_contacts:
        twiml_response = '<Response><Say voice="alice">This is an emergency alert. The driver is drowsy. Please check immediately.</Say></Response>'
        call = client.calls.create(
            twiml=twiml_response,
            to=number,
            from_=TWILIO_PHONE_NUMBER
        )
        print(f"Call initiated to {number}, Call SID: {call.sid}")
