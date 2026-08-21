// Écrans
const splash = document.getElementById("splash-screen");
const home = document.getElementById("home-screen");
const card = document.getElementById("card");

// Masquer la carte au début
card.style.display = "none";

// Splash → Home
setTimeout(() => {
    splash.classList.add("hidden");
    home.classList.remove("hidden");
}, 2500);
document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.onclick = () => {
        const theme = btn.dataset.theme;

        // Charger les questions du thème
        fetch(`./data/${theme}.json`)
            .then(res => res.json())
            .then(data => {
                questions = data;
                questionIndex = 0;
                score = 0;

                home.classList.add("hidden");
                card.style.display = "block";

                afficherQuestion(questionIndex);
            });
    };
});

// Choix du thème + chargement + tri par difficulté
document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.onclick = () => {
        const theme = btn.dataset.theme;

        // Charger le fichier du thème
        fetch(`./data/${theme}.json`)
            .then(res => res.json())
            .then(data => {

                // TRIER PAR DIFFICULTÉ
                const order = { easy: 1, medium: 2, hard: 3 };

                questions = data.sort((a, b) => {
                    return order[a.difficulty] - order[b.difficulty];
                });

                // Reset
                questionIndex = 0;
                score = 0;

                // Afficher la carte
                home.classList.add("hidden");
                card.style.display = "block";

                afficherQuestion(questionIndex);
            });
    };
});

let questions = [];
let questionIndex = 0;
let score = 0; // IMPORTANT : tu l'avais perdu

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

            // Score
            if (isCorrect) score++;

            // Verso : bonne réponse
            document.getElementById("correct-answer").textContent =
                "Bonne réponse : " + q.choices[q.answer];

            // Feedback visuel
            if (isCorrect) {
                btn.classList.add("correct");
                document.querySelector(".back").classList.add("correct");
            } else {
                btn.classList.add("wrong");
                document.querySelector(".back").classList.add("wrong");
            }

            // Désactiver tous les boutons pour éviter les clics infinis
            document.querySelectorAll("#answers button").forEach(b => {
                b.disabled = true;
            });

            // Flip
            document.getElementById("card").classList.add("flip");

            // Attendre 2 sec → revenir au recto → question suivante
            setTimeout(() => {
                document.getElementById("card").classList.remove("flip");
                document.querySelector(".back").classList.remove("correct", "wrong");

                questionIndex++;

                // FIN DU QUIZ
                if (questionIndex >= questions.length) {
                    afficherFin();
                    return; // IMPORTANT : empêche tout autre affichage
                }

                // Question suivante
                afficherQuestion(questionIndex);

            }, 2000);
        };

        answersDiv.appendChild(btn);
    });
}

// Carte finale stylée
function afficherFin() {
    const total = questions.length;
    const percent = Math.round((score / total) * 100);

    let emoji = "🐶";
    if (percent >= 80) emoji = "🐶🎉";
    else if (percent >= 50) emoji = "🐕🙂";
    else if (percent >= 30) emoji = "🐾😐";
    else emoji = "😢🐶";

    document.getElementById("question").innerHTML = `
        <div class="final-card">
            <h2>Fin du quiz Géographie 🌍</h2>
            <div class="emoji">${emoji}</div>
            <p>Score : ${score} / ${total} (${percent}%)</p>
            <button id="restart-btn">Rejouer</button>
        </div>
    `;

    document.getElementById("answers").innerHTML = "";
    document.getElementById("correct-answer").textContent = "";

    document.getElementById("restart-btn").onclick = () => {
        score = 0;
        questionIndex = 0;
        afficherQuestion(questionIndex);
    };
}
