const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const saveZonesButton = document.getElementById('saveZones');

let zones = [];
let currentZone = null;
let image = new Image();
let uploadedImageData = "";  // Store base64 string of uploaded image

// Handle image upload
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        uploadedImageData = event.target.result;  // Store base64 data
        image.src = uploadedImageData;
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
        };
    };
    reader.readAsDataURL(file);
});

// Create zones by dragging
canvas.addEventListener('mousedown', (e) => {
    const { offsetX, offsetY } = e;
    currentZone = { x: offsetX, y: offsetY, width: 0, height: 0, popupImage: "" };
});

canvas.addEventListener('mousemove', (e) => {
    if (currentZone) {
        const { offsetX, offsetY } = e;
        currentZone.width = offsetX - currentZone.x;
        currentZone.height = offsetY - currentZone.y;
        redrawCanvas();
        drawZone(currentZone, 'rgba(0, 0, 255, 0.3)');
    }
});

canvas.addEventListener('mouseup', () => {
    if (currentZone) {
        const popupImage = prompt('Enter popup image URL for this zone:');
        if (popupImage) {
            currentZone.popupImage = popupImage;
            zones.push(currentZone);
        }
        currentZone = null;
    }
});

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    zones.forEach(zone => drawZone(zone, 'rgba(255, 0, 0, 0.3)'));
}

function drawZone(zone, color) {
    ctx.fillStyle = color;
    ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
}

// Save zones and image data to JSON
saveZonesButton.addEventListener('click', () => {
    const data = {
        image: uploadedImageData,  // Save base64 string
        zones: zones
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'zones-data.json';
    a.click();
    URL.revokeObjectURL(url);
});
