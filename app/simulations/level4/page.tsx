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
    <title>Schrödinger's Cave — Level 4: Heisenberg Uncertainty</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"><\/script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Rajdhani:wght@300;500;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --cyan: #00d4ff;
            --yellow: #ffeb3b;
            --red: #ff4757;
            --purple: #c084fc;
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

        /* ── HEADER ─────────────────────────────────── */
        #header { text-align: center; padding: 18px 0 10px; }
        #header .level-tag {
            font-family: 'Space Mono', monospace;
            font-size: 0.62em;
            letter-spacing: 4px;
            color: var(--purple);
            opacity: 0.75;
            margin-bottom: 4px;
        }
        #header h1 {
            font-family: 'Space Mono', monospace;
            font-size: 1.05em;
            letter-spacing: 5px;
            color: var(--cyan);
            text-shadow: 0 0 20px rgba(0,212,255,0.4);
        }

        /* ── APP SHELL ──────────────────────────────── */
        #app {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding: 0 20px 30px;
        }

        /* ── CANVAS ─────────────────────────────────── */
        #canvas-wrapper {
            position: relative;
            border: 1px solid var(--border);
            border-radius: 8px;
            background: #000;
            box-shadow: 0 0 40px rgba(0,212,255,0.07);
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
            font-size: 0.7em; color: var(--purple); opacity: 0.85;
            pointer-events: none;
        }

        /* ── CONTROLS ───────────────────────────────── */
        #controls {
            display: flex; gap: 14px;
            align-items: stretch;
            width: 100%; max-width: 820px;
        }
        .ctrl-group {
            background: var(--glass);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 12px 16px;
            display: flex; flex-direction: column; gap: 8px;
        }
        .ctrl-label {
            font-size: 0.68em; letter-spacing: 2px;
            color: rgba(0,212,255,0.5); text-transform: uppercase;
        }

        /* n-buttons (kept from L3) */
        #n-group { flex: 1; }
        #n-buttons { display: flex; gap: 6px; }
        .n-btn {
            flex: 1; padding: 8px 0;
            background: transparent;
            border: 1px solid rgba(0,212,255,0.3);
            color: rgba(0,212,255,0.6);
            border-radius: 5px;
            font-family: 'Space Mono', monospace;
            font-size: 0.85em; cursor: pointer; transition: all 0.2s;
        }
        .n-btn:hover { border-color: var(--cyan); color: var(--cyan); }
        .n-btn.active {
            background: var(--cyan); color: #000;
            border-color: var(--cyan);
            box-shadow: 0 0 12px rgba(0,212,255,0.4);
        }

        /* ── UNCERTAINTY SLIDER (NEW) ─────────────────
           Full-width track with labelled ends           */
        #hup-group { flex: 1.6; }
        #hup-track {
            display: flex; align-items: center; gap: 8px; margin-top: 2px;
        }
        #hup-track span {
            font-family: 'Space Mono', monospace;
            font-size: 0.62em; white-space: nowrap;
            transition: opacity 0.3s;
        }
        #hup-track .lbl-pos { color: #ff7070; }
        #hup-track .lbl-mom { color: #60c0ff; }
        #hupSlider {
            flex: 1; cursor: pointer;
            accent-color: var(--purple);
            -webkit-appearance: none; appearance: none;
            height: 4px; border-radius: 2px;
            background: linear-gradient(
                to right,
                rgba(255,112,112,0.5),
                rgba(192,132,252,0.8) 50%,
                rgba(96,192,255,0.5)
            );
        }
        #hupSlider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px; height: 18px; border-radius: 50%;
            background: var(--purple);
            box-shadow: 0 0 10px rgba(192,132,252,0.7);
            cursor: pointer; transition: box-shadow 0.2s;
        }
        #hupSlider::-webkit-slider-thumb:hover {
            box-shadow: 0 0 18px rgba(192,132,252,1);
        }
        /* balance zone highlight */
        #hup-balance-hint {
            font-size: 0.7em; color: rgba(192,132,252,0.5);
            text-align: center; letter-spacing: 1px;
            font-family: 'Space Mono', monospace;
            transition: color 0.4s;
        }
        #hup-balance-hint.balanced { color: #c084fc; }

        /* chamber-length slider (kept from L3) */
        #l-group { flex: 1.2; }
        #widthSlider { width: 100%; accent-color: var(--cyan); cursor: pointer; }
        #l-readout {
            font-family: 'Space Mono', monospace;
            font-size: 0.7em; color: rgba(0,212,255,0.5); text-align: right;
        }

        /* action buttons (kept) */
        #action-group { display: flex; gap: 8px; flex-direction: column; justify-content: space-between; }
        .btn {
            padding: 9px 20px; border: none; border-radius: 5px;
            cursor: pointer; font-family: 'Rajdhani', sans-serif;
            font-weight: 700; font-size: 0.85em; letter-spacing: 1px;
            transition: all 0.2s; text-transform: uppercase; white-space: nowrap;
        }
        .btn-toggle { background: transparent; border: 1px solid var(--yellow); color: var(--yellow); }
        .btn-toggle:hover, .btn-toggle.active-mode { background: var(--yellow); color: #000; }
        .btn-fire { background: var(--cyan); color: #000; box-shadow: 0 0 15px rgba(0,212,255,0.3); }
        .btn-fire:hover { box-shadow: 0 0 25px rgba(0,212,255,0.6); transform: scale(1.02); }

        /* ── TASK BAR ───────────────────────────────── */
        #task-bar {
            font-family: 'Space Mono', monospace; font-size: 0.72em;
            color: rgba(192,132,252,0.6); letter-spacing: 1px;
            border: 1px dashed rgba(192,132,252,0.25);
            border-radius: 6px; padding: 8px 18px;
            max-width: 820px; width: 100%; text-align: center; transition: all 0.4s;
        }
        #task-bar.solved { border-color: var(--cyan); color: var(--cyan); border-style: solid; }

        /* ── FLOATING NAV (unchanged from L3) ──────── */
        #float-nav {
            position: fixed; right: 18px; top: 50%;
            transform: translateY(-50%);
            display: flex; flex-direction: column; gap: 10px; z-index: 50;
        }
        .float-btn {
            width: 72px; padding: 10px 0;
            background: rgba(5,5,18,0.85);
            border: 1px solid rgba(0,212,255,0.3);
            border-radius: 30px; color: rgba(0,212,255,0.65);
            font-family: 'Rajdhani', sans-serif; font-weight: 700;
            font-size: 0.72em; letter-spacing: 1px; text-transform: uppercase;
            cursor: pointer; text-align: center; transition: all 0.25s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 12px rgba(0,212,255,0.06);
        }
        .float-btn:hover {
            border-color: var(--cyan); color: #fff;
            box-shadow: 0 0 20px rgba(0,212,255,0.25), inset 0 0 10px rgba(0,212,255,0.08);
            transform: translateX(-3px);
        }
        .float-btn.active-float {
            border-color: var(--cyan); color: #000;
            background: var(--cyan); box-shadow: 0 0 22px rgba(0,212,255,0.5);
        }

        /* ── QUICK PANEL (unchanged from L3) ────────── */
        #quick-panel {
            position: fixed; right: 104px; top: 50%;
            transform: translateY(-50%);
            width: 280px;
            background: rgba(8,8,20,0.97);
            border: 1px solid rgba(0,212,255,0.25);
            border-radius: 12px; padding: 22px 20px;
            z-index: 49; backdrop-filter: blur(20px);
            box-shadow: 0 0 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,212,255,0.06);
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
            color: var(--cyan); letter-spacing: 2px; text-transform: uppercase;
            margin-bottom: 14px; padding-bottom: 8px;
            border-bottom: 1px solid rgba(0,212,255,0.15);
        }
        #qp-body { font-size: 0.88em; line-height: 1.65; color: #bbb; }
        #qp-body b { color: #fff; }
        #qp-body .math {
            font-family: 'Space Mono', monospace;
            background: rgba(0,212,255,0.06);
            border-left: 2px solid var(--cyan);
            padding: 7px 12px; margin: 10px 0;
            font-size: 0.85em; color: rgba(0,212,255,0.9);
            border-radius: 0 4px 4px 0;
        }

        /* ── MINDMAP MODAL (unchanged from L3) ──────── */
        #mindmap-overlay {
            position: fixed; inset: 0;
            background: rgba(2,2,10,0.96);
            z-index: 100;
            display: flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none; transition: opacity 0.35s ease;
        }
        #mindmap-overlay.show { opacity: 1; pointer-events: all; }
        #mindmap-container {
            position: relative; width: 100vw; height: 100vh;
            display: flex; align-items: center; justify-content: center;
        }
        #mm-close {
            position: absolute; top: 24px; right: 28px;
            background: transparent; border: 1px solid rgba(0,212,255,0.3);
            color: rgba(0,212,255,0.6); border-radius: 50%;
            width: 36px; height: 36px; font-size: 1.1em; cursor: pointer;
            transition: all 0.2s; font-family: monospace;
            display: flex; align-items: center; justify-content: center;
        }
        #mm-close:hover { border-color: var(--cyan); color: #fff; background: rgba(0,212,255,0.1); }
        #mm-title {
            position: absolute; top: 24px; left: 28px;
            font-family: 'Space Mono', monospace; font-size: 0.75em;
            color: rgba(192,132,252,0.5); letter-spacing: 3px; text-transform: uppercase;
        }
        #mindmap-svg { width: min(860px,95vw); height: min(560px,80vh); overflow: visible; }
        #mm-info {
            position: absolute; bottom: 36px; left: 50%;
            transform: translateX(-50%);
            width: min(600px,90vw);
            background: rgba(6,6,18,0.97);
            border: 1px solid rgba(0,212,255,0.2);
            border-radius: 10px; padding: 0; max-height: 0; overflow: hidden;
            transition: max-height 0.4s ease, padding 0.3s ease;
        }
        #mm-info.open { max-height: 200px; padding: 18px 22px; }
        #mm-info-title {
            font-family: 'Space Mono', monospace; font-size: 0.75em;
            color: var(--purple); letter-spacing: 2px; margin-bottom: 10px;
        }
        #mm-info-body { font-size: 0.9em; line-height: 1.6; color: #bbb; }
        #mm-info-body b { color: #fff; }

        /* ── SUCCESS OVERLAY ────────────────────────── */
        #success-overlay {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.85);
            display: flex; align-items: center; justify-content: center;
            z-index: 200; opacity: 0; pointer-events: none; transition: opacity 0.5s;
        }
        #success-overlay.show { opacity: 1; pointer-events: all; }
        #success-box {
            width: 460px; background: #09091a;
            border: 2px solid var(--purple);
            border-radius: 14px; padding: 36px 30px; text-align: center;
            box-shadow: 0 0 80px rgba(192,132,252,0.25);
        }
        #success-box h2 {
            font-family: 'Space Mono', monospace; color: var(--purple);
            font-size: 1.45em; margin-bottom: 14px;
        }
        #success-box p { font-size: 0.9em; line-height: 1.6; color: #ccc; margin-bottom: 12px; }
        #success-box .highlight { color: var(--cyan); font-weight: 700; letter-spacing: 1px; }
        .btn-continue {
            margin-top: 20px; background: var(--purple); color: #000;
            padding: 12px 30px; border-radius: 6px;
            font-weight: 700; letter-spacing: 1px;
            cursor: pointer; border: none; font-size: 0.9em;
        }
        .btn-continue:hover { opacity: 0.85; }

        /* ── MOBILE RESPONSIVE ──────────────────────── */
        @media (max-width: 700px) {
            #header { padding: 10px 0 6px; }
            #header h1 { font-size: 0.8em; letter-spacing: 3px; }
            #header .level-tag { font-size: 0.55em; }
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
            #hup-track span { font-size: 0.55em; }
            #hup-balance-hint { font-size: 0.62em; }
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
            #success-box { width: min(90vw, 460px); padding: 24px 20px; }
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
            width: min(520px, 92vw); background: #09091a; border: 2px solid var(--purple);
            border-radius: 16px; padding: 30px 28px;
            box-shadow: 0 0 60px rgba(192,132,252,0.2); position: relative;
        }
        #quiz-close {
            position: absolute; top: 14px; right: 16px; background: transparent;
            border: 1px solid rgba(192,132,252,0.35); color: rgba(192,132,252,0.7);
            border-radius: 50%; width: 30px; height: 30px; font-size: 1em;
            cursor: pointer; font-family: monospace;
            display: flex; align-items: center; justify-content: center; transition: 0.2s;
        }
        #quiz-close:hover { background: rgba(192,132,252,0.1); color: #fff; }
        #quiz-level-tag { font-family: 'Space Mono',monospace; font-size: 0.62em; letter-spacing: 3px; text-transform: uppercase; color: rgba(192,132,252,0.55); margin-bottom: 6px; }
        #quiz-progress { font-family: 'Space Mono',monospace; font-size: 0.68em; color: rgba(255,255,255,0.35); letter-spacing: 2px; text-align: right; margin-bottom: 14px; }
        #quiz-question { font-size: 1em; font-weight: 600; color: #fff; margin-bottom: 18px; line-height: 1.5; }
        .quiz-option {
            width: 100%; text-align: left; background: rgba(192,132,252,0.04);
            border: 1px solid rgba(192,132,252,0.2); color: #ccc; border-radius: 8px;
            padding: 10px 14px; margin-bottom: 9px; font-family: 'Rajdhani',sans-serif;
            font-size: 0.92rem; cursor: pointer; transition: 0.2s; display: block;
        }
        .quiz-option:hover:not(:disabled) { border-color: var(--purple); color: #fff; background: rgba(192,132,252,0.1); }
        .quiz-option.correct { border-color: #00ff9d; background: rgba(0,255,157,0.12); color: #00ff9d; }
        .quiz-option.wrong   { border-color: #ff4757; background: rgba(255,71,87,0.12); color: #ff4757; }
        #quiz-explanation {
            font-size: 0.85rem; line-height: 1.5; color: #aaa;
            background: rgba(255,255,255,0.04); border-left: 3px solid var(--purple);
            padding: 10px 14px; border-radius: 0 6px 6px 0; margin-top: 4px; display: none;
        }
        #quiz-next-btn {
            margin-top: 16px; width: 100%; background: var(--purple); color: #000;
            border: none; border-radius: 8px; padding: 10px; font-family: 'Rajdhani',sans-serif;
            font-weight: 700; font-size: 0.88rem; letter-spacing: 1px;
            text-transform: uppercase; cursor: pointer; display: none; transition: 0.2s;
        }
        #quiz-next-btn:hover { opacity: 0.85; }
        #quiz-score-screen { text-align: center; display: none; }
        #quiz-score-screen h3 { font-family: 'Space Mono',monospace; font-size: 1.2rem; color: var(--purple); margin-bottom: 10px; letter-spacing: 2px; }
        #quiz-score-num { font-family: 'Space Mono',monospace; font-size: 2.8rem; font-weight: 700; color: #fff; }
        #quiz-score-msg { font-size: 0.9rem; color: #aaa; margin: 10px 0 20px; }
        #quiz-retry-btn {
            background: transparent; border: 1px solid var(--purple); color: var(--purple);
            border-radius: 8px; padding: 9px 24px; font-family: 'Rajdhani',sans-serif;
            font-weight: 700; cursor: pointer; font-size: 0.85rem;
            letter-spacing: 1px; text-transform: uppercase;
        }
        #quiz-retry-btn:hover { background: var(--purple); color: #000; }
    </style>
</head>
<body>

<div id="success-overlay">
    <div id="success-box">
        <h2>BALANCE ACHIEVED</h2>
        <p id="success-msg">Uncertainty budget balanced — both Δx and Δp are finite.</p>
        <p class="highlight">ΔxΔp ≥ ℏ/2 — SATISFIED</p>
        <p>You have found the quantum ground truth: a particle cannot have a perfectly sharp position <em>and</em> a perfectly sharp momentum simultaneously. Nature enforces this as a hard law — not a measurement problem.</p>
        <p style="font-style:italic; color:#888; border-top:1px solid #222; padding-top:12px;">The <b>Uncertainty Principle</b> is not about disturbing the system. It is about what the system <b>fundamentally is</b>.</p>
        <button class="btn-continue" onclick="dismissSuccess()">ACKNOWLEDGE & CONTINUE</button>
    </div>
</div>

<div id="mindmap-overlay">
    <div id="mindmap-container">
        <div id="mm-title">UNCERTAINTY PRINCIPLE — NOTES</div>
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
                    <stop offset="0%" stop-color="#c084fc" stop-opacity="0.25"/>
                    <stop offset="100%" stop-color="#c084fc" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <line x1="430" y1="260" x2="180" y2="120" stroke="rgba(192,132,252,0.2)" stroke-width="1.5" stroke-dasharray="4 4"/>
            <line x1="430" y1="260" x2="680" y2="120" stroke="rgba(192,132,252,0.2)" stroke-width="1.5" stroke-dasharray="4 4"/>
            <line x1="430" y1="260" x2="680" y2="395" stroke="rgba(192,132,252,0.2)" stroke-width="1.5" stroke-dasharray="4 4"/>
            <line x1="430" y1="260" x2="180" y2="395" stroke="rgba(192,132,252,0.2)" stroke-width="1.5" stroke-dasharray="4 4"/>
            <line x1="430" y1="260" x2="430" y2="76"  stroke="rgba(192,132,252,0.2)" stroke-width="1.5" stroke-dasharray="4 4"/>

            <g class="mm-node" id="node-center" onclick="selectNode('center')" style="cursor:pointer;">
                <circle cx="430" cy="260" r="68" fill="url(#centerGrad)" stroke="rgba(192,132,252,0.5)" stroke-width="1.5"/>
                <circle cx="430" cy="260" r="56" fill="rgba(5,5,18,0.9)" stroke="#c084fc" stroke-width="2"/>
                <text x="430" y="250" text-anchor="middle" fill="#fff" font-family="Space Mono, monospace" font-size="10.5" font-weight="700">HEISENBERG</text>
                <text x="430" y="267" text-anchor="middle" fill="#fff" font-family="Space Mono, monospace" font-size="10.5" font-weight="700">UNCERTAINTY</text>
                <text x="430" y="284" text-anchor="middle" fill="rgba(192,132,252,0.65)" font-family="Rajdhani, sans-serif" font-size="10">ΔxΔp ≥ ℏ/2</text>
            </g>

            <g class="mm-node child-node" id="node-dx" onclick="selectNode('dx')" style="cursor:pointer;">
                <circle cx="180" cy="120" r="46" fill="rgba(5,5,18,0.9)" stroke="rgba(255,112,112,0.45)" stroke-width="1.5" class="node-ring"/>
                <text x="180" y="114" text-anchor="middle" fill="#ff7070" font-family="Space Mono, monospace" font-size="16" font-weight="700">Δx</text>
                <text x="180" y="132" text-anchor="middle" fill="rgba(200,200,220,0.6)" font-family="Rajdhani, sans-serif" font-size="10.5">Position spread</text>
            </g>

            <g class="mm-node child-node" id="node-dp" onclick="selectNode('dp')" style="cursor:pointer;">
                <circle cx="680" cy="120" r="46" fill="rgba(5,5,18,0.9)" stroke="rgba(96,192,255,0.45)" stroke-width="1.5" class="node-ring"/>
                <text x="680" y="114" text-anchor="middle" fill="#60c0ff" font-family="Space Mono, monospace" font-size="16" font-weight="700">Δp</text>
                <text x="680" y="132" text-anchor="middle" fill="rgba(200,200,220,0.6)" font-family="Rajdhani, sans-serif" font-size="10.5">Momentum spread</text>
            </g>

            <g class="mm-node child-node" id="node-packet" onclick="selectNode('packet')" style="cursor:pointer;">
                <circle cx="680" cy="395" r="46" fill="rgba(5,5,18,0.9)" stroke="rgba(0,212,255,0.4)" stroke-width="1.5" class="node-ring"/>
                <text x="680" y="389" text-anchor="middle" fill="#00d4ff" font-family="Space Mono, monospace" font-size="12" font-weight="700">Wave packet</text>
                <text x="680" y="407" text-anchor="middle" fill="rgba(200,200,220,0.6)" font-family="Rajdhani, sans-serif" font-size="10.5">Fourier duality</text>
            </g>

            <g class="mm-node child-node" id="node-obs" onclick="selectNode('obs')" style="cursor:pointer;">
                <circle cx="180" cy="395" r="46" fill="rgba(5,5,18,0.9)" stroke="rgba(255,235,59,0.4)" stroke-width="1.5" class="node-ring"/>
                <text x="180" y="389" text-anchor="middle" fill="#ffeb3b" font-family="Space Mono, monospace" font-size="11" font-weight="700">Measurement</text>
                <text x="180" y="407" text-anchor="middle" fill="rgba(200,200,220,0.6)" font-family="Rajdhani, sans-serif" font-size="10.5">collapse &amp; disturbance</text>
            </g>

            <g class="mm-node child-node" id="node-tradeoff" onclick="selectNode('tradeoff')" style="cursor:pointer;">
                <circle cx="430" cy="76" r="46" fill="rgba(5,5,18,0.9)" stroke="rgba(0,255,150,0.4)" stroke-width="1.5" class="node-ring"/>
                <text x="430" y="68" text-anchor="middle" fill="#00ff96" font-family="Space Mono, monospace" font-size="11" font-weight="700">Trade-off</text>
                <text x="430" y="85" text-anchor="middle" fill="#00ff96" font-family="Space Mono, monospace" font-size="11" font-weight="700">↔ Budget</text>
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
    <div class="level-tag">LEVEL 4 — HEISENBERG UNCERTAINTY</div>
    <h1>UNCERTAINTY CHAMBER</h1>
</div>

<div id="app">
    <div id="canvas-wrapper">
        <div id="mode-badge">STATE: ψₙ(x)</div>
        <div id="energy-badge">Δx·Δp = ℏ/2</div>
    </div>
    <div id="task-bar">BALANCE the slider — find the zone where both position AND momentum are knowable</div>
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
        <div class="ctrl-group" id="hup-group">
            <div class="ctrl-label">Position ←→ Momentum precision</div>
            <div id="hup-track">
                <span class="lbl-pos">Δx→0</span>
                <input type="range" id="hupSlider" min="0" max="100" value="50" oninput="onHupSlider()">
                <span class="lbl-mom">Δp→0</span>
            </div>
            <div id="hup-balance-hint">· · ·</div>
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
        body: \`You cannot simultaneously know the exact <b>position</b> and exact <b>momentum</b> of a quantum particle. This is not a flaw in your instruments — it is a fundamental property of waves. A perfectly localised particle has no well-defined wavelength, so no well-defined momentum. A perfectly sharp momentum state is spread across all space.\`
    },
    formula: {
        title: 'FORMULA',
        body: \`<b>Heisenberg Uncertainty:</b>
<div class="math">Δx · Δp ≥ ℏ/2</div>
<b>Also holds for energy–time:</b>
<div class="math">ΔE · Δt ≥ ℏ/2</div>
Δx = position uncertainty, Δp = momentum uncertainty. <b>ℏ = h/2π</b> is the reduced Planck constant.\`
    },
    hint: {
        title: 'HINT',
        body: \`• Drag the slider all the way <b>left</b>: the wave collapses to a spike — you know where the bear is, but it shakes violently (large Δp).<br>
• Drag all the way <b>right</b>: the wave spreads smoothly — momentum is well-defined, but the bear is nowhere and everywhere.<br>
• Find the <b>middle zone</b> (roughly 35–65%) where both are partially known — that is the balanced state.\`
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
        activePanel = null; return;
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
        title: 'HEISENBERG UNCERTAINTY PRINCIPLE',
        body: \`First stated by Werner Heisenberg in 1927. It says that certain pairs of physical properties — like position and momentum — cannot <em>both</em> be known with arbitrary precision at the same time. This is not a practical limitation; it is woven into the mathematical structure of quantum mechanics.\`
    },
    dx: {
        title: 'Δx — POSITION UNCERTAINTY',
        body: \`Δx is how spread-out the particle's position is. A small Δx means the particle is well-localised — you know roughly where it is. But to achieve small Δx, you need a narrow wave packet, which requires many wavelengths — and that means a wide spread in momentum.\`
    },
    dp: {
        title: 'Δp — MOMENTUM UNCERTAINTY',
        body: \`Δp is the spread in the particle's momentum (p = mv). A small Δp means the particle has a nearly definite speed and direction. But a pure momentum state is a sine wave stretching to infinity — the particle's position is completely unknown.\`
    },
    packet: {
        title: 'WAVE PACKET & FOURIER DUALITY',
        body: \`A localised wave packet is built from many sine waves with different frequencies (momenta). The narrower the packet in space, the wider the range of frequencies needed. This is a fundamental property of <b>Fourier transforms</b> — the uncertainty principle is its physical expression.\`
    },
    obs: {
        title: 'MEASUREMENT & COLLAPSE',
        body: \`When you measure position precisely (small Δx), the wave function collapses to a narrow spike — but this spike has enormous momentum uncertainty. The act of measurement does not <em>cause</em> the uncertainty; the uncertainty was always there. Measurement just reveals one of the possible values.\`
    },
    tradeoff: {
        title: 'THE UNCERTAINTY BUDGET',
        body: \`ΔxΔp ≥ ℏ/2 defines a <b>minimum product</b>. You can choose how to distribute that budget: squeeze Δx and Δp grows; squeeze Δp and Δx grows. The balanced state — where both uncertainties are equal and minimal — is called the <b>coherent state</b>, the most "classical-like" quantum state.\`
    }
};

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
    const nav   = document.getElementById('float-nav');
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
            ring.setAttribute('stroke-width', '2.5'); ring.setAttribute('filter', 'url(#glow-soft)');
        }
    });
    node.addEventListener('mouseleave', () => {
        if (ring && node.id !== 'node-' + selectedNode) {
            ring.setAttribute('stroke-width', '1.5'); ring.removeAttribute('filter');
        }
    });
});

let n            = 1;
let L_val        = 500;
let showProb     = false;
let probeParticles = [];
let successTriggered = false;

let hupVal = 50;

let shakeX = 0, shakeY = 0;

function onHupSlider() {
    hupVal = parseInt(document.getElementById('hupSlider').value);
    updateHupUI();
    checkSuccess();
}

function updateHupUI() {
    const hint = document.getElementById('hup-balance-hint');
    const badge = document.getElementById('energy-badge');

    const dxNorm = 1 - hupVal / 100;   
    const dpNorm = hupVal / 100;        
    const product = (dxNorm * 0.5 + 0.5) * (dpNorm * 0.5 + 0.5); 

    const isBalanced = hupVal >= 35 && hupVal <= 65;

    if (hupVal < 20) {
        hint.textContent = 'Δx → 0  |  Δp → ∞  — position locked, momentum wild';
        hint.classList.remove('balanced');
    } else if (hupVal > 80) {
        hint.textContent = 'Δp → 0  |  Δx → ∞  — momentum locked, position lost';
        hint.classList.remove('balanced');
    } else if (isBalanced) {
        hint.textContent = '⬡ BALANCE ZONE — ΔxΔp ≈ ℏ/2';
        hint.classList.add('balanced');
    } else {
        hint.textContent = 'Adjusting uncertainty budget…';
        hint.classList.remove('balanced');
    }

    document.getElementById('mode-badge').textContent =
        hupVal < 40 ? 'STATE: SHARP ψ (position mode)'
      : hupVal > 60 ? 'STATE: SPREAD ψ (momentum mode)'
      : 'STATE: BALANCED ψ';

    badge.textContent = \`Δx·Δp \${isBalanced ? '≈' : '≥'} ℏ/2\`;
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
    updateHupUI();
}

function windowResized() {
    let sz = getCanvasSize();
    resizeCanvas(sz.w, sz.h);
}

function draw() {
    background(5, 5, 12);
    L_val = parseInt(select('#widthSlider').value());

    let posExtreme = Math.max(0, (50 - hupVal) / 50); 
    shakeX = posExtreme > 0.1 ? random(-posExtreme * 12, posExtreme * 12) : 0;
    shakeY = posExtreme > 0.1 ? random(-posExtreme * 6,  posExtreme * 6)  : 0;

    let startX = (width - L_val) / 2;

    stroke(255,255,255,8); strokeWeight(1);
    for (let gx = 0; gx < width; gx += 40) line(gx,0,gx,height);
    for (let gy = 0; gy < height; gy += 40) line(0,gy,width,gy);

    stroke(0,212,255,180); strokeWeight(3);
    line(startX, 40, startX, height-40);
    line(startX+L_val, 40, startX+L_val, height-40);

    noStroke(); fill(0,212,255,12);
    rect(0,0,startX,height);
    rect(startX+L_val,0,width-startX-L_val,height);

    drawWave(startX);
    drawNodes(startX);
    drawProbeHits(startX);
    drawBear(startX);
    drawUncertaintyBars(startX);
}

function drawWave(startX) {
    push(); noFill();

    let t = frameCount * 0.07;
    let momPrecision  = hupVal / 100;        
    let posPrecision  = 1 - momPrecision;    

    let sigma = 0.05 + momPrecision * 0.45;
    let waveCentre = 0.5;  

    if (showProb) {
        fill(255,235,59,16); stroke(255,235,59,190); strokeWeight(2.5);
        beginShape();
        vertex(startX, height/2);
        for (let x = 0; x <= L_val; x++) {
            let xn = x / L_val;
            let psi = Math.sin((n * Math.PI * xn));
            let env = Math.exp(-Math.pow(xn - waveCentre, 2) / (2 * sigma * sigma));
            let val = psi * psi * env * env;
            vertex(startX + x, height/2 - val * 140);
        }
        vertex(startX+L_val, height/2);
        endShape(CLOSE);

        noFill(); stroke(255,235,59); strokeWeight(2);
        beginShape();
        for (let x = 0; x <= L_val; x++) {
            let xn = x / L_val;
            let psi = Math.sin((n * Math.PI * xn));
            let env = Math.exp(-Math.pow(xn - waveCentre, 2) / (2 * sigma * sigma));
            vertex(startX + x, height/2 - psi*psi*env*env*140);
        }
        endShape();

    } else {
        stroke(0,150,255,35); strokeWeight(6);
        beginShape();
        for (let x = 0; x <= L_val; x++) {
            let xn  = x / L_val;
            let psi = Math.sin((n * Math.PI * xn)) * Math.sin(t);
            let env = Math.exp(-Math.pow(xn - waveCentre, 2) / (2 * sigma * sigma));
            vertex(startX + x, height/2 - psi * env * 110);
        }
        endShape();

        stroke(0,212,255,210); strokeWeight(2);
        beginShape();
        for (let x = 0; x <= L_val; x++) {
            let xn  = x / L_val;
            let psi = Math.sin((n * Math.PI * xn)) * Math.sin(t);
            let env = Math.exp(-Math.pow(xn - waveCentre, 2) / (2 * sigma * sigma));
            vertex(startX + x, height/2 - psi * env * 110);
        }
        endShape();
    }
    pop();
}

function drawNodes(startX) {
    if (!showProb) return;
    for (let k = 1; k < n; k++) {
        let nx = startX + (k * L_val / n);
        fill(255,71,87); noStroke();
        circle(nx, height/2, 7);
        fill(255,71,87,120); noStroke();
        textSize(9); textAlign(CENTER);
        text('node', nx, height/2+18);
    }
}

function drawBear(startX) {
    let momPrecision = hupVal / 100;
    let posPrecision = 1 - momPrecision;

    let bx = startX + L_val * 0.5 + shakeX;
    let by = height / 2 + 28 + shakeY;

    let clarity = posPrecision;   

    push();

    if (momPrecision > 0.55) {
        let ghosts = Math.floor(momPrecision * 7);
        let spread  = momPrecision * L_val * 0.32;
        for (let g = 0; g < ghosts; g++) {
            let ox = map(g, 0, ghosts-1, -spread/2, spread/2);
            let alpha = map(abs(ox), 0, spread/2, 55, 10);
            noStroke(); fill(0,212,255, alpha);
            circle(bx + ox, by,           22);
            circle(bx + ox, by - 18,      17);
            circle(bx + ox - 7, by - 25,   7);
            circle(bx + ox + 7, by - 25,   7);
        }
    }

    let alpha = map(posPrecision, 0, 1, 18, 180);
    if (posPrecision > 0.4) {
        drawingContext.shadowBlur  = map(posPrecision, 0.4, 1, 0, 28);
        drawingContext.shadowColor = \`rgba(255,100,100,\${posPrecision})\`;
        stroke(255, 100, 100, posPrecision * 200);
        strokeWeight(1.5);
        fill(255, 80, 80, alpha);
    } else {
        noStroke(); fill(0, 180, 255, alpha);
    }

    circle(bx, by,       24);
    circle(bx, by - 18,  18);
    circle(bx - 8, by - 24,  7);
    circle(bx + 8, by - 24,  7);
    drawingContext.shadowBlur = 0;

    let isBalanced = hupVal >= 35 && hupVal <= 65;
    if (isBalanced) {
        drawingContext.shadowBlur  = 22;
        drawingContext.shadowColor = 'rgba(192,132,252,0.9)';
        stroke(192,132,252,160); strokeWeight(2); noFill();
        circle(bx, by,       26);
        circle(bx, by - 18,  20);
        drawingContext.shadowBlur = 0;
    }
    pop();
}

function drawUncertaintyBars(startX) {
    let momP = hupVal / 100;
    let posP = 1 - momP;

    let dxWidth = map(posP, 0, 1, width * 0.6, 12);
    let cx = startX + L_val * 0.5;

    noStroke(); fill(255,80,80, 50);
    rect(cx - dxWidth/2, height - 10, dxWidth, 5, 2);
    stroke(255,80,80,120); strokeWeight(1); noFill();
    rect(cx - dxWidth/2, height - 10, dxWidth, 5, 2);

    let dpWidth = map(momP, 0, 1, 12, width * 0.6);
    noStroke(); fill(96,192,255, 50);
    rect(cx - dpWidth/2, height - 22, dpWidth, 5, 2);
    stroke(96,192,255,120); strokeWeight(1); noFill();
    rect(cx - dpWidth/2, height - 22, dpWidth, 5, 2);

    noStroke(); fill(255,80,80,80);
    textSize(8); textAlign(RIGHT); textFont('monospace');
    text('Δx', cx - dxWidth/2 - 3, height - 6);

    fill(96,192,255,80);
    text('Δp', cx - dpWidth/2 - 3, height - 18);
}

function drawProbeHits(startX) {
    for (let i = probeParticles.length - 1; i >= 0; i--) {
        let p = probeParticles[i];
        let px = startX + p.x * L_val;
        drawingContext.shadowBlur  = 8;
        drawingContext.shadowColor = \`rgba(255,255,255,\${p.life/255})\`;
        fill(255, p.life); noStroke();
        circle(px, height/2 + 28, 4);
        drawingContext.shadowBlur = 0;
        p.life -= 3;
        if (p.life <= 0) probeParticles.splice(i,1);
    }
}

function checkSuccess() {
    const isBalanced = hupVal >= 35 && hupVal <= 65;
    const tb = document.getElementById('task-bar');

    if (isBalanced && !successTriggered) {
        successTriggered = true;
        tb.textContent = '✓ BALANCED — uncertainty budget distributed: both Δx and Δp are finite';
        tb.classList.add('solved');
        setTimeout(() => document.getElementById('success-overlay').classList.add('show'), 900);
    } else if (!isBalanced) {
        successTriggered = false;
        tb.classList.remove('solved');
        if (hupVal < 20) {
            tb.textContent = 'Δx → 0: position locked but bear shakes — momentum is wild';
        } else if (hupVal > 80) {
            tb.textContent = 'Δp → 0: momentum locked but bear is everywhere — position lost';
        } else {
            tb.textContent = 'BALANCE the slider — find the zone where both position AND momentum are knowable';
        }
    }
}

function setN(val) {
    n = val;
    probeParticles = [];
    updateNButtons();
}

function updateNButtons() {
    document.querySelectorAll('.n-btn').forEach((b,i) => {
        b.classList.toggle('active', i+1 === n);
    });
}

function toggleProb() {
    showProb = !showProb;
    document.getElementById('mode-badge').textContent = showProb ? 'STATE: |ψₙ(x)|²' : 'STATE: ψₙ(x)';
    document.getElementById('toggleBtn').textContent  = showProb ? 'Show ψ(x)' : 'Show |ψ|²';
    document.getElementById('toggleBtn').classList.toggle('active-mode', showProb);
}

function fireProbe() {
    let momP = hupVal / 100;
    let sigma = 0.05 + momP * 0.45;
    let added = 0, attempts = 0;
    while (added < 20 && attempts < 3000) {
        let rx  = Math.random();
        let psi = Math.sin(n * Math.PI * rx);
        let env = Math.exp(-Math.pow(rx - 0.5, 2) / (2 * sigma * sigma));
        if (Math.random() < psi * psi * env * env) {
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
    {q:'Uncertainty principle?',options:['Exact values','Trade-off','Heavy only','Perfect measure'],answer:1,explanation:'\u0394x\u0394p \u2265 \u0127/2 — a fundamental trade-off.'},
    {q:'Position precise \u2192 momentum?',options:['Precise','Uncertain','Same','Zero'],answer:1,explanation:'Pinning down position spreads momentum wildly.'},
    {q:'Momentum precise \u2192 position?',options:['Exact','Uncertain','Stop','Both'],answer:1,explanation:'Sharp momentum means totally unknown position.'},
    {q:'\u0394x means?',options:['Exact position','Uncertainty in position','Distance','\u03bb'],answer:1,explanation:'\u0394x = spread (uncertainty) of the position measurement.'},
    {q:'\u0127 equals?',options:['c/\u03c0','h/2\u03c0','mass','g'],answer:1,explanation:'\u0127 (h-bar) = h/2\u03c0, the reduced Planck constant.'}
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

export default function Level4Page() {
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
          Initializing Level 4...
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
          title="Level 4: Heisenberg Uncertainty"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      <MrPsiChat currentLevel={4} />
    </div>
  );
}
