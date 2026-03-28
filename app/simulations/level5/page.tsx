"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MrPsiChat from "@/app/componenets/MrPsiChat";

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Schrödinger's Cave — Level 5: Quantum Tunneling</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"><\/script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Rajdhani:wght@300;500;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --cyan: #00d4ff;
            --yellow: #ffeb3b;
            --red: #ff4757;
            --orange: #ff6b35;
            --green: #00ff9d;
            --dim: #1a1a2e;
            --bg: #05050c;
            --glass: rgba(255,255,255,0.04);
            --border: rgba(255,107,53,0.25);
        }

        body {
            font-family: 'Rajdhani', sans-serif;
            background: var(--bg);
            color: #e0e0e0;
            overflow-x: hidden;
            min-height: 100vh;
        }

        #header { text-align: center; padding: 18px 0 10px; }
        #header .level-tag {
            font-family: 'Space Mono', monospace;
            font-size: 0.62em; letter-spacing: 4px;
            color: var(--orange); opacity: 0.75; margin-bottom: 4px;
        }
        #header h1 {
            font-family: 'Space Mono', monospace;
            font-size: 1.05em; letter-spacing: 5px;
            color: var(--cyan);
            text-shadow: 0 0 20px rgba(0,212,255,0.4);
        }

        #app {
            display: flex; flex-direction: column;
            align-items: center; gap: 12px;
            padding: 0 20px 30px;
        }

        #canvas-wrapper {
            position: relative;
            border: 1px solid var(--border);
            border-radius: 8px; background: #000;
            box-shadow: 0 0 40px rgba(255,107,53,0.07);
            overflow: hidden;
        }
        #mode-badge {
            position: absolute; top: 12px; left: 14px;
            font-family: 'Space Mono', monospace;
            font-size: 0.7em; color: var(--cyan); opacity: 0.7;
            pointer-events: none;
        }
        #energy-badge {
            position: absolute; top: 12px; right: 14px;
            font-family: 'Space Mono', monospace;
            font-size: 0.7em; color: var(--orange); opacity: 0.85;
            pointer-events: none;
        }

        #controls {
            display: flex; gap: 14px; align-items: stretch;
            width: 100%; max-width: 820px;
        }
        .ctrl-group {
            background: var(--glass);
            border: 1px solid var(--border);
            border-radius: 8px; padding: 12px 16px;
            display: flex; flex-direction: column; gap: 8px;
        }
        .ctrl-label {
            font-size: 0.68em; letter-spacing: 2px;
            color: rgba(255,107,53,0.6); text-transform: uppercase;
        }

        #energy-group { flex: 1.4; }
        #energySlider {
            width: 100%; cursor: pointer;
            accent-color: var(--orange);
            -webkit-appearance: none; appearance: none;
            height: 4px; border-radius: 2px;
            background: linear-gradient(to right, rgba(255,71,87,0.4), rgba(255,107,53,0.8), rgba(255,235,59,0.5));
        }
        #energySlider::-webkit-slider-thumb {
            -webkit-appearance: none; width: 18px; height: 18px;
            border-radius: 50%; background: var(--orange);
            box-shadow: 0 0 10px rgba(255,107,53,0.7);
            cursor: pointer;
        }
        .sl-readout {
            font-family: 'Space Mono', monospace; font-size: 0.7em;
            color: rgba(255,107,53,0.6); text-align: right;
        }

        #barrier-group { flex: 1; }
        .barrier-btns { display: flex; gap: 6px; }
        .b-btn {
            flex: 1; padding: 8px 0; background: transparent;
            border: 1px solid rgba(255,107,53,0.3);
            color: rgba(255,107,53,0.6); border-radius: 5px;
            font-family: 'Space Mono', monospace; font-size: 0.8em;
            cursor: pointer; transition: all 0.2s;
        }
        .b-btn:hover { border-color: var(--orange); color: var(--orange); }
        .b-btn.active {
            background: var(--orange); color: #000;
            border-color: var(--orange);
            box-shadow: 0 0 12px rgba(255,107,53,0.4);
        }

        #action-group { display: flex; gap: 8px; flex-direction: column; justify-content: space-between; }
        .btn {
            padding: 9px 20px; border: none; border-radius: 5px;
            cursor: pointer; font-family: 'Rajdhani', sans-serif;
            font-weight: 700; font-size: 0.85em; letter-spacing: 1px;
            transition: all 0.2s; text-transform: uppercase; white-space: nowrap;
        }
        .btn-tunnel {
            background: var(--orange); color: #000;
            box-shadow: 0 0 15px rgba(255,107,53,0.3);
        }
        .btn-tunnel:hover { box-shadow: 0 0 25px rgba(255,107,53,0.6); transform: scale(1.02); }
        .btn-tunnel:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
        .btn-reset-bear {
            background: transparent; border: 1px solid rgba(0,212,255,0.3);
            color: rgba(0,212,255,0.6);
        }
        .btn-reset-bear:hover { border-color: var(--cyan); color: var(--cyan); }

        #task-bar {
            font-family: 'Space Mono', monospace; font-size: 0.72em;
            color: rgba(255,107,53,0.6); letter-spacing: 1px;
            border: 1px dashed rgba(255,107,53,0.25);
            border-radius: 6px; padding: 8px 18px;
            max-width: 820px; width: 100%; text-align: center;
            transition: all 0.4s;
        }
        #task-bar.solved { border-color: var(--green); color: var(--green); border-style: solid; }

        #prob-display {
            font-family: 'Space Mono', monospace; font-size: 0.78em;
            color: var(--orange); letter-spacing: 1px; text-align: center;
            padding: 6px 0;
        }

        /* Float nav */
        #float-nav {
            position: fixed; right: 18px; top: 50%;
            transform: translateY(-50%);
            display: flex; flex-direction: column; gap: 10px; z-index: 50;
        }
        .float-btn {
            width: 72px; padding: 10px 0;
            background: rgba(5,5,18,0.85);
            border: 1px solid rgba(255,107,53,0.3);
            border-radius: 30px; color: rgba(255,107,53,0.65);
            font-family: 'Rajdhani', sans-serif; font-weight: 700;
            font-size: 0.72em; letter-spacing: 1px; text-transform: uppercase;
            cursor: pointer; text-align: center; transition: all 0.25s ease;
            backdrop-filter: blur(10px);
        }
        .float-btn:hover {
            border-color: var(--orange); color: #fff;
            box-shadow: 0 0 20px rgba(255,107,53,0.25);
            transform: translateX(-3px);
        }
        .float-btn.active-float {
            border-color: var(--orange); color: #000;
            background: var(--orange);
        }

        #quick-panel {
            position: fixed; right: 104px; top: 50%;
            transform: translateY(-50%); width: 280px;
            background: rgba(8,8,20,0.97);
            border: 1px solid rgba(255,107,53,0.25);
            border-radius: 12px; padding: 22px 20px;
            z-index: 49; backdrop-filter: blur(20px);
            opacity: 0; pointer-events: none;
            transition: opacity 0.25s ease, transform 0.25s ease;
            transform: translateY(-50%) translateX(10px);
        }
        #quick-panel.visible {
            opacity: 1; pointer-events: all;
            transform: translateY(-50%) translateX(0);
        }
        #qp-title {
            font-family: 'Space Mono', monospace; font-size: 0.72em;
            color: var(--orange); letter-spacing: 2px; text-transform: uppercase;
            margin-bottom: 14px; padding-bottom: 8px;
            border-bottom: 1px solid rgba(255,107,53,0.15);
        }
        #qp-body { font-size: 0.88em; line-height: 1.65; color: #bbb; }
        #qp-body b { color: #fff; }
        #qp-body .math {
            font-family: 'Space Mono', monospace;
            background: rgba(255,107,53,0.06);
            border-left: 2px solid var(--orange);
            padding: 7px 12px; margin: 10px 0;
            font-size: 0.85em; color: rgba(255,107,53,0.9);
            border-radius: 0 4px 4px 0;
        }

        /* Mindmap */
        #mindmap-overlay {
            position: fixed; inset: 0;
            background: rgba(2,2,10,0.96);
            z-index: 100; display: flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none; transition: opacity 0.35s ease;
        }
        #mindmap-overlay.show { opacity: 1; pointer-events: all; }
        #mindmap-container {
            position: relative; width: 100vw; height: 100vh;
            display: flex; align-items: center; justify-content: center;
        }
        #mm-close {
            position: absolute; top: 24px; right: 28px;
            background: transparent; border: 1px solid rgba(255,107,53,0.3);
            color: rgba(255,107,53,0.6); border-radius: 50%;
            width: 36px; height: 36px; font-size: 1.1em; cursor: pointer;
            transition: all 0.2s; font-family: monospace;
            display: flex; align-items: center; justify-content: center;
        }
        #mm-close:hover { border-color: var(--orange); color: #fff; }
        #mm-title {
            position: absolute; top: 24px; left: 28px;
            font-family: 'Space Mono', monospace; font-size: 0.75em;
            color: rgba(255,107,53,0.5); letter-spacing: 3px; text-transform: uppercase;
        }
        #mindmap-svg { width: min(860px,95vw); height: min(560px,80vh); overflow: visible; }
        #mm-info {
            position: absolute; bottom: 36px; left: 50%;
            transform: translateX(-50%); width: min(600px,90vw);
            background: rgba(6,6,18,0.97);
            border: 1px solid rgba(255,107,53,0.2);
            border-radius: 10px; padding: 0; max-height: 0; overflow: hidden;
            transition: max-height 0.4s ease, padding 0.3s ease;
        }
        #mm-info.open { max-height: 200px; padding: 18px 22px; }
        #mm-info-title {
            font-family: 'Space Mono', monospace; font-size: 0.75em;
            color: var(--orange); letter-spacing: 2px; margin-bottom: 10px;
        }
        #mm-info-body { font-size: 0.9em; line-height: 1.6; color: #bbb; }
        #mm-info-body b { color: #fff; }

        /* Success */
        #success-overlay {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.85);
            display: flex; align-items: center; justify-content: center;
            z-index: 200; opacity: 0; pointer-events: none; transition: opacity 0.5s;
        }
        #success-overlay.show { opacity: 1; pointer-events: all; }
        #success-box {
            width: 460px; background: #09091a;
            border: 2px solid var(--orange);
            border-radius: 14px; padding: 36px 30px; text-align: center;
            box-shadow: 0 0 80px rgba(255,107,53,0.25);
        }
        #success-box h2 {
            font-family: 'Space Mono', monospace; color: var(--orange);
            font-size: 1.45em; margin-bottom: 14px;
        }
        #success-box p { font-size: 0.9em; line-height: 1.6; color: #ccc; margin-bottom: 12px; }
        #success-box .highlight { color: var(--cyan); font-weight: 700; letter-spacing: 1px; }
        .btn-continue {
            margin-top: 20px; background: var(--orange); color: #000;
            padding: 12px 30px; border-radius: 6px;
            font-weight: 700; letter-spacing: 1px;
            cursor: pointer; border: none; font-size: 0.9em;
        }
        .btn-continue:hover { opacity: 0.85; }
    </style>
</head>
<body>

<div id="success-overlay">
    <div id="success-box">
        <h2>TUNNEL COMPLETE</h2>
        <p id="success-msg">The bear has phased through all barriers.</p>
        <p class="highlight">SHIFT 5 → 6: QUANTUM COMPUTING</p>
        <p>The bear is no longer just a particle — it is now information. A <b>qubit</b>. You will learn to manipulate its state on a Bloch sphere using quantum gates.</p>
        <p style="font-style:italic; color:#888; border-top:1px solid #222; padding-top:12px;">Classical bits are 0 or 1. <b>Qubits</b> can be both — until measured.</p>
        <button class="btn-continue" onclick="dismissSuccess()">PROCEED TO LEVEL 6</button>
    </div>
</div>

<div id="mindmap-overlay">
    <div id="mindmap-container">
        <div id="mm-title">QUANTUM TUNNELING — NOTES</div>
        <button id="mm-close" onclick="closeMindmap()">✕</button>
        <svg id="mindmap-svg" viewBox="0 0 860 520" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="glow-strong"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="glow-soft"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ff6b35" stop-opacity="0.25"/>
                    <stop offset="100%" stop-color="#ff6b35" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <line x1="430" y1="260" x2="180" y2="120" stroke="rgba(255,107,53,0.2)" stroke-width="1.5" stroke-dasharray="4 4"/>
            <line x1="430" y1="260" x2="680" y2="120" stroke="rgba(255,107,53,0.2)" stroke-width="1.5" stroke-dasharray="4 4"/>
            <line x1="430" y1="260" x2="680" y2="395" stroke="rgba(255,107,53,0.2)" stroke-width="1.5" stroke-dasharray="4 4"/>
            <line x1="430" y1="260" x2="180" y2="395" stroke="rgba(255,107,53,0.2)" stroke-width="1.5" stroke-dasharray="4 4"/>
            <line x1="430" y1="260" x2="430" y2="76"  stroke="rgba(255,107,53,0.2)" stroke-width="1.5" stroke-dasharray="4 4"/>

            <g id="node-center" onclick="selectNode('center')" style="cursor:pointer;">
                <circle cx="430" cy="260" r="68" fill="url(#centerGrad)" stroke="rgba(255,107,53,0.5)" stroke-width="1.5"/>
                <circle cx="430" cy="260" r="56" fill="rgba(5,5,18,0.9)" stroke="#ff6b35" stroke-width="2"/>
                <text x="430" y="252" text-anchor="middle" fill="#fff" font-family="Space Mono, monospace" font-size="10.5" font-weight="700">QUANTUM</text>
                <text x="430" y="269" text-anchor="middle" fill="#fff" font-family="Space Mono, monospace" font-size="10.5" font-weight="700">TUNNELING</text>
                <text x="430" y="285" text-anchor="middle" fill="rgba(255,107,53,0.65)" font-family="Rajdhani, sans-serif" font-size="10">forbidden barrier</text>
            </g>

            <g class="child-node" id="node-barrier" onclick="selectNode('barrier')" style="cursor:pointer;">
                <circle cx="180" cy="120" r="46" fill="rgba(5,5,18,0.9)" stroke="rgba(255,71,87,0.45)" stroke-width="1.5" class="node-ring"/>
                <text x="180" y="114" text-anchor="middle" fill="#ff4757" font-family="Space Mono, monospace" font-size="14" font-weight="700">V₀</text>
                <text x="180" y="132" text-anchor="middle" fill="rgba(200,200,220,0.6)" font-family="Rajdhani, sans-serif" font-size="10.5">Barrier height</text>
            </g>

            <g class="child-node" id="node-width" onclick="selectNode('width')" style="cursor:pointer;">
                <circle cx="680" cy="120" r="46" fill="rgba(5,5,18,0.9)" stroke="rgba(255,235,59,0.45)" stroke-width="1.5" class="node-ring"/>
                <text x="680" y="114" text-anchor="middle" fill="#ffeb3b" font-family="Space Mono, monospace" font-size="14" font-weight="700">L</text>
                <text x="680" y="132" text-anchor="middle" fill="rgba(200,200,220,0.6)" font-family="Rajdhani, sans-serif" font-size="10.5">Barrier width</text>
            </g>

            <g class="child-node" id="node-energy" onclick="selectNode('energy')" style="cursor:pointer;">
                <circle cx="680" cy="395" r="46" fill="rgba(5,5,18,0.9)" stroke="rgba(0,212,255,0.4)" stroke-width="1.5" class="node-ring"/>
                <text x="680" y="389" text-anchor="middle" fill="#00d4ff" font-family="Space Mono, monospace" font-size="14" font-weight="700">E</text>
                <text x="680" y="407" text-anchor="middle" fill="rgba(200,200,220,0.6)" font-family="Rajdhani, sans-serif" font-size="10.5">Kinetic energy</text>
            </g>

            <g class="child-node" id="node-decay" onclick="selectNode('decay')" style="cursor:pointer;">
                <circle cx="180" cy="395" r="46" fill="rgba(5,5,18,0.9)" stroke="rgba(0,255,157,0.4)" stroke-width="1.5" class="node-ring"/>
                <text x="180" y="389" text-anchor="middle" fill="#00ff9d" font-family="Space Mono, monospace" font-size="11" font-weight="700">e^(-2κL)</text>
                <text x="180" y="407" text-anchor="middle" fill="rgba(200,200,220,0.6)" font-family="Rajdhani, sans-serif" font-size="10.5">Decay factor</text>
            </g>

            <g class="child-node" id="node-app" onclick="selectNode('app')" style="cursor:pointer;">
                <circle cx="430" cy="76" r="46" fill="rgba(5,5,18,0.9)" stroke="rgba(176,96,255,0.4)" stroke-width="1.5" class="node-ring"/>
                <text x="430" y="68" text-anchor="middle" fill="#b060ff" font-family="Space Mono, monospace" font-size="11" font-weight="700">Real-world</text>
                <text x="430" y="85" text-anchor="middle" fill="#b060ff" font-family="Space Mono, monospace" font-size="11" font-weight="700">applications</text>
            </g>
        </svg>
        <div id="mm-info">
            <div id="mm-info-title">—</div>
            <div id="mm-info-body"></div>
        </div>
    </div>
</div>

<div id="float-nav">
    <button class="float-btn" id="fb-concept" onclick="toggleQuickPanel('concept')">Concept</button>
    <button class="float-btn" id="fb-formula" onclick="toggleQuickPanel('formula')">Formula</button>
    <button class="float-btn" id="fb-hint"    onclick="toggleQuickPanel('hint')">Hint</button>
    <button class="float-btn" id="fb-notes"   onclick="openMindmap()">Notes</button>
</div>

<div id="quick-panel">
    <div id="qp-title"></div>
    <div id="qp-body"></div>
</div>

<div id="header">
    <div class="level-tag">LEVEL 5 — QUANTUM TUNNELING</div>
    <h1>THE FORBIDDEN BARRIER</h1>
</div>

<div id="app">
    <div id="canvas-wrapper">
        <div id="mode-badge">STATE: incident ψ</div>
        <div id="energy-badge">E = 50%</div>
    </div>
    <div id="task-bar">OBJECTIVE: Tunnel the bear through all 3 barriers to reach the exit</div>
    <div id="prob-display">Tunneling probability: —</div>
    <div id="controls">
        <div class="ctrl-group" id="energy-group">
            <div class="ctrl-label">Bear Kinetic Energy (E)</div>
            <input type="range" id="energySlider" min="5" max="95" value="50" oninput="onEnergySlider()">
            <div class="sl-readout" id="energy-read">E = 50 units</div>
        </div>
        <div class="ctrl-group" id="barrier-group">
            <div class="ctrl-label">Select Barrier</div>
            <div class="barrier-btns">
                <button class="b-btn active" id="b-btn-1" onclick="selectBarrier(0)">B1</button>
                <button class="b-btn" id="b-btn-2" onclick="selectBarrier(1)">B2</button>
                <button class="b-btn" id="b-btn-3" onclick="selectBarrier(2)">B3</button>
            </div>
        </div>
        <div class="ctrl-group" id="action-group">
            <button class="btn btn-tunnel" id="tunnelBtn" onclick="attemptTunnel()">⚡ TUNNEL</button>
            <button class="btn btn-reset-bear" onclick="resetLevel()">↺ Reset</button>
        </div>
    </div>
</div>

<script>
const QP_CONTENT = {
    concept: {
        title: 'CONCEPT',
        body: \`In quantum mechanics, a particle can pass through a potential barrier even if its energy is \<b>less than the barrier height\</b>. This is impossible classically — like a ball rolling through a hill it doesn't have enough energy to climb. But quantum wavefunctions don't stop at the barrier; they \<b>decay exponentially\</b> inside it. If the barrier is thin enough, the wavefunction emerges on the other side.\`
    },
    formula: {
        title: 'FORMULA',
        body: \`\<b>Transmission coefficient:\</b>
\<div class="math">T ≈ e^(-2κL)\</div>
\<b>where:\</b>
\<div class="math">κ = √(2m(V₀ - E)) / ℏ\</div>
V₀ = barrier potential, E = particle energy, L = barrier width, m = particle mass. Higher E or thinner L → larger T → more likely to tunnel.\`
    },
    hint: {
        title: 'HINT',
        body: \`• Increase the bear's \<b>energy\</b> to get closer to the barrier height — this increases tunneling probability dramatically.\<br>
• Thinner barriers are much easier to tunnel through.\<br>
• Barrier 1 is thin, Barrier 2 is medium, Barrier 3 is thick — plan your energy budget.\<br>
• You need some luck too — tunneling is \<b>probabilistic\</b>!\`
    }
};

const MM_INFO = {
    center: {
        title: 'QUANTUM TUNNELING',
        body: \`A purely quantum phenomenon with no classical analog. A particle encountering a potential barrier has a non-zero probability of appearing on the other side, even when E \< V₀. The wavefunction inside the barrier is an \<b>evanescent wave\</b> — it doesn't oscillate but decays exponentially.\`
    },
    barrier: {
        title: 'V₀ — BARRIER HEIGHT',
        body: \`The potential energy of the barrier. If V₀ > E, tunneling is possible. The difference (V₀ - E) determines how quickly the wavefunction decays inside the barrier. A smaller gap between V₀ and E makes tunneling much more likely.\`
    },
    width: {
        title: 'L — BARRIER WIDTH',
        body: \`The thickness of the barrier matters exponentially. Doubling the width doesn't halve the probability — it \<b>squares\</b> the decay factor. Even a small increase in width can make tunneling vanishingly unlikely. This is why tunneling only matters at the atomic scale.\`
    },
    energy: {
        title: 'E — KINETIC ENERGY',
        body: \`The particle's kinetic energy. As E approaches V₀ from below, tunneling probability rises sharply. At E = V₀, the particle can classically pass over (reflection still possible due to wave nature). Above V₀, transmission is high but not 100% — quantum reflection occurs.\`
    },
    decay: {
        title: 'EXPONENTIAL DECAY — e^(-2κL)',
        body: \`Inside the barrier, the wavefunction amplitude drops as e^(-κx). The total transmission depends on e^(-2κL) — the round-trip decay. This exponential suppression is why tunneling is only significant for \<b>thin barriers\</b> and \<b>light particles\</b> (small m makes κ smaller).\`
    },
    app: {
        title: 'REAL-WORLD APPLICATIONS',
        body: \`Tunneling powers: \<b>alpha decay\</b> (particles tunnel out of atomic nuclei), \<b>tunnel diodes\</b> (electronics), \<b>scanning tunneling microscopes\</b> (imaging individual atoms), \<b>nuclear fusion\</b> in stars (protons tunnel through Coulomb barriers). Without tunneling, the Sun wouldn't shine.\`
    }
};

let activePanel = null;
function toggleQuickPanel(key) {
    const panel = document.getElementById('quick-panel');
    const btnId = 'fb-' + key;
    if (activePanel === key) {
        panel.classList.remove('visible');
        document.getElementById(btnId).classList.remove('active-float');
        activePanel = null; return;
    }
    const c = QP_CONTENT[key];
    document.getElementById('qp-title').textContent = c.title;
    document.getElementById('qp-body').innerHTML = c.body;
    panel.classList.add('visible');
    document.querySelectorAll('.float-btn').forEach(b => b.classList.remove('active-float'));
    document.getElementById(btnId).classList.add('active-float');
    activePanel = key;
}

let selectedNode = null;
function selectNode(key) {
    const info = document.getElementById('mm-info');
    document.querySelectorAll('.node-ring').forEach(r => {
        r.setAttribute('stroke-width', '1.5'); r.style.filter = '';
    });
    if (selectedNode === key) { info.classList.remove('open'); selectedNode = null; return; }
    selectedNode = key;
    const d = MM_INFO[key];
    document.getElementById('mm-info-title').textContent = d.title;
    document.getElementById('mm-info-body').innerHTML = d.body;
    info.classList.add('open');
    const nodeEl = document.getElementById('node-' + key);
    if (nodeEl) {
        const ring = nodeEl.querySelector('.node-ring');
        if (ring) { ring.setAttribute('stroke-width', '3'); ring.setAttribute('filter', 'url(#glow-strong)'); }
    }
}

function openMindmap() {
    document.getElementById('mindmap-overlay').classList.add('show');
    if (activePanel) {
        document.getElementById('quick-panel').classList.remove('visible');
        document.querySelectorAll('.float-btn').forEach(b => b.classList.remove('active-float'));
        activePanel = null;
    }
    document.getElementById('fb-notes').classList.add('active-float');
}
function closeMindmap() {
    document.getElementById('mindmap-overlay').classList.remove('show');
    document.getElementById('fb-notes').classList.remove('active-float');
    document.getElementById('mm-info').classList.remove('open');
    selectedNode = null;
}
document.getElementById('mindmap-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeMindmap();
});
document.addEventListener('click', function(e) {
    const panel = document.getElementById('quick-panel');
    const nav = document.getElementById('float-nav');
    if (!panel.contains(e.target) && !nav.contains(e.target)) {
        panel.classList.remove('visible');
        document.querySelectorAll('.float-btn').forEach(b => {
            if (b.id !== 'fb-notes') b.classList.remove('active-float');
        });
        if (activePanel !== null) activePanel = null;
    }
});

// ═══════════════════════════════════════════════════
//   GAME STATE
// ═══════════════════════════════════════════════════
const barriers = [
    { x: 250, w: 25,  V: 80, passed: false },  // thin
    { x: 450, w: 50,  V: 90, passed: false },  // medium
    { x: 650, w: 40,  V: 100, passed: false }, // thick-ish
];

let bearX = 80;
let bearTargetX = 80;
let energy = 50;
let selectedBarrierIdx = 0;
let animating = false;
let tunnelResult = null; // 'success' or 'fail'
let tunnelAnim = 0;
let sparkles = [];
let bounceAnim = 0;
let successTriggered = false;
let waveTime = 0;

function setup() {
    let cnv = createCanvas(820, 440);
    cnv.parent('canvas-wrapper');
    updateProbDisplay();
}

function draw() {
    background(5, 5, 12);
    waveTime += 0.03;

    // Grid
    stroke(255,255,255,8); strokeWeight(1);
    for (let gx = 0; gx < width; gx += 40) line(gx,0,gx,height);
    for (let gy = 0; gy < height; gy += 40) line(0,gy,width,gy);

    // Ground line
    stroke(255,255,255,20); strokeWeight(1);
    line(0, height - 80, width, height - 80);

    // Draw barriers
    for (let i = 0; i < barriers.length; i++) {
        drawBarrier(i);
    }

    // Draw incident wavefunction
    drawWavefunction();

    // Draw bear
    drawBear();

    // Draw sparkles
    updateSparkles();

    // Animate tunnel
    if (animating) {
        tunnelAnim += 0.02;
        if (tunnelAnim >= 1) {
            animating = false;
            tunnelAnim = 0;
            if (tunnelResult === 'success') {
                barriers[selectedBarrierIdx].passed = true;
                // Move bear past barrier
                let b = barriers[selectedBarrierIdx];
                bearX = b.x + b.w + 40;
                bearTargetX = bearX;
                // Auto-select next barrier
                if (selectedBarrierIdx < 2 && !barriers[selectedBarrierIdx + 1].passed) {
                    selectBarrier(selectedBarrierIdx + 1);
                }
                checkLevelComplete();
            } else {
                bounceAnim = 1;
            }
            tunnelResult = null;
            document.getElementById('tunnelBtn').disabled = false;
        }
    }

    if (bounceAnim > 0) {
        bounceAnim -= 0.03;
        bearX = bearTargetX + sin(bounceAnim * 20) * bounceAnim * 30;
    }
}

function drawBarrier(idx) {
    let b = barriers[idx];
    let groundY = height - 80;
    let barrierH = map(b.V, 0, 120, 40, 280);

    push();
    // Barrier body
    if (b.passed) {
        // Ghost barrier
        noStroke();
        fill(0, 255, 157, 15);
        rect(b.x, groundY - barrierH, b.w, barrierH);
        stroke(0, 255, 157, 40); strokeWeight(1);
        line(b.x, groundY - barrierH, b.x, groundY);
        line(b.x + b.w, groundY - barrierH, b.x + b.w, groundY);
    } else {
        // Glow
        noStroke();
        let glowAlpha = idx === selectedBarrierIdx ? 25 : 10;
        fill(255, 107, 53, glowAlpha);
        rect(b.x - 8, groundY - barrierH - 8, b.w + 16, barrierH + 16, 4);

        // Body
        let alpha = idx === selectedBarrierIdx ? 60 : 35;
        fill(255, 60, 40, alpha);
        rect(b.x, groundY - barrierH, b.w, barrierH);

        // Edges
        stroke(255, 107, 53, idx === selectedBarrierIdx ? 200 : 100);
        strokeWeight(idx === selectedBarrierIdx ? 2.5 : 1.5);
        line(b.x, groundY - barrierH, b.x, groundY);
        line(b.x + b.w, groundY - barrierH, b.x + b.w, groundY);
        line(b.x, groundY - barrierH, b.x + b.w, groundY - barrierH);

        // V label
        noStroke();
        fill(255, 107, 53, 150);
        textFont('monospace'); textSize(10); textAlign(CENTER);
        text('V₀=' + b.V, b.x + b.w/2, groundY - barrierH - 8);

        // Width label
        fill(255, 235, 59, 100);
        text('L=' + b.w + 'px', b.x + b.w/2, groundY + 16);

        // Evanescent wave inside barrier (when animating)
        if (animating && idx === selectedBarrierIdx) {
            let kappa = Math.sqrt(Math.max(0.01, b.V - energy)) * 0.08;
            stroke(255, 107, 53, 100 * (1 - tunnelAnim)); strokeWeight(2); noFill();
            beginShape();
            for (let x = 0; x <= b.w; x++) {
                let decay = Math.exp(-kappa * x);
                let y = decay * 60 * sin(x * 0.3 + waveTime * 3);
                vertex(b.x + x, groundY - barrierH/2 + y);
            }
            endShape();
        }
    }

    // Label
    noStroke();
    fill(255, 255, 255, 60);
    textFont('monospace'); textSize(9); textAlign(CENTER);
    text('B' + (idx + 1), b.x + b.w/2, groundY + 28);
    pop();
}

function drawWavefunction() {
    let groundY = height - 80;
    // Incident wave before bear
    stroke(0, 212, 255, 80); strokeWeight(2); noFill();
    beginShape();
    for (let x = 20; x < bearX - 10; x += 2) {
        let amp = 30;
        let k = map(energy, 5, 95, 0.03, 0.12);
        let y = amp * sin(k * x - waveTime * 2);
        vertex(x, groundY - 60 + y);
    }
    endShape();
}

function drawBear() {
    let groundY = height - 80;
    let bx = bearX;
    let by = groundY - 35;

    push();
    let ghostAlpha = animating ? map(tunnelAnim, 0, 0.5, 255, 40) : 255;
    if (animating && tunnelAnim > 0.5) {
        ghostAlpha = tunnelResult === 'success' ? map(tunnelAnim, 0.5, 1, 40, 255) : map(tunnelAnim, 0.5, 1, 40, 0);
    }

    // Glow
    drawingContext.shadowBlur = animating ? 30 : 12;
    drawingContext.shadowColor = animating ? 'rgba(255,107,53,0.8)' : 'rgba(0,212,255,0.3)';

    // Body
    noStroke(); fill(animating ? 255 : 0, animating ? 107 : 180, animating ? 53 : 255, ghostAlpha);
    ellipse(bx, by, 28, 32);
    // Head
    fill(animating ? 255 : 0, animating ? 107 : 180, animating ? 53 : 255, ghostAlpha);
    circle(bx, by - 22, 22);
    // Ears
    circle(bx - 10, by - 32, 9);
    circle(bx + 10, by - 32, 9);
    // Eyes
    fill(255, 255, 255, ghostAlpha);
    circle(bx - 4, by - 24, 4);
    circle(bx + 4, by - 24, 4);
    fill(5, 5, 12, ghostAlpha);
    circle(bx - 4, by - 24, 2);
    circle(bx + 4, by - 24, 2);
    // Nose
    fill(255, 150, 100, ghostAlpha);
    ellipse(bx, by - 19, 4, 3);

    drawingContext.shadowBlur = 0;

    // Energy bar above bear
    let barW = 40, barH = 4;
    let barX = bx - barW/2, barY = by - 50;
    noStroke(); fill(255,255,255,30);
    rect(barX, barY, barW, barH, 2);
    fill(255, 107, 53);
    rect(barX, barY, barW * energy / 100, barH, 2);
    pop();
}

function updateSparkles() {
    for (let i = sparkles.length - 1; i >= 0; i--) {
        let s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.02;
        s.vy += 0.05;

        if (s.life <= 0) { sparkles.splice(i, 1); continue; }

        noStroke();
        fill(s.r, s.g, s.b, s.life * 255);
        circle(s.x, s.y, s.size * s.life);
    }
}

function spawnSparkles(x, y, count, r, g, b) {
    for (let i = 0; i < count; i++) {
        sparkles.push({
            x: x, y: y,
            vx: random(-3, 3), vy: random(-4, 1),
            life: 1, size: random(3, 8),
            r: r, g: g, b: b
        });
    }
}

function calcTunnelProb(barrierIdx) {
    let b = barriers[barrierIdx];
    if (energy >= b.V) return 0.95;
    let kappa = Math.sqrt(Math.max(0.01, (b.V - energy) * 0.1));
    let T = Math.exp(-2 * kappa * b.w * 0.05);
    return Math.min(0.95, Math.max(0.01, T));
}

function onEnergySlider() {
    energy = parseInt(document.getElementById('energySlider').value);
    document.getElementById('energy-read').textContent = 'E = ' + energy + ' units';
    document.getElementById('energy-badge').textContent = 'E = ' + energy + '%';
    updateProbDisplay();
}

function selectBarrier(idx) {
    selectedBarrierIdx = idx;
    document.querySelectorAll('.b-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('b-btn-' + (idx + 1)).classList.add('active');
    updateProbDisplay();
}

function updateProbDisplay() {
    if (barriers[selectedBarrierIdx].passed) {
        document.getElementById('prob-display').textContent = 'Barrier ' + (selectedBarrierIdx + 1) + ': PASSED ✓';
        return;
    }
    let prob = calcTunnelProb(selectedBarrierIdx);
    document.getElementById('prob-display').textContent =
        'Tunneling probability for B' + (selectedBarrierIdx + 1) + ': ' + (prob * 100).toFixed(1) + '%';
}

function attemptTunnel() {
    if (animating) return;
    let b = barriers[selectedBarrierIdx];
    if (b.passed) return;

    // Move bear to barrier
    bearX = b.x - 30;
    bearTargetX = bearX;

    let prob = calcTunnelProb(selectedBarrierIdx);
    let roll = Math.random();

    animating = true;
    tunnelAnim = 0;
    tunnelResult = roll < prob ? 'success' : 'fail';
    document.getElementById('tunnelBtn').disabled = true;

    if (tunnelResult === 'success') {
        spawnSparkles(b.x + b.w/2, height - 80 - 60, 30, 0, 255, 157);
        document.getElementById('mode-badge').textContent = 'STATE: tunneling ψ → transmitted!';
    } else {
        spawnSparkles(b.x, height - 80 - 60, 20, 255, 71, 87);
        document.getElementById('mode-badge').textContent = 'STATE: tunneling ψ → reflected';
    }
}

function checkLevelComplete() {
    if (barriers.every(b => b.passed) && !successTriggered) {
        successTriggered = true;
        document.getElementById('task-bar').textContent = 'ALL BARRIERS TUNNELED — LEVEL COMPLETE';
        document.getElementById('task-bar').classList.add('solved');
        setTimeout(() => {
            document.getElementById('success-overlay').classList.add('show');
        }, 800);
    }
    updateProbDisplay();
}

function resetLevel() {
    barriers.forEach(b => b.passed = false);
    bearX = 80;
    bearTargetX = 80;
    animating = false;
    tunnelResult = null;
    tunnelAnim = 0;
    bounceAnim = 0;
    successTriggered = false;
    sparkles = [];
    selectBarrier(0);
    document.getElementById('task-bar').textContent = 'OBJECTIVE: Tunnel the bear through all 3 barriers to reach the exit';
    document.getElementById('task-bar').classList.remove('solved');
    document.getElementById('mode-badge').textContent = 'STATE: incident ψ';
    document.getElementById('tunnelBtn').disabled = false;
}

function dismissSuccess() {
    document.getElementById('success-overlay').classList.remove('show');
}

document.querySelectorAll('.child-node').forEach(node => {
    const ring = node.querySelector('.node-ring');
    node.addEventListener('mouseenter', () => {
        if (ring && node.id !== 'node-' + selectedNode) {
            ring.setAttribute('stroke-width', '2.5'); ring.setAttribute('filter', 'url(#glow-soft)');
        }
    });
    node.addEventListener('mouseleave', () => {
        if (ring && node.id !== 'node-' + selectedNode) {
            ring.setAttribute('stroke-width', '1.5'); ring.removeAttribute('filter');
        }
    });
});
<\/script>
</body>
</html>`;

export default function Level5Page() {
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
          Initializing Level 5...
        </div>
      </div>
    );
  }

  if (!User) return null;

  return (
    <div className="flex flex-col items-center w-full px-4 h-[calc(100vh-140px)]">
      <div className="w-full h-full max-w-6xl rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,107,53,0.1)] border border-outline-variant/20 relative">
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full border-none bg-surface"
          title="Level 5: Quantum Tunneling"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      <MrPsiChat currentLevel={5} />
    </div>
  );
}
