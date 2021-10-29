import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/9.png");
const matcapTexture = textureLoader.load("/textures/particles/matcap.jpg");
// const backgroundTexture = textureLoader.load("/textures/particles/storm.jpg");

// Scene
const scene = new THREE.Scene();
// scene.background = backgroundTexture;

/**
 * Particles
 */

// Geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  positions[i] = (Math.random() - 0.5) * 100;
  colors[i] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.1;
particlesMaterial.sizeAttenuation = true;
particlesMaterial.color = new THREE.Color("#ffffff");
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
// particlesMaterial.alphaTest = 0.001;
// particlesMaterial.depthTest = false;
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending;
particlesMaterial.vertexColors = true;

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Cube
const cube = new THREE.Mesh(
  new THREE.TorusKnotBufferGeometry(10, 10, 300, 3, 1, 1),
  new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
);
cube.receiveShadow = true;
scene.add(cube);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  300,
  sizes.width / sizes.height,
  1.75,
  200
);
camera.position.z = 3;

window.addEventListener("load", function () {
  // create an AudioListener and add it to the camera

  const audio = "ocean.ogg";
  const listener = new THREE.AudioListener();
  scene.add(camera);

  // create a global audio source
  const sound = new THREE.Audio(listener);

  // load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load(audio, function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
  });
  camera.add(listener);
});
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
console.log("cube", particlesMaterial);

const tick = () => {
  const elapsedTime = clock.getElapsedTime() / 6;
  const currentTime = Date.now();
  const deltaTime = currentTime - elapsedTime;
  // Update controls
  controls.update();

  // Update Particles
  //   particles.position.z = -elapsedTime * 0.2;

  for (let j = 0; j < count; j++) {
    const p3 = j;
    const y = particlesGeometry.attributes.position.array[p3 + 1];
    particlesGeometry.attributes.position.array[p3 + 10] = Math.sin(
      elapsedTime + y
    );
    particlesMaterial.size = Math.random();
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  camera.lookAt(cube.position);

  // Update Camera
  camera.position.x = Math.cos(elapsedTime) * Math.ceil(10);
  camera.position.y = Math.cos(elapsedTime / 2) * Math.ceil(10);
  camera.position.z = Math.tan(elapsedTime / 3);
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
