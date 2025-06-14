/**
 * AI Text Formatter - Background Service Worker
 * Owner: MMK
 */

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  // Set default storage values
  const data = await chrome.storage.sync.get(['masterEnabled', 'forceAsPlainText', 'websites', 'stats']);
  
  if (data.masterEnabled === undefined) {
    await chrome.storage.sync.set({ masterEnabled: true });
  }
  
  if (data.forceAsPlainText === undefined) {
    await chrome.storage.sync.set({ forceAsPlainText: true });
  }
  
  if (!data.websites || Object.keys(data.websites).length === 0) {
    const websites = {};
    // Default enabled sites
    ['chat.openai.com', 'claude.ai', 'bard.google.com', 'perplexity.ai', 'you.com', 'bing.com'].forEach(site => {
      websites[site] = true;
    });
    // Default disabled sites
    ['poe.com', 'writesonic.com', 'jasper.ai', 'copy.ai', 'character.ai'].forEach(site => {
      websites[site] = false;
    });
    await chrome.storage.sync.set({ websites });
  }
  
  if (!data.stats) {
    await chrome.storage.sync.set({
      stats: {
        processedToday: 0,
        lastResetDate: new Date().toISOString().split('T')[0]
      }
    });
  }
  
  // Update icon based on state
  const { masterEnabled } = await chrome.storage.sync.get('masterEnabled');
  updateIcon(masterEnabled);
});

// Handle messages
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'incrementStats') {
    await incrementProcessedCount();
  }
  
  if (request.action === 'updateIcon') {
    updateIcon(request.enabled);
  }
});

// Increment processed count
async function incrementProcessedCount() {
  const { stats } = await chrome.storage.sync.get('stats');
  const today = new Date().toISOString().split('T')[0];
  
  // Initialize if not present
  if (!stats) {
    await chrome.storage.sync.set({
      stats: {
        processedToday: 1,
        lastResetDate: today
      }
    });
    
    // Notify popup if open
    chrome.runtime.sendMessage({
      action: 'updateStats',
      count: 1
    }).catch(() => {});
    
    return;
  }
  
  // Reset count if new day
  if (stats.lastResetDate !== today) {
    stats.processedToday = 0;
    stats.lastResetDate = today;
  }
  
  stats.processedToday++;
  await chrome.storage.sync.set({ stats });
  
  // Notify popup if open
  chrome.runtime.sendMessage({
    action: 'updateStats',
    count: stats.processedToday
  }).catch(() => {
    // Popup not open, ignore error
  });
}

// Update extension icon
function updateIcon(enabled) {
  if (enabled) {
    chrome.action.setIcon({
      path: {
        16: 'icons/icon-16.png',
        48: 'icons/icon-48.png',
        128: 'icons/icon-128.png'
      }
    }).catch(() => {
      // Icons might not exist yet, that's okay
    });
  } else {
    chrome.action.setIcon({
      path: {
        16: 'icons/icon-gray-16.png',
        48: 'icons/icon-gray-48.png',
        128: 'icons/icon-gray-128.png'
      }
    }).catch(() => {
      // Icons might not exist yet, that's okay
    });
  }
}

// Check for daily reset periodically
setInterval(async () => {
  const { stats } = await chrome.storage.sync.get('stats');
  const today = new Date().toISOString().split('T')[0];
  
  if (stats.lastResetDate !== today) {
    stats.processedToday = 0;
    stats.lastResetDate = today;
    await chrome.storage.sync.set({ stats });
  }
}, 60000); // Check every minute