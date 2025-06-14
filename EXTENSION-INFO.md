# AI Text Formatter Chrome Extension

**Version:** 1.0.0  
**Owner:** MMK

## Extension Overview

AI Text Formatter is a Chrome extension that automatically cleans AI-generated text when copying from AI platforms. It removes hidden watermarks, AI-specific phrases, and formatting to ensure clean, plain text pasting.

## Key Features

1. **Force Plain Text Mode** - When enabled, all copies become plain text only (like "Paste and Match Style")
2. **Hidden Character Removal** - Removes all invisible Unicode characters and watermarks
3. **AI Phrase Cleaning** - Removes or replaces common AI-generated phrases
4. **Format Stripping** - Removes HTML tags and Markdown formatting
5. **Smart Quote Conversion** - Converts smart quotes to straight quotes
6. **Per-Website Control** - Enable/disable for specific websites
7. **Daily Statistics** - Tracks how many texts were processed

## File Structure

```
ai-text-formatter/
├── manifest.json         # Extension configuration
├── background.js         # Service worker for extension management
├── content.js           # Main content script for text processing
├── popup/               # Extension popup interface
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── icons/               # Extension icons (16, 48, 128px)
├── LICENSE             # License file
└── README.md           # User documentation
```

## Default Enabled Websites

- chat.openai.com (ChatGPT)
- claude.ai (Claude)
- bard.google.com (Google Bard)
- perplexity.ai (Perplexity)
- you.com (You.com)
- bing.com (Bing Chat)

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `ai-text-formatter` folder

## Usage

1. Click the extension icon in Chrome toolbar
2. Toggle "Always paste as plain text" for forced plain text mode
3. Enable/disable specific websites
4. Copy text from any enabled AI platform
5. Paste anywhere - formatting will be cleaned automatically

## Technical Notes

- Uses Manifest V3
- Synchronous clipboard handling for reliability
- Cached settings for performance
- Comprehensive Unicode character filtering
- Error handling with fallback to original text

## Support

This project is open source and available on GitHub.