// 3D background — particle field + wireframe geometry (Three.js)
import * as THREE from 'three';

const canvas = document.getElementById('bg-canvas');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 9;

const isMobile = window.innerWidth < 720;

// ---- particle starfield (two tinted clouds) ----
function makeCloud(count, color, size, radius) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // random point in a shell so the centre stays airy
    const r = radius * (0.35 + 0.65 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color, size,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}

const cloudA = makeCloud(isMobile ? 500 : 1400, 0x22d3ee, 0.035, 14);
const cloudB = makeCloud(isMobile ? 300 : 800, 0x8b5cf6, 0.045, 11);
scene.add(cloudA, cloudB);

// ---- hero centrepiece: wireframe torus knot + inner icosahedron ----
const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(2.4, 0.72, isMobile ? 120 : 220, isMobile ? 16 : 28),
  new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.14 })
);
const ico = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.3, 1),
  new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.28 })
);
const centre = new THREE.Group();
centre.add(knot, ico);
centre.position.x = isMobile ? 0 : 3.2;
scene.add(centre);

// ---- interaction state ----
let mouseX = 0, mouseY = 0;
window.addEventListener('pointermove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = (e.clientY / window.innerHeight) * 2 - 1;
}, { passive: true });

function syncSize() {
  const w = window.innerWidth, h = window.innerHeight;
  if (w === 0 || h === 0) return; // hidden/prerendered viewport — try again later
  const size = new THREE.Vector2();
  renderer.getSize(size);
  if (size.x !== w || size.y !== h) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
}
window.addEventListener('resize', syncSize);

const clock = new THREE.Clock();

function render() {
  syncSize(); // heals init under a 0×0 viewport (background tab / prerender)
  const t = clock.getElapsedTime();

  cloudA.rotation.y = t * 0.02;
  cloudA.rotation.x = t * 0.008;
  cloudB.rotation.y = -t * 0.015;

  knot.rotation.x = t * 0.12;
  knot.rotation.y = t * 0.18;
  ico.rotation.x = -t * 0.25;
  ico.rotation.y = t * 0.3;

  // mouse parallax (eased)
  camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.04;
  camera.position.y += (-mouseY * 0.4 - camera.position.y - scrollOffset()) * 0.04;
  camera.lookAt(scene.position);

  // fade centrepiece + dim particles past the hero
  const fade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.85));
  knot.material.opacity = 0.14 * fade;
  ico.material.opacity = 0.28 * fade;
  cloudA.material.opacity = 0.25 + 0.5 * fade;
  cloudB.material.opacity = 0.25 + 0.5 * fade;

  renderer.render(scene, camera);
}

function scrollOffset() {
  // gentle downward drift as the page scrolls
  return Math.min(window.scrollY / window.innerHeight, 2.5) * 0.5;
}

if (reduceMotion) {
  render(); // single static frame
} else {
  renderer.setAnimationLoop(render);
}
