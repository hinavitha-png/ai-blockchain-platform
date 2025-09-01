const API_BASE = "http://localhost:5000"; // change if backend deployed elsewhere

const form = document.getElementById("record-form");
const status = document.getElementById("status");
const resultBox = document.getElementById("resultBox");
const itemIdInput = document.getElementById("itemId");
const metadataInput = document.getElementById("metadata");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const itemId = itemIdInput.value.trim();
  let metadata = metadataInput.value.trim();
  try {
    // try parse JSON - friendly check
    JSON.parse(metadata);
  } catch (err) {
    status.textContent = "Metadata must be valid JSON.";
    return;
  }
  status.textContent = "Analyzing... this may take a few seconds.";
  submitBtn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/api/analyze-and-store`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, metadata: JSON.parse(metadata) })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Server error");
    status.textContent = "Stored on-chain ✓ (testnet)";
    resultBox.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    status.textContent = "Error: " + err.message;
    resultBox.textContent = "";
  } finally {
    submitBtn.disabled = false;
  }
});

clearBtn.addEventListener("click", () => {
  itemIdInput.value = "";
  metadataInput.value = "";
  status.textContent = "";
  resultBox.textContent = "No results yet";
});
