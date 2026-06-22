const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI("AIzaSyDpjDXS8bOOA6Pe372D7qpd7Yfg0dibxac");
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: "You are MR.ψ." 
    });

    const chat = model.startChat({
      history: []
    });

    const result = await chat.sendMessage("hello");
    console.log("SUCCESS:", result.response.text());
  } catch (e) {
    console.error("GEMINI ERROR:", e);
  }
}
testGemini();
