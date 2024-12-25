const box = document.getElementById('box');
const rotationRange = document.getElementById('rotationRange');
const moveCheckbox = document.getElementById('move');
const scoreDisplay = document.getElementById('score');
const cars = document.getElementById("container").children;
let hiddencar = null;
let score = 0;

// Function to randomly hide a car and set the target
function removeCar() {
    if (hiddencar) {
        hiddencar.innerHTML = '<img src="images/carpng.png" alt="1">';
        hiddencar.style.boxShadow = "0px 0px 0px";
    }
    const position = Math.floor(Math.random() * 10) + 1;
    hiddencar = document.getElementById(`car${position}`);
    hiddencar.innerHTML = `<img src="https://th.bing.com/th/id/R.9e0f40a2190806747addd2971b639347?rik=6ZQV%2f20yd%2b20pA&riu=http%3a%2f%2fwww.pixelstalk.net%2fwp-content%2fuploads%2f2016%2f05%2fFantastic-HD-Black-Wallpapers.jpg&ehk=ieL0e5%2fH5LxQzuaX9QjOqNcueGl4CaXLDUx9YfKL3Ws%3d&risl=&pid=ImgRaw&r=0" alt="Hidden Car">`;
    hiddencar.style.boxShadow = "0px 0px 40px rgb(255, 0, 0)";
}

removeCar();

let rotationDegree = 0;
let boxPosition = { top: window.innerHeight / 2, left: window.innerWidth / 2 };
let moveInterval;

// Rotate the box left or right
rotationRange.addEventListener('input', () => {
    rotationDegree = parseInt(rotationRange.value);
    updateBox();
});

function updateBox() {
    box.style.transform = `translate(-50%, -50%) rotate(${rotationDegree}deg)`;
    box.style.top = `${boxPosition.top}px`;
    box.style.left = `${boxPosition.left}px`;
}

function moveBox() {
    const radian = (rotationDegree * Math.PI) / 180;
    const speed = 5; // Movement speed
    boxPosition.left += Math.sin(radian) * speed;
    boxPosition.top -= Math.cos(radian) * speed;
    updateBox();
    if (checkCollision()) {
        clearInterval(moveInterval); // Stop the movement when a collision is detected
        // Optionally show an alert
    }
}

moveCheckbox.addEventListener('change', (event) => {
    if (event.target.checked) {
        moveInterval = setInterval(() => {
            moveBox();
        }, 70);
    } else {
        clearInterval(moveInterval);
    }
});

function checkCollision() {
    const boxRect = box.getBoundingClientRect();

    // Check if the box goes outside the viewport
    if (
        boxRect.top < 0 || boxRect.left < 0 ||
        boxRect.bottom > window.innerHeight ||
        boxRect.right > window.innerWidth
    ) {
        alert('Game Over: Box went out of bounds!');
        resetGame();
    }

    // Check collision with cars
    for (const car of cars) {
        const carRect = car.getBoundingClientRect();

        // Skip hidden car
        if (car === hiddencar) continue;

        // Calculate the center of the box
        const boxCenterX = boxRect.left + boxRect.width / 2;
        const boxCenterY = boxRect.top + boxRect.height / 2;

        // Calculate the center of the car
        const carCenterX = carRect.left + carRect.width / 2;
        const carCenterY = carRect.top + carRect.height / 2;

        // Check if the center of the box is near the center of the car
        const centerThreshold = 50; // Allowable threshold for the center distance

        if (
            Math.abs(boxCenterX - carCenterX) < centerThreshold &&
            Math.abs(boxCenterY - carCenterY) < centerThreshold
        ) {
            // Optionally refresh or reset when the box reaches the car center
            resetGame(); // or you can add your custom refresh logic
        }
    }

    // Check if parked successfully in the hidden car
    const hiddenCarRect = hiddencar.getBoundingClientRect();
    if (
        boxRect.left >= hiddenCarRect.left &&
        boxRect.right <= hiddenCarRect.right &&
        boxRect.top >= hiddenCarRect.top &&
        boxRect.bottom <= hiddenCarRect.bottom
    ) {
        boxPosition = { top: window.innerHeight / 2, left: window.innerWidth / 2 };
        moveCheckbox.checked = false; // Uncheck the move checkbox
        clearInterval(moveInterval); // Stop the movement
        rotationDegree = 0; // Reset rotation
        updateBox();
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        alert(`Successfully parked the car !  Score:${score}`);
        removeCar();
    }
}

function resetGame() {
    clearInterval(moveInterval);
    location.reload();
}
