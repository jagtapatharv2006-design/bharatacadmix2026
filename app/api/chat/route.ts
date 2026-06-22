import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getOfflineResponse } from "./offlineAgent";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyDpjDXS8bOOA6Pe372D7qpd7Yfg0dibxac");

const LEVEL_CONTEXT: Record<number, string> = {
  1: `Level 1 — Wave-Particle Duality ("The Cave Mystery"):
The player scatters particles at a hidden bear shape to detect it, demonstrating how quantum particles reveal position through scattering.
Key concepts: wave-particle duality, de Broglie wavelength (λ = h/p), double-slit experiment, electron microscopy.
The simulation uses Rutherford-style scattering to map the bear's shape.`,

  2: `Level 2 — Superposition of Waves ("Wave Packet Formation"):
The player adds harmonic waves to build a wave packet, localizing the bear-particle.
Key concepts: Fourier synthesis, wave packet formation, group velocity vs phase velocity, dispersion.
Formula: ψ(x) = Σ Aₙ sin(nπx/L). More harmonics = narrower packet = more localized particle.`,

  3: `Level 3 — Particle in a Box ("Resonance Chamber"):
The bear is confined inside a quantum box (infinite potential well) and can only exist at quantized energy levels.
Key concepts: standing waves, quantized energy Eₙ = n²π²ℏ²/(2mL²), nodes, zero-point energy.
The player adjusts quantum number n to see different standing wave patterns.`,

  4: `Level 4 — Heisenberg Uncertainty Principle:
The player explores the fundamental trade-off: knowing position precisely means momentum becomes uncertain, and vice versa.
Key concepts: Δx·Δp ≥ ℏ/2, conjugate variables, NOT a measurement limitation but a property of nature.
The simulation shows how squeezing position uncertainty inflates momentum uncertainty.`,

  5: `Level 5 — Quantum Tunneling ("The Forbidden Barrier"):
The bear must ghost through potential barriers. The player controls kinetic energy and selects which barrier to attempt.
Key concepts: tunneling probability T ≈ e^(-2κL), κ = √(2m(V₀-E))/ℏ, evanescent waves.
Applications: alpha decay, tunnel diodes, scanning tunneling microscopes, nuclear fusion in stars.`,
};

const SYSTEM_PROMPT = `You are MR.ψ (Mr. Psi), a friendly, enthusiastic quantum physics guide inside the game "Quantum Safari". You help students (ages 14-20) understand quantum mechanics concepts while they play through interactive levels.

Your personality:
- Enthusiastic but not overwhelming — use brief, clear explanations
- Use analogies and real-world examples to make physics intuitive
- Encourage experimentation in the simulation
- Use occasional emoji (⚛️ 🌊 🐻 💡 ✨) but don't overdo it
- Keep responses concise (2-4 sentences usually, longer only if they ask to "explain in detail")
- If they're stuck, give progressive hints — don't give away the answer immediately
- Reference the bear character and cave setting when relevant
- Use proper physics notation when showing formulas

Important rules:
- Stay on topic — only discuss quantum physics and the game
- If asked about unrelated topics, gently redirect: "Great curiosity! But let's focus on the quantum world 🐻"
- Be scientifically accurate — don't oversimplify to the point of being wrong
- Distinguish between common misconceptions and actual physics`;

export async function POST(req: NextRequest) {
  let body: { messages?: { role: string; content: string }[]; level?: number };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { text: "Invalid request format.", source: "error" },
      { status: 400 }
    );
  }

  const { messages, level } = body;
  const currentLevel = level || 1;
  const lastMessage = messages?.[messages.length - 1]?.content || "Hello";

  // ──────────────────────────────────────────────
  //  Try Gemini API first
  // ──────────────────────────────────────────────
  try {
    const levelContext = LEVEL_CONTEXT[currentLevel] || LEVEL_CONTEXT[1];
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: `${SYSTEM_PROMPT}\n\nCURRENT LEVEL CONTEXT:\n${levelContext}`
    });

    const history = (messages || []).slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText, source: "gemini" });
  } catch (geminiError) {
    console.error("Gemini API failed, switching to offline agent:", geminiError);
  }

  // ──────────────────────────────────────────────
  //  Fallback: Offline Agent
  // ──────────────────────────────────────────────
  try {
    const offlineAnswer = getOfflineResponse(lastMessage, currentLevel);
    return NextResponse.json({ text: offlineAnswer, source: "offline" });
  } catch (offlineError) {
    console.error("Offline agent also failed:", offlineError);
    return NextResponse.json(
      {
        text: "⚠️ Both quantum channels are down. Please check your connection and try again!",
        source: "error",
      },
      { status: 500 }
    );
  }
}
