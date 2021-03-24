declare class JWPlayerWeb extends View {
    play();
    pause();
    /**
    * Set the size of the video player
    * @param {Size} size - set height and width in number/string type(with px appended) i.e '100px' 
    */
    resizePlayer(size: { width: string, height: string });
    /**
    * Trigger an Ad tag
    * @param {string} tag - Ad tag to be displayed 
    */
    triggerAd(tag: string);
}

declare interface Size {
    width: string | number;
    height: string | number;
}

declare interface PlayerModel {
    autostart: boolean;
    floating: boolean;
    responsive: boolean;
    controls: boolean;
    width: string;
    aspectratio: string;
    playlist: Array<Playlist>;
    advertising: { client: string, adscheduleid: string, schedule: Array<Ad> };
}

declare interface Playlist {
    file: string;
}

declare interface Ad {
    offset: string;
    tag: string;
}