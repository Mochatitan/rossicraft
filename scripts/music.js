import {Howl, Howler} from 'howler';


export class Music {

    volume = 1;

    songPlaying = 0;

    songs = {
        sweden: new Howl({src: ['audio/music/sweden.mp3']}),
        ariaMath: new Howl({src: ['audio/music/ariamath.mp3']}),
        cold: new Howl({src: ['audio/music/cold.mp3']}),
        danny: new Howl({src: ['audio/music/danny.mp3']}),
        miceonvenus: new Howl({src: ['audio/music/miceonvenus.mp3']}),
    }

    playlist = Object.values(this.songs);
    

    loadSongs(){
        this.songs.sweden.load();
        this.songs.ariaMath.load();
    }

    startLoop(){
        this.songPlaying = 0;
        this.playlist[this.songPlaying].play();
    }

    nextSong(){
        this.playlist[this.songPlaying].stop();
        this.playlist[this.songPlaying].unload();

        this.songPlaying++;

        this.playlist[this.songPlaying].play();
        this.playlist[this.songPlaying].volume(this.volume);
        this.playlist[(this.songPlaying+1)].load();
       
    }

    checkVolume(){
        //this.volume = newVolume;
        this.playlist[this.songPlaying].volume(this.volume);
    }

}