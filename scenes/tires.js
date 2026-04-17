import * as THREE from 'three';

// Setting rendener, scene and camera
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xadd8e6 );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', function(e) {
    mouseX = (e.clientX / window.innerWidth) /100;
    mouseY = (e.clientY / window.innerHeight) / 100;
})

const tireGeometry = new THREE.TorusGeometry( 5, 2.5, 16, 100 );
const tireMaterial = new THREE.MeshBasicMaterial( { color: 0x111111 } );

const tires = [];

for (let i = 0; i < 4; i++) {
    const tire = new THREE.Mesh( tireGeometry, tireMaterial );
    tire.rotation.y = Math.PI / 2 ;
    tires.push(tire);
    scene.add(tire);
}

tires[0].position.set( -10, 15, 0 );
tires[1].position.set( 10, 15, 0 );
tires[2].position.set( -10, -15, 0 );
tires[3].position.set( 10, -15, 0 );

camera.position.y = -100;
camera.lookAt( 0, 0, 0 );

function animate( time ) {
    // camera.position.x += (mouseX - camera.position.x);
    // camera.position.y += (-mouseY - camera.position.y);
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );