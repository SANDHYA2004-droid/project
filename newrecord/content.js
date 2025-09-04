// console.log("✅ Teams Monitor content.js loaded!");

// (function () {
//   let meetingStarted = false;
//   let startTime = null;

//   function log(msg) {
//     console.log(`[Teams Monitor] ${msg}`);
//   }

//   const observer = new MutationObserver(() => {
//     const toolbar = document.querySelector('div[role="toolbar"][aria-label*="Meeting"]');

//     if (toolbar && !meetingStarted) {
//       meetingStarted = true;
//       startTime = new Date();
//       log(`Meeting started at: ${startTime.toLocaleString()}`);

//       chrome.runtime.sendMessage({ type: "meeting-start", time: startTime.toLocaleTimeString() });
//     } 
//     else if (!toolbar && meetingStarted) {
//       meetingStarted = false;
//       const endTime = new Date();
//       const durationSec = Math.round((endTime - startTime) / 1000);

//       log(`Meeting ended at: ${endTime.toLocaleString()}`);
//       log(`Duration: ${durationSec} seconds`);

//       chrome.runtime.sendMessage({ type: "meeting-end", duration: durationSec });
//     }
//   });

//   observer.observe(document.body, { childList: true, subtree: true });

//   log("Meeting monitor is running...");
// })();




console.log("✅ Teams Monitor content.js loaded!");

let meetingStarted = false;
let startTime = null;
let recorder;
let chunks = [];

function log(msg) {
  console.log(`[Teams Monitor] ${msg}`);
}

async function startRecording(mode) {
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
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `meeting_${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };

    recorder.start();
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

    chrome.runtime.sendMessage({ type: "meeting-start", time: startTime.toLocaleTimeString() }, (res) => {
      if (res?.recordMode) {
        startRecording(res.recordMode);
      }
    });
  } 
  else if (!toolbar && meetingStarted) {
    meetingStarted = false;
    const endTime = new Date();
    const durationSec = Math.round((endTime - startTime) / 1000);

    log(`Meeting ended at: ${endTime.toLocaleString()}`);
    log(`Duration: ${durationSec} seconds`);

    chrome.runtime.sendMessage({ type: "meeting-end", duration: durationSec }, (res) => {
      if (res?.stop) {
        stopRecording();
      }
    });
  }
});

observer.observe(document.body, { childList: true, subtree: true });

log("Meeting monitor is running...");
