import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import * as tf from 'https://unpkg.com/@tensorflow/tfjs';
import * as handpose from 'https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose@0.0.7/+esm';

// Setting rendener, scene and camera
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xadd8e6 );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(75, 50, 50);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

// Constants
const keys = {
  w: false, a: false, s: false, d: false
};

const gesture = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

const cameraOffset = new THREE.Vector3(-80, 50, 20);

const speedStraight = 1;
const speedRotation = 0.02;

window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

// Building the scene
const environment = createEnvironment();
scene.add(environment);

const car = createCar();
scene.add(car);

function animate( time ) {
    trackMovement();
    syncCameraCar();
    
    renderer.render( scene, camera );
}

function createEnvironment() {
    const environment = new THREE.Group();

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(2000, 2000),
        new THREE.MeshBasicMaterial({ color: 0x8fbf7a })
    );
    ground.rotation.x = -Math.PI / 2;
    environment.add(ground);

    const roomSize = 2000;
    const wallHeight = 100;
    const cornerSize = 5;

    const roomMaterial = new THREE.MeshBasicMaterial({ color: 0xC9B7B1, side: THREE.BackSide });
    const room = new THREE.Mesh(new THREE.BoxGeometry(roomSize + cornerSize, wallHeight, roomSize + cornerSize), roomMaterial);
    room.position.set(0, wallHeight / 2, 0);
    room.position.y = 0.01; 
    environment.add(room);

    const stripeGeometry = new THREE.PlaneGeometry(24, 4);
    const stripeMaterial = new THREE.MeshBasicMaterial({
        color: 0xf7f3a1,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
    });

    for (let x = -900; x <= 900; x += 60) {
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(x, 0.05, 0);
        environment.add(stripe);
    }

    return environment;
}

function createWheels() {
    const tireGeometry = new THREE.TorusGeometry( 5, 2.5, 16, 100 );
    const tireMaterial = new THREE.MeshBasicMaterial( { color: 0x111111 } );

    const cilinderGeometry = new THREE.CylinderGeometry( 3, 3, 3.5, 16 );
    const cilinderMaterial = new THREE.MeshBasicMaterial( { color: 0x666666 } );

    const tires = [];

    for (let i = 0; i < 4; i++) {
        const tire = new THREE.Mesh( tireGeometry, tireMaterial );
        const cilinder = new THREE.Mesh(cilinderGeometry, cilinderMaterial);
        cilinder.rotation.x = Math.PI/2;

        const wheel = new THREE.Group();
        wheel.add(tire);
        wheel.add(cilinder);
        wheel.rotation.y = Math.PI;
        tires.push(wheel);

    }

    tires[0].position.set( -18, 5, 15 );
    tires[1].position.set( 18, 5, 15 );
    tires[2].position.set( -18, 5, -15 );
    tires[3].position.set( 18, 5, -15 );

    return tires;
}

function getCarFrontTexture () {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 24);

    return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 128, 32);

  context.fillStyle = "#666666";
  context.fillRect(10, 8, 38, 24);
  context.fillRect(58, 8, 60, 24);

  return new THREE.CanvasTexture(canvas);
}

function createCar() {
    const car = new THREE.Group();

    const wheels = createWheels();
    car.add(...wheels);

    const main = new THREE.Mesh(
        new THREE.BoxGeometry(60, 15, 30),
        new THREE.MeshBasicMaterial({ color: 0xff9bb3 })
    );
    main.position.y = 12;
    car.add(main);

    const carFrontTexture = getCarFrontTexture();

    const carBackTexture = getCarFrontTexture();

    const carRightSideTexture = getCarSideTexture();

    const carLeftSideTexture = getCarSideTexture();
    carLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
    carLeftSideTexture.rotation = Math.PI;
    carLeftSideTexture.flipY = false;

    const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(33, 12, 24), [
                new THREE.MeshBasicMaterial({ map: carFrontTexture }),
                new THREE.MeshBasicMaterial({ map: carBackTexture }),
                new THREE.MeshBasicMaterial({ color: 0xffffff }), 
                new THREE.MeshBasicMaterial({ color: 0xffffff }), 
                new THREE.MeshBasicMaterial({ map: carRightSideTexture }),
                new THREE.MeshBasicMaterial({ map: carLeftSideTexture }),
        ]
    );
    cabin.position.x = -6;
    cabin.position.y = 25.5;
    car.add(cabin);  
    car.rotation.y = Math.PI;

    return car;
}

function trackMovement() {
  if (gesture.forward || keys.w) car.translateX(speedStraight);
  if (gesture.backward || keys.s) car.translateX(-speedStraight);

  if (gesture.left || keys.a) {
    car.rotation.y += speedRotation;
    car.translateX(speedStraight * 0.5);
  }
  if (gesture.right || keys.d) {
    car.rotation.y -= speedRotation;
    car.translateX(speedStraight * 0.5);
  }
}

function trackCameraMovement(x, y, z) {
    const targetRotationY = Math.atan2(x, z);
    const targetRotationX = Math.atan2(y, z);

    car.rotation.y += (targetRotationY - car.rotation.y) * 0.05;
    car.rotation.x += (targetRotationX - car.rotation.x) * 0.05;

    const distance = Math.sqrt(x * x + y * y + z * z);
    const targetOffsetZ = -Math.min(100, distance * 1.5);
    cameraOffset.z += (targetOffsetZ - cameraOffset.z) * 0.05;
}

function syncCameraCar() {
    const cameraPosition = cameraOffset.clone();
    car.localToWorld(cameraPosition);
    camera.position.copy(cameraPosition);
    camera.lookAt(car.position);
}

async function setupCamera() {
  const video = document.getElementById('video');
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode: 'user', width: 640, height: 480 }
  });
  video.srcObject = stream;
  return new Promise(resolve => {
    video.onloadedmetadata = () => resolve(video);
  });
}

// Contagem dos dedos levantados (Ponta do dedo mais alta que a base do dedo)
function countFingers(landmarks) {
  const tips  = [8, 12, 16, 20]; // Índices dos pontos finais dos dedos (exceto o polegar) em handPose
  const bases = [5,  9, 13, 17]; // Índices dos pontos de base dos dedos (exceto o polegar) em handPose
  let count = 0;
  for (let i = 0; i < 4; i++) {
    if (landmarks[tips[i]][1] < landmarks[bases[i]][1]) count++;
  }
  return count;
}

async function gestureLoop(video, handModel) {
  const hands = await handModel.estimateHands(video);

  // Reseta gestos a cada frame
  gesture.forward = gesture.backward = gesture.left = gesture.right = false;

  for (const hand of hands) {
    const lm = hand.landmarks;
    const wristX = lm[0][0];
    const isLeft = wristX > video.videoWidth / 2; // Pulso na metade esqueda do vídeo? => Mão esquerda
    const fingers = countFingers(lm);

    if (isLeft) {
      if (fingers === 1) gesture.forward = true;
      if (fingers === 2) gesture.backward = true;
    } else {
      if (fingers === 1) gesture.left = true;
      if (fingers === 2) gesture.right = true;
    }
  }

  // Desenha o vídeo invertido (espelhado) para aparecer na tela
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');
  canvas.width = 640;
  canvas.height = 480;
  ctx.save();
  ctx.scale(-1, 1);
  ctx.translate(-640, 0);
  ctx.drawImage(video, 0, 0, 640, 480);
  ctx.restore();

  requestAnimationFrame(() => gestureLoop(video, handModel));
}

async function initGestures() {
  const video = await setupCamera();
  video.play();
  const handModel = await handpose.load();
  gestureLoop(video, handModel);
}

async function start() {
  await initGestures();         // wait for camera + HandPose to be ready
  renderer.setAnimationLoop(animate); // only start rendering once gestures are live
}

start();
