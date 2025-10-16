// Color Module - Primary color theme switcher

let currentColor = localStorage.getItem('primaryColor') || 'blue';

export function initColor() {
    const colorToggle = document.getElementById('colorToggle');
    const colorDropdown = document.getElementById('colorDropdown');
    const colorOptions = document.querySelectorAll('.color-option');

    // Apply saved color
    setColor(currentColor);
    updateActiveColor();

    // Toggle dropdown
    if (colorToggle) {
        colorToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            colorDropdown.classList.toggle('active');
        });
    }

    // Select color from dropdown
    colorOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedColor = option.getAttribute('data-color');
            if (selectedColor !== currentColor) {
                currentColor = selectedColor;
                setColor(currentColor);
                localStorage.setItem('primaryColor', currentColor);
                updateActiveColor();
            }
            colorDropdown.classList.remove('active');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (colorToggle && colorDropdown &&
            !colorToggle.contains(e.target) &&
            !colorDropdown.contains(e.target)) {
            colorDropdown.classList.remove('active');
        }
    });
}

function setColor(color) {
    document.documentElement.setAttribute('data-color', color);

    // Update color indicator in button
    const indicator = document.querySelector('.color-indicator');
    if (indicator) {
        indicator.setAttribute('data-color', color);
    }
}

function updateActiveColor() {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        const color = option.getAttribute('data-color');
        if (color === currentColor) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

export function getCurrentColor() {
    return currentColor;
}
