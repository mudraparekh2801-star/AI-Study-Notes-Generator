# 📚 AI Study Notes Generator

An AI-powered web application that generates simple, concise, and exam-friendly study notes from any topic entered by the user.

## 🎯 Project Objective

The objective of this project is to create a simple AI-based study assistant that helps students quickly understand and revise academic topics.

The user enters a topic, and the application uses the Gemini API to generate structured study notes.

## ✨ Features

- Generate study notes using AI
- Simple and responsive user interface
- Exam-friendly explanations
- Structured headings and bullet points
- Tables for comparisons
- Copy generated notes
- Download notes as a text file
- Loading animation while generating notes
- Error handling for API failures
- Responsive design for mobile and desktop

## 🛠️ Technologies Used

- HTML
- CSS
- JavaScript
- Python
- Flask
- Google Gemini API

## ⚙️ How It Works

The application follows this process:

User enters a topic
        ↓
JavaScript sends the topic to Flask
        ↓
Flask creates an AI prompt
        ↓
Gemini API generates the study notes
        ↓
Flask sends the response back
        ↓
JavaScript formats the notes
        ↓
Notes are displayed on the webpage

## 📂 Project Structure

```text
AI-STUDY-NOTES-GENERATOR/
│
├── app.py
├── index.html
├── style.css
├── script.js
├── test_ai.py
├── requirements.txt
├── .gitignore
└── README.md