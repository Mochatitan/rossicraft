import * as THREE from 'three';

// Create Cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({ color: 0x00d000 }); //Lambert has shading, basic material does not

export class World extends THREE.Group {
    /**
     * @type {{
     * id: number,
     * instanceId: number }
     * [][][]}
     */
    data = [];

    constructor(size = {width:64, height: 32}) { //if no size is passed, default will be 32
        super();
        this.size = size;
    }

    generate(){


    }

    generateTerrain(){
        this.data = []; //clear data array
        for (let x = 0; x < this.size.width; x++){
            const slice = [];
            for (let y = 0; y < this.size.height; y++){
                const row = [];
                for (let z = 0; z < this.size.width; z++){
                    row.push({
                        id: 1,
                        instanceId: null
                    });
            
                }
                slice.push(row);
            }
            this.data.push(slice);
        }

    }

    generateMeshes(){
        this.clear();
        //initialize instanced mesh
        const maxCount = this.size.width * this.size.width * this.size.height;
        const mesh = new THREE.InstancedMesh(geometry, material,  maxCount);
        mesh.count = 0;

        const matrix = new THREE.Matrix4();

        for (let x = 0; x < this.size.width; x++) {
            for(let y = 0; y < this.size.height; y++){
                for(let z = 0; z < this.size.width; z++){
                    matrix.setPosition(x + 0.5, y + 0.5, z + 0.5); // +0.5 because the center of the box is at the origin but the lower left corner is now lower left corner of first box.
                    mesh.setMatrixAt(mesh.count++, matrix);
                }
            }
        }

        this.add(mesh);
    }


    // Helper Methods
    
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
            alert("block not in bounds");
            return false;
        }
    }
}