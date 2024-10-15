const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const resetZones = document.getElementById('resetZones');

let zones = [];
let currentZone = null;
let image = new Image();

// Handle image upload and draw on canvas
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
        image.src = event.target.result;
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
        };
    };
    reader.readAsDataURL(file);
});

// Mouse event listeners for zone creation
canvas.addEventListener('mousedown', (e) => {
    const { offsetX, offsetY } = e;
    currentZone = { x: offsetX, y: offsetY, width: 0, height: 0 };
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
        const popupImage = prompt('Enter image URL for this zone:');
        if (popupImage) {
            zones.push({ ...currentZone, popupImage });
        }
        currentZone = null;
    }
});

// Redraw the canvas with all zones
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    zones.forEach(zone => drawZone(zone, 'rgba(255, 0, 0, 0.3)'));
}

// Draw a zone on the canvas
function drawZone(zone, color) {
    ctx.fillStyle = color;
    ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
}

// Handle clicking on zones to show popup
canvas.addEventListener('click', (e) => {
    const { offsetX, offsetY } = e;
    const clickedZone = zones.find(zone =>
        offsetX >= zone.x && offsetX <= zone.x + zone.width &&
        offsetY >= zone.y && offsetY <= zone.y + zone.height
    );

    if (clickedZone) {
        showPopup(clickedZone.popupImage);
    }
});

// Show popup with the selected image
function showPopup(imageSrc) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `<img src="${imageSrc}" /><button onclick="closePopup(this)">Close</button>`;
    document.body.appendChild(popup);
    popup.style.display = 'block';
}

// Close the popup
function closePopup(button) {
    const popup = button.parentElement;
    popup.remove();
}

// Reset all zones
resetZones.addEventListener('click', () => {
    zones = [];
    redrawCanvas();
});
