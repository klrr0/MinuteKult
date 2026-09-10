document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.onclick = () => {
        const theme = btn.dataset.theme.trim().toLowerCase();

        console.log("Thème sélectionné :", theme); // DEBUG

        document.body.className = theme;

        fetch(`./data/${theme}.json`)
            .then(res => res.json())
            .then(data => {
                const order = { easy: 1, medium: 2, hard: 3 };
                questions = data.sort((a, b) => order[a.difficulty] - order[b.difficulty]);

                questionIndex = 0;
                score = 0;

                home.classList.add("hidden");
                card.style.display = "block";

                afficherQuestion(questionIndex);
            })
            .catch(err => console.error("Erreur JSON :", err));
    };
});

