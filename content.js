// Create and inject the side panel
const panel = document.createElement('div');
panel.id = 'linkedin-automation-panel';
panel.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100vh;
    background: #1a1a1a;
    color: #ffffff;
    padding: 20px;
    box-shadow: -2px 0 5px rgba(0,0,0,0.2);
    z-index: 9999;
    font-family: Arial, sans-serif;
`;

// Create header
const header = document.createElement('div');
header.innerHTML = '<h2 style="color: #00a0dc;">LinkedIn Automation</h2>';
panel.appendChild(header);

// Create stats section
const stats = document.createElement('div');
stats.innerHTML = `
    <div id="total-invites">Total Invites Sent: 0</div>
    <div id="automation-status">Status: Ready</div>
`;
panel.appendChild(stats);

// Create logs section
const logs = document.createElement('div');
logs.id = 'log-content';
logs.style.cssText = `
    height: 60vh;
    overflow-y: auto;
    margin: 20px 0;
    padding: 10px;
    background: #242424;
    border-radius: 8px;
`;
panel.appendChild(logs);

// Create buttons
const startButton = document.createElement('button');
startButton.textContent = 'Start';
startButton.style.cssText = `
    padding: 10px 20px;
    background: #00a0dc;
    color: white;
    border: none;
    border-radius: 4px;
    margin-right: 10px;
    cursor: pointer;
`;

const stopButton = document.createElement('button');
stopButton.textContent = 'Stop';
stopButton.style.cssText = `
    padding: 10px 20px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

const controls = document.createElement('div');
controls.appendChild(startButton);
controls.appendChild(stopButton);
panel.appendChild(controls);

// Add to page
document.body.appendChild(panel);

// Functions to update UI
function addLog(message) {
    const logContent = document.getElementById('log-content');
    const logEntry = document.createElement('div');
    logEntry.style.cssText = 'padding: 5px 0; border-bottom: 1px solid #333;';
    logEntry.textContent = message;
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
});

stopButton.addEventListener('click', () => {
    window.postMessage({ command: 'stop' }, '*');
    updateStatus('Stopped');
});

// Listen for messages
window.addEventListener('message', function(event) {
    if (event.source !== window) return;

    if (event.data.type === 'log') {
        addLog(event.data.text);
    } else if (event.data.type === 'stats') {
        updateStats(event.data.totalInvites);
    } else if (event.data.type === 'status') {
        updateStatus(event.data.text);
    }
});

// Initialize when the page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {});
} else {
    // No initialization needed
}

// Listen for messages from the automation scripts
window.addEventListener('message', function(event) {
    // Only accept messages from the same window
    if (event.source !== window) return;

    if (event.data.type) {
        // No action needed
    }
});
