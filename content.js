/**
 * AI Text Formatter - Content Script
 * Owner: MMK
 */

// AI phrase replacements map - Replace with natural human alternatives
const AI_PHRASE_REPLACEMENTS = new Map([
  // Overly helpful phrases
  ['I hope this helps!', 'Let me know if you need more info.'],
  ['I hope you find this helpful.', 'This should cover what you need.'],
  ['I\'m happy to help!', 'No problem.'],
  ['I\'m here to help', 'Happy to assist'],
  ['I\'m here to assist', 'Sure thing'],
  ['Feel free to ask if you have any questions', 'Any questions?'],
  ['Feel free to ask if', 'Just ask if'],
  ['Don\'t hesitate to ask', 'Just let me know'],
  ['Please don\'t hesitate to', 'Feel free to'],
  ['Is there anything else I can help you with?', 'Need anything else?'],
  ['Is there anything else', 'Anything else'],
  ['Let me know if you need anything else', 'That\'s all for now'],
  ['If you have any further questions', 'Any other questions'],
  
  // Formal transitions
  ['Furthermore,', 'Also,'],
  ['Moreover,', 'Plus,'],
  ['Additionally,', 'And '],
  ['However,', 'But '],
  ['Nevertheless,', 'Still,'],
  ['Nonetheless,', 'Even so,'],
  ['Consequently,', 'So '],
  ['Subsequently,', 'Then '],
  ['Therefore,', 'So '],
  ['Thus,', 'So '],
  ['Hence,', 'That\'s why '],
  ['Accordingly,', 'So '],
  ['In addition,', 'Also,'],
  ['In contrast,', 'On the other hand,'],
  ['Conversely,', 'On the flip side,'],
  
  // Wordy phrases
  ['It\'s important to note that', 'Note that'],
  ['It\'s worth noting that', 'Worth noting:'],
  ['It\'s important to remember that', 'Remember,'],
  ['It\'s crucial to understand that', 'Understand that'],
  ['It should be noted that', 'Note:'],
  ['One should note that', 'Note that'],
  ['It\'s essential to', 'You need to'],
  ['It is recommended that', 'I recommend'],
  ['It is suggested that', 'I suggest'],
  ['It would be advisable to', 'You should'],
  ['It would be beneficial to', 'It helps to'],
  
  // Summary phrases
  ['In conclusion,', 'So,'],
  ['To conclude,', 'Finally,'],
  ['In summary,', 'To sum up,'],
  ['To summarize,', 'In short,'],
  ['To sum up,', 'Basically,'],
  ['All in all,', 'Overall,'],
  ['In essence,', 'Basically,'],
  ['Ultimately,', 'In the end,'],
  ['At the end of the day,', 'Ultimately,'],
  
  // Explanation phrases
  ['This means that', 'Meaning'],
  ['What this means is', 'This means'],
  ['In other words,', 'Put simply,'],
  ['To put it another way,', 'Or rather,'],
  ['That is to say,', 'Meaning,'],
  ['Simply put,', 'Basically,'],
  ['To be more specific,', 'Specifically,'],
  ['More specifically,', 'Specifically,'],
  
  // Certainty/uncertainty
  ['I believe that', 'I think'],
  ['It appears that', 'Looks like'],
  ['It seems that', 'Seems like'],
  ['It\'s likely that', 'Probably'],
  ['It\'s possible that', 'Maybe'],
  ['There\'s a chance that', 'Possibly'],
  ['Without a doubt,', 'Definitely,'],
  ['Undoubtedly,', 'Clearly,'],
  ['Certainly,', 'Sure,'],
  
  // Academic/formal phrases
  ['As previously mentioned,', 'As mentioned,'],
  ['As stated earlier,', 'Like I said,'],
  ['As discussed above,', 'As discussed,'],
  ['The aforementioned', 'The above'],
  ['The following', 'These'],
  ['With regard to', 'About'],
  ['In regard to', 'Regarding'],
  ['With respect to', 'About'],
  ['In terms of', 'For'],
  ['From my perspective,', 'I think'],
  ['In my opinion,', 'I think'],
  ['It goes without saying that', 'Obviously'],
  
  // Time-related
  ['At this point in time,', 'Now,'],
  ['At the present time,', 'Currently,'],
  ['In today\'s world,', 'Today,'],
  ['In modern times,', 'These days,'],
  ['In the current climate,', 'Right now,'],
  
  // Polite padding
  ['If you don\'t mind me asking,', 'Quick question -'],
  ['If I may add,', 'Also,'],
  ['If I might suggest,', 'Maybe try'],
  ['With all due respect,', 'Respectfully,'],
  ['I hope you don\'t mind,', 'Hope it\'s okay,'],
  
  // List introductions
  ['Here are some key points:', 'Key points:'],
  ['The main points are as follows:', 'Main points:'],
  ['Consider the following:', 'Consider:'],
  ['The steps are as follows:', 'Steps:'],
  ['The process involves:', 'Process:'],
  
  // Acknowledgments
  ['Thank you for your patience.', 'Thanks for waiting.'],
  ['Thank you for your understanding.', 'Thanks for understanding.'],
  ['I appreciate your interest in', 'Thanks for asking about'],
  ['Thank you for bringing this to my attention.', 'Thanks for letting me know.'],
  
  // Apologies
  ['I apologize for any confusion.', 'Sorry for the confusion.'],
  ['I apologize for the inconvenience.', 'Sorry about that.'],
  ['My apologies,', 'Sorry,'],
  
  // Robotic confirmations
  ['I understand your concern', 'I get it'],
  ['I understand you\'re asking about', 'You\'re asking about'],
  ['Based on the information provided,', 'Based on what you said,'],
  ['According to my understanding,', 'As I understand it,'],
  ['To address your question,', 'To answer you,'],
  ['To provide some context,', 'For context,'],
  
  // Ending phrases
  ['I hope this clarifies things.', 'Hope that clears things up.'],
  ['I trust this answers your question.', 'That should answer it.'],
  ['Please let me know if you need clarification.', 'Let me know if anything\'s unclear.'],
  ['Should you require further assistance,', 'If you need more help,']
]);

// Check if text contains AI-specific content
function checkForAIContent(text) {
  // Check for AI phrases
  for (const phrase of AI_PHRASE_REPLACEMENTS.keys()) {
    if (text.toLowerCase().includes(phrase.toLowerCase())) {
      return true;
    }
  }
  
  // Check for markdown formatting patterns
  const markdownPatterns = [
    /\*\*[^*]+\*\*/,     // Bold
    /\*[^*]+\*/,         // Italic
    /```[\s\S]*?```/,    // Code blocks
    /`[^`]+`/,           // Inline code
    /^#{1,6}\s+/m,       // Headers
    /\[[^\]]+\]\([^)]+\)/ // Links
  ];
  
  for (const pattern of markdownPatterns) {
    if (pattern.test(text)) {
      return true;
    }
  }
  
  return false;
}

// Invisible character ranges to remove
const INVISIBLE_CHARS = [
  '\u200B', // Zero-Width Space
  '\u200C', // Zero-Width Non-Joiner
  '\u200D', // Zero-Width Joiner
  '\u2060', // Word Joiner
  '\u202F', // Narrow No-Break Space
  '\uFEFF', // Byte Order Mark (Zero Width No-Break Space)
  '\u00AD', // Soft Hyphen
  '\u034F', // Combining Grapheme Joiner
  '\u061C', // Arabic Letter Mark
  '\u115F', // Hangul Choseong Filler
  '\u1160', // Hangul Jungseong Filler
  '\u17B4', // Khmer Vowel Inherent Aq
  '\u17B5', // Khmer Vowel Inherent Aa
  '\u180E', // Mongolian Vowel Separator
  '\u2000', // En Quad
  '\u2001', // Em Quad
  '\u2002', // En Space
  '\u2003', // Em Space
  '\u2004', // Three-Per-Em Space
  '\u2005', // Four-Per-Em Space
  '\u2006', // Six-Per-Em Space
  '\u2007', // Figure Space
  '\u2008', // Punctuation Space
  '\u2009', // Thin Space
  '\u200A', // Hair Space
  '\u200E', // Left-To-Right Mark
  '\u200F', // Right-To-Left Mark
  '\u202A', // Left-To-Right Embedding
  '\u202B', // Right-To-Left Embedding
  '\u202C', // Pop Directional Formatting
  '\u202D', // Left-To-Right Override
  '\u202E', // Right-To-Left Override
  '\u2061', // Function Application
  '\u2062', // Invisible Times
  '\u2063', // Invisible Separator
  '\u2064', // Invisible Plus
  '\u206A', // Inhibit Symmetric Swapping
  '\u206B', // Activate Symmetric Swapping
  '\u206C', // Inhibit Arabic Form Shaping
  '\u206D', // Activate Arabic Form Shaping
  '\u206E', // National Digit Shapes
  '\u206F', // Nominal Digit Shapes
  '\u3164', // Hangul Filler
  '\uFE00', // Variation Selector-1
  '\uFE01', // Variation Selector-2
  '\uFE02', // Variation Selector-3
  '\uFE03', // Variation Selector-4
  '\uFE04', // Variation Selector-5
  '\uFE05', // Variation Selector-6
  '\uFE06', // Variation Selector-7
  '\uFE07', // Variation Selector-8
  '\uFE08', // Variation Selector-9
  '\uFE09', // Variation Selector-10
  '\uFE0A', // Variation Selector-11
  '\uFE0B', // Variation Selector-12
  '\uFE0C', // Variation Selector-13
  '\uFE0D', // Variation Selector-14
  '\uFE0E', // Variation Selector-15
  '\uFE0F', // Variation Selector-16
  '\uFFA0', // Halfwidth Hangul Filler
  '\uFFF0', // Reserved
  '\uFFF1', // Reserved
  '\uFFF2', // Reserved
  '\uFFF3', // Reserved
  '\uFFF4', // Reserved
  '\uFFF5', // Reserved
  '\uFFF6', // Reserved
  '\uFFF7', // Reserved
  '\uFFF8'  // Reserved
];

// Create comprehensive regex for ALL invisible/hidden characters
// NOTE: Removed \uD800-\uDFFF (surrogate pairs) as they can cause issues
const INVISIBLE_REGEX = new RegExp(
  `[${INVISIBLE_CHARS.join('')}\\u0000-\\u001F\\u007F-\\u009F\\u2000-\\u200F\\u2028-\\u202F\\u205F-\\u206F\\u3000\\uFE00-\\uFE0F\\uFEFF\\uFFF0-\\uFFF8]`,
  'g'
);

// Additional regex for specific Unicode blocks that contain mostly invisible/control characters
const CONTROL_CHARS_REGEX = /[\u0000-\u001F\u007F-\u009F]/g; // C0 and C1 control codes
const FORMAT_CHARS_REGEX = /[\u200B-\u200F\u2028-\u202E\u2060-\u206F]/g; // Format characters
const SPECIALS_REGEX = /[\uFFF0-\uFFF8]/g; // Specials block
const VARIATION_SELECTORS_REGEX = /[\uFE00-\uFE0F]/g; // Variation selectors
const TAGS_REGEX = /[\uE0000-\uE007F]/g; // Tags block

// Function to clean HTML content while preserving structure
function cleanHTMLContent(container) {
  // Remove hidden elements
  const hiddenSelectors = [
    '[style*="display:none"]',
    '[style*="display: none"]',
    '[hidden]',
    '[style*="visibility:hidden"]',
    '[style*="visibility: hidden"]',
    '[style*="opacity:0"]',
    '[style*="opacity: 0"]',
    '[style*="font-size:0"]',
    '[style*="font-size: 0"]'
  ];
  
  hiddenSelectors.forEach(selector => {
    container.querySelectorAll(selector).forEach(el => el.remove());
  });
  
  // Clean text nodes of invisible characters
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  let node;
  while (node = walker.nextNode()) {
    if (node.nodeValue) {
      // Apply same text processing but preserve structure
      let cleaned = node.nodeValue;
      
      // Remove invisible characters
      cleaned = cleaned.replace(INVISIBLE_REGEX, '');
      cleaned = cleaned.replace(CONTROL_CHARS_REGEX, '');
      cleaned = cleaned.replace(FORMAT_CHARS_REGEX, '');
      cleaned = cleaned.replace(SPECIALS_REGEX, '');
      cleaned = cleaned.replace(VARIATION_SELECTORS_REGEX, '');
      cleaned = cleaned.replace(TAGS_REGEX, '');
      
      node.nodeValue = cleaned;
    }
  }
  
  return container.innerHTML;
}

// Function to extract only visible text from selection
function getVisibleTextFromSelection(selection) {
  if (!selection || selection.rangeCount === 0) return '';
  
  const range = selection.getRangeAt(0);
  const container = document.createElement('div');
  container.appendChild(range.cloneContents());
  
  // Remove all elements that are hidden or have display:none
  const hiddenElements = container.querySelectorAll('[style*="display:none"], [style*="display: none"], [hidden]');
  hiddenElements.forEach(el => el.remove());
  
  // Remove elements with visibility:hidden
  const invisibleElements = container.querySelectorAll('[style*="visibility:hidden"], [style*="visibility: hidden"]');
  invisibleElements.forEach(el => el.remove());
  
  // Remove elements with opacity:0
  const transparentElements = container.querySelectorAll('[style*="opacity:0"], [style*="opacity: 0"]');
  transparentElements.forEach(el => el.remove());
  
  // Remove elements with font-size:0
  const zeroFontElements = container.querySelectorAll('[style*="font-size:0"], [style*="font-size: 0"]');
  zeroFontElements.forEach(el => el.remove());
  
  // Remove elements positioned way off screen
  const offscreenElements = container.querySelectorAll('[style*="position:absolute"], [style*="position: absolute"], [style*="position:fixed"], [style*="position: fixed"]');
  offscreenElements.forEach(el => {
    const style = el.getAttribute('style') || '';
    if (style.match(/left:\s*-\d{4,}px/i) || style.match(/top:\s*-\d{4,}px/i)) {
      el.remove();
    }
  });
  
  // Remove any remaining zero-width or zero-height elements
  container.querySelectorAll('*').forEach(el => {
    const style = el.getAttribute('style') || '';
    if (style.match(/width:\s*0/i) || style.match(/height:\s*0/i)) {
      el.remove();
    }
  });
  
  // Get the text content
  return container.innerText || container.textContent || '';
}

// Cache settings to avoid async operations in event handlers
let cachedSettings = {
  masterEnabled: true,
  websites: {},
  forceAsPlainText: true
};

// Load and cache settings
async function loadSettings() {
  try {
    const settings = await chrome.storage.sync.get(['masterEnabled', 'websites', 'forceAsPlainText']);
    cachedSettings = {
      masterEnabled: settings.masterEnabled !== false,
      websites: settings.websites || {},
      forceAsPlainText: settings.forceAsPlainText !== false
    };
  } catch (error) {
    console.error('[AI Text Formatter] Error loading settings:', error);
  }
}

// Load settings on startup
loadSettings();

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    loadSettings();
  }
});

// Listen for copy events - MUST BE SYNCHRONOUS
document.addEventListener('copy', (event) => {
  try {
    // CRITICAL: Get selection FIRST before any other operations
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const originalText = selection.toString();
    if (!originalText) return;
    
    // Use cached settings - NO ASYNC OPERATIONS HERE
    const { masterEnabled, websites, forceAsPlainText } = cachedSettings;
    
    // Check if extension is enabled
    if (!masterEnabled) {
      return;
    }
    
    // Check if current site is enabled
    const currentHost = window.location.hostname.replace('www.', '');
    if (!websites[currentHost]) {
      return;
    }
    
    // Validate we have text
    if (!originalText || originalText.trim() === '') {
      return;
    }
    
    const processedText = processText(originalText);
    
    const needsCleaning = processedText !== originalText;
    
    // Determine if we need to intervene
    const shouldIntervene = forceAsPlainText || needsCleaning;
    
    if (shouldIntervene) {
      // CRITICAL: Prevent default IMMEDIATELY to stop browser's copy behavior
      event.preventDefault();
      
      // FAILSAFE: Ensure we have valid text to set
      const textToSet = processedText && processedText.trim() ? processedText : originalText;
      
      if (!textToSet || textToSet.trim() === '') {
        return; // Let normal copy proceed
      }
      
      // Clear ALL existing clipboard formats
      event.clipboardData.clearData();
      
      // Set ONLY plain text format
      // This forces ALL paste operations to behave like "Paste and Match Style"
      event.clipboardData.setData('text/plain', textToSet);
      
      // Update stats - count all processed copies
      chrome.runtime.sendMessage({ action: 'incrementStats' });
    }
    // Otherwise, let the normal copy operation proceed with formatting intact
  } catch (error) {
    console.error('AI Text Formatter error:', error);
    // Don't prevent default if error occurs
  }
});

// Process text to remove AI artifacts
function processText(text) {
  if (!text) return text;
  
  let processed = text;
  
  try {
    // 1. Remove specific invisible characters (more conservative approach)
    // Only remove known problematic invisible characters
    processed = processed.replace(/[\u200B\u200C\u200D\u2060\uFEFF]/g, ''); // Zero-width spaces and BOM
    processed = processed.replace(/[\u00AD]/g, ''); // Soft hyphen
    
    // 2. Remove AI phrases
    AI_PHRASE_REPLACEMENTS.forEach((replacement, phrase) => {
      const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      processed = processed.replace(new RegExp(escapedPhrase, 'gi'), replacement);
    });
    
    // 3. Strip HTML tags
    processed = processed.replace(/<[^>]*>/g, '');
    
    // 4. Remove markdown formatting (simplified)
    // Bold: **text**
    processed = processed.replace(/\*\*([^*]+)\*\*/g, '$1');
    // Italic: *text*
    processed = processed.replace(/\*([^*]+)\*/g, '$1');
    // Inline code: `text`
    processed = processed.replace(/`([^`]+)`/g, '$1');
    
    // 5. Normalize whitespace (preserve line breaks)
    // Replace multiple spaces with single space
    processed = processed.replace(/ {2,}/g, ' ');
    // Limit consecutive line breaks
    processed = processed.replace(/\n{3,}/g, '\n\n');
    
    // 6. Convert smart quotes to straight quotes
    processed = processed.replace(/[\u2018\u2019]/g, "'");
    processed = processed.replace(/[\u201C\u201D]/g, '"');
    
    // 7. Final trim
    processed = processed.trim();
    
  } catch (error) {
    console.error('[AI Text Formatter] Error in processText:', error);
    return text; // Return original text if processing fails
  }
  
  return processed;
}