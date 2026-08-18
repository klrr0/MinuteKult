let questions = [];
let index = 0;
let score = 0;

async function loadQuestions() {
  const res = await fetch("./data/questions.json");
  questions = await res.json();
  showQuestion();
}

function showQuestion() {
  const q = questions[index];
  document.getElementById("question").textContent = q.question;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  q.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(i);
    choicesDiv.appendChild(btn);
  });
}

function checkAnswer(choiceIndex) {
  const q = questions[index];
  if (choiceIndex === q.answer) score++;

  index++;
  if (index < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  document.getElementById("app").innerHTML = `
    <h1>Fin du quiz !</h1>
    <p>Score : ${score} / ${questions.length}</p>
  `;
}

document.getElementById("next-btn").onclick = showQuestion;

loadQuestions();
