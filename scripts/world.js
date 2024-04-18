import * as THREE from 'three';

// Create Cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({ color: 0x00d000 }); //Lambert has shading, basic material does not

export class World extends THREE.Group {
    constructor(size = {widthx:32, widthz: 32, height: 16}) { //if no size is passed, default will be 32
        super();
        this.size = size;
    }

    generate(){
        for (let x = 0; x < this.size.widthx; x++) {
            for(let y = 0; y < this.size.height; y++){
                for(let z = 0; z < this.size.widthz; z++){
                    const block = new THREE.Mesh(geometry, material);
                    block.position.set(x, y, z);
                    this.add(block);
                }
            }
        }
    }
}