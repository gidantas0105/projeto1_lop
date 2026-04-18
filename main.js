import * as THREE from 'three';

// Setting rendener, scene and camera
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xadd8e6 );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// // Green cube
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, cubeMaterial );

// // Blue square
// const points = [];
// points.push( new THREE.Vector3( - 10, 0, 0 ) );
// points.push( new THREE.Vector3( 0, 10, 0 ) );
// points.push( new THREE.Vector3( 10, 0, 0 ) );
// points.push( new THREE.Vector3( 0, - 10, 0 ) );
// points.push( new THREE.Vector3( - 10, 0, 0 ) );

// const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
// const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
// const line = new THREE.Line( lineGeometry, lineMaterial );

// // Red circle
// const circlePoints = [];
// const radius = 5;
// const segments = 32;
// for (let i=0; i<=segments; i++) {
//     const angle = (i / 32) * Math.PI * 2;
//     circlePoints.push(
//         new THREE.Vector3( 
//             Math.cos(angle) * radius, 
//             Math.sin(angle) * radius, 
//             0 
//         )
//     );
// }

// const circleGeometry = new THREE.BufferGeometry().setFromPoints( circlePoints );
// const circleMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
// const circle = new THREE.Line( circleGeometry, circleMaterial );

// scene.add( cube, line, circle );

const tireGeometry = new THREE.TorusGeometry( 5, 2.5, 16, 100 );
const tireMaterial = new THREE.MeshBasicMaterial( { color: 0x111111 } );
const tire1 = new THREE.Mesh( tireGeometry, tireMaterial );
tire1.position.set( -10, 10, 0 );
const tire2 = new THREE.Mesh( tireGeometry, tireMaterial );
tire2.position.set( 10, 10, 0 );
const tire3 = new THREE.Mesh( tireGeometry, tireMaterial );
tire3.position.set( -10, -10, 0 );
const tire4 = new THREE.Mesh( tireGeometry, tireMaterial );
tire4.position.set( 10, -10, 0 );

scene.add( tire1, tire2, tire3, tire4 );

camera.position.z = 50;
camera.lookAt( 0, 0, 0 );

function animate( time ) {
    // tire.rotation.x = time / 2000;
    // tire.rotation.y = time / 2000;

    // circle.rotation.x = -time / 2000;
    // circle.rotation.y = time / 1000;

    // line.rotation.x = time / 4000;
    // line.rotation.y = time / 2000;

    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );