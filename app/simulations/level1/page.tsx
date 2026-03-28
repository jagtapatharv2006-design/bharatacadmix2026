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
        }

        .btn.active { background: #00d4ff; color: #05050a; box-shadow: 0 0 15px rgba(0, 212, 255, 0.4); }

        /* Pop-up Styling */
        #popup {
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
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
            padding: 5px 15px; 
            border-radius: 5px; 
            cursor: pointer; 
            float: right;
            font-weight: bold;
        }

        @media (max-width: 900px) { #game-container { grid-template-columns: 1fr; } }
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

    function setup() {
        let canvas = createCanvas(800, 480);
        canvas.parent('p5-holder');
    }

    function draw() {
        background(5, 5, 12);
        
        // Draw Cave Entrance
        noStroke();
        fill(0, 0, 0, 150);
        rect(0, 0, 150, height);

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

            // Simple Bear Interaction Check
            // Bear center is roughly (450, 240)
            let d = dist(p.x, p.y, width/2 + 50, height/2);
            
            // Interaction logic based on particle size and proximity to "outline"
            // If ball hits the general area of the bear parts
            if (checkBearCollision(p.x - (width/2 + 50), p.y - height/2)) {
                
                if (mode === 'quantum') {
                    // Gradual glow increase
                    borderAlpha += 0.15; 
                    if (borderAlpha > 255) borderAlpha = 255;

                    // Trigger Pop-up when bear starts becoming visible
                    if (borderAlpha > 40 && !popupTriggered) {
                        showPopup();
                        popupTriggered = true;
                    }
                }
                
                // Create the interaction "spot"
                let spotSize = p.w; // Match ball dimension
                let spotColor = color(0, 212, 255, mode === 'quantum' ? 50 : 180);

                detectedPoints.push({
                    x: p.x,
                    y: p.y,
                    sz: spotSize,
                    col: spotColor
                });

                // Remove particle on hit
                particles.splice(i, 1);
                continue;
            }

            // Draw active particles
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

        // Limit detected points for performance
        if (detectedPoints.length > 800) detectedPoints.shift();
    }

    function checkBearCollision(lx, ly) {
        // Simple distance checks relative to bear local origin
        if (dist(lx, ly, 0, 35) < 45) return true;    // Body
        if (dist(lx, ly, 0, -35) < 32) return true;   // Head
        if (dist(lx, ly, -25, -60) < 11) return true; // Ear L
        if (dist(lx, ly, 25, -60) < 11) return true;  // Ear R
        return false;
    }

    function drawDynamicBear() {
        push();
        translate(width/2 + 50, height/2);
        
        // Gradual Glowing Outline
        if (borderAlpha > 1) {
            noFill();
            stroke(0, 212, 255, borderAlpha);
            strokeWeight(2);
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = 'rgba(0, 212, 255, 0.8)';
            renderBearShapes(); 
            drawingContext.shadowBlur = 0;
        }

        // Hidden body
        noStroke();
        fill(20, 20, 30); 
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
        let py = height/2 + random(-150, 150);
        let p = {
            x: -20,
            y: py,
            vx: mode === 'large' ? 5 : (mode === 'medium' ? 8 : 12),
            vy: random(-0.2, 0.2),
            w: mode === 'large' ? 45 : (mode === 'medium' ? 12 : 4),
            col: mode === 'large' ? color(255, 100, 100, 100) : (mode === 'medium' ? color(100, 200, 255, 150) : color(0, 255, 255))
        };
        particles.push(p);
    }

    function setMode(m) {
        mode = m;
        particles = [];
        // Reset detected points and glow if switching modes to see the difference clearly
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
    <div className="flex flex-col items-center w-full px-4">
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,251,251,0.1)] border border-outline-variant/20 relative" style={{ height: 'calc(100vh - 120px)', minHeight: '700px' }}>
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
