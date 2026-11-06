console.log("StudyMate AI is running...");

const topicInput = document.querySelector("#topicInput");
const generateBtn = document.querySelector("#generateBtn");
const notesOutput = document.querySelector("#notesoutput");
const quizBtn = document.querySelector("#quizBtn");
const quizOutput = document.querySelector("#quizOutput");
const flashcardBtn = document.querySelector("#flashcardBtn");
const flashcardsOutput = document.querySelector("#flashcardsOutput");
const saveNotesBtn = document.querySelector("#saveNotesBtn");
const savedNotesOutput = document.querySelector("#savedNotesOutput");
generateBtn.addEventListener("click", generateNotes);
quizBtn.addEventListener("click", generateQuiz);
flashcardBtn.addEventListener("click", generateFlashcards);
saveNotesBtn.addEventListener("click", saveNotes);
topicInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        generateNotes();
    }
});

async function generateNotes() {

    const topic = topicInput.value.trim();

    if (topic === "") {
        notesOutput.innerHTML = `
            <p>Please enter a topic first 📚</p>
        `;
        return;
    }

    // Loading state
    generateBtn.disabled = true;
    generateBtn.textContent = "✨ Generating...";

    notesOutput.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>StudyMate AI is preparing your notes...</p>
        </div>
    `;

    try {

        const response = await fetch("/generate", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                topic: topic
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong.");
        }

        notesOutput.innerHTML = formatNotes(data.message);

    } catch (error) {

        console.error("Generate Notes Error:", error);

        notesOutput.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Something went wrong</h3>
                <p>
                    We couldn't generate your notes right now.
                    Please try again in a moment.
                </p>
            </div>
        `;

    } finally {

        generateBtn.disabled = false;
        generateBtn.textContent = "✨ Generate Notes";
    }
}


/* =========================
   FORMAT AI RESPONSE
========================= */

function formatNotes(text) {

    let formatted = text;

    // Escape HTML first
    formatted = formatted
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");


    // Code blocks
    formatted = formatted.replace(
        /```([\s\S]*?)```/g,
        "<pre><code>$1</code></pre>"
    );


    // Headings
    formatted = formatted.replace(
        /^### (.*)$/gm,
        "<h3>$1</h3>"
    );

    formatted = formatted.replace(
        /^## (.*)$/gm,
        "<h2>$1</h2>"
    );

    formatted = formatted.replace(
        /^# (.*)$/gm,
        "<h1>$1</h1>"
    );


    // Bold
    formatted = formatted.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );


    // Bullet points
    formatted = formatted.replace(
        /^\* (.*)$/gm,
        "<li>$1</li>"
    );

    formatted = formatted.replace(
        /^- (.*)$/gm,
        "<li>$1</li>"
    );


    // Numbered lists
    formatted = formatted.replace(
        /^\d+\.\s+(.*)$/gm,
        "<li>$1</li>"
    );


    // Wrap consecutive list items
    formatted = formatted.replace(
        /(<li>.*<\/li>\n?)+/g,
        "<ul>$&</ul>"
    );


    // Horizontal lines
    formatted = formatted.replace(
        /^---$/gm,
        "<hr>"
    );


    // Line breaks
    formatted = formatted.replace(
        /\n\n/g,
        "</p><p>"
    );

    formatted = `<p>${formatted}</p>`;


    return formatted;
}
async function generateQuiz() {

    const topic = topicInput.value.trim();

    if (topic === "") {

        quizOutput.innerHTML = `
            <p>Please enter a topic first 📚</p>
        `;

        topicInput.focus();

        return;
    }

    quizBtn.disabled = true;
    quizBtn.textContent = "🧠 Creating...";

    quizOutput.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>StudyMate AI is creating your quiz...</p>
        </div>
    `;

    try {

        const response = await fetch("/generate-quiz", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                topic: topic
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Quiz generation failed.");
        }

        quizOutput.innerHTML = formatQuiz(data.message);

    } catch (error) {

        console.error("Quiz Error:", error);

        quizOutput.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Couldn't create the quiz</h3>
                <p>
                    Please try again in a moment.
                </p>
            </div>
        `;

    } finally {

        quizBtn.disabled = false;
        quizBtn.textContent = "Create Quiz";
    }
}


function formatQuiz(text) {

    let formatted = text;

    formatted = formatted
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    formatted = formatted.replace(
        /Q(\d+)\.\s*(.*)/g,
        '<div class="quiz-question"><h3>Q$1. $2</h3>'
    );

    formatted = formatted.replace(
        /^A\.\s*(.*)$/gm,
        '<div class="quiz-option"><strong>A.</strong> $1</div>'
    );

    formatted = formatted.replace(
        /^B\.\s*(.*)$/gm,
        '<div class="quiz-option"><strong>B.</strong> $1</div>'
    );

    formatted = formatted.replace(
        /^C\.\s*(.*)$/gm,
        '<div class="quiz-option"><strong>C.</strong> $1</div>'
    );

    formatted = formatted.replace(
        /^D\.\s*(.*)$/gm,
        '<div class="quiz-option"><strong>D.</strong> $1</div>'
    );

    formatted = formatted.replace(
        /^Answer:\s*(.*)$/gm,
        '<div class="quiz-answer"><strong>Answer: $1</strong></div></div>'
    );

    return formatted;
}
async function generateFlashcards() {

    const topic = topicInput.value.trim();

    if (topic === "") {

        flashcardsOutput.innerHTML = `
            <p>Please enter a topic first 📚</p>
        `;

        topicInput.focus();

        return;
    }

    flashcardBtn.disabled = true;
    flashcardBtn.textContent = "🃏 Creating...";

    flashcardsOutput.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>StudyMate AI is creating your flashcards...</p>
        </div>
    `;

    try {

        const response = await fetch("/generate-flashcards", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                topic: topic
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Flashcard generation failed."
            );
        }

        flashcardsOutput.innerHTML =
            formatFlashcards(data.message);

        setupFlashcards();

    } catch (error) {

        console.error("Flashcard Error:", error);

        flashcardsOutput.innerHTML = `
            <div class="error-message">

                <h3>⚠️ Couldn't create flashcards</h3>

                <p>
                    Please try again in a moment.
                </p>

            </div>
        `;

    } finally {

        flashcardBtn.disabled = false;
        flashcardBtn.textContent = "Create Flashcards";
    }
}


function formatFlashcards(text) {

    const cards = [];

    const cardBlocks = text.split(/CARD\s+\d+/i);

    cardBlocks.forEach(block => {

        const questionMatch =
            block.match(/Question:\s*(.*)/i);

        const answerMatch =
            block.match(/Answer:\s*([\s\S]*)/i);

        if (questionMatch && answerMatch) {

            const question =
                questionMatch[1].trim();

            const answer =
                answerMatch[1].trim();

            cards.push({
                question,
                answer
            });
        }
    });


    if (cards.length === 0) {

        return `
            <div class="error-message">
                <h3>⚠️ Couldn't format the flashcards</h3>
                <p>Please try generating them again.</p>
            </div>
        `;
    }


    return cards.map((card, index) => {

        return `
            <div class="flashcard">

                <div class="flashcard-inner">

                    <div class="flashcard-front">

                        <div class="flashcard-label">
                            QUESTION ${index + 1}
                        </div>

                        <h3>
                            ${card.question}
                        </h3>

                        <div class="flashcard-hint">
                            Click to reveal answer
                        </div>

                    </div>


                    <div class="flashcard-back">

                        <div class="flashcard-label">
                            ANSWER
                        </div>

                        <p>
                            ${card.answer}
                        </p>

                    </div>

                </div>

            </div>
        `;

    }).join("");
}


function setupFlashcards() {

    const cards =
        document.querySelectorAll(".flashcard");

    cards.forEach(card => {

        card.addEventListener("click", () => {

            card.classList.toggle("flipped");

        });

    });
}
/* =========================
   SAVED NOTES
========================= */

function saveNotes() {

    const topic = topicInput.value.trim();

    const notes = notesOutput.innerHTML;

    if (
        topic === "" ||
        !notes ||
        notes.includes("Your notes will appear here")
    ) {
        alert("Generate some notes before saving them 📚");
        return;
    }

    const savedNotes =
        JSON.parse(localStorage.getItem("studyMateNotes")) || [];

    const newNote = {

        id: Date.now(),

        topic: topic,

        content: notes,

        date: new Date().toLocaleString()

    };

    savedNotes.unshift(newNote);

    localStorage.setItem(
        "studyMateNotes",
        JSON.stringify(savedNotes)
    );

    saveNotesBtn.textContent = "✅ Notes Saved!";

    setTimeout(() => {

        saveNotesBtn.textContent = "🔖 Save Notes";

    }, 2000);

    displaySavedNotes();
}


function displaySavedNotes() {

    const savedNotes =
        JSON.parse(localStorage.getItem("studyMateNotes")) || [];

    if (savedNotes.length === 0) {

        savedNotesOutput.innerHTML = `
            <p>
                No saved notes yet. Generate some notes
                and save them here 📚
            </p>
        `;

        return;
    }

    savedNotesOutput.innerHTML =
        savedNotes.map(note => {

            return `
                <div class="saved-note">

                    <div class="saved-note-header">

                        <h3>
                            📚 ${note.topic}
                        </h3>

                        <button
                            class="delete-note"
                            onclick="deleteNote(${note.id})">
                            Delete
                        </button>

                    </div>

                    <div class="saved-date">
                        Saved: ${note.date}
                    </div>

                    <div>
                        ${note.content}
                    </div>

                </div>
            `;

        }).join("");
}


window.deleteNote = function(id) {
    const savedNotes = JSON.parse(localStorage.getItem("studyMateNotes")) || [];
    const updatedNotes = savedNotes.filter(note => note.id !== id);
    localStorage.setItem("studyMateNotes", JSON.stringify(updatedNotes));
    displaySavedNotes();
};

/* Load saved notes when the app starts */

displaySavedNotes();
/* =========================
   PWA SERVICE WORKER
========================= */

/* =========================
   PWA SERVICE WORKER
========================= */

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js", { scope: "/" })
            .then(reg => {
                console.log("StudyMate AI service worker registered successfully:", reg);
            })
            .catch(error => {
                console.error("Service worker registration failed:", error);
            });
    });
}