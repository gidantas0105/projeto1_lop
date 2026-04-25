import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// Setting rendener, scene and camera
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xadd8e6 );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);

const keys = {
  w: false, a: false, s: false, d: false
};

window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

camera.position.y = 50;
camera.position.x = 50;
camera.position.z = 35;

const car = createCar();
car.rotation.y = 11 * Math.PI / 12;
scene.add(car);

const cameraOffset = new THREE.Vector3().subVectors(camera.position, car.position);

function animate( time ) {
    const speed = 0.5;
    if (keys.w) car.position.x -= speed;
    if (keys.s) car.position.x += speed;

    camera.position.copy(car.position).add(cameraOffset);
    camera.lookAt(car.position);

    controls.target.copy(car.position);
    controls.update();
    
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

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

    return car;
}
