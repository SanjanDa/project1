let questions = [];
let currentQuestion = 0;
let score = 0;
let incorrectQuestions = [];
let timer;

document.addEventListener("DOMContentLoaded", function () {
    loadSubjects();
});

function loadSubjects() {
    fetch('/exam/subjects')
        .then(response => response.json())
        .then(data => {
            const subjectSelect = document.getElementById("subject");
            data.subjects.forEach(subject => {
                let option = document.createElement("option");
                option.value = subject;
                option.textContent = subject;
                subjectSelect.appendChild(option);
            });
        });
}

function updateTopics() {
    const subject = document.getElementById("subject").value;
    fetch(`/exam/topics?subject=${subject}`)
        .then(response => response.json())
        .then(data => {
            const topicSelect = document.getElementById("topic");
            topicSelect.innerHTML = '<option value="">--Select--</option>';
            data.topics.forEach(topic => {
                let option = document.createElement("option");
                option.value = topic;
                option.textContent = topic;
                topicSelect.appendChild(option);
            });
        });
}

function updateSubtopics() {
    const topic = document.getElementById("topic").value;
    fetch(`/exam/subtopics?topic=${topic}`)
        .then(response => response.json())
        .then(data => {
            const subtopicSelect = document.getElementById("subtopic");
            subtopicSelect.innerHTML = '<option value="">--Select--</option>';
            data.subtopics.forEach(subtopic => {
                let option = document.createElement("option");
                option.value = subtopic;
                option.textContent = subtopic;
                subtopicSelect.appendChild(option);
            });
        });
}

function startExam() {
    const subject = document.getElementById("subject").value;
    const topic = document.getElementById("topic").value;
    const subtopic = document.getElementById("subtopic").value;
    const numQuestions = document.getElementById("num-questions").value;

    if (!subject || !topic || !subtopic || !numQuestions) {
        alert("Please fill in all the details.");
        return;
    }

    fetch(`/exam/questions?subject=${subject}&topic=${topic}&subtopic=${subtopic}&numQuestions=${numQuestions}`)
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            displayQuestion();
            startTimer();
            document.getElementById("exam-portal").classList.remove("hidden");
        });
}

function displayQuestion() {
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = `
        <div class="question">
            <p>${questions[currentQuestion].question}</p>
            ${questions[currentQuestion].options.map((option, index) => `
                <div>
                    <input type="radio" name="option" value="${index}">
                    ${option}
                </div>`).join('')}
        </div>`;
}

function startTimer() {
    let timeLeft = 600; // 10 minutes
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time").textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitExam();
        }
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
}

function submitExam() {
    clearInterval(timer);
    questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="option"]:checked`);
        if (selectedOption && parseInt(selectedOption.value) === question.correctAnswer) {
            score++;
        } else {
            incorrectQuestions.push(index + 1);
        }
    });

    document.getElementById("score").textContent = `${score}/${questions.length}`;
    document.getElementById("time-taken").textContent = formatTime(600 - timeLeft);
    document.getElementById("incorrect-questions").textContent = incorrectQuestions.join(', ');

    document.getElementById("exam-portal").classList.add("hidden");
    document.getElementById("result-panel").classList.remove("hidden");
}

function printResult() {
    window.print();
}
