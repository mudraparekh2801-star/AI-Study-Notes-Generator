try:
    from flask import Flask, request, jsonify, send_from_directory
except Exception:
    # Helpful message when Flask is not installed or cannot be resolved by the environment
    raise ImportError("Missing dependency 'Flask'. Install it with: pip install flask")
import os
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Get Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

# Create Gemini client
client = genai.Client(api_key=api_key)

# Create Flask application
app = Flask(__name__)


# Serve the main webpage
@app.route("/")
def home():
    return send_from_directory(".", "index.html")


# Serve CSS
@app.route("/style.css")
def style():
    return send_from_directory(".", "style.css")


# Serve JavaScript
@app.route("/script.js")

def script():
    return send_from_directory(".", "script.js")


# Generate AI study notes
@app.route("/generate", methods=["POST"])
def generate_notes():

    try:

        # Get data from frontend
        data = request.get_json()

        if not data or not data.get("topic"):
            return jsonify({
                "success": False,
                "message": "Please enter a topic."
            }), 400

        topic = data.get("topic").strip()

        # Create AI prompt
        prompt = f"""
You are an AI study assistant for college students.

Create simple, clear and easy-to-understand study notes on:

{topic}

Follow this structure:

1. Definition
2. Important concepts
3. Key points
4. Examples
5. Short summary

Keep the explanation concise and useful for exam preparation.
Use simple language and clear headings.
"""

        # Ask Gemini
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        # Check if AI returned a response
        if not response or not response.text:

            return jsonify({
                "success": False,
                "message": "The AI did not return any notes. Please try again."
            }), 500

        # Successful response
        return jsonify({
            "success": True,
            "message": response.text
        }), 200


    except Exception as error:

        print("Gemini API Error:", error)

        return jsonify({
            "success": False,
            "message": "The AI service is temporarily unavailable. Please try again in a moment."
        }), 503


if __name__ == "__main__":
    app.run(debug=True)