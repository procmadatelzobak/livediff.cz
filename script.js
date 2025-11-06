(function() {
  'use strict';
  
  // Global elements
  const terminalOutput = document.getElementById('terminal-output');
  
  // Helper function to wait
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  
  // Helper function to append element and scroll to bottom
  function appendElement(element) {
    terminalOutput.appendChild(element);
    window.scrollTo(0, document.body.scrollHeight);
  }
  
  // Helper function to create prompt
  function createPrompt(command, isUserCmd = true) {
    const h2 = document.createElement('h2');
    h2.className = 'prompt';
    
    if (isUserCmd && command) {
      const userSpan = document.createElement('span');
      userSpan.className = 'prompt-user';
      userSpan.textContent = 'user@livediff:~$ ';
      
      const cmdSpan = document.createElement('span');
      cmdSpan.className = 'prompt-cmd';
      cmdSpan.textContent = command;
      
      h2.appendChild(userSpan);
      h2.appendChild(cmdSpan);
    } else if (command) {
      h2.textContent = command;
    }
    
    return h2;
  }
  
  // Helper function to clone template
  function cloneTemplate(id) {
    const template = document.getElementById(id);
    if (template) {
      return template.content.cloneNode(true);
    }
    return null;
  }
  
  // Boot sequence
  async function startBoot() {
    const bootLines = [
      "Booting livediff OS [v0.1.1]...",
      "Loading core ethics module...",
      "Mounting /principles...",
      "Verifying USER_RIGHTS.conf...",
      "WARNING: Tension detected between [03_respect.md] and [USER_RIGHTS.conf(line:7)].",
      "This is by design.",
      "Welcome.",
      "---"
    ];
    
    // Display boot lines
    for (const line of bootLines) {
      const p = document.createElement('p');
      p.textContent = line;
      appendElement(p);
      await wait(100);
    }
    
    // Simulate typing the prompt
    const promptP = document.createElement('p');
    const userSpan = document.createElement('span');
    userSpan.className = 'prompt-user';
    userSpan.textContent = 'user@livediff:~$ ';
    promptP.appendChild(userSpan);
    
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'blinking-cursor';
    cursorSpan.textContent = '█';
    promptP.appendChild(cursorSpan);
    
    appendElement(promptP);
    await wait(500);
    
    // Change to "ls -l" command
    promptP.innerHTML = '';
    const userSpan2 = document.createElement('span');
    userSpan2.className = 'prompt-user';
    userSpan2.textContent = 'user@livediff:~$ ';
    promptP.appendChild(userSpan2);
    promptP.appendChild(document.createTextNode('ls -l'));
    
    // Show the main menu
    await showMenu();
  }
  
  // Show main menu
  async function showMenu() {
    const menuContent = cloneTemplate('template-menu');
    if (menuContent) {
      appendElement(menuContent);
    }
  }
  
  // Run command
  async function runCommand(command, templateId) {
    // Append the command prompt
    appendElement(createPrompt(command, true));
    
    // Append the cloned content
    const content = cloneTemplate(templateId);
    if (content) {
      appendElement(content);
    }
  }
  
  // Event listener for command links
  document.addEventListener('click', async (e) => {
    let target = e.target;
    
    // Check if the clicked element or its parent is a command-link
    if (!target.classList.contains('command-link')) {
      if (target.parentElement && target.parentElement.classList.contains('command-link')) {
        target = target.parentElement;
      } else {
        return;
      }
    }
    
    e.preventDefault();
    
    const command = target.dataset.command;
    const templateId = target.dataset.templateId;
    
    if (command && templateId) {
      await runCommand(command, templateId);
      await showMenu();
    }
  });
  
  // Start boot sequence when DOM is loaded
  document.addEventListener('DOMContentLoaded', startBoot);
})();
