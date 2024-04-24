import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { World } from './world';
import { createUI } from './ui';
import { Player } from './player';

import {Howl, Howler} from 'howler';
import { music } from './music.js'

// const sound = new Howl({
//     src: ['public/audio/music/sweden.mp3']
//   });
music.ariaMath.play();

const devmode = true;

const stats = new Stats(); //stats for fps and stuff


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
const world = new World();
world.generate();
scene.add(world);

const player = new Player(scene);

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
    player.applyInputs(dt);

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

setupLights();
if(devmode){ createUI(world, player);}
animate();