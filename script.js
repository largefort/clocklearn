const canvas = document.getElementById('clockCanvas');
const ctx = canvas.getContext('2d');
const pencilButton = document.getElementById('pencilButton');
const clearButton = document.getElementById('clearButton');

let isDrawing = false;
let x = 0;
let y = 0;

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
    x = e.offsetX;
    y = e.offsetY;
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
});

// Initialize the clock face
drawClockFace();
