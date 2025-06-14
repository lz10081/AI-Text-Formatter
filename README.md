# AI Text Formatter Chrome Extension

Owner: MMK

## Overview

AI Text Formatter is a Chrome extension that automatically cleans AI-generated text when copying from AI platforms like ChatGPT, Claude, and others. It removes invisible watermarks, replaces robotic AI phrases with natural human language, and ensures all paste operations behave like "Paste and Match Style" for a seamless experience.

## Project Goal

The goal was to create a Chrome extension that:
1. Intercepts copy operations from AI platforms
2. Removes invisible Unicode characters and watermarks
3. Replaces common AI phrases with human-sounding alternatives
4. Forces all paste operations to be plain text (like "Paste and Match Style")
5. Provides per-website toggle controls
6. Tracks daily usage statistics

## Features

### 🔄 AI Phrase Replacement
- **146 phrase mappings** that transform robotic AI language into natural human speech
- Categories include:
  - Overly helpful phrases ("I hope this helps!" → "Let me know if you need more info.")
  - Formal transitions ("Furthermore," → "Also,")
  - Wordy phrases ("It's important to note that" → "Note that")
  - Academic language ("In conclusion," → "So,")
  - And many more...

### 🧹 Text Cleaning
- Removes invisible Unicode characters (zero-width spaces, soft hyphens, etc.)
- Strips HTML tags and Markdown formatting
- Normalizes whitespace and quotes
- Removes hidden elements and watermarks

### 📋 Smart Clipboard Management
- Forces all paste operations to behave like "Paste and Match Style"
- Works across all applications (not just browsers)
- No more formatting issues when pasting into emails, documents, or chat apps

### 🎛️ Website Controls
- Enable/disable extension per website
- Pre-configured for popular AI platforms:
  - Enabled by default: ChatGPT, Claude, Perplexity, You.com, Bing
  - Add custom websites through the popup interface

### 📊 Usage Statistics
- Tracks daily processed texts
- Automatic daily reset
- Visual counter in popup

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension icon will appear in your toolbar

## Usage

1. Click the extension icon to open the popup
2. Toggle the master switch to enable/disable the extension
3. Check/uncheck websites where you want the extension active
4. The "Always paste as plain text" option is enabled by default
5. Copy text from any enabled AI platform - it will be automatically cleaned

## What We Accomplished

### Technical Implementation
- **Manifest V3** compliance for modern Chrome extension standards
- **Content Script** that intercepts copy events without breaking browser functionality
- **Service Worker** for background processing and state management
- **Synchronous clipboard handling** to avoid race conditions
- **Cached settings** for performance optimization

### Problems Solved
1. **Text Corruption Bug**: Fixed issue where Unicode surrogate pairs caused text to become ".,....." 
2. **Paste Behavior**: Ensured all paste operations match "Paste and Match Style" behavior
3. **Stats Counter**: Fixed initialization and daily reset logic
4. **Cross-Platform**: Tested on both Mac and Windows

### Key Improvements
- Comprehensive AI phrase replacement system (146 phrases)
- Conservative Unicode removal to prevent text corruption
- Failsafe mechanisms to ensure clipboard always has valid data
- Real-time statistics updates
- Clean, modern UI with smooth animations

## File Structure

```
ai-text-formatter/
├── manifest.json          # Extension configuration
├── content.js            # Main content script
├── background.js         # Service worker
├── popup/               
│   ├── popup.html       # Extension popup UI
│   ├── popup.js         # Popup logic
│   └── popup.css        # Popup styles
├── icons/               # Extension icons
│   ├── icon-16.png
│   ├── icon-48.png
│   ├── icon-128.png
│   ├── icon-gray-16.png
│   ├── icon-gray-48.png
│   └── icon-gray-128.png
└── README.md            # This file
```

## Permissions

The extension requires minimal permissions:
- `clipboardRead` - To read copied content
- `clipboardWrite` - To write cleaned content
- `storage` - To save settings and statistics
- `activeTab` - To detect current website

## Privacy

- No data is sent to external servers
- All processing happens locally in your browser
- Settings are synced via Chrome's built-in sync (if enabled)
- No tracking or analytics

## Contributing

Feel free to submit issues and pull requests. Some areas for potential improvement:
- Add more AI phrase mappings
- Support for additional languages
- Custom phrase replacement rules
- Export/import settings
- Detailed statistics and history

## License

This project is open source and available for anyone to use and modify.