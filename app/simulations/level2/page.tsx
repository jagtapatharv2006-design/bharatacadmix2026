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
    <title>Quantum Safari: Level 2</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"><\/script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: radial-gradient(circle at center, #1a1a2e 0%, #080810 100%);
            color: #e0e0e0;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100%;
            padding: 15px;
            overflow: auto;
        }

        #game-container {
            display: grid;
            grid-template-columns: 340px 1fr;
            gap: 25px;
            max-width: 1250px;
            width: 100%;
            background: rgba(255, 255, 255, 0.02);
            padding: 30px;
            border-radius: 24px;
            border: 1px solid rgba(0, 255, 255, 0.1);
            position: relative;
        }

        /* SIDEBAR WITH PILL BUTTONS */
        #sidebar {
            background: rgba(5, 5, 15, 0.8);
            padding: 25px;
            border-radius: 18px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            border: 1px solid rgba(0, 212, 255, 0.1);
        }

        #sidebar h2 { 
            color: #00d4ff; 
            font-size: 1.2rem; 
            letter-spacing: 1.5px; 
            margin-bottom: 20px; 
            text-transform: uppercase;
            text-align: center;
            border-bottom: 1px solid rgba(0, 212, 255, 0.2);
            padding-bottom: 10px;
        }

        /* VERTICAL PILL BUTTONS */
        .tab-buttons {
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: flex-end;
        }

        .tab-buttons button {
            background: transparent;
            border: 1px solid rgba(0, 212, 255, 0.4);
            color: #00d4ff;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 0.75rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            width: 140px;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-align: center;
        }

        .tab-buttons button:hover {
            border-color: #00d4ff;
            box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
            transform: scale(1.05);
        }

        .tab-buttons button.active {
            background: #00d4ff;
            color: #000;
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
            border-color: #00d4ff;
        }

        /* INFO CONTENT PANEL */
        .info-panel {
            background: rgba(10, 20, 30, 0.6);
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 15px;
            padding: 20px;
            min-height: 250px;
        }

        .tab-content { display: none; font-size: 0.9rem; line-height: 1.6; }
        .tab-content.active { display: block; animation: fadeIn 0.4s ease; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .highlight { color: #00d4ff; font-weight: bold; }

        /* CANVAS AREA */
        #main-content { display: flex; flex-direction: column; gap: 20px; }

        #canvas-wrapper {
            background: #05050a;
            border: 2px solid #111;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: inset 0 0 50px rgba(0,0,0,1);
            position: relative;
        }

        /* SLIDERS */
        #controls {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            background: rgba(255,255,255,0.03);
            padding: 15px;
            border-radius: 15px;
        }

        .slider-group { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .slider-group label { font-size: 0.7rem; font-weight: bold; text-transform: uppercase; color: #888; }
        input[type=range] { width: 100%; accent-color: #00d4ff; cursor: pointer; }

        /* POPUPS */
        .overlay {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 420px; background: rgba(8, 12, 25, 0.98); border: 2px solid #00d4ff;
            padding: 25px; border-radius: 15px; z-index: 500; display: none;
            box-shadow: 0 0 50px rgba(0, 212, 255, 0.4);
        }
        .overlay h4 { color: #ffeb3b; margin-bottom: 12px; font-size: 1.1rem; }
        .overlay p { font-size: 0.9rem; margin-bottom: 15px; }
        .close-btn { 
            background: #00d4ff; color: #000; border: none; padding: 8px 18px; 
            border-radius: 5px; cursor: pointer; float: right; font-weight: bold;
        }

        @media (max-width: 900px) { #game-container { grid-template-columns: 1fr; } }
    </style>
</head>
<body>

<div id="game-container">
    <div id="recap-popup" class="overlay" style="display: block;">
        <h4>Level 2 Preview</h4>
        <p><strong>Last Level:</strong> You discovered that classical dots fail. Now, you must use a <strong>Wave Composer</strong> to interfere multiple frequencies into a single, sharp 'Wave Packet' to reveal the bear's true form.</p>
        <button class="close-btn" onclick="closePopup('recap-popup')">Proceed</button>
    </div>

    <div id="exit-popup" class="overlay">
        <h4>Level 2 → 3: Wave Packet to Particle in a Box</h4>
        <p><strong>The Consequence:</strong> The bear's glow is now sharp, but the narrow walls of the cave are beginning to vibrate. The energy is becoming trapped.</p>
        <p><strong>The Cliffhanger:</strong> "In a cave this tight, the bear can no longer flow smoothly—it must snap into place."</p>
        <p class="highlight" style="font-style: italic;">"Why can the bear only exist in specific patterns (n=1, 2, 3) instead of anywhere it wants?"</p>
        <button class="close-btn" onclick="alert('Proceeding to Level 3')">Evolve</button>
    </div>

    <div id="sidebar">
        <h2>Level 2: The Glow of Probability</h2>
        
        <div class="info-panel">
            <div id="concept" class="tab-content active">
                <p>You found the bear's shape — but it's still not "real". In quantum physics, a particle is not a single dot.</p>
                <p style="margin-top:10px;">It is a <span class="highlight">wave packet</span>, formed by combining many waves.</p>
                <p style="margin-top:10px;">A single wave spreads everywhere → <b>blurry bear</b>.<br>Multiple waves combine → <b>sharp, localized glow</b>.</p>
            </div>

            <div id="formula" class="tab-content">
                <p>A wave packet is formed by adding waves:</p>
                <p class="highlight" style="font-size: 1.2rem; text-align: center; margin: 20px 0;">ψ(x) = Σ A sin(kx + ωt)</p>
                <p>More waves → better localization → clearer position.</p>
            </div>

            <div id="hint" class="tab-content">
                <p>If the bear looks fuzzy, you're using too few waves.</p>
                <p style="margin-top:10px;">Try combining <span class="highlight">different frequencies</span>. That's how you "focus" the bear.</p>
            </div>

            <div id="notes" class="tab-content">
                <p>This is called <span class="highlight">superposition</span>.</p>
                <p style="margin-top:10px;">Real particles behave like this — they only appear localized when many waves interfere constructively.</p>
            </div>
        </div>

        <div class="tab-buttons">
            <button id="btn-concept" class="active" onclick="showTab('concept')">Concept</button>
            <button id="btn-formula" onclick="showTab('formula')">Formula</button>
            <button id="btn-hint" onclick="showTab('hint')">Hint</button>
            <button id="btn-notes" onclick="showTab('notes')">Notes</button>
        </div>
    </div>

    <div id="main-content">
        <div id="canvas-wrapper">
            <div id="p5-holder"></div>
        </div>

        <div id="controls">
            <div class="slider-group">
                <label>Frequency-A</label>
                <input type="range" id="f1" min="0.01" max="0.06" step="0.001" value="0.01">
            </div>
            <div class="slider-group">
                <label>Frequency-B</label>
                <input type="range" id="f2" min="0.05" max="0.12" step="0.001" value="0.05">
            </div>
            <div class="slider-group">
                <label>Frequency-C</label>
                <input type="range" id="f3" min="0.1" max="0.25" step="0.001" value="0.1">
            </div>
        </div>
    </div>
</div>

<script>
    let freqA, freqB, freqC;
    let bearGlow = 0;
    let levelComplete = false;

    function setup() {
        let canvas = createCanvas(800, 460);
        canvas.parent('p5-holder');
    }

    function showTab(id) {
        // Content Toggle
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        
        // Button State Toggle
        document.querySelectorAll('.tab-buttons button').forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-' + id).classList.add('active');
    }

    function draw() {
        background(8, 8, 15);
        
        // Subtle grid
        stroke(255, 255, 255, 10);
        for(let x=0; x<width; x+=50) line(x, 0, x, height);
        for(let y=0; y<height; y+=50) line(0, y, width, y);

        freqA = parseFloat(document.getElementById('f1').value);
        freqB = parseFloat(document.getElementById('f2').value);
        freqC = parseFloat(document.getElementById('f3').value);

        // Win Condition: High interference concentration
        let targetAchieved = (freqA > 0.04 && freqB > 0.1 && freqC > 0.2);
        bearGlow = lerp(bearGlow, targetAchieved ? 255 : 20, 0.05);

        drawBear(bearGlow);
        
        // Render components
        drawWave(freqA, color(255, 50, 50, 60));
        drawWave(freqB, color(50, 200, 255, 60));
        drawWave(freqC, color(50, 255, 150, 60));

        // Resultant Wave Packet
        drawSuperposition(freqA, freqB, freqC, bearGlow);

        if (bearGlow > 240 && !levelComplete) {
            document.getElementById('exit-popup').style.display = 'block';
            levelComplete = true;
        }
    }

    function drawWave(f, col) {
        push();
        noFill(); stroke(col);
        beginShape();
        for (let x = 0; x < width; x++) {
            let y = height / 2 + sin(x * f + frameCount * 0.05) * 35;
            vertex(x, y);
        }
        endShape();
        pop();
    }

    function drawSuperposition(f1, f2, f3, glow) {
        push();
        noFill();
        stroke(0, 212, 255, 220);
        strokeWeight(3);
        
        if(glow > 100) {
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = 'cyan';
        }
        
        beginShape();
        for (let x = 0; x < width; x++) {
            let amp = (sin(x * f1 + frameCount * 0.05) + sin(x * f2 + frameCount * 0.05) + sin(x * f3 + frameCount * 0.05)) / 3;
            // Localization envelope
            let env = exp(-pow((x - (width/2 + 50)) / 100, 2));
            let y = height / 2 + (amp * 160 * env);
            vertex(x, y);
        }
        endShape();
        pop();
    }

    function drawBear(glow) {
        push();
        translate(width/2 + 50, height/2);
        
        if (glow > 5) {
            noFill();
            stroke(0, 212, 255, glow);
            strokeWeight(3);
            drawingContext.shadowBlur = 20;
            drawingContext.shadowColor = 'rgba(0, 212, 255, 0.8)';
            renderBear(); 
        }

        noStroke();
        fill(25, 25, 35); 
        renderBear();
        pop();
    }

    function renderBear() {
        circle(0, 35, 90);    
        circle(0, -35, 65);   
        circle(-25, -60, 22); 
        circle(25, -60, 22);  
    }

    function closePopup(id) { document.getElementById(id).style.display = 'none'; }
<\/script>

</body>
</html>
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
    <div className="flex flex-col items-center w-full px-4">
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,251,251,0.1)] border border-outline-variant/20 relative" style={{ height: 'calc(100vh - 120px)', minHeight: '700px' }}>
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full border-none bg-surface"
          title="Level 2: The Glow of Probability"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      <MrPsiChat currentLevel={2} />
    </div>
  );
}
