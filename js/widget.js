import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./widget.css";

function render({ model, el }) {
	let btn = document.createElement("button");
	btn.innerHTML = `count is ${model.get("value")}`;
	btn.addEventListener("click", () => {
		model.set("value", model.get("value") + 1);
		model.save_changes();
	});
	model.on("change:value", () => {
		btn.innerHTML = `count is ${model.get("value")}`;
	});
	el.classList.add("gltf_experiments");
	el.appendChild(btn);
	
	// Example: Adding a Three.js scene
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(
		75,
		el.clientWidth / el.clientHeight,
		0.1,
		1000
	);
	const renderer = new THREE.WebGLRenderer();

	// Set a larger height for the renderer
	const sceneHeight = el.clientHeight * 11.5; // Increase height by 50%
	renderer.setSize(el.clientWidth, sceneHeight);
	camera.aspect = el.clientWidth / sceneHeight; // Update camera aspect ratio
	camera.updateProjectionMatrix(); // Apply the updated aspect ratio

	el.appendChild(renderer.domElement);

	// Initialize the GLTF loader
	const loader = new GLTFLoader();
	
	// Default cube as a fallback
	const geometry = new THREE.BoxGeometry();
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	// Example of loading a GLTF model
	// Replace 'path/to/model.gltf' with your actual model path
	loader.load(
		'path/to/model.gltf',
		function (gltf) {
			// Remove the cube when the model loads
			scene.remove(cube);
			
			// Add the loaded model to the scene
			scene.add(gltf.scene);
			
			// Optional: center and scale the model
			const box = new THREE.Box3().setFromObject(gltf.scene);
			const center = box.getCenter(new THREE.Vector3());
			gltf.scene.position.x = -center.x;
			gltf.scene.position.y = -center.y;
			gltf.scene.position.z = -center.z;
		},
		function (xhr) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function (error) {
			console.error('An error happened while loading the model:', error);
		}
	);

	camera.position.z = 5;

	function animate() {
		requestAnimationFrame(animate);
		
		// Only rotate the cube if it's still in the scene
		if (cube.parent) {
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;
		}
		
		renderer.render(scene, camera);
	}
	animate();
}

export default { render };
