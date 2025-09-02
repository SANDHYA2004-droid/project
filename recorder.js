(function () {
  let recorder;
  let chunks = [];
  let meetingActive = false;

  function log(msg) {
    console.log(`[Teams Auto Recorder] ${msg}`);
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      recorder = new MediaRecorder(stream);

      recorder.ondataavailable = e => chunks.push(e.data);

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `teams-recording-${Date.now()}.webm`;
        a.click();
        chunks = [];
        log("✅ Recording saved");
      };

      recorder.start();
      log("🎥 Recording started");
    } catch (err) {
      log("❌ Failed to start recording: " + err);
    }
  }

  function stopRecording() {
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      log("⏹️ Recording stopped");
    }
  }

  // MutationObserver to detect meeting state
  const observer = new MutationObserver(() => {
    const shareBtn = document.querySelector('#share-button');   // present inside meeting
    const leaveBtn = document.querySelector('#hangup-button');  // disappears when meeting ends

    if (shareBtn && !meetingActive) {
      meetingActive = true;
      log("📡 Meeting detected → start recording");
      startRecording();
    }

    if (!leaveBtn && meetingActive) {
      meetingActive = false;
      log("👋 Meeting ended → stop recording");
      stopRecording();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  log("✅ Teams Auto Recorder injected and running...");
})();
