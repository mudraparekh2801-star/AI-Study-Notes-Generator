import os
from dotenv import load_dotenv
from google import genai

try:
    from flask import Flask, request, jsonify, send_from_directory
except Exception:
    raise ImportError("Missing dependency 'Flask'. Install it with: pip install flask")

# Load environment variables
load_dotenv()

# Get Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

# Create Gemini client
client = genai.Client(api_key=api_key)

# Create Flask application
app = Flask(__name__)


# Disable caching during development so updated icons and SW reflect immediately
@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


# Serve main HTML page
@app.route("/")
def home():
    return send_from_directory(".", "index.html")


# Dynamic Catch-All Route for static assets (icons, manifest, JS, CSS, service-worker)
@app.route("/<path:filename>")
def serve_static(filename):
    if filename == "service-worker.js":
        return send_from_directory(".", filename, mimetype="application/javascript")
    return send_from_directory(".", filename)


# Generate AI study notes
@app.route("/generate", methods=["POST"])
def generate_notes():
    try:
        data = request.get_json()

        if not data or not data.get("topic"):
            return jsonify({
                "success": False,
                "message": "Please enter a topic."
            }), 400

        topic = data.get("topic").strip()

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

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        if not response or not response.text:
            return jsonify({
                "success": False,
                "message": "The AI did not return any notes. Please try again."
            }), 500

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


# Generate AI quiz
@app.route("/generate-quiz", methods=["POST"])
def generate_quiz():
    data = request.get_json()
    topic = data.get("topic", "").strip()

    if not topic:
        return jsonify({
            "message": "Please enter a topic first."
        }), 400

    prompt = f"""
You are an AI quiz generator for college students.

Create a short quiz on:

{topic}

Generate exactly 5 multiple-choice questions.

For each question provide:
1. The question
2. Four options labeled A, B, C, and D
3. The correct answer

Keep the questions clear, educational, and suitable for exam preparation.

Use this format:

Q1. Question
A. Option
B. Option
C. Option
D. Option
Answer: B

Q2. Question
...
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        return jsonify({
            "message": response.text
        })

    except Exception as error:
        print("Gemini Quiz Error:", error)
        return jsonify({
            "message": "The quiz service is temporarily unavailable. Please try again."
        }), 503


# Generate AI flashcards
@app.route("/generate-flashcards", methods=["POST"])
def generate_flashcards():
    data = request.get_json()
    topic = data.get("topic", "").strip()

    if not topic:
        return jsonify({
            "message": "Please enter a topic first."
        }), 400

    prompt = f"""
You are an AI study assistant for college students.

Create exactly 6 flashcards about:

{topic}

Each flashcard must contain:
- Question
- Answer

Keep the questions short and useful for exam revision.

Use EXACTLY this format:

CARD 1
Question: What is a computer network?
Answer: A computer network is a collection of interconnected devices that communicate and share resources.

CARD 2
Question: ...
Answer: ...

Do not add explanations outside the flashcards.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        return jsonify({
            "message": response.text
        })

    except Exception as error:
        print("Gemini Flashcard Error:", error)
        return jsonify({
            "message": "The flashcard service is temporarily unavailable. Please try again."
        }), 503


if __name__ == "__main__":
    app.run(debug=True, port=5000)