document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("save");
  const status = document.getElementById("status");

  // Load saved mode
  chrome.storage.local.get("recordMode", (data) => {
    if (data.recordMode) {
      document.querySelector(`input[value="${data.recordMode}"]`).checked = true;
      status.textContent = `✅ Current mode: ${data.recordMode}`;
    } else {
      status.textContent = "⚠️ No mode saved yet.";
    }
  });

  // Save mode
  saveBtn.addEventListener("click", () => {
    const mode = document.querySelector('input[name="mode"]:checked')?.value;
    if (!mode) return alert("Please select a mode!");

    chrome.storage.local.set({ recordMode: mode }, () => {
      status.textContent = `✅ Saved mode: ${mode}`;
      alert("Recording mode saved!");
    });
  });
});
