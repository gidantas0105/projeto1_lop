import * as THREE from 'three';

// Setting rendener, scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Green cube
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, cubeMaterial );

// Blue square
const points = [];
points.push( new THREE.Vector3( - 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, - 10, 0 ) );
points.push( new THREE.Vector3( - 10, 0, 0 ) );

const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
const line = new THREE.Line( lineGeometry, lineMaterial );

// Red circle
const circlePoints = [];
const radius = 5;
const segments = 32;
for (let i=0; i<=segments; i++) {
    const angle = (i / 32) * Math.PI * 2;
    circlePoints.push(
        new THREE.Vector3( 
            Math.cos(angle) * radius, 
            Math.sin(angle) * radius, 
            0 
        )
    );
}

const circleGeometry = new THREE.BufferGeometry().setFromPoints( circlePoints );
const circleMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
const circle = new THREE.Line( circleGeometry, circleMaterial );

scene.add( cube, line, circle );

camera.position.z = 20;

function animate( time ) {
    cube.rotation.x = time / 2000;
    cube.rotation.y = time / 1000;

    circle.rotation.x = -time / 2000;
    circle.rotation.y = time / 1000;

    line.rotation.x = time / 4000;
    line.rotation.y = time / 2000;

    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );