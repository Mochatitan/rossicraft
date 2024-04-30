import * as THREE from 'three';
import { Entity } from './entity';

export class Pig extends Entity{

    textureLoader = new THREE.TextureLoader();

    textures = {
        pigHead: this.loadTexture("textures/pigFace.png"),
        pigBody: this.loadTexture("textures/pinkTexture.jpg"),
    };

    headMaterial = [
        new THREE.MeshLambertMaterial({ map: this.textures.pigBody }), // right
        new THREE.MeshLambertMaterial({ map: this.textures.pigBody }), // left
        new THREE.MeshLambertMaterial({ map: this.textures.pigBody }), // top
        new THREE.MeshLambertMaterial({ map: this.textures.pigBody }), // bottom
        new THREE.MeshLambertMaterial({ map: this.textures.pigHead }), // front
        new THREE.MeshLambertMaterial({ map: this.textures.pigBody })  // back
      ];
      bodyMaterial = [
        new THREE.MeshLambertMaterial({ map: this.textures.pigBody }), // right
        new THREE.MeshLambertMaterial({ map: this.textures.pigBody }), // left
        new THREE.MeshLambertMaterial({ map: this.textures.pigBody }), // top
        new THREE.MeshLambertMaterial({ map: this.textures.pigBody }), // bottom
        new THREE.MeshLambertMaterial({ map: this.textures.pigHead }), // front
        new THREE.MeshLambertMaterial({ map: this.textures.pigBody })  // back
      ];

    bodyShape = new THREE.BoxGeometry(0.5, 0.5, 0.8);
    bodySprite = new THREE.Mesh( this.bodyShape, this.bodyMaterial ); 

    headShape = new THREE.BoxGeometry(0.45,0.45,0.45);
    headSprite = new THREE.Mesh( this.headShape, this.headMaterial);

    radius = 0.5;
    height = 0.8;

    jumpSpeed = 10;
    onGround = false;

    maxSpeed = 5;
    flySpeed = 3;

    position = new THREE.Vector3();
    rotation = new THREE.Vector3();
    velocity = new THREE.Vector3();

    #worldVelocity = new THREE.Vector3();

    goalBlock = new THREE.Vector3();

    constructor(scene) {
        super(scene);
        this.position.set(32, 66, 25);
        this.rotation.set(3.5, 3.5, 3.5);

        this.goalBlock.set(32,64,40);

        
        scene.add(this.bodySprite);
        scene.add(this.headSprite);

        // Wireframe mesh visualizing the player's bounding cylinder
        this.boundsHelper = new THREE.Mesh(
            new THREE.CylinderGeometry(this.radius, this.radius, this.height, 16),
            new THREE.MeshBasicMaterial({ wireframe: true})
        );
        scene.add(this.boundsHelper);

    }

    /**
     * Returns the velocity of the player in world coordinates
     * @returns {THREE.Vector3}
     */
    get worldVelocity() {

        this.#worldVelocity.copy(this.velocity);
        this.#worldVelocity.applyEuler(new THREE.Euler(0, this.rotation.y, 0));
        return this.#worldVelocity;
    }
    
    /**
     * Applies a change in velocity 'dv' that is specified in the world frame
     * @param {THREE.Vector3} dv
     */
    applyWorldDeltaVelocity(dv) {
        dv.applyEuler(new THREE.Euler(0, -this.rotation.y, 0));

        this.velocity.add(dv);
    }

    applyInputs(dt) {
            this.velocity.x = 0;
            this.velocity.z = 0.3;

            // if(this.keysPressed.W){this.velocity.z += this.maxSpeed;}
            // if(this.keysPressed.A){this.velocity.x -= this.maxSpeed;}
            // if(this.keysPressed.S){this.velocity.z -= this.maxSpeed;}
            // if(this.keysPressed.D){this.velocity.x += this.maxSpeed;}


            // if(this.keysPressed.SPACE){this.velocity.y += this.flySpeed;}
            // this.velocity.x = this.input.x;
            // this.velocity.z = this.input.z;
            
            // this.controls.moveRight(this.velocity.x * dt);
            // this.controls.moveForward(this.velocity.z * dt);
            this.position.z += (this.velocity.z * dt);

            this.position.y += this.velocity.y *dt;

        this.bodySprite.position.x = this.position.x;
        this.bodySprite.position.y = this.position.y - (0.75 * this.height) + 0.25;
        this.bodySprite.position.z = this.position.z;

        this.headSprite.position.x = this.position.x;
        this.headSprite.position.y = this.position.y;
        this.headSprite.position.z = this.position.z + 0.6;

        // this.rotation.x += 1;

        // this.bodySprite.rotation.copy(this.rotation);
        // this.bodySprite.rotateY(0.05 * dt);

        // this.position.angleTo(this.rotation);

        // this.bodySprite.lookAt(this.goalBlock);

        // this.headSprite.lookAt(this.goalBlock);


        // const e = new THREE.Euler( 0, 3.14, 0, 'XYZ' );
        // const q = new THREE.Quaternion().setFromEuler( e );
        // const v = new THREE.Vector3( 0, 0, 1).applyQuaternion( q );

        // const offset = 1; // world units
        // this.position.add( v.multiplyScalar( offset * dt ) );

        // //this.bodySprite.rotation.setFromQuaternion(q);
        // //this.headSprite.rotation.setFromScalar(v.multiplyScalar(offset * dt));
        // this.headSprite.lookAt(this.goalBlock);
        // //this.bodySprite.setRotationFromEuler(e);
        // this.bodySprite.setRotationFromEuler(e);
        // //this.rotation.applyEuler(e);
        // console.log( v.multiplyScalar(offset * dt));

        const dx = this.goalBlock.x - this.position.x;
        //this.position.x += (this.goalBlock.position.x - this.position.x);

    }

    /**
     * Updates the position of the player's bounding cylinder helper
     */
    updateBoundsHelper() {
        this.boundsHelper.position.copy(this.position);
        this.boundsHelper.position.y -= this.height / 2;
    }

    lookAtVector(vector){
        this.headSprite.lookAt(vector);
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
}