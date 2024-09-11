const canvas = document.getElementById('clockCanvas');
const ctx = canvas.getContext('2d');
const pencilButton = document.getElementById('pencilButton');
const clearButton = document.getElementById('clearButton');
const checkButton = document.getElementById('checkButton'); // New button for checking the time
const guideMessage = document.getElementById('guideMessage');
const timerDisplay = document.getElementById('timerDisplay');
const timezoneSelector = document.getElementById('timezoneSelector');
const currentTimeDisplay = document.getElementById('currentTimeDisplay');
const resultMessage = document.getElementById('resultMessage');

let isDrawing = false;
let x = 0;
let y = 0;
let timer = 0;
let guideInterval;
let drawingStarted = false;
let drawnLines = []; // To store drawn lines for hour and minute hands

// Draw the clock face
function drawClockFace() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(200, 200, 180, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw center
    ctx.beginPath();
    ctx.arc(200, 200, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Draw clock numbers
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let num = 1; num <= 12; num++) {
        const angle = (num * Math.PI) / 6;
        const x = 200 + Math.cos(angle - Math.PI / 2) * 150;
        const y = 200 + Math.sin(angle - Math.PI / 2) * 150;
        ctx.fillText(num.toString(), x, y);
    }
}

// Enable drawing with the pencil
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    drawingStarted = true;
    x = e.offsetX;
    y = e.offsetY;
    drawnLines.push({ startX: x, startY: y, endX: null, endY: null }); // Start recording a new line
    updateGuideMessage("Great! Now draw a line to show the hour or minute hand.");
    startGuideTimer();
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        draw(e.offsetX, e.offsetY);
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    x = 0;
    y = 0;
    // Update the end of the last drawn line
    if (drawnLines.length > 0) {
        drawnLines[drawnLines.length - 1].endX = x;
        drawnLines[drawnLines.length - 1].endY = y;
    }
    updateGuideMessage("Keep going! You're doing great. Try to match the current time.");
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});

function draw(newX, newY) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(newX, newY);
    ctx.stroke();
    x = newX;
    y = newY;
}

// Clear the canvas
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawClockFace();
    drawnLines = []; // Clear drawn lines
    updateGuideMessage("Let's start again! Draw the hour hand first.");
    resetGuideTimer();
});

// Function to update the guide's message
function updateGuideMessage(message) {
    guideMessage.textContent = message;
}

// Timer to provide real-time guidance
function startGuideTimer() {
    if (guideInterval) {
        clearInterval(guideInterval);
    }

    timer = 0; // Reset timer
    guideInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = `Time Spent: ${timer} seconds`;

        // Update guide based on time spent
        if (timer === 10) {
            updateGuideMessage("Remember to draw the hour hand first, pointing to the correct number.");
        } else if (timer === 20) {
            updateGuideMessage("Need some help? Start by drawing a short line for the hour hand and a longer one for the minute hand.");
        } else if (timer === 30) {
            updateGuideMessage("Don't worry, take your time! Make sure the hands point to the correct time.");
        } else if (timer === 45) {
            updateGuideMessage("It's okay to clear and try again if you feel stuck. Keep practicing!");
        }
    }, 1000);
}

// Reset timer when the game is restarted
function resetGuideTimer() {
    if (guideInterval) {
        clearInterval(guideInterval);
    }
    timer = 0;
    timerDisplay.textContent = "Time Spent: 0 seconds";
    drawingStarted = false;
}

// Real-time clock update
function updateCurrentTime() {
    const timeZone = timezoneSelector.value;
    const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: timeZone, hour12: false });
    currentTimeDisplay.textContent = `Current Time: ${currentTime}`;
}

// Time zone selector change
timezoneSelector.addEventListener('change', () => {
    updateCurrentTime();
    updateGuideMessage("Time zone changed! Draw the time shown above.");
});

// Check the drawn time against the real time
checkButton.addEventListener('click', () => {
    const timeZone = timezoneSelector.value;
    const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: timeZone, hour12: false });
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);

    // Check if drawn lines match the current time
    if (drawnLines.length < 2) {
        resultMessage.textContent = "Please draw both the hour and minute hands.";
        return;
    }

    const hourLine = drawnLines[0];
    const minuteLine = drawnLines[1];

    const hourAngle = Math.atan2(hourLine.endY - hourLine.startY, hourLine.endX - hourLine.startX);
    const minuteAngle = Math.atan2(minuteLine.endY - minuteLine.startY, minuteLine.endX - minuteLine.startX);

    const correctHourAngle = ((currentHour % 12) + currentMinute / 60) * (Math.PI / 6) - Math.PI / 2;
    const correctMinuteAngle = (currentMinute * (Math.PI / 30)) - Math.PI / 2;

    const hourDifference = Math.abs(correctHourAngle - hourAngle);
    const minuteDifference = Math.abs(correctMinuteAngle - minuteAngle);

    // Determine if the drawing is correct
    if (hourDifference < 0.2 && minuteDifference < 0.2) { // Small tolerance
        resultMessage.textContent = "Correct! You've drawn the time correctly.";
    } else {
        resultMessage.textContent = "Incorrect. Try again to match the current time.";
    }
});

// Initialize clock face and time display
drawClockFace();
updateCurrentTime();
setInterval(updateCurrentTime, 1000); // Update time every second
