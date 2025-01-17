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


const contactMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ff00 });
const contactGeometry = new THREE.SphereGeometry(0.05, 6, 6);

export class Physics {
    gravity = 32;

    simulationRate = 200;
    timestep = 1 / this.simulationRate;
    accumulator = 0;

    constructor(scene) {

        this.helpers = new THREE.Group();
        this.helpers.visible = true;

        scene.add(this.helpers);
    }

    /**
     * Updates every tick
     * @param {number} dt
     * @param {Entity} entity
     * @param {World} world
     */

    update(dt, entity, world) {
        this.accumulator += dt;

        while(this.accumulator >= this.timestep) {

        
            this.helpers.clear();

            entity.velocity.y -= this.gravity * this.timestep;

            entity.applyInputs(this.timestep);
            entity.updateBoundsHelper();

            this.detectCollisions(entity, world);

            this.accumulator -= this.timestep;
        }
    }

    /**
     * Main function for collision detection
     * @param {Entity} entity
     * @param {World} world
     */
    detectCollisions(entity, world) {
        entity.onGround = false;
        const candidates = this.broadPhase(entity, world);
        const collisions = this.narrowPhase(candidates, entity);
      
        if (collisions.length > 0) {
          this.resolveCollisions(collisions, entity);
        }
    }

      /**
   * Performs a rough search against the world to return all
   * possible blocks the player may be colliding with
   * @returns {{ id: number, instanceId: number }[]}
   */
  broadPhase(entity ,world) {
    const candidates = [];

    const extents = {

        x: {
            min: Math.floor(entity.position.x - entity.radius),
            max: Math.ceil(entity.position.x + entity.radius),
        },
        y: {
            min: Math.floor(entity.position.y - entity.height),
            max: Math.ceil(entity.position.y),
        },
        z: {
            min: Math.floor(entity.position.z - entity.radius),
            max: Math.ceil(entity.position.z + entity.radius),
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

    //console.log(`Boardphase Candidates: ${candidates.length}`);

    return candidates;
  }


  narrowPhase(candidates, entity){
    const collisions = [];

    for (const block of candidates) {

        // 1. Get point on block closest to the player
        const p = entity.position;
        const closestPoint = {
            x: Math.max(block.x - 0.5, Math.min(p.x, block.x + 0.5)),
            y: Math.max(block.y - 0.5, Math.min(p.y - (entity.height /2), block.y + 0.5)),
            z: Math.max(block.z - 0.5, Math.min(p.z, block.z + 0.5)),
        };

        // 2. Determine if point is inside player's bounding cylinder
        const dx = closestPoint.x - entity.position.x;
        const dy = closestPoint.y - (entity.position.y - (entity.height / 2));
        const dz = closestPoint.z - entity.position.z;

        if (this.pointInPlayerBoundingCylinder(closestPoint, entity)) {
            // Compute the overlap between the point and the player's bounding
            // cylinder along the y-axis and in the xz-plane
            const overlapY = (entity.height / 2) - Math.abs(dy);
            const overlapXZ = entity.radius - Math.sqrt(dx * dx + dz * dz);

            // Compute the normal of the collision (pointing away from the contact point)
            // and the overlap between the point and the player's bounding cylinder
            let normal, overlap;
            if (overlapY < overlapXZ) {
                normal = new THREE.Vector3(0, -Math.sign(dy), 0);
                overlap = overlapY;
                entity.onGround = true;
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

    //console.log(`Narrowphase Collisions: ${collisions.length}`);

    return collisions;
  }



  resolveCollisions(collisions, entity){

    // Resolve the collisions in order of the smallest overlap to the largest
    collisions.sort((a, b) => {
        return a.overlap < b.overlap;
      });
  
      for (const collision of collisions) {
        // We need to re-check if the contact point is inside the player bounding
        // cylinder for each collision since the player position is updated after
        // each collision is resolved
        if (!this.pointInPlayerBoundingCylinder(collision.contactPoint, entity)) continue;
  
        // Adjust position of player so the block and player are no longer overlapping
        let deltaPosition = collision.normal.clone();
        deltaPosition.multiplyScalar(collision.overlap);
        entity.position.add(deltaPosition);
        // console.log(`X: ${deltaPosition.x}`);
        // console.log(`Z: ${deltaPosition.z}`);

  
        // // Get the magnitude of the player's velocity along the collision normal
        let magnitude = entity.worldVelocity.dot(collision.normal);
        // // Remove that part of the velocity from the player's velocity
        let velocityAdjustment = collision.normal.clone().multiplyScalar(magnitude);
  
        if(!(deltaPosition.x === 0 || deltaPosition.z === 0) && entity.autoJump){
            entity.jump();
            console.log('0 delta');
        }
        // // Apply the velocity to the player
        entity.applyWorldDeltaVelocity(velocityAdjustment.negate());
      }
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
   * Visualizes the contact at the point 'p'
   * @param {{ x, y, z }} p 
   */
    addContactPointerHelper(p) {
        const contactMesh = new THREE.Mesh(contactGeometry, contactMaterial);
        contactMesh.position.copy(p);
        this.helpers.add(contactMesh);
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
