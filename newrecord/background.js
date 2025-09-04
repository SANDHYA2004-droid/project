// console.log("✅ Background script loaded!");

// let recorder;
// let chunks = [];

// // Listen for messages from content.js
// chrome.runtime.onMessage.addListener((msg, sender) => {
//   console.log("📩 Background received:", msg);

//   if (msg.type === "meeting-start") {
//     chrome.storage.local.get("recordMode", async (data) => {
//       const mode = data.recordMode || "audiovideo";
//       console.log("🎥 Recording mode:", mode);
//       startRecording(mode);
//     });

//     chrome.notifications.create("meeting-start-" + Date.now(), {
//       type: "basic",
//       iconUrl: "icon.png",
//       title: "Teams Meeting Started",
//       message: `Started at ${msg.time}`
//     });
//   }

//   if (msg.type === "meeting-end") {
//     stopRecording(msg.duration);

//     chrome.notifications.create("meeting-end-" + Date.now(), {
//       type: "basic",
//       iconUrl: "icon.png",
//       title: "Teams Meeting Ended",
//       message: `Duration: ${msg.duration} seconds`
//     });
//   }
// });

// async function startRecording(mode) {
//   try {
//     let constraints;

//     if (mode === "audio") {
//       constraints = { audio: true, video: false };
//       stream = await navigator.mediaDevices.getUserMedia(constraints);
//     } else if (mode === "video") {
//       constraints = { video: true, audio: false };
//       stream = await navigator.mediaDevices.getDisplayMedia(constraints);
//     } else {
//       // audio + video
//       stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
//     }

//     recorder = new MediaRecorder(stream);
//     chunks = [];

//     recorder.ondataavailable = (e) => chunks.push(e.data);

//     recorder.onstop = () => {
//       const blob = new Blob(chunks, { type: "video/webm" });
//       const url = URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `meeting_${Date.now()}.webm`;
//       a.click();
//       URL.revokeObjectURL(url);
//     };

//     recorder.start();
//     console.log("▶️ Recording started.");
//   } catch (err) {
//     console.error("❌ Recording error:", err);
//   }
// }

// function stopRecording(duration) {
//   if (recorder && recorder.state !== "inactive") {
//     recorder.stop();
//     console.log("⏹️ Recording stopped. Duration:", duration, "seconds");
//   }
// }






console.log("✅ Background script loaded!");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("📩 Background received:", msg);

  if (msg.type === "meeting-start") {
    chrome.notifications.create("meeting-start-" + Date.now(), {
      type: "basic",
      iconUrl: "icon.png",
      title: "Teams Meeting Started",
      message: `Started at ${msg.time}`
    });

    // tell content.js to start recording
    chrome.storage.local.get("recordMode", (data) => {
      sendResponse({ recordMode: data.recordMode || "audiovideo" });
    });
    return true; // keep sendResponse async
  }

  if (msg.type === "meeting-end") {
    chrome.notifications.create("meeting-end-" + Date.now(), {
      type: "basic",
      iconUrl: "icon.png",
      title: "Teams Meeting Ended",
      message: `Duration: ${msg.duration} seconds`
    });

    // tell content.js to stop recording
    sendResponse({ stop: true });
    return true;
  }
});
