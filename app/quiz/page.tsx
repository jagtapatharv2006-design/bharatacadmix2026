"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MrPsiChat from "@/app/componenets/MrPsiChat";

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Quantum Safari Quiz</title>

<style>
body {
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: #0f172a;
    color: white;
    text-align: center;
    margin: 0;
    padding: 0;
    min-height: 100vh;
}

.quiz-box {
    width: min(600px, 92vw);
    margin: auto;
    margin-top: 30px;
    padding: 24px;
    background: #1e293b;
    border-radius: 14px;
    border: 1px solid rgba(0, 212, 255, 0.15);
    box-shadow: 0 0 30px rgba(0,0,0,0.4);
}

.quiz-box h2 {
    font-size: 1.1rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #00d4ff;
    margin-bottom: 6px;
}

.quiz-box h3 {
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 16px;
    line-height: 1.4;
}

.option {
    display: block;
    margin: 8px auto;
    padding: 14px 16px;
    background: #334155;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.2s;
    border: 1px solid transparent;
    text-align: left;
    width: 100%;
}

.option:hover { background: #475569; border-color: rgba(0,212,255,0.3); }
.option:active { transform: scale(0.98); }

.correct { background: #166534 !important; border-color: #22c55e !important; }
.wrong { background: #991b1b !important; border-color: #ef4444 !important; }

button {
    padding: 12px 24px;
    margin-top: 20px;
    cursor: pointer;
    background: #00d4ff;
    color: #000;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.2s;
}

button:hover { opacity: 0.85; }
button:active { transform: scale(0.97); }

.hidden { display: none; }

.score-box {
    font-size: 1rem;
    margin-bottom: 14px;
    color: #00d4ff;
    font-weight: 700;
    letter-spacing: 1px;
}

#levelResult, #finalResult {
    width: min(600px, 92vw);
    margin: 30px auto;
    padding: 24px;
    background: #1e293b;
    border-radius: 14px;
    border: 1px solid rgba(0, 212, 255, 0.15);
    text-align: left;
}

#levelResult h2, #finalResult h2 {
    color: #00d4ff;
    text-align: center;
    margin-bottom: 12px;
}

#levelResult h3, #finalResult h3 {
    color: #ffeb3b;
    font-size: 0.95rem;
    margin-bottom: 10px;
}

#levelResult p, #finalResult p {
    font-size: 0.88rem;
    line-height: 1.5;
    margin-bottom: 6px;
}

#levelResult hr, #finalResult hr {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.1);
    margin: 12px 0;
}

@media (max-width: 480px) {
    .quiz-box { margin-top: 16px; padding: 16px; }
    .quiz-box h2 { font-size: 0.95rem; }
    .quiz-box h3 { font-size: 0.9rem; }
    .option { padding: 12px 14px; font-size: 0.88rem; }
    .score-box { font-size: 0.9rem; }
    #levelResult, #finalResult { padding: 16px; margin: 16px auto; }
}
</style>
</head>

<body>

<div class="quiz-box" id="quizBox">
    <div class="score-box" id="scoreBox">Score: 0</div>
    <h2 id="level"></h2>
    <h3 id="question"></h3>
    <div id="options"></div>
</div>

<div id="levelResult" class="hidden"></div>
<div id="finalResult" class="hidden"></div>

<script>

const quizData = [

{
level:"Level 1",
questions:[
{q:"Main concept?",options:["Quantum Tunneling","Wave-Particle Duality","Uncertainty","Collapse"],answer:1,explanation:"Wave-particle duality explains quantum behavior."},
{q:"Why large balls fail?",options:["Slow","Absorbed","Too big for quantum field","No energy"],answer:2,explanation:"Large objects can't interact with quantum probability field."},
{q:"Dots form?",options:["Teleport","Bear shape","Collapse","Disappear"],answer:1,explanation:"Dots map the bear gradually."},
{q:"Probability field?",options:["Force","Guaranteed","Likelihood region","Magnetic"],answer:2,explanation:"It shows likely position."},
{q:"de Broglie says?",options:["Waves\\u2192matter","Particles have wavelength","Light only wave","Big shorter \\u03bb"],answer:1,explanation:"Every particle has wavelength."}
]
},

{
level:"Level 2",
questions:[
{q:"Wave packet?",options:["Single wave","Combination waves","Fast particle","Black hole"],answer:1,explanation:"Wave packet = many waves combined."},
{q:"One wave effect?",options:["Clear","Blurry","Point","Disappear"],answer:1,explanation:"Single wave spreads everywhere."},
{q:"More waves do?",options:["Energy","Sharp location","Speed","Light"],answer:1,explanation:"Interference sharpens peak."},
{q:"Superposition?",options:["Multiply","Divide","Add waves","Remove"],answer:2,explanation:"Waves are added."},
{q:"Principle shown?",options:["Pauli","Uncertainty","Bohr","Photoelectric"],answer:1,explanation:"Trade-off shows uncertainty."}
]
},

{
level:"Level 3",
questions:[
{q:"Particle in box?",options:["Classical bounce","Confined quantum","Big particle","Magnet"],answer:1,explanation:"Energy is quantized."},
{q:"n represents?",options:["Particles","Energy level","Width","Time"],answer:1,explanation:"n = energy state."},
{q:"Why specific patterns?",options:["Rubber cave","Boundary condition","Choice","Temp"],answer:1,explanation:"Wave must fit."},
{q:"Node?",options:["Max point","Zero point","Midpoint","Energy"],answer:1,explanation:"Node = zero amplitude."},
{q:"Energy narrow box?",options:["Decrease","Same","Increase","Stop"],answer:2,explanation:"Shorter \\u03bb \\u2192 higher energy."}
]
},

{
level:"Level 4",
questions:[
{q:"Uncertainty principle?",options:["Exact values","Trade-off","Heavy only","Perfect measure"],answer:1,explanation:"\\u0394x\\u0394p \\u2265 \\u0127/2"},
{q:"Position precise \\u2192 momentum?",options:["Precise","Uncertain","Same","Zero"],answer:1,explanation:"Momentum spreads."},
{q:"Momentum precise \\u2192 position?",options:["Exact","Uncertain","Stop","Both"],answer:1,explanation:"Position spreads."},
{q:"\\u0394x means?",options:["Exact","Uncertainty","Distance","\\u03bb"],answer:1,explanation:"Spread of position."},
{q:"\\u0127?",options:["c/pi","h/2\\u03c0","mass","g"],answer:1,explanation:"Quantum constant."}
]
},

{
level:"Level 5",
questions:[
{q:"Quantum tunneling?",options:["Dig hole","Pass barrier","Jump","Cave"],answer:1,explanation:"Particle crosses barrier."},
{q:"Classical E<V?",options:["Pass","Reflect","Teleport","Gain"],answer:1,explanation:"Cannot cross."},
{q:"Thicker barrier?",options:["Increase","Decrease","Same","Always"],answer:1,explanation:"Exponential drop."},
{q:"Higher energy?",options:["Decrease","Increase","Zero","Same"],answer:1,explanation:"More tunneling."},
{q:"Real use?",options:["Sails","STM","Microscope","Engine"],answer:1,explanation:"STM uses tunneling."}
]
}

];

let currentLevel = 0;
let currentQ = 0;
let score = 0;
let wrongAnswers = [];
let levelWrong = [];

const levelEl = document.getElementById("level");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreBox = document.getElementById("scoreBox");

const quizBox = document.getElementById("quizBox");
const levelResult = document.getElementById("levelResult");
const finalResult = document.getElementById("finalResult");

function updateScore() {
    scoreBox.innerText = "Score: " + score;
}

function loadQuestion() {
    let data = quizData[currentLevel].questions[currentQ];

    levelEl.innerText = quizData[currentLevel].level;
    questionEl.innerText = data.q;

    optionsEl.innerHTML = "";

    data.options.forEach((opt, index) => {
        let div = document.createElement("div");
        div.innerText = opt;
        div.classList.add("option");
        div.onclick = () => selectOption(div, index);
        optionsEl.appendChild(div);
    });
}

function selectOption(element, index) {
    let data = quizData[currentLevel].questions[currentQ];
    let options = document.querySelectorAll(".option");

    options.forEach(opt => opt.style.pointerEvents = "none");

    if(index === data.answer) {
        element.classList.add("correct");
        score++;
        updateScore();
    } else {
        element.classList.add("wrong");
        options[data.answer].classList.add("correct");

        let wrongObj = {
            question: data.q,
            correct: data.options[data.answer],
            explanation: data.explanation
        };

        wrongAnswers.push(wrongObj);
        levelWrong.push(wrongObj);
    }

    setTimeout(nextQuestion, 1000);
}

function nextQuestion() {
    currentQ++;

    if(currentQ < quizData[currentLevel].questions.length) {
        loadQuestion();
    } else {
        showLevelResult();
    }
}

function showLevelResult() {
    quizBox.classList.add("hidden");
    levelResult.classList.remove("hidden");

    let html = '<h2>' + quizData[currentLevel].level + ' Completed!</h2>';
    html += '<h3>Score: ' + score + '</h3>';

    if(levelWrong.length === 0) {
        html += '<p>\\ud83c\\udf89 Perfect!</p>';
    } else {
        html += '<h3>Wrong Answers:</h3>';
        levelWrong.forEach(w => {
            html += '<p><b>Q:</b> ' + w.question + '</p>';
            html += '<p>\\u274c Your Answer was Wrong</p>';
            html += '<p>\\u2705 Correct: ' + w.correct + '</p>';
            html += '<p>\\ud83d\\udcd8 ' + w.explanation + '</p>';
            html += '<hr>';
        });
    }

    html += '<button onclick="nextLevel()">Next Level</button>';
    levelResult.innerHTML = html;
}

function nextLevel() {
    currentLevel++;
    currentQ = 0;
    levelWrong = [];

    levelResult.classList.add("hidden");

    if(currentLevel < quizData.length) {
        quizBox.classList.remove("hidden");
        loadQuestion();
    } else {
        showFinalResult();
    }
}

function showFinalResult() {
    finalResult.classList.remove("hidden");

    let html = '<h2>\\ud83c\\udfc1 Final Score: ' + score + '</h2>';
    html += '<h3>All Wrong Answers:</h3>';

    wrongAnswers.forEach(w => {
        html += '<p><b>Q:</b> ' + w.question + '</p>';
        html += '<p>\\u274c Wrong Answer</p>';
        html += '<p>\\u2705 Correct: ' + w.correct + '</p>';
        html += '<p>\\ud83d\\udcd8 ' + w.explanation + '</p>';
        html += '<hr>';
    });

    finalResult.innerHTML = html;
}

updateScore();
loadQuestion();

<\/script>

</body>
</html>
`;

export default function QuizPage() {
  const { User, isloading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isloading && !User) {
      router.push("/");
    }
  }, [User, isloading, router]);

  if (isloading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-primary-fixed text-xl animate-pulse tracking-[0.3em] uppercase">
          Loading Quiz...
        </div>
      </div>
    );
  }

  if (!User) return null;

  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4">
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,251,251,0.1)] border border-outline-variant/20 relative h-[calc(100dvh-90px)] sm:h-[calc(100dvh-120px)]">
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full border-none bg-surface"
          title="Quantum Safari Quiz"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      <MrPsiChat currentLevel={1} />
    </div>
  );
}
