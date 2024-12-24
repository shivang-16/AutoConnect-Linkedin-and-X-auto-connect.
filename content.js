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
title.textContent = 'Connectify';
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

// Create logs section
const logs = document.createElement('div');
logs.id = 'log-content';
logs.style.cssText = `
    height: calc(75vh - 250px);
    overflow-y: auto;
    margin: 20px 0;
    padding: 10px;
    background: #242424;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.4;
`;
panel.appendChild(logs);

// Create buttons
const controls = document.createElement('div');
controls.style.cssText = `
    display: flex;
    gap: 10px;
    margin-top: 15px;
`;

const startButton = document.createElement('button');
startButton.textContent = 'Start';
startButton.style.cssText = `
    flex: 1;
    padding: 10px 20px;
    background: #00a0dc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s;
`;
startButton.onmouseover = () => startButton.style.background = '#008cc9';
startButton.onmouseout = () => startButton.style.background = '#00a0dc';

const stopButton = document.createElement('button');
stopButton.textContent = 'Stop';
stopButton.style.cssText = `
    flex: 1;
    padding: 10px 20px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s;
`;
stopButton.onmouseover = () => stopButton.style.background = '#c82333';
stopButton.onmouseout = () => stopButton.style.background = '#dc3545';

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

// Add to page
document.body.appendChild(panel);
document.body.appendChild(collapsedButton);

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
function addLog(message) {
    const logContent = document.getElementById('log-content');
    const logEntry = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString();
    logEntry.style.cssText = 'padding: 8px 0; border-bottom: 1px solid #333;';
    logEntry.textContent = `[${timestamp}] ${message}`;
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
    window.postMessage({ command: 'start' }, '*');
    updateStatus('Running');
    addLog('Starting automation...');
});

stopButton.addEventListener('click', () => {
    window.postMessage({ command: 'stop' }, '*');
    updateStatus('Stopped');
    addLog('Stopping automation...');
});

// Listen for messages
window.addEventListener('message', function(event) {
    if (event.source !== window) return;
    console.log('Received message:', event.data);

    if (event.data.type === 'log') {
        addLog(event.data.text);
    } else if (event.data.type === 'stats') {
        updateStats(event.data.totalInvites);
    } else if (event.data.type === 'status') {
        updateStatus(event.data.text);
    }
});
