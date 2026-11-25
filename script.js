function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
var questions = [
    {
        question: "How does AI improve drug discovery?",
        options: [
            "By replacing all scientists",
            "By analyzing biological data and chemical compounds",
            "By eliminating clinical trials",
            "By increasing medicine prices"
        ],
        correct: 1,
        explanation: "AI helps researchers analyze biological information and identify potential medicines more efficiently."
    },
    {
        question: "What does AlphaFold predict?",
        options: [
            "Disease outbreaks",
            "Hospital expenses",
            "Three-dimensional protein structures",
            "Patient recovery times"
        ],
        correct: 2,
        explanation: "AlphaFold predicts protein structures, helping scientists understand biological processes."
    },
    {
        question: "What is the main goal of personalized medicine?",
        options: [
            "Providing treatments based on individual patient differences",
            "Giving everyone the same treatment",
            "Reducing the number of doctors",
            "Replacing traditional hospitals"
        ],
        correct: 0,
        explanation: "Personalized medicine considers genetics, medical history, lifestyle and other individual factors."
    },
    {
        question: "What does pharmacogenomics study?",
        options: [
            "Hospital management",
            "The spread of infectious diseases",
            "Medical equipment",
            "How genes influence responses to medication"
        ],
        correct: 3,
        explanation: "Pharmacogenomics studies how a person's genes influence their response to medicines."
    },
    {
        question: "What does NHIC stand for?",
        options: [
            "National Hospital Innovation Centre",
            "National Health Intelligence Center",
            "National Healthcare Investment Council",
            "National Health Information Committee"
        ],
        correct: 1,
        explanation: "NHIC stands for National Health Intelligence Center."
    },
    {
        question: "What is the main purpose of Rwanda's NHIC?",
        options: [
            "To manufacture medicines",
            "To replace healthcare professionals",
            "To integrate health data and improve decision-making",
            "To operate private hospitals"
        ],
        correct: 2,
        explanation: "The NHIC brings together healthcare information to support better planning and decision-making."
    },
    {
        question: "How could AI support disease prevention in Rwanda?",
        options: [
            "By identifying patterns and predicting potential outbreaks",
            "By removing the need for medical testing",
            "By closing rural health centres",
            "By replacing vaccination programmes"
        ],
        correct: 0,
        explanation: "AI could analyze health trends and identify potential disease outbreaks."
    },
    {
        question: "Why is data privacy important in AI healthcare?",
        options: [
            "It increases hospital profits",
            "It makes computers faster",
            "It reduces electricity consumption",
            "It protects sensitive patient information"
        ],
        correct: 3,
        explanation: "Healthcare information is sensitive and must be protected from unauthorized access."
    },
    {
        question: "Which factor could limit AI adoption in Rwanda?",
        options: [
            "Improved disease monitoring",
            "Limited infrastructure and technical skills",
            "Better medical research",
            "More informed treatment decisions"
        ],
        correct: 1,
        explanation: "AI adoption requires reliable infrastructure, funding, technology and trained professionals."
    },
    {
        question: "What is needed for successful AI implementation in healthcare?",
        options: [
            "AI technology alone",
            "Replacing all healthcare workers",
            "Reliable data, infrastructure, training and data protection",
            "Removing healthcare regulations"
        ],
        correct: 2,
        explanation: "Successful AI implementation requires technology, reliable data, trained professionals and strong data protection."
    }
];
var currentQuestion = 0;
var score = 0;
var answered = false;

function startChallenge() {

    currentQuestion = 0;
    score = 0;

    document.getElementById("challenge-intro").style.display = "none";

    document.getElementById("challenge-results").style.display = "none";

    document.getElementById("challenge-area").style.display = "block";

    showQuestion();
}

function showQuestion() {

    answered = false;

    var q = questions[currentQuestion];

    document.getElementById("question-counter").innerHTML =
        "Question " + (currentQuestion + 1) + " of " + questions.length;

    document.getElementById("progress-bar").style.width =
        ((currentQuestion + 1) / questions.length * 100) + "%";

    document.getElementById("question-text").innerHTML = q.question;

    document.getElementById("answer-options").innerHTML = "";

    document.getElementById("answer-feedback").innerHTML = "";

    document.getElementById("next-button").style.display = "none";

    for (var i = 0; i < q.options.length; i++) {

        var button = document.createElement("button");

        button.innerHTML = q.options[i];

        button.className = "answer-button";

        button.setAttribute("onclick", "selectAnswer(" + i + ")");

        document.getElementById("answer-options").appendChild(button);
    }
}

function selectAnswer(selected) {

    if (answered) {
        return;
    }

    answered = true;

    var q = questions[currentQuestion];

    var buttons = document.getElementsByClassName("answer-button");

    for (var i = 0; i < buttons.length; i++) {

        buttons[i].disabled = true;
    }

   buttons[q.correct].style.backgroundColor = "#166534";
buttons[q.correct].style.color = "white";
buttons[q.correct].style.border = "2px solid #4ade80";

    if (selected === q.correct) {

        score++;

        document.getElementById("answer-feedback").innerHTML =
            "Correct! " + q.explanation;

    } else {

       buttons[selected].style.backgroundColor = "#991b1b";
buttons[selected].style.color = "white";
buttons[selected].style.border = "2px solid #f87171";

        document.getElementById("answer-feedback").innerHTML =
            "Not quite. " + q.explanation;
    }

    document.getElementById("next-button").style.display = "inline-block";

    if (currentQuestion === questions.length - 1) {

        document.getElementById("next-button").innerHTML = "See Your Results";

    } else {

        document.getElementById("next-button").innerHTML = "Next Question";
    }
}

function nextQuestion() {

    if (!answered) {
        return;
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {

        showQuestion();

    } else {

        showResults();
    }
}

function showResults() {

    document.getElementById("challenge-area").style.display = "none";

    document.getElementById("challenge-results").style.display = "block";

    document.getElementById("final-score").innerHTML =
        score + " / " + questions.length;

    var message;

    if (score === 10) {

        message = "Outstanding! You are AI Ready!";

    } else if (score >= 8) {

        message = "Great work! You have a strong understanding of AI in healthcare.";

    } else if (score >= 5) {

        message = "Good progress! Keep exploring the future of healthcare.";

    } else {

        message = "Every discovery starts somewhere. Explore our website and try again!";
    }

    document.getElementById("result-message").innerHTML = message;
}
window.addEventListener("scroll", function() {

    var button = document.getElementById("backToTop");

    if (button) {
        if (window.scrollY > 300) {
            button.style.display = "block";
        } else {
            button.style.display = "none";
        }
    }

});