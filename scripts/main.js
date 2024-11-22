import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { World } from './world';
import { createUI } from './ui';
import { Player } from './player';
import { Physics } from './physics';

import {Howl, Howler} from 'howler';
//import { music } from './music.js'
import { Music } from './music.js';

import { Pig } from './pig.js';

// const sound = new Howl({
//     src: ['public/audio/music/sweden.mp3']
//   });
//music.sweden.play();

// frontend/src/main.js
import axios from 'axios';

// Fetch data from the backend API
// axios.get('http://localhost:3000/api')
//   .then(response => {
//     // Output the message from the backend
//     const message = response.data.message;
//     console.log(message);
//   })
//   .catch(error => {
//     console.error('Error fetching data from backend:', error);
//   });

// Fetch data from the backend API (GET request)
//let seedparams = {};


let seedparams = {};
// axios.get('http://localhost:3000/api/params')
//   .then(response => {
    
//     console.log(response.data);
    
//     seedparams = response.data; 
//   })
//   .catch(error => {
//     console.error('Error fetching data from backend:', error);
//   });
async function fetchSeedParams() {
    try {
      const response = await axios.get('http://localhost:3000/api/params');
      seedparams = response.data;
      console.log(seedparams);
      // Proceed with the rest of your program here
    } catch (error) {
      console.error('Error fetching data from backend:', error);
    }
  }

await fetchSeedParams();
console.log(seedparams);
const devmode = true;

const stats = new Stats(); //stats for fps and stuff
const music = new Music();

music.loadSongs();
music.startLoop();

//Render setup
const renderer = new THREE.WebGLRenderer();
//const renderer = new THREE.WebGLRenderer( { antialias: true}); //anti alias makes edges sharper

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xADD8E6); //set sky color

document.body.appendChild(renderer.domElement);

// Camera Setup
const orbitCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
orbitCamera.position.set(-32, 16, -32);
orbitCamera.lookAt(0, 0, 0);

// Camera Controls
const controls = new OrbitControls(orbitCamera, renderer.domElement);
controls.target.set(16, 0, 16); //make camera look at centre of world

// Scene Setup
const scene = new THREE.Scene();

const world = new World(seedparams);
world.generate();
scene.add(world);

const player = new Player(scene);

const pig = new Pig(scene);

const physics = new Physics(scene);

// Lights Setup
function setupLights() {
    const light1 = new THREE.DirectionalLight();
    light1.position.set(1, 1, 1);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight();
    light2.position.set(-1, 1, -0.5);
    scene.add(light2);

    const ambient = new THREE.AmbientLight();
    ambient.intensity = 0.1;
    scene.add(ambient);
}

//add special stuff for the dev
if(devmode){
    document.body.append(stats.dom);
}


// Render Loop
let previousTime = performance.now();
function animate(){
    let currentTime = performance.now();
    let dt = (currentTime - previousTime) /1000; //time since last frame in seconds

    requestAnimationFrame(animate);
    physics.update(dt, player, world);
    physics.update(dt, pig, world);
    
    if(percentChance(0.015) === true){
        pig.lookAtVector(player.position);
    }
    if(player.playerCamera === false){
        renderer.render(scene, orbitCamera);
    } else if(player.playerCamera === true){
        renderer.render(scene, player.camera);
    }

    //animate stuff for dev
    if(devmode){
        stats.update();
    }

    previousTime = currentTime;
}

window.addEventListener('resize', () => {
    orbitCamera.aspect = window.innerWidth / window.innerHeight;
    orbitCamera.updateProjectionMatrix();
    player.camera.aspect = window.innerWidth / window.innerHeight;
    player.camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function percentChance(chance){
    let random = Math.random();
    if(random < chance){
        return true;
    } else {
        return false;
    }
}
setupLights();
if(devmode){ createUI(world, player, physics, music);}
animate();