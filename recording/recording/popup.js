// let recorder;
// let chunks = [];
// let currentStream = null;

// // 🔑 Ensure microphone permission once
// async function ensureMicPermission() {
//   try {
//     await navigator.mediaDevices.getUserMedia({ audio: true });
//     console.log("🎙️ Microphone permission granted");
//     return true;
//   } catch (err) {
//     console.error("❌ Microphone permission denied:", err);
//     alert("Please allow microphone access in Chrome settings.");
//     return false;
//   }
// }

// // Start recording
// async function startRecording(mode) {
//   try {
//     if (mode === "audio") {
//       // 🔑 First check mic permission
//       const allowed = await ensureMicPermission();
//       if (!allowed) return;

//       // Inject mic recorder into Teams tab
//       const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         func: () => {
//           let recorder;
//           let chunks = [];

//           async function record() {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             recorder = new MediaRecorder(stream);

//             recorder.ondataavailable = (e) => {
//               if (e.data.size > 0) chunks.push(e.data);
//             };

//             recorder.onstop = () => {
//               const blob = new Blob(chunks, { type: "audio/wav" });
//               const url = URL.createObjectURL(blob);
//               const a = document.createElement("a");
//               a.href = url;
//               a.download = `recording-audio-${Date.now()}.wav`;
//               a.click();
//               URL.revokeObjectURL(url);
//             };

//             recorder.start();
//             window.__recorder = recorder;
//             window.__stream = stream;
//             console.log("🎙️ Audio recording started");
//           }

//           record();
//         }
//       });

//     } else {
//       // Tab capture for video/av
//       const captureOptions = {
//         audio: mode === "av",
//         video: true
//       };

//       currentStream = await new Promise((resolve, reject) => {
//         chrome.tabCapture.capture(captureOptions, (stream) => {
//           if (chrome.runtime.lastError || !stream) {
//             reject(chrome.runtime.lastError || new Error("Failed to capture tab"));
//           } else {
//             resolve(stream);
//           }
//         });
//       });

//       recorder = new MediaRecorder(currentStream);
//       chunks = [];

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) chunks.push(e.data);
//       };

//       recorder.onstop = () => saveRecording(mode);

//       recorder.start();
//       console.log(`▶️ Recording started: ${mode}`);
//       document.getElementById("stopBtn").disabled = false;
//     }
//   } catch (err) {
//     console.error("❌ Recording error:", err);
//     alert("Error starting recording: " + err.message);
//   }
// }

// // Stop recording
// function stopRecording() {
//   if (recorder && recorder.state !== "inactive") {
//     recorder.stop();
//     if (currentStream) {
//       currentStream.getTracks().forEach(track => track.stop());
//     }
//     console.log("⏹️ Recording stopped");
//     document.getElementById("stopBtn").disabled = true;
//   } else {
//     // Stop injected audio-only recorder
//     chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         func: () => {
//           if (window.__recorder) {
//             window.__recorder.stop();
//             window.__stream.getTracks().forEach(track => track.stop());
//             console.log("⏹️ Audio recording stopped");
//           }
//         }
//       });
//     });
//   }
// }

// // Save video/av recording
// function saveRecording(mode) {
//   const blob = new Blob(chunks, { type: recorder.mimeType });
//   const url = URL.createObjectURL(blob);

//   let ext = "webm";
//   if (mode === "audio") ext = "wav";

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `recording-${mode}-${Date.now()}.${ext}`;
//   a.click();

//   URL.revokeObjectURL(url);
// }

// // UI events
// document.getElementById("audioBtn").addEventListener("click", () => startRecording("audio"));
// document.getElementById("videoBtn").addEventListener("click", () => startRecording("video"));
// document.getElementById("avBtn").addEventListener("click", () => startRecording("av"));
// document.getElementById("stopBtn").addEventListener("click", stopRecording);





// let recorder;
// let chunks = [];
// let currentStream = null;
// let currentMode = null;

// // 🔑 Ensure microphone permission once
// async function ensureMicPermission() {
//   try {
//     await navigator.mediaDevices.getUserMedia({ audio: true });
//     return true;
//   } catch (err) {
//     alert("Please allow microphone access in Chrome settings.");
//     return false;
//   }
// }

// // Start recording
// async function startRecording(mode) {
//   currentMode = mode;
//   try {
//     if (mode === "audio") {
//       // Check mic permission
//       const allowed = await ensureMicPermission();
//       if (!allowed) return;

//       // Inject recorder into Teams tab
//       const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         func: () => {
//           let recorder;
//           let chunks = [];

//           async function record() {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             recorder = new MediaRecorder(stream);

//             recorder.ondataavailable = (e) => {
//               if (e.data.size > 0) chunks.push(e.data);
//             };

//             recorder.onstop = () => {
//               const blob = new Blob(chunks, { type: "audio/wav" });
//               const url = URL.createObjectURL(blob);
//               const a = document.createElement("a");
//               a.href = url;
//               a.download = `recording-audio-${Date.now()}.wav`;
//               a.click();
//               URL.revokeObjectURL(url);
//             };

//             recorder.start();
//             window.__recorder = recorder;
//             window.__stream = stream;
//           }

//           record();
//         }
//       });
//       document.getElementById("stopBtn").disabled = false;

//     } else {
//       // Tab capture for video/av
//       const captureOptions = {
//         audio: mode === "av",
//         video: true
//       };

//       currentStream = await new Promise((resolve, reject) => {
//         chrome.tabCapture.capture(captureOptions, (stream) => {
//           if (chrome.runtime.lastError || !stream) {
//             reject(chrome.runtime.lastError || new Error("Failed to capture tab"));
//           } else {
//             resolve(stream);
//           }
//         });
//       });

//       recorder = new MediaRecorder(currentStream);
//       chunks = [];

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) chunks.push(e.data);
//       };

//       recorder.onstop = () => saveRecording(mode);

//       recorder.start();
//       document.getElementById("stopBtn").disabled = false;
//     }
//   } catch (err) {
//     alert("Error starting recording: " + err.message);
//   }
// }

// // Stop recording
// function stopRecording() {
//   if (currentMode === "audio") {
//     // Stop recorder injected in Teams tab
//     chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         func: () => {
//           if (window.__recorder) {
//             window.__recorder.stop();
//             window.__stream.getTracks().forEach(track => track.stop());
//           }
//         }
//       });
//     });
//   } else {
//     if (recorder && recorder.state !== "inactive") {
//       recorder.stop();
//       if (currentStream) {
//         currentStream.getTracks().forEach(track => track.stop());
//       }
//     }
//   }

//   document.getElementById("stopBtn").disabled = true;
// }

// // Save video/av recordings
// function saveRecording(mode) {
//   const blob = new Blob(chunks, { type: recorder.mimeType });
//   const url = URL.createObjectURL(blob);

//   let ext = "webm";
//   if (mode === "audio") ext = "wav";

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `recording-${mode}-${Date.now()}.${ext}`;
//   a.click();

//   URL.revokeObjectURL(url);
// }

// // UI events
// document.getElementById("audioBtn").addEventListener("click", () => startRecording("audio"));
// document.getElementById("videoBtn").addEventListener("click", () => startRecording("video"));
// document.getElementById("avBtn").addEventListener("click", () => startRecording("av"));
// document.getElementById("stopBtn").addEventListener("click", stopRecording);






let recorder;
let chunks = [];
let currentStream = null;
let currentMode = null;

// 🔑 Ensure microphone permission once
async function ensureMicPermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (err) {
    alert("Please allow microphone access in Chrome settings.");
    return false;
  }
}

// Start recording
async function startRecording(mode) {
  currentMode = mode;
  try {
    if (mode === "audio") {
      // Check mic permission
      const allowed = await ensureMicPermission();
      if (!allowed) return;

      // Inject recorder into Teams tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          let recorder;
          let chunks = [];

          async function record() {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            recorder = new MediaRecorder(stream);

            recorder.ondataavailable = (e) => {
              if (e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = () => {
              const blob = new Blob(chunks, { type: "audio/wav" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `recording-audio-${Date.now()}.wav`;
              a.click();
              URL.revokeObjectURL(url);
            };

            recorder.start();
            window.__recorder = recorder;
            window.__stream = stream;
          }

          record();
        }
      });
      document.getElementById("stopBtn").disabled = false;

    } else if (mode === "av") {
      // Capture Teams tab (video + tab audio)
      const tabStream = await new Promise((resolve, reject) => {
        chrome.tabCapture.capture({ audio: true, video: true }, (stream) => {
          if (chrome.runtime.lastError || !stream) {
            reject(chrome.runtime.lastError || new Error("Failed to capture tab"));
          } else {
            resolve(stream);
          }
        });
      });

      // Capture microphone
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Mix tab audio + mic audio
      const audioCtx = new AudioContext();
      const dest = audioCtx.createMediaStreamDestination();

      if (tabStream.getAudioTracks().length > 0) {
        const tabAudio = audioCtx.createMediaStreamSource(tabStream);
        tabAudio.connect(dest);
      }

      if (micStream.getAudioTracks().length > 0) {
        const micAudio = audioCtx.createMediaStreamSource(micStream);
        micAudio.connect(dest);
      }

      // Combine video (from tab) + mixed audio
      const finalStream = new MediaStream();
      tabStream.getVideoTracks().forEach(track => finalStream.addTrack(track));
      dest.stream.getAudioTracks().forEach(track => finalStream.addTrack(track));

      currentStream = finalStream;

      recorder = new MediaRecorder(currentStream);
      chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => saveRecording("av");

      recorder.start();
      console.log("🎥 AV recording started (mic + system audio)");
      document.getElementById("stopBtn").disabled = false;

    } else {
      // Video only (no audio)
      currentStream = await new Promise((resolve, reject) => {
        chrome.tabCapture.capture({ audio: false, video: true }, (stream) => {
          if (chrome.runtime.lastError || !stream) {
            reject(chrome.runtime.lastError || new Error("Failed to capture tab"));
          } else {
            resolve(stream);
          }
        });
      });

      recorder = new MediaRecorder(currentStream);
      chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => saveRecording("video");

      recorder.start();
      console.log("📹 Video recording started (no audio)");
      document.getElementById("stopBtn").disabled = false;
    }
  } catch (err) {
    alert("Error starting recording: " + err.message);
  }
}

// Stop recording
function stopRecording() {
  if (currentMode === "audio") {
    // Stop recorder injected in Teams tab
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          if (window.__recorder) {
            window.__recorder.stop();
            window.__stream.getTracks().forEach(track => track.stop());
          }
        }
      });
    });
  } else {
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    }
  }

  document.getElementById("stopBtn").disabled = true;
}

// Save video/av recordings
function saveRecording(mode) {
  const blob = new Blob(chunks, { type: recorder.mimeType });
  const url = URL.createObjectURL(blob);

  let ext = "webm";
  if (mode === "audio") ext = "wav";

  const a = document.createElement("a");
  a.href = url;
  a.download = `recording-${mode}-${Date.now()}.${ext}`;
  a.click();

  URL.revokeObjectURL(url);
}

// UI events
document.getElementById("audioBtn").addEventListener("click", () => startRecording("audio"));
document.getElementById("videoBtn").addEventListener("click", () => startRecording("video"));
document.getElementById("avBtn").addEventListener("click", () => startRecording("av"));
document.getElementById("stopBtn").addEventListener("click", stopRecording);
