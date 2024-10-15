const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
let zones = [];
let image = new Image();

// Load the zones data from the JSON file
fetch('../backend/zones-data.json')
    .then(response => response.json())
    .then(data => {
        image.src = data.image;
        zones = data.zones;
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            redrawCanvas();
        };
    })
    .catch(error => console.error('Error loading zones data:', error));

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    zones.forEach(zone => drawZone(zone, 'rgba(255, 0, 0, 0.3)'));
}

function drawZone(zone, color) {
    ctx.fillStyle = color;
    ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
}

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

function showPopup(imageSrc) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `<img src="${imageSrc}" /><button onclick="closePopup(this)">Close</button>`;
    document.body.appendChild(popup);
    popup.style.display = 'block';
}

function closePopup(button) {
    const popup = button.parentElement;
    popup.remove();
}
