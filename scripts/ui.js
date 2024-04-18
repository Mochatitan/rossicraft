import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export function createUI(world){
    const gui = new GUI();

    gui.add(world.size, 'width', 8 , 128, 1).name("Width"); //object is world.size, the thing changing is width, the minimum is 8, maximum is 128, step one at a time,
    gui.add(world.size, 'height', 8 , 128, 1).name("Height");
    gui.add(world, 'generate');
}