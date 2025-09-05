




console.log("✅ Teams Monitor content.js loaded!");

let meetingStarted = false;
let startTime = null;
let recorder;
let chunks = [];
let recordingBar;
let timerInterval;

function log(msg) {
  console.log(`[Teams Monitor] ${msg}`);
}

// 🔴 Show red timer popup while recording
function showRecordingBar() {
  if (recordingBar) return;

  recordingBar = document.createElement("div");
  recordingBar.style.position = "fixed";
  recordingBar.style.bottom = "20px";
  recordingBar.style.right = "20px";
  recordingBar.style.background = "red";
  recordingBar.style.color = "white";
  recordingBar.style.padding = "8px 12px";
  recordingBar.style.borderRadius = "8px";
  recordingBar.style.fontSize = "14px";
  recordingBar.style.zIndex = "999999";
  recordingBar.textContent = "⏺️ Recording... 00:00";

  document.body.appendChild(recordingBar);

  let seconds = 0;
  timerInterval = setInterval(() => {
    seconds++;
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    recordingBar.textContent = `⏺️ Recording... ${m}:${s}`;
  }, 1000);
}

function hideRecordingBar() {
  if (recordingBar) {
    recordingBar.remove();
    recordingBar = null;
  }
  clearInterval(timerInterval);
}

// 🟢 Show green popup when recording stops
function showSavedPopup() {
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.bottom = "20px";
  popup.style.right = "20px";
  popup.style.background = "green";
  popup.style.color = "white";
  popup.style.padding = "8px 12px";
  popup.style.borderRadius = "8px";
  popup.style.fontSize = "14px";
  popup.style.zIndex = "999999";
  popup.textContent = "✅ Recording saved";

  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 4000); // auto hide after 4s
}

async function startRecording(mode) {
  if (mode === "none") {
    log("🚫 Recording disabled by user.");
    return;
  }

  try {
    let stream;
    if (mode === "audio") {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } else if (mode === "video") {
      stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    } else {
      stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    }

    recorder = new MediaRecorder(stream);
    chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = () => {
      hideRecordingBar();
      if (chunks.length) {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `meeting_${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      }
      showSavedPopup(); // ✅ green popup when saved
    };

    recorder.start();
    showRecordingBar();
    log("▶️ Recording started.");
  } catch (err) {
    console.error("❌ Recording error:", err);
  }
}

function stopRecording() {
  if (recorder && recorder.state !== "inactive") {
    recorder.stop();
    log("⏹️ Recording stopped.");
  }
}

const observer = new MutationObserver(() => {
  const toolbar = document.querySelector('div[role="toolbar"][aria-label*="Meeting"]');

  if (toolbar && !meetingStarted) {
    meetingStarted = true;
    startTime = new Date();
    log(`Meeting started at: ${startTime.toLocaleString()}`);

    chrome.storage.local.get("recordMode", (data) => {
      const mode = data.recordMode || "audiovideo";
      startRecording(mode);
    });

    chrome.runtime.sendMessage({ type: "meeting-start", time: startTime.toLocaleTimeString() });
  } 
  else if (!toolbar && meetingStarted) {
    meetingStarted = false;
    const endTime = new Date();
    const durationSec = Math.round((endTime - startTime) / 1000);

    log(`Meeting ended at: ${endTime.toLocaleString()}`);
    log(`Duration: ${durationSec} seconds`);

    stopRecording();

    chrome.runtime.sendMessage({ type: "meeting-end", duration: durationSec });
  }
});

observer.observe(document.body, { childList: true, subtree: true });

log("Meeting monitor is running...");
