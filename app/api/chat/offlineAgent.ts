// Offline knowledge base for MR.ψ — covers the most likely questions per level
// Used as fallback when the Gemini API is unavailable

interface QA {
  keywords: string[];
  answer: string;
}

interface LevelKB {
  greeting: string;
  concepts: QA[];
  hints: QA[];
  formulas: QA[];
  applications: QA[];
  fallback: string;
}

const KNOWLEDGE_BASE: Record<number, LevelKB> = {
  1: {
    greeting:
      "Hey! 🐻 I'm MR.ψ. In Level 1 we're exploring **wave-particle duality** — particles can behave like waves AND particles. Scatter some particles at the hidden bear to reveal its shape!",
    concepts: [
      {
        keywords: ["wave", "particle", "duality", "what is", "explain", "mean"],
        answer:
          "**Wave-particle duality** means quantum objects (photons, electrons) exhibit both wave and particle properties. When you fire particles at the bear, they scatter like billiard balls (particle behavior), but the overall scattering pattern shows interference (wave behavior). It's not that the particle 'chooses' — it genuinely has both natures. ⚛️",
      },
      {
        keywords: ["double", "slit", "experiment", "two slit"],
        answer:
          "The **double-slit experiment** is the clearest proof of wave-particle duality. Fire electrons one-at-a-time through two slits → they build an interference pattern on the screen, just like waves! But each electron hits as a single point (particle). If you watch which slit it goes through, the interference disappears. Observation changes the outcome. 🌊",
      },
      {
        keywords: ["de broglie", "wavelength", "lambda"],
        answer:
          "**De Broglie's equation: λ = h/p = h/(mv)**. Every particle has a wavelength! Heavier or faster particles → shorter wavelength → more particle-like. Electrons are light enough to show wave behavior at atomic scales, which is why electron microscopes work. 💡",
      },
      {
        keywords: ["photon", "light", "electromagnetic"],
        answer:
          "A **photon** is a quantum of light — the smallest possible unit of electromagnetic energy. Einstein showed light comes in discrete packets (photons), each with energy E = hf. This explained the photoelectric effect and earned him the Nobel Prize! ✨",
      },
      {
        keywords: ["scatter", "rutherford", "how", "detect", "bear"],
        answer:
          "In this level, you're using **scattering** — firing particles at the bear and observing where they bounce. This is exactly how Rutherford discovered the atomic nucleus in 1911! The pattern of scattered particles reveals the shape and structure of what they hit. 🎯",
      },
      {
        keywords: ["observe", "measurement", "collapse", "watch"],
        answer:
          "When we **observe** a quantum particle, we force it to 'choose' — wave behavior disappears, and it acts like a definite particle. This is the **measurement problem**, and it's one of the deepest mysteries in physics. You'll explore this more in Level 7!",
      },
    ],
    hints: [
      {
        keywords: ["hint", "help", "stuck", "what do", "how do", "tip"],
        answer:
          "💡 Try shooting particles from different angles to map the bear's outline. More particles = clearer picture. Notice how the scattering pattern builds up — that's quantum statistics at work!",
      },
      {
        keywords: ["angle", "direction", "aim"],
        answer:
          "💡 Change the firing angle to probe different parts of the bear. Particles that bounce back at sharp angles hit something solid — particles that pass through found empty space.",
      },
    ],
    formulas: [
      {
        keywords: ["formula", "equation", "math", "calculate"],
        answer:
          "**Key formulas for Level 1:**\n• De Broglie wavelength: **λ = h/p = h/(mv)**\n• Photon energy: **E = hf = hc/λ**\n• Planck's constant: **h = 6.626 × 10⁻³⁴ J·s**\n\nShorter wavelength = better resolution = more particle-like!",
      },
    ],
    applications: [
      {
        keywords: ["real", "world", "application", "use", "example", "daily", "practical"],
        answer:
          "Wave-particle duality enables: 🔬 **Electron microscopes** (use electron waves to image atoms), ☀️ **Solar cells** (absorb photons), 💻 **Semiconductors** in every electronic device, and 🏥 **Medical imaging** (X-ray diffraction). It's the foundation of all modern technology!",
      },
    ],
    fallback:
      "Great question about wave-particle duality! ⚛️ In this level, we're discovering that quantum particles are both waves and particles simultaneously. Try scattering more particles at the bear, or ask me to 'explain duality', give a 'hint', or show the 'formula'!",
  },

  2: {
    greeting:
      "Welcome to Level 2! 🌊 Here we build **wave packets** — localized particles made from many overlapping waves. The more harmonics you add, the more precisely you can locate the bear!",
    concepts: [
      {
        keywords: ["wave packet", "what is", "explain", "packet"],
        answer:
          "A **wave packet** is a localized group of waves. A single sine wave extends infinitely — it's everywhere! But add many waves of slightly different frequencies together, and they **constructively interfere** in one region and cancel out everywhere else. This creates a localized 'bump' — a particle! 🌊",
      },
      {
        keywords: ["superposition", "add", "combine", "overlap"],
        answer:
          "**Superposition** means waves can combine. When crests meet crests, they amplify (constructive interference). When crests meet troughs, they cancel (destructive interference). By superposing many frequencies, you build a localized wave packet — the quantum description of a particle. ✨",
      },
      {
        keywords: ["fourier", "harmonic", "frequency", "sine"],
        answer:
          "**Fourier synthesis**: any shape can be made from sine waves! ψ(x) = Σ Aₙsin(nπx/L). Each harmonic has a different frequency. More harmonics = sharper features = more localized particle. This is why a truly localized particle requires infinitely many frequencies. 🎵",
      },
      {
        keywords: ["group", "phase", "velocity", "speed", "dispersion"],
        answer:
          "The **phase velocity** is how fast individual wave crests move. The **group velocity** is how fast the entire packet (the envelope) moves — this represents the actual particle speed. In dispersive media, these differ, causing the packet to spread over time (dispersion). 🏃",
      },
      {
        keywords: ["localize", "position", "where", "find"],
        answer:
          "To **localize** a particle means to confine it to a small region. You need many waves of different frequencies to do this. The trade-off: more localized position → wider spread in momentum (frequencies). This connects directly to the Heisenberg Uncertainty Principle! 📍",
      },
    ],
    hints: [
      {
        keywords: ["hint", "help", "stuck", "what do", "how do", "tip"],
        answer:
          "💡 Add more harmonics to narrow the wave packet. Notice how adding each new frequency makes the bear more localized. But watch the momentum display — it's getting wider!",
      },
    ],
    formulas: [
      {
        keywords: ["formula", "equation", "math"],
        answer:
          "**Key formulas:**\n• Wave packet: **ψ(x) = Σ Aₙ sin(nπx/L)**\n• Group velocity: **vg = dω/dk**\n• Phase velocity: **vp = ω/k**\n• More terms in the sum = better localization",
      },
    ],
    applications: [
      {
        keywords: ["real", "world", "application", "use", "example"],
        answer:
          "Wave packets are essential in: 📡 **Fiber optic communication** (data sent as light pulses), 📻 **Radio signals** (modulated wave packets), 🔬 **Ultrafast lasers** (femtosecond pulses for chemistry), and 🎵 **Music** (sound is wave packets!). Even your voice is a wave packet! 🗣️",
      },
    ],
    fallback:
      "Interesting question about wave packets! 🌊 We're learning how many overlapping waves create a localized particle. Ask me to 'explain superposition', 'explain Fourier', give a 'hint', or show the 'formula'!",
  },

  3: {
    greeting:
      "Level 3 — the **Resonance Chamber**! 🏠 The bear is trapped in a quantum box, and it can only exist at specific energy levels. Think of it like a guitar string — only certain vibrations are allowed!",
    concepts: [
      {
        keywords: ["particle", "box", "well", "infinite", "what is", "explain"],
        answer:
          "The **particle in a box** (infinite potential well) confines a quantum particle between two walls. Since the wavefunction must be zero at the walls, only **standing waves** that fit perfectly inside the box are allowed. This means the energy is **quantized** — only specific values are permitted! 📦",
      },
      {
        keywords: ["quantize", "quantized", "energy level", "discrete", "allowed"],
        answer:
          "**Quantized energy** means the particle can only have specific energies: Eₙ = n²π²ℏ²/(2mL²). The particle CANNOT have energy between these levels. This is fundamentally different from classical physics where any energy is allowed. It's like a staircase vs. a ramp! 🪜",
      },
      {
        keywords: ["standing wave", "node", "vibration"],
        answer:
          "**Standing waves** form when a wave bounces between two walls and interferes with itself. For quantum number n, you get (n-1) **nodes** (points of zero amplitude) inside the box. n=1 has zero nodes (one smooth bump), n=2 has one node, n=3 has two nodes, etc. Like guitar harmonics! 🎸",
      },
      {
        keywords: ["zero point", "ground", "lowest", "n=1", "minimum"],
        answer:
          "The **zero-point energy** (n=1) is the lowest possible energy. A quantum particle can NEVER be completely at rest — that would violate the uncertainty principle! Even at absolute zero temperature, it still vibrates with energy E₁ = π²ℏ²/(2mL²). 🥶",
      },
      {
        keywords: ["quantum number", "n", "number"],
        answer:
          "The **quantum number n** (= 1, 2, 3, ...) labels each allowed energy state. Higher n = higher energy = more nodes = shorter wavelength. The energy goes as n² — so level 2 has 4× the energy of level 1, level 3 has 9×, etc. It grows quadratically! 📈",
      },
      {
        keywords: ["wavefunction", "psi", "probability", "shape"],
        answer:
          "The **wavefunction** ψₙ(x) = √(2/L) sin(nπx/L) describes where you're likely to find the particle. The probability of finding it at position x is |ψ(x)|². At nodes, probability is zero — the particle is NEVER found there! Between nodes, it's most likely at the antinodes. 📊",
      },
    ],
    hints: [
      {
        keywords: ["hint", "help", "stuck", "what do", "how do", "tip"],
        answer:
          "💡 Change quantum number n and watch the standing wave pattern change. Count the nodes — for n, there should be (n-1) nodes inside the box. Notice how the energy label jumps: E₁, 4E₁, 9E₁...",
      },
    ],
    formulas: [
      {
        keywords: ["formula", "equation", "math"],
        answer:
          "**Key formulas:**\n• Energy levels: **Eₙ = n²π²ℏ²/(2mL²)**\n• Wavefunction: **ψₙ(x) = √(2/L) sin(nπx/L)**\n• Probability: **P(x) = |ψ(x)|²**\n• Nodes inside box: **(n-1)**\n\nEnergy grows as n² — quadratically!",
      },
    ],
    applications: [
      {
        keywords: ["real", "world", "application", "use", "example"],
        answer:
          "Particle-in-a-box models: 📺 **Quantum dots** in QLED TVs (electrons confined in nanoscale boxes emit specific colors!), 🧪 **Conjugated molecules** (electrons delocalized in molecular 'boxes'), 💡 **LED colors** from quantum confinement, and 🔬 **Nanoelectronics**. Box size controls the color!",
      },
    ],
    fallback:
      "Great curiosity about quantum confinement! 📦 The bear is trapped in a box and can only have quantized energies. Ask me to 'explain quantization', 'explain nodes', give a 'hint', or show the 'formula'!",
  },

  4: {
    greeting:
      "Level 4 — **Heisenberg's Uncertainty Principle**! ⚖️ You can't know both position AND momentum perfectly. The more precisely you pin down one, the fuzzier the other becomes. Let's explore this fundamental limit!",
    concepts: [
      {
        keywords: ["uncertainty", "heisenberg", "principle", "what is", "explain"],
        answer:
          "The **Heisenberg Uncertainty Principle**: Δx·Δp ≥ ℏ/2. You CANNOT simultaneously know both position (Δx) and momentum (Δp) with perfect precision. This isn't about bad instruments — it's a **fundamental property of nature**. Trying to measure one precisely disturbs the other. ⚖️",
      },
      {
        keywords: ["why", "reason", "cause", "fundamental", "nature"],
        answer:
          "The uncertainty principle arises because position and momentum are **conjugate variables** — they're connected through the Fourier transform. A particle with definite momentum is a perfect sine wave (exists everywhere!). To localize it, you need many momenta. It's mathematically inevitable! 🧮",
      },
      {
        keywords: ["measure", "instrument", "error", "limit", "precision"],
        answer:
          "⚠️ Common misconception: uncertainty is NOT about measurement error or bad instruments! Even with perfect technology, you cannot beat Δx·Δp ≥ ℏ/2. It's built into the fabric of reality. The particle genuinely doesn't HAVE a definite position and momentum simultaneously.",
      },
      {
        keywords: ["delta", "sigma", "spread", "variance"],
        answer:
          "**Δx** is the standard deviation of position measurements — how 'spread out' the position is. **Δp** is the standard deviation of momentum. Their product can never go below ℏ/2. Think of it like a balloon: squeeze one dimension (Δx), the other (Δp) bulges out! 🎈",
      },
      {
        keywords: ["momentum", "velocity", "speed", "p"],
        answer:
          "**Momentum p = mv**. In quantum mechanics, momentum relates to wavelength via p = h/λ = ℏk. A particle with well-defined momentum has a well-defined wavelength — it's a perfect sine wave extending to infinity, meaning its position is completely unknown! 🌊",
      },
      {
        keywords: ["energy", "time", "ΔE", "Δt"],
        answer:
          "There's also an **energy-time uncertainty**: ΔE·Δt ≥ ℏ/2. A particle that exists for a very short time (small Δt) can have a large energy uncertainty (large ΔE). This allows **virtual particles** to pop in and out of existence in the quantum vacuum! 🫧",
      },
    ],
    hints: [
      {
        keywords: ["hint", "help", "stuck", "what do", "how do", "tip"],
        answer:
          "💡 Slide the position uncertainty — watch how momentum uncertainty changes inversely. The product Δx·Δp always stays ≥ ℏ/2. Try making position very precise (small Δx) and see momentum explode!",
      },
    ],
    formulas: [
      {
        keywords: ["formula", "equation", "math"],
        answer:
          "**Key formulas:**\n• Uncertainty principle: **Δx·Δp ≥ ℏ/2**\n• Reduced Planck's constant: **ℏ = h/(2π) = 1.055 × 10⁻³⁴ J·s**\n• Energy-time: **ΔE·Δt ≥ ℏ/2**\n• De Broglie: **p = h/λ = ℏk**\n\nThe ≥ means you can never go below, only above!",
      },
    ],
    applications: [
      {
        keywords: ["real", "world", "application", "use", "example"],
        answer:
          "The uncertainty principle explains: ⚛️ **Atomic stability** (electrons can't collapse into the nucleus — that would require Δx→0, making Δp→∞!), ⏰ **Atomic clock limits**, 🖥️ **Quantum computing errors** (decoherence), and 🌟 **Stellar physics** (zero-point energy prevents white dwarfs from collapsing).",
      },
    ],
    fallback:
      "Fascinating question about uncertainty! ⚖️ Remember: Δx·Δp ≥ ℏ/2 is not about bad instruments — it's reality itself. Ask me to 'explain uncertainty', show the 'formula', give a 'hint', or ask about 'real world' applications!",
  },

  5: {
    greeting:
      "Level 5 — **Quantum Tunneling**! 👻 The bear can ghost through solid barriers even without enough energy to climb over them. Thinner walls + higher energy = better chance. Let's break classical physics!",
    concepts: [
      {
        keywords: ["tunnel", "tunneling", "what is", "explain", "through"],
        answer:
          "**Quantum tunneling**: a particle can pass through a potential barrier even when its energy E is LESS than the barrier height V₀. Classically impossible — like a ball rolling through a mountain! But quantum wavefunctions don't stop at barriers; they **decay exponentially** inside. If the barrier is thin enough, some amplitude leaks through! 👻",
      },
      {
        keywords: ["probability", "chance", "likely", "transmission", "coefficient"],
        answer:
          "The **tunneling probability** (transmission coefficient) is approximately T ≈ e^(-2κL), where κ depends on how much energy you're 'short' (V₀-E). Higher E or thinner L = dramatically higher probability. It's exponentially sensitive — even small changes matter a lot! 📊",
      },
      {
        keywords: ["barrier", "wall", "potential", "height", "V0", "V₀"],
        answer:
          "The **barrier height V₀** is the energy of the wall. If V₀ > E, the particle doesn't have enough classical energy to climb over. But quantum mechanically, the wavefunction inside the barrier becomes an **evanescent wave** — it decays exponentially but doesn't instantly vanish. 🧱",
      },
      {
        keywords: ["width", "thick", "thin", "L", "size"],
        answer:
          "**Barrier width L** matters EXPONENTIALLY. Doubling L doesn't halve the probability — it **squares the decay factor**! T ≈ e^(-2κL) means even a small increase in width can make tunneling vanishingly unlikely. This is why tunneling only matters at the **atomic scale**! 📏",
      },
      {
        keywords: ["evanescent", "decay", "exponential", "inside", "kappa"],
        answer:
          "Inside the barrier, the wavefunction doesn't oscillate — it becomes an **evanescent wave** that decays as e^(-κx), where κ = √(2m(V₀-E))/ℏ. The decay rate κ depends on the 'energy gap' (V₀-E). Smaller gap = slower decay = more likely to reach the other side! 📉",
      },
      {
        keywords: ["classical", "impossible", "different", "newton"],
        answer:
          "Classically (Newton's physics), a ball with energy E < V₀ bounces off the wall 100% of the time. Quantum mechanics says there's always a non-zero probability of appearing on the other side. This has no classical analog — it's purely a quantum wave phenomenon! 🔄",
      },
    ],
    hints: [
      {
        keywords: ["hint", "help", "stuck", "what do", "how do", "tip"],
        answer:
          "💡 Crank up the bear's energy to get close to (but below) the barrier height V₀ — the tunneling probability jumps dramatically as E approaches V₀! Start with the thinnest barrier (B1). Remember: tunneling is probabilistic — sometimes you just need another attempt! 🎲",
      },
      {
        keywords: ["barrier 1", "b1", "first"],
        answer:
          "💡 Barrier 1 (B1) is the thinnest at 25px — your best bet! Max out your energy (it should still be < V₀ to be true tunneling). With high energy + thin barrier, you can get >60% success rate!",
      },
      {
        keywords: ["barrier 3", "b3", "third", "hard", "thick"],
        answer:
          "💡 Barrier 3 is the toughest — V₀=100 with 40px width. You need maximum energy AND a bit of luck. If you're struggling, try multiple attempts — quantum tunneling is probabilistic!",
      },
    ],
    formulas: [
      {
        keywords: ["formula", "equation", "math", "calculate"],
        answer:
          "**Key formulas:**\n• Transmission coefficient: **T ≈ e^(-2κL)**\n• Decay constant: **κ = √(2m(V₀ - E)) / ℏ**\n• V₀ = barrier height, E = particle energy\n• L = barrier width, m = particle mass\n\nHigher E or smaller L → exponentially larger T!",
      },
    ],
    applications: [
      {
        keywords: ["real", "world", "application", "use", "example", "sun", "star"],
        answer:
          "Tunneling powers the universe! ☀️ **Nuclear fusion in stars** (protons tunnel through Coulomb barriers — without tunneling, the Sun wouldn't shine!), 💾 **Flash memory** (electrons tunnel through oxide layers), 🔬 **Scanning tunneling microscopes** (image individual atoms!), ⚛️ **Alpha decay** (particles tunnel out of nuclei), and 🔌 **Tunnel diodes** in electronics.",
      },
    ],
    fallback:
      "Great question about tunneling! 👻 The bear can phase through barriers because quantum wavefunctions don't stop at walls — they decay exponentially inside. Ask me to 'explain tunneling', show the 'formula', give a 'hint', or ask about 'applications'!",
  },
};

// General (level-independent) Q&A
const GENERAL_QA: QA[] = [
  {
    keywords: ["who are you", "your name", "mr psi", "psi"],
    answer:
      "I'm **MR.ψ** (Mr. Psi) — your quantum physics companion inside Quantum Safari! ψ is the symbol for the wavefunction, which describes everything about a quantum particle. I'm here to help you understand the quantum world. Ask me anything! 🐻⚛️",
  },
  {
    keywords: ["quantum", "mechanics", "physics", "what is quantum"],
    answer:
      "**Quantum mechanics** is the physics of the very small — atoms, electrons, photons. It reveals that nature is fundamentally different from everyday experience: particles behave like waves, energy comes in discrete packets, and certainty has fundamental limits. Everything in this game teaches a real quantum concept! ⚛️",
  },
  {
    keywords: ["planck", "constant", "h"],
    answer:
      "**Planck's constant h = 6.626 × 10⁻³⁴ J·s** is the fundamental scale of quantum mechanics. It sets how 'grainy' nature is. The reduced form **ℏ = h/(2π) = 1.055 × 10⁻³⁴ J·s** appears in most quantum formulas. If h were zero, quantum effects would vanish and physics would be purely classical!",
  },
  {
    keywords: ["schrodinger", "schrödinger", "cat"],
    answer:
      "**Schrödinger's cat** is a thought experiment: a cat in a sealed box is linked to a quantum event. Until you open the box, quantum mechanics says the cat is simultaneously alive AND dead — in **superposition**. It highlights the absurdity of applying quantum rules to everyday objects. Where does quantum end and classical begin? 🐱",
  },
  {
    keywords: ["thank", "thanks", "thx", "ty", "awesome", "cool"],
    answer:
      "You're welcome! Keep exploring the quantum world — every level teaches something incredible about how nature really works at the smallest scales. The universe is stranger and more beautiful than we imagine! 🌌✨",
  },
  {
    keywords: ["bye", "goodbye", "see you", "later"],
    answer:
      "See you later, quantum explorer! Remember — until we meet again, like Schrödinger's cat, our conversation exists in a superposition of all possible future topics. 🐻👋",
  },
  {
    keywords: ["bear", "why bear", "animal"],
    answer:
      "The Quantum Bear is our mascot! 🐻 Just like quantum particles, the bear exhibits quantum properties in each level — it scatters, forms wave packets, gets quantized, has uncertain position/momentum, tunnels through barriers, and can even exist in superposition! It makes abstract physics tangible and fun.",
  },
];

/**
 * Find the best offline answer for the given user message and level.
 * Returns null if no good match is found.
 */
export function getOfflineResponse(message: string, level: number): string {
  const msg = message.toLowerCase().trim();
  const kb = KNOWLEDGE_BASE[level] || KNOWLEDGE_BASE[1];

  // Greeting check
  if (msg.match(/^(hi|hello|hey|hola|sup|yo|greetings|howdy)\b/)) {
    return kb.greeting;
  }

  // Score each QA entry based on keyword matches
  const allQAs = [
    ...kb.concepts,
    ...kb.hints,
    ...kb.formulas,
    ...kb.applications,
    ...GENERAL_QA,
  ];

  let bestMatch: QA | null = null;
  let bestScore = 0;

  for (const qa of allQAs) {
    let score = 0;
    for (const kw of qa.keywords) {
      if (msg.includes(kw)) {
        // Longer keyword matches are worth more
        score += kw.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = qa;
    }
  }

  // Require a minimum match quality
  if (bestMatch && bestScore >= 3) {
    return bestMatch.answer;
  }

  // Fallback for the level
  return kb.fallback;
}
