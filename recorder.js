(function () {
  let meetingStarted = false;
  let startTime = null;

  function logMeetingStart() {
    startTime = new Date();
    meetingStarted = true;
    console.log(`[Teams Monitor] ✅ Meeting started at: ${startTime.toLocaleString()}`);
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
  }

  // Observe the toolbar for the Leave button
  const observer = new MutationObserver(() => {
    const leaveButton = document.querySelector('button[aria-label="Leave"]');
    if (leaveButton && !leaveButton.dataset.listenerAdded) {
      leaveButton.addEventListener('click', () => {
        logMeetingEnd();
      });
      leaveButton.dataset.listenerAdded = true;
    }

    // If meeting hasn't started yet and toolbar exists, mark start
    const toolbar = document.querySelector('div[role="toolbar"][aria-label="Meeting controls"]');
    if (toolbar && !meetingStarted) {
      logMeetingStart();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  console.log("✅ Teams Meeting Monitor loaded");
})();
