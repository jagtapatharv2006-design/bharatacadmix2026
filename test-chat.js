async function testChat() {
  try {
    const res = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "hello what is 2+2" }],
        level: 1
      })
    });
    const text = await res.text();
    console.log("RESPONSE:", text);
  } catch (e) {
    console.error("ERROR:", e);
  }
}
testChat();
