import * as THREE from 'three';


export class Entity{

    bodyShape = new THREE.BoxGeometry(0.5, 0.8, 0.5);
    bodyMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    bodySprite = new THREE.Mesh( this.bodyShape, this.bodyMaterial ); 

    headShape = new THREE.BoxGeometry(0.2,0.2,0.2);
    headMaterial = new THREE.MeshBasicMaterial( {color: 0x0078d4});
    headSprite = new THREE.Mesh( this.headShape, this.headMaterial);

    // radius = 0.5;
    // height = 1.75;

    jumpSpeed = 10;
    onGround = false;


    playerCamera = true;
    maxSpeed = 5;
    flySpeed = 3;

    position = new THREE.Vector3();
    velocity = new THREE.Vector3();
    #worldVelocity = new THREE.Vector3();

    constructor(scene) {
        //this.position.set(32, 64, 32);
        // scene.add(this.bodySprite);
        // scene.add(this.headSprite);
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

            // if(this.keysPressed.W){this.velocity.z += this.maxSpeed;}
            // if(this.keysPressed.A){this.velocity.x -= this.maxSpeed;}
            // if(this.keysPressed.S){this.velocity.z -= this.maxSpeed;}
            // if(this.keysPressed.D){this.velocity.x += this.maxSpeed;}


            // if(this.keysPressed.SPACE){this.velocity.y += this.flySpeed;}
            // this.velocity.x = this.input.x;
            // this.velocity.z = this.input.z;
            
            this.controls.moveRight(this.velocity.x * dt);
            this.controls.moveForward(this.velocity.z * dt);

            this.position.y += this.velocity.y *dt;
        }

        headSprite.position.x = this.position.x;
        headSprite.position.y = this.position.y + 8;
        headSprite.position.z = this.position.z;

        bodySprite.position.x = this.position.x;
        bodySprite.position.y = this.position.y;
        bodySprite.position.z = this.position.z;
    }

    /**
     * Updates the position of the player's bounding cylinder helper
     */
    updateBoundsHelper() {
        this.boundsHelper.position.copy(this.position);
        this.boundsHelper.position.y -= this.height / 2;
    }

  /**
   * Returns entity position in a readable string form
   * @returns {string}
   */
  toString() {
    let str = '';
    str += `X: ${this.position.x.toFixed(3)} `;
    str += `Y: ${this.position.y.toFixed(3)} `;
    str += `Z: ${this.position.z.toFixed(3)}`;
    return str;
  }


    loadTexture(path){
        const texture = this.textureLoader.load(path);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;

    }


    jump(){
        if(this.onGround) {
            this.velocity.y += this.jumpSpeed;
        }
    }
}