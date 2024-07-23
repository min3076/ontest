let selectedHand = null;
let isDragging = false;
let offsetAngle = 0;
const clock = document.getElementById('clock');
const hourHand = document.getElementById('hour-hand');
const minuteHand = document.getElementById('minute-hand');
const secondHand = document.getElementById('second-hand');

let hourRotation = 0;
let minuteRotation = 0;
let secondRotation = 0;

function setRotation(element, rotationDegree) {
    element.style.transform = `rotate(${rotationDegree}deg)`;
}

function calculateRotation(event, centerX, centerY) {
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    return angle + 90; // Adjusting for the initial 90 degree rotation
}

clock.addEventListener('mousedown', (event) => {
    if (event.target.classList.contains('hand')) {
        selectedHand = event.target;
        isDragging = true;

        const rect = clock.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const clickAngle = calculateRotation(event, centerX, centerY);
        const currentRotation = parseFloat(selectedHand.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
        offsetAngle = clickAngle - currentRotation;
    }
});

document.addEventListener('mousemove', (event) => {
    if (isDragging && selectedHand) {
        const rect = clock.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotationDegree = calculateRotation(event, centerX, centerY) - offsetAngle;
        setRotation(selectedHand, rotationDegree);

        if (selectedHand === hourHand) {
            hourRotation = rotationDegree;
        } else if (selectedHand === minuteHand) {
            minuteRotation = rotationDegree;
        } else if (selectedHand === secondHand) {
            secondRotation = rotationDegree;
        }
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    selectedHand = null;
});

function initializeClock() {
    const currentDate = new Date();
    const secondsRatio = currentDate.getSeconds() / 60;
    const minutesRatio = (secondsRatio + currentDate.getMinutes()) / 60;
    const hoursRatio = (minutesRatio + currentDate.getHours()) / 12;

    secondRotation = secondsRatio * 360;
    minuteRotation = minutesRatio * 360;
    hourRotation = hoursRatio * 360;

    setRotation(secondHand, secondRotation);
    setRotation(minuteHand, minuteRotation);
    setRotation(hourHand, hourRotation);
}

initializeClock();