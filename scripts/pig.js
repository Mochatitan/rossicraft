import * as THREE from 'three';
import { Entity } from './entity';
import { update } from 'three/examples/jsm/libs/tween.module.js';

const collisionMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.2
});

const collisionGeometry = new THREE.BoxGeometry(1.001, 1.001, 1.001);

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

    pigGroup = new THREE.Group();

    bodyShape = new THREE.BoxGeometry(0.5, 0.5, 0.8);
    bodySprite = new THREE.Mesh( this.bodyShape, this.bodyMaterial ); 

    headShape = new THREE.BoxGeometry(0.45,0.45,0.45);
    headSprite = new THREE.Mesh( this.headShape, this.headMaterial);

    blockMesh = new THREE.Mesh(collisionGeometry, collisionMaterial);

    radius = 0.5;
    height = 0.8;

    jumpSpeed = 10;
    onGround = false;

    goalBlockRange = 5;

    maxSpeed = 3;
    flySpeed = 3;

    position = new THREE.Vector3();
    rotation = new THREE.Vector3();
    velocity = new THREE.Vector3();

    #worldVelocity = new THREE.Vector3();

    goalBlock = new THREE.Vector3();

    constructor(scene) {
        super(scene);

        this.helpers = new THREE.Group();
        scene.add(this.helpers);

        this.position.set(32, 66, 25);
        this.rotation.set(3.5, 3.5, 3.5);

        this.goalBlock.set(26,59,40);

        this.boundsHelper = new THREE.Mesh(
            new THREE.CylinderGeometry(this.radius, this.radius, this.height, 16),
            new THREE.MeshBasicMaterial({ wireframe: true})
        );


        this.blockMesh.position.copy(this.goalBlock);
        scene.add(this.blockMesh);

        this.pigGroup.position.set(32,66,25);
        this.pigGroup.add(this.bodySprite);
        this.pigGroup.add(this.headSprite);
        //this.pigGroup.add(this.boundsHelper);

        scene.add(this.pigGroup);

        scene.add(this.boundsHelper);

        // Wireframe mesh visualizing the player's bounding cylinder
        
        this.headSprite.position.y = 1;
        

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
     * Visualizes the block the player is colliding with
     * @param {THREE.Vector3} block
     */
    addCollisionHelper() {
        const blockMesh = new THREE.Mesh(collisionGeometry, collisionMaterial);
        this.updateBlockMesh();
        this.helpers.add(blockMesh);
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
            this.velocity.z = 0;

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

            // this.bodySprite.position.x = this.position.x;
            // this.bodySprite.position.y = this.position.y - (0.75 * this.height) + 0.25;
            // this.bodySprite.position.z = this.position.z;

            // this.headSprite.position.x = this.position.x;
            // this.headSprite.position.y = this.position.y;
            // this.headSprite.position.z = this.position.z + 0.6;

            if(!this.inGoalBlock()){
                const dx = ((this.goalBlock.x - this.position.x));
                const dz = ((this.goalBlock.z - this.position.z));
                const d = Math.sqrt((dx*dx) + (dz*dz));

                const xvel = dx/d;
                const zvel = dz/d;

                this.position.x += xvel * dt * this.maxSpeed;
                this.position.z += zvel * dt * this.maxSpeed;

                this.pigGroup.position.x = this.position.x;
                this.pigGroup.position.y = this.position.y;
                this.pigGroup.position.z = this.position.z;

                
            }
                //this.headSprite.lookAt(this.goalBlock);
                //this.bodySprite.lookAt(new THREE.Vector3(this.goalBlock.x, this.position.y, this.goalBlock.z));
            //this.bodySprite.lookAt(this.goalBlock);
            // if(this.inGoalBlock()){
            //     //console.log("In Goal Block");
            // }

            //.log(this.position.x);
    }

    inGoalBlock(){
        if((this.position.x >= this.goalBlock.x - 0.5) && (this.position.x <= this.goalBlock.x + 0.5)){
            if((this.position.z >= this.goalBlock.z - 0.5) && (this.position.z <= this.goalBlock.z + 0.5)){
                //console.log("in goal block method");
                return true;
            }
        }
        return false;
    }

    updateBlockMesh(){
        this.blockMesh.position.x = this.goalBlock.x;
        this.blockMesh.position.y = this.goalBlock.y;
        this.blockMesh.position.z = this.goalBlock.z;
    }
    /**
     * Updates the position of the player's bounding cylinder helper
     */
    updateBoundsHelper() {
        this.boundsHelper.position.copy(this.position);
        this.boundsHelper.position.y -= this.height / 2;
    }

    // lookAtVector(vector){
    //     this.headSprite.lookAt(vector);
    // }

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
    /**
   * Visualizes the block the player is colliding with
   * @param {THREE.Object3D} block 
   */


      randomizeGoalBlock(world){
        const xGoal = getRandomInt(this.position.x - this.goalBlockRange, this.position.x + this.goalBlockRange);
        const zGoal = getRandomInt(this.position.z - this.goalBlockRange, this.position.z + this.goalBlockRange);

        const yGoal = world.getTopBlockY(xGoal, zGoal);

        this.goalBlock.x = xGoal;
        this.goalBlock.y = yGoal;
        this.goalBlock.z = zGoal;

        this.addCollisionHelper(this.goalBlock);
        //clone(world.getTopBlock(x, z).position);
        //console.log("x: "+x); console.log("z: "+z);
        this.updateBlockMesh();
      }

}


function percentChance(chance){
    let random = Math.random();
    if(random < chance){
        return true;
    } else {
        return false;
    }
}
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }