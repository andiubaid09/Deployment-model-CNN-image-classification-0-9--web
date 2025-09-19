const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Setup canvas
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.lineWidth = 15;
ctx.strokeStyle = '#000';

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events for mobile
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);
canvas.addEventListener('touchend', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                      e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('resultContainer').style.display = 'none';
}

async function predictDigit() {
    // Check if canvas is empty
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const isEmpty = !imageData.data.some(channel => channel !== 0);
    
    if (isEmpty) {
        alert('Silakan gambar angka terlebih dahulu!');
        return;
    }

    // Show loading
    document.getElementById('loadingDiv').style.display = 'flex';
    document.getElementById('resultContainer').style.display = 'none';

    try {
        // Convert canvas to base64
        const canvasData = canvas.toDataURL('image/png');
        
        // Send to backend
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: canvasData
            })
        });

        if (!response.ok) {
            throw new Error('Gagal melakukan prediksi');
        }

        const result = await response.json();
        
        // Display result
        document.getElementById('predictionResult').textContent = result.digit;
        document.getElementById('confidenceText').textContent = 
            `Model memprediksi angka ini adalah: ${result.digit} (confidence: ${(result.confidence * 100).toFixed(2)}%)`;
        document.getElementById('resultContainer').style.display = 'block';

    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat melakukan prediksi. Pastikan server backend berjalan.');
    } finally {
        // Hide loading
        document.getElementById('loadingDiv').style.display = 'none';
    }
}

// Initialize canvas with white background
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'black';