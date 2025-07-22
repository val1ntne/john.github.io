// Global Variables
let currentTheme = 'matrix';
let currentLanguage = 'EN';
let isSystemBreached = false;
let commandHistory = [];
let historyIndex = -1;

// Terminal Elements
const commandOutput = document.getElementById("commandOutput");
const statusDisplay = document.getElementById("statusDisplay");
const accessList = document.getElementById("accessList");
const commandInput = document.getElementById("commandInput");
const quantumCore = document.getElementById("quantumCore");

// Access Levels Data
const accessLevels = [
  { 
    level: 7, 
    title: "Janitor, Cable Repair, Instructor", 
    access: "Maintenance tunnels, Habitation sublevels, Storage",
    color: "#888888",
    clearance: "BASIC"
  },
  { 
    level: 6, 
    title: "Operator", 
    access: "Engineering, Internal surveillance nodes",
    color: "#00aa88",
    clearance: "STANDARD"
  },
  { 
    level: 5, 
    title: "Scientist", 
    access: "Labs, Sample Vaults, Bio-research",
    color: "#0088aa",
    clearance: "ELEVATED"
  },
  { 
    level: 4, 
    title: "Senior Researcher", 
    access: "Mainframe, Z-2 Observation, Central Hub",
    color: "#aa8800",
    clearance: "RESTRICTED"
  },
  { 
    level: 3, 
    title: "Site Overseer", 
    access: "All scientific and technical wings",
    color: "#aa4400",
    clearance: "CLASSIFIED"
  },
  { 
    level: 2, 
    title: "Na'vi Administrator", 
    access: "Command Core, Emergency overrides, Level resets",
    color: "#aa0044",
    clearance: "SECRET"
  },
  { 
    level: 1, 
    title: "Mr. Harrell (Founder)", 
    access: "Total unrestricted access",
    color: "#ff0080",
    clearance: "TOP SECRET"
  }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeTerminal();
  generateAccessLevels();
  startBackgroundAnimations();
  startSystemMetrics();
  initializeNeuralNetwork();
  showBootSequence();
});

// Boot Sequence
function showBootSequence() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
    
    const bootMessages = [
      "INITIALIZING QUANTUM MATRIX...",
      "LOADING NEURAL PATHWAYS...",
      "ESTABLISHING SECURE CONNECTION...",
      "AUTHENTICATING BIOMETRIC DATA...",
      "SYSTEM READY"
    ];
    
    let i = 0;
    const bootInterval = setInterval(() => {
      const loadingText = document.querySelector('.loading-text');
      if (loadingText) {
        loadingText.textContent = bootMessages[i];
      }
      i++;
      
      if (i >= bootMessages.length) {
        clearInterval(bootInterval);
        setTimeout(() => {
          overlay.style.display = 'none';
          typeWelcomeMessage();
        }, 1000);
      }
    }, 800);
  } else {
    // If no loading overlay, just show welcome message
    typeWelcomeMessage();
  }
}

// Initialize Terminal
function initializeTerminal() {
  if (commandInput) {
    commandInput.addEventListener('keydown', handleCommand);
    commandInput.addEventListener('keyup', handleHistoryNavigation);
    
    // Auto-focus terminal input
    commandInput.focus();
    
    // Refocus on click
    document.addEventListener('click', () => {
      if (!window.getSelection().toString()) {
        commandInput.focus();
      }
    });
  }
}

// Welcome Message
function typeWelcomeMessage() {
  const welcomeText = `
<div style="color: #00ffff; font-weight: bold; margin-bottom: 1rem;">
█████╗ ███████╗ ██████╗  █████╗ ██████╗ ██████╗ 
██╔══██╗██╔════╝██╔════╝ ██╔══██╗██╔══██╗██╔══██╗
███████║███████╗██║  ███╗███████║██████╔╝██║  ██║
██╔══██║╚════██║██║   ██║██╔══██║██╔══██╗██║  ██║
██║  ██║███████║╚██████╔╝██║  ██║██║  ██║██████╔╝
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ 
</div>
<div style="color: #00ffcc;">
QUANTUM ACCESS TERMINAL v4.7.2
Ninth Site of Asgard - Pandora Research Division
</div>
<div style="color: #ffaa00; margin: 1rem 0;">
⚠️  WARNING: Authorized personnel only
⚠️  All activities are monitored and logged
⚠️  Unauthorized access will trigger security protocols
</div>
<div style="color: #00ff00;">
Available Commands:
• help - Display command list
• access_level set [1-7] - Set access level
• retrieve file [filename] - Access secure files
• scan network - Network diagnostics
• override protocol - Emergency override
• records - Access personnel records database
• clear - Clear terminal
• status - System status report
</div>
<hr style="border-color: #00ffcc; margin: 1rem 0;">
  `;
  
  typeText(welcomeText, 50);
}

// Type Effect
function typeText(text, speed = 50) {
  const div = document.createElement('div');
  div.innerHTML = text;
  commandOutput.appendChild(div);
  scrollToBottom();
}

// Handle Commands
function handleCommand(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const input = e.target.value.trim();
    
    if (input) {
      commandHistory.unshift(input);
      if (commandHistory.length > 50) commandHistory.pop();
      historyIndex = -1;
      
      addToOutput(`<span style="color: #00ff00;">[ASGARD@QUANTUM]$</span> ${input}`);
      parseCommand(input.toUpperCase());
    }
    
    e.target.value = "";
  }
}

// History Navigation
function handleHistoryNavigation(e) {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      commandInput.value = commandHistory[historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      commandInput.value = commandHistory[historyIndex];
    } else if (historyIndex === 0) {
      historyIndex = -1;
      commandInput.value = '';
    }
  }
}

// Parse Commands
function parseCommand(cmd) {
  showTypingIndicator();
  
  setTimeout(() => {
    hideTypingIndicator();
    
    if (cmd === 'HELP') {
      showHelp();
    } else if (cmd === 'CLEAR') {
      clearTerminal();
    } else if (cmd === 'STATUS') {
      showSystemStatus();
    } else if (cmd.startsWith('ACCESS_LEVEL SET')) {
      handleAccessLevel(cmd);
    } else if (cmd.startsWith('RETRIEVE FILE')) {
      handleFileRetrieval(cmd);
    } else if (cmd === 'SCAN NETWORK') {
      performNetworkScan();
    } else if (cmd.startsWith('OVERRIDE PROTOCOL')) {
      handleEmergencyOverride(cmd);
    } else if (cmd === 'RECORDS') {
      redirectToRecords();
    } else if (cmd === 'MATRIX MODE') {
      activateMatrixMode();
    } else if (cmd === 'SHUTDOWN') {
      initiateShutdown();
    } else {
      addToOutput(`<span style="color: #ff4444;">ERROR:</span> Unknown command: ${cmd}`);
      addToOutput(`<span style="color: #ffaa00;">Type 'help' for available commands</span>`);
    }
    
    scrollToBottom();
  }, Math.random() * 1000 + 500);
}

// Command Implementations
function showHelp() {
  const helpText = `
<div style="color: #00ffcc; font-weight: bold;">AVAILABLE COMMANDS:</div>
<div style="margin-left: 2rem; color: #00ff00;">
• <span style="color: #ffaa00;">help</span> - Display this help message
• <span style="color: #ffaa00;">access_level set [1-7]</span> - Set security clearance level
• <span style="color: #ffaa00;">retrieve file [filename]</span> - Access classified files
• <span style="color: #ffaa00;">scan network</span> - Perform network diagnostics
• <span style="color: #ffaa00;">override protocol [code]</span> - Emergency system override
• <span style="color: #ffaa00;">records</span> - Access personnel records database
• <span style="color: #ffaa00;">status</span> - Display system status report
• <span style="color: #ffaa00;">matrix mode</span> - Activate enhanced interface
• <span style="color: #ffaa00;">clear</span> - Clear terminal output
• <span style="color: #ffaa00;">shutdown</span> - Initiate system shutdown
</div>
  `;
  addToOutput(helpText);
}

function redirectToRecords() {
  addToOutput(`<span style="color: #00ffcc;">Accessing personnel records database...</span>`);
  addToOutput(`<span style="color: #ffaa00;">🔐 Authenticating access credentials...</span>`);
  addToOutput(`<span style="color: #00ff00;">✓ Authentication successful</span>`);
  addToOutput(`<span style="color: #00ffcc;">📁 Loading records interface...</span>`);
  
  // Show loading animation
  const loadingDiv = document.createElement('div');
  loadingDiv.innerHTML = `
    <div style="margin: 1rem 0; color: #00ffff;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div class="loading-spinner" style="
          width: 20px; 
          height: 20px; 
          border: 2px solid #333; 
          border-top: 2px solid #00ffcc; 
          border-radius: 50%; 
          animation: spin 1s linear infinite;
        "></div>
        <span>Redirecting to records.html...</span>
      </div>
    </div>
  `;
  
  // Add CSS animation for spinner
  if (!document.querySelector('#spinner-style')) {
    const style = document.createElement('style');
    style.id = 'spinner-style';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
  
  commandOutput.appendChild(loadingDiv);
  scrollToBottom();
  
  setTimeout(() => {
    addToOutput(`<span style="color: #00ff00;">🚀 Redirecting to personnel records...</span>`);
    showNotification('Redirecting to Records Database', 'success');
    
    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = 'records.html';
    }, 1500);
  }, 2000);
}

function handleAccessLevel(cmd) {
  const parts = cmd.split(' ');
  if (parts.length < 3) {
    addToOutput(`<span style="color: #ff4444;">ERROR:</span> Invalid syntax. Use: access_level set [1-7]`);
    return;
  }
  
  const level = parseInt(parts[2]);
  const accessLevel = accessLevels.find(a => a.level === level);
  
  if (accessLevel) {
    highlightAccessLevel(level);
    addToOutput(`<span style="color: #00ff00;">ACCESS GRANTED:</span> Level ${level} - ${accessLevel.title}`);
    addToOutput(`<span style="color: #00ffcc;">Clearance:</span> ${accessLevel.clearance}`);
    addToOutput(`<span style="color: #00ffcc;">Access:</span> ${accessLevel.access}`);
    
    showNotification(`Access Level ${level} Activated`, 'success');
    
    if (level <= 3) {
      addToOutput(`<span style="color: #ffaa00;">⚠️ HIGH SECURITY CLEARANCE DETECTED</span>`);
      addToOutput(`<span style="color: #ffaa00;">⚠️ Enhanced monitoring protocols activated</span>`);
    }
  } else {
    addToOutput(`<span style="color: #ff4444;">ERROR:</span> Invalid access level. Range: 1-7`);
    showNotification('Invalid Access Level', 'error');
  }
}

function handleFileRetrieval(cmd) {
  const fileName = cmd.replace('RETRIEVE FILE ', '');
  const files = {
    'Z-2_CORE_REPORT': {
      name: 'Z-2 Core Report',
      security: 'CLASSIFIED',
      size: '847 MB',
      description: 'Comprehensive analysis of Z-2 anomaly readings and containment protocols'
    },
    'HAVEN_ENVIRONMENTAL_SURVEY': {
      name: 'Haven Environmental Survey',
      security: 'RESTRICTED',
      size: '12 MB',
      description: 'Atmospheric and biological assessment of Haven research station'
    },
    'FOUNDERS_LOG_MR.HARRELL': {
      name: 'Founder\'s Personal Log - Mr. Harrell',
      security: 'TOP SECRET',
      size: '3.2 GB',
      description: 'Personal video logs and project documentation from facility founder'
    }
  };
  
  if (files[fileName]) {
    const file = files[fileName];
    simulateFileTransfer(file);
  } else {
    addToOutput(`<span style="color: #ff4444;">ERROR:</span> File not found: ${fileName}`);
    addToOutput(`<span style="color: #ffaa00;">Available files:</span>`);
    Object.keys(files).forEach(key => {
      addToOutput(`  • ${key}`);
    });
  }
}

function simulateFileTransfer(file) {
  addToOutput(`<span style="color: #00ffcc;">Initiating file retrieval...</span>`);
  addToOutput(`<span style="color: #ffaa00;">File:</span> ${file.name}`);
  addToOutput(`<span style="color: #ffaa00;">Security Level:</span> ${file.security}`);
  addToOutput(`<span style="color: #ffaa00;">Size:</span> ${file.size}`);
  
  const progressBar = document.createElement('div');
  progressBar.innerHTML = `
    <div style="margin: 1rem 0;">
      <div style="background: #333; height: 20px; border-radius: 10px; overflow: hidden;">
        <div id="transferProgress" style="width: 0%; height: 100%; background: linear-gradient(90deg, #00ffcc, #00ffff); transition: width 0.3s;"></div>
      </div>
      <span id="transferText">Downloading... 0%</span>
    </div>
  `;
  commandOutput.appendChild(progressBar);
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress > 100) progress = 100;
    
    const progressEl = document.getElementById('transferProgress');
    const textEl = document.getElementById('transferText');
    
    if (progressEl) progressEl.style.width = progress + '%';
    if (textEl) textEl.textContent = `Downloading... ${Math.floor(progress)}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        addToOutput(`<span style="color: #00ff00;">✓ Download complete</span>`);
        addToOutput(`<span style="color: #00ffcc;">Description:</span> ${file.description}`);
        showNotification('File Retrieved Successfully', 'success');
      }, 500);
    }
  }, 200);
  
  scrollToBottom();
}

function performNetworkScan() {
  addToOutput(`<span style="color: #00ffcc;">Initiating network scan...</span>`);
  
  const nodes = [
    'MAINFRAME-CORE-01......[ONLINE]',
    'SECURITY-NODE-ALPHA....[ONLINE]',
    'RESEARCH-LAB-BETA......[ONLINE]',
    'ENVIRONMENTAL-SENSORS..[ONLINE]',
    'BACKUP-POWER-GRID......[ONLINE]',
    'EXTERNAL-COMMS.........[OFFLINE]',
    'Z-2-CONTAINMENT........[CRITICAL]'
  ];
  
  let i = 0;
  const scanInterval = setInterval(() => {
    if (i < nodes.length) {
      const status = nodes[i].includes('OFFLINE') ? 'color: #ff4444;' : 
                    nodes[i].includes('CRITICAL') ? 'color: #ffaa00;' : 'color: #00ff00;';
      addToOutput(`<span style="${status}">${nodes[i]}</span>`);
      i++;
    } else {
      clearInterval(scanInterval);
      addToOutput(`<div style="margin-top: 1rem; color: #00ffcc;">
        Network Scan Complete<br>
        • Active Nodes: 5/7<br>
        • Security Status: NOMINAL<br>
        • Anomalies Detected: 1 (Z-2 Containment)
      </div>`);
      
      if (!isSystemBreached) {
        showNotification('Network Scan Complete', 'info');
      }
    }
    scrollToBottom();
  }, 300);
}

function handleEmergencyOverride(cmd) {
  const code = cmd.replace('OVERRIDE PROTOCOL ', '');
  
  if (code === 'ALPHA-7-7') {
    isSystemBreached = true;
    if (statusDisplay) {
      statusDisplay.innerText = "BREACH DETECTED";
      statusDisplay.classList.add("alert-status");
    }
    
    addToOutput(`<span style="color: #ff4444; font-weight: bold;">⚠️ EMERGENCY OVERRIDE ACTIVATED ⚠️</span>`);
    addToOutput(`<span style="color: #ff4444;">🔒 ALL BLAST DOORS SEALED</span>`);
    addToOutput(`<span style="color: #ff4444;">🚨 SECURITY ALERT: RED LEVEL</span>`);
    addToOutput(`<span style="color: #ff4444;">📡 EXTERNAL COMMUNICATIONS BLOCKED</span>`);
    
    showNotification('EMERGENCY PROTOCOL ACTIVATED', 'error');
    triggerAlarmMode();
  } else if (code === '') {
    addToOutput(`<span style="color: #ffaa00;">⚠️ Override code required</span>`);
    addToOutput(`<span style="color: #ffaa00;">Usage: override protocol [CODE]</span>`);
  } else {
    addToOutput(`<span style="color: #ff4444;">ERROR:</span> Invalid override code`);
    addToOutput(`<span style="color: #ff4444;">⚠️ Security breach attempt logged</span>`);
    showNotification('Invalid Override Code', 'error');
  }
}

function showSystemStatus() {
  const uptime = Math.floor(Math.random() * 72) + 24;
  const cpuUsage = Math.floor(Math.random() * 30) + 15;
  const memUsage = Math.floor(Math.random() * 40) + 30;
  
  const statusReport = `
<div style="color: #00ffff; font-weight: bold; margin-bottom: 1rem;">SYSTEM STATUS REPORT</div>
<div style="color: #00ffcc;">
┌─────────────────────────────────────┐<br>
│ <span style="color: #ffaa00;">QUANTUM CORE STATUS</span>     │<br>
│ Uptime: ${uptime}h 23m             │<br>
│ CPU Usage: ${cpuUsage}%                    │<br>
│ Memory: ${memUsage}%/8TB                 │<br>
│ Quantum Coherence: 98.7%           │<br>
│                                     │<br>
│ <span style="color: #ffaa00;">SECURITY STATUS</span>         │<br>
│ Access Level: VARIABLE              │<br>
│ Threat Level: ${isSystemBreached ? '<span style="color: #ff4444;">HIGH</span>' : '<span style="color: #00ff00;">LOW</span>'}              │<br>
│ Firewall: ACTIVE                    │<br>
│ Intrusion Detection: ENABLED        │<br>
│                                     │<br>
│ <span style="color: #ffaa00;">FACILITY STATUS</span>         │<br>
│ Life Support: OPTIMAL               │<br>
│ Power Grid: STABLE                  │<br>
│ Research Labs: OPERATIONAL          │<br>
│ Containment: ${isSystemBreached ? '<span style="color: #ffaa00;">COMPROMISED</span>' : '<span style="color: #00ff00;">SECURE</span>'}           │<br>
└─────────────────────────────────────┘
</div>
  `;
  
  addToOutput(statusReport);
}

function activateMatrixMode() {
  addToOutput(`<span style="color: #00ff00;">Activating Matrix Mode...</span>`);
  document.body.style.filter = 'hue-rotate(120deg)';
  
  setTimeout(() => {
    addToOutput(`<span style="color: #00ff00;">✓ Matrix Mode Activated</span>`);
    addToOutput(`<span style="color: #00ff00;">Enhanced neural interface enabled</span>`);
    showNotification('Matrix Mode Active', 'success');
  }, 1000);
}

function clearTerminal() {
  commandOutput.innerHTML = '';
}

function initiateShutdown() {
  addToOutput(`<span style="color: #ffaa00;">⚠️ Initiating system shutdown...</span>`);
  addToOutput(`<span style="color: #ffaa00;">Saving critical data...</span>`);
  addToOutput(`<span style="color: #ffaa00;">Closing secure connections...</span>`);
  
  setTimeout(() => {
    addToOutput(`<span style="color: #ff4444;">CONNECTION TERMINATED</span>`);
    if (commandInput) commandInput.disabled = true;
    showNotification('System Shutdown', 'error');
  }, 2000);
}

// UI Helper Functions
function addToOutput(content) {
  if (commandOutput) {
    const div = document.createElement('div');
    div.innerHTML = content;
    div.style.marginBottom = '0.3rem';
    commandOutput.appendChild(div);
  }
}

function scrollToBottom() {
  if (commandOutput) {
    commandOutput.scrollTop = commandOutput.scrollHeight;
  }
}

function showTypingIndicator() {
  if (commandOutput) {
    const indicator = document.createElement('div');
    indicator.id = 'typingIndicator';
    indicator.innerHTML = '<span style="color: #ffaa00;">Processing command...</span>';
    indicator.style.opacity = '0.7';
    commandOutput.appendChild(indicator);
    scrollToBottom();
  }
}

function hideTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) indicator.remove();
}

// Generate Access Levels
function generateAccessLevels() {
  if (accessList) {
    accessLevels.forEach(level => {
      const div = document.createElement('div');
      div.className = 'access-level';
      div.innerHTML = `
        <div class='level-title'>Level ${level.level}: ${level.title}</div>
        <div class='level-access' style="color: ${level.color};">
          <strong>Clearance:</strong> ${level.clearance}<br>
          <strong>Access:</strong> ${level.access}
        </div>
      `;
      
      div.addEventListener('click', () => {
        highlightAccessLevel(level.level);
        addToOutput(`<span style="color: #00ffcc;">Selected:</span> Access Level ${level.level}`);
        scrollToBottom();
      });
      
      accessList.appendChild(div);
    });
  }
}

function highlightAccessLevel(level) {
  const levels = document.querySelectorAll('.access-level');
  levels.forEach(l => l.style.background = 'rgba(0, 0, 0, 0.6)');
  
  const selectedLevel = levels[7 - level]; // Reverse index
  if (selectedLevel) {
    selectedLevel.style.background = 'rgba(0, 255, 204, 0.1)';
    selectedLevel.style.borderLeftColor = '#00ffff';
  }
}

// Background Animations
function startBackgroundAnimations() {
  // Quantum core fluctuations
  setInterval(() => {
    if (quantumCore) {
      const fluctuation = (Math.random() * 2 - 1) * 0.3;
      const newValue = 98.7 + fluctuation;
      quantumCore.textContent = newValue.toFixed(1) + '%';
    }
  }, 2000);
}

// System Metrics
function startSystemMetrics() {
  setInterval(() => {
    if (!isSystemBreached && statusDisplay) {
      const metrics = ['STABLE', 'OPTIMAL', 'NOMINAL', 'SECURE'];
      statusDisplay.textContent = metrics[Math.floor(Math.random() * metrics.length)];
    }
  }, 5000);
}

// Neural Network Canvas
function initializeNeuralNetwork() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const nodes = [];
  
  // Create nodes
  for (let i = 0; i < 50; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 3 + 1
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update nodes
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      
      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      
      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 204, 0.6)';
      ctx.fill();
    });
    
    // Draw connections
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Resize handler
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Notification System
function showNotification(message, type = 'info') {
  const container = document.getElementById('notificationContainer');
  if (container) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.5s ease reverse';
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }
}

// Alarm Mode
function triggerAlarmMode() {
  let isRed = false;
  const alarmInterval = setInterval(() => {
    document.body.style.backgroundColor = isRed ? '#330000' : '#000000';
    isRed = !isRed;
  }, 500);
  
  // Stop alarm after 10 seconds
  setTimeout(() => {
    clearInterval(alarmInterval);
    document.body.style.backgroundColor = '';
  }, 10000);
}

// Theme Toggle
function toggleTheme() {
  const themes = ['matrix', 'cyber', 'neon'];
  const currentIndex = themes.indexOf(currentTheme);
  currentTheme = themes[(currentIndex + 1) % themes.length];
  
  document.body.className = `theme-${currentTheme}`;
  showNotification(`Theme changed to ${currentTheme.toUpperCase()}`, 'info');
}

// Language Toggle (completing the unfinished function)
function toggleLang() {
  currentLanguage = currentLanguage === 'EN' ? 'VN' : 'EN';
  showNotification(`Language switched to ${currentLanguage}`, 'info');
  
  const subtitle = document.querySelector('.subtitle');
  if (subtitle) {
    if (currentLanguage === 'VN') {
      subtitle.textContent = 'TRẠM TRUY CẬP LƯỢNG TỬ - BỘ PHẬN NGHIÊN CỨU PANDORA';
    } else {
      subtitle.textContent = 'QUANTUM ACCESS TERMINAL - Pandora Research Division';
    }
  }
  
  // Update command prompts and messages based on language
  updateLanguageElements();
}

// Update UI elements based on current language
function updateLanguageElements() {
  const langElements = {
    'EN': {
      prompt: '[ASGARD@QUANTUM]$',
      status: 'SYSTEM STATUS',
      access: 'ACCESS LEVELS',
      welcome: 'QUANTUM ACCESS TERMINAL v4.7.2'
    },
    'VN': {
      prompt: '[ASGARD@LƯỢNG-TỬ]$',
      status: 'TRẠNG THÁI HỆ THỐNG',
      access: 'CẤP ĐỘ TRUY CẬP',
      welcome: 'TRẠM TRUY CẬP LƯỢNG TỬ v4.7.2'
    }
  };
  
  // Update any existing language-dependent elements
  const statusTitle = document.querySelector('.status-title');
  if (statusTitle) {
    statusTitle.textContent = langElements[currentLanguage].status;
  }
  
  const accessTitle = document.querySelector('.access-title');
  if (accessTitle) {
    accessTitle.textContent = langElements[currentLanguage].access;
  }
}

// Additional utility functions that might be needed

// Handle window resize for responsive design
function handleResize() {
  const canvas = document.getElementById('neuralCanvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}

// Enhanced error handling for commands
function logSecurityEvent(event, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${level}: ${event}`;
  
  // Store in memory (since we can't use localStorage)
  if (!window.securityLog) {
    window.securityLog = [];
  }
  window.securityLog.push(logEntry);
  
  // Keep only last 100 entries
  if (window.securityLog.length > 100) {
    window.securityLog.shift();
  }
}

// Enhanced notification system with sound effects (visual representation)
function playSystemSound(type) {
  // Visual sound effect since we can't play actual audio
  const soundIndicator = document.createElement('div');
  soundIndicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 5px 10px;
    background: rgba(0, 255, 204, 0.2);
    border: 1px solid #00ffcc;
    border-radius: 5px;
    font-size: 12px;
    z-index: 1000;
    animation: fadeInOut 1s ease-in-out;
  `;
  
  const sounds = {
    'success': '♪ BEEP',
    'error': '♪ BUZZ',
    'alert': '♪ ALARM',
    'info': '♪ CHIRP'
  };
  
  soundIndicator.textContent = sounds[type] || sounds.info;
  document.body.appendChild(soundIndicator);
  
  setTimeout(() => soundIndicator.remove(), 1000);
}

// Enhanced command history with search
function searchCommandHistory(searchTerm) {
  if (!searchTerm) return commandHistory;
  
  return commandHistory.filter(cmd => 
    cmd.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

// System diagnostics command
function runDiagnostics() {
  addToOutput(`<span style="color: #00ffcc;">Running system diagnostics...</span>`);
  
  const diagnostics = [
    'Checking quantum coherence... ✓',
    'Validating neural pathways... ✓',
    'Testing security protocols... ✓',
    'Analyzing memory integrity... ✓',
    'Scanning for anomalies... ⚠️ 1 anomaly detected',
    'Verifying backup systems... ✓'
  ];
  
  let i = 0;
  const diagInterval = setInterval(() => {
    if (i < diagnostics.length) {
      const color = diagnostics[i].includes('⚠️') ? '#ffaa00' : '#00ff00';
      addToOutput(`<span style="color: ${color};">${diagnostics[i]}</span>`);
      i++;
      scrollToBottom();
    } else {
      clearInterval(diagInterval);
      addToOutput(`<div style="margin-top: 1rem; color: #00ffcc;">
        Diagnostics Complete<br>
        Overall Status: OPERATIONAL<br>
        Anomalies: 1 (Non-critical)
      </div>`);
    }
  }, 800);
}

// Add CSS animations that might be referenced
function addSystemStyles() {
  if (!document.querySelector('#system-styles')) {
    const style = document.createElement('style');
    style.id = 'system-styles';
    style.textContent = `
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateY(-10px); }
        50% { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      .notification {
        padding: 10px 15px;
        margin: 5px 0;
        border-radius: 5px;
        animation: slideIn 0.5s ease;
      }
      
      .notification.success {
        background: rgba(0, 255, 0, 0.2);
        border-left: 3px solid #00ff00;
      }
      
      .notification.error {
        background: rgba(255, 0, 0, 0.2);
        border-left: 3px solid #ff0000;
      }
      
      .notification.info {
        background: rgba(0, 255, 204, 0.2);
        border-left: 3px solid #00ffcc;
      }
      
      .alert-status {
        animation: pulse 1s infinite;
        color: #ff4444 !important;
      }
      
      .access-level {
        padding: 10px;
        margin: 5px 0;
        background: rgba(0, 0, 0, 0.6);
        border: 1px solid #333;
        border-left: 3px solid #00ffcc;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .access-level:hover {
        background: rgba(0, 255, 204, 0.1);
        border-left-color: #00ffff;
      }
      
      .level-title {
        font-weight: bold;
        color: #00ffcc;
        margin-bottom: 5px;
      }
      
      .level-access {
        font-size: 12px;
        line-height: 1.4;
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize additional features on load
function initializeEnhancedFeatures() {
  addSystemStyles();
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 'l':
          e.preventDefault();
          clearTerminal();
          break;
        case 'r':
          e.preventDefault();
          parseCommand('STATUS');
          break;
      }
    }
  });
  
  // Initialize enhanced command suggestions
  if (commandInput) {
    const commands = ['help', 'status', 'clear', 'access_level set', 'retrieve file', 'scan network', 'override protocol', 'records', 'matrix mode', 'shutdown'];
    
    // Simple command completion on Tab
    commandInput.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const input = e.target.value.toLowerCase();
        const match = commands.find(cmd => cmd.startsWith(input));
        if (match) {
          e.target.value = match;
        }
      }
    });
  }
}

// Call enhanced initialization
document.addEventListener('DOMContentLoaded', function() {
  // Original initialization
  initializeTerminal();
  generateAccessLevels();
  startBackgroundAnimations();
  startSystemMetrics();
  initializeNeuralNetwork();
  showBootSequence();
  
  // Enhanced features
  initializeEnhancedFeatures();
});

// Add resize listener
window.addEventListener('resize', handleResize);
