import * as THREE from 'three';
import { PointerLockControls } from './PointerLockControls.js';
import { Entity } from './entity.js';

const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
const sprite = new THREE.Mesh( geometry, material ); 


export class Player extends Entity{

    devMode = false;

    autoJump = true;

    radius = 0.5;
    height = 1.75;
    jumpSpeed = 10;
    onGround = false;

    gamemode = "spectator";
    //spectator, survival, creative

    inventory = [

    ]

    playerCamera = true;
    maxSpeed = 5;
    flySpeed = 3;

    input = new THREE.Vector3();
    velocity = new THREE.Vector3();
    #worldVelocity = new THREE.Vector3();

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
        super(scene);

        this.position.set(32, 64, 32);
        this.camera.position.set(32, 64, 32);

        scene.add(this.camera);
        scene.add(this.cameraHelper);
        scene.add(sprite);

        this.cameraHelper.visible = false;

        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

        // Wireframe mesh visualizing the player's bounding cylinder
        this.boundsHelper = new THREE.Mesh(
            new THREE.CylinderGeometry(this.radius, this.radius, this.height, 16),
            new THREE.MeshBasicMaterial({ wireframe: true})
        );
        scene.add(this.boundsHelper);

        this.boundsHelper.visible = false;
    }

    /**
     * Returns the velocity of the player in world coordinates
     * @returns {THREE.Vector3}
     */
    get worldVelocity() {

        this.#worldVelocity.copy(this.velocity);
        this.#worldVelocity.applyEuler(new THREE.Euler(0, this.camera.rotation.y, 0));
        return this.#worldVelocity;
    }
    
    /**
     * Applies a change in velocity 'dv' that is specified in the world frame
     * @param {THREE.Vector3} dv
     */
    applyWorldDeltaVelocity(dv) {
        dv.applyEuler(new THREE.Euler(0, -this.camera.rotation.y, 0));

        this.velocity.add(dv);
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

            this.position.y += this.velocity.y *dt;

            // document.getElementById("player-position").innerHTML = this.toString();
        }

       

        sprite.position.x = this.position.x;
        sprite.position.y = this.position.y;
        sprite.position.z = this.position.z;

        this.position = this.camera.position;
    }

    /**
     * Updates the position of the player's bounding cylinder helper
     */
    updateBoundsHelper() {
        this.boundsHelper.position.copy(this.camera.position);
        this.boundsHelper.position.y -= this.height / 2;
    }

    // get position() {
    //     return this.camera.position;
    // }

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
                this.camera.position.set(32, 64, 32);
                this.velocity.set(0, 0, 0);
                break;
            case 'Space':
                this.jump();
                // this.keysPressed.SPACE = true;
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
    str += `X: ${this.camera.position.x.toFixed(3)} `;
    str += `Y: ${this.camera.position.y.toFixed(3)} `;
    str += `Z: ${this.camera.position.z.toFixed(3)}`;
    return str;
  }

  toggleDevMode(){

    this.devMode = !this.devMode;

  }
}