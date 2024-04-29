import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { blocks, resources} from './blocks';

//import { Music } from './music';

export function  createUI(world, player, physics, music){

    const gui = new GUI();

    gui.close();

    const devtoolsFolder = gui.addFolder("Dev Tools");
        //devtoolsFolder.add(player.boundsHelper, 'visible').name("BoundsHelper");
        devtoolsFolder.add(player.cameraHelper, 'visible').name("CameraHelper");
        devtoolsFolder.add(physics.helpers, 'visible').name("Collision Indicators");
    
    const musicFolder = gui.addFolder("Music");
        musicFolder.add(music, 'volume', 0, 1).name("music volume");
        musicFolder.add(music, 'nextSong');

    const playerFolder = gui.addFolder('Player');
        playerFolder.add(player, 'toggleCamera');

    
    
    const terrainFolder = gui.addFolder('Terrain');

    terrainFolder.add(world.params, 'seed', 0, 1000).name("World Seed");
    
    terrainFolder.add(world.size, 'width', 8 , 128, 1).name("Width"); //object is world.size, the thing changing is width, the minimum is 8, maximum is 128, step one at a time,
    terrainFolder.add(world.size, 'height', 8 , 128, 1).name("Height");

    terrainFolder.add(world.params.terrain, 'scale', 8, 64, 1).name("Scale");
    terrainFolder.add(world.params.terrain, 'magnitude', 0, 1, 0.02).name("Magnitude");
    terrainFolder.add(world.params.terrain, 'offset', 0, 1, 0.02).name("Offset");
    
    const resourcesFolder = gui.addFolder("Resources");
    
        // const stoneFolder = resourcesFolder.addFolder("Stone");

        // stoneFolder.add(blocks.stone, 'scarcity', 0, 1).name("Scarcity");

        //     const stoneScaleFolder = stoneFolder.addFolder("Scale");
        //     stoneScaleFolder.add(blocks.stone.scale, "x", 0, 100).name("X");
        //     stoneScaleFolder.add(blocks.stone.scale, "y", 0, 100).name("Y");
        //     stoneScaleFolder.add(blocks.stone.scale, "z", 0, 100).name("Z");

        const coalFolder = resourcesFolder.addFolder("Coal ore");

        coalFolder.add(blocks.coalOre, "scarcity", 0, 1).name("Scarcity");
        coalFolder.add(blocks.coalOre, "ylevel", 0, 64).name("Y-Level");

            const coalScaleFolder = coalFolder.addFolder("Scale");
            coalScaleFolder.add(blocks.coalOre.scale, "x", 0, 100).name("X");
            coalScaleFolder.add(blocks.coalOre.scale, "y", 0, 100).name("Y");
            coalScaleFolder.add(blocks.coalOre.scale, "z", 0, 100).name("Z");


    
    //gui.add(world, 'generate');

    gui.onChange(() => {
        world.generate();
        music.checkVolume();
    });
}