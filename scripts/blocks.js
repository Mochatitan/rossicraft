import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

function loadTexture(path){
    const texture = textureLoader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;

}

const textures = {
    dirt: loadTexture('textures/dirt.png'),
    grassTop: loadTexture('textures/grasstop.png'),
    grassSide: loadTexture('textures/grass.png'),
    stone: loadTexture('textures/stone.png'),
    ironOre: loadTexture('textures/ironOre.png'),
    coalOre: loadTexture('textures/coalOre.png')

}

export const blocks = {
    empty: {
        id: 0,
        name: 'empty'
    },
    grass: {
        id: 1,
        name: 'grass',
        color: 0x559020,
        material: [
            new THREE.MeshLambertMaterial({ map: textures.grassSide }), // right
            new THREE.MeshLambertMaterial({ map: textures.grassSide }), // left
            new THREE.MeshLambertMaterial({ map: textures.grassTop }), // top
            new THREE.MeshLambertMaterial({ map: textures.dirt }), // bottom
            new THREE.MeshLambertMaterial({ map: textures.grassSide }), // front
            new THREE.MeshLambertMaterial({ map: textures.grassSide })  // back
          ]
    },
    dirt: {
        id: 2,
        name: 'dirt',
        color: 0x807020,
        material: new THREE.MeshLambertMaterial({ map: textures.dirt })
    },
    stone: {
        id:3,
        name: 'stone',
        color: 0x808080,
        depth: 4,
        // scale: { x: 30, y: 30, z: 30},
        // scarcity: 0.5
        material: new THREE.MeshLambertMaterial({ map: textures.stone }),

    },
    coalOre: {
        id:4,
        name: 'coal ore',
        color: 0x191919,
        ylevel: 50,
        ymiddlelevel: 35,
        ybottomlevel: 20,
        scale: { x: 20, y: 20, z:20},
        scarcity: 0.80,
        rarityincrease: 0.10,

        material: new THREE.MeshLambertMaterial({ map: textures.coalOre }),
    },
    ironOre: {
        id:5,
        name: 'iron ore',
        color: 0xd3d3d3,
        ylevel: 40,
        scale: { x: 60, y: 60, z:60},
        scarcity: 0.90,

        material: new THREE.MeshLambertMaterial({ map: textures.ironOre }),
    }
}

export const resources = [
    blocks.coalOre,
    blocks.ironOre
]