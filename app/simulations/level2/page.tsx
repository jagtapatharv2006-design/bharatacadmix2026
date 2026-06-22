"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MrPsiChat from "@/app/componenets/MrPsiChat";
import { motion } from "framer-motion";

// ═══════════ IFRAME HTML/P5.js CONTENT ═══════════
const getSimulationHTML = (initialScore, initialCompletion) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quantum Safari: Level 2</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"><\/script>
    <style>
        /* UNIFIED DESIGN SYSTEM */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #050508;
            color: #e0e0e0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 15px;
            overflow: hidden;
        }

        #game-container {
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 25px;
            max-width: 1200px;
            width: 100%;
            background: rgba(255, 255, 255, 0.02);
            padding: 25px;
            border-radius: 24px;
            border: 1px solid rgba(0, 255, 157, 0.1);
            position: relative;
        }

        #sidebar {
            background: rgba(10, 10, 15, 0.9);
            padding: 25px;
            border-radius: 18px;
            border-left: 4px solid #00ff9d;
            display: flex;
            flex-direction: column;
        }

        #sidebar h2 { 
            color: #fff; 
            font-size: 1.4rem; 
            letter-spacing: 2px; 
            margin-bottom: 25px; 
            text-transform: uppercase;
        }

        .tab-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 8px;
            margin-bottom: 20px;
        }

        .tab-buttons button {
            font-family: inherit;
            background: rgba(0, 255, 157, 0.05);
            border: 1px solid rgba(0, 255, 157, 0.3);
            color: #00ff9d;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.7rem;
            font-weight: bold;
            text-transform: uppercase;
            transition: 0.3s ease;
        }

        .tab-buttons button:hover, .tab-buttons button.active {
            background: #00ff9d;
            color: #000;
        }

        .tab-content {
            background: rgba(0, 255, 157, 0.03);
            border: 1px solid rgba(0, 255, 157, 0.1);
            padding: 15px;
            border-radius: 12px;
            font-size: 0.9rem;
            line-height: 1.6;
            flex-grow: 1;
            color: #ccc;
        }

        .highlight { color: #00ff9d; font-weight: bold; }

        /* Progress Bar */
        #progress-container {
            margin-top: 20px;
            background: rgba(0,0,0,0.5);
            padding: 15px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        #progress-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #aaa;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
        }
        #progress-bar-bg {
            width: 100%;
            height: 8px;
            background: #111;
            border-radius: 4px;
            overflow: hidden;
        }
        #progress-bar-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #00ff9d, #00d4ff);
            transition: width 0.3s ease;
            box-shadow: 0 0 10px #00ff9d;
        }

        #main-content { display: flex; flex-direction: column; gap: 20px; justify-content: center; }

        #canvas-wrapper {
            background: #050508;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: inset 0 0 50px rgba(0,0,0,1);
        }

        #controls {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            background: rgba(255,255,255,0.02);
            padding: 20px;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.05);
        }

        .wave-slider-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: center;
        }

        .wave-slider-container label {
            font-size: 0.75rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #fff;
        }

        input[type=range] { 
            width: 100%; 
            cursor: pointer; 
            height: 6px;
            border-radius: 3px;
            appearance: none;
            background: #333;
            outline: none;
        }
        
        input[type=range]::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 10px currentColor;
        }
        
        #freq1 { color: #ff6b6b; } #freq1::-webkit-slider-thumb { background: #ff6b6b; }
        #freq2 { color: #48dbfb; } #freq2::-webkit-slider-thumb { background: #48dbfb; }
        #freq3 { color: #1dd1a1; } #freq3::-webkit-slider-thumb { background: #1dd1a1; }

        /* --- STYLED TRANSITION POPUP --- */
        .overlay-popup {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            background: rgba(10, 10, 15, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid #00ff9d;
            padding: 35px;
            border-radius: 20px;
            z-index: 200;
            display: none;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 255, 157, 0.2);
        }

        .overlay-popup h4 {
            color: #00ff9d;
            font-size: 1.2rem;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .overlay-popup p {
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 15px;
            color: #ccc;
        }

        .btn-action { 
            background: #00ff9d; 
            color: #000; 
            border: none; 
            padding: 10px 25px; 
            border-radius: 8px; 
            cursor: pointer; 
            float: right;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 10px;
            letter-spacing: 1px;
            transition: 0.2s;
        }
        .btn-action:hover {
            background: #fff;
            box-shadow: 0 0 15px #00ff9d;
        }

        /* QUIZ */
        #quiz-float-btn {
            position: fixed; bottom: 25px; right: 25px; z-index: 300;
            background: #c084fc; color: #000; border: none; border-radius: 50px;
            padding: 12px 24px; font-weight: 900; font-size: 0.85rem; letter-spacing: 2px; text-transform: uppercase;
            cursor: pointer; box-shadow: 0 0 20px rgba(192,132,252,0.4); transition: 0.3s;
        }
        #quiz-float-btn:hover { transform: translateY(-5px) scale(1.05); box-shadow: 0 10px 30px rgba(192,132,252,0.6); }

        #quiz-overlay {
            position: fixed; inset: 0; background: rgba(5,5,8,0.98); z-index: 400;
            display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
        }
        #quiz-overlay.show { opacity: 1; pointer-events: all; }
        #quiz-box {
            width: min(520px, 92vw); background: #0a0a0f; border: 1px solid #c084fc; border-radius: 20px;
            padding: 35px; box-shadow: 0 0 60px rgba(192,132,252,0.15); position: relative;
        }
        #quiz-close {
            position: absolute; top: 15px; right: 15px; background: transparent; border: none;
            color: #666; font-size: 1.5rem; cursor: pointer;
        }
        #quiz-close:hover { color: #fff; }
        .quiz-option {
            width: 100%; text-align: left; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
            color: #ccc; border-radius: 10px; padding: 14px 18px; margin-bottom: 12px; cursor: pointer; transition: 0.2s;
        }
        .quiz-option:hover:not(:disabled) { border-color: #c084fc; background: rgba(192,132,252,0.1); color: #fff;}
        .quiz-option.correct { border-color: #00ff9d; background: rgba(0,255,157,0.1); color: #00ff9d; }
        .quiz-option.wrong   { border-color: #ff4757; background: rgba(255,71,87,0.1); color: #ff4757; }
        #quiz-next-btn {
            margin-top: 20px; width: 100%; background: #c084fc; color: #000; border: none; border-radius: 10px; padding: 14px;
            font-weight: 800; text-transform: uppercase; cursor: pointer; display: none;
        }
        #quiz-score-screen { text-align: center; display: none; }
        #quiz-score-num { font-size: 4rem; font-weight: 900; color: #00ff9d; }
    </style>
</head>
<body>

<div id="game-container">
    <div id="intro-popup" class="overlay-popup" style="display: ${initialCompletion ? 'none' : 'block'};">
        <h4>Level 2: Wave Packet Formation</h4>
        <p>In Level 1, you found the bear's shape. But a quantum particle isn't a solid object; it's a probability wave.</p>
        <p>A single wave spreads out infinitely, making the bear completely blurry and unlocalized.</p>
        <p><strong>Your Task:</strong> Tune the three frequency generators to create constructive interference. Align them perfectly to form a sharp "Wave Packet" and reveal the bear.</p>
        <button class="btn-action" onclick="closePopup('intro-popup')">Begin Synthesis</button>
    </div>

    <div id="win-popup" class="overlay-popup">
        <h4 style="color: #00ff9d;">Localization Complete!</h4>
        <p>By adding multiple frequencies (superposition), you created destructive interference everywhere except the center, forming a sharp Wave Packet.</p>
        <p>But wait... trapping a wave packet in a confined space causes it to vibrate violently. It must snap into specific energy states!</p>
        <button class="btn-action" onclick="window.parent.postMessage({type: 'NEXT_LEVEL'}, '*')">Proceed to Level 3</button>
    </div>

    <div id="sidebar">
        <h2>Level 2: Wave Packets</h2>
        <div class="tab-buttons">
            <button onclick="showTab('concept')" class="active">Concept</button>
            <button onclick="showTab('hint')">Hint</button>
            <button onclick="showTab('notes')">Math</button>
        </div>
        <div id="concept" class="tab-content">
            <p>You cannot locate a quantum particle using just one wave. A single sine wave exists equally everywhere (infinite uncertainty in position).</p><br>
            <p>By superimposing (adding) multiple waves of different frequencies, they cancel each other out in most places, leaving a sharp spike of probability—a <span class="highlight">Wave Packet</span>.</p>
        </div>
        <div id="hint" class="tab-content" style="display:none;">
            <p>Adjust the sliders to find the <span class="highlight">Harmonic Series</span>.</p><br>
            <p>Watch the white <b>Sum Wave</b> at the bottom. You want it to be totally flat on the edges, with one massive spike directly in the middle.</p>
        </div>
        <div id="notes" class="tab-content" style="display:none;">
            <p style="text-align: center; font-size: 1.1rem; margin: 10px 0;" class="highlight">Ψ(x) = Σ A sin(kₙx)</p>
            <p>This is a Fourier Series. By combining waves where wave numbers <i>k</i> are multiples of each other, we localize the wavefunction Ψ(x) into a definable particle.</p>
        </div>

        <div id="progress-container">
            <div id="progress-label">
                <span>Wave Coherence</span>
                <span id="percent-text">0%</span>
            </div>
            <div id="progress-bar-bg">
                <div id="progress-bar-fill"></div>
            </div>
        </div>
    </div>

    <div id="main-content">
        <div id="canvas-wrapper">
            <div id="p5-holder"></div>
        </div>
        <div id="controls">
            <div class="wave-slider-container">
                <label style="color:#ff6b6b">Harmonic 1</label>
                <input type="range" id="freq1" min="0.01" max="0.10" step="0.001" value="0.01">
            </div>
            <div class="wave-slider-container">
                <label style="color:#48dbfb">Harmonic 2</label>
                <input type="range" id="freq2" min="0.01" max="0.15" step="0.001" value="0.02">
            </div>
            <div class="wave-slider-container">
                <label style="color:#1dd1a1">Harmonic 3</label>
                <input type="range" id="freq3" min="0.01" max="0.20" step="0.001" value="0.03">
            </div>
        </div>
    </div>
</div>

<button id="quiz-float-btn" onclick="openQuiz()">⚛ Knowledge Quiz</button>

<div id="quiz-overlay">
    <div id="quiz-box">
        <button id="quiz-close" onclick="closeQuiz()">✕</button>
        <h3 style="color:#c084fc; margin-bottom: 20px; font-size: 1rem; letter-spacing: 2px;">LEVEL 2 ASSESSMENT</h3>
        <div id="quiz-q-wrap">
            <div id="quiz-question" style="font-size: 1.1rem; color: #fff; margin-bottom: 20px;"></div>
            <div id="quiz-options"></div>
            <button id="quiz-next-btn" onclick="quizNext()">Next Question →</button>
        </div>
        <div id="quiz-score-screen">
            <h3 style="color: #fff; margin-bottom: 10px;">ASSESSMENT COMPLETE</h3>
            <div id="quiz-score-num"></div>
            <p style="color: #aaa; margin-top: 10px;">Telemetry saved to operator profile.</p>
            <button class="btn-action" style="float:none; margin-top: 20px;" onclick="closeQuiz()">Return to Simulation</button>
        </div>
    </div>
</div>

<script>
    // --- P5.JS PHYSICS ENGINE ---
    let coherence = 0;
    let hasWon = ${initialCompletion}; 
    let f1, f2, f3;
    
    // The secret harmonic sequence needed to create the perfect wave packet
    const TARGET_F1 = 0.04;
    const TARGET_F2 = 0.08;
    const TARGET_F3 = 0.12;
    const MAX_ERROR = 0.15; // Max allowable sum error

    function setup() {
        let canvas = createCanvas(820, 420);
        canvas.parent('p5-holder');
        
        if (hasWon) {
            document.getElementById('freq1').value = TARGET_F1;
            document.getElementById('freq2').value = TARGET_F2;
            document.getElementById('freq3').value = TARGET_F3;
            document.getElementById('freq1').disabled = true;
            document.getElementById('freq2').disabled = true;
            document.getElementById('freq3').disabled = true;
            coherence = 100;
            updateProgressUI(coherence);
        }
    }

    function draw() {
        background(5, 5, 8);
        
        // Background Grid
        stroke(255, 255, 255, 5);
        for(let i=0; i<width; i+=40) line(i, 0, i, height);
        for(let j=0; j<height; j+=40) line(0, j, width, j);

        // Get slider values
        f1 = parseFloat(document.getElementById('freq1').value);
        f2 = parseFloat(document.getElementById('freq2').value);
        f3 = parseFloat(document.getElementById('freq3').value);

        // Calculate Coherence based on how close they are to target harmonics
        if (!hasWon) {
            let error = Math.abs(f1 - TARGET_F1) + Math.abs(f2 - TARGET_F2) + Math.abs(f3 - TARGET_F3);
            let rawCoherence = map(error, MAX_ERROR, 0, 0, 100, true);
            // Smooth easing for the score
            coherence = lerp(coherence, rawCoherence, 0.05);
            updateProgressUI(Math.floor(coherence));

            if (coherence > 96) {
                hasWon = true;
                document.getElementById('freq1').disabled = true;
                document.getElementById('freq2').disabled = true;
                document.getElementById('freq3').disabled = true;
                showPopup('win-popup');
                window.parent.postMessage({type: 'LEVEL_COMPLETE'}, '*');
            }
        }

        // 1. Draw Bear in the center (Blur depends on INcoherence)
        let blurAmount = map(coherence, 0, 100, 150, 0);
        let opacity = map(coherence, 0, 100, 20, 255);
        
        push();
        translate(width/2, height/2 - 50);
        noFill();
        stroke(0, 255, 157, opacity);
        strokeWeight(3);
        
        if (blurAmount > 0) {
            drawingContext.shadowBlur = blurAmount;
            drawingContext.shadowColor = 'rgba(0, 255, 157, 1)';
        } else {
            drawingContext.shadowBlur = 15; // default glow
            drawingContext.shadowColor = 'rgba(0, 255, 157, 0.5)';
        }
        
        renderBearShapes();
        pop();

        // 2. Draw Individual Waves (Bottom)
        drawWave(f1, color(255, 107, 107, 100), height - 90, 20);
        drawWave(f2, color(72, 219, 251, 100), height - 90, 20);
        drawWave(f3, color(29, 209, 161, 100), height - 90, 20);

        // 3. Draw Superposition (Sum Wave)
        drawSuperposition(f1, f2, f3, height - 90);
    }

    function renderBearShapes() {
        circle(0, 20, 90);    // Body
        circle(0, -50, 65);   // Head
        circle(-25, -75, 22); // Ear L
        circle(25, -75, 22);  // Ear R
    }

    function drawWave(freq, col, yOffset, amplitude) {
        push();
        noFill();
        stroke(col);
        strokeWeight(2);
        beginShape();
        for (let x = 0; x < width; x++) {
            // Center the phase so peak is always at width/2
            let phase = (x - width/2) * freq;
            let y = yOffset + cos(phase) * amplitude;
            vertex(x, y);
        }
        endShape();
        pop();
    }

    function drawSuperposition(freq1, freq2, freq3, yOffset) {
        push();
        noFill();
        stroke(255, 255, 255, 255);
        strokeWeight(3);
        
        // If highly coherent, make the sum wave glow intensely
        if(coherence > 80) {
            drawingContext.shadowBlur = map(coherence, 80, 100, 10, 30);
            drawingContext.shadowColor = 'rgba(255, 255, 255, 1)';
        }
        
        beginShape();
        for (let x = 0; x < width; x++) {
            let phase1 = (x - width/2) * freq1;
            let phase2 = (x - width/2) * freq2;
            let phase3 = (x - width/2) * freq3;
            
            // Add waves together (Superposition)
            let combined = cos(phase1) + cos(phase2) + cos(phase3);
            
            let y = yOffset + (combined * 20); // Multiply amplitude
            vertex(x, y);
        }
        endShape();
        pop();
    }

    function updateProgressUI(val) {
        document.getElementById('progress-bar-fill').style.width = val + '%';
        document.getElementById('percent-text').innerText = val + '%';
        window.parent.postMessage({type: 'COHERENCE_UPDATE', percent: val}, '*');
    }

    // UI Helpers
    function showTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.tab-buttons button').forEach(btn => btn.classList.remove('active'));
        document.getElementById(tabId).style.display = 'block';
    }
    function showPopup(id) { document.getElementById(id).style.display = 'block'; }
    function closePopup(id) { document.getElementById(id).style.display = 'none'; }

    // --- QUIZ SYSTEM ---
    const QUIZ_DATA = [
        {q:'What is a Wave Packet?', options:['A single sine wave','A collection of multiple superimposed waves','A classical solid particle','A wave with zero energy'], answer:1},
        {q:'Why does a single wave make the bear appear completely blurry?', options:['Because its probability is spread out infinitely','Because the frequency is too low','Because waves cannot carry particles','Because the amplitude is zero'], answer:0},
        {q:'How do multiple waves create a sharp localization?', options:['By moving faster than light','Through constructive and destructive interference','By increasing mass','By absorbing energy'], answer:1},
        {q:'The mathematical process of adding these waves is known as:', options:['Newtonian Addition','Superposition (Fourier Synthesis)','Einstein Combination','Wave Division'], answer:1}
    ];
    let qIdx = 0, qScore = 0;

    function openQuiz() {
        qIdx = 0; qScore = 0;
        document.getElementById('quiz-overlay').classList.add('show');
        document.getElementById('quiz-score-screen').style.display = 'none';
        document.getElementById('quiz-q-wrap').style.display = 'block';
        renderQuestion();
    }
    function closeQuiz() { document.getElementById('quiz-overlay').classList.remove('show'); }
    
    function renderQuestion() {
        const d = QUIZ_DATA[qIdx];
        document.getElementById('quiz-question').textContent = (qIdx+1) + ". " + d.q;
        const opts = document.getElementById('quiz-options');
        opts.innerHTML = '';
        document.getElementById('quiz-next-btn').style.display = 'none';
        
        d.options.forEach((opt, i) => {
            let btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.onclick = () => pickAnswer(i, btn);
            opts.appendChild(btn);
        });
    }

    function pickAnswer(i, btn) {
        const d = QUIZ_DATA[qIdx];
        const allBtns = document.querySelectorAll('.quiz-option');
        allBtns.forEach(b => b.disabled = true);
        
        if (i === d.answer) {
            btn.classList.add('correct'); qScore++;
        } else {
            btn.classList.add('wrong');
            allBtns[d.answer].classList.add('correct');
        }
        document.getElementById('quiz-next-btn').style.display = 'block';
        document.getElementById('quiz-next-btn').textContent = qIdx < QUIZ_DATA.length - 1 ? 'Next Question →' : 'Submit Telemetry';
    }

    function quizNext() {
        qIdx++;
        if (qIdx < QUIZ_DATA.length) { 
            renderQuestion(); 
        } else {
            document.getElementById('quiz-q-wrap').style.display = 'none';
            document.getElementById('quiz-score-screen').style.display = 'block';
            document.getElementById('quiz-score-num').textContent = qScore + '/' + QUIZ_DATA.length;
            window.parent.postMessage({type: 'QUIZ_COMPLETE', score: qScore, max: QUIZ_DATA.length}, '*');
        }
    }
</script>
</body>
</html>
`;


// ═══════════ REACT PARENT COMPONENT ═══════════
export default function Level2Page() {
  const { User, isloading } = useAuth();
  const router = useRouter();
  
  // Telemetry State
  const [coherence, setCoherence] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  // Auth Protection
  useEffect(() => {
    if (!isloading && !User) {
      router.push("/");
    }
  }, [User, isloading, router]);

  // Load persistence data on mount
  useEffect(() => {
    if (User) {
      const savedData = JSON.parse(localStorage.getItem(`qsafari_lvl2_${User.uid}`)) || {};
      if (savedData.completed) {
        setIsCompleted(true);
        setCoherence(100);
      }
      if (savedData.quizScore !== undefined) {
        setQuizScore(savedData.quizScore);
      }
    }
  }, [User]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleIframeMessage = (event) => {
      const { type, percent, score, max } = event.data;

      if (type === 'COHERENCE_UPDATE') {
        setCoherence(percent);
      } 
      else if (type === 'LEVEL_COMPLETE') {
        setIsCompleted(true);
        if (User) {
          const existing = JSON.parse(localStorage.getItem(`qsafari_lvl2_${User.uid}`)) || {};
          localStorage.setItem(`qsafari_lvl2_${User.uid}`, JSON.stringify({ ...existing, completed: true }));
        }
      } 
      else if (type === 'QUIZ_COMPLETE') {
        const scoreString = `${score}/${max}`;
        setQuizScore(scoreString);
        if (User) {
          const existing = JSON.parse(localStorage.getItem(`qsafari_lvl2_${User.uid}`)) || {};
          localStorage.setItem(`qsafari_lvl2_${User.uid}`, JSON.stringify({ ...existing, quizScore: scoreString }));
        }
      }
      else if (type === 'NEXT_LEVEL') {
        router.push("/simulations/level3");
      }
    };

    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, [User, router]);

  if (isloading || !User) {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center font-mono text-[#00ff9d]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="w-16 h-16 border-t-2 border-r-2 border-[#00ff9d] rounded-full mb-6 shadow-[0_0_15px_rgba(0,255,157,0.5)]"
        />
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="tracking-[0.3em] uppercase text-sm font-bold">
          Initializing Chamber 2...
        </motion.div>
      </div>
    );
  }

  // Inject initial state into iframe HTML
  const dynamicHtml = getSimulationHTML(quizScore, isCompleted);

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center w-full px-4 pt-24 pb-12 selection:bg-[#00ff9d]/30">
      
      {/* ═══════════ OPERATOR TELEMETRY HUD ═══════════ */}
      <div className="w-full max-w-6xl mb-6 bg-[#0a0a0f]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#111116] border border-[#00ff9d]/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.2)]">
            <span className="material-symbols-outlined text-[#00ff9d]">waves</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest uppercase">Wave Packet Formation</h1>
            <div className="text-xs text-gray-400 font-mono tracking-widest mt-1 uppercase">
              Operator: {User.displayName || "Unknown"}
            </div>
          </div>
        </div>
        
        <div className="flex gap-6 items-center bg-[#111116] px-6 py-3 rounded-xl border border-white/5">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Status</span>
            <span className={`text-sm font-bold tracking-widest uppercase ${isCompleted ? 'text-[#00ff9d] drop-shadow-[0_0_8px_rgba(0,255,157,0.5)]' : 'text-[#ff6b35]'}`}>
              {isCompleted ? "Completed" : "In Progress"}
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Coherence</span>
            <span className="text-sm font-bold font-mono text-[#00ff9d]">{coherence}%</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Quiz Score</span>
            <span className="text-sm font-bold font-mono text-[#c084fc]">{quizScore || "--/4"}</span>
          </div>
        </div>
      </div>

      {/* ═══════════ IFRAME SIMULATION ═══════════ */}
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,255,157,0.1)] border border-[#00ff9d]/20 relative" style={{ height: '650px' }}>
        <iframe
          srcDoc={dynamicHtml}
          className="w-full h-full border-none bg-transparent"
          title="Level 2: Wave Packet Formation"
          sandbox="allow-scripts allow-same-origin"
          scrolling="no"
        />
      </div>

      {/* Mr. Psi Assistant */}
      <div className="w-full max-w-6xl mt-8">
        <MrPsiChat currentLevel={2} />
      </div>

    </div>
  );
}
