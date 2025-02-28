import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API Key
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

def get_treatment(disease_name):
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")  # Use free-tier model
        prompt = f"Provide a concise treatment plan for {disease_name} in crops. Include: \n1. Prevention methods \n2. Cure methods \nFormat the response in bullet points."
        
        response = model.generate_content(prompt)
        return response.text  # Extract text response
    except Exception as e:
        print(f"Error fetching treatment: {e}")
        return "Unable to fetch treatment. Please try again later."
