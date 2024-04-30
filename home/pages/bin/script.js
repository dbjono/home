const circleContainer = document.getElementById('circle-container');
const buttonCount = 8; // Number of buttons
const radius = 120; // Radius of the circle

for (let i = 0; i < buttonCount; i++) {
    const angle = (Math.PI * 2 * i) / buttonCount;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    const button = document.createElement('button');
    button.className = 'circle-button';
    button.style.transform = `translate(${x}px, ${y}px)`;
    button.addEventListener('click', () => {
        alert(`Button ${i + 1} clicked!`);
    });

    circleContainer.appendChild(button);
}
