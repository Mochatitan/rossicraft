import * as THREE from 'three';

export class Physics {
    constructor() {

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
        const candidates = this.broadPhase(player, world);
        const collisions = this.narrowPhase(candidates, player);
      
        if (collisions.length > 0) {
          this.resolveCollisions(collisions, player);
        }
    }
}