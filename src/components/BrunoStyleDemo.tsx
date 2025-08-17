'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

interface CodeBlock {
  mesh: THREE.Group;
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

const BrunoStyleDemo: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const codeBlocksRef = useRef<CodeBlock[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState('Initializing...');
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Define district layout FIRST (grid-based, deterministic)
    const districts = {
      'core': { center: { x: 0, z: 0 }, color: 0x8b5cf6 }, // Purple - Core system
      'auth': { center: { x: -40, z: 0 }, color: 0xef4444 }, // Red - Authentication
      'api': { center: { x: 40, z: 0 }, color: 0x06b6d4 }, // Cyan - API layer
      'database': { center: { x: 0, z: -40 }, color: 0x10b981 }, // Green - Data layer
      'ui': { center: { x: 0, z: 40 }, color: 0xf59e0b }, // Orange - UI components
      'utils': { center: { x: -40, z: -40 }, color: 0x6b7280 }, // Gray - Utilities
    };

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(30, 20, 30);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Beautiful grass terrain with texture
    const createGrassTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      
      // Base grass color
      ctx.fillStyle = '#2d5016';
      ctx.fillRect(0, 0, 512, 512);
      
      // Add grass blade texture
      for (let i = 0; i < 3000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const shade = Math.random() * 0.3 + 0.7;
        ctx.fillStyle = `hsl(${80 + Math.random() * 40}, ${60 + Math.random() * 20}%, ${20 + Math.random() * 15}%)`;
        ctx.fillRect(x, y, 1 + Math.random(), 1 + Math.random());
      }
      
      // Add some dirt patches
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 20 + 5;
        ctx.fillStyle = `hsl(30, ${30 + Math.random() * 20}%, ${25 + Math.random() * 10}%)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(12, 12);
      return texture;
    };

    const grassTexture = createGrassTexture();
    const terrainGeometry = new THREE.PlaneGeometry(200, 200, 40, 40);
    const terrainMaterial = new THREE.MeshLambertMaterial({ 
      map: grassTexture,
      color: 0x4a7c59,
    });
    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    terrain.position.y = -0.1;
    scene.add(terrain);

    // Create district foundations with better integration
    const createDistrict = (name: string, center: { x: number; z: number }, color: number) => {
      // District park/plaza area
      const districtGeometry = new THREE.PlaneGeometry(16, 16);
      const districtMaterial = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color(color).lerp(new THREE.Color(0x4a7c59), 0.7),
        transparent: true,
        opacity: 0.8
      });
      const district = new THREE.Mesh(districtGeometry, districtMaterial);
      district.rotation.x = -Math.PI / 2;
      district.position.set(center.x, 0.005, center.z);
      scene.add(district);
      
      // District boundary paths
      const pathGeometry = new THREE.RingGeometry(7.8, 8.2);
      const pathMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x8B7355, // Brown path color
        transparent: true,
        opacity: 0.6
      });
      const path = new THREE.Mesh(pathGeometry, pathMaterial);
      path.rotation.x = -Math.PI / 2;
      path.position.set(center.x, 0.01, center.z);
      scene.add(path);
    };

    // Create districts
    Object.entries(districts).forEach(([name, district]) => {
      createDistrict(name, district.center, district.color);
    });

    // Beautiful road system using Kenney.nl assets
    const roadAssets = {
      straight: '/roads/GLB%20format/road-straight.glb',
      intersection: '/roads/GLB%20format/road-intersection.glb',
      crossroad: '/roads/GLB%20format/road-crossroad.glb',
      curve: '/roads/GLB%20format/road-curve.glb',
      bend: '/roads/GLB%20format/road-bend.glb',
      sidewalk: '/roads/GLB%20format/road-bend-sidewalk.glb',
      lightSquare: '/roads/GLB%20format/light-square.glb',
      sign: '/roads/GLB%20format/sign-highway.glb',
      barrier: '/roads/GLB%20format/construction-barrier.glb'
    };

    // Load road model function
    const loadRoadModel = (path: string): Promise<THREE.Group> => {
      return new Promise((resolve, reject) => {
        gltfLoader.load(
          path,
          (gltf: any) => {
            const model = gltf.scene.clone();
            model.traverse((child: THREE.Object3D) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            resolve(model);
          },
          undefined,
          (error: any) => {
            console.error(`Failed to load road model: ${path}`, error);
            reject(error);
          }
        );
      });
    };

    // Create beautiful road network
    const createRoadNetwork = async () => {
      setLoadingProgress('Building road network...');
      
      try {
        // Load essential road models
        const [straightRoad, intersection, crossroad, streetLight] = await Promise.all([
          loadRoadModel(roadAssets.straight),
          loadRoadModel(roadAssets.intersection),
          loadRoadModel(roadAssets.crossroad),
          loadRoadModel(roadAssets.lightSquare)
        ]);

        // Define road grid positions
        const roadPieces = [
          // Central crossroad
          { model: crossroad, pos: [0, 0, 0], rotation: 0 },
          
          // Main horizontal roads
          { model: straightRoad, pos: [-20, 0, 0], rotation: Math.PI / 2 },
          { model: straightRoad, pos: [20, 0, 0], rotation: Math.PI / 2 },
          { model: intersection, pos: [-40, 0, 0], rotation: 0 },
          { model: intersection, pos: [40, 0, 0], rotation: 0 },
          
          // Main vertical roads
          { model: straightRoad, pos: [0, 0, -20], rotation: 0 },
          { model: straightRoad, pos: [0, 0, 20], rotation: 0 },
          { model: intersection, pos: [0, 0, -40], rotation: Math.PI / 2 },
          { model: intersection, pos: [0, 0, 40], rotation: Math.PI / 2 },
          
          // District connector roads
          { model: straightRoad, pos: [-40, 0, -20], rotation: Math.PI / 2 },
          { model: intersection, pos: [-40, 0, -40], rotation: 0 },
          { model: straightRoad, pos: [-20, 0, -40], rotation: 0 },
          
          // Extended grid for realistic city feel
          { model: straightRoad, pos: [-60, 0, 0], rotation: Math.PI / 2 },
          { model: straightRoad, pos: [60, 0, 0], rotation: Math.PI / 2 },
          { model: straightRoad, pos: [0, 0, -60], rotation: 0 },
          { model: straightRoad, pos: [0, 0, 60], rotation: 0 },
          
          // Additional intersections for connectivity
          { model: intersection, pos: [-20, 0, -20], rotation: 0 },
          { model: intersection, pos: [20, 0, 20], rotation: 0 },
          { model: intersection, pos: [-20, 0, 20], rotation: 0 },
          { model: intersection, pos: [20, 0, -20], rotation: 0 },
        ];

        // Place all road pieces
        roadPieces.forEach(({ model, pos, rotation }) => {
          const roadInstance = model.clone();
          roadInstance.position.set(pos[0], pos[1], pos[2]);
          roadInstance.rotation.y = rotation;
          roadInstance.scale.setScalar(1.1); // Slightly larger for better coverage
          scene.add(roadInstance);
        });

        // Add street lighting along main roads
        const lightPositions = [
          // Along main horizontal roads
          { x: -30, z: 5 }, { x: -10, z: 5 }, { x: 10, z: 5 }, { x: 30, z: 5 },
          { x: -30, z: -5 }, { x: -10, z: -5 }, { x: 10, z: -5 }, { x: 30, z: -5 },
          
          // Along main vertical roads
          { x: 5, z: -30 }, { x: 5, z: -10 }, { x: 5, z: 10 }, { x: 5, z: 30 },
          { x: -5, z: -30 }, { x: -5, z: -10 }, { x: -5, z: 10 }, { x: -5, z: 30 },
          
          // Around districts for ambient lighting
          { x: -50, z: 10 }, { x: -50, z: -10 }, { x: 50, z: 10 }, { x: 50, z: -10 },
          { x: 10, z: -50 }, { x: -10, z: -50 }, { x: 10, z: 50 }, { x: -10, z: 50 },
        ];

        // Place street lights with actual light sources
        lightPositions.forEach(({ x, z }) => {
          const light = streetLight.clone();
          light.position.set(x, 0, z);
          light.scale.setScalar(0.8);
          scene.add(light);
          
          // Add actual point light for illumination
          const pointLight = new THREE.PointLight(0xffa500, 0.4, 20);
          pointLight.position.set(x, 5, z);
          pointLight.castShadow = true;
          pointLight.shadow.mapSize.width = 1024;
          pointLight.shadow.mapSize.height = 1024;
          scene.add(pointLight);
        });

        console.log('✅ Beautiful road network created with Kenney.nl models!');
      } catch (error) {
        console.error('❌ Failed to load road models, using fallback:', error);
        // Fallback to simple roads if models fail to load
        createSimpleRoadFallback();
      }
    };

    // Fallback simple road system
    const createSimpleRoadFallback = () => {
      const createRoad = (from: { x: number; z: number }, to: { x: number; z: number }) => {
        const dx = to.x - from.x;
        const dz = to.z - from.z;
        const length = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dz, dx);
        
        const roadGeometry = new THREE.PlaneGeometry(length - 20, 4);
        const roadMaterial = new THREE.MeshLambertMaterial({ 
          color: 0x444444,
          transparent: true,
          opacity: 0.8
        });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.rotation.z = angle;
        road.position.set((from.x + to.x) / 2, 0.01, (from.z + to.z) / 2);
        scene.add(road);
      };

      // Create basic connectivity
      createRoad(districts.core.center, districts.auth.center);
      createRoad(districts.core.center, districts.api.center);
      createRoad(districts.core.center, districts.database.center);
      createRoad(districts.api.center, districts.auth.center);
      createRoad(districts.api.center, districts.database.center);
      createRoad(districts.auth.center, districts.utils.center);
    };

    // Initialize road network
    createRoadNetwork();

    // Add beautiful trees and natural elements
    const createTrees = () => {
      setLoadingProgress('Planting trees and greenery...');
      
      const treePositions = [
        // Around districts (parks and green spaces)
        { x: -15, z: 15, type: 'oak' }, { x: 15, z: 15, type: 'pine' }, 
        { x: -15, z: -15, type: 'birch' }, { x: 15, z: -15, type: 'oak' },
        
        // Auth district landscaping
        { x: -55, z: 10, type: 'pine' }, { x: -55, z: -10, type: 'oak' },
        { x: -25, z: 10, type: 'birch' }, { x: -25, z: -10, type: 'pine' },
        
        // API district landscaping
        { x: 55, z: 10, type: 'oak' }, { x: 55, z: -10, type: 'birch' },
        { x: 25, z: 10, type: 'pine' }, { x: 25, z: -10, type: 'oak' },
        
        // Database district landscaping
        { x: -15, z: -55, type: 'birch' }, { x: 15, z: -55, type: 'pine' },
        { x: -15, z: -25, type: 'oak' }, { x: 15, z: -25, type: 'birch' },
        
        // UI district landscaping
        { x: -15, z: 55, type: 'pine' }, { x: 15, z: 55, type: 'oak' },
        { x: -15, z: 25, type: 'birch' }, { x: 15, z: 25, type: 'pine' },
        
        // Utils district landscaping
        { x: -55, z: -55, type: 'oak' }, { x: -55, z: -25, type: 'pine' },
        { x: -25, z: -55, type: 'birch' }, { x: -25, z: -25, type: 'oak' },
        
        // Perimeter trees for natural boundaries
        { x: -70, z: 0, type: 'pine' }, { x: 70, z: 0, type: 'oak' },
        { x: 0, z: -70, type: 'birch' }, { x: 0, z: 70, type: 'pine' },
        { x: -70, z: -35, type: 'oak' }, { x: 70, z: 35, type: 'birch' },
        { x: -35, z: 70, type: 'pine' }, { x: 35, z: -70, type: 'oak' },
        
        // Random scattered trees for natural feel
        { x: -80, z: 20, type: 'birch' }, { x: 80, z: -20, type: 'pine' },
        { x: 20, z: 80, type: 'oak' }, { x: -20, z: -80, type: 'birch' },
        { x: -65, z: 45, type: 'pine' }, { x: 65, z: -45, type: 'oak' },
        { x: 45, z: 65, type: 'birch' }, { x: -45, z: -65, type: 'pine' },
      ];

      treePositions.forEach(({ x, z, type }) => {
        // Create varied tree trunk
        const trunkHeight = 1.5 + Math.random() * 1;
        const trunkRadius = 0.15 + Math.random() * 0.1;
        const trunkGeometry = new THREE.CylinderGeometry(trunkRadius, trunkRadius + 0.05, trunkHeight, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ 
          color: new THREE.Color().setHSL(0.08, 0.6, 0.15 + Math.random() * 0.1)
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, trunkHeight / 2, z);
        trunk.castShadow = true;
        scene.add(trunk);
        
        // Create tree foliage based on type
        let foliageGeometry: THREE.BufferGeometry;
        let foliageColor: THREE.Color;
        
        switch (type) {
          case 'oak':
            foliageGeometry = new THREE.SphereGeometry(1.8 + Math.random() * 0.8, 8, 6);
            foliageColor = new THREE.Color().setHSL(0.25, 0.7, 0.25 + Math.random() * 0.15);
            break;
          case 'pine':
            foliageGeometry = new THREE.ConeGeometry(1.2 + Math.random() * 0.5, 2.5 + Math.random() * 1, 6);
            foliageColor = new THREE.Color().setHSL(0.35, 0.8, 0.2 + Math.random() * 0.1);
            break;
          case 'birch':
            foliageGeometry = new THREE.SphereGeometry(1.3 + Math.random() * 0.6, 8, 6);
            foliageColor = new THREE.Color().setHSL(0.22, 0.6, 0.3 + Math.random() * 0.15);
            break;
          default:
            foliageGeometry = new THREE.SphereGeometry(1.5, 8, 6);
            foliageColor = new THREE.Color(0x2d5016);
        }
        
        const foliageMaterial = new THREE.MeshLambertMaterial({ color: foliageColor });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.set(x, trunkHeight + (type === 'pine' ? 1.8 : 1.5), z);
        foliage.castShadow = true;
        scene.add(foliage);
        
        // Add small bushes around some trees
        if (Math.random() > 0.6) {
          const bushGeometry = new THREE.SphereGeometry(0.5 + Math.random() * 0.3, 6, 4);
          const bushMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(0.28, 0.5, 0.2 + Math.random() * 0.1)
          });
          const bush = new THREE.Mesh(bushGeometry, bushMaterial);
          const bushOffset = 1.5 + Math.random() * 1;
          const bushAngle = Math.random() * Math.PI * 2;
          bush.position.set(
            x + Math.cos(bushAngle) * bushOffset,
            0.3,
            z + Math.sin(bushAngle) * bushOffset
          );
          bush.castShadow = true;
          scene.add(bush);
        }
      });

      console.log('✅ Beautiful tree landscape created!');
    };

    // Initialize landscaping
    createTrees();

    // Add urban details (signs, barriers, etc.)
    const addUrbanDetails = async () => {
      try {
        const [sign, barrier] = await Promise.all([
          loadRoadModel(roadAssets.sign),
          loadRoadModel(roadAssets.barrier)
        ]);

        // Add highway signs at district entrances
        const signPositions = [
          { x: -50, z: -5, rotation: 0, text: 'Auth District' },
          { x: 50, z: 5, rotation: Math.PI, text: 'API District' },
          { x: 5, z: -50, rotation: Math.PI / 2, text: 'Database District' },
          { x: -5, z: 50, rotation: -Math.PI / 2, text: 'UI District' },
        ];

        signPositions.forEach(({ x, z, rotation }) => {
          const signInstance = sign.clone();
          signInstance.position.set(x, 0, z);
          signInstance.rotation.y = rotation;
          signInstance.scale.setScalar(0.8);
          scene.add(signInstance);
        });

        // Add construction barriers around some areas for realism
        const barrierPositions = [
          { x: -65, z: -65 }, { x: 65, z: 65 }, { x: -65, z: 65 }, { x: 65, z: -65 },
          { x: -80, z: 0 }, { x: 80, z: 0 }, { x: 0, z: -80 }, { x: 0, z: 80 },
        ];

        barrierPositions.forEach(({ x, z }) => {
          const barrierInstance = barrier.clone();
          barrierInstance.position.set(x, 0, z);
          barrierInstance.rotation.y = Math.random() * Math.PI * 2;
          barrierInstance.scale.setScalar(0.8);
          scene.add(barrierInstance);
        });

        console.log('✅ Urban details added successfully!');
      } catch (error) {
        console.log('⚠️ Could not load urban detail models, continuing without them');
      }
    };

    // Add urban details
    addUrbanDetails();

    // Add sidewalks around buildings
    const createSidewalk = (x: number, z: number, width: number, depth: number) => {
      const sidewalkGeometry = new THREE.PlaneGeometry(width + 2, depth + 2);
      const sidewalkMaterial = new THREE.MeshLambertMaterial({ color: 0x404040 });
      const sidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
      sidewalk.rotation.x = -Math.PI / 2;
      sidewalk.position.set(x, 0.005, z);
      scene.add(sidewalk);
    };

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // GLTFLoader
    const gltfLoader = new GLTFLoader();

    // Model paths for different building types
    const modelPaths = {
      modules: [
        '/GLB%20format/building-skyscraper-a.glb',
        '/GLB%20format/building-skyscraper-b.glb',
        '/GLB%20format/building-skyscraper-c.glb',
        '/GLB%20format/building-skyscraper-d.glb',
        '/GLB%20format/building-skyscraper-e.glb'
      ],
      classes: [
        '/GLB%20format/building-a.glb',
        '/GLB%20format/building-b.glb',
        '/GLB%20format/building-c.glb',
        '/GLB%20format/building-d.glb',
        '/GLB%20format/building-e.glb',
        '/GLB%20format/building-f.glb',
        '/GLB%20format/building-g.glb',
        '/GLB%20format/building-h.glb'
      ],
      functions: [
        '/GLB%20format/low-detail-building-a.glb',
        '/GLB%20format/low-detail-building-b.glb',
        '/GLB%20format/low-detail-building-c.glb',
        '/GLB%20format/low-detail-building-d.glb',
        '/GLB%20format/low-detail-building-e.glb',
        '/GLB%20format/low-detail-building-f.glb',
        '/GLB%20format/low-detail-building-g.glb',
        '/GLB%20format/low-detail-building-h.glb'
      ]
    };

    // Structured, deterministic building data representing a real codebase
    const buildingsData: BuildingData[] = [
      // CORE DISTRICT (Center) - Main application logic
      { 
        position: { x: 0, z: 0 }, type: 'module', name: 'src/main.ts', district: 'core',
        linesOfCode: 150, complexity: 8, dependencies: ['auth', 'api', 'database']
      },
      { 
        position: { x: -8, z: 8 }, type: 'class', name: 'Application', district: 'core',
        linesOfCode: 200, complexity: 6, dependencies: ['Router', 'ConfigManager']
      },
      { 
        position: { x: 8, z: 8 }, type: 'class', name: 'Router', district: 'core',
        linesOfCode: 120, complexity: 4, dependencies: ['ApiController']
      },
      { 
        position: { x: -8, z: -8 }, type: 'function', name: 'bootstrap()', district: 'core',
        linesOfCode: 45, complexity: 2, dependencies: []
      },
      { 
        position: { x: 8, z: -8 }, type: 'function', name: 'shutdown()', district: 'core',
        linesOfCode: 30, complexity: 2, dependencies: []
      },

      // AUTH DISTRICT (Left) - Authentication & Security
      { 
        position: { x: -40, z: 0 }, type: 'module', name: 'src/auth/index.ts', district: 'auth',
        linesOfCode: 180, complexity: 9, dependencies: ['database', 'utils']
      },
      { 
        position: { x: -48, z: 8 }, type: 'class', name: 'AuthService', district: 'auth',
        linesOfCode: 250, complexity: 7, dependencies: ['UserRepository']
      },
      { 
        position: { x: -32, z: 8 }, type: 'class', name: 'TokenManager', district: 'auth',
        linesOfCode: 100, complexity: 5, dependencies: ['JwtUtil']
      },
      { 
        position: { x: -48, z: -8 }, type: 'function', name: 'login()', district: 'auth',
        linesOfCode: 60, complexity: 4, dependencies: ['validateCredentials']
      },
      { 
        position: { x: -32, z: -8 }, type: 'function', name: 'logout()', district: 'auth',
        linesOfCode: 25, complexity: 2, dependencies: []
      },

      // API DISTRICT (Right) - External interfaces
      { 
        position: { x: 40, z: 0 }, type: 'module', name: 'src/api/index.ts', district: 'api',
        linesOfCode: 120, complexity: 6, dependencies: ['auth', 'database']
      },
      { 
        position: { x: 48, z: 8 }, type: 'class', name: 'ApiController', district: 'api',
        linesOfCode: 300, complexity: 8, dependencies: ['AuthService', 'UserService']
      },
      { 
        position: { x: 32, z: 8 }, type: 'class', name: 'ResponseHandler', district: 'api',
        linesOfCode: 80, complexity: 3, dependencies: []
      },
      { 
        position: { x: 48, z: -8 }, type: 'function', name: 'handleRequest()', district: 'api',
        linesOfCode: 40, complexity: 3, dependencies: ['validateInput']
      },
      { 
        position: { x: 32, z: -8 }, type: 'function', name: 'sendResponse()', district: 'api',
        linesOfCode: 20, complexity: 1, dependencies: []
      },

      // DATABASE DISTRICT (Bottom) - Data persistence
      { 
        position: { x: 0, z: -40 }, type: 'module', name: 'src/database/index.ts', district: 'database',
        linesOfCode: 200, complexity: 7, dependencies: ['utils']
      },
      { 
        position: { x: -8, z: -48 }, type: 'class', name: 'DatabaseManager', district: 'database',
        linesOfCode: 280, complexity: 9, dependencies: ['ConnectionPool']
      },
      { 
        position: { x: 8, z: -48 }, type: 'class', name: 'UserRepository', district: 'database',
        linesOfCode: 150, complexity: 5, dependencies: ['QueryBuilder']
      },
      { 
        position: { x: -8, z: -32 }, type: 'function', name: 'connect()', district: 'database',
        linesOfCode: 35, complexity: 3, dependencies: []
      },
      { 
        position: { x: 8, z: -32 }, type: 'function', name: 'query()', district: 'database',
        linesOfCode: 50, complexity: 4, dependencies: ['sanitize']
      },

      // UI DISTRICT (Top) - User interface
      { 
        position: { x: 0, z: 40 }, type: 'module', name: 'src/ui/index.ts', district: 'ui',
        linesOfCode: 90, complexity: 4, dependencies: ['api']
      },
      { 
        position: { x: -8, z: 48 }, type: 'class', name: 'ComponentRenderer', district: 'ui',
        linesOfCode: 180, complexity: 6, dependencies: ['EventHandler']
      },
      { 
        position: { x: 8, z: 48 }, type: 'class', name: 'StateManager', district: 'ui',
        linesOfCode: 120, complexity: 5, dependencies: []
      },
      { 
        position: { x: -8, z: 32 }, type: 'function', name: 'render()', district: 'ui',
        linesOfCode: 40, complexity: 3, dependencies: []
      },
      { 
        position: { x: 8, z: 32 }, type: 'function', name: 'updateState()', district: 'ui',
        linesOfCode: 25, complexity: 2, dependencies: []
      },

      // UTILS DISTRICT (Bottom-left) - Utility functions
      { 
        position: { x: -40, z: -40 }, type: 'module', name: 'src/utils/index.ts', district: 'utils',
        linesOfCode: 60, complexity: 3, dependencies: []
      },
      { 
        position: { x: -48, z: -48 }, type: 'class', name: 'Logger', district: 'utils',
        linesOfCode: 100, complexity: 4, dependencies: []
      },
      { 
        position: { x: -32, z: -48 }, type: 'class', name: 'ConfigManager', district: 'utils',
        linesOfCode: 80, complexity: 3, dependencies: []
      },
      { 
        position: { x: -48, z: -32 }, type: 'function', name: 'formatDate()', district: 'utils',
        linesOfCode: 15, complexity: 1, dependencies: []
      },
      { 
        position: { x: -32, z: -32 }, type: 'function', name: 'validateEmail()', district: 'utils',
        linesOfCode: 20, complexity: 2, dependencies: []
      }
    ];

    // Load a single model
    const loadModel = (path: string): Promise<THREE.Group> => {
      return new Promise((resolve, reject) => {
        console.log(`🏗️ Loading model: ${path}`);
        gltfLoader.load(
          path,
          (gltf: any) => {
            console.log(`✅ Model loaded: ${path}`);
            const model = gltf.scene.clone();
            
            // Ensure model is properly positioned
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            
            // Center the model
            model.position.sub(center);
            model.position.y = size.y / 2;
            
            // Enable shadows
            model.traverse((child: THREE.Object3D) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            
            resolve(model);
          },
          (progress: any) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setLoadingProgress(`Loading: ${percent}%`);
          },
          (error: any) => {
            console.error(`❌ Failed to load model: ${path}`, error);
            reject(error);
          }
        );
      });
    };

    // Create building with semantic design based on code metrics
    const createBuilding = async (buildingData: BuildingData): Promise<CodeBlock> => {
      const { position, type, name, district, linesOfCode, complexity, dependencies } = buildingData;
      
      // Select deterministic model based on type and complexity
      let modelArray: string[];
      let modelIndex: number;
      
      switch (type) {
        case 'module':
          modelArray = modelPaths.modules;
          // Use complexity to determine building style (higher complexity = more elaborate building)
          modelIndex = Math.min(complexity - 1, modelArray.length - 1);
          break;
        case 'class':
          modelArray = modelPaths.classes;
          // Use lines of code to determine building size
          modelIndex = Math.min(Math.floor(linesOfCode / 50), modelArray.length - 1);
          break;
        case 'function':
          modelArray = modelPaths.functions;
          // Use complexity for function building type
          modelIndex = Math.min(complexity - 1, modelArray.length - 1);
          break;
      }
      
      const selectedModel = modelArray[Math.max(0, modelIndex)];
      
      try {
        const model = await loadModel(selectedModel);
        
        // Semantic scaling based on code metrics
        let scale = 1;
        let height = 1;
        
        switch (type) {
          case 'module':
            // Height based on lines of code, width based on dependencies
            scale = 2 + (dependencies.length * 0.3); // Wider base for more dependencies
            height = 2 + (linesOfCode / 100); // Taller for more code
            break;
          case 'class':
            // Scale based on lines of code and complexity
            scale = 1.5 + (linesOfCode / 200);
            height = 1 + (complexity / 10);
            break;
          case 'function':
            // Simple functions are smaller
            scale = 0.8 + (complexity * 0.2);
            height = 0.5 + (linesOfCode / 100);
            break;
        }
        
        // Apply semantic scaling
        model.scale.set(scale, height, scale);
        
        // Add district-based coloring/materials
        const districtColor = districts[district as keyof typeof districts]?.color || 0x666666;
        model.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            // Tint the building with district color
            const material = child.material as THREE.MeshLambertMaterial;
            if (material.color) {
              const originalColor = material.color.getHex();
              const blendedColor = new THREE.Color(originalColor).lerp(new THREE.Color(districtColor), 0.3);
              material.color = blendedColor;
            }
          }
        });
        
        // Create semantic sidewalk
        const sidewalkSize = Math.max(scale * 1.5, 3);
        createSidewalk(position.x, position.z, sidewalkSize, sidewalkSize);
        
        // Position the building
        const buildingGroup = new THREE.Group();
        buildingGroup.add(model);
        buildingGroup.position.set(position.x, 0, position.z);
        buildingGroup.userData = { type, name, district, linesOfCode, complexity, dependencies };
        
        // Set userData on all meshes for proper raycasting
        model.userData = { type, name, district, linesOfCode, complexity, dependencies };
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.userData = { type, name, district, linesOfCode, complexity, dependencies };
          }
        });
        
        scene.add(buildingGroup);
        
        console.log(`✅ Created ${district} building: ${name} (${type}) - ${linesOfCode}LOC, complexity:${complexity}`);
        
        return { mesh: buildingGroup, type, name };
      } catch (error) {
        console.error(`❌ Failed to create building ${name}:`, error);
        throw error;
      }
    };

    // Load all buildings
    const loadAllBuildings = async () => {
      setLoadingProgress('Loading buildings...');
      const buildings: CodeBlock[] = [];
      
      for (let i = 0; i < buildingsData.length; i++) {
        try {
          const building = await createBuilding(buildingsData[i]);
          buildings.push(building);
          setLoadingProgress(`Loaded ${i + 1}/${buildingsData.length} buildings`);
        } catch (error) {
          console.error(`Failed to load building ${buildingsData[i].name}`);
        }
      }
      
      codeBlocksRef.current = buildings;
      setLoadingProgress('');
      setIsLoaded(true);
      console.log(`🏗️ City loaded with ${buildings.length} buildings!`);
    };

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
        // Find the building group
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

    const handleClick = (event: MouseEvent) => {
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
          console.log(`🖱️ Clicked on: ${object.userData.name} (${object.userData.type})`);
          
          // Simple click animation
          const originalScale = object.scale.x;
          object.scale.setScalar(originalScale * 1.1);
          setTimeout(() => {
            object.scale.setScalar(originalScale);
          }, 200);
        }
      }
    };

    mountRef.current.addEventListener('mousemove', handleMouseMove);
    mountRef.current.addEventListener('click', handleClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Start loading buildings
    loadAllBuildings();

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
        mountRef.current.removeEventListener('click', handleClick);
      }
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
          <div className="text-white text-xl">{loadingProgress}</div>
        </div>
      )}
      
      {/* Controls */}
      <div className="absolute bottom-4 left-4 text-white text-sm bg-black/40 p-3 rounded-lg backdrop-blur-sm">
        <p className="mb-1">🖱️ Move mouse to explore</p>
        <p className="mb-1">🖱️ Click buildings to interact</p>
        <p className="text-xs text-gray-400">Real Kenney.nl 3D models</p>
      </div>
      
      {/* Building info */}
      {hoveredBlock && (
        <div className="absolute top-4 right-4 bg-black/90 text-white p-4 rounded-lg backdrop-blur-sm max-w-xs">
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
                  {data.dependencies && data.dependencies.length > 0 && (
                    <div className="text-sm">
                      <span className="text-purple-300">Dependencies:</span> {data.dependencies.length}
                    </div>
                  )}
                  <div className="text-xs opacity-70 mt-2">Click to inspect</div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default BrunoStyleDemo;