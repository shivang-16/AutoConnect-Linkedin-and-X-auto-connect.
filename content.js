// Create and inject the side panel
const panel = document.createElement('div');
panel.id = 'linkedin-automation-panel';
panel.style.cssText = `
    position: fixed;
    top: 45%;
    right: 20px;
    transform: translateY(-50%);
    width: 300px;
    height: 75vh;
    background: #1a1a1a;
    color: #ffffff;
    padding: 20px;
    box-shadow: -2px 0 5px rgba(0,0,0,0.2);
    z-index: 9999;
    font-family: Arial, sans-serif;
    border-radius: 8px;
    overflow-y: auto;
    display: none;
`;

// Create header with close button
const header = document.createElement('div');
header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
`;

const title = document.createElement('h2');
title.textContent = 'AutoConnect';
title.style.cssText = `
    color: #00a0dc;
    margin: 0;
`;

const closeButton = document.createElement('button');
closeButton.innerHTML = '✕';
closeButton.style.cssText = `
    background: none;
    border: none;
    color: #ffffff;
    font-size: 20px;
    cursor: pointer;
    padding: 5px;
    line-height: 1;
    transition: color 0.3s;
`;
closeButton.onmouseover = () => closeButton.style.color = '#00a0dc';
closeButton.onmouseout = () => closeButton.style.color = '#ffffff';

header.appendChild(title);
header.appendChild(closeButton);
panel.appendChild(header);

// Create stats section
const stats = document.createElement('div');
stats.style.cssText = `
    background: #242424;
    padding: 15px;
    border-radius: 8px;
    margin: 15px 0;
`;
stats.innerHTML = `
    <div id="total-invites" style="margin-bottom: 10px;">Total Invites Sent: 0</div>
    <div id="automation-status">Status: Ready</div>
`;
panel.appendChild(stats);

// Create settings section
const settings = document.createElement('div');
settings.style.cssText = `
    background: #242424;
    padding: 15px;
    border-radius: 8px;
    margin: 15px 0;
`;

// Delay settings
const delaySettings = document.createElement('div');
delaySettings.style.cssText = 'margin-bottom: 15px;';
delaySettings.innerHTML = `
    <div style="margin-bottom: 10px; font-weight: bold;">Action Delay (ms)</div>
    <div style="margin-bottom: 10px;">
        <input type="number" id="action-delay" placeholder="Action Delay" value="1000" min="100" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #666; background: #333; color: white;">
    </div>
`;

// Note settings with enhanced styling
const noteSettings = document.createElement('div');
noteSettings.innerHTML = `
    <div style="margin-bottom: 15px;">
        <label style="display: flex; align-items: center; cursor: pointer; background: #2d2d2d; padding: 10px; border-radius: 6px; transition: background 0.3s;">
            <input type="checkbox" id="send-note" style="margin-right: 12px; width: 18px; height: 18px; accent-color: #00a0dc;">
            <span style="font-size: 15px; font-weight: 500;">Send with note</span>
        </label>
    </div>
    <div id="note-input-container" style="display: none;">
        <textarea id="custom-note" placeholder="Enter your custom note. Use {{name}} for recipient's name" 
            style="width: 100%; height: 80px; margin-top: 10px; padding: 12px; border-radius: 6px; border: 2px solid #444; background: #333; color: white; resize: vertical; font-size: 14px; transition: border-color 0.3s;"
        >Hi {{name}}, I'd like to join your professional network.</textarea>
    </div>
`;

settings.appendChild(delaySettings);
settings.appendChild(noteSettings);
panel.appendChild(settings);

// Create logs section
const logs = document.createElement('div');
logs.id = 'log-content';
logs.style.cssText = `
    height: 200px;
    overflow-y: auto;
    margin: 20px 0;
    padding: 10px;
    background: #242424;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.4;
`;
panel.appendChild(logs);

// Create floating controls
const controls = document.createElement('div');
controls.style.cssText = `
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 10px;
    padding: 15px;
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(5px);
    border-radius: 8px;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
    margin: 0 -10px -10px -10px;
`;

const startButton = document.createElement('button');
startButton.textContent = 'Start';
startButton.style.cssText = `
    flex: 1;
    padding: 12px 20px;
    background: #00a0dc;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    font-size: 15px;
    transition: all 0.3s;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`;
startButton.onmouseover = () => {
    startButton.style.background = '#008cc9';
    startButton.style.transform = 'translateY(-2px)';
    startButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
};
startButton.onmouseout = () => {
    startButton.style.background = '#00a0dc';
    startButton.style.transform = 'translateY(0)';
    startButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
};

const stopButton = document.createElement('button');
stopButton.textContent = 'Stop';
stopButton.style.cssText = `
    flex: 1;
    padding: 12px 20px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    font-size: 15px;
    transition: all 0.3s;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`;
stopButton.onmouseover = () => {
    stopButton.style.background = '#c82333';
    stopButton.style.transform = 'translateY(-2px)';
    stopButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
};
stopButton.onmouseout = () => {
    stopButton.style.background = '#dc3545';
    stopButton.style.transform = 'translateY(0)';
    stopButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
};

controls.appendChild(startButton);
controls.appendChild(stopButton);
panel.appendChild(controls);

// Create collapsed button
const collapsedButton = document.createElement('button');
collapsedButton.id = 'linkedin-automation-collapsed';
collapsedButton.innerHTML = '⚡';
collapsedButton.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: #00a0dc;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: grab;
    font-size: 24px;
    box-shadow: -2px 0 5px rgba(0,0,0,0.2);
    z-index: 9999;
    display: none;
    transition: transform 0.2s ease, background 0.3s ease;
`;
collapsedButton.onmouseover = () => collapsedButton.style.background = '#008cc9';
collapsedButton.onmouseout = () => collapsedButton.style.background = '#00a0dc';

// Create button to open the panel when not on the search results page
const openPanelButton = document.createElement('button');
openPanelButton.textContent = '⚡';
openPanelButton.style.cssText = `
  position: fixed;
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: #00a0dc;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: grab;
    font-size: 24px;
    box-shadow: -2px 0 5px rgba(0,0,0,0.2);
    z-index: 9999;
    transition: transform 0.2s ease, background 0.3s ease;
`;
openPanelButton.onmouseover = () => openPanelButton.style.background = '#008cc9';
openPanelButton.onmouseout = () => openPanelButton.style.background = '#00a0dc';
openPanelButton.onclick = () => {
    panel.style.display = 'block';
    openPanelButton.style.display = 'none';
};

// Add the button to the page
if (!window.location.href.includes('linkedin.com/search/results/people/')) {
    document.body.appendChild(openPanelButton);
}

// Add to page
document.body.appendChild(panel);
document.body.appendChild(collapsedButton);

console.log(window.location.href, 'here is loclation');
// Check if the current URL matches the LinkedIn search results pattern
if (window.location.href.includes('linkedin.com/search/results/people/')) {
    console.log('Current URL matches LinkedIn search results pattern');
    document.getElementById('linkedin-automation-panel').style.display = 'block'; // Show the panel
    document.getElementById('linkedin-automation-collapsed').style.display = 'none'; // Hide the collapsed button
} else {
    // Show message to visit the correct URL
    const panelContent = document.getElementById('linkedin-automation-panel');
    panelContent.innerHTML = '<div style="text-align: center; display: flex; justify-content: center; align-items: center; height: 100%; color: #ffffff; margin-top: 0;"><div>Please visit the following link to start the script:<br><button id="visit-link-button" style="margin-top: 10px; padding: 10px 20px; background: #00a0dc; color: white; border: none; border-radius: 5px; cursor: pointer;">Go to People Search</button></div></div>';

    // Add event listener to button
    const visitButton = document.getElementById('visit-link-button');
    visitButton.onclick = () => {
        window.open('https://www.linkedin.com/search/results/people/');
    };
}

// Dragging functionality
function makeDraggable(element) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const dragStart = (e) => {
        if (e.type === "mousedown") {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
            element.style.cursor = 'grabbing';
        }
    };

    const dragEnd = () => {
        isDragging = false;
        element.style.cursor = 'grab';
    };

    const drag = (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;

            // Get viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const elementRect = element.getBoundingClientRect();

            // Calculate bounds
            const maxX = viewportWidth - elementRect.width;
            const maxY = viewportHeight - elementRect.height;

            // Constrain to viewport
            currentX = Math.min(Math.max(0, currentX), maxX);
            currentY = Math.min(Math.max(0, currentY), maxY);

            element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    };

    element.addEventListener('mousedown', dragStart, false);
    document.addEventListener('mousemove', drag, false);
    document.addEventListener('mouseup', dragEnd, false);
}

// Make only collapsed button draggable
makeDraggable(collapsedButton);

// Toggle panel function
function togglePanel() {
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        collapsedButton.style.display = 'none';
    } else {
        panel.style.display = 'none';
        collapsedButton.style.display = 'block';
    }
}

// Add click handlers for collapse/expand
closeButton.addEventListener('click', togglePanel);
collapsedButton.addEventListener('click', togglePanel);

// Functions to update UI
function clearLogs() {
    const logContent = document.getElementById('log-content');
    logContent.innerHTML = '';
}

function addLog(message) {
    const logContent = document.getElementById('log-content');
    const logEntry = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString();
    
    // Style based on message type
    let color = '#ffffff';
    let icon = '';
    if (message.includes('✅') || message.includes('🎉')) {
        color = '#4caf50';  // Success green
    } else if (message.includes('⚠️') || message.includes('🛑')) {
        color = '#ff9800';  // Warning orange
    } else if (message.includes('❌')) {
        color = '#f44336';  // Error red
    }

    logEntry.style.cssText = `
        padding: 8px 12px;
        margin-bottom: 8px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        font-size: 13px;
        line-height: 1.4;
        color: ${color};
        transition: background 0.3s;
    `;
    logEntry.onmouseover = () => logEntry.style.background = 'rgba(255, 255, 255, 0.1)';
    logEntry.onmouseout = () => logEntry.style.background = 'rgba(255, 255, 255, 0.05)';
    
    logEntry.textContent = `${message}`;
    logContent.appendChild(logEntry);
    logContent.scrollTop = logContent.scrollHeight;
}

function updateStats(totalInvites) {
    document.getElementById('total-invites').textContent = `Total Invites Sent: ${totalInvites}`;
}

function updateStatus(status) {
    const statusElement = document.getElementById('automation-status');
    statusElement.textContent = `Status: ${status}`;
    statusElement.style.color = status === 'Running' ? '#4caf50' : '#dc3545';
}

// Event listeners
startButton.addEventListener('click', () => {
    clearLogs();
    const config = {
        scrollDelay: 500,
        actionDelay: parseInt(document.getElementById('action-delay').value),
        nextPageDelay: 1000,
        sendNote: document.getElementById('send-note').checked,
        note: document.getElementById('custom-note').value
    };
    window.postMessage({ command: 'start', config }, '*');
    updateStatus('Running');
    addLog('🚀 Starting automation...');
});

stopButton.addEventListener('click', () => {
    window.postMessage({ command: 'stop' }, '*');
    updateStatus('Stopped');
    const totalInvites = document.getElementById('total-invites').textContent;
    clearLogs();
    addLog('🛑 Automation stopped');
    addLog(`📊 ${totalInvites}`);
});

// Add note checkbox handler
document.getElementById('send-note').addEventListener('change', (e) => {
    document.getElementById('note-input-container').style.display = e.target.checked ? 'block' : 'none';
});

// Listen for messages
window.addEventListener('message', function(event) {
    if (event.source !== window) return;
    // console.log('Received message:', event.data);

    if (event.data.type === 'log') {
        addLog(event.data.text);
    } else if (event.data.type === 'stats') {
        updateStats(event.data.totalInvites);
    } else if (event.data.type === 'status') {
        updateStatus(event.data.text);
    }
});
