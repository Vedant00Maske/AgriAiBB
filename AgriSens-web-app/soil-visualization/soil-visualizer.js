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

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SoilVisualizer();
});