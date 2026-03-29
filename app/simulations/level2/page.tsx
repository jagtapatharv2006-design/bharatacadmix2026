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
    <title>The Mystery Cave: Level 2</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"><\/script>
    <style>
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
            line-height: 1.3;
        }

        .tab-buttons {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
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
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: 0.3s ease;
        }

        .tab-buttons button:hover, .tab-buttons button.active {
            background: #00d4ff;
            color: #000;
            box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
        }

        .tab-content {
            background: rgba(0, 212, 255, 0.03);
            border: 1px solid rgba(0, 212, 255, 0.2);
            padding: 15px;
            border-radius: 12px;
            font-size: 0.9rem;
            line-height: 1.5;
            min-height: 240px;
            overflow-y: auto;
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

        .wave-slider-container {
            display: flex;
            flex-direction: column;
            gap: 5px;
            align-items: center;
        }

        .wave-slider-container label {
            font-size: 0.75rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        input[type=range] { width: 100%; cursor: pointer; accent-color: #00d4ff; }

        #quiz-float-btn {
            position: fixed; bottom: 22px; right: 22px; z-index: 300;
            background: linear-gradient(135deg, #00d4ff, #0099cc);
            color: #000; border: none; border-radius: 50px;
            padding: 10px 20px; font-family: inherit; font-weight: 700;
            font-size: 0.82rem; letter-spacing: 1.5px; text-transform: uppercase;
            cursor: pointer; box-shadow: 0 0 20px rgba(0,212,255,0.45); transition: 0.25s;
        }
        #quiz-float-btn:hover { transform: scale(1.06); box-shadow: 0 0 30px rgba(0,212,255,0.7); }
        #quiz-overlay {
            position: fixed; inset: 0; background: rgba(2,2,14,0.96); z-index: 400;
            display: flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
        }
        #quiz-overlay.show { opacity: 1; pointer-events: all; }
        #quiz-box {
            width: min(520px, 92vw); background: #09091a; border: 2px solid #00d4ff;
            border-radius: 16px; padding: 30px 28px;
            box-shadow: 0 0 60px rgba(0,212,255,0.25); position: relative;
        }
        #quiz-close {
            position: absolute; top: 14px; right: 16px; background: transparent;
            border: 1px solid rgba(0,212,255,0.3); color: rgba(0,212,255,0.6);
            border-radius: 50%; width: 30px; height: 30px; font-size: 1em;
            cursor: pointer; font-family: monospace;
            display: flex; align-items: center; justify-content: center; transition: 0.2s;
        }
        #quiz-close:hover { background: rgba(0,212,255,0.1); color: #fff; }
        #quiz-level-tag { font-size: 0.65em; letter-spacing: 3px; text-transform: uppercase; color: rgba(0,212,255,0.5); margin-bottom: 6px; font-family: monospace; }
        #quiz-progress { font-size: 0.7em; color: rgba(255,255,255,0.35); letter-spacing: 2px; text-align: right; margin-bottom: 14px; font-family: monospace; }
        #quiz-question { font-size: 1.05rem; font-weight: 600; color: #fff; margin-bottom: 18px; line-height: 1.45; }
        .quiz-option {
            width: 100%; text-align: left; background: rgba(0,212,255,0.04);
            border: 1px solid rgba(0,212,255,0.2); color: #ccc; border-radius: 8px;
            padding: 10px 14px; margin-bottom: 9px; font-family: inherit;
            font-size: 0.9rem; cursor: pointer; transition: 0.2s; display: block;
        }
        .quiz-option:hover:not(:disabled) { border-color: #00d4ff; color: #fff; background: rgba(0,212,255,0.1); }
        .quiz-option.correct { border-color: #00ff9d; background: rgba(0,255,157,0.12); color: #00ff9d; }
        .quiz-option.wrong   { border-color: #ff4757; background: rgba(255,71,87,0.12); color: #ff4757; }
        #quiz-explanation {
            font-size: 0.85rem; line-height: 1.5; color: #aaa;
            background: rgba(255,255,255,0.04); border-left: 3px solid #00d4ff;
            padding: 10px 14px; border-radius: 0 6px 6px 0; margin-top: 4px; display: none;
        }
        #quiz-next-btn {
            margin-top: 16px; width: 100%; background: #00d4ff; color: #000;
            border: none; border-radius: 8px; padding: 10px; font-family: inherit;
            font-weight: 700; font-size: 0.88rem; letter-spacing: 1px;
            text-transform: uppercase; cursor: pointer; display: none; transition: 0.2s;
        }
        #quiz-next-btn:hover { opacity: 0.85; }
        #quiz-score-screen { text-align: center; display: none; }
        #quiz-score-screen h3 { font-size: 1.3rem; color: #00d4ff; margin-bottom: 10px; letter-spacing: 2px; }
        #quiz-score-num { font-size: 2.8rem; font-weight: 700; color: #fff; font-family: monospace; }
        #quiz-score-msg { font-size: 0.9rem; color: #aaa; margin: 10px 0 20px; }
        #quiz-retry-btn {
            background: transparent; border: 1px solid #00d4ff; color: #00d4ff;
            border-radius: 8px; padding: 9px 24px; font-family: inherit;
            font-weight: 700; cursor: pointer; font-size: 0.85rem;
            letter-spacing: 1px; text-transform: uppercase;
        }
        #quiz-retry-btn:hover { background: #00d4ff; color: #000; }

        .overlay-popup {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: min(450px, 90vw);
            background: rgba(10, 20, 40, 0.98);
            border: 2px solid #00d4ff;
            padding: 25px;
            border-radius: 15px;
            z-index: 200;
            box-shadow: 0 0 40px rgba(0, 212, 255, 0.6);
            display: none;
        }

        .overlay-popup h4 { color: #ffeb3b; margin-bottom: 15px; font-size: 1.2rem; text-transform: uppercase; }
        .overlay-popup p { margin-bottom: 15px; font-size: 0.95rem; line-height: 1.5; color: #fff; }
        
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

        @media (max-width: 900px) {
            #game-container { grid-template-columns: 1fr; }
        }
    <\/style>
<\/head>
<body>

<div id="game-container">
    
    <div id="recap-popup" class="overlay-popup" style="display: block;">
        <h4>Level 2 Preview<\/h4>
        <p><strong>Last Level:<\/strong> You discovered that classical dots fail. Your measurements were just a snapshot.<\/p>
        <p>Now, you must use a <strong>Wave Composer<\/strong> to interfere multiple frequencies into a single, sharp 'Wave Packet' to reveal the bear's true form.<\/p>
        <button class="btn-close" onclick="closePopup('recap-popup')">Start Experiment<\/button>
    <\/div>

    <div id="transition-popup" class="overlay-popup">
        <h4>Level 2 → 3: Wave Packet to Particle in a Box<\/h4>
        <p><strong>The Consequence:<\/strong> The bear's glow is now sharp, but the narrow walls of the cave are beginning to vibrate. The energy is becoming trapped.<\/p>
        <p>In a cave this tight, the bear can no longer flow smoothly—it must snap into place.<\/p>
        <p style="color:#00d4ff; font-weight:bold; font-style:italic;">"Why can the bear only exist in specific patterns (n=1, 2, 3) instead of anywhere it wants?"<\/p>
        <button class="btn-close" onclick="window.top.location.href='/simulations/level3'">Evolve<\/button>
    <\/div>

    <div id="sidebar">
        <h2>Level 2: Glow of Probability<\/h2>
        
        <div class="sidebar-section">
            <div class="tab-buttons">
                <button onclick="showTab('concept')" class="active">Concept<\/button>
                <button onclick="showTab('hint')">Hint<\/button>
                <button onclick="showTab('notes')">Notes<\/button>
            <\/div>

            <div id="concept" class="tab-content">
                <p>You found the bear's shape — but it's still not "real". In quantum physics, a particle is not a single dot. It is a <span class="highlight">wave packet<\/span>, formed by combining many waves.<\/p>
                <p style="margin-top:10px;">A single wave spreads everywhere → <b>blurry bear<\/b>.<br>Multiple waves combine → <b>sharp, localized glow<\/b>.<\/p>
            <\/div>

            <div id="hint" class="tab-content" style="display:none;">
                <p>If the bear looks fuzzy, you're using too few waves.<\/p>
                <p style="margin-top:10px;">Try combining <span class="highlight">different frequencies<\/span>. That's how you "focus" the bear.<\/p>
            <\/div>

            <div id="notes" class="tab-content" style="display:none;">
                <p>This is called <span class="highlight">superposition<\/span>.<\/p>
                <p style="margin-top:10px;">Real particles behave like this — they only appear localized when many waves interfere constructively.<\/p>
                <p class="highlight" style="margin-top:15px; text-align: center;">ψ(x) = Σ A sin(kx + ωt)<\/p>
            <\/div>
        <\/div>
    <\/div>

    <div id="main-content">
        <div id="canvas-wrapper">
            <div id="p5-holder"><\/div>
        <\/div>

        <div id="controls">
            <div class="wave-slider-container">
                <label style="color:#ff6b6b">Frequency-X<\/label>
                <input type="range" id="freq1" min="0.01" max="0.05" step="0.001" value="0.01">
            <\/div>
            <div class="wave-slider-container">
                <label style="color:#48dbfb">Frequency-Y<\/label>
                <input type="range" id="freq2" min="0.05" max="0.1" step="0.001" value="0.05">
            <\/div>
            <div class="wave-slider-container">
                <label style="color:#1dd1a1">Frequency-Z<\/label>
                <input type="range" id="freq3" min="0.1" max="0.2" step="0.001" value="0.1">
            <\/div>
        <\/div>
    <\/div>
<\/div>

<button id="quiz-float-btn" onclick="openQuiz()">&#9883; Quiz<\/button>

<div id="quiz-overlay">
    <div id="quiz-box">
        <button id="quiz-close" onclick="closeQuiz()">&#x2715;<\/button>
        <div id="quiz-level-tag">Level 2 &mdash; Knowledge Check<\/div>
        <div id="quiz-progress"><\/div>
        <div id="quiz-q-wrap">
            <div id="quiz-question"><\/div>
            <div id="quiz-options"><\/div>
            <div id="quiz-explanation"><\/div>
            <button id="quiz-next-btn" onclick="quizNext()">Next &rarr;<\/button>
        <\/div>
        <div id="quiz-score-screen">
            <h3>QUIZ COMPLETE<\/h3>
            <div id="quiz-score-num"><\/div>
            <div id="quiz-score-msg"><\/div>
            <button id="quiz-retry-btn" onclick="quizRetry()">&#x21ba; Try Again<\/button>
        <\/div>
    <\/div>
<\/div>

<script>
    let f1, f2, f3;
    let bearGlow = 0;
    let transitionTriggered = false;

    function setup() {
        let canvas = createCanvas(800, 480);
        canvas.parent('p5-holder');
    }

    function showTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.tab-buttons button').forEach(btn => btn.classList.remove('active'));
        document.getElementById(tabId).style.display = 'block';
        if(event) event.currentTarget.classList.add('active');
    }

    function draw() {
        background(5, 5, 12);
        
        stroke(255, 255, 255, 15);
        for(let i=0; i<width; i+=40) line(i, 0, i, height);
        for(let j=0; j<height; j+=40) line(0, j, width, j);

        f1 = parseFloat(document.getElementById('freq1').value);
        f2 = parseFloat(document.getElementById('freq2').value);
        f3 = parseFloat(document.getElementById('freq3').value);

        let success = (f1 > 0.03 && f2 > 0.08 && f3 > 0.17);
        if(success) {
            bearGlow = lerp(bearGlow, 255, 0.04);
        } else {
            bearGlow = lerp(bearGlow, 30, 0.04);
        }

        drawDynamicBear(bearGlow);
        drawWave(f1, color(255, 107, 107, 60));
        drawWave(f2, color(72, 219, 251, 60));
        drawWave(f3, color(29, 209, 161, 60));
        drawSuperposition(f1, f2, f3, bearGlow);

        if (bearGlow > 240 && !transitionTriggered) {
            showPopup('transition-popup');
            transitionTriggered = true;
        }
    }

    function drawWave(freq, col) {
        push();
        noFill();
        stroke(col);
        beginShape();
        for (let x = 0; x < width; x++) {
            let y = height / 2 + sin(x * freq + frameCount * 0.05) * 40;
            vertex(x, y);
        }
        endShape();
        pop();
    }

    function drawSuperposition(freq1, freq2, freq3, glow) {
        push();
        noFill();
        stroke(0, 212, 255, 200);
        strokeWeight(3);
        
        if(glow > 100) {
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = 'rgba(0, 212, 255, 0.8)';
        }
        
        beginShape();
        for (let x = 0; x < width; x++) {
            let combined = (sin(x * freq1 + frameCount * 0.05) + 
                            sin(x * freq2 + frameCount * 0.05) + 
                            sin(x * freq3 + frameCount * 0.05)) / 3;
            
            let env = exp(-pow((x - (width/2 + 50)) / 120, 2));
            let y = height / 2 + (combined * 150 * env);
            vertex(x, y);
        }
        endShape();
        pop();
    }

    function drawDynamicBear(glow) {
        push();
        translate(width/2 + 50, height/2);
        
        if (glow > 1) {
            noFill();
            stroke(0, 212, 255, glow);
            strokeWeight(3);
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = 'rgba(0, 212, 255, 0.8)';
            renderBearShapes(); 
            drawingContext.shadowBlur = 0;
        }

        noStroke();
        fill(25, 25, 35); 
        renderBearShapes();
        pop();
    }

    function renderBearShapes() {
        circle(0, 35, 90);    
        circle(0, -35, 65);   
        circle(-25, -60, 22); 
        circle(25, -60, 22);  
    }

    function showPopup(id) { document.getElementById(id).style.display = 'block'; }
    function closePopup(id) { document.getElementById(id).style.display = 'none'; }

    const QUIZ_DATA = [
        {q:'Wave packet?',options:['Single wave','Combination waves','Fast particle','Black hole'],answer:1,explanation:'Wave packet = many waves combined.'},
        {q:'One wave effect?',options:['Clear','Blurry','Point','Disappear'],answer:1,explanation:'Single wave spreads everywhere, making the bear blurry.'},
        {q:'More waves do?',options:['Energy','Sharp location','Speed','Light'],answer:1,explanation:'Interference between waves sharpens the peak location.'},
        {q:'Superposition?',options:['Multiply','Divide','Add waves','Remove'],answer:2,explanation:'Superposition means waves are added together.'},
        {q:'Principle shown?',options:['Pauli','Uncertainty','Bohr','Photoelectric'],answer:1,explanation:'The frequency trade-off demonstrates the uncertainty principle.'}
    ];
    let qIdx = 0, qScore = 0, qAnswered = false;

    function openQuiz() {
        qIdx = 0; qScore = 0;
        document.getElementById('quiz-overlay').classList.add('show');
        document.getElementById('quiz-score-screen').style.display = 'none';
        document.getElementById('quiz-q-wrap').style.display = 'block';
        renderQuestion();
    }
    function closeQuiz() { document.getElementById('quiz-overlay').classList.remove('show'); }
    function renderQuestion() {
        const d = QUIZ_DATA[qIdx]; qAnswered = false;
        document.getElementById('quiz-progress').textContent = (qIdx+1) + ' / ' + QUIZ_DATA.length;
        document.getElementById('quiz-question').textContent = d.q;
        document.getElementById('quiz-explanation').style.display = 'none';
        document.getElementById('quiz-next-btn').style.display = 'none';
        const opts = document.getElementById('quiz-options'); opts.innerHTML = '';
        d.options.forEach(function(opt, i) {
            var btn = document.createElement('button');
            btn.className = 'quiz-option'; btn.textContent = opt;
            btn.onclick = function() { if (!qAnswered) pickAnswer(i, btn); };
            opts.appendChild(btn);
        });
    }
    function pickAnswer(i, btn) {
        qAnswered = true;
        const d = QUIZ_DATA[qIdx];
        const allBtns = document.querySelectorAll('.quiz-option');
        allBtns.forEach(function(b) { b.disabled = true; });
        if (i === d.answer) { btn.classList.add('correct'); qScore++; }
        else { btn.classList.add('wrong'); allBtns[d.answer].classList.add('correct'); }
        const exp = document.getElementById('quiz-explanation');
        exp.textContent = d.explanation; exp.style.display = 'block';
        const nxt = document.getElementById('quiz-next-btn');
        nxt.style.display = 'block';
        nxt.textContent = qIdx < QUIZ_DATA.length - 1 ? 'Next \u2192' : 'See Results';
    }
    function quizNext() {
        qIdx++;
        if (qIdx < QUIZ_DATA.length) { renderQuestion(); }
        else {
            document.getElementById('quiz-q-wrap').style.display = 'none';
            document.getElementById('quiz-score-screen').style.display = 'block';
            document.getElementById('quiz-score-num').textContent = qScore + ' / ' + QUIZ_DATA.length;
            const msgs = ['Keep exploring!','Good effort!','Nice work!','Great job!','Quantum Master!'];
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

<\/body>
<\/html>
`;

export default function Level2Page() {
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
                    Initializing Level 2...
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
                    title="Level 2: The Glow of Probability"
                    sandbox="allow-scripts allow-same-origin"
                    scrolling="yes"
                />
            </div>
            <MrPsiChat currentLevel={2} />
        </div>
    );
}