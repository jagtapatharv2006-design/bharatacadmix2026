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
    <title>Quantum Safari: Level 3</title>
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
            box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
        }

        #sidebar h2 { 
            color: #fff; 
            font-size: 1.2rem; 
            letter-spacing: 2px; 
            margin-bottom: 20px; 
            text-transform: uppercase;
            text-shadow: 0 0 10px rgba(0,255,157,0.5);
        }

        .tab-buttons { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 20px; }
        .tab-buttons button { background: rgba(0, 255, 157, 0.05); border: 1px solid rgba(0, 255, 157, 0.3); color: #00ff9d; padding: 8px; border-radius: 8px; cursor: pointer; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; transition: 0.3s ease; }
        .tab-buttons button:hover, .tab-buttons button.active { background: #00ff9d; color: #000; box-shadow: 0 0 15px rgba(0,255,157,0.4); }

        .tab-content { background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(0, 255, 157, 0.1); padding: 15px; border-radius: 12px; font-size: 0.85rem; line-height: 1.6; flex-grow: 1; color: #bbb; }
        .highlight { color: #00ff9d; font-weight: bold; }

        /* Status & Hardware UI */
        .hardware-panel { background: #0a0a0f; border: 1px solid #333; border-radius: 12px; padding: 15px; margin-top: 15px; }
        .panel-header { font-size: 0.65rem; color: #666; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; display: flex; justify-content: space-between; }
        
        .state-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px; }
        .state-box { background: #111; border: 1px solid #333; border-radius: 6px; padding: 10px 5px; text-align: center; transition: 0.3s; }
        .state-box .lbl { font-size: 0.6rem; color: #666; display: block; margin-bottom: 3px; }
        .state-box .val { font-size: 0.9rem; font-weight: bold; font-family: monospace; color: #444; }
        .state-box.locked { background: rgba(0, 255, 157, 0.1); border-color: #00ff9d; box-shadow: inset 0 0 15px rgba(0,255,157,0.2); }
        .state-box.locked .lbl { color: #00ff9d; }
        .state-box.locked .val { color: #fff; text-shadow: 0 0 5px #00ff9d; }

        .resonance-meter { width: 100%; height: 6px; background: #222; border-radius: 3px; overflow: hidden; position: relative; margin-bottom: 5px; }
        #res-fill { height: 100%; width: 0%; background: #ff4757; transition: 0.1s ease-out; }
        #res-fill.high { background: #00ff9d; box-shadow: 0 0 10px #00ff9d; }

        #main-content { display: flex; flex-direction: column; gap: 15px; justify-content: center; }

        #canvas-wrapper {
            background: #020203;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: inset 0 0 50px rgba(0,0,0,1);
            position: relative;
        }

        /* CRT Overlay effect */
        .scanlines {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 4px, 6px 100%;
            pointer-events: none; z-index: 10; opacity: 0.4;
        }

        #controls {
            display: grid; grid-template-columns: 1fr 1fr auto; gap: 20px;
            background: rgba(255,255,255,0.02); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);
            align-items: end;
        }

        .knob-container { display: flex; flex-direction: column; gap: 10px; }
        .knob-container label { font-size: 0.7rem; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #aaa; display: flex; justify-content: space-between;}
        .val-display { color: #00ff9d; font-family: monospace; }

        input[type=range] { width: 100%; cursor: pointer; height: 4px; border-radius: 2px; appearance: none; background: #444; outline: none; }
        input[type=range]::-webkit-slider-thumb { appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #fff; border: 2px solid #000; cursor: pointer; transition: 0.2s; }
        input[type=range]:hover::-webkit-slider-thumb { transform: scale(1.2); box-shadow: 0 0 10px rgba(255,255,255,0.5); }
        
        #btn-capture {
            background: #222; color: #555; border: 1px solid #444; padding: 15px 30px; border-radius: 8px; font-weight: 900;
            text-transform: uppercase; letter-spacing: 2px; cursor: not-allowed; transition: 0.3s; height: 50px;
        }
        #btn-capture.ready {
            background: #00ff9d; color: #000; border-color: #00ff9d; cursor: pointer;
            box-shadow: 0 0 20px rgba(0,255,157,0.4); animation: pulse 1s infinite;
        }
        #btn-capture.ready:hover { background: #fff; transform: translateY(-2px); }

        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(0,255,157,0.7); } 70% { box-shadow: 0 0 0 15px rgba(0,255,157,0); } 100% { box-shadow: 0 0 0 0 rgba(0,255,157,0); } }

        /* Popups */
        .overlay-popup { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 500px; background: rgba(10, 10, 15, 0.95); backdrop-filter: blur(10px); border: 1px solid #00ff9d; padding: 35px; border-radius: 20px; z-index: 200; display: none; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8); }
        .overlay-popup h4 { color: #00ff9d; font-size: 1.2rem; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 2px; }
        .overlay-popup p { font-size: 0.95rem; line-height: 1.6; margin-bottom: 15px; color: #ccc; }
        .btn-action { background: #00ff9d; color: #000; border: none; padding: 10px 25px; border-radius: 8px; cursor: pointer; float: right; font-weight: bold; text-transform: uppercase; margin-top: 10px; transition: 0.2s; }

        /* Quiz */
        #quiz-float-btn { position: fixed; bottom: 25px; right: 25px; z-index: 300; background: #c084fc; color: #000; border: none; border-radius: 50px; padding: 12px 24px; font-weight: 900; font-size: 0.85rem; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; box-shadow: 0 0 20px rgba(192,132,252,0.4); }
        #quiz-overlay { position: fixed; inset: 0; background: rgba(5,5,8,0.98); z-index: 400; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
        #quiz-overlay.show { opacity: 1; pointer-events: all; }
        #quiz-box { width: min(520px, 92vw); background: #0a0a0f; border: 1px solid #c084fc; border-radius: 20px; padding: 35px; position: relative; }
        .quiz-option { width: 100%; text-align: left; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: #ccc; border-radius: 10px; padding: 14px; margin-bottom: 10px; cursor: pointer; transition: 0.2s; }
        .quiz-option:hover:not(:disabled) { border-color: #c084fc; background: rgba(192,132,252,0.1); color: #fff;}
        .quiz-option.correct { border-color: #00ff9d; background: rgba(0,255,157,0.1); color: #00ff9d; }
        .quiz-option.wrong { border-color: #ff4757; background: rgba(255,71,87,0.1); color: #ff4757; }
        #quiz-next-btn { margin-top: 20px; width: 100%; background: #c084fc; color: #000; border: none; border-radius: 10px; padding: 14px; font-weight: 800; text-transform: uppercase; cursor: pointer; display: none; }
    </style>
</head>
<body>

<div id="game-container">
    <div id="intro-popup" class="overlay-popup" style="display: ${initialCompletion ? 'none' : 'block'};">
        <h4>Chamber 3: The Infinite Well</h4>
        <p>A probability wave is trapped between two impenetrable barriers.</p>
        <p>Unless the wave exactly matches the boundary conditions (amplitude = 0 at the walls), reflections cause chaotic destructive interference.</p>
        <p><strong>Operator Task:</strong> Use the Coarse and Fine tuners to inject specific energy. Watch the interference pattern. When resonance peaks above 95%, manually lock the state to capture $n=1$, $n=2$, and $n=3$.</p>
        <button class="btn-action" onclick="closePopup('intro-popup')">Initialize Sequence</button>
    </div>

    <div id="win-popup" class="overlay-popup">
        <h4 style="color: #00ff9d;">Quantization Verified</h4>
        <p>You have successfully mapped the discrete energy states of the system.</p>
        <p>Confinement forces quantization. The particle cannot possess arbitrary energy—it is locked into specific harmonic states.</p>
        <button class="btn-action" onclick="window.parent.postMessage({type: 'NEXT_LEVEL'}, '*')">Proceed to Level 4</button>
    </div>

    <div id="sidebar">
        <h2>System Architecture</h2>
        <div class="tab-buttons">
            <button onclick="showTab('concept')" class="active">Concept</button>
            <button onclick="showTab('hint')">Hint</button>
            <button onclick="showTab('notes')">Math</button>
        </div>
        <div id="concept" class="tab-content">
            <p>If a wave doesn't "fit" perfectly inside the box, it reflects back on itself out-of-phase, destroying the probability density.</p><br>
            <p>Only specific frequencies form stable <span class="highlight">Standing Waves</span>.</p>
        </div>
        <div id="hint" class="tab-content" style="display:none;">
            <p>Use the Coarse tuner to get the energy close, then the Fine tuner to maximize Resonance.</p><br>
            <p>Look for the chaotic red waves to snap together into a single, glowing green beam. Once the capture button flashes, click it!</p>
        </div>
        <div id="notes" class="tab-content" style="display:none;">
            <p style="text-align: center; font-size: 1.1rem; margin: 10px 0;" class="highlight">E<sub>n</sub> = n² (h² / 8mL²)</p>
            <p>Notice how energy scales. If n=1 is at E=10, then n=2 will be at E=40 (2² × 10), and n=3 at E=90 (3² × 10).</p>
        </div>

        <div class="hardware-panel">
            <div class="panel-header"><span>Resonance Coherence</span> <span id="res-val-txt">0.0%</span></div>
            <div class="resonance-meter"><div id="res-fill"></div></div>
            
            <div class="panel-header" style="margin-top:20px;">State Database</div>
            <div class="state-grid">
                <div class="state-box" id="sb-1"><span class="lbl">Ground State (n=1)</span><span class="val">--</span></div>
                <div class="state-box" id="sb-2"><span class="lbl">Excited (n=2)</span><span class="val">--</span></div>
                <div class="state-box" id="sb-3"><span class="lbl">Excited (n=3)</span><span class="val">--</span></div>
            </div>
        </div>
    </div>

    <div id="main-content">
        <div id="canvas-wrapper">
            <div class="scanlines"></div>
            <div id="p5-holder"></div>
        </div>
        <div id="controls">
            <div class="knob-container">
                <label><span>Coarse Injection</span> <span class="val-display" id="val-coarse">10</span></label>
                <input type="range" id="slider-coarse" min="1" max="200" step="1" value="5">
            </div>
            <div class="knob-container">
                <label><span>Fine Tune (μeV)</span> <span class="val-display" id="val-fine">0.0</span></label>
                <input type="range" id="slider-fine" min="-5" max="5" step="0.1" value="0">
            </div>
            <button id="btn-capture" onclick="captureState()">Lock State</button>
        </div>
    </div>
</div>

<button id="quiz-float-btn" onclick="openQuiz()">⚛ Knowledge Quiz</button>

<div id="quiz-overlay">
    <div id="quiz-box">
        <button id="quiz-close" onclick="closeQuiz()" style="position:absolute; right:20px; top:20px; background:none; border:none; color:#888; font-size:1.5rem; cursor:pointer;">✕</button>
        <h3 style="color:#c084fc; margin-bottom: 20px; font-size: 1rem; letter-spacing: 2px;">LEVEL 3 ASSESSMENT</h3>
        <div id="quiz-q-wrap">
            <div id="quiz-question" style="font-size: 1.1rem; color: #fff; margin-bottom: 20px;"></div>
            <div id="quiz-options"></div>
            <button id="quiz-next-btn" onclick="quizNext()">Next Question →</button>
        </div>
        <div id="quiz-score-screen" style="display:none; text-align:center;">
            <h3 style="color: #fff; margin-bottom: 10px;">ASSESSMENT COMPLETE</h3>
            <div id="quiz-score-num" style="font-size: 3rem; font-weight: 900; color: #00ff9d;"></div>
            <button class="btn-action" style="float:none; margin-top: 20px;" onclick="closeQuiz()">Submit Telemetry</button>
        </div>
    </div>
</div>

<script>
    // --- P5.JS PHYSICS ENGINE: CHAOS & RESONANCE ---
    let hasWon = ${initialCompletion}; 
    let statesCaptured = [false, false, false];
    
    // Physical Constants for simulation
    const L = 600; // Well width (pixels)
    const BASE_E = 12.5; // Energy for n=1
    const TARGETS = [BASE_E * 1, BASE_E * 4, BASE_E * 9]; // n^2 scaling
    
    let time = 0;
    let startX, endX;
    let currentResonance = 0;
    let activeTargetN = 0;

    // DOM Elements
    let sCoarse, sFine, vCoarse, vFine, rFill, rTxt, btnCap;

    function setup() {
        let canvas = createCanvas(820, 380);
        canvas.parent('p5-holder');
        startX = (width - L) / 2;
        endX = startX + L;

        sCoarse = document.getElementById('slider-coarse');
        sFine = document.getElementById('slider-fine');
        vCoarse = document.getElementById('val-coarse');
        vFine = document.getElementById('val-fine');
        rFill = document.getElementById('res-fill');
        rTxt = document.getElementById('res-val-txt');
        btnCap = document.getElementById('btn-capture');
        
        if (hasWon) {
            statesCaptured = [true, true, true];
            sCoarse.disabled = true; sFine.disabled = true; btnCap.disabled = true;
            document.getElementById('sb-1').classList.add('locked'); document.getElementById('sb-1').querySelector('.val').innerText = TARGETS[0].toFixed(1) + " eV";
            document.getElementById('sb-2').classList.add('locked'); document.getElementById('sb-2').querySelector('.val').innerText = TARGETS[1].toFixed(1) + " eV";
            document.getElementById('sb-3').classList.add('locked'); document.getElementById('sb-3').querySelector('.val').innerText = TARGETS[2].toFixed(1) + " eV";
            updateParentProgress();
        }
    }

    function draw() {
        background(5, 5, 8);
        time += 0.1;
        
        // Scope Grid
        stroke(255, 255, 255, 15);
        strokeWeight(1);
        for(let i=0; i<width; i+=20) line(i, 0, i, height);
        for(let j=0; j<height; j+=20) {
            strokeWeight(j === height/2 ? 2 : 1);
            stroke(j === height/2 ? color(255,255,255,40) : color(255,255,255,15));
            line(0, j, width, j);
        }

        // Calculate Energy
        let eCoarse = parseFloat(sCoarse.value);
        let eFine = parseFloat(sFine.value);
        let totalEnergy = eCoarse + eFine;
        if(totalEnergy < 0) totalEnergy = 0;

        vCoarse.innerText = eCoarse;
        vFine.innerText = eFine > 0 ? "+" + eFine.toFixed(1) : eFine.toFixed(1);

        // Calculate Resonance
        let n_float = Math.sqrt(totalEnergy / BASE_E);
        let n_nearest = Math.round(n_float);
        let error = Math.abs(n_float - n_nearest);
        
        // Convert error to resonance percentage (sharp falloff)
        let resRaw = map(error, 0, 0.15, 100, 0, true);
        
        // Smoothing for meter display
        currentResonance = lerp(currentResonance, resRaw, 0.1);
        
        // Check if we are near a valid, uncaught state
        let isValidState = (n_nearest >= 1 && n_nearest <= 3 && !statesCaptured[n_nearest - 1]);
        if (!isValidState) resRaw = 0; // Force 0 if they try to catch an invalid or already caught state

        updateHUD(totalEnergy, currentResonance, n_nearest, isValidState);

        // --- RENDER PHYSICS ---
        let k = n_float * PI / L; 
        
        // Draw Walls
        strokeWeight(4);
        stroke(resRaw > 95 ? color(0, 255, 157) : color(100, 100, 150));
        line(startX, 40, startX, height - 40);
        line(endX, 40, endX, height - 40);

        // Draw Waves
        push();
        noFill();
        let numReflections = Math.floor(map(currentResonance, 100, 0, 1, 6)); // Chaos = more messy waves
        
        for (let j = 0; j < numReflections; j++) {
            let isPrimary = (j === 0);
            
            // If high resonance, snap to pure standing wave
            let amplitude = isPrimary ? 120 : map(currentResonance, 100, 0, 0, 40);
            let timeMod = isPrimary ? cos(time) : cos(time * random(0.8, 1.2));
            let phaseOffset = isPrimary ? 0 : random(-PI, PI) * map(currentResonance, 100, 0, 0, 1);
            
            if (isPrimary && currentResonance > 95) {
                stroke(0, 255, 157, 255);
                strokeWeight(5);
                drawingContext.shadowBlur = 25;
                drawingContext.shadowColor = '#00ff9d';
                // Snap visual k to perfect target to feel satisfying
                k = n_nearest * PI / L; 
            } else {
                stroke(255, 71, 87, map(j, 0, numReflections, 150, 30));
                strokeWeight(2);
                drawingContext.shadowBlur = 0;
            }

            beginShape();
            for (let x = startX; x <= endX; x+=5) {
                let y = height/2 + sin((x - startX) * k + phaseOffset) * amplitude * timeMod;
                
                // Force nodes at boundaries if resonant, otherwise let them break out
                if (isPrimary && currentResonance > 80) {
                    let dist = Math.min(x - startX, endX - x);
                    if (dist < 40) y = lerp(height/2, y, dist/40);
                }
                vertex(x, y);
            }
            endShape();
        }
        pop();
    }

    function updateHUD(energy, res, n, isValid) {
        rFill.style.width = res + '%';
        rTxt.innerText = res.toFixed(1) + "%";
        
        if (res > 95 && isValid && !hasWon) {
            rFill.className = 'high';
            btnCap.classList.add('ready');
            btnCap.disabled = false;
            btnCap.innerText = "LOCK n=" + n;
            activeTargetN = n;
        } else {
            rFill.className = '';
            btnCap.classList.remove('ready');
            btnCap.disabled = true;
            btnCap.innerText = "SEEKING...";
            activeTargetN = 0;
        }
    }

    function captureState() {
        if (activeTargetN > 0 && activeTargetN <= 3) {
            let idx = activeTargetN - 1;
            statesCaptured[idx] = true;
            
            // Update UI Database
            let box = document.getElementById('sb-' + activeTargetN);
            box.classList.add('locked');
            let totalE = parseFloat(sCoarse.value) + parseFloat(sFine.value);
            box.querySelector('.val').innerText = totalE.toFixed(1) + " eV";
            
            // visual flash
            document.getElementById('canvas-wrapper').style.background = '#002211';
            setTimeout(() => document.getElementById('canvas-wrapper').style.background = '#020203', 200);

            updateParentProgress();
            
            if (statesCaptured[0] && statesCaptured[1] && statesCaptured[2]) {
                hasWon = true;
                sCoarse.disabled = true; sFine.disabled = true;
                setTimeout(() => {
                    showPopup('win-popup');
                    window.parent.postMessage({type: 'LEVEL_COMPLETE'}, '*');
                }, 1000);
            }
        }
    }

    function updateParentProgress() {
        let count = statesCaptured.filter(Boolean).length;
        let pct = Math.floor((count / 3) * 100);
        window.parent.postMessage({type: 'COHERENCE_UPDATE', percent: pct}, '*');
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
        {q:'Why does the wave look chaotic when not perfectly tuned?', options:['The particle is moving too fast','Reflections from the boundaries cause destructive interference','Gravity distorts the wavefunction'], answer:1},
        {q:'How does the energy scale as you move from n=1 to n=2?', options:['It doubles','It stays the same','It quadruples (scales with n²)'], answer:2},
        {q:'A completely locked Standing Wave has zero probability amplitude at the edges. These zero points are called:', options:['Anti-nodes','Crests','Nodes'], answer:2}
    ];
    let qIdx = 0, qScore = 0;

    function openQuiz() { qIdx = 0; qScore = 0; document.getElementById('quiz-overlay').classList.add('show'); document.getElementById('quiz-score-screen').style.display = 'none'; document.getElementById('quiz-q-wrap').style.display = 'block'; renderQuestion(); }
    function closeQuiz() { document.getElementById('quiz-overlay').classList.remove('show'); }
    
    function renderQuestion() {
        const d = QUIZ_DATA[qIdx];
        document.getElementById('quiz-question').textContent = (qIdx+1) + ". " + d.q;
        const opts = document.getElementById('quiz-options');
        opts.innerHTML = '';
        document.getElementById('quiz-next-btn').style.display = 'none';
        d.options.forEach((opt, i) => {
            let btn = document.createElement('button');
            btn.className = 'quiz-option'; btn.textContent = opt;
            btn.onclick = () => pickAnswer(i, btn);
            opts.appendChild(btn);
        });
    }

    function pickAnswer(i, btn) {
        const d = QUIZ_DATA[qIdx];
        const allBtns = document.querySelectorAll('.quiz-option');
        allBtns.forEach(b => b.disabled = true);
        if (i === d.answer) { btn.classList.add('correct'); qScore++; } 
        else { btn.classList.add('wrong'); allBtns[d.answer].classList.add('correct'); }
        document.getElementById('quiz-next-btn').style.display = 'block';
        document.getElementById('quiz-next-btn').textContent = qIdx < QUIZ_DATA.length - 1 ? 'Next Question →' : 'Compute Telemetry';
    }

    function quizNext() {
        qIdx++;
        if (qIdx < QUIZ_DATA.length) { renderQuestion(); } 
        else {
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
export default function Level3Page() {
  const { User, isloading } = useAuth();
  const router = useRouter();
  
  // Telemetry State
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  // Auth Protection
  useEffect(() => {
    if (!isloading && !User) {
      router.push("/");
    }
  }, [User, isloading, router]);

  // Load persistence data
  useEffect(() => {
    if (User) {
      const savedData = JSON.parse(localStorage.getItem(`qsafari_lvl3_${User.uid}`)) || {};
      if (savedData.completed) {
        setIsCompleted(true);
        setProgress(100);
      }
      if (savedData.quizScore !== undefined) setQuizScore(savedData.quizScore);
    }
  }, [User]);

  // Handle cross-frame comms
  useEffect(() => {
    const handleIframeMessage = (event) => {
      const { type, percent, score, max } = event.data;

      if (type === 'COHERENCE_UPDATE') {
        setProgress(percent);
      } 
      else if (type === 'LEVEL_COMPLETE') {
        setIsCompleted(true);
        if (User) {
          const existing = JSON.parse(localStorage.getItem(`qsafari_lvl3_${User.uid}`)) || {};
          localStorage.setItem(`qsafari_lvl3_${User.uid}`, JSON.stringify({ ...existing, completed: true }));
        }
      } 
      else if (type === 'QUIZ_COMPLETE') {
        const scoreString = `${score}/${max}`;
        setQuizScore(scoreString);
        if (User) {
          const existing = JSON.parse(localStorage.getItem(`qsafari_lvl3_${User.uid}`)) || {};
          localStorage.setItem(`qsafari_lvl3_${User.uid}`, JSON.stringify({ ...existing, quizScore: scoreString }));
        }
      }
      else if (type === 'NEXT_LEVEL') {
        router.push("/simulations/level4");
      }
    };

    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, [User, router]);

  if (isloading || !User) {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center font-mono text-[#00ff9d]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="w-16 h-16 border-t-2 border-r-2 border-[#00ff9d] rounded-full mb-6 shadow-[0_0_15px_rgba(0,255,157,0.5)]" />
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="tracking-[0.3em] uppercase text-sm font-bold">
          Configuring Resonance Chamber...
        </motion.div>
      </div>
    );
  }

  const dynamicHtml = getSimulationHTML(quizScore, isCompleted);

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center w-full px-4 pt-24 pb-12 selection:bg-[#00ff9d]/30">
      
      {/* ═══════════ OPERATOR TELEMETRY HUD ═══════════ */}
      <div className="w-full max-w-6xl mb-6 bg-[#0a0a0f]/90 backdrop-blur-md border border-[#00ff9d]/20 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_0_30px_rgba(0,255,157,0.05)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#00ff9d]/10 border border-[#00ff9d]/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.2)]">
            <span className="material-symbols-outlined text-[#00ff9d]">align_horizontal_center</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00ff9d]">Energy Quantization</h1>
            <div className="text-xs text-gray-500 font-mono tracking-widest mt-1 uppercase">
              Operator: {User.displayName || "Unknown"}
            </div>
          </div>
        </div>
        
        <div className="flex gap-6 items-center bg-[#050508] px-6 py-3 rounded-xl border border-white/5">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Status</span>
            <span className={`text-sm font-bold tracking-widest uppercase ${isCompleted ? 'text-[#00ff9d] drop-shadow-[0_0_8px_rgba(0,255,157,0.5)]' : 'text-[#ff4757]'}`}>
              {isCompleted ? "Locked" : "Unstable"}
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">States Mapped</span>
            <span className="text-sm font-bold font-mono text-[#00ff9d]">{progress}%</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Quiz Score</span>
            <span className="text-sm font-bold font-mono text-[#c084fc]">{quizScore || "--/3"}</span>
          </div>
        </div>
      </div>

      {/* ═══════════ IFRAME SIMULATION ═══════════ */}
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5 relative" style={{ height: '700px' }}>
        <iframe
          srcDoc={dynamicHtml}
          className="w-full h-full border-none bg-transparent"
          title="Level 3: Quantized Energy States"
          sandbox="allow-scripts allow-same-origin"
          scrolling="no"
        />
      </div>

      <div className="w-full max-w-6xl mt-8">
        <MrPsiChat currentLevel={3} />
      </div>

    </div>
  );
}