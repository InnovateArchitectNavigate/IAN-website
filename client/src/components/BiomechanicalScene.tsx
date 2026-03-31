import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface BiomechanicalSceneProps {
	scrollContainerRef: React.RefObject<HTMLDivElement | null>;
	onScrollProgress?: (progress: number) => void;
}

export default function BiomechanicalScene({
	scrollContainerRef,
	onScrollProgress,
}: BiomechanicalSceneProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: true,
			alpha: false,
			powerPreference: "high-performance",
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.25;
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x050507);
		scene.fog = new THREE.FogExp2(0x050507, 0.02);

		const camera1 = new THREE.PerspectiveCamera(
			55,
			window.innerWidth / window.innerHeight,
			0.1,
			300
		);
		const camera2 = new THREE.PerspectiveCamera(
			50,
			window.innerWidth / window.innerHeight,
			0.1,
			300
		);
		let activeCamera: THREE.PerspectiveCamera = camera1;

		const clock = new THREE.Clock();

		const pmremGenerator = new THREE.PMREMGenerator(renderer);
		const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
		scene.environment = envTexture;
		pmremGenerator.dispose();

		const spineMaterial = new THREE.MeshStandardMaterial({
			color: 0x1a1a2e,
			metalness: 0.95,
			roughness: 0.1,
			envMapIntensity: 1.8,
			emissive: 0x111422,
			emissiveIntensity: 0.35,
		});

		const brainMaterial = new THREE.MeshStandardMaterial({
			color: 0x2a2a3e,
			metalness: 0.85,
			roughness: 0.18,
			envMapIntensity: 1.4,
			emissive: 0x182033,
			emissiveIntensity: 0.6,
		});

		const glowBlueMat = new THREE.MeshStandardMaterial({
			color: 0x3366cc,
			emissive: 0x1a3388,
			emissiveIntensity: 1.6,
			metalness: 0.2,
			roughness: 0.5,
		});

		const amberMat = new THREE.MeshStandardMaterial({
			color: 0xcc7722,
			emissive: 0x773311,
			emissiveIntensity: 1.4,
			metalness: 0.3,
			roughness: 0.5,
		});

		const spineGroup = new THREE.Group();
		scene.add(spineGroup);

		let spineRoot: THREE.Object3D | null = null;
		let brainObject: THREE.Mesh | null = null;

		const modelBounds = new THREE.Box3();
		const modelCenter = new THREE.Vector3();
		const modelSize = new THREE.Vector3();
		const brainTarget = new THREE.Vector3(0, 8, 0);
		const brainTargetZoomOut = new THREE.Vector3(0, 3, 0);

		const ambientLight = new THREE.AmbientLight(0x0a0a18, 0.8);
		scene.add(ambientLight);

		const keyLight = new THREE.DirectionalLight(0x5577ff, 2.4);
		keyLight.position.set(-6, 25, 8);
		keyLight.castShadow = true;
		keyLight.shadow.mapSize.width = 1024;
		keyLight.shadow.mapSize.height = 1024;
		scene.add(keyLight);

		const fillLight = new THREE.PointLight(0xcc7722, 1.8, 35);
		fillLight.position.set(4, -18, -4);
		scene.add(fillLight);

		const rimLight = new THREE.DirectionalLight(0x99bbff, 1.6);
		rimLight.position.set(8, 8, -10);
		scene.add(rimLight);

		const camLight = new THREE.PointLight(0x4466ff, 1.0, 18);
		scene.add(camLight);

		const spineLight = new THREE.PointLight(0x2244ff, 1.4, 14);
		scene.add(spineLight);

		const fragmentData: Array<{
			mesh: THREE.Mesh;
			baseY: number;
			rotSpeed: THREE.Vector3;
			floatOffset: number;
			floatSpeed: number;
		}> = [];

		const fragmentGeos = [
			new THREE.BoxGeometry(0.08, 0.35, 0.04),
			new THREE.BoxGeometry(0.28, 0.04, 0.04),
			new THREE.OctahedronGeometry(0.09),
			new THREE.TetrahedronGeometry(0.1),
			new THREE.BoxGeometry(0.05, 0.05, 0.22),
		];

		for (let i = 0; i < 40; i++) {
			const geo = fragmentGeos[Math.floor(Math.random() * fragmentGeos.length)];
			const mat =
				Math.random() > 0.75
					? amberMat
					: Math.random() > 0.5
						? glowBlueMat
						: spineMaterial;

			const mesh = new THREE.Mesh(geo, mat);
			const angle = Math.random() * Math.PI * 2;
			const dist = 2.2 + Math.random() * 5;
			const baseY = -22 + Math.random() * 48;

			mesh.position.set(
				Math.cos(angle) * dist,
				baseY,
				Math.sin(angle) * dist
			);

			mesh.rotation.set(
				Math.random() * Math.PI,
				Math.random() * Math.PI,
				Math.random() * Math.PI
			);

			scene.add(mesh);

			fragmentData.push({
				mesh,
				baseY,
				rotSpeed: new THREE.Vector3(
					(Math.random() - 0.5) * 0.012,
					(Math.random() - 0.5) * 0.015,
					(Math.random() - 0.5) * 0.01
				),
				floatOffset: Math.random() * Math.PI * 2,
				floatSpeed: 0.4 + Math.random() * 0.6,
			});
		}

		const PARTICLE_COUNT = 300;
		const pPositions = new Float32Array(PARTICLE_COUNT * 3);
		const pColors = new Float32Array(PARTICLE_COUNT * 3);

		for (let i = 0; i < PARTICLE_COUNT; i++) {
			const angle = Math.random() * Math.PI * 2;
			const dist = 1.2 + Math.random() * 10;
			pPositions[i * 3] = Math.cos(angle) * dist;
			pPositions[i * 3 + 1] = -24 + Math.random() * 52;
			pPositions[i * 3 + 2] = Math.sin(angle) * dist;

			const bright = 0.25 + Math.random() * 0.75;
			if (Math.random() > 0.82) {
				pColors[i * 3] = bright * 0.9;
				pColors[i * 3 + 1] = bright * 0.45;
				pColors[i * 3 + 2] = bright * 0.05;
			} else {
				pColors[i * 3] = bright * 0.2;
				pColors[i * 3 + 1] = bright * 0.45;
				pColors[i * 3 + 2] = bright;
			}
		}

		const pGeo = new THREE.BufferGeometry();
		pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
		pGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));

		const pMat = new THREE.PointsMaterial({
			size: 0.05,
			vertexColors: true,
			transparent: true,
			opacity: 0.8,
			sizeAttenuation: true,
			depthWrite: false,
		});

		const particles = new THREE.Points(pGeo, pMat);
		scene.add(particles);

		function applySpineMaterial(root: THREE.Object3D) {
			root.traverse((child) => {
				if ((child as THREE.Mesh).isMesh) {
					const mesh = child as THREE.Mesh;
					mesh.material = spineMaterial;
					mesh.castShadow = true;
					mesh.receiveShadow = true;
					if (mesh.geometry) {
						mesh.geometry.computeVertexNormals();
					}
				}
			});
		}

		function fitSpineModel(root: THREE.Object3D) {
			modelBounds.setFromObject(root);
			modelBounds.getCenter(modelCenter);
			modelBounds.getSize(modelSize);

			root.position.sub(modelCenter);

			const targetHeight = 18;
			const currentHeight = Math.max(modelSize.y, 0.0001);
			const scale = targetHeight / currentHeight;
			root.scale.setScalar(scale);

			modelBounds.setFromObject(root);
			modelBounds.getCenter(modelCenter);
			modelBounds.getSize(modelSize);

			root.position.x -= modelCenter.x;
			root.position.z -= modelCenter.z;
			root.position.y -= modelBounds.min.y + modelSize.y * 0.08;

			modelBounds.setFromObject(root);
			modelBounds.getSize(modelSize);

			const topY = modelBounds.max.y;
			brainTarget.set(0, topY + .1, 0);
			
			brainTargetZoomOut.set(0, topY - 20, 50);
		}

		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

		const gltfLoader = new GLTFLoader();
		gltfLoader.setDRACOLoader(dracoLoader);
		gltfLoader.load(
			"https://res.cloudinary.com/soggy-ink-games/image/upload/v1774034309/spine_ir6fuh.glb",
			(gltf) => {
				spineRoot = gltf.scene;
				applySpineMaterial(spineRoot);
				fitSpineModel(spineRoot);
				spineGroup.add(spineRoot);

				// Now load the Snake Brain using the calculated brainTarget
				gltfLoader.load(
					"https://res.cloudinary.com/soggy-ink-games/image/upload/v1774934311/snake-brain_aqtzve.glb",
					(brainGltf) => {
						const brainScene = brainGltf.scene;

						// Apply materials and shadows to all meshes in the brain GLB
						brainScene.traverse((node) => {
							if ((node as THREE.Mesh).isMesh) {
								const mesh = node as THREE.Mesh;
								mesh.material = brainMaterial;
								mesh.castShadow = true;
								mesh.receiveShadow = true;
							}
						});

						// Position the brain group
						brainScene.position.copy(brainTarget);
						spineGroup.add(brainScene);

						// Store reference for the animation loop
						// Note: brainObject is now typed as THREE.Object3D | null
						brainObject = brainScene as any;

						camera2.lookAt(brainTargetZoomOut);
					},
					undefined,
					(error) => console.error("Failed to load snake-brain:", error)
				);
			},
			undefined,
			(error) => console.error("Failed to load spine:", error)
		);

		function updateSpiralCamera(progress: number) {
			const startY = 8;
			const endY = 22;
			const y = THREE.MathUtils.lerp(startY, endY, progress);

			const spiralTurns = 3;
			const angle = progress * spiralTurns * Math.PI * 2;
			const radius = THREE.MathUtils.lerp(8.5, 4.2, progress);

			const x = Math.cos(angle) * radius;
			const z = Math.sin(angle) * radius;

			camera1.position.set(x, y, z);

			const lookTarget = new THREE.Vector3(
				0,
				THREE.MathUtils.lerp(8, brainTarget.y - 1, progress),
				0
			);
			camera1.lookAt(lookTarget);

			camLight.position.set(x * 0.45, y + 1.2, z * 0.45);
			spineLight.position.set(0, y - 2, 0);
		}

		function updateBrainTransitionCamera(progress: number) {
			const center = brainTarget.clone();

			const startOffset = new THREE.Vector3(4.5, 2.5, 0);
			const endOffset = new THREE.Vector3(0, 8.5, 0);

			const angle = THREE.MathUtils.lerp(0, Math.PI * 0.5, progress);
			const radiusY = 33.5;
			const radiusX = 33.5;

			const offset = new THREE.Vector3(
				Math.cos(angle) * radiusX,
				Math.sin(angle) * radiusY,
				0
			);

			offset.lerp(endOffset, progress * 0.35);

			camera2.position.copy(center).add(offset);
			camera2.lookAt(center);
		}

		let scrollTrigger: ScrollTrigger | null = null;

		if (scrollContainerRef.current) {
			scrollTrigger = ScrollTrigger.create({
				trigger: scrollContainerRef.current,
				start: "top top",
				end: "bottom bottom",
				scrub: 1.2,
				onUpdate: (self) => {
					const progress = self.progress;

					if (progress <= 0.90) {
						activeCamera = camera1;
						updateSpiralCamera(progress / 0.90);
					} else {
						activeCamera = camera2;
						updateBrainTransitionCamera((progress - 0.90) / 0.1);
					}

					onScrollProgress?.(progress);
				},
			});
		}

		function onResize() {
			const w = window.innerWidth;
			const h = window.innerHeight;

			camera1.aspect = w / h;
			camera1.updateProjectionMatrix();

			camera2.aspect = w / h;
			camera2.updateProjectionMatrix();

			renderer.setSize(w, h);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		}

		window.addEventListener("resize", onResize);

		let animationId = 0;

		function animate() {
			animationId = requestAnimationFrame(animate);
			const elapsed = clock.getElapsedTime();

			for (const item of fragmentData) {
				item.mesh.rotation.x += item.rotSpeed.x;
				item.mesh.rotation.y += item.rotSpeed.y;
				item.mesh.rotation.z += item.rotSpeed.z;
				item.mesh.position.y =
					item.baseY + Math.sin(elapsed * item.floatSpeed + item.floatOffset) * 0.18;
			}

			if (brainObject) {
				// brainObject.rotation.x += 0.0015;
				// brainObject.rotation.y += 0.0022;
				const pulse = 8 + Math.sin(elapsed * 1.2) * 0.04;
				brainObject.scale.setScalar(pulse);
			}

			spineMaterial.emissiveIntensity = 0.3 + Math.sin(elapsed * 1.5) * 0.12;
			particles.rotation.y = elapsed * 0.018;
			fillLight.intensity = 1.8 + Math.sin(elapsed * 0.7) * 0.3;
			fillLight.position.x = 4 + Math.sin(elapsed * 0.3) * 1.2;

			renderer.render(scene, activeCamera);
		}

		animate();

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener("resize", onResize);
			scrollTrigger?.kill();

			scene.traverse((obj) => {
				if ((obj as THREE.Mesh).isMesh) {
					const mesh = obj as THREE.Mesh;
					mesh.geometry?.dispose();

					if (Array.isArray(mesh.material)) {
						mesh.material.forEach((mat) => mat.dispose());
					} else {
						mesh.material?.dispose();
					}
				}
			});

			pGeo.dispose();
			pMat.dispose();
			envTexture.dispose();
			dracoLoader.dispose();
			renderer.dispose();
		};
	}, [scrollContainerRef, onScrollProgress]);

	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 h-full w-full"
			style={{ zIndex: 0 }}
		/>
	);
}