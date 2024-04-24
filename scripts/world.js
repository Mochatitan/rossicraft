import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';
import { RNG } from './rng';
import { blocks, resources } from './blocks';

// Create Cube
const geometry = new THREE.BoxGeometry();
//const material = new THREE.MeshLambertMaterial(); //Lambert has shading, basic material does not
const showStone = false;

export class World extends THREE.Group {
    /**
     * @type {{
     * id: number,
     * instanceId: number }
     * [][][]}
     */
    data = [];

    params = {
        seed: 0,
        terrain : {
            scale: 64,
            magnitude: 0.05,
            offset: 0.75
        },

    };
        
    threshold = 0.5;

    constructor(size = {width:64, height: 80}) { //if no size is passed, default will be 32
        super();
        this.size = size;
    }

    generate(){
        const rng = new RNG(this.params.seed);

        this.initializeTerrain();
        this.generateTerrain(rng);
        this.generateResources(rng);
        this.generateMeshes();

    }

    /**
     * initializing the world terrain data
     */
    initializeTerrain(){
        this.data = []; //clear data array
        for (let x = 0; x < this.size.width; x++){
            const slice = [];
            for (let y = 0; y < this.size.height; y++){
                const row = [];
                for (let z = 0; z < this.size.width; z++){
                    row.push({
                        id: blocks.empty.id,
                        instanceId: null
                    });
            
                }
                slice.push(row);
            }
            this.data.push(slice);
        }

    }
    /**
     * generates resources (coal, stone, etc.) for the rest of the world
     */
    generateResources(rng) {
        //this.generateCoal(rng);
        this.generateIron(rng);
    }

    generateCoal(rng){
        const simplex = new SimplexNoise(rng);

        for(let x = 0; x < this.size.width; x++){
            for(let y = 0; y < this.size.height; y++){
                for(let z = 0; z < this.size.width; z++){
                    const value = simplex.noise3d(
                        x/blocks.coalOre.scale.x, 
                        y/blocks.coalOre.scale.y, 
                        z/blocks.coalOre.scale.z
                    );

                    if (
                        (value > blocks.coalOre.scarcity) && 
                        (y < blocks.coalOre.ylevel) && 
                        (y > blocks.coalOre.ymiddlelevel)
                    ){
                        this.setBlockId(x, y, z, blocks.coalOre.id);
                    }

                    if (
                        (value > (blocks.coalOre.scarcity+blocks.coalOre.rarityincrease)) &&
                        (y < blocks.coalOre.ymiddlelevel) &&
                        (y > blocks.coalOre.ybottomlevel)
                    ){
                        this.setBlockId(x, y, z, blocks.coalOre.id);
                    }
                }
            }
        }

    }

    generateIron(rng){
        const simplex = new SimplexNoise(rng);

        for(let x = 0; x < this.size.width; x++){
            for(let y = 0; y < this.size.height; y++){
                for(let z = 0; z < this.size.width; z++){
                    const value = simplex.noise3d(
                        x/blocks.ironOre.scale.x, 
                        y/blocks.ironOre.scale.y, 
                        z/blocks.ironOre.scale.z
                    );

                    if (
                        (value > blocks.ironOre.scarcity) && 
                        (y < blocks.ironOre.ylevel)
                    ){
                        this.setBlockId(x, y, z, blocks.ironOre.id);
                    }

                }
            }
        }

    }

    generateTerrain(rng) {
        const simplex = new SimplexNoise(rng);
        for (let x = 0; x < this.size.width; x++) {
            for (let z = 0; z < this.size.width; z++){
                const value = simplex.noise(
                    x / this.params.terrain.scale, 
                    z / this.params.terrain.scale
                );

                // Scale the noise based on the magnitude/offset
                const scaledNoise = this.params.terrain.offset + this.params.terrain.magnitude * value;

                // Computing the height of the terrain at this x-z location
                let height = Math.floor(this.size.height * scaledNoise);

                // Clamping height between 0 and max height
                height = Math.max(0, Math.min(height, this.size.height));

                // Fill in all blocks at or below the terrain height
                for (let y =  0; y <= this.size.height; y++){
                    if (y < height && this.getBlock(x, y, z).id === blocks.empty.id){
                        this.setBlockId(x, y, z, blocks.dirt.id);
                    } else if (y === height){
                        this.setBlockId(x, y, z, blocks.grass.id);
                    } else if(y > height){
                        this.setBlockId(x, y, z, blocks.empty.id);
                    } 

                    if(y < height-blocks.stone.depth){
                        if(showStone){
                            this.setBlockId(x, y, z, blocks.stone.id);
                        } else{
                            this.setBlockId(x, y, z, blocks.empty.id);
                        }
                    }
                }
            }
        }
    }

    generateMeshes(){
        this.clear();
        //

        // Create a lookup table where key is block ID
        const meshes = {};

        Object.values(blocks)
            .filter(blockType => blockType.id !== blocks.empty.id)
            .forEach(blockType => {
                const maxCount = this.size.width * this.size.width * this.size.height;
                const mesh = new THREE.InstancedMesh(geometry, blockType.material,  maxCount);
                mesh.name = blockType.name;
                mesh.count = 0;

                meshes[blockType.id] = mesh;
            });
            
        


        const matrix = new THREE.Matrix4();

        for (let x = 0; x < this.size.width; x++) {
            for(let y = 0; y < this.size.height; y++){
                for(let z = 0; z < this.size.width; z++){
                    const blockId = this.getBlock(x, y, z).id;
                    
                    if(blockId === blocks.empty.id) continue;

                    const mesh = meshes[blockId];
                    const instanceId = mesh.count;

                    if (!this.isBlockObscured(x, y, z)) {
                        matrix.setPosition(x + 0.5, y + 0.5, z + 0.5); // +0.5 because the center of the box is at the origin but the lower left corner is now lower left corner of first box.
                        mesh.setMatrixAt(instanceId, matrix);
                        //mesh.setColorAt(instanceId, new THREE.Color(blockType.color));
                        this.setBlockInstanceId(x, y, z, instanceId);
                        mesh.count++;
                    }
                }
            }
        }

        this.add(...Object.values(meshes));
    }

    // Helper Methods
    
    /**
    * Returns true if this block is completely hidden by other blocks
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @returns {boolean}
   */
  isBlockObscured(x, y, z) {
    const up = this.getBlock(x, y + 1, z)?.id ?? blocks.empty.id;
    const down = this.getBlock(x, y - 1, z)?.id ?? blocks.empty.id;
    const left = this.getBlock(x + 1, y, z)?.id ?? blocks.empty.id;
    const right = this.getBlock(x - 1, y, z)?.id ?? blocks.empty.id;
    const forward = this.getBlock(x, y, z + 1)?.id ?? blocks.empty.id;
    const back = this.getBlock(x, y, z - 1)?.id ?? blocks.empty.id;
  
    // If any of the block's sides is exposed, it is not obscured
    if (up === blocks.empty.id ||
        down === blocks.empty.id || 
        left === blocks.empty.id || 
        right === blocks.empty.id || 
        forward === blocks.empty.id || 
        back === blocks.empty.id) {
      return false;
    } else {
      return true;
    }
  }
     /** 
     *  Gets the block data at (x, y, z)
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @returns {{id: number, instanceID: number}}
     */
    getBlock(x, y, z){
        if (this.inBounds(x, y, z)) {
            return this.data[x][y][z];
        } else {
            return null;
        }
    }
    /**
     * Sets the block id for the block at {x, y, z}
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {number} id 
     */
    setBlockId(x, y, z, id){
        if (this.inBounds(x, y, z)) {
            this.data[x][y][z].id =  id;      
         } 
    }

    /**
     * Sets the block instance id for the block at (x, y, z)
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {number} instanceId 
     */
    setBlockInstanceId(x, y, z, instanceId) {
        if (this.inBounds(x, y, z)) {
            this.data[x][y][z].instanceId = instanceId;
        }
    }

    /**
     *  Checks if the (x, y, z) coordinates are within bounds
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @returns {boolean}
     */
    inBounds(x, y, z) {
        if( x >= 0 && x < this.size.width &&
            y >= 0 && y < this.size.height &&
            z >= 0 && z < this.size.width) 
        {
            return true;
        } else {
            return false;
        }
    }
}