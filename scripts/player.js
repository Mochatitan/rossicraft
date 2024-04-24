import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class Player {

    inventory = [

    ]

    playerCamera = true;
    maxSpeed = 5;
    input = new THREE.Vector3();
    velocity = new THREE.Vector3();

    keysPressed = {
        W: false,
        A: false,
        S: false,
        D: false,
    };

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
    controls = new PointerLockControls(this.camera, document.body);

    constructor(scene) {
        this.position.set(32, 64, 32);
        scene.add(this.camera);

        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    applyInputs(dt) {
        if(this.controls.isLocked) {
            this.velocity.x = 0;
            this.velocity.z = 0;

            if(this.keysPressed.W){this.velocity.z += this.maxSpeed;}
            if(this.keysPressed.A){this.velocity.x -= this.maxSpeed;}
            if(this.keysPressed.S){this.velocity.z -= this.maxSpeed;}
            if(this.keysPressed.D){this.velocity.x += this.maxSpeed;}


            // this.velocity.x = this.input.x;
            // this.velocity.z = this.input.z;
            
            this.controls.moveRight(this.velocity.x * dt);
            this.controls.moveForward(this.velocity.z * dt);
        }
    }

    get position() {
        return this.camera.position;
    }

    onKeyDown(event){
        if (!this.controls.isLocked){
            this.controls.lock();
        }

        switch(event.code){
            case 'KeyW':
                this.keysPressed.W = true;
                this.input.z = this.maxSpeed;
                break;
            case 'KeyA':
                this.keysPressed.A = true;
                this.input. x= -this.maxSpeed;
                break;
            case 'KeyS':
                this.keysPressed.S = true;
                this.input.z = -this.maxSpeed;
                break;
            case 'KeyD':
                this.keysPressed.D = true;
                this.input.x = this.maxSpeed;
                break;
        }
    }

    onKeyUp(event){
        console.log("onKeyUp");
        switch(event.code){
            case 'KeyW':
                this.keysPressed.W = false;
                this.input.z = 0;
                break;
            case 'KeyA':
                this.keysPressed.A = false;
                this.input. x= 0;
                break;
            case 'KeyS':
                this.keysPressed.S = false;
                this.input.z = 0;
                break;
            case 'KeyD':
                this.keysPressed.D = false;
                this.input.x = 0;
                break;
        }
    }

    toggleCamera(){
        console.log("toggleCamera");
        this.playerCamera = !this.playerCamera;
    }

}