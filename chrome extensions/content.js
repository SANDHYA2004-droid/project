console.log("✅ Teams Monitor content.js loaded!");

(function () {
  let meetingStarted = false;
  let startTime = null;

  function logMeetingStart() {
    startTime = new Date();
    meetingStarted = true;
    console.log(`[Teams Monitor] ✅ Meeting started at: ${startTime.toLocaleString()}`);

    chrome.runtime.sendMessage({
      type: "meeting-start",
      time: startTime.toLocaleTimeString()
    });
  }

  function logMeetingEnd() {
    if (!meetingStarted) return;
    const endTime = new Date();
    const durationMs = endTime - startTime;
    const durationSeconds = Math.floor(durationMs / 1000);
    const durationMinutes = Math.floor(durationSeconds / 60);
    const remainingSeconds = durationSeconds % 60;

    console.log(`[Teams Monitor] 🛑 Meeting ended at: ${endTime.toLocaleString()}`);
    console.log(`[Teams Monitor] ⏱ Duration: ${durationMinutes} min ${remainingSeconds} sec`);
    meetingStarted = false;

    chrome.runtime.sendMessage({
      type: "meeting-end",
      time: endTime.toLocaleTimeString(),
      duration: `${durationMinutes} min ${remainingSeconds} sec`
    });
  }

  // Observe DOM for meeting UI
  const observer = new MutationObserver(() => {
    // Detect Leave button and attach listener
    const leaveButton = document.querySelector('button[aria-label="Leave"]');
    if (leaveButton && !leaveButton.dataset.listenerAdded) {
      console.log("[Teams Monitor] 🔘 Leave button found, attaching listener...");
      leaveButton.addEventListener("click", () => {
        logMeetingEnd();
      });
      leaveButton.dataset.listenerAdded = true;
    }

    // Detect toolbar → mark meeting start
    const toolbar = document.querySelector('div[role="toolbar"][aria-label="Meeting controls"]');
    if (toolbar && !meetingStarted) {
      logMeetingStart();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  console.log("✅ Teams Meeting Monitor is running...");
})();
