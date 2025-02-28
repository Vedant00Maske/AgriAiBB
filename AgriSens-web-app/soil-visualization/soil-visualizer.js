class SoilVisualizer {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.layers = {};
        this.setup();
        this.createLayers();
        this.setupLighting();
        this.setupControls();
        this.setupCropSuggestions(); // Add this line
        this.animate();
    }

    setup() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x1a1a1a);
        document.getElementById('soil3D').appendChild(this.renderer.domElement);
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    createLayers() {
        // Topsoil layer
        const topsoilGeometry = new THREE.BoxGeometry(4, 1, 4);
        const topsoilMaterial = new THREE.MeshPhongMaterial({
            color: 0x3E2723,
            transparent: true,
            opacity: 0.9
        });
        this.layers.topsoil = new THREE.Mesh(topsoilGeometry, topsoilMaterial);
        this.layers.topsoil.position.y = 1;
        this.scene.add(this.layers.topsoil);

        // Subsoil layer
        const subsoilGeometry = new THREE.BoxGeometry(4, 1.5, 4);
        const subsoilMaterial = new THREE.MeshPhongMaterial({
            color: 0x5D4037,
            transparent: true,
            opacity: 0.9
        });
        this.layers.subsoil = new THREE.Mesh(subsoilGeometry, subsoilMaterial);
        this.layers.subsoil.position.y = -0.25;
        this.scene.add(this.layers.subsoil);

        // Bedrock layer
        const bedrockGeometry = new THREE.BoxGeometry(4, 2, 4);
        const bedrockMaterial = new THREE.MeshPhongMaterial({
            color: 0x4E342E,
            transparent: true,
            opacity: 0.9
        });
        this.layers.bedrock = new THREE.Mesh(bedrockGeometry, bedrockMaterial);
        this.layers.bedrock.position.y = -2;
        this.scene.add(this.layers.bedrock);
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }

    setupControls() {
        // Moisture control
        document.querySelector('.moisture-slider').addEventListener('input', (e) => {
            const value = e.target.value / 100;
            this.layers.topsoil.material.opacity = 0.5 + value * 0.5;
            e.target.parentElement.querySelector('.value-display').textContent = `${e.target.value}%`;
        });

        // Organic matter control
        document.querySelector('.organic-slider').addEventListener('input', (e) => {
            const value = e.target.value / 100;
            this.layers.topsoil.material.color.setHSL(0.08, 0.5, value * 0.3);
            e.target.parentElement.querySelector('.value-display').textContent = `${e.target.value}%`;
        });

        // Clay content control
        document.querySelector('.clay-slider').addEventListener('input', (e) => {
            const value = e.target.value / 100;
            this.layers.subsoil.material.color.setHSL(0.08, 0.4, 0.2 + value * 0.2);
            e.target.parentElement.querySelector('.value-display').textContent = `${e.target.value}%`;
        });

        // Density control
        document.querySelector('.density-slider').addEventListener('input', (e) => {
            const value = e.target.value / 100;
            this.layers.bedrock.scale.y = 1 + value;
            e.target.parentElement.querySelector('.value-display').textContent = `${e.target.value}%`;
        });

        // Add rotation on mouse move
        let isMouseDown = false;
        let previousMousePosition = { x: 0, y: 0 };

        document.addEventListener('mousedown', () => isMouseDown = true);
        document.addEventListener('mouseup', () => isMouseDown = false);
        document.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                const deltaMove = {
                    x: e.clientX - previousMousePosition.x,
                    y: e.clientY - previousMousePosition.y
                };

                this.scene.rotation.y += deltaMove.x * 0.005;
                this.scene.rotation.x += deltaMove.y * 0.005;
            }
            previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
        });
    }

    setupCropSuggestions() {
        const crops = [
            {
                name: "Wheat",
                icon: "🌾",
                moistureRange: "30-70%",
                organicMatterRange: "20-40%",
                soilType: "Clay loam to sandy loam"
            },
            {
                name: "Corn",
                icon: "🌽",
                moistureRange: "50-80%",
                organicMatterRange: "25-45%",
                soilType: "Well-drained loam"
            },
            {
                name: "Tomatoes",
                icon: "🍅",
                moistureRange: "40-70%",
                organicMatterRange: "30-50%",
                soilType: "Rich loamy soil"
            },
            {
                name: "Potatoes",
                icon: "🥔",
                moistureRange: "45-65%",
                organicMatterRange: "35-55%",
                soilType: "Sandy loam"
            },
            {
                name: "Carrots",
                icon: "🥕",
                moistureRange: "35-60%",
                organicMatterRange: "20-40%",
                soilType: "Sandy soil"
            },
            {
                name: "Rice",
                icon: "🌾",
                moistureRange: "70-90%",
                organicMatterRange: "25-45%",
                soilType: "Clay soil"
            },
            {
                name: "Soybeans",
                icon: "🫘",
                moistureRange: "40-70%",
                organicMatterRange: "30-50%",
                soilType: "Loamy soil"
            },
            {
                name: "Cotton",
                icon: "🧶",
                moistureRange: "35-65%",
                organicMatterRange: "20-40%",
                soilType: "Sandy loam to clay"
            }
        ];
    
        const suggestButton = document.getElementById('suggestCrops');
        const suggestionsDiv = document.getElementById('cropSuggestions');
    
        suggestButton.addEventListener('click', () => {
            // Get current soil parameters
            const moisture = document.querySelector('.moisture-slider').value;
            const organicMatter = document.querySelector('.organic-slider').value;
            const clayContent = document.querySelector('.clay-slider').value;
    
            // Clear previous suggestions
            suggestionsDiv.innerHTML = '';
    
            // Randomly select 3 different crops
            const selectedCrops = [];
            while (selectedCrops.length < 3) {
                const randomCrop = crops[Math.floor(Math.random() * crops.length)];
                if (!selectedCrops.includes(randomCrop)) {
                    selectedCrops.push(randomCrop);
                }
            }
    
            // Display selected crops with current soil conditions
            selectedCrops.forEach(crop => {
                const cropElement = document.createElement('div');
                cropElement.className = 'crop-card';
                cropElement.innerHTML = `
                    <h4>${crop.icon} ${crop.name}</h4>
                    <p>Ideal Moisture: ${crop.moistureRange}</p>
                    <p>Ideal Organic Matter: ${crop.organicMatterRange}</p>
                    <p>Preferred Soil: ${crop.soilType}</p>
                    <p style="color: ${this.getConditionColor(moisture, parseInt(crop.moistureRange))};
                              font-weight: bold;">
                        Current Conditions: ${moisture}% moisture
                    </p>
                `;
                suggestionsDiv.appendChild(cropElement);
            });
        });
    }
    
    getConditionColor(current, ideal) {
        const [min, max] = ideal.split('-').map(x => parseInt(x));
        if (current >= min && current <= max) {
            return '#4CAF50'; // Green for optimal
        } else if (current < min - 20 || current > max + 20) {
            return '#f44336'; // Red for poor
        } else {
            return '#ff9800'; // Orange for suboptimal
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SoilVisualizer();
});