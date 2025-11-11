document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const promptInput = document.getElementById("promptInput");
  const outputText = document.getElementById("outputText");
  const copyBtn = document.getElementById("copyBtn");

  // 👇 async function
  generateBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();

    if (prompt === "") {
      outputText.innerText = "⚠️ Please enter a prompt before generating!";
      outputText.style.color = "#FFD700";
      return;
    }

    outputText.style.color = "#EAEAEA";
    outputText.innerText = "✉️ Generating your email...";
    outputText.classList.add("loading");

    try {
      // 🔗 Connect to your Pipedream URL
      const response = await fetch("https://eong4rgmyx99crf.m.pipedream.net", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const text = await response.text();
      outputText.classList.remove("loading");
      outputText.style.color = "#EAEAEA";
      outputText.innerText = text;

    } catch (err) {
      outputText.classList.remove("loading");
      outputText.innerText = "⚠️ Error generating email. Please try again.";
      console.error("❌ Fetch Error:", err);
    }
  });

  // 📋 Copy button
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(outputText.innerText);
    copyBtn.innerText = "Copied!";
    setTimeout(() => (copyBtn.innerText = "Copy"), 1500);
  });
});

// ✨ Loading animation
const promptStyle = document.createElement("style");
promptStyle.innerHTML = `
.loading { animation: blink 0.8s infinite; }
@keyframes blink { 0%,100%{opacity:.5;} 50%{opacity:1;} }
`;
document.head.appendChild(promptStyle);
