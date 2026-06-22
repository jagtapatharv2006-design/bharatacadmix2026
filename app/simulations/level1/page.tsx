"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import MrPsiChat from "@/app/componenets/MrPsiChat";
import { motion } from "framer-motion";

// ═══════════ IFRAME HTML/P5.js CONTENT ═══════════
const getSimulationHTML = (initialScore, initialCompletion) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quantum Safari: Level 1</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"><\/script>
    <style>
        /* UNIFIED DESIGN SYSTEM */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #050508; /* Match Next.js background */
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
            border: 1px solid rgba(0, 212, 255, 0.1);
            position: relative;
        }

        #sidebar {
            background: rgba(10, 10, 15, 0.9);
            padding: 25px;
            border-radius: 18px;
            border-left: 4px solid #00d4ff;
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
            background: rgba(0, 212, 255, 0.05);
            border: 1px solid rgba(0, 212, 255, 0.3);
            color: #00d4ff;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.7rem;
            font-weight: bold;
            text-transform: uppercase;
            transition: 0.3s ease;
        }

        .tab-buttons button:hover, .tab-buttons button.active {
            background: #00d4ff;
            color: #000;
        }

        .tab-content {
            background: rgba(0, 212, 255, 0.03);
            border: 1px solid rgba(0, 212, 255, 0.1);
            padding: 15px;
            border-radius: 12px;
            font-size: 0.9rem;
            line-height: 1.6;
            flex-grow: 1;
            color: #ccc;
        }

        .highlight { color: #00d4ff; font-weight: bold; }

        /* Illumination Progress Bar */
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
            background: linear-gradient(90deg, #00d4ff, #c084fc);
            transition: width 0.3s ease;
            box-shadow: 0 0 10px #00d4ff;
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
            padding: 15px;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.05);
        }

        .btn-tool {
            background: rgba(0, 212, 255, 0.05);
            border: 1px solid rgba(0, 212, 255, 0.3);
            color: #00d4ff;
            padding: 12px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            font-size: 0.8rem;
            letter-spacing: 1px;
            text-transform: uppercase;
            transition: all 0.3s;
        }
        .btn-tool:hover, .btn-tool.active {
            background: #00d4ff;
            color: #000;
            box-shadow: 0 0 15px rgba(0,212,255,0.4);
        }

        /* --- STYLED TRANSITION POPUP --- */
        .overlay-popup {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            background: rgba(10, 10, 15, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid #00d4ff;
            padding: 35px;
            border-radius: 20px;
            z-index: 200;
            display: none;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 212, 255, 0.2);
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
            background: #00d4ff; 
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
            box-shadow: 0 0 15px #00d4ff;
        }

        /* QUIZ BUTTON */
        #quiz-float-btn {
            position: fixed;
            bottom: 25px;
            right: 25px;
            z-index: 300;
            background: #c084fc;
            color: #000;
            border: none;
            border-radius: 50px;
            padding: 12px 24px;
            font-weight: 900;
            font-size: 0.85rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 0 0 20px rgba(192,132,252,0.4);
            transition: 0.3s;
        }
        #quiz-float-btn:hover { transform: translateY(-5px) scale(1.05); box-shadow: 0 10px 30px rgba(192,132,252,0.6); }

        /* QUIZ OVERLAY */
        #quiz-overlay {
            position: fixed; inset: 0;
            background: rgba(5,5,8,0.98);
            z-index: 400;
            display: flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none;
            transition: opacity 0.3s ease;
        }
        #quiz-overlay.show { opacity: 1; pointer-events: all; }
        #quiz-box {
            width: min(520px, 92vw);
            background: #0a0a0f;
            border: 1px solid #c084fc;
            border-radius: 20px;
            padding: 35px;
            box-shadow: 0 0 60px rgba(192,132,252,0.15);
            position: relative;
        }
        #quiz-close {
            position: absolute; top: 15px; right: 15px;
            background: transparent; border: none;
            color: #666; font-size: 1.5rem; cursor: pointer;
        }
        #quiz-close:hover { color: #fff; }
        
        .quiz-option {
            width: 100%; text-align: left;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.1);
            color: #ccc; border-radius: 10px;
            padding: 14px 18px; margin-bottom: 12px;
            cursor: pointer; transition: 0.2s;
        }
        .quiz-option:hover:not(:disabled) { border-color: #c084fc; background: rgba(192,132,252,0.1); color: #fff;}
        .quiz-option.correct { border-color: #00ff9d; background: rgba(0,255,157,0.1); color: #00ff9d; }
        .quiz-option.wrong   { border-color: #ff4757; background: rgba(255,71,87,0.1); color: #ff4757; }
        
        #quiz-next-btn {
            margin-top: 20px; width: 100%; background: #c084fc; color: #000;
            border: none; border-radius: 10px; padding: 14px;
            font-weight: 800; text-transform: uppercase; cursor: pointer; display: none;
        }
        #quiz-score-screen { text-align: center; display: none; }
        #quiz-score-num { font-size: 4rem; font-weight: 900; color: #00ff9d; }
    </style>
</head>
<body>

<div id="game-container">
    <div id="intro-popup" class="overlay-popup" style="display: ${initialCompletion ? 'none' : 'block'};">
        <h4>Level 1: The Cave Mystery</h4>
        <p>A hidden <strong>Quantum Bear</strong> is trapped in the darkness.</p>
        <p>Large classical particles will simply <strong>bounce off</strong> its surface.</p>
        <p>Switch to <strong>Quantum Particles</strong>—their tiny de Broglie wavelength allows them to map the boundary by passing through it. Illuminate 100% of the bear to win.</p>
        <button class="btn-action" onclick="closePopup('intro-popup')">Initialize Sequence</button>
    </div>

    <div id="win-popup" class="overlay-popup">
        <h4 style="color: #00d4ff;">Target Mapped Successfully!</h4>
        <p>You have successfully illuminated the bear's probability outline using quantum scattering.</p>
        <p>Notice how the scattered points form a static outline? But quantum entities aren't static—they exist as waves.</p>
        <button class="btn-action" onclick="window.parent.postMessage({type: 'NEXT_LEVEL'}, '*')">Proceed to Level 2</button>
    </div>

    <div id="sidebar">
        <h2>Level 1: Cave Mystery</h2>
        <div class="tab-buttons">
            <button onclick="showTab('concept')" class="active">Concept</button>
            <button onclick="showTab('hint')">Hint</button>
            <button onclick="showTab('notes')">Math</button>
        </div>
        <div id="concept" class="tab-content">
            <p>Classical objects reflect upon collision. <br><br>Quantum particles with an extremely small <b>de Broglie wavelength</b> can behave as probability waves, allowing them to probe microscopic boundaries.</p>
        </div>
        <div id="hint" class="tab-content" style="display:none;">
            <p>Notice how <span style="color:#ff5050">Large Balls</span> simply bounce away?<br><br>Switch to <span class="highlight">Quantum Particles</span>. Let the simulation run until the shape is fully mapped.</p>
        </div>
        <div id="notes" class="tab-content" style="display:none;">
            <p style="text-align: center; font-size: 1.2rem; margin: 10px 0;" class="highlight">λ = h / p</p>
            <p>Where <b>λ</b> is wavelength, <b>h</b> is Planck's constant, and <b>p</b> is momentum. High momentum (velocity) creates shorter wavelengths, enabling high-resolution probing.</p>
        </div>

        <div id="progress-container">
            <div id="progress-label">
                <span>Bear Illumination</span>
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
            <button class="btn-tool active" id="btn-large" onclick="setMode('large')">Large Ball</button>
            <button class="btn-tool" id="btn-medium" onclick="setMode('medium')">Small Ball</button>
            <button class="btn-tool" id="btn-quantum" onclick="setMode('quantum')">Quantum Particle</button>
        </div>
    </div>
</div>

<button id="quiz-float-btn" onclick="openQuiz()">⚛ Knowledge Quiz</button>

<div id="quiz-overlay">
    <div id="quiz-box">
        <button id="quiz-close" onclick="closeQuiz()">✕</button>
        <h3 style="color:#c084fc; margin-bottom: 20px; font-size: 1rem; letter-spacing: 2px;">LEVEL 1 ASSESSMENT</h3>
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
    let mode = 'large';
    let particles = [];
    let detectedPoints = [];
    let illuminatedHits = 0;
    const TARGET_HITS = 250; // Win condition threshold
    let hasWon = ${initialCompletion}; 

    function setup() {
        let canvas = createCanvas(820, 480);
        canvas.parent('p5-holder');
        
        if (hasWon) {
            illuminatedHits = TARGET_HITS;
            updateProgressUI();
        }
    }

    function draw() {
        background(5, 5, 8);
        
        // Grid
        stroke(255, 255, 255, 5);
        for(let i=0; i<width; i+=40) line(i, 0, i, height);
        for(let j=0; j<height; j+=40) line(0, j, width, j);

        // Draw Bear Outline (Faint)
        push();
        translate(width/2 + 50, height/2);
        noStroke();
        fill(15, 15, 20); 
        renderBearShapes();
        pop();

        // Draw Detected Quantum Points
        for (let pt of detectedPoints) {
            noStroke();
            fill(pt.col);
            circle(pt.x, pt.y, pt.sz);
        }

        // Particle Physics Loop
        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            
            p.x += p.vx;
            p.y += p.vy;

            // Check collision with the 4 circles making up the bear
            let lx = p.x - (width/2 + 50);
            let ly = p.y - height/2;
            let hitData = getBearCollisionNormal(lx, ly, p.w/2);

            if (hitData) {
                if (mode === 'quantum') {
                    // Pass through, register illumination
                    if (!p.hasIlluminated && random() > 0.5) {
                        detectedPoints.push({ x: p.x, y: p.y, sz: random(2, 5), col: color(0, 212, 255, 200) });
                        p.hasIlluminated = true;
                        
                        if (!hasWon) {
                            illuminatedHits++;
                            updateProgressUI();
                            if (illuminatedHits >= TARGET_HITS) {
                                hasWon = true;
                                showPopup('win-popup');
                                window.parent.postMessage({type: 'LEVEL_COMPLETE'}, '*');
                            }
                        }
                    }
                } else if (!p.hasBounced) {
                    // CLASSICAL BOUNCE: Vector Reflection Math
                    // V_new = V - 2 * (V . N) * N
                    let dotProduct = p.vx * hitData.nx + p.vy * hitData.ny;
                    
                    if (dotProduct < 0) { // Only bounce if moving towards center
                        p.vx = (p.vx - 2 * dotProduct * hitData.nx) * 0.8; // 0.8 is restitution (bounciness)
                        p.vy = (p.vy - 2 * dotProduct * hitData.ny) * 0.8 + random(-0.5, 0.5); // add slight scatter
                        
                        p.col = color(255, 150, 150, 200); // Flash color on hit
                        p.hasBounced = true;
                    }
                }
            } else {
                p.hasBounced = false; // Reset bounce flag when outside
            }

            // Draw active particle
            noStroke();
            fill(p.col);
            circle(p.x, p.y, p.w);

            // Remove off-screen particles
            if (p.x > width + 50 || p.x < -100 || p.y > height + 100 || p.y < -100) {
                particles.splice(i, 1);
            }
        }

        // Fire rate control
        if (frameCount % (mode === 'large' ? 15 : 5) === 0) fire();
        
        // Memory management
        if (detectedPoints.length > 1000) detectedPoints.shift();
    }

    // Mathematical hit detection for composite shape
    function getBearCollisionNormal(lx, ly, radius) {
        const circles = [
            {cx: 0, cy: 35, r: 45},   // Body
            {cx: 0, cy: -35, r: 32},  // Head
            {cx: -25, cy: -60, r: 11}, // Ear L
            {cx: 25, cy: -60, r: 11}   // Ear R
        ];

        for (let c of circles) {
            let d = dist(lx, ly, c.cx, c.cy);
            if (d < c.r + radius) {
                // Return normalized normal vector pointing OUTWARD
                return { nx: (lx - c.cx) / d, ny: (ly - c.cy) / d };
            }
        }
        return null;
    }

    function renderBearShapes() {
        circle(0, 35, 90);    
        circle(0, -35, 65);   
        circle(-25, -60, 22); 
        circle(25, -60, 22);  
    }

    function fire() {
        let py = height/2 + random(-180, 180);
        let p = {
            x: -20,
            y: py,
            vx: mode === 'large' ? 5 : (mode === 'medium' ? 8 : 12),
            vy: random(-0.2, 0.2),
            w: mode === 'large' ? 35 : (mode === 'medium' ? 12 : 4),
            col: mode === 'large' ? color(255, 80, 80, 180) : (mode === 'medium' ? color(180, 180, 255, 180) : color(0, 255, 255, 200)),
            hasBounced: false,
            hasIlluminated: false
        };
        particles.push(p);
    }

    function updateProgressUI() {
        let percent = Math.min(100, Math.floor((illuminatedHits / TARGET_HITS) * 100));
        document.getElementById('progress-bar-fill').style.width = percent + '%';
        document.getElementById('percent-text').innerText = percent + '%';
        // Send live progress to React parent
        window.parent.postMessage({type: 'ILLUMINATION_UPDATE', percent: percent}, '*');
    }

    function setMode(m) {
        mode = m;
        document.querySelectorAll('.btn-tool').forEach(b => b.classList.remove('active'));
        document.getElementById('btn-' + m).classList.add('active');
    }

    // UI Helpers
    function showTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.tab-buttons button').forEach(btn => btn.classList.remove('active'));
        document.getElementById(tabId).style.display = 'block';
    }
    function showPopup(id) { document.getElementById(id).style.display = 'block'; }
    function closePopup(id) { document.getElementById(id).style.display = 'none'; }

    // --- QUIZ SYSTEM (Posts result to React Parent) ---
    const QUIZ_DATA = [
        {q:'What happens when classical Large Balls hit the bear?', options:['They pass through','They bounce off','They disappear','They turn into waves'], answer:1},
        {q:'Why do Quantum Particles reveal the hidden shape?', options:['They are magnetic','They explode','They have a tiny wavelength allowing penetration','They are very slow'], answer:2},
        {q:'Which formula represents the de Broglie wavelength?', options:['E = mc²','F = ma','λ = h/p','v = d/t'], answer:2},
        {q:'As momentum (p) increases, what happens to the wavelength (λ)?', options:['It gets longer','It gets shorter','It stays the same','It becomes zero'], answer:1}
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
            
            // Send score to React Parent to save in LocalStorage
            window.parent.postMessage({type: 'QUIZ_COMPLETE', score: qScore, max: QUIZ_DATA.length}, '*');
        }
    }
</script>
</body>
</html>
`;


// ═══════════ REACT PARENT COMPONENT ═══════════
export default function Level1Page() {
  const { User, isloading } = useAuth();
  const router = useRouter();
  
  // Telemetry State
  const [illumination, setIllumination] = useState(0);
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
      const savedData = JSON.parse(localStorage.getItem(`qsafari_lvl1_${User.uid}`)) || {};
      if (savedData.completed) {
        setIsCompleted(true);
        setIllumination(100);
      }
      if (savedData.quizScore !== undefined) {
        setQuizScore(savedData.quizScore);
      }
    }
  }, [User]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleIframeMessage = (event) => {
      // Security: verify origin if in production, for now accepting all to ensure it works
      const { type, percent, score, max } = event.data;

      if (type === 'ILLUMINATION_UPDATE') {
        setIllumination(percent);
      } 
      else if (type === 'LEVEL_COMPLETE') {
        setIsCompleted(true);
        if (User) {
          const existing = JSON.parse(localStorage.getItem(`qsafari_lvl1_${User.uid}`)) || {};
          localStorage.setItem(`qsafari_lvl1_${User.uid}`, JSON.stringify({ ...existing, completed: true }));
        }
      } 
      else if (type === 'QUIZ_COMPLETE') {
        const scoreString = `${score}/${max}`;
        setQuizScore(scoreString);
        if (User) {
          const existing = JSON.parse(localStorage.getItem(`qsafari_lvl1_${User.uid}`)) || {};
          localStorage.setItem(`qsafari_lvl1_${User.uid}`, JSON.stringify({ ...existing, quizScore: scoreString }));
        }
      }
      else if (type === 'NEXT_LEVEL') {
        router.push("/simulations/level2"); // Assuming level 2 exists
      }
    };

    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, [User, router]);

  if (isloading || !User) {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center font-mono text-[#00d4ff]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="w-16 h-16 border-t-2 border-r-2 border-[#00d4ff] rounded-full mb-6 shadow-[0_0_15px_rgba(0,212,255,0.5)]"
        />
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="tracking-[0.3em] uppercase text-sm font-bold">
          Initializing Chamber 1...
        </motion.div>
      </div>
    );
  }

  // Inject initial state into iframe HTML
  const dynamicHtml = getSimulationHTML(quizScore, isCompleted);

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center w-full px-4 pt-24 pb-12 selection:bg-[#00d4ff]/30">
      
      {/* ═══════════ OPERATOR TELEMETRY HUD ═══════════ */}
      <div className="w-full max-w-6xl mb-6 bg-[#0a0a0f]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#111116] border border-[#00d4ff]/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <span className="material-symbols-outlined text-[#00d4ff]">radar</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest uppercase">The Cave Mystery</h1>
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
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Illumination</span>
            <span className="text-sm font-bold font-mono text-[#00d4ff]">{illumination}%</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Quiz Score</span>
            <span className="text-sm font-bold font-mono text-[#c084fc]">{quizScore || "--/4"}</span>
          </div>
        </div>
      </div>

      {/* ═══════════ IFRAME SIMULATION ═══════════ */}
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,212,255,0.1)] border border-[#00d4ff]/20 relative" style={{ height: '700px' }}>
        <iframe
          srcDoc={dynamicHtml}
          className="w-full h-full border-none bg-transparent"
          title="Level 1: The Cave Mystery"
          sandbox="allow-scripts allow-same-origin"
          scrolling="no"
        />
      </div>

      {/* Mr. Psi Assistant */}
      <div className="w-full max-w-6xl mt-8">
        <MrPsiChat currentLevel={1} />
      </div>

    </div>
  );
}