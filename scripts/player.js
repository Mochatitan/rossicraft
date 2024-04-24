import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class Player{


    gamemode = "spectator";
    //spectator, survival, creative

    inventory = [

    ]

    playerCamera = true;
    maxSpeed = 5;
    flySpeed = 3;

    input = new THREE.Vector3();
    velocity = new THREE.Vector3();

    keysPressed = {
        W: false,
        A: false,
        S: false,
        D: false,
        SPACE: false,
        SHIFT: false,
    };



    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
    controls = new PointerLockControls(this.camera, document.body);
    cameraHelper = new THREE.CameraHelper(this.camera);



    constructor(scene) {
        this.position.set(32, 64, 32);
        scene.add(this.camera);
        scene.add(this.cameraHelper);

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


            if(this.keysPressed.SPACE){this.velocity.y += this.flySpeed;}
            // this.velocity.x = this.input.x;
            // this.velocity.z = this.input.z;
            
            this.controls.moveRight(this.velocity.x * dt);
            this.controls.moveForward(this.velocity.z * dt);

            document.getElementById("player-position").innerHTML = this.toString();
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
                break;
            case 'KeyA':
                this.keysPressed.A = true;
                break;
            case 'KeyS':
                this.keysPressed.S = true;
                break;
            case 'KeyD':
                this.keysPressed.D = true;
                break;
            case 'keyR':
                this.position.set(32, 64, 32);
                this.velocity.set(0, 0, 0);
                break;
            case 'keySPACE':
                this.keysPressed.SPACE = true;
        }
    }

    onKeyUp(event){
        console.log("onKeyUp");
        switch(event.code){
            case 'KeyW':
                this.keysPressed.W = false;
                break;
            case 'KeyA':
                this.keysPressed.A = false;
                break;
            case 'KeyS':
                this.keysPressed.S = false;
                break;
            case 'KeyD':
                this.keysPressed.D = false;
                break;
            case 'keySPACE':
                this.keysPressed.SPACE = false;
        }
    }

    toggleCamera(){
        console.log("toggleCamera");
        this.playerCamera = !this.playerCamera;
    }

  /**
   * Returns player position in a readable string form
   * @returns {string}
   */
  toString() {
    let str = '';
    str += `X: ${this.position.x.toFixed(3)} `;
    str += `Y: ${this.position.y.toFixed(3)} `;
    str += `Z: ${this.position.z.toFixed(3)}`;
    return str;
  }
}