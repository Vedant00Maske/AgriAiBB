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
        this.setupCropSuggestions();
        this.setupRandomCropGenerator(); // Add this line
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
            },
            // Additional crops
            {
                name: "Lettuce",
                icon: "🥬",
                moistureRange: "45-75%",
                organicMatterRange: "25-45%",
                soilType: "Rich loamy soil"
            },
            {
                name: "Bell Peppers",
                icon: "🫑",
                moistureRange: "50-70%",
                organicMatterRange: "30-50%",
                soilType: "Well-drained loam"
            },
            {
                name: "Onions",
                icon: "🧅",
                moistureRange: "35-60%",
                organicMatterRange: "20-40%",
                soilType: "Sandy loam"
            },
            {
                name: "Garlic",
                icon: "🧄",
                moistureRange: "30-55%",
                organicMatterRange: "25-45%",
                soilType: "Well-drained loam"
            },
            {
                name: "Sweet Potato",
                icon: "🍠",
                moistureRange: "40-65%",
                organicMatterRange: "30-50%",
                soilType: "Sandy loam"
            },
            {
                name: "Pumpkin",
                icon: "🎃",
                moistureRange: "45-75%",
                organicMatterRange: "35-55%",
                soilType: "Rich loamy soil"
            },
            {
                name: "Cabbage",
                icon: "🥬",
                moistureRange: "40-70%",
                organicMatterRange: "30-50%",
                soilType: "Well-drained loam"
            },
            {
                name: "Broccoli",
                icon: "🥦",
                moistureRange: "45-75%",
                organicMatterRange: "35-55%",
                soilType: "Fertile loam"
            },
            {
                name: "Cucumber",
                icon: "🥒",
                moistureRange: "50-80%",
                organicMatterRange: "30-50%",
                soilType: "Well-drained loam"
            },
            {
                name: "Eggplant",
                icon: "🍆",
                moistureRange: "45-70%",
                organicMatterRange: "30-50%",
                soilType: "Sandy loam"
            },
            {
                name: "Strawberry",
                icon: "🍓",
                moistureRange: "40-70%",
                organicMatterRange: "35-55%",
                soilType: "Sandy loam"
            },
            {
                name: "Watermelon",
                icon: "🍉",
                moistureRange: "45-75%",
                organicMatterRange: "30-50%",
                soilType: "Sandy loam"
            },
            {
                name: "Peas",
                icon: "🫛",
                moistureRange: "40-70%",
                organicMatterRange: "25-45%",
                soilType: "Well-drained loam"
            },
            {
                name: "Sunflower",
                icon: "🌻",
                moistureRange: "35-65%",
                organicMatterRange: "20-40%",
                soilType: "Well-drained loam"
            },
            {
                name: "Sugarcane",
                icon: "🎋",
                moistureRange: "60-85%",
                organicMatterRange: "30-50%",
                soilType: "Clay loam"
            },
            {
                name: "Radish",
                icon: "🥬",
                moistureRange: "35-65%",
                organicMatterRange: "25-45%",
                soilType: "Sandy loam"
            },
            {
                name: "Spinach",
                icon: "🥬",
                moistureRange: "45-75%",
                organicMatterRange: "30-50%",
                soilType: "Rich loamy soil"
            },
            {
                name: "Cauliflower",
                icon: "🥦",
                moistureRange: "45-75%",
                organicMatterRange: "35-55%",
                soilType: "Well-drained loam"
            },
            {
                name: "Okra",
                icon: "🫑",
                moistureRange: "40-70%",
                organicMatterRange: "30-50%",
                soilType: "Sandy loam"
            },
            {
                name: "Ginger",
                icon: "🫚",
                moistureRange: "50-80%",
                organicMatterRange: "35-55%",
                soilType: "Rich loamy soil"
            },
            {
                name: "Turmeric",
                icon: "🫚",
                moistureRange: "45-75%",
                organicMatterRange: "30-50%",
                soilType: "Well-drained loam"
            },
            {
                name: "Brussels Sprouts",
                icon: "🥬",
                moistureRange: "45-70%",
                organicMatterRange: "30-50%",
                soilType: "Fertile loam"
            },
            {
                name: "Asparagus",
                icon: "🥬",
                moistureRange: "40-65%",
                organicMatterRange: "35-55%",
                soilType: "Well-drained loam"
            },
            {
                name: "Kale",
                icon: "🥬",
                moistureRange: "40-70%",
                organicMatterRange: "30-50%",
                soilType: "Rich loamy soil"
            },
            {
                name: "Millet",
                icon: "🌾",
                moistureRange: "35-60%",
                organicMatterRange: "20-40%",
                soilType: "Sandy loam"
            },
            {
                name: "Sorghum",
                icon: "🌾",
                moistureRange: "40-65%",
                organicMatterRange: "25-45%",
                soilType: "Clay loam"
            },
            {
                name: "Chickpeas",
                icon: "🫘",
                moistureRange: "35-65%",
                organicMatterRange: "25-45%",
                soilType: "Well-drained loam"
            },
            {
                name: "Lentils",
                icon: "🫘",
                moistureRange: "35-60%",
                organicMatterRange: "25-45%",
                soilType: "Sandy loam"
            },
            {
                name: "Mustard",
                icon: "🌱",
                moistureRange: "35-65%",
                organicMatterRange: "25-45%",
                soilType: "Well-drained loam"
            },
            {
                name: "Papaya",
                icon: "🍈",
                moistureRange: "50-80%",
                organicMatterRange: "35-55%",
                soilType: "Rich loamy soil"
            },
            {
                name: "Guava",
                icon: "🍎",
                moistureRange: "45-75%",
                organicMatterRange: "30-50%",
                soilType: "Well-drained loam"
            },
            {
                name: "Banana",
                icon: "🍌",
                moistureRange: "60-85%",
                organicMatterRange: "35-55%",
                soilType: "Rich loamy soil"
            },
            {
                name: "Coconut",
                icon: "🥥",
                moistureRange: "55-80%",
                organicMatterRange: "30-50%",
                soilType: "Sandy loam"
            },
            {
                name: "Cassava",
                icon: "🥔",
                moistureRange: "50-75%",
                organicMatterRange: "30-50%",
                soilType: "Well-drained loam"
            },
            {
                name: "Taro",
                icon: "🥔",
                moistureRange: "60-85%",
                organicMatterRange: "35-55%",
                soilType: "Clay loam"
            },
            {
                name: "Green Beans",
                icon: "🫘",
                moistureRange: "45-70%",
                organicMatterRange: "30-50%",
                soilType: "Well-drained loam"
            },
            {
                name: "Black Pepper",
                icon: "🫑",
                moistureRange: "60-85%",
                organicMatterRange: "35-55%",
                soilType: "Well-drained loam"
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
    setupRandomCropGenerator() {
        const randomCrops = [
            { name: "Wheat", icon: "🌾" },            // Wheat plant
    { name: "Corn", icon: "🌽" },             // Corn
    { name: "Tomatoes", icon: "🍅" },         // Tomato
    { name: "Potatoes", icon: "🥔" },         // Potato
    { name: "Carrots", icon: "🥕" },          // Carrot
    { name: "Rice", icon: "🌾" },             // Rice plant
    { name: "Soybeans", icon: "🫘" },         // Beans
    { name: "Cotton", icon: "🌿" },           // Plant (no specific cotton emoji)
    { name: "Lettuce", icon: "🥬" },          // Leafy green
    { name: "Bell Peppers", icon: "🫑" },     // Pepper
    { name: "Onions", icon: "🧅" },           // Onion
    { name: "Garlic", icon: "🧄" },           // Garlic
    { name: "Sweet Potato", icon: "🍠" },     // Sweet potato
    { name: "Pumpkin", icon: "🎃" },          // Pumpkin
    { name: "Cabbage", icon: "🥬" },          // Leafy green
    { name: "Broccoli", icon: "🥦" },         // Broccoli
    { name: "Cucumber", icon: "🥒" },         // Cucumber
    { name: "Eggplant", icon: "🍆" },         // Eggplant
    { name: "Strawberry", icon: "🍓" },       // Strawberry
    { name: "Watermelon", icon: "🍉" },       // Watermelon
    { name: "Peas", icon: "🫛" },             // Peas
    { name: "Sunflower", icon: "🌻" },        // Sunflower
    { name: "Sugarcane", icon: "🎋" },        // Bamboo (closest to sugarcane)
    { name: "Radish", icon: "🥕" },           // Using carrot (similar root vegetable)
    { name: "Spinach", icon: "🥬" },          // Leafy green
    { name: "Cauliflower", icon: "🥦" },      // Using broccoli (similar)
    { name: "Okra", icon: "🫑" },             // Using pepper (similar shape)
    { name: "Ginger", icon: "🫚" },           // Root/herb
    { name: "Turmeric", icon: "🫚" },         // Root/herb
    { name: "Brussels Sprouts", icon: "🥬" },  // Leafy green
    { name: "Asparagus", icon: "🥬" },        // Green vegetable
    { name: "Kale", icon: "🥬" },             // Leafy green
    { name: "Millet", icon: "🌾" },           // Grain
    { name: "Sorghum", icon: "🌾" },          // Grain
    { name: "Chickpeas", icon: "🫘" },        // Beans
    { name: "Lentils", icon: "🫘" },          // Beans
    { name: "Mustard", icon: "🌱" },          // Seedling
    { name: "Papaya", icon: "🍈" },           // Melon (similar fruit)
    { name: "Guava", icon: "🍏" },            // Green apple (similar fruit)
    { name: "Banana", icon: "🍌" },           // Banana
    { name: "Coconut", icon: "🥥" },          // Coconut
    { name: "Cassava", icon: "🥔" },          // Root vegetable
    { name: "Taro", icon: "🥔" },             // Root vegetable
    { name: "Green Beans", icon: "🫘" },      // Beans
    { name: "Black Pepper", icon: "🫑" }      // Pepper
        ];
    
        const generateButton = document.getElementById('generateRandomCrops');
        const randomCropsList = document.getElementById('randomCropsList');
    
        generateButton.addEventListener('click', () => {
            // Clear previous list
            randomCropsList.innerHTML = '';
    
            // Generate 4 random crops
            const selectedCrops = new Set();
            while (selectedCrops.size < 4) {
                const randomIndex = Math.floor(Math.random() * randomCrops.length);
                selectedCrops.add(randomCrops[randomIndex]);
            }
    
            // Display the random crops
            selectedCrops.forEach(crop => {
                const cropElement = document.createElement('div');
                cropElement.className = 'crop-card';
                cropElement.style.borderLeft = '4px solid #2196F3';
                cropElement.innerHTML = `
                    <h4>${crop.icon} ${crop.name}</h4>
                    <p style="color: #666;">Suggested Crop For the Soil </p>
                `;
                randomCropsList.appendChild(cropElement);
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