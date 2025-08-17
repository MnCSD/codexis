'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

interface CodeBlock {
  mesh: THREE.Group;
  body?: CANNON.Body;
  type: 'function' | 'class' | 'module';
  name: string;
}

interface BuildingData {
  position: { x: number; z: number };
  type: 'function' | 'class' | 'module';
  name: string;
  district: string;
  linesOfCode: number;
  complexity: number;
  dependencies: string[];
}

interface Vehicle {
  mesh: THREE.Group;
  body: CANNON.Body;
  wheels: { mesh: THREE.Mesh; body: CANNON.Body }[];
}

const BrunoStyleDemo: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const worldRef = useRef<CANNON.World | null>(null);
  const vehicleRef = useRef<Vehicle | null>(null);
  const codeBlocksRef = useRef<CodeBlock[]>([]);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const keysRef = useRef<{ [key: string]: boolean }>({});
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState('Initializing physics world...');
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [cameraMode, setCameraMode] = useState<'follow' | 'free' | 'overview'>('follow');
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Physics World Setup
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
    worldRef.current = world;

    // Define district layout
    const districts = {
      'core': { center: { x: 0, z: 0 }, color: 0x8b5cf6 },
      'auth': { center: { x: -40, z: 0 }, color: 0xef4444 },
      'api': { center: { x: 40, z: 0 }, color: 0x06b6d4 },
      'database': { center: { x: 0, z: -40 }, color: 0x10b981 },
      'ui': { center: { x: 0, z: 40 }, color: 0xf59e0b },
      'utils': { center: { x: -40, z: -40 }, color: 0x6b7280 },
    };

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    scene.fog = new THREE.Fog(0x87CEEB, 100, 300);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 30);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced lighting system
    const setupLighting = () => {
      // Ambient light
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
      scene.add(ambientLight);

      // Main directional light (sun)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(100, 100, 50);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 500;
      directionalLight.shadow.camera.left = -100;
      directionalLight.shadow.camera.right = 100;
      directionalLight.shadow.camera.top = 100;
      directionalLight.shadow.camera.bottom = -100;
      scene.add(directionalLight);

      // Hemisphere light for natural sky lighting
      const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x8B7355, 0.6);
      scene.add(hemisphereLight);

      // Rim lighting
      const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
      rimLight.position.set(-50, 20, -50);
      scene.add(rimLight);
    };

    setupLighting();

    // Enhanced terrain with physics
    const createTerrain = () => {
      setLoadingProgress('Creating beautiful terrain...');
      
      // Create heightmap for varied terrain
      const terrainSize = 200;
      const terrainSegments = 50;
      const terrainGeometry = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSegments, terrainSegments);
      
      // Add height variation
      const vertices = terrainGeometry.attributes.position.array;
      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const z = vertices[i + 2];
        const distance = Math.sqrt(x * x + z * z);
        
        // Create gentle hills and valleys
        vertices[i + 1] = Math.sin(x * 0.02) * Math.cos(z * 0.02) * 3 + 
                          Math.sin(distance * 0.01) * 2;
      }
      terrainGeometry.attributes.position.needsUpdate = true;
      terrainGeometry.computeVertexNormals();

      // Enhanced grass texture
      const createGrassTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d')!;
        
        // Base grass color with gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#4a7c59');
        gradient.addColorStop(1, '#2d5016');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Add detailed grass texture
        for (let i = 0; i < 5000; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const hue = 80 + Math.random() * 40;
          const sat = 60 + Math.random() * 20;
          const light = 20 + Math.random() * 25;
          ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
          ctx.fillRect(x, y, 1 + Math.random(), 2 + Math.random() * 2);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(20, 20);
        return texture;
      };

      const grassTexture = createGrassTexture();
      const terrainMaterial = new THREE.MeshLambertMaterial({ 
        map: grassTexture,
        color: 0x4a7c59,
      });
      
      const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
      terrain.rotation.x = -Math.PI / 2;
      terrain.receiveShadow = true;
      scene.add(terrain);

      // Physics ground
      const groundShape = new CANNON.Plane();
      const groundBody = new CANNON.Body({ mass: 0 });
      groundBody.addShape(groundShape);
      groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
      world.addBody(groundBody);
    };

    createTerrain();

    // Enhanced road system with physics
    const createRoadSystem = () => {
      setLoadingProgress('Building road network...');
      
      // Create main road loop
      const roadWidth = 8;
      const roadPoints = [
        new THREE.Vector3(-60, 0.1, 0),
        new THREE.Vector3(-30, 0.1, -30),
        new THREE.Vector3(0, 0.1, -60),
        new THREE.Vector3(30, 0.1, -30),
        new THREE.Vector3(60, 0.1, 0),
        new THREE.Vector3(30, 0.1, 30),
        new THREE.Vector3(0, 0.1, 60),
        new THREE.Vector3(-30, 0.1, 30),
        new THREE.Vector3(-60, 0.1, 0),
      ];

      const roadCurve = new THREE.CatmullRomCurve3(roadPoints, true);
      const roadGeometry = new THREE.TubeGeometry(roadCurve, 200, roadWidth / 2, 8, false);
      const roadMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x444444,
        transparent: true,
        opacity: 0.9
      });
      const road = new THREE.Mesh(roadGeometry, roadMaterial);
      road.receiveShadow = true;
      scene.add(road);

      // Add road markings
      const markingGeometry = new THREE.TubeGeometry(roadCurve, 200, 0.1, 4, false);
      const markingMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const roadMarkings = new THREE.Mesh(markingGeometry, markingMaterial);
      roadMarkings.position.y = 0.01;
      scene.add(roadMarkings);

      // Store road curve for vehicle path
      (window as any).roadCurve = roadCurve;
    };

    createRoadSystem();

    // Create interactive vehicle
    const createVehicle = () => {
      setLoadingProgress('Creating your vehicle...');
      
      // Vehicle body
      const vehicleGeometry = new THREE.BoxGeometry(4, 1.5, 2);
      const vehicleMaterial = new THREE.MeshLambertMaterial({ color: 0xff6b6b });
      const vehicleMesh = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
      vehicleMesh.castShadow = true;
      vehicleMesh.receiveShadow = true;
      
      // Vehicle details
      const detailsGroup = new THREE.Group();
      
      // Windshield
      const windshieldGeometry = new THREE.PlaneGeometry(3, 1);
      const windshieldMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x87CEEB, 
        transparent: true, 
        opacity: 0.3 
      });
      const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
      windshield.position.set(0, 0.5, 0.8);
      windshield.rotation.x = -0.2;
      detailsGroup.add(windshield);
      
      // Headlights
      const headlightGeometry = new THREE.SphereGeometry(0.2, 8, 8);
      const headlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffaa });
      const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
      leftHeadlight.position.set(-1.2, 0, 1.1);
      const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
      rightHeadlight.position.set(1.2, 0, 1.1);
      detailsGroup.add(leftHeadlight, rightHeadlight);

      const vehicleGroup = new THREE.Group();
      vehicleGroup.add(vehicleMesh, detailsGroup);
      vehicleGroup.position.set(0, 2, 0);
      scene.add(vehicleGroup);

      // Physics body for vehicle
      const vehicleShape = new CANNON.Box(new CANNON.Vec3(2, 0.75, 1));
      const vehicleBody = new CANNON.Body({ mass: 150 });
      vehicleBody.addShape(vehicleShape);
      vehicleBody.position.set(0, 2, 0);
      vehicleBody.material = new CANNON.Material({ friction: 0.3, restitution: 0.3 });
      world.addBody(vehicleBody);

      // Create wheels
      const wheels: { mesh: THREE.Mesh; body: CANNON.Body }[] = [];
      const wheelPositions = [
        [-1.5, -0.5, 1.2],
        [1.5, -0.5, 1.2],
        [-1.5, -0.5, -1.2],
        [1.5, -0.5, -1.2]
      ];

      wheelPositions.forEach((pos, index) => {
        // Wheel mesh
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 12);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const wheelMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelMesh.rotation.z = Math.PI / 2;
        wheelMesh.castShadow = true;
        vehicleGroup.add(wheelMesh);

        // Wheel physics
        const wheelShape = new CANNON.Cylinder(0.4, 0.4, 0.3, 8);
        const wheelBody = new CANNON.Body({ mass: 10 });
        wheelBody.addShape(wheelShape);
        wheelBody.position.set(pos[0], pos[1], pos[2]);
        wheelBody.material = new CANNON.Material({ friction: 1.5, restitution: 0.1 });
        world.addBody(wheelBody);

        wheels.push({ mesh: wheelMesh, body: wheelBody });
      });

      vehicleRef.current = { mesh: vehicleGroup, body: vehicleBody, wheels };
    };

    createVehicle();

    // Enhanced environment with animated elements
    const createEnvironment = () => {
      setLoadingProgress('Planting magical forest...');
      
      // Animated trees
      const treePositions = [
        { x: -25, z: 25, type: 'oak', scale: 1.2 },
        { x: 25, z: 25, type: 'pine', scale: 1.0 },
        { x: -25, z: -25, type: 'birch', scale: 0.8 },
        { x: 25, z: -25, type: 'oak', scale: 1.1 },
        { x: -70, z: 20, type: 'pine', scale: 1.3 },
        { x: 70, z: -20, type: 'birch', scale: 0.9 },
        { x: 20, z: 70, type: 'oak', scale: 1.0 },
        { x: -20, z: -70, type: 'pine', scale: 1.2 },
      ];

      treePositions.forEach(({ x, z, type, scale }) => {
        const treeGroup = new THREE.Group();
        
        // Trunk
        const trunkHeight = (1.5 + Math.random() * 1) * scale;
        const trunkGeometry = new THREE.CylinderGeometry(0.15 * scale, 0.2 * scale, trunkHeight, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = trunkHeight / 2;
        trunk.castShadow = true;
        treeGroup.add(trunk);
        
        // Foliage with animation
        let foliageGeometry: THREE.BufferGeometry;
        let foliageColor: number;
        
        switch (type) {
          case 'oak':
            foliageGeometry = new THREE.SphereGeometry(1.8 * scale, 8, 6);
            foliageColor = 0x228B22;
            break;
          case 'pine':
            foliageGeometry = new THREE.ConeGeometry(1.2 * scale, 2.5 * scale, 6);
            foliageColor = 0x006400;
            break;
          case 'birch':
            foliageGeometry = new THREE.SphereGeometry(1.3 * scale, 8, 6);
            foliageColor = 0x32CD32;
            break;
          default:
            foliageGeometry = new THREE.SphereGeometry(1.5 * scale, 8, 6);
            foliageColor = 0x228B22;
        }
        
        const foliageMaterial = new THREE.MeshLambertMaterial({ color: foliageColor });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = trunkHeight + (type === 'pine' ? 1.8 * scale : 1.5 * scale);
        foliage.castShadow = true;
        treeGroup.add(foliage);
        
        treeGroup.position.set(x, 0, z);
        treeGroup.userData = { originalY: foliage.position.y, swaySpeed: 0.5 + Math.random() * 0.5 };
        scene.add(treeGroup);
      });

      // Floating particles
      const particleCount = 100;
      const particleGeometry = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleVelocities = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 200;
        particlePositions[i * 3 + 1] = Math.random() * 20 + 5;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
        
        particleVelocities[i * 3] = (Math.random() - 0.5) * 0.02;
        particleVelocities[i * 3 + 1] = Math.random() * 0.01;
        particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      }
      
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(particleVelocities, 3));
      
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.6
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
      
      (window as any).particles = particles;
    };

    createEnvironment();

    // GLTFLoader for buildings
    const gltfLoader = new GLTFLoader();

    // Building data
    const buildingsData: BuildingData[] = [
      { position: { x: 0, z: 0 }, type: 'module', name: 'src/main.ts', district: 'core', linesOfCode: 150, complexity: 8, dependencies: ['auth', 'api', 'database'] },
      { position: { x: -8, z: 8 }, type: 'class', name: 'Application', district: 'core', linesOfCode: 200, complexity: 6, dependencies: ['Router'] },
      { position: { x: 8, z: 8 }, type: 'class', name: 'Router', district: 'core', linesOfCode: 120, complexity: 4, dependencies: [] },
      { position: { x: -40, z: 0 }, type: 'module', name: 'src/auth/index.ts', district: 'auth', linesOfCode: 180, complexity: 9, dependencies: ['database'] },
      { position: { x: 40, z: 0 }, type: 'module', name: 'src/api/index.ts', district: 'api', linesOfCode: 120, complexity: 6, dependencies: ['auth'] },
      { position: { x: 0, z: -40 }, type: 'module', name: 'src/database/index.ts', district: 'database', linesOfCode: 200, complexity: 7, dependencies: [] },
    ];

    // Create buildings with physics
    const createBuilding = async (buildingData: BuildingData): Promise<CodeBlock> => {
      const { position, type, name } = buildingData;
      
      // Simple building geometry
      const height = 2 + Math.random() * 4;
      const width = 2 + Math.random() * 2;
      const depth = 2 + Math.random() * 2;
      
      const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
      const buildingMaterial = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6) 
      });
      const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
      buildingMesh.position.set(position.x, height / 2, position.z);
      buildingMesh.castShadow = true;
      buildingMesh.receiveShadow = true;
      buildingMesh.userData = buildingData;
      
      const buildingGroup = new THREE.Group();
      buildingGroup.add(buildingMesh);
      buildingGroup.userData = buildingData;
      scene.add(buildingGroup);

      // Physics body
      const buildingShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
      const buildingBody = new CANNON.Body({ mass: 0 });
      buildingBody.addShape(buildingShape);
      buildingBody.position.set(position.x, height / 2, position.z);
      world.addBody(buildingBody);

      return { mesh: buildingGroup, body: buildingBody, type, name };
    };

    // Load all buildings
    const loadAllBuildings = async () => {
      setLoadingProgress('Constructing code city...');
      const buildings: CodeBlock[] = [];
      
      for (let i = 0; i < buildingsData.length; i++) {
        try {
          const building = await createBuilding(buildingsData[i]);
          buildings.push(building);
          setLoadingProgress(`Built ${i + 1}/${buildingsData.length} buildings`);
        } catch (error) {
          console.error(`Failed to create building ${buildingsData[i].name}`);
        }
      }
      
      codeBlocksRef.current = buildings;
      setLoadingProgress('');
      setIsLoaded(true);
      
      // Hide instructions after a delay
      setTimeout(() => setShowInstructions(false), 8000);
    };

    loadAllBuildings();

    // Input handling
    const handleKeyDown = (event: KeyboardEvent) => {
      keysRef.current[event.code] = true;
      
      // Camera mode switching
      if (event.code === 'KeyC') {
        setCameraMode(prev => {
          const modes: ('follow' | 'free' | 'overview')[] = ['follow', 'free', 'overview'];
          const currentIndex = modes.indexOf(prev);
          return modes[(currentIndex + 1) % modes.length];
        });
      }
      
      // Toggle instructions
      if (event.code === 'KeyH') {
        setShowInstructions(prev => !prev);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current[event.code] = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      if (!mountRef.current) return;
      
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        let object = intersects[0].object;
        while (object.parent && !object.userData.name) {
          object = object.parent;
        }
        
        if (object.userData.name) {
          setHoveredBlock(object.userData.name);
          document.body.style.cursor = 'pointer';
        } else {
          setHoveredBlock(null);
          document.body.style.cursor = 'default';
        }
      } else {
        setHoveredBlock(null);
        document.body.style.cursor = 'default';
      }
    };

    mountRef.current.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      const deltaTime = clockRef.current.getDelta();
      const elapsedTime = clockRef.current.getElapsedTime();
      
      // Update physics
      world.step(1/60, deltaTime, 3);
      
      // Vehicle controls
      if (vehicleRef.current && isLoaded) {
        const vehicle = vehicleRef.current;
        const force = 300;
        const torque = 50;
        
        // Apply forces based on input
        if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) {
          vehicle.body.applyLocalForce(new CANNON.Vec3(0, 0, force), new CANNON.Vec3(0, 0, 0));
        }
        if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) {
          vehicle.body.applyLocalForce(new CANNON.Vec3(0, 0, -force), new CANNON.Vec3(0, 0, 0));
        }
        if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) {
          vehicle.body.applyLocalTorque(new CANNON.Vec3(0, torque, 0));
        }
        if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) {
          vehicle.body.applyLocalTorque(new CANNON.Vec3(0, -torque, 0));
        }
        
        // Sync mesh with physics body
        vehicle.mesh.position.copy(vehicle.body.position as any);
        vehicle.mesh.quaternion.copy(vehicle.body.quaternion as any);
        
        // Update wheels
        vehicle.wheels.forEach((wheel, index) => {
          wheel.mesh.position.copy(wheel.body.position as any);
          wheel.mesh.quaternion.copy(wheel.body.quaternion as any);
        });
      }
      
      // Animate environment
      scene.traverse((child) => {
        if (child.userData.originalY !== undefined) {
          const foliage = child.children[1];
          if (foliage) {
            foliage.position.y = child.userData.originalY + Math.sin(elapsedTime * child.userData.swaySpeed) * 0.1;
            foliage.rotation.z = Math.sin(elapsedTime * child.userData.swaySpeed * 0.7) * 0.05;
          }
        }
      });
      
      // Animate particles
      const particles = (window as any).particles;
      if (particles) {
        const positions = particles.geometry.attributes.position.array;
        const velocities = particles.geometry.attributes.velocity.array;
        
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];
          
          // Reset particles that go too far
          if (Math.abs(positions[i]) > 100 || positions[i + 1] > 30) {
            positions[i] = (Math.random() - 0.5) * 200;
            positions[i + 1] = Math.random() * 5;
            positions[i + 2] = (Math.random() - 0.5) * 200;
          }
        }
        particles.geometry.attributes.position.needsUpdate = true;
      }
      
      // Camera modes
      if (vehicleRef.current && cameraRef.current) {
        const vehicle = vehicleRef.current;
        
        switch (cameraMode) {
          case 'follow':
            const targetPosition = new THREE.Vector3();
            vehicle.mesh.getWorldPosition(targetPosition);
            targetPosition.add(new THREE.Vector3(0, 8, -15));
            
            camera.position.lerp(targetPosition, 0.05);
            camera.lookAt(vehicle.mesh.position);
            break;
            
          case 'overview':
            const overviewTarget = new THREE.Vector3(0, 50, 50);
            camera.position.lerp(overviewTarget, 0.02);
            camera.lookAt(0, 0, 0);
            break;
            
          case 'free':
            // Free camera - no automatic movement
            break;
        }
      }
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
        mountRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mountRef} 
        className="w-full h-full"
        style={{ minHeight: '500px' }}
      />
      
      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center">
            <div className="text-white text-xl mb-4">{loadingProgress}</div>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Instructions */}
      {showInstructions && isLoaded && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm max-w-sm">
          <h3 className="font-bold mb-2">🚗 Drive Through Code City</h3>
          <div className="text-sm space-y-1">
            <p><kbd className="bg-gray-700 px-1 rounded">WASD</kbd> or <kbd className="bg-gray-700 px-1 rounded">Arrow Keys</kbd> - Drive</p>
            <p><kbd className="bg-gray-700 px-1 rounded">C</kbd> - Switch camera mode ({cameraMode})</p>
            <p><kbd className="bg-gray-700 px-1 rounded">H</kbd> - Toggle help</p>
            <p className="text-gray-400 mt-2">🖱️ Hover buildings for info</p>
          </div>
        </div>
      )}
      
      {/* Camera mode indicator */}
      <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
        📷 {cameraMode} mode
      </div>
      
      {/* Building info */}
      {hoveredBlock && (
        <div className="absolute bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg backdrop-blur-sm max-w-xs">
          <div className="text-lg font-bold mb-2">{hoveredBlock}</div>
          {codeBlocksRef.current.map(block => {
            if (block.name === hoveredBlock && block.mesh.userData) {
              const data = block.mesh.userData;
              return (
                <div key={block.name} className="space-y-1">
                  <div className="text-sm">
                    <span className="text-blue-300">Type:</span> {data.type}
                  </div>
                  <div className="text-sm">
                    <span className="text-green-300">District:</span> {data.district}
                  </div>
                  <div className="text-sm">
                    <span className="text-yellow-300">Lines:</span> {data.linesOfCode}
                  </div>
                  <div className="text-sm">
                    <span className="text-red-300">Complexity:</span> {data.complexity}/10
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
      
      {/* Performance indicator */}
      <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
        🌟 Bruno Simon Style Demo
      </div>
    </div>
  );
};

export default BrunoStyleDemo;