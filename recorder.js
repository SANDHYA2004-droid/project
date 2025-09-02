let meetingStarted = false;

// Observe for toolbar to appear (meeting started)
const observer = new MutationObserver(() => {
    const toolbar = document.querySelector('div[role="toolbar"][aria-label="Meeting controls"]');
    if (toolbar && !meetingStarted) {
        meetingStarted = true;
        console.log("✅ Meeting started");
    }
});

observer.observe(document.body, { childList: true, subtree: true });

// Detect when user clicks the Leave button
document.addEventListener("click", (e) => {
    const leaveButton = e.target.closest('button[aria-label="Leave"]');
    if (leaveButton && meetingStarted) {
        console.log("❌ Meeting ended (Leave clicked)");
        meetingStarted = false;
    }
});
