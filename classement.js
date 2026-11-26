import { app } from "./firebase.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const db = getFirestore(app);

const rankingContainer =
    document.getElementById("ranking-container");

async function chargerClassement(theme = "global") {

    rankingContainer.innerHTML = "Chargement...";

    const snapshot =
        await getDocs(collection(db, "users"));

    const joueurs = [];

    snapshot.forEach(doc => {

        const data = doc.data();

        let valeur = 0;

        if (theme === "global") {

            valeur = data.score || 0;

        } else {

            valeur =
                data.themeScores?.[theme] || 0;

        }

        joueurs.push({
            pseudo: data.pseudo,
            valeur
        });

    });

    joueurs.sort(
        (a, b) => b.valeur - a.valeur
    );

    rankingContainer.innerHTML = "";

    joueurs
        .slice(0, 10)
        .forEach((joueur, index) => {

            const row =
                document.createElement("div");

            row.className = "rank-row";

            row.innerHTML = `
                <span>
                    #${index + 1}
                    ${joueur.pseudo}
                </span>

                <strong>
                    ${joueur.valeur}
                </strong>
            `;

            rankingContainer.appendChild(row);

        });

}

document
.querySelectorAll(".tab-btn")
.forEach(btn => {

    btn.onclick = () => {

        document
        .querySelectorAll(".tab-btn")
        .forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        chargerClassement(
            btn.dataset.theme
        );

    };

});

chargerClassement("global");