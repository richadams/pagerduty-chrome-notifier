// Add listener for relevant message to trigger notification sound.
chrome.runtime.onMessage.addListener(function(message)
{
    if (message == 'play-notification') { playNotifierNotificationSound(); }
});

// Helper function to create the actual notification sound.
function playNotifierNotificationSound()
{
    var notifSound = new Audio("/audio/notification.mp3");
    notifSound.play();
}

// We also want to play the sound when the offscreen document is first loaded.
// Otherwise the very first load doesn't actually play the sound as the message arrives
// before the handler is configured.
playNotifierNotificationSound();
