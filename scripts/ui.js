import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export function createUI(world){
    const gui = new GUI();

    gui.add(world.size, 'width', 8 , 128, 1).name("Width"); //object is world.size, the thing changing is width, the minimum is 8, maximum is 128, step one at a time,
    gui.add(world.size, 'height', 8 , 128, 1).name("Height");
    
    const terrainFolder = gui.addFolder('Terrain');

    terrainFolder.add(world.params, 'seed', 0, 1000).name("World Seed");
    
    terrainFolder.add(world.params.terrain, 'scale', 8, 64, 1).name("Scale");
    terrainFolder.add(world.params.terrain, 'magnitude', 0, 1, 0.02).name("Magnitude");
    terrainFolder.add(world.params.terrain, 'offset', 0, 1, 0.02).name("Offset");
    

    

    
    //gui.add(world, 'generate');

    gui.onChange(() => {
        world.generate();
    });
}