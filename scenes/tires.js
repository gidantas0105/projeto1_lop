const cameraOffset = new THREE.Vector3(-80, 50, 20);
const speedStraight = 0.5;
const speedRotation = 0.005;
const width = 640;
const height = 480;
const keys = {
  w: false, a: false, s: false, d: false
};

// Setting rendener, scene and camera
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xadd8e6 );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(75, 50, 50);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

const container = document.getElementById( 'threeContainer' );
container.appendChild( renderer.domElement );

window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

const environment = createEnvironment();
scene.add(environment);

const car = createCar();
scene.add(car);

animate();

function createEnvironment() {
    const environment = new THREE.Group();

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(2000, 2000),
        new THREE.MeshBasicMaterial({ color: 0x8fbf7a })
    );
    ground.rotation.x = -Math.PI / 2;
    environment.add(ground);

    const road = new THREE.Mesh(
        new THREE.PlaneGeometry(2000, 80),
        new THREE.MeshBasicMaterial({
            color: 0x303030,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        })
    );
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0;
    environment.add(road);

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

function trackMovementKeys() {
    if (keys.w) car.translateX(speedStraight);
    if (keys.s) car.translateX(-speedStraight);

    if (keys.a) {
        car.rotation.y += speedRotation;
        car.translateX(speedStraight);
    }
    if (keys.d) {
        car.rotation.y -= speedRotation;
        car.translateX(speedStraight);
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

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function animate() {
    trackMovementKeys();
    syncCameraCar();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
  }

  const video = document.getElementById('video');
  video.width = width;
  video.height = height;

  const mobile = isMobile();
  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      facingMode: 'user',
      width: mobile ? undefined : width,
      height: mobile ? undefined : height,
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function loadVideo() {
  const video = await setupCamera();
  video.play();

  return video;
}

let net;

// Main animation loop
function render(video, net) {
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');

  // Flip the webcam image to get it right
  const flipHorizontal = true;

  canvas.width = width;
  canvas.height = height;

  async function detect() {

    // Scale the image. The smaller the faster
    const imageScaleFactor = 0.75;

    // Stride, the larger, the smaller the output, the faster
    const outputStride = 32;

    // Store all the poses
    let poses = [];
    let minPoseConfidence;
    let minPartConfidence;

    const pose = await net.estimateSinglePose(video, 
                                              imageScaleFactor, 
                                              flipHorizontal, 
                                              outputStride);
    poses.push(pose);

    // Show a pose (i.e. a person) only if probability more than 0.1
    minPoseConfidence = 0.1;
    // Show a body part only if probability more than 0.3
    minPartConfidence = 0.3;

    ctx.clearRect(0, 0, width, height);

    const showVideo = true;

    if (showVideo) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-width, 0);
      // ctx.filter = 'blur(5px)';
    //   ctx.filter = 'opacity(50%) blur(3px) grayscale(100%)';
      ctx.drawImage(video, 0, 0, width, height);
      ctx.restore();
    }

    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        keypoints.forEach((d,i)=>{
          if(d.score>minPartConfidence){
          // console.log(d.part);
          // Positions need some scaling
          trackCameraMovement(d.position.x*0.5, d.position.y*0.5-height/4,0);
        //   trackers[i].display();
          }
          // Move out of screen if body part not detected
          else if(d.score<minPartConfidence){
          return;
          }
        })
      }
    });

    requestAnimationFrame(detect);
  }

  detect();

}

async function main() {
  // Load posenet
  const net = await posenet.load(0.75);

  document.getElementById('main').style.display = 'block';
  let video;

  try {
    video = await loadVideo();
  } catch (e) {
    let info = document.getElementById('info');
    info.textContent = 'this browser does not support video capture,' +
        'or this device does not have a camera';
    info.style.display = 'block';
    throw e;
  }

  render(video, net);
}

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


main();
