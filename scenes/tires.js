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

camera.position.y = 50;
camera.position.x = 50;
camera.position.z = 75;

const car = createCar();
scene.add(car);

function animate( time ) {
    controls.update();
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

function createWheels() {
    const tireGeometry = new THREE.TorusGeometry( 5, 2.5, 16, 100 );
    const tireMaterial = new THREE.MeshBasicMaterial( { color: 0x111111 } );

    const tires = [];

    for (let i = 0; i < 4; i++) {
        const tire = new THREE.Mesh( tireGeometry, tireMaterial );
        tire.rotation.y = Math.PI;
        tires.push(tire);
    }

    tires[0].position.set( -18, 5, 15 );
    tires[1].position.set( 18, 5, 15 );
    tires[2].position.set( -18, 5, -15 );
    tires[3].position.set( 18, 5, -15 );

    return tires;
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

    const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(33, 12, 24),
        new THREE.MeshBasicMaterial({ color: 0xfff4e6 })
    );
    cabin.position.x = -6;
    cabin.position.y = 25.5;
    car.add(cabin);

    return car;
}
