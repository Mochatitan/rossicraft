import {Howl, Howler} from 'howler';

export const music = {
    volume: 1,

    sweden: new Howl({src: ['audio/music/sweden.mp3']}),
    ariaMath: new Howl({src: ['audio/music/ariamath.mp3']}),
    cold: new Howl({src: ['audio/music/cold.mp3']}),
}
