// Variables globales
let questions = [];
let questionIndex = 0;
let score = 0;
let selectedDifficulty = null;

// Écrans
const splash = document.getElementById("splash-screen");
const home = document.getElementById("home-screen");
const card = document.getElementById("card");

// Splash → Home
setTimeout(() => {
    splash.classList.add("hidden");
    home.classList.remove("hidden");
}, 2500);


// -----------------------------
// MODE SOMBRE
// -----------------------------
document.getElementById("dark-toggle").onclick = () => {
    document.body.classList.toggle("dark-mode");
};


// -----------------------------
// ONGLET DE DIFFICULTÉ
// -----------------------------
document.querySelectorAll(".tab").forEach(tab => {
    tab.onclick = () => {

        // Enregistre la difficulté choisie
        selectedDifficulty = tab.dataset.diff;

        // Active l'onglet cliqué
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        // Affiche les thèmes
        document.getElementById("themes-buttons").classList.remove("hidden");
    };
});


// -----------------------------
// CHOIX DU THÈME
// -----------------------------
document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.onclick = () => {

        if (!selectedDifficulty) {
            alert("Choisis d'abord une difficulté !");
            return;
        }

        let theme = btn.dataset.theme.trim().toLowerCase().replace(/\s+/g, "");

        console.log("Thème sélectionné :", theme);

        // Vérifie si le mode sombre est actif AVANT de changer le thème
        const dark = document.body.classList.contains("dark-mode");

        // Reset des classes du body
        document.body.className = "";

        // Applique le thème PNG
        document.body.classList.add(theme);

        // Réactive le mode sombre si nécessaire
        if (dark) {
            document.body.classList.add("dark-mode");
        }

        // Affiche la carte
        document.querySelector(".flashcard-container").style.display = "flex";

        // Charge le JSON du thème
        fetch(`./data/${theme}.json`)
            .then(res => {
                if (!res.ok) throw new Error("JSON introuvable");
                return res.json();
            })
            .then(data => {

                if (!data || data.length === 0) {
                    alert("Ce quiz n'est pas encore disponible !");
                    resetToHome();
                    return;
                }

                // Filtrage selon la difficulté
                if (selectedDifficulty === "aleatoire") {
                    questions = data.sort(() => Math.random() - 0.5);
                } else {
                    questions = data.filter(q => q.difficulty === selectedDifficulty);
                }

                if (questions.length === 0) {
                    alert("Aucune question pour cette difficulté !");
                    resetToHome();
                    return;
                }

                // Trie pour garder ton ordre easy → medium → hard
                const order = { easy: 1, medium: 2, hard: 3 };
                questions.sort((a, b) => order[a.difficulty] - order[b.difficulty]);

                questionIndex = 0;
                score = 0;

                home.classList.add("hidden");

                afficherQuestion(questionIndex);
            })
            .catch(err => {
                console.error("Erreur JSON :", err);
                alert("Ce quiz n'est pas encore disponible !");
                resetToHome();
            });
    };
});


// -----------------------------
// RESET → Retour à l'accueil propre
// -----------------------------
function resetToHome() {

    const dark = document.body.classList.contains("dark-mode");

    document.body.className = "";

    if (dark) {
        document.body.classList.add("dark-mode");
    }

    document.querySelector(".flashcard-container").style.display = "none";
    home.classList.remove("hidden");

    questions = [];
    questionIndex = 0;
    score = 0;

    selectedDifficulty = null;

    // Reset onglets
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.getElementById("themes-buttons").classList.add("hidden");

    document.getElementById("question").innerHTML = "";
    document.getElementById("answers").innerHTML = "";
    document.getElementById("correct-answer").textContent = "";
}


// -----------------------------
// AFFICHER UNE QUESTION
// -----------------------------
function afficherQuestion(index) {
    const q = questions[index];

    document.getElementById("question").textContent = q.question;

    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    q.choices.forEach((rep, i) => {
        const btn = document.createElement("button");
        btn.textContent = rep;

        btn.onclick = () => {
            const isCorrect = (i === q.answer);

            if (isCorrect) score++;

            document.getElementById("correct-answer").textContent =
                "Bonne réponse : " + q.choices[q.answer];

            if (isCorrect) {
                btn.classList.add("correct");
                document.querySelector(".back").classList.add("correct");
            } else {
                btn.classList.add("wrong");
                document.querySelector(".back").classList.add("wrong");
            }

            document.querySelectorAll("#answers button").forEach(b => b.disabled = true);

            card.classList.add("flip");

            setTimeout(() => {
                card.classList.remove("flip");
                document.querySelector(".back").classList.remove("correct", "wrong");

                questionIndex++;

                if (questionIndex >= questions.length) {
                    afficherFin();
                    return;
                }

                afficherQuestion(questionIndex);

            }, 2000);
        };

        answersDiv.appendChild(btn);
    });
}


// -----------------------------
// FIN DU QUIZ
// -----------------------------
function afficherFin() {
    const total = questions.length;
    const percent = Math.round((score / total) * 100);

    let emoji;
    if (percent >= 80) emoji = "🎉";
    else if (percent >= 50) emoji = "🙂";
    else if (percent >= 30) emoji = "😐";
    else emoji = "😢";

    document.getElementById("question").innerHTML = `
        <div class="final-card">
            <h2>Fin du quiz !</h2>
            <div class="emoji">${emoji}</div>
            <p>Score : ${score} / ${total} (${percent}%)</p>

            <div class="final-buttons">
                <button id="restart-btn">Rejouer</button>
                <button id="home-btn">Retour à l'accueil</button>
            </div>
        </div>
    `;

    document.getElementById("answers").innerHTML = "";
    document.getElementById("correct-answer").textContent = "";

    // Rejouer
    document.getElementById("restart-btn").onclick = () => {
        score = 0;
        questionIndex = 0;
        afficherQuestion(questionIndex);
    };

    // Retour à l'accueil
    document.getElementById("home-btn").onclick = () => {
        resetToHome();
    };
}

