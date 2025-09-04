document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("save");

  // Load saved mode
  chrome.storage.local.get("recordMode", (data) => {
    if (data.recordMode) {
      document.querySelector(`input[value="${data.recordMode}"]`).checked = true;
    }
  });

  // Save mode
  saveBtn.addEventListener("click", () => {
    const mode = document.querySelector('input[name="mode"]:checked')?.value;
    if (!mode) return alert("Please select a mode!");

    chrome.storage.local.set({ recordMode: mode }, () => {
      alert("Recording mode saved!");
    });
  });
});
