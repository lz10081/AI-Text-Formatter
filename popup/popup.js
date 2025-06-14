/**
 * AI Text Formatter - Popup Script
 * Owner: MMK
 */

// Default websites configuration
const DEFAULT_ENABLED_SITES = [
  'chat.openai.com',
  'claude.ai',
  'bard.google.com',
  'perplexity.ai',
  'you.com',
  'bing.com'
];

const DEFAULT_DISABLED_SITES = [
  'poe.com',
  'writesonic.com',
  'jasper.ai',
  'copy.ai',
  'character.ai'
];

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  setupEventListeners();
  updateProcessedCount();
});

// Load settings from storage
async function loadSettings() {
  const data = await chrome.storage.sync.get({
    masterEnabled: true,
    forceAsPlainText: true,
    websites: {},
    stats: {
      processedToday: 0,
      lastResetDate: new Date().toISOString().split('T')[0]
    }
  });

  // Initialize default websites if not present
  if (Object.keys(data.websites).length === 0) {
    const websites = {};
    DEFAULT_ENABLED_SITES.forEach(site => {
      websites[site] = true;
    });
    DEFAULT_DISABLED_SITES.forEach(site => {
      websites[site] = false;
    });
    data.websites = websites;
    await chrome.storage.sync.set({ websites });
  }

  // Update UI
  document.getElementById('masterToggle').checked = data.masterEnabled;
  document.getElementById('forceAsPlainText').checked = data.forceAsPlainText;
  updateWebsitesList(data.websites);
  updateProcessedCount(data.stats.processedToday);
}

// Update websites list UI
function updateWebsitesList(websites) {
  const container = document.getElementById('websitesList');
  container.innerHTML = '';
  
  // Sort websites alphabetically
  const sortedSites = Object.keys(websites).sort();
  
  sortedSites.forEach(site => {
    const item = document.createElement('div');
    item.className = 'website-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `site-${site}`;
    checkbox.checked = websites[site];
    checkbox.addEventListener('change', () => toggleWebsite(site, checkbox.checked));
    
    const label = document.createElement('label');
    label.htmlFor = `site-${site}`;
    label.textContent = site;
    
    item.appendChild(checkbox);
    item.appendChild(label);
    container.appendChild(item);
  });
}

// Toggle website enabled/disabled
async function toggleWebsite(site, enabled) {
  const { websites } = await chrome.storage.sync.get('websites');
  websites[site] = enabled;
  await chrome.storage.sync.set({ websites });
}

// Setup event listeners
function setupEventListeners() {
  // Master toggle
  document.getElementById('masterToggle').addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ masterEnabled: e.target.checked });
    
    // Update extension icon
    chrome.runtime.sendMessage({ 
      action: 'updateIcon', 
      enabled: e.target.checked 
    });
  });
  
  // Add website button
  document.getElementById('addWebsiteBtn').addEventListener('click', addWebsite);
  
  // Enter key on input
  document.getElementById('newWebsite').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addWebsite();
    }
  });
  
  // Force plain text checkbox
  document.getElementById('forceAsPlainText').addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ forceAsPlainText: e.target.checked });
  });
}

// Add new website
async function addWebsite() {
  const input = document.getElementById('newWebsite');
  let website = input.value.trim().toLowerCase();
  
  if (!website) return;
  
  // Remove protocol if present
  website = website.replace(/^https?:\/\//, '');
  website = website.replace(/^www\./, '');
  website = website.split('/')[0]; // Remove path
  
  // Validate domain
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*$/;
  if (!domainRegex.test(website)) {
    showError('Please enter a valid domain name');
    return;
  }
  
  // Check if already exists
  const { websites } = await chrome.storage.sync.get('websites');
  if (websites[website] !== undefined) {
    showError('Website already exists');
    return;
  }
  
  // Add website
  websites[website] = true;
  await chrome.storage.sync.set({ websites });
  
  // Update UI
  updateWebsitesList(websites);
  input.value = '';
}

// Show error message
function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = message;
  errorDiv.classList.add('show');
  
  setTimeout(() => {
    errorDiv.classList.remove('show');
  }, 3000);
}

// Update processed count
async function updateProcessedCount(count) {
  if (count === undefined) {
    const { stats } = await chrome.storage.sync.get('stats');
    
    // Check if we need to reset based on date
    if (stats && stats.lastResetDate) {
      const today = new Date().toISOString().split('T')[0];
      if (stats.lastResetDate !== today) {
        // Reset for new day
        stats.processedToday = 0;
        stats.lastResetDate = today;
        await chrome.storage.sync.set({ stats });
      }
    }
    
    count = stats?.processedToday || 0;
  }
  document.getElementById('processedCount').textContent = count;
}

// Listen for updates from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateStats') {
    updateProcessedCount(request.count);
  }
});