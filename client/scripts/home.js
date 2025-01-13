// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the textures
const loader = new THREE.TextureLoader();
const colorTexture = loader.load('../assets/earth/earthmap1k.jpg');
const bumpTexture = loader.load('../assets/earth/earthbump1k.jpg');
const specularTexture = loader.load('../assets/earth/earthspec1k.jpg');
const lightsTexture = loader.load('../assets/earth/earthlights1k.jpg');
const cloudTexture = loader.load('../assets/earth/earthcloudmap.jpg');
const cloudTransTexture = loader.load('../assets/earth/earthcloudmaptrans.jpg');

// Create the Earth geometry
const earthGeometry = new THREE.SphereGeometry(1, 64, 64);

// Function to load shader files
async function loadShaderFile(url) {
    const response = await fetch(url);
    return await response.text();
}

// Load shaders and create the Earth material
async function createEarthMaterial() {
    const vertexShader = await loadShaderFile('../assets/earth/vertexShader.vert');
    const fragmentShader = await loadShaderFile('../assets/earth/fragmentShader.frag');
    console.log(vertexShader);
    console.log(fragmentShader);

    const earthShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            colorTexture: { value: colorTexture },
            bumpMap: { value: bumpTexture },
            lightsTexture: { value: lightsTexture },
            bumpScale: { value: 1 },
            bumpStrength: { value: 1 },
            lightPosition: { value: new THREE.Vector3(-100, 0, 0).normalize() },
            cameraPosition: { value: camera.position }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    // Apply the shader material to the Earth
    const earth = new THREE.Mesh(earthGeometry, earthShaderMaterial);
    scene.add(earth);

    // Create the cloud geometry and material
    const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64);
    const cloudMaterial = new THREE.MeshLambertMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.05 // More transparent clouds
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    // scene.add(clouds);

    // Add lighting to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 100); // Increased ambient light intensity
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 100);
    directionalLight.position.set(-100, 0, 0).normalize(); // Move light to the left side (90 degrees)
    scene.add(directionalLight);

    // Position the camera
    camera.position.z = 2;

    // Rotate the Earth to a 5% angle
    earth.rotation.z = THREE.Math.degToRad(5);
    clouds.rotation.z = THREE.Math.degToRad(5);

    // Animate the spinning Earth
    function animate() {
        requestAnimationFrame(animate);

        // Calculate the rotation based on the current time
        const time = Date.now() * 0.0001; // Adjust the speed by changing the multiplier

        // Rotate the Earth and clouds
        earth.rotation.y = time;
        clouds.rotation.y = time * 1.2; // Slightly faster rotation for clouds

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize the scene
createEarthMaterial();