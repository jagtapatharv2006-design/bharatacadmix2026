"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MrPsiChat from "@/app/componenets/MrPsiChat";

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Schrödinger's Cave: Resonance Lab</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"><\/script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Rajdhani:wght@300;500;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --cyan: #00d4ff;
            --yellow: #ffeb3b;
            --red: #ff4757;
            --dim: #1a1a2e;
            --bg: #05050c;
            --glass: rgba(255,255,255,0.04);
            --border: rgba(0, 212, 255, 0.2);
        }

        body {
            font-family: 'Rajdhani', sans-serif;
            background: var(--bg);
            color: #e0e0e0;
            overflow-x: hidden;
            min-height: 100vh;
        }

        #header {
            text-align: center;
            padding: 18px 0 10px;
        }
        #header h1 {
            font-family: 'Space Mono', monospace;
            font-size: 1.1em;
            letter-spacing: 6px;
            color: var(--cyan);
            text-shadow: 0 0 20px rgba(0,212,255,0.4);
        }
        .level-tag {
            font-size: 0.7em;
            letter-spacing: 4px;
            color: rgba(0,212,255,0.6);
            margin-bottom: 6px;
            font-family: 'Space Mono', monospace;
        }
        .level-title {
            font-size: 1.1em;
            letter-spacing: 5px;
            color: #00d4ff;
            font-family: 'Space Mono', monospace;
            text-shadow: 0 0 12px rgba(0,212,255,0.4);
        }

        #app {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding: 0 20px 30px;
        }

        #canvas-wrapper {
            position: relative;
            border: 1px solid var(--border);
            border-radius: 8px;
            background: #000;
            box-shadow: 0 0 40px rgba(0,212,255,0.07);
            overflow: hidden;
        }

        #mode-badge {
            position: absolute;
            top: 12px; left: 14px;
            font-family: 'Space Mono', monospace;
            font-size: 0.7em;
            color: var(--cyan);
            opacity: 0.7;
            pointer-events: none;
        }

        #energy-badge {
            position: absolute;
            top: 12px; right: 14px;
            font-family: 'Space Mono', monospace;
            font-size: 0.7em;
            color: var(--yellow);
            opacity: 0.8;
            pointer-events: none;
        }

        #controls {
            display: flex;
            gap: 14px;
            align-items: stretch;
            width: 100%;
            max-width: 820px;
        }

        .ctrl-group {
            background: var(--glass);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 12px 16px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .ctrl-label {
            font-size: 0.68em;
            letter-spacing: 2px;
            color: rgba(0,212,255,0.5);
            text-transform: uppercase;
        }

        #n-group { flex: 1; }
        #n-buttons { display: flex; gap: 6px; }

        .n-btn {
            flex: 1;
            padding: 8px 0;
            background: transparent;
            border: 1px solid rgba(0,212,255,0.3);
            color: rgba(0,212,255,0.6);
            border-radius: 5px;
            font-family: 'Space Mono', monospace;
            font-size: 0.85em;
            cursor: pointer;
            transition: all 0.2s;
        }
        .n-btn:hover { border-color: var(--cyan); color: var(--cyan); }
        .n-btn.active {
            background: var(--cyan);
            color: #000;
            border-color: var(--cyan);
            box-shadow: 0 0 12px rgba(0,212,255,0.4);
        }

        #l-group { flex: 1.2; }
        #widthSlider {
            width: 100%;
            accent-color: var(--cyan);
            cursor: pointer;
        }
        #l-readout {
            font-family: 'Space Mono', monospace;
            font-size: 0.7em;
            color: rgba(0,212,255,0.5);
            text-align: right;
        }

        #action-group { display: flex; gap: 8px; flex-direction: column; justify-content: space-between; }
        .btn {
            padding: 9px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 700;
            font-size: 0.85em;
            letter-spacing: 1px;
            transition: all 0.2s;
            text-transform: uppercase;
            white-space: nowrap;
        }
        .btn-toggle {
            background: transparent;
            border: 1px solid var(--yellow);
            color: var(--yellow);
        }
        .btn-toggle:hover, .btn-toggle.active-mode {
            background: var(--yellow);
            color: #000;
        }
        .btn-fire {
            background: var(--cyan);
            color: #000;
            box-shadow: 0 0 15px rgba(0,212,255,0.3);
        }
        .btn-fire:hover { box-shadow: 0 0 25px rgba(0,212,255,0.6); transform: scale(1.02); }

        #task-bar {
            font-family: 'Space Mono', monospace;
            font-size: 0.72em;
            color: rgba(255,235,59,0.6);
            letter-spacing: 1px;
            border: 1px dashed rgba(255,235,59,0.2);
            border-radius: 6px;
            padding: 8px 18px;
            max-width: 820px;
            width: 100%;
            text-align: center;
            transition: all 0.4s;
        }
        #task-bar.solved {
            border-color: var(--cyan);
            color: var(--cyan);
        }

        /* ─────────────────────────────────────────────────────
           FLOATING RIGHT SIDEBAR BUTTONS
        ───────────────────────────────────────────────────── */
        #float-nav {
            position: fixed;
            right: 18px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 50;
        }

        .float-btn {
            width: 72px;
            padding: 10px 0;
            background: rgba(5, 5, 18, 0.85);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 30px;
            color: rgba(0, 212, 255, 0.65);
            font-family: 'Rajdhani', sans-serif;
            font-weight: 700;
            font-size: 0.72em;
            letter-spacing: 1px;
            text-transform: uppercase;
            cursor: pointer;
            text-align: center;
            transition: all 0.25s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 12px rgba(0,212,255,0.06);
        }
        .float-btn:hover {
            border-color: var(--cyan);
            color: #fff;
            box-shadow: 0 0 20px rgba(0,212,255,0.25), inset 0 0 10px rgba(0,212,255,0.08);
            transform: translateX(-3px);
        }
        .float-btn.active-float {
            border-color: var(--cyan);
            color: #000;
            background: var(--cyan);
            box-shadow: 0 0 22px rgba(0,212,255,0.5);
        }

        /* ─────────────────────────────────────────────────────
           QUICK PANEL (Concept / Formula / Hint)
        ───────────────────────────────────────────────────── */
        #quick-panel {
            position: fixed;
            right: 104px;
            top: 50%;
            transform: translateY(-50%);
            width: 280px;
            background: rgba(8, 8, 20, 0.97);
            border: 1px solid rgba(0,212,255,0.25);
            border-radius: 12px;
            padding: 22px 20px;
            z-index: 49;
            backdrop-filter: blur(20px);
            box-shadow: 0 0 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,212,255,0.06);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease, transform 0.25s ease;
            transform: translateY(-50%) translateX(10px);
        }
        #quick-panel.visible {
            opacity: 1;
            pointer-events: all;
            transform: translateY(-50%) translateX(0);
        }
        #qp-title {
            font-family: 'Space Mono', monospace;
            font-size: 0.72em;
            color: var(--cyan);
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 14px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(0,212,255,0.15);
        }
        #qp-body {
            font-size: 0.88em;
            line-height: 1.65;
            color: #bbb;
        }
        #qp-body b { color: #fff; }
        #qp-body .math {
            font-family: 'Space Mono', monospace;
            background: rgba(0,212,255,0.06);
            border-left: 2px solid var(--cyan);
            padding: 7px 12px;
            margin: 10px 0;
            font-size: 0.85em;
            color: rgba(0,212,255,0.9);
            border-radius: 0 4px 4px 0;
        }

        /* ─────────────────────────────────────────────────────
           MINDMAP MODAL (Notes)
        ───────────────────────────────────────────────────── */
        #mindmap-overlay {
            position: fixed;
            inset: 0;
            background: rgba(2, 2, 10, 0.96);
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.35s ease;
        }
        #mindmap-overlay.show {
            opacity: 1;
            pointer-events: all;
        }

        #mindmap-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #mm-close {
            position: absolute;
            top: 24px; right: 28px;
            background: transparent;
            border: 1px solid rgba(0,212,255,0.3);
            color: rgba(0,212,255,0.6);
            border-radius: 50%;
            width: 36px; height: 36px;
            font-size: 1.1em;
            cursor: pointer;
            transition: all 0.2s;
            font-family: monospace;
            display: flex; align-items: center; justify-content: center;
        }
        #mm-close:hover { border-color: var(--cyan); color: #fff; background: rgba(0,212,255,0.1); }

        #mm-title {
            position: absolute;
            top: 24px; left: 28px;
            font-family: 'Space Mono', monospace;
            font-size: 0.75em;
            color: rgba(0,212,255,0.4);
            letter-spacing: 3px;
            text-transform: uppercase;
        }

        /* SVG Mindmap */
        #mindmap-svg {
            width: min(860px, 95vw);
            height: min(560px, 80vh);
            overflow: visible;
        }

        /* Node info panel inside mindmap */
        #mm-info {
            position: absolute;
            bottom: 36px;
            left: 50%;
            transform: translateX(-50%);
            width: min(600px, 90vw);
            background: rgba(6, 6, 18, 0.97);
            border: 1px solid rgba(0,212,255,0.2);
            border-radius: 10px;
            padding: 0;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s ease, padding 0.3s ease;
        }
        #mm-info.open {
            max-height: 200px;
            padding: 18px 22px;
        }
        #mm-info-title {
            font-family: 'Space Mono', monospace;
            font-size: 0.75em;
            color: var(--cyan);
            letter-spacing: 2px;
            margin-bottom: 10px;
        }
        #mm-info-body {
            font-size: 0.9em;
            line-height: 1.6;
            color: #bbb;
        }
        #mm-info-body b { color: #fff; }

        /* Success overlay */
        #success-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 200;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s;
        }
        #success-overlay.show {
            opacity: 1;
            pointer-events: all;
        }
        #success-box {
            width: 440px;
            background: #09091a;
            border: 2px solid var(--yellow);
            border-radius: 14px;
            padding: 36px 30px;
            text-align: center;
            box-shadow: 0 0 80px rgba(255,235,59,0.25);
        }
        #success-box h2 {
            font-family: 'Space Mono', monospace;
            color: var(--yellow);
            font-size: 1.5em;
            margin-bottom: 14px;
        }
        #success-box p { font-size: 0.9em; line-height: 1.6; color: #ccc; margin-bottom: 12px; }
        #success-box .highlight { color: var(--cyan); font-weight: 700; letter-spacing: 1px; }
        .btn-continue {
            margin-top: 20px;
            background: var(--yellow);
            color: #000;
            padding: 12px 30px;
            border-radius: 6px;
            font-weight: 700;
            letter-spacing: 1px;
            cursor: pointer;
            border: none;
            font-size: 0.9em;
        }
        .btn-continue:hover { opacity: 0.85; }

        /* ── MOBILE RESPONSIVE ──────────────────────── */
        @media (max-width: 700px) {
            #header { padding: 10px 0 6px; }
            #header h1, .level-title { font-size: 0.8em; letter-spacing: 3px; }
            .level-tag { font-size: 0.6em; }
            #app { padding: 0 8px 16px; gap: 8px; }
            #controls {
                flex-direction: column;
                gap: 8px;
                max-width: 100%;
            }
            .ctrl-group { padding: 10px 12px; }
            .ctrl-label { font-size: 0.6em; }
            .n-btn { padding: 6px 0; font-size: 0.75em; }
            .btn { padding: 7px 14px; font-size: 0.78em; }
            #task-bar { font-size: 0.62em; padding: 6px 12px; max-width: 100%; }
            #float-nav {
                position: fixed;
                bottom: 8px;
                left: 50%;
                top: auto;
                right: auto;
                transform: translateX(-50%);
                flex-direction: row;
                gap: 6px;
            }
            .float-btn {
                width: auto;
                padding: 7px 12px;
                font-size: 0.65em;
                border-radius: 20px;
            }
            .float-btn:hover { transform: none; }
            #quick-panel {
                position: fixed;
                bottom: 50px;
                left: 5%;
                right: 5%;
                top: auto;
                width: 90%;
                transform: none;
                border-radius: 10px;
            }
            #quick-panel.visible {
                transform: none;
            }
            #success-box { width: min(90vw, 440px); padding: 24px 20px; }
            #success-box h2 { font-size: 1.2em; }
            #success-box p { font-size: 0.82em; }
        }

        @media (max-width: 420px) {
            #n-buttons { flex-wrap: wrap; }
            .n-btn { min-width: 36px; }
            #controls { gap: 6px; }
            .ctrl-group { padding: 8px 10px; gap: 6px; }
        }

        /* QUIZ */
        #quiz-overlay {
            position: fixed; inset: 0; background: rgba(2,2,14,0.96); z-index: 500;
            display: flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
        }
        #quiz-overlay.show { opacity: 1; pointer-events: all; }
        #quiz-box {
            width: min(520px, 92vw); background: #09091a; border: 2px solid var(--cyan);
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
        #quiz-level-tag { font-family: 'Space Mono',monospace; font-size: 0.62em; letter-spacing: 3px; text-transform: uppercase; color: rgba(0,212,255,0.5); margin-bottom: 6px; }
        #quiz-progress { font-family: 'Space Mono',monospace; font-size: 0.68em; color: rgba(255,255,255,0.35); letter-spacing: 2px; text-align: right; margin-bottom: 14px; }
        #quiz-question { font-size: 1em; font-weight: 600; color: #fff; margin-bottom: 18px; line-height: 1.5; }
        .quiz-option {
            width: 100%; text-align: left; background: rgba(0,212,255,0.04);
            border: 1px solid rgba(0,212,255,0.2); color: #ccc; border-radius: 8px;
            padding: 10px 14px; margin-bottom: 9px; font-family: 'Rajdhani',sans-serif;
            font-size: 0.92rem; cursor: pointer; transition: 0.2s; display: block;
        }
        .quiz-option:hover:not(:disabled) { border-color: var(--cyan); color: #fff; background: rgba(0,212,255,0.1); }
        .quiz-option.correct { border-color: #00ff9d; background: rgba(0,255,157,0.12); color: #00ff9d; }
        .quiz-option.wrong   { border-color: #ff4757; background: rgba(255,71,87,0.12); color: #ff4757; }
        #quiz-explanation {
            font-size: 0.85rem; line-height: 1.5; color: #aaa;
            background: rgba(255,255,255,0.04); border-left: 3px solid var(--cyan);
            padding: 10px 14px; border-radius: 0 6px 6px 0; margin-top: 4px; display: none;
        }
        #quiz-next-btn {
            margin-top: 16px; width: 100%; background: var(--cyan); color: #000;
            border: none; border-radius: 8px; padding: 10px; font-family: 'Rajdhani',sans-serif;
            font-weight: 700; font-size: 0.88rem; letter-spacing: 1px;
            text-transform: uppercase; cursor: pointer; display: none; transition: 0.2s;
        }
        #quiz-next-btn:hover { opacity: 0.85; }
        #quiz-score-screen { text-align: center; display: none; }
        #quiz-score-screen h3 { font-family: 'Space Mono',monospace; font-size: 1.2rem; color: var(--cyan); margin-bottom: 10px; letter-spacing: 2px; }
        #quiz-score-num { font-family: 'Space Mono',monospace; font-size: 2.8rem; font-weight: 700; color: #fff; }
        #quiz-score-msg { font-size: 0.9rem; color: #aaa; margin: 10px 0 20px; }
        #quiz-retry-btn {
            background: transparent; border: 1px solid var(--cyan); color: var(--cyan);
            border-radius: 8px; padding: 9px 24px; font-family: 'Rajdhani',sans-serif;
            font-weight: 700; cursor: pointer; font-size: 0.85rem;
            letter-spacing: 1px; text-transform: uppercase;
        }
        #quiz-retry-btn:hover { background: var(--cyan); color: #000; }
    </style>
</head>
<body>

<div id="success-overlay">
    <div id="success-box">
        <h2>RESONANCE ACHIEVED</h2>
        <p id="success-msg">Antinode aligned with target coordinates.</p>
        <p class="highlight">SHIFT 3 → 4: THE PRECISION TRADE-OFF</p>
        <p>Nature will now force a choice. You can know exactly <b>where</b> the particle is, or <b>how fast</b> it moves — never both.</p>
        <p style="font-style:italic; color:#888; border-top:1px solid #222; padding-top:12px;">Prepare your <b>Uncertainty Budget</b>. Chasing precision has a price.</p>
        <button class="btn-continue" onclick="dismissSuccess()">ACKNOWLEDGE & CONTINUE</button>
    </div>
</div>

<div id="mindmap-overlay">
    <div id="mindmap-container">
        <div id="mm-title">QUANTUM NOTES</div>
        <button id="mm-close" onclick="closeMindmap()">✕</button>

        <svg id="mindmap-svg" viewBox="0 0 860 520" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="glow-strong">
                    <feGaussianBlur stdDeviation="4" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="glow-soft">
                    <feGaussianBlur stdDeviation="2.5" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#00d4ff" stop-opacity="0.25"/>
                    <stop offset="100%" stop-color="#00d4ff" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <line x1="430" y1="260" x2="180" y2="130" stroke="rgba(0,212,255,0.2)" stroke-width="1.5" stroke-dasharray="4 4" class="mm-line"/>
            <line x1="430" y1="260" x2="680" y2="130" stroke="rgba(0,212,255,0.2)" stroke-width="1.5" stroke-dasharray="4 4" class="mm-line"/>
            <line x1="430" y1="260" x2="680" y2="390" stroke="rgba(0,212,255,0.2)" stroke-width="1.5" stroke-dasharray="4 4" class="mm-line"/>
            <line x1="430" y1="260" x2="180" y2="390" stroke="rgba(0,212,255,0.2)" stroke-width="1.5" stroke-dasharray="4 4" class="mm-line"/>
            <line x1="430" y1="260" x2="430" y2="80" stroke="rgba(0,212,255,0.2)" stroke-width="1.5" stroke-dasharray="4 4" class="mm-line"/>
            <g class="mm-node" id="node-center" onclick="selectNode('center')" style="cursor:pointer;">
                <circle cx="430" cy="260" r="68" fill="url(#centerGrad)" stroke="rgba(0,212,255,0.5)" stroke-width="1.5"/>
                <circle cx="430" cy="260" r="56" fill="rgba(5,5,18,0.9)" stroke="#00d4ff" stroke-width="2"/>
                <text x="430" y="252" text-anchor="middle" fill="#fff" font-family="Space Mono, monospace" font-size="11" font-weight="700" letter-spacing="0.5">PARTICLE</text>
                <text x="430" y="270" text-anchor="middle" fill="#fff" font-family="Space Mono, monospace" font-size="11" font-weight="700" letter-spacing="0.5">IN A BOX</text>
                <text x="430" y="286" text-anchor="middle" fill="rgba(0,212,255,0.6)" font-family="Rajdhani, sans-serif" font-size="10">∞ potential well</text>
            </g>
            <g class="mm-node child-node" id="node-psi" onclick="selectNode('psi')" style="cursor:pointer;">
                <circle cx="180" cy="130" r="46" fill="rgba(5,5,18,0.9)" stroke="rgba(0,212,255,0.4)" stroke-width="1.5" class="node-ring"/>
                <text x="180" y="124" text-anchor="middle" fill="#00d4ff" font-family="Space Mono, monospace" font-size="16" font-weight="700">ψ(x)</text>
                <text x="180" y="142" text-anchor="middle" fill="rgba(200,200,220,0.6)" font-family="Rajdhani, sans-serif" font-size="10.5">Wave Function</text>
            </g>
            <g class="mm-node child-node" id="node-prob" onclick="selectNode('prob')" style="cursor:pointer;">
                <circle cx="680" cy="130" r="46" fill="rgba(5,5,18,0.9)" stroke="rgba(255,235,59,0.4)" stroke-width="1.5" class="node-ring" data-color="rgba(255,235,59,0.4)"/>
                <text x="680" y="124" text-anchor="middle" fill="#ffeb3b" font-family="Space Mono, monospace" font-size="14" font-weight="700">|ψ(x)|²</text>
                <text x="680" y="142" text-anchor="middle" fill="rgba(200,200,220,0.6)" font-family="Rajdhani, sans-serif" font-size="10.5">Probability</text>
            </g>
            <g class="mm-node child-node" id="node-energy" onclick="selectNode('energy')" style="cursor:pointer;">
                <circle cx="680" cy="390" r="46" fill="rgba(5,5,18,0.9)" stroke="rgba(255,100,100,0.4)" stroke-width="1.5" class="node-ring"/>
                <text x="680" y="384" text-anchor="middle" fill="#ff7070" font-family="Space Mono, monospace" font-size="12" font-weight="700">Eₙ = n²E₁</text>
                <text x="680" y="402" text-anchor="middle" fill="rgba(200,200,220,0.6)" font-family="Rajdhani, sans-serif" font-size="10.5">Energy Levels</text>
            </g>
            <g class="mm-node child-node" id="node-n" onclick="selectNode('n')" style="cursor:pointer;">
                <circle cx="180" cy="390" r="46" fill="rgba(5,5,18,0.9)" stroke="rgba(140,100,255,0.4)" stroke-width="1.5" class="node-ring"/>
                <text x="180" y="384" text-anchor="middle" fill="#a070ff" font-family="Space Mono, monospace" font-size="18" font-weight="700">n</text>
                <text x="180" y="402" text-anchor="middle" fill="rgba(200,200,220,0.6)" font-family="Rajdhani, sans-serif" font-size="10.5">Quantum Number</text>
            </g>
            <g class="mm-node child-node" id="node-antinodes" onclick="selectNode('antinodes')" style="cursor:pointer;">
                <circle cx="430" cy="80" r="46" fill="rgba(5,5,18,0.9)" stroke="rgba(0,255,150,0.4)" stroke-width="1.5" class="node-ring"/>
                <text x="430" y="72" text-anchor="middle" fill="#00ff96" font-family="Space Mono, monospace" font-size="11" font-weight="700">Nodes &amp;</text>
                <text x="430" y="87" text-anchor="middle" fill="#00ff96" font-family="Space Mono, monospace" font-size="11" font-weight="700">Antinodes</text>
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
    <div class="level-tag">LEVEL 3</div>
    <h1 class="level-title">THE RESONANCE CHAMBER</h1>
</div>

<div id="app">
    <div id="canvas-wrapper">
        <div id="mode-badge">STATE: ψₙ(x)</div>
        <div id="energy-badge">E₁ · 1²</div>
    </div>
    <div id="task-bar">OBJECTIVE: Find the quantum state where the antinode aligns with the hidden target</div>
    <div id="controls">
        <div class="ctrl-group" id="n-group">
            <div class="ctrl-label">Quantum Number n</div>
            <div id="n-buttons">
                <button class="n-btn" onclick="setN(1)">1</button>
                <button class="n-btn" onclick="setN(2)">2</button>
                <button class="n-btn" onclick="setN(3)">3</button>
                <button class="n-btn" onclick="setN(4)">4</button>
                <button class="n-btn" onclick="setN(5)">5</button>
            </div>
        </div>
        <div class="ctrl-group" id="l-group">
            <div class="ctrl-label">Chamber Length (L)</div>
            <input type="range" id="widthSlider" min="300" max="680" value="500" oninput="updateLReadout()">
            <div id="l-readout">L = 500 px</div>
        </div>
        <div class="ctrl-group" id="action-group">
            <button class="btn btn-toggle" id="toggleBtn" onclick="toggleProb()">Show |ψ|²</button>
            <button class="btn btn-fire" onclick="fireProbe()">✦ Measure</button>
        </div>
    </div>
</div>

<script>
const QP_CONTENT = {
    concept: {
        title: 'CONCEPT',
        body: \`The cave acts as an <b>infinite potential well</b> — the particle is trapped and cannot escape. Confinement forces the wave to fit exactly between the walls: only patterns where ψ = 0 at both edges survive. These are the allowed states.\`
    },
    formula: {
        title: 'FORMULA',
        body: \`<b>Wave function:</b>
<div class="math">ψₙ(x) = √(2/L) · sin(nπx/L)</div>
<b>Energy:</b>
<div class="math">Eₙ = n² · π²ℏ² / (2mL²)</div>
Energy scales as <b>n²</b> — levels are not evenly spaced.\`
    },
    hint: {
        title: 'HINT',
        body: \`• Switch to <b>|ψ|²</b> mode to see where the particle is most likely found.<br>
• Red dots mark <b>nodes</b> — the particle is <em>never</em> detected there.<br>
• Match an antinode (yellow peak) to the glowing target line.<br>
• Try <b>n = 4</b> and look at the rightmost peak.\`
    }
};

let activePanel = null;

function toggleQuickPanel(key) {
    const panel = document.getElementById('quick-panel');
    const btnId = 'fb-' + key;
    const allBtns = document.querySelectorAll('.float-btn');

    if (activePanel === key) {
        panel.classList.remove('visible');
        document.getElementById(btnId).classList.remove('active-float');
        activePanel = null;
        return;
    }

    const c = QP_CONTENT[key];
    document.getElementById('qp-title').textContent = c.title;
    document.getElementById('qp-body').innerHTML = c.body;

    panel.classList.add('visible');
    allBtns.forEach(b => b.classList.remove('active-float'));
    document.getElementById(btnId).classList.add('active-float');
    activePanel = key;
}

const MM_INFO = {
    center: {
        title: 'PARTICLE IN A BOX',
        body: \`The simplest quantum system: a particle trapped in a 1D well with <b>infinite walls</b>. It cannot escape, and its energy is <b>quantized</b> — only specific wave patterns fit. This is the origin of discrete energy levels in atoms.\`
    },
    psi: {
        title: 'ψ(x) — WAVE FUNCTION',
        body: \`The blue wave in the chamber. It oscillates in time and describes the quantum <b>state</b> of the particle. Its sign (+ or −) has no direct physical meaning — but its shape determines everything about where the particle can be found.\`
    },
    prob: {
        title: '|ψ(x)|² — PROBABILITY DENSITY',
        body: \`Square the wave function and you get this yellow curve. It tells you the <b>probability of detecting the particle</b> at each location. Tall peaks → likely detection. Zero → impossible. Fire probes and watch the dots cluster under the peaks.\`
    },
    energy: {
        title: 'ENERGY LEVELS — Eₙ = n²E₁',
        body: \`Each quantum state n has a fixed energy. The key insight: energy grows as <b>n²</b>, so levels are not evenly spaced (E₂ = 4E₁, E₃ = 9E₁, E₄ = 16E₁). A larger chamber lowers the energy spacing; squeezing the chamber pushes levels apart.\`
    },
    n: {
        title: 'QUANTUM NUMBER n',
        body: \`The integer that labels each allowed state. n = 1 is the ground state (lowest energy). Higher n → more oscillations in ψ, more nodes, higher energy. In the chamber, changing n with the buttons directly selects a different standing wave.\`
    },
    antinodes: {
        title: 'NODES & ANTINODES',
        body: \`A <b>node</b> is where ψ = 0 permanently — the particle is <em>never</em> detected there (shown as red dots). An <b>antinode</b> is the peak — maximum probability. State n has exactly <b>n−1 nodes</b> inside the well. The target is one of n's antinodes.\`
    }
};

let selectedNode = null;

function selectNode(key) {
    const info = document.getElementById('mm-info');
    const allNodes = document.querySelectorAll('.mm-node');

    document.querySelectorAll('.node-ring').forEach(r => {
        r.setAttribute('stroke-width', '1.5');
        r.style.filter = '';
    });

    if (selectedNode === key) {
        info.classList.remove('open');
        selectedNode = null;
        return;
    }

    selectedNode = key;
    const d = MM_INFO[key];
    document.getElementById('mm-info-title').textContent = d.title;
    document.getElementById('mm-info-body').innerHTML = d.body;
    info.classList.add('open');

    const nodeEl = document.getElementById('node-' + key);
    if (nodeEl) {
        const ring = nodeEl.querySelector('.node-ring');
        if (ring) {
            ring.setAttribute('stroke-width', '3');
            ring.setAttribute('filter', 'url(#glow-strong)');
        }
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

document.querySelectorAll('.child-node').forEach(node => {
    const ring = node.querySelector('.node-ring');
    node.addEventListener('mouseenter', () => {
        if (ring && node.id !== 'node-' + selectedNode) {
            ring.setAttribute('stroke-width', '2.5');
            ring.setAttribute('filter', 'url(#glow-soft)');
        }
    });
    node.addEventListener('mouseleave', () => {
        if (ring && node.id !== 'node-' + selectedNode) {
            ring.setAttribute('stroke-width', '1.5');
            ring.removeAttribute('filter');
        }
    });
});

let n = 1;
let L_val = 500;
let showProb = false;
let probeParticles = [];
let successTriggered = false;
let targetN = 4;
let targetFrac = null;

function getAntinodeFrac(qn, k) {
    return (2 * k - 1) / (2 * qn);
}

function getCanvasSize() {
    let wrapper = document.getElementById('canvas-wrapper');
    let w = wrapper ? wrapper.offsetWidth : Math.min(820, window.innerWidth - 20);
    if (w < 100) w = Math.min(820, window.innerWidth - 20);
    let h = Math.round(w * 0.537);
    return { w: w, h: h };
}

function setup() {
    let sz = getCanvasSize();
    let cnv = createCanvas(sz.w, sz.h);
    cnv.parent('canvas-wrapper');
    updateNButtons();
    targetFrac = getAntinodeFrac(targetN, targetN);
}

function windowResized() {
    let sz = getCanvasSize();
    resizeCanvas(sz.w, sz.h);
}

function draw() {
    background(5, 5, 12);
    L_val = parseInt(select('#widthSlider').value());
    let startX = (width - L_val) / 2;

    stroke(255, 255, 255, 8); strokeWeight(1);
    for (let gx = 0; gx < width; gx += 40) line(gx, 0, gx, height);
    for (let gy = 0; gy < height; gy += 40) line(0, gy, width, gy);

    let tx = startX + targetFrac * L_val;
    noStroke(); fill(255, 200, 0, 15);
    rect(tx - 14, 0, 28, height);
    stroke(255, 200, 0, 40); strokeWeight(1);
    line(tx, 0, tx, height);

    stroke(0, 212, 255, 180); strokeWeight(3);
    line(startX, 40, startX, height - 40);
    line(startX + L_val, 40, startX + L_val, height - 40);

    noStroke(); fill(0, 212, 255, 12);
    rect(0, 0, startX, height);
    rect(startX + L_val, 0, width - startX - L_val, height);

    drawWave(startX);
    drawNodes(startX);
    drawProbeHits(startX);
    drawBear(startX);
    drawTargetIndicator(startX);
    updateEnergyBadge();
}

function drawWave(startX) {
    push(); noFill();

    if (showProb) {
        fill(255, 235, 59, 18); stroke(255, 235, 59, 200); strokeWeight(2.5);
        beginShape();
        vertex(startX, height / 2);
        for (let x = 0; x <= L_val; x++) {
            let psi = Math.sin((n * Math.PI * x) / L_val);
            vertex(startX + x, height / 2 - psi * psi * 130);
        }
        vertex(startX + L_val, height / 2);
        endShape(CLOSE);

        noFill(); stroke(255, 235, 59); strokeWeight(2);
        beginShape();
        for (let x = 0; x <= L_val; x++) {
            let psi = Math.sin((n * Math.PI * x) / L_val);
            vertex(startX + x, height / 2 - psi * psi * 130);
        }
        endShape();
    } else {
        let t = frameCount * 0.07;

        stroke(0, 150, 255, 40); strokeWeight(6);
        beginShape();
        for (let x = 0; x <= L_val; x++) {
            let psi = Math.sin((n * Math.PI * x) / L_val) * Math.sin(t);
            vertex(startX + x, height / 2 - psi * 90);
        }
        endShape();

        stroke(0, 212, 255, 220); strokeWeight(2);
        beginShape();
        for (let x = 0; x <= L_val; x++) {
            let psi = Math.sin((n * Math.PI * x) / L_val) * Math.sin(t);
            vertex(startX + x, height / 2 - psi * 90);
        }
        endShape();
    }
    pop();
}

function drawNodes(startX) {
    if (!showProb) return;
    for (let k = 1; k < n; k++) {
        let nx = startX + (k * L_val / n);
        fill(255, 71, 87); noStroke();
        circle(nx, height / 2, 7);
        fill(255, 71, 87, 120); noStroke();
        textSize(9); textAlign(CENTER);
        text('node', nx, height / 2 + 18);
    }
}

function drawBear(startX) {
    let bx = startX + (targetFrac * L_val);
    push();
    let aligned = checkAlignment();
    if (aligned) {
        drawingContext.shadowBlur = 28;
        drawingContext.shadowColor = '#00ffff';
        stroke(0, 255, 255, 200); strokeWeight(2); fill(0, 255, 255, 60);
    } else {
        noStroke(); fill(120, 120, 150, 35);
    }
    circle(bx, height / 2 + 28, 26);
    circle(bx, height / 2 + 10, 20);
    circle(bx - 9, height / 2 + 2, 8);
    circle(bx + 9, height / 2 + 2, 8);
    pop();
}

function drawTargetIndicator(startX) {
    let tx = startX + targetFrac * L_val;
    noStroke(); fill(255, 200, 0, 100);
    textSize(9); textAlign(CENTER);
    text('TARGET', tx, height - 14);
}

function drawProbeHits(startX) {
    for (let i = probeParticles.length - 1; i >= 0; i--) {
        let p = probeParticles[i];
        let px = startX + p.x * L_val;
        drawingContext.shadowBlur = 8;
        drawingContext.shadowColor = \`rgba(255,255,255,\${p.life / 255})\`;
        fill(255, p.life); noStroke();
        circle(px, height / 2 + 28, 4);
        drawingContext.shadowBlur = 0;
        p.life -= 3;
        if (p.life <= 0) probeParticles.splice(i, 1);
    }
}

function checkAlignment() {
    let tol = 0.04;
    for (let k = 1; k <= n; k++) {
        if (Math.abs(getAntinodeFrac(n, k) - targetFrac) < tol) return true;
    }
    return false;
}

function nearestAntinode() {
    let best = 1, bestDist = 999;
    for (let k = 1; k <= n; k++) {
        let d = Math.abs(getAntinodeFrac(n, k) - targetFrac);
        if (d < bestDist) { bestDist = d; best = k; }
    }
    return best;
}

function ordinal(i) {
    const s = ['', '1st', '2nd', '3rd', '4th', '5th'];
    return s[i] || i + 'th';
}

function updateEnergyBadge() {
    document.getElementById('energy-badge').textContent = \`E₁ · \${n}² = E₁ · \${n * n}\`;
}

function checkSuccess() {
    if (checkAlignment() && !successTriggered) {
        successTriggered = true;
        let msg = \`At n=\${n}, the \${ordinal(nearestAntinode())} antinode aligns with the hidden target. The quantum state is resolved.\`;
        document.getElementById('success-msg').textContent = msg;
        document.getElementById('task-bar').textContent = \`✓ SOLVED — antinode locked at n = \${n}\`;
        document.getElementById('task-bar').classList.add('solved');
        setTimeout(() => document.getElementById('success-overlay').classList.add('show'), 900);
    } else if (!checkAlignment()) {
        successTriggered = false;
        document.getElementById('task-bar').classList.remove('solved');
        document.getElementById('task-bar').textContent = 'OBJECTIVE: Find the quantum state where the antinode aligns with the hidden target';
    }
}

function setN(val) {
    n = val;
    probeParticles = [];
    updateNButtons();
    checkSuccess();
}

function updateNButtons() {
    document.querySelectorAll('.n-btn').forEach((b, i) => {
        b.classList.toggle('active', i + 1 === n);
    });
}

function toggleProb() {
    showProb = !showProb;
    document.getElementById('mode-badge').textContent = showProb ? 'STATE: |ψₙ(x)|²' : 'STATE: ψₙ(x)';
    document.getElementById('toggleBtn').textContent = showProb ? 'Show ψ(x)' : 'Show |ψ|²';
    document.getElementById('toggleBtn').classList.toggle('active-mode', showProb);
}

function fireProbe() {
    let added = 0, attempts = 0;
    while (added < 20 && attempts < 2000) {
        let rx = Math.random();
        let psi = Math.sin(n * Math.PI * rx);
        if (Math.random() < psi * psi) {
            probeParticles.push({ x: rx, life: 255 });
            added++;
        }
        attempts++;
    }
}

function updateLReadout() {
    let v = document.getElementById('widthSlider').value;
    document.getElementById('l-readout').textContent = \`L = \${v} px\`;
    probeParticles = [];
}

function dismissSuccess() {
    document.getElementById('success-overlay').classList.remove('show');
}

const QUIZ_DATA = [
    {q:'Particle in box?',options:['Classical bounce','Confined quantum','Big particle','Magnet'],answer:1,explanation:'Energy is quantized when a particle is confined in a box.'},
    {q:'n represents?',options:['Particles','Energy level','Width','Time'],answer:1,explanation:'n = quantum number, labelling the energy state.'},
    {q:'Why specific patterns?',options:['Rubber cave','Boundary condition','Choice','Temp'],answer:1,explanation:'The wave must fit exactly between walls — boundary conditions.'},
    {q:'Node?',options:['Max point','Zero point','Midpoint','Energy'],answer:1,explanation:'Node = zero amplitude of the wavefunction.'},
    {q:'Energy narrow box?',options:['Decrease','Same','Increase','Stop'],answer:2,explanation:'Shorter wavelength forced by narrower box \u2192 higher energy.'}
];
let qIdx=0, qScore=0, qAnswered=false;

function openQuiz() {
    qIdx=0; qScore=0;
    if(activePanel){ document.getElementById('quick-panel').classList.remove('visible'); activePanel=null; }
    document.getElementById('quiz-overlay').classList.add('show');
    document.getElementById('quiz-score-screen').style.display='none';
    document.getElementById('quiz-q-wrap').style.display='block';
    renderQuestion();
}
function closeQuiz(){ document.getElementById('quiz-overlay').classList.remove('show'); }
function renderQuestion(){
    const d=QUIZ_DATA[qIdx]; qAnswered=false;
    document.getElementById('quiz-progress').textContent=(qIdx+1)+' / '+QUIZ_DATA.length;
    document.getElementById('quiz-question').textContent=d.q;
    document.getElementById('quiz-explanation').style.display='none';
    document.getElementById('quiz-next-btn').style.display='none';
    const opts=document.getElementById('quiz-options'); opts.innerHTML='';
    d.options.forEach(function(opt,i){
        var btn=document.createElement('button');
        btn.className='quiz-option'; btn.textContent=opt;
        btn.onclick=function(){ if(!qAnswered) pickAnswer(i,btn); };
        opts.appendChild(btn);
    });
}
function pickAnswer(i,btn){
    qAnswered=true;
    const d=QUIZ_DATA[qIdx];
    const allBtns=document.querySelectorAll('.quiz-option');
    allBtns.forEach(function(b){ b.disabled=true; });
    if(i===d.answer){ btn.classList.add('correct'); qScore++; }
    else { btn.classList.add('wrong'); allBtns[d.answer].classList.add('correct'); }
    const exp=document.getElementById('quiz-explanation');
    exp.textContent=d.explanation; exp.style.display='block';
    const nxt=document.getElementById('quiz-next-btn');
    nxt.style.display='block';
    nxt.textContent=qIdx<QUIZ_DATA.length-1?'Next \u2192':'See Results';
}
function quizNext(){
    qIdx++;
    if(qIdx<QUIZ_DATA.length){ renderQuestion(); }
    else{
        document.getElementById('quiz-q-wrap').style.display='none';
        document.getElementById('quiz-score-screen').style.display='block';
        document.getElementById('quiz-score-num').textContent=qScore+' / '+QUIZ_DATA.length;
        const msgs=['Keep exploring!','Good effort!','Nice work!','Great job!','Quantum Master!'];
        document.getElementById('quiz-score-msg').textContent=msgs[qScore]||msgs[0];
    }
}
function quizRetry(){
    qIdx=0; qScore=0;
    document.getElementById('quiz-score-screen').style.display='none';
    document.getElementById('quiz-q-wrap').style.display='block';
    renderQuestion();
}
</script>
</body>
</html>`;

export default function Level3Page() {
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
          Initializing Level 3...
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
          title="Level 3: The Resonance Chamber"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      <MrPsiChat currentLevel={3} />
    </div>
  );
}
