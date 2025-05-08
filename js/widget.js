import * as THREE from "three";
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

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
}

export default { render };
