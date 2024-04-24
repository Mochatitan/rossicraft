import * as THREE from 'three';
import { blocks } from './blocks'
import { World } from './world';
import { Player } from './player';

const collisionMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.2
});

const collisionGeometry = new THREE.BoxGeometry(1.001, 1.001, 1.001);

export class Physics {
    constructor(scene) {

        this.helpers = new THREE.Group();


        scene.add(this.helpers);
    }

    /**
     * Updates every tick
     * @param {number} dt
     * @param {Player} player
     * @param {World} world
     */

    update(dt, player, world) {
        this.detectCollisions(player, world);
    }

    /**
     * Main function for collision detection
     * @param {Player} player
     * @param {World} world
     */
    detectCollisions(player, world) {

        this.helpers.clear();
        
        const candidates = this.broadPhase(player, world);
        const collisions = this.narrowPhase(candidates, player);
      
        if (collisions.length > 0) {
          this.resolveCollisions(collisions, player);
        }
    }

      /**
   * Performs a rough search against the world to return all
   * possible blocks the player may be colliding with
   * @returns {{ id: number, instanceId: number }[]}
   */
  broadPhase(player, world) {
    const candidates = [];

    const extents = {

        x: {
            min: Math.floor(player.position.x - player.radius),
            max: Math.ceil(player.position.x + player.radius),
        },
        y: {
            min: Math.floor(player.position.y - player.height),
            max: Math.ceil(player.position.y),
        },
        z: {
            min: Math.floor(player.position.z - player.radius),
            max: Math.ceil(player.position.z + player.radius),
        },
    };

    // Loop through all blocks within the player's extends
    // If they aren't empty, then they are a possible collision candidate
    for (let x = extents.x.min; x <= extents.x.max; x++) {
        for (let y = extents.y.min; y <= extents.y.max; y++) {
            for (let z = extents.z.min; z <= extents.z.max; z++) {
                const block = world.getBlock(x, y, z);
                if (block && block.id !== blocks.empty.id) {
                    const blockPos = { x, y, z};
                    candidates.push(blockPos);
                    this.addCollisionHelper(blockPos);
                }
            }
        }
    }

    console.log(`Boardphase Candidates: ${candidates.length}`);

    return candidates;
  }


  narrowPhase(candidates, player){
    return true;
  }
  resolveCollisions(collisions, player){


  }



  /**
   * Visualizes the block the player is colliding with
   * @param {THREE.Object3D} block 
   */
  addCollisionHelper(block) {
    const blockMesh = new THREE.Mesh(collisionGeometry, collisionMaterial);
    blockMesh.position.copy(block);
    this.helpers.add(blockMesh);
  }


}