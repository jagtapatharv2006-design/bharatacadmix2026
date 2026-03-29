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
    <title>The Cave Mystery</title>
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
            font-size: 0.95rem;
            line-height: 1.6;
        }

        #sidebar h2 { 
            color: #fff; 
            font-size: 1.6rem; 
            letter-spacing: 2px; 
            margin-bottom: 20px; 
            text-transform: uppercase;
            text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }

        #sidebar h3 { color: #00d4ff; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-size: 1rem; }
        .sidebar-section { margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .highlight { color: #00d4ff; font-weight: bold; }
        .gold { color: #ffeb3b; font-weight: bold; }

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
            display: flex;
            gap: 15px;
            background: rgba(255,255,255,0.05);
            padding: 15px;
            border-radius: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid #00d4ff;
            color: #00d4ff;
            padding: 12px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
            min-width: 100px;
            text-align: center;
        }

        .btn.active { background: #00d4ff; color: #05050a; box-shadow: 0 0 15px rgba(0, 212, 255, 0.4); }

        /* Pop-up Styling */
        #popup {
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: min(400px, 90vw);
            background: rgba(10, 20, 40, 0.95);
            border: 2px solid #00d4ff;
            padding: 25px;
            border-radius: 15px;
            z-index: 100;
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
            text-align: left;
        }

        #popup h4 { color: #ffeb3b; margin-bottom: 15px; font-size: 1.1rem; }
        #popup p { margin-bottom: 15px; font-size: 0.9rem; line-height: 1.4; color: #fff; }
        #popup .question { color: #00d4ff; font-style: italic; font-weight: bold; }
        #popup .close-btn { 
            background: #00d4ff; 
            color: #000; 
            border: none; 
            padding: 8px 18px; 
            border-radius: 5px; 
            cursor: pointer; 
            float: right;
            font-weight: bold;
            font-size: 0.9rem;
        }

        @media (max-width: 900px) {
            #game-container { grid-template-columns: 1fr; padding: 16px; gap: 14px; }
            #sidebar { padding: 16px; }
            #sidebar h2 { font-size: 1.2rem; margin-bottom: 12px; }
        }

        @media (max-width: 500px) {
            body { padding: 6px; }
            #game-container { padding: 10px; gap: 10px; border-radius: 14px; }
            #sidebar { padding: 12px; font-size: 0.85rem; border-radius: 12px; }
            #sidebar h2 { font-size: 1.1rem; }
            #sidebar h3 { font-size: 0.85rem; }
            #controls { padding: 10px; gap: 8px; }
            .btn { padding: 10px 16px; font-size: 0.85rem; min-width: 80px; }
            #popup { padding: 18px; }
            #popup h4 { font-size: 0.95rem; }
            #popup p { font-size: 0.82rem; }
        }
    </style>
</head>
<body>

<div id="game-container">
    <div id="popup">
        <h4>LEVEL 1 → 2: Particle Size Effect to Wave Packet</h4>
        <p>Target outline established. However, static detection is incomplete. The "dots" we used to find the bear are just a snapshot; the bear itself is vibrating, blurring into a cloud of possibilities.</p>
     <p>If the bear is made of waves, how can it ever stay in one place?"</p>
        <p class="question">"Why does adding more wave frequencies together make the bear's 'glow' sharper and more localized?"</p>
        <button class="close-btn" onclick="closePopup()">Continue</button>
    </div>

    <div id="sidebar">
        <h2>The Cave Mystery</h2>
        <div class="sidebar-section">
            <h3>How to Play</h3>
            <p><span class="highlight">The Mystery:</span> A hidden quantum bear is trapped inside the cave.</p>
            <p><span class="highlight">Your Tool:</span> Throw particles to detect the bear's shape.</p>
            <p>• <span class="highlight">Large Balls:</span> Illuminate broad, blurry areas.</p>
            <p>• <span class="highlight">Small Balls:</span> Reveal specific points on the outline.</p>
            <p>• <span class="highlight">Quantum:</span> Accumulation makes the bear <span class="gold">glow gradually</span>.</p> 
        </div>
        <div class="sidebar-section" style="border:none;">
            <h3>Quantum Reality</h3>
            <p>High-energy particles act like waves. When they hit, they define the boundary of existence.</p>
        </div>
    </div>

    <div id="main-content">
        <div id="canvas-wrapper">
            <div id="p5-holder"></div>
        </div>

        <div id="controls">
            <button class="btn" id="btn-large" onclick="setMode('large')">Large Ball</button>
            <button class="btn" id="btn-medium" onclick="setMode('medium')">Small Ball</button>
            <button class="btn active" id="btn-quantum" onclick="setMode('quantum')">Quantum Particle</button>
        </div>
    </div>
</div>

<script>
    let mode = 'quantum';
    let particles = [];
    let detectedPoints = [];
    let borderAlpha = 0; 
    let popupTriggered = false;
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

    function draw() {
        background(5, 5, 12);
        
        // Draw Cave Entrance
        noStroke();
        fill(0, 0, 0, 150);
        rect(0, 0, width * 0.1875, height);

        drawDynamicBear();

        // Draw interaction spots
        for (let pt of detectedPoints) {
            noStroke();
            fill(pt.col);
            circle(pt.x, pt.y, pt.sz);
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            let d = dist(p.x, p.y, width/2 + width*0.0625, height/2);
            
            if (checkBearCollision(p.x - (width/2 + width*0.0625), p.y - height/2)) {
                
                if (mode === 'quantum') {
                    borderAlpha += 0.15; 
                    if (borderAlpha > 255) borderAlpha = 255;

                    if (borderAlpha > 40 && !popupTriggered) {
                        showPopup();
                        popupTriggered = true;
                    }
                }
                
                let spotSize = p.w;
                let spotColor = color(0, 212, 255, mode === 'quantum' ? 50 : 180);

                detectedPoints.push({
                    x: p.x,
                    y: p.y,
                    sz: spotSize,
                    col: spotColor
                });

                particles.splice(i, 1);
                continue;
            }

            noStroke();
            fill(p.col);
            if(mode === 'quantum') {
                drawingContext.shadowBlur = 5;
                drawingContext.shadowColor = 'cyan';
            }
            circle(p.x, p.y, p.w);
            drawingContext.shadowBlur = 0;

            if (p.x > width || p.x < -100) particles.splice(i, 1);
        }

        if (frameCount % 6 === 0) fire();

        if (detectedPoints.length > 800) detectedPoints.shift();
    }

    function checkBearCollision(lx, ly) {
        let scale = height / 480;
        if (dist(lx, ly, 0, 35 * scale) < 45 * scale) return true;
        if (dist(lx, ly, 0, -35 * scale) < 32 * scale) return true;
        if (dist(lx, ly, -25 * scale, -60 * scale) < 11 * scale) return true;
        if (dist(lx, ly, 25 * scale, -60 * scale) < 11 * scale) return true;
        return false;
    }

    function drawDynamicBear() {
        push();
        translate(width/2 + width*0.0625, height/2);
        let scale = height / 480;
        
        if (borderAlpha > 1) {
            noFill();
            stroke(0, 212, 255, borderAlpha);
            strokeWeight(2);
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = 'rgba(0, 212, 255, 0.8)';
            renderBearShapes(scale); 
            drawingContext.shadowBlur = 0;
        }

        noStroke();
        fill(20, 20, 30); 
        renderBearShapes(scale);
        pop();
    }

    function renderBearShapes(s) {
        s = s || 1;
        circle(0, 35*s, 90*s);    
        circle(0, -35*s, 65*s);   
        circle(-25*s, -60*s, 22*s); 
        circle(25*s, -60*s, 22*s);  
    }

    function fire() {
        let py = height/2 + random(-height*0.3125, height*0.3125);
        let speedScale = width / 800;
        let p = {
            x: -20,
            y: py,
            vx: (mode === 'large' ? 5 : (mode === 'medium' ? 8 : 12)) * speedScale,
            vy: random(-0.2, 0.2),
            w: (mode === 'large' ? 45 : (mode === 'medium' ? 12 : 4)) * (height/480),
            col: mode === 'large' ? color(255, 100, 100, 100) : (mode === 'medium' ? color(100, 200, 255, 150) : color(0, 255, 255))
        };
        particles.push(p);
    }

    function setMode(m) {
        mode = m;
        particles = [];
        detectedPoints = [];
        borderAlpha = 0; 
        popupTriggered = false;
        
        document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
        document.getElementById('btn-' + m).classList.add('active');
    }

    function showPopup() {
        document.getElementById('popup').style.display = 'block';
    }

    function closePopup() {
        document.getElementById('popup').style.display = 'none';
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
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,251,251,0.1)] border border-outline-variant/20 relative h-[calc(100dvh-90px)] sm:h-[calc(100dvh-120px)]">
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full border-none bg-surface"
          title="Level 1: The Cave Mystery"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      <MrPsiChat currentLevel={1} />
    </div>
  );
}
