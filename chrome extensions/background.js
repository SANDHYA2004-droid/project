console.log("🚀 Background service worker loaded");

chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Extension installed");
  chrome.notifications.create("installed-" + Date.now(), {
    type: "basic",
    iconUrl: "icon.png",
    title: "Teams Meeting Monitor",
    message: "Extension installed & background worker active!"
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("📩 Background received:", msg);

  if (msg.type === "meeting-start") {
    chrome.notifications.create("meeting-start-" + Date.now(), {
      type: "basic",
      iconUrl: "icon.png",
      title: "Teams Meeting Started",
      message: `Started at ${msg.time}`
    });
  }

  if (msg.type === "meeting-end") {
    chrome.notifications.create("meeting-end-" + Date.now(), {
      type: "basic",
      iconUrl: "icon.png",
      title: "Teams Meeting Ended",
      message: `Ended at ${msg.time}\nDuration: ${msg.duration}`
    });
  }

  sendResponse({ status: "ok" });
  return true;
});
