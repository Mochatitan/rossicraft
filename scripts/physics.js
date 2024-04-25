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
    const collisions = [];

    for (const block of candidates) {

        // 1. Get point on block closest to the player
        const p = player.position;
        const closestPoint = {
            x: Math.max(block.x - 0.5, Math.min(p.x, block.x + 0.5)),
            y: Math.max(block.y - 0.5, Math.min(p.y - (player.height /2), block.y + 0.5)),
            z: Math.max(block.z - 0.5, Math.min(p.z, block.z + 0.5)),
        };

        // 2. Determine if point is inside player's bounding cylinder
        const dx = closestPoint.x - player.position.x;
        const dy = closestPoint.y - (player.position.y - (player.height / 2));
        const dz = closestPoint.z - player.position.y;

        if (this.pointInPlayerBoundingCylinder(closestPoint, player)) {
            // Compute the overlap between the point and the player's bounding
            // cylinder along the y-axis and in the xz-plane
            const overlapY = (player.height / 2) - Math.abs(dy);
            const overlapXZ = player.radius - Math.sqrt(dx * dx + dz * dz);

            // Compute the normal of the collision (pointing away from the contact point)
            // and the overlap between the point and the player's bounding cylinder
            let normal, overlap;
            if (overlapY < overlapXZ) {
            normal = new THREE.Vector3(0, -Math.sign(dy), 0);
            overlap = overlapY;
            player.onGround = true;
            } else {
            normal = new THREE.Vector3(-dx, 0, -dz).normalize();
            overlap = overlapXZ;
            }

            collisions.push({
                block,
                contactPoint: closestPoint,
                normal,
                overlap
            });

            this.addContactPointerHelper(closestPoint);
        }

    }

    return collisions;
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


  /**
   * Returns true if the point 'p' is inside the player's bounding cylinder
   * @param {{ x: number, y: number, z: number }} p 
   * @param {Player} player 
   * @returns {boolean}
   */
  pointInPlayerBoundingCylinder(p, player) {
    const dx = p.x - player.position.x;
    const dy = p.y - (player.position.y - (player.height / 2));
    const dz = p.z - player.position.z;
    const r_sq = dx * dx + dz * dz;
  
    // Check if contact point is inside the player's bounding cylinder
    return (Math.abs(dy) < player.height / 2) && (r_sq < player.radius * player.radius);
  }

}