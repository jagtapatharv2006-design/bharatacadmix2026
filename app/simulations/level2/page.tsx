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
            overflow: auto;
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
            min-height: 180px;
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
            #game-container { grid-template-columns: 1fr; padding: 16px; gap: 14px; }
            #sidebar { padding: 16px; }
            #sidebar h2 { font-size: 1.2rem; margin-bottom: 14px; }
        }

        @media (max-width: 500px) {
            body { padding: 6px; }
            #game-container { padding: 10px; gap: 10px; border-radius: 14px; }
            #sidebar { padding: 12px; border-radius: 12px; }
            #sidebar h2 { font-size: 1.05rem; }
            #controls { grid-template-columns: 1fr; gap: 10px; padding: 10px; }
            .tab-buttons { gap: 6px; }
            .tab-buttons button { padding: 6px; font-size: 0.7rem; }
            .tab-content { min-height: 120px; padding: 12px; font-size: 0.82rem; }
            .overlay-popup { padding: 18px; }
            .overlay-popup h4 { font-size: 1rem; }
            .overlay-popup p { font-size: 0.85rem; }
        }
    </style>
</head>
<body>

<div id="game-container">
    
    <div id="recap-popup" class="overlay-popup" style="display: block;">
        <h4>Level 2 Preview</h4>
        <p><strong>Last Level:</strong> You discovered that classical dots fail. Your measurements were just a snapshot.</p>
        <p>Now, you must use a <strong>Wave Composer</strong> to interfere multiple frequencies into a single, sharp 'Wave Packet' to reveal the bear's true form.</p>
        <button class="btn-close" onclick="closePopup('recap-popup')">Start Experiment</button>
    </div>

    <div id="transition-popup" class="overlay-popup">
        <h4>Level 2 → 3: Wave Packet to Particle in a Box</h4>
        <p><strong>The Consequence:</strong> The bear's glow is now sharp, but the narrow walls of the cave are beginning to vibrate. The energy is becoming trapped.</p>
        <p>In a cave this tight, the bear can no longer flow smoothly—it must snap into place.</p>
        <p style="color:#00d4ff; font-weight:bold; font-style:italic;">"Why can the bear only exist in specific patterns (n=1, 2, 3) instead of anywhere it wants?"</p>
        <button class="btn-close" onclick="window.top.location.href='/simulations/level3'">Evolve</button>
    </div>

    <div id="sidebar">
        <h2>Level 2: Glow of Probability</h2>
        
        <div class="sidebar-section">
            <div class="tab-buttons">
                <button onclick="showTab('concept')" class="active">Concept</button>
                <button onclick="showTab('hint')">Hint</button>
                <button onclick="showTab('notes')">Notes</button>
            </div>

            <div id="concept" class="tab-content">
                <p>You found the bear's shape — but it's still not "real". In quantum physics, a particle is not a single dot. It is a <span class="highlight">wave packet</span>, formed by combining many waves.</p>
                <p style="margin-top:10px;">A single wave spreads everywhere → <b>blurry bear</b>.<br>Multiple waves combine → <b>sharp, localized glow</b>.</p>
            </div>

            <div id="hint" class="tab-content" style="display:none;">
                <p>If the bear looks fuzzy, you're using too few waves.</p>
                <p style="margin-top:10px;">Try combining <span class="highlight">different frequencies</span>. That's how you "focus" the bear.</p>
            </div>

            <div id="notes" class="tab-content" style="display:none;">
                <p>This is called <span class="highlight">superposition</span>.</p>
                <p style="margin-top:10px;">Real particles behave like this — they only appear localized when many waves interfere constructively.</p>
                <p class="highlight" style="margin-top:15px; text-align: center;">ψ(x) = Σ A sin(kx + ωt)</p>
            </div>
        </div>
    </div>

    <div id="main-content">
        <div id="canvas-wrapper">
            <div id="p5-holder"></div>
        </div>

        <div id="controls">
            <div class="wave-slider-container">
                <label style="color:#ff6b6b">Frequency-X</label>
                <input type="range" id="freq1" min="0.01" max="0.05" step="0.001" value="0.01">
            </div>
            <div class="wave-slider-container">
                <label style="color:#48dbfb">Frequency-Y</label>
                <input type="range" id="freq2" min="0.05" max="0.1" step="0.001" value="0.05">
            </div>
            <div class="wave-slider-container">
                <label style="color:#1dd1a1">Frequency-Z</label>
                <input type="range" id="freq3" min="0.1" max="0.2" step="0.001" value="0.1">
            </div>
        </div>
    </div>
</div>

<script>
    let f1, f2, f3;
    let bearGlow = 0;
    let transitionTriggered = false;
    let cW, cH;

    function getCanvasSize() {
        let holder = document.getElementById('p5-holder');
        let w = holder ? holder.offsetWidth : Math.min(800, window.innerWidth - 40);
        if (w < 100) w = Math.min(800, window.innerWidth - 40);
        let h = Math.round(w * 0.6);
        return { w: w, h: h };
    }

    function setup() {
        let sz = getCanvasSize();
        cW = sz.w; cH = sz.h;
        let canvas = createCanvas(cW, cH);
        canvas.parent('p5-holder');
    }

    function windowResized() {
        let sz = getCanvasSize();
        cW = sz.w; cH = sz.h;
        resizeCanvas(cW, cH);
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
            let y = height / 2 + sin(x * freq + frameCount * 0.05) * (height * 0.083);
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
        
        let bearCX = width/2 + width*0.0625;
        beginShape();
        for (let x = 0; x < width; x++) {
            let combined = (sin(x * freq1 + frameCount * 0.05) + 
                            sin(x * freq2 + frameCount * 0.05) + 
                            sin(x * freq3 + frameCount * 0.05)) / 3;
            
            let env = exp(-pow((x - bearCX) / (width*0.15), 2));
            let y = height / 2 + (combined * height*0.3125 * env);
            vertex(x, y);
        }
        endShape();
        pop();
    }

    function drawDynamicBear(glow) {
        push();
        translate(width/2 + width*0.0625, height/2);
        let s = height / 480;
        
        if (glow > 1) {
            noFill();
            stroke(0, 212, 255, glow);
            strokeWeight(3);
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = 'rgba(0, 212, 255, 0.8)';
            renderBearShapes(s); 
            drawingContext.shadowBlur = 0;
        }

        noStroke();
        fill(25, 25, 35); 
        renderBearShapes(s);
        pop();
    }

    function renderBearShapes(s) {
        s = s || 1;
        circle(0, 35*s, 90*s);    
        circle(0, -35*s, 65*s);   
        circle(-25*s, -60*s, 22*s); 
        circle(25*s, -60*s, 22*s);  
    }

    function showPopup(id) { document.getElementById(id).style.display = 'block'; }
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
    <div className="flex flex-col items-center w-full px-2 sm:px-4">
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,251,251,0.1)] border border-outline-variant/20 relative h-[calc(100dvh-90px)] sm:h-[calc(100dvh-120px)]">
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
