console.log("🚀 Background service worker loaded");

// Fired when extension is first installed or reloaded
chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Extension installed");
  chrome.notifications.create("installed-" + Date.now(), {
    type: "basic",
    iconUrl: "icon.png",
    title: "Teams Meeting Monitor",
    message: "Extension installed & background worker active!"
  }, (id) => {
    if (chrome.runtime.lastError) {
      console.error("❌ Notification error:", chrome.runtime.lastError);
    } else {
      console.log("🔔 Install notification created:", id);
    }
  });
});

// Handle messages from content.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("📩 Background received message:", msg);

  if (msg.type === "meeting-start") {
    console.log("▶️ Creating 'Meeting Started' notification...");
    chrome.notifications.create("meeting-start-" + Date.now(), {
      type: "basic",
      iconUrl: "icon.png",
      title: "Teams Meeting Started",
      message: `Started at ${msg.time}`
    }, (id) => {
      if (chrome.runtime.lastError) {
        console.error("❌ Notification error:", chrome.runtime.lastError);
      } else {
        console.log("🔔 Meeting start notification created:", id);
      }
    });
  }

  if (msg.type === "meeting-end") {
    console.log("▶️ Creating 'Meeting Ended' notification...");
    chrome.notifications.create("meeting-end-" + Date.now(), {
      type: "basic",
      iconUrl: "icon.png",
      title: "Teams Meeting Ended",
      message: `Ended at ${msg.time}\nDuration: ${msg.duration}`
    }, (id) => {
      if (chrome.runtime.lastError) {
        console.error("❌ Notification error:", chrome.runtime.lastError);
      } else {
        console.log("🔔 Meeting end notification created:", id);
      }
    });
  }

  // Always respond to keep service worker alive
  sendResponse({ status: "ok" });
  return true;
});
