const cropData = {
    spring: [
        { name: 'Wheat', icon: '🌾', plantingTime: 'Early Spring', harvestTime: '90-120 days' },
        { name: 'Corn', icon: '🌽', plantingTime: 'Mid Spring', harvestTime: '60-100 days' }
    ],
    summer: [
        { name: 'Tomatoes', icon: '🍅', plantingTime: 'Late Spring', harvestTime: '60-80 days' },
        { name: 'Peppers', icon: '🫑', plantingTime: 'Early Summer', harvestTime: '70-90 days' }
    ],
    autumn: [
        { name: 'Pumpkins', icon: '🎃', plantingTime: 'Late Summer', harvestTime: '90-120 days' },
        { name: 'Soybeans', icon: '🫘', plantingTime: 'Mid Summer', harvestTime: '100-120 days' }
    ],
    winter: [
        { name: 'Winter Wheat', icon: '🌾', plantingTime: 'Late Autumn', harvestTime: '180-240 days' },
        { name: 'Garlic', icon: '🧄', plantingTime: 'Early Winter', harvestTime: '240-270 days' }
    ]
};

class CropCalendar {
    constructor() {
        this.wheel = document.querySelector('.season-wheel');
        this.cropList = document.querySelector('.crop-list');
        this.currentRotation = 0;
        this.isRotating = false;
        this.setupWheel();
        this.setupCropIndicators();
        this.setupSeasonButtons();
    }

    setupWheel() {
        this.wheel.addEventListener('click', (e) => {
            if (this.isRotating) return;
            
            const rect = this.wheel.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const x = e.clientX - centerX;
            const y = e.clientY - centerY;
            const clickAngle = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
            this.rotateToAngle(clickAngle);
        });
    }

    setupSeasonButtons() {
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        seasons.forEach((season, index) => {
            const angle = index * 90;
            const button = document.querySelector(`.season.${season}`);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.rotateToSeason(season);
                });
            }
        });
    }

    rotateToSeason(season) {
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        const index = seasons.indexOf(season);
        if (index !== -1) {
            const angle = index * 90;
            this.rotateToAngle(angle);
        }
    }

    rotateToAngle(angle) {
        if (this.isRotating) return;
        this.isRotating = true;

        // Calculate the target rotation
        const normalizedAngle = Math.round(angle / 90) * 90;
        const currentRotation = this.currentRotation % 360;
        let targetRotation = -normalizedAngle;

        // Ensure we rotate in the shortest direction
        const diff = (targetRotation - currentRotation + 540) % 360 - 180;
        targetRotation = currentRotation + diff;

        // Apply the rotation with animation
        this.wheel.style.transition = 'transform 0.5s ease-out';
        this.wheel.style.transform = `rotate(${targetRotation}deg)`;

        // Update season information
        const seasonIndex = (Math.round(-targetRotation / 90) + 4) % 4;
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        this.showSeasonCrops(seasons[seasonIndex]);

        // Reset rotation state after animation
        setTimeout(() => {
            this.isRotating = false;
            this.currentRotation = targetRotation;
            this.wheel.style.transition = '';
        }, 500);
    }

    setupCropIndicators() {
        const indicators = document.querySelector('.crop-indicators');
        indicators.innerHTML = ''; // Clear existing indicators

        Object.entries(cropData).forEach(([season, crops], index) => {
            crops.forEach((crop, cropIndex) => {
                const dot = document.createElement('div');
                dot.className = 'crop-dot';
                
                // Calculate position on the wheel
                const baseAngle = index * 90;
                const spacing = 20;
                const angle = baseAngle + (cropIndex * spacing) - (crops.length - 1) * spacing / 2;
                const radius = 160;
                const x = radius * Math.cos((angle - 45) * Math.PI / 180);
                const y = radius * Math.sin((angle - 45) * Math.PI / 180);
                
                dot.style.left = `${x + 200}px`;
                dot.style.top = `${y + 200}px`;
                dot.setAttribute('data-crop', JSON.stringify(crop));
                dot.setAttribute('data-season', season);

                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showCropDetails(crop);
                });

                indicators.appendChild(dot);
            });
        });
    }

    showSeasonCrops(season) {
        this.cropList.innerHTML = '';
        const seasonTitle = document.createElement('h3');
        seasonTitle.className = 'season-title';
        seasonTitle.textContent = season.charAt(0).toUpperCase() + season.slice(1) + ' Crops';
        this.cropList.appendChild(seasonTitle);

        cropData[season].forEach(crop => {
            const item = document.createElement('div');
            item.className = 'crop-item';
            item.innerHTML = `
                <span class="crop-icon">${crop.icon}</span>
                <div class="crop-info">
                    <h3>${crop.name}</h3>
                    <p>Plant: ${crop.plantingTime}</p>
                    <p>Harvest: ${crop.harvestTime}</p>
                </div>
            `;
            this.cropList.appendChild(item);
        });
    }

    showCropDetails(crop) {
        const modal = document.createElement('div');
        modal.className = 'crop-modal';
        modal.innerHTML = `
            <div class="crop-modal-content">
                <span class="close-modal">&times;</span>
                <h2>${crop.icon} ${crop.name}</h2>
                <div class="crop-details">
                    <p><strong>Planting Time:</strong> ${crop.plantingTime}</p>
                    <p><strong>Harvest Time:</strong> ${crop.harvestTime}</p>
                    <div class="growing-tips">
                        <h3>Growing Tips</h3>
                        <ul>
                            <li>Soil pH: 6.0-7.0</li>
                            <li>Sunlight: Full sun</li>
                            <li>Watering: Regular</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => modal.remove();

        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }
}

// Initialize the calendar when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CropCalendar();
});