export const blocks = {
    empty: {
        id: 0,
        name: 'empty'
    },
    grass: {
        id: 1,
        name: 'grass',
        color: 0x559020
    },
    dirt: {
        id: 2,
        name: 'dirt',
        color: 0x807020
    },
    stone: {
        id:3,
        name: 'stone',
        color: 0x808080,
        depth: 4,
        // scale: { x: 30, y: 30, z: 30},
        // scarcity: 0.5

    },
    coal_ore: {
        id:4,
        name: 'coal ore',
        color: 0x191919,
        ylevel: 50,
        ymiddlelevel: 35,
        ybottomlevel: 20,
        scale: { x: 30, y: 30, z:30},
        scarcity: 0.80,
        rarityincrease: 0.10
    }
}