let questions = [];
let questionIndex = 0;

// Charger les questions
fetch("./data/questions.json")
    .then(res => res.json())
    .then(data => {
        questions = data;
        afficherQuestion(questionIndex);
    });

// Afficher une question
function afficherQuestion(index) {
    const q = questions[index];

    // Recto : question
    document.getElementById("question").textContent = q.question;

    // Recto : réponses
    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    q.choices.forEach((rep, i) => {
        const btn = document.createElement("button");
        btn.textContent = rep;

       btn.onclick = () => {
    const isCorrect = (i === q.answer);

    // Verso : bonne réponse
    document.getElementById("correct-answer").textContent =
        "Bonne réponse : " + q.choices[q.answer];

    // Feedback sur le bouton cliqué
    if (isCorrect) {
        btn.classList.add("correct");
        document.querySelector(".back").classList.add("correct");
    } else {
        btn.classList.add("wrong");
        document.querySelector(".back").classList.add("wrong");
    }

    // Flip
    document.getElementById("card").classList.add("flip");

    // Attendre 2 sec → revenir au recto → question suivante
    setTimeout(() => {
        document.getElementById("card").classList.remove("flip");

        // Nettoyer les classes pour la prochaine question
        document.querySelector(".back").classList.remove("correct", "wrong");

        questionIndex++;

        if (questionIndex < questions.length) {
            afficherQuestion(questionIndex);
        } else {
            afficherFin();
        }
    }, 2000);
};

        answersDiv.appendChild(btn);
    });
}

// Fin du quiz
function afficherFin() {
    document.getElementById("question").textContent = "Fin du quiz !";
    document.getElementById("answers").innerHTML = "";
    document.getElementById("correct-answer").textContent = "Bravo !";
}
