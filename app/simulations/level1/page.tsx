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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quantum Safari: Level 1</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"><\/script>
    <style>
        /* UNIFIED DESIGN SYSTEM */
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: radial-gradient(circle at center, #1a1a2e 0%, #080810 100%);
            color: #e0e0e0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
            overflow: hidden;
        }

        #game-container {
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 25px;
            max-width: 1200px;
            width: 100%;
            background: rgba(255, 255, 255, 0.03);
            padding: 30px;
            border-radius: 24px;
            border: 1px solid rgba(0, 255, 255, 0.15);
            position: relative;
        }

        #sidebar {
            background: rgba(10, 10, 20, 0.9);
            padding: 25px;
            border-radius: 18px;
            border-left: 4px solid #00d4ff;
        }

        #sidebar h2 { 
            color: #fff; 
            font-size: 1.6rem; 
            letter-spacing: 2px; 
            margin-bottom: 25px; 
            text-transform: uppercase;
            text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }

        .tab-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
        }

        .tab-buttons button {
            font-family: inherit;
            background: rgba(0, 212, 255, 0.05);
            border: 1px solid #00d4ff;
            color: #00d4ff;
            padding: 8px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.7rem;
            text-transform: uppercase;
            transition: 0.3s ease;
        }

        .tab-buttons button:hover, .tab-buttons button.active {
            background: #00d4ff;
            color: #000;
        }

        .tab-content {
            background: rgba(0, 212, 255, 0.03);
            border: 1px solid rgba(0, 212, 255, 0.2);
            padding: 15px;
            border-radius: 12px;
            font-size: 0.9rem;
            line-height: 1.5;
            min-height: 240px;
        }

        .highlight { color: #00d4ff; font-weight: bold; }

        #main-content { display: flex; flex-direction: column; gap: 20px; justify-content: center; }

        #canvas-wrapper {
            background: #05050a;
            border: 2px solid #222;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: inset 0 0 50px rgba(0,0,0,1);
            position: relative;
        }

        #controls {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            background: rgba(255,255,255,0.05);
            padding: 15px;
            border-radius: 15px;
        }

        .btn-tool {
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid #00d4ff;
            color: #00d4ff;
            padding: 12px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            text-transform: uppercase;
            transition: 0.3s;
        }
        .btn-tool:hover, .btn-tool.active {
            background: #00d4ff;
            color: #000;
        }

        /* --- STYLED TRANSITION POPUP --- */
        .overlay-popup {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            background: #0a0e1a; /* Dark background from image */
            border: 2px solid #00d4ff;
            padding: 35px;
            border-radius: 20px;
            z-index: 200;
            display: none;
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
        }

        .overlay-popup h4 {
            color: #f1e05a; /* Yellowish header */
            font-size: 1.3rem;
            margin-bottom: 20px;
            text-transform: uppercase;
            line-height: 1.3;
        }

        .overlay-popup p {
            font-size: 1.05rem;
            line-height: 1.5;
            margin-bottom: 15px;
            color: #ffffff;
        }

        .overlay-popup .question-text {
            color: #00d4ff;
            font-style: italic;
            font-weight: bold;
            margin-top: 20px;
        }

        .btn-continue { 
            font-family: inherit;
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
        }

        .btn-close { 
            font-family: inherit;
            background: #00d4ff; 
            color: #000; 
            border: none; 
            padding: 8px 20px; 
            border-radius: 5px; 
            cursor: pointer; 
            float: right;
            font-weight: bold;
        }

        /* QUIZ BUTTON */
        #quiz-float-btn {
            position: fixed;
            bottom: 22px;
            right: 22px;
            z-index: 300;
            background: linear-gradient(135deg, #00d4ff, #0099cc);
            color: #000;
            border: none;
            border-radius: 50px;
            padding: 10px 20px;
            font-family: inherit;
            font-weight: 700;
            font-size: 0.82rem;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 0 0 20px rgba(0,212,255,0.45);
            transition: 0.25s;
        }
        #quiz-float-btn:hover { transform: scale(1.06); box-shadow: 0 0 30px rgba(0,212,255,0.7); }

        /* QUIZ OVERLAY */
        #quiz-overlay {
            position: fixed; inset: 0;
            background: rgba(2,2,14,0.96);
            z-index: 400;
            display: flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none;
            transition: opacity 0.3s ease;
        }
        #quiz-overlay.show { opacity: 1; pointer-events: all; }
        #quiz-box {
            width: min(520px, 92vw);
            background: #09091a;
            border: 2px solid #00d4ff;
            border-radius: 16px;
            padding: 30px 28px;
            box-shadow: 0 0 60px rgba(0,212,255,0.25);
            position: relative;
        }
        #quiz-close {
            position: absolute; top: 14px; right: 16px;
            background: transparent; border: 1px solid rgba(0,212,255,0.3);
            color: rgba(0,212,255,0.6); border-radius: 50%;
            width: 30px; height: 30px; font-size: 1em;
            cursor: pointer; font-family: monospace;
            display: flex; align-items: center; justify-content: center;
            transition: 0.2s;
        }
        #quiz-close:hover { background: rgba(0,212,255,0.1); color: #fff; }
        #quiz-level-tag {
            font-size: 0.65em; letter-spacing: 3px; text-transform: uppercase;
            color: rgba(0,212,255,0.5); margin-bottom: 6px;
            font-family: monospace;
        }
        #quiz-progress {
            font-size: 0.7em; color: rgba(255,255,255,0.35);
            letter-spacing: 2px; text-align: right; margin-bottom: 14px;
            font-family: monospace;
        }
        #quiz-question {
            font-size: 1.05rem; font-weight: 600;
            color: #fff; margin-bottom: 18px; line-height: 1.45;
        }
        .quiz-option {
            width: 100%; text-align: left;
            background: rgba(0,212,255,0.04);
            border: 1px solid rgba(0,212,255,0.2);
            color: #ccc; border-radius: 8px;
            padding: 10px 14px; margin-bottom: 9px;
            font-family: inherit; font-size: 0.9rem;
            cursor: pointer; transition: 0.2s; display: block;
        }
        .quiz-option:hover:not(:disabled) { border-color: #00d4ff; color: #fff; background: rgba(0,212,255,0.1); }
        .quiz-option.correct { border-color: #00ff9d; background: rgba(0,255,157,0.12); color: #00ff9d; }
        .quiz-option.wrong   { border-color: #ff4757; background: rgba(255,71,87,0.12);  color: #ff4757; }
        #quiz-explanation {
            font-size: 0.85rem; line-height: 1.5;
            color: #aaa; background: rgba(255,255,255,0.04);
            border-left: 3px solid #00d4ff;
            padding: 10px 14px; border-radius: 0 6px 6px 0;
            margin-top: 4px; display: none;
        }
        #quiz-next-btn {
            margin-top: 16px; width: 100%;
            background: #00d4ff; color: #000;
            border: none; border-radius: 8px;
            padding: 10px; font-family: inherit;
            font-weight: 700; font-size: 0.88rem;
            letter-spacing: 1px; text-transform: uppercase;
            cursor: pointer; display: none;
            transition: 0.2s;
        }
        #quiz-next-btn:hover { opacity: 0.85; }
        #quiz-score-screen {
            text-align: center; display: none;
        }
        #quiz-score-screen h3 {
            font-size: 1.3rem; color: #00d4ff;
            margin-bottom: 10px; letter-spacing: 2px;
        }
        #quiz-score-num {
            font-size: 2.8rem; font-weight: 700;
            color: #fff; font-family: monospace;
        }
        #quiz-score-msg { font-size: 0.9rem; color: #aaa; margin: 10px 0 20px; }
        #quiz-retry-btn {
            background: transparent; border: 1px solid #00d4ff;
            color: #00d4ff; border-radius: 8px; padding: 9px 24px;
            font-family: inherit; font-weight: 700;
            cursor: pointer; font-size: 0.85rem;
            letter-spacing: 1px; text-transform: uppercase;
        }
        #quiz-retry-btn:hover { background: #00d4ff; color: #000; }

        @media (max-width: 900px) { #game-container { grid-template-columns: 1fr; } }
    </style>
</head>
<body>

<div id="game-container">
    <div id="intro-popup" class="overlay-popup" style="display: block;">
        <h4 style="color: #fff;">Level 1: Cave Mystery</h4>
        <p>A hidden <strong>Quantum Bear</strong> is trapped in the darkness.</p>
        <p>Fire particles to probe the darkness. Note that <strong>Quantum Particles</strong> are much smaller and can pass through, revealing both sides of the bear's boundary.</p>
        <button class="btn-close" onclick="closePopup('intro-popup')">Begin Search</button>
    </div>

    <div id="transition-popup" class="overlay-popup">
        <h4>LEVEL 1 &rarr; 2: Particle Size Effect to Wave Packet</h4>
        <p>Target outline established. However, static detection is incomplete. The "dots" we used to find the bear are just a snapshot; the bear itself is vibrating, blurring into a cloud of possibilities.</p>
        <p>If the bear is made of waves, how can it ever stay in one place?"</p>
        <p class="question-text">"Why does adding more wave frequencies together make the bear's 'glow' sharper and more localized?"</p>
        <button class="btn-continue" onclick="window.top.location.href='/simulations/level2'">Find Out</button>
    </div>

    <div id="sidebar">
        <h2>Level 1: Cave Mystery</h2>
        <div class="sidebar-section">
            <div class="tab-buttons">
                <button onclick="showTab('concept')" class="active">Concept</button>
                <button onclick="showTab('hint')">Hint</button>
                <button onclick="showTab('notes')">Reality</button>
            </div>
            <div id="concept" class="tab-content">
                <p>Only particles with a small enough <b>de Broglie wavelength</b> can probe specific coordinates.</p>
            </div>
            <div id="hint" class="tab-content" style="display:none;">
                <p>Switch to <span class="highlight">Quantum Particles</span>. They penetrate the object to reveal the hidden back side.</p>
            </div>
            <div id="notes" class="tab-content" style="display:none;">
                <p class="highlight" style="text-align: center;">λ = h / mv</p>
                <p>High velocity creates higher resolution probing.</p>
            </div>
        </div>
    </div>

    <div id="main-content">
        <div id="canvas-wrapper">
            <div id="p5-holder"></div>
        </div>
        <div id="controls">
            <button class="btn-tool" id="btn-large" onclick="setMode('large')">Large Ball</button>
            <button class="btn-tool" id="btn-medium" onclick="setMode('medium')">Small Ball</button>
            <button class="btn-tool active" id="btn-quantum" onclick="setMode('quantum')">Quantum Particle</button>
        </div>
    </div>
</div>

<button id="quiz-float-btn" onclick="openQuiz()">⚛ Quiz</button>

<div id="quiz-overlay">
    <div id="quiz-box">
        <button id="quiz-close" onclick="closeQuiz()">✕</button>
        <div id="quiz-level-tag">Level 1 — Knowledge Check</div>
        <div id="quiz-progress"></div>
        <div id="quiz-q-wrap">
            <div id="quiz-question"></div>
            <div id="quiz-options"></div>
            <div id="quiz-explanation"></div>
            <button id="quiz-next-btn" onclick="quizNext()">Next →</button>
        </div>
        <div id="quiz-score-screen">
            <h3>QUIZ COMPLETE</h3>
            <div id="quiz-score-num"></div>
            <div id="quiz-score-msg"></div>
            <button id="quiz-retry-btn" onclick="quizRetry()">↺ Try Again</button>
        </div>
    </div>
</div>

<script>
    let mode = 'quantum';
    let particles = [];
    let detectedPoints = [];
    let borderAlpha = 0; 
    let transitionTriggered = false;

    function setup() {
        let canvas = createCanvas(800, 480);
        canvas.parent('p5-holder');
    }

    function draw() {
        background(5, 5, 12);
        
        stroke(255, 255, 255, 10);
        for(let i=0; i<width; i+=40) line(i, 0, i, height);
        for(let j=0; j<height; j+=40) line(0, j, width, j);

        drawDynamicBear();

        for (let pt of detectedPoints) {
            noStroke();
            fill(pt.col);
            circle(pt.x, pt.y, pt.sz);
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            
            let oldX = p.x;
            let oldY = p.y;
            let wasInside = checkBearCollision(oldX - (width/2 + 50), oldY - height/2);

            p.x += p.vx;
            p.y += p.vy;

            let isInside = checkBearCollision(p.x - (width/2 + 50), p.y - height/2);

            if (wasInside !== isInside) {
                let hitX = p.x;
                let hitY = p.y;
                
                for(let step = 0; step < 4; step++) {
                    let midX = (oldX + hitX) / 2;
                    let midY = (oldY + hitY) / 2;
                    if (checkBearCollision(midX - (width/2 + 50), midY - height/2) === wasInside) {
                        oldX = midX;
                        oldY = midY;
                    } else {
                        hitX = midX;
                        hitY = midY;
                    }
                }

                if (mode === 'quantum') {
                    borderAlpha += 3.0; 
                    if (borderAlpha > 255) borderAlpha = 255;
                }
                
                detectedPoints.push({ 
                    x: hitX, 
                    y: hitY, 
                    sz: mode === 'quantum' ? random(3, 6) : p.w * 0.8, 
                    col: color(0, 212, 255, 180) 
                });
            }

            noStroke();
            fill(p.col);
            circle(p.x, p.y, p.w);

            if (p.x > width + 50) particles.splice(i, 1);
        }

        if (frameCount % 10 === 0) fire();
        
        if (detectedPoints.length > 2000) detectedPoints.shift();

        if (borderAlpha >= 255 && !transitionTriggered) {
            showPopup('transition-popup');
            transitionTriggered = true;
        }
    }

    function checkBearCollision(lx, ly) {
        if (dist(lx, ly, 0, 35) < 45) return true;  
        if (dist(lx, ly, 0, -35) < 32) return true; 
        if (dist(lx, ly, -25, -60) < 11) return true; 
        if (dist(lx, ly, 25, -60) < 11) return true;  
        return false;
    }

    function drawDynamicBear() {
        push();
        translate(width/2 + 50, height/2);
        if (borderAlpha > 1) {
            noFill();
            stroke(0, 212, 255, borderAlpha);
            strokeWeight(2);
            renderBearShapes(); 
        }
        noStroke();
        fill(15, 15, 25); 
        renderBearShapes();
        pop();
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
            vx: mode === 'large' ? 4 : (mode === 'medium' ? 7 : 12),
            vy: random(-0.2, 0.2),
            w: mode === 'large' ? 40 : (mode === 'medium' ? 14 : 5),
            col: mode === 'large' ? color(255, 80, 80, 150) : (mode === 'medium' ? color(100, 180, 255, 180) : color(0, 255, 255, 200))
        };
        particles.push(p);
    }

    function setMode(m) {
        mode = m;
        borderAlpha = 0;
        detectedPoints = [];
        particles = [];
        transitionTriggered = false;
        closePopup('transition-popup');
        document.querySelectorAll('.btn-tool').forEach(b => b.classList.remove('active'));
        document.getElementById('btn-' + m).classList.add('active');
    }

    function showTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.tab-buttons button').forEach(btn => btn.classList.remove('active'));
        document.getElementById(tabId).style.display = 'block';
    }

    function showPopup(id) { document.getElementById(id).style.display = 'block'; }
    function closePopup(id) { document.getElementById(id).style.display = 'none'; }

    // ── QUIZ SYSTEM ──────────────────────────────────
    const QUIZ_DATA = [
        {q:'Main concept?',options:['Quantum Tunneling','Wave-Particle Duality','Uncertainty','Collapse'],answer:1,explanation:'Wave-particle duality explains quantum behavior.'},
        {q:'Why large balls fail?',options:['Slow','Absorbed','Too big for quantum field','No energy'],answer:2,explanation:'Large objects cannot interact with quantum probability field.'},
        {q:'Dots form?',options:['Teleport','Bear shape','Collapse','Disappear'],answer:1,explanation:'Dots accumulate to map the bear gradually.'},
        {q:'Probability field?',options:['Force','Guaranteed','Likelihood region','Magnetic'],answer:2,explanation:'It shows the likely position of the quantum particle.'},
        {q:'de Broglie says?',options:['Waves→matter','Particles have wavelength','Light only wave','Big shorter λ'],answer:1,explanation:'Every particle has an associated wavelength (λ = h/mv).'}
    ];
    let qIdx = 0, qScore = 0, qAnswered = false;

    function openQuiz() {
        qIdx = 0; qScore = 0;
        document.getElementById('quiz-overlay').classList.add('show');
        document.getElementById('quiz-score-screen').style.display = 'none';
        document.getElementById('quiz-q-wrap').style.display = 'block';
        renderQuestion();
    }
    function closeQuiz() {
        document.getElementById('quiz-overlay').classList.remove('show');
    }
    function renderQuestion() {
        const d = QUIZ_DATA[qIdx];
        qAnswered = false;
        document.getElementById('quiz-progress').textContent = (qIdx+1) + ' / ' + QUIZ_DATA.length;
        document.getElementById('quiz-question').textContent = d.q;
        document.getElementById('quiz-explanation').style.display = 'none';
        document.getElementById('quiz-next-btn').style.display = 'none';
        const opts = document.getElementById('quiz-options');
        opts.innerHTML = '';
        d.options.forEach(function(opt, i) {
            var btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.onclick = function() { if (!qAnswered) pickAnswer(i, btn); };
            opts.appendChild(btn);
        });
    }
    function pickAnswer(i, btn) {
        qAnswered = true;
        const d = QUIZ_DATA[qIdx];
        const allBtns = document.querySelectorAll('.quiz-option');
        allBtns.forEach(function(b) { b.disabled = true; });
        if (i === d.answer) {
            btn.classList.add('correct'); qScore++;
        } else {
            btn.classList.add('wrong');
            allBtns[d.answer].classList.add('correct');
        }
        const exp = document.getElementById('quiz-explanation');
        exp.textContent = d.explanation;
        exp.style.display = 'block';
        document.getElementById('quiz-next-btn').style.display = 'block';
        document.getElementById('quiz-next-btn').textContent = qIdx < QUIZ_DATA.length - 1 ? 'Next →' : 'See Results';
    }
    function quizNext() {
        qIdx++;
        if (qIdx < QUIZ_DATA.length) { renderQuestion(); }
        else {
            document.getElementById('quiz-q-wrap').style.display = 'none';
            document.getElementById('quiz-score-screen').style.display = 'block';
            document.getElementById('quiz-score-num').textContent = qScore + ' / ' + QUIZ_DATA.length;
            const msgs = ['Keep exploring!', 'Good effort!', 'Nice work!', 'Great job!', 'Quantum Master!'];
            document.getElementById('quiz-score-msg').textContent = msgs[qScore] || msgs[0];
        }
    }
    function quizRetry() {
        qIdx = 0; qScore = 0;
        document.getElementById('quiz-score-screen').style.display = 'none';
        document.getElementById('quiz-q-wrap').style.display = 'block';
        renderQuestion();
    }
<\/script>

</body>
</html>
`;

export default function Level1Page() {
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
          Initializing Level 1...
        </div>
      </div>
    );
  }

  if (!User) return null;

  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4">
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,251,251,0.1)] border border-outline-variant/20 relative" style={{ height: 'calc(100dvh - 80px)' }}>
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full border-none bg-surface"
          title="Level 1: The Cave Mystery"
          sandbox="allow-scripts allow-same-origin"
          scrolling="yes"
        />
      </div>
      <MrPsiChat currentLevel={1} />
    </div>
  );
}
