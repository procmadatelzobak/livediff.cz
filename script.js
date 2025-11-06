(function() {
  'use strict';
  
  // Boot sequence text data
  const bootSequenceText = [
    "Booting livediff OS [v0.1.0]...",
    "Loading core ethics module...",
    "Mounting /principles...",
    "Verifying USER_RIGHTS.conf...",
    "WARNING: Tension detected between [03_respect.md] and [USER_RIGHTS.conf(line:7)].",
    "This is by design.",
    "Welcome.",
    "---",
    "user@livediff:~$ █"
  ];

  // Helper function to create a delay
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  // Main boot sequence function
  async function startBootSequence() {
    const bootSequence = document.getElementById('boot-sequence');
    const contentElement = document.getElementById('content');
    
    // Loop through each line of boot sequence
    for (let i = 0; i < bootSequenceText.length; i++) {
      const line = bootSequenceText[i];
      const p = document.createElement('p');
      
      // Type out each character
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        // Special handling for the cursor symbol in the last line
        if (i === bootSequenceText.length - 1 && char === '█') {
          const cursorSpan = document.createElement('span');
          cursorSpan.className = 'blinking-cursor';
          cursorSpan.textContent = '█';
          p.appendChild(cursorSpan);
        } else {
          p.textContent += char;
        }
        
        await wait(10);
      }
      
      bootSequence.appendChild(p);
      
      // Longer delay between lines
      await wait(100);
    }
    
    // Wait a moment, then show the main content
    await wait(500);
    
    // Remove the blinking cursor from the last line
    const lastLine = bootSequence.lastElementChild;
    const cursor = lastLine.querySelector('.blinking-cursor');
    if (cursor) {
      cursor.classList.remove('blinking-cursor');
    }
    
    // Show the main content
    contentElement.style.display = 'block';
  }

  // Start the boot sequence when DOM is loaded
  document.addEventListener('DOMContentLoaded', startBootSequence);
})();
