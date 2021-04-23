import { View, EventData } from "@nativescript/core";
export class JWPlayerWeb extends View {

    //player events

    public static ready: string;
    public static setupError: string;
    public static remove: string;
    public static adBidRequest: string;
    public static adBidResponse: string;
    public static adBlock: string;
    public static adBreakEnd: string;
    public static adBreakIgnored: string;
    public static adBreakStart: string;
    public static adClick: string;
    public static adCompanions: string;
    public static adComplete: string;
    public static adError: string;
    public static adImpression: string;
    public static adItem: string;
    public static adLoaded: string;
    public static adManager: string;
    public static adMeta: string;
    public static adPause: string;
    public static adPlay: string;
    public static adRequest: string;
    public static adSchedule: string;
    public static adSkipped: string;
    public static adStarted: string;
    public static adTime: string;
    public static adViewableImpression: string;
    public static adWarning: string;
    public static adsManager: string;
    public static beforeComplete: string;
    public static beforePlay: string;
    public static audioTracks: string;
    public static audioTrackChanged: string;
    public static bufferChange: string;
    public static captionsList: string;
    public static captionsChanged: string;
    public static cast: string;
    public static controls: string;
    public static displayClick: string;
    public static meta: string;
    public static metadataCueParsed: string;
    public static autostartNotAllowed: string;
    public static play: string;
    public static pause: string;
    public static playAttemptFailed: string;
    public static buffer: string;
    public static idle: string;
    public static complete: string;
    public static firstFrame: string;
    public static error: string;
    public static warning: string;
    public static playbackRateChanged: string;
    public static playlist: string;
    public static playlistItem: string;
    public static playlistComplete: string;
    public static levels: string;
    public static levelsChanged: string;
    public static visualQuality: string;
    public static fullscreen: string;
    public static resize: string;
    public static seek: string;
    public static seeked: string;
    public static time: string;
    public static viewable: string;
    public static mute: string;
    public static volume: string;

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

    getMute(): Promise<boolean>;

    getVolume(): Promise<number>;

    setMute(state: boolean);

    //from 1-100
    setVolume(volume: number);

    getPercentViewable(): Promise<number>;

    getViewable(): Promise<number>;

    getPosition(): Promise<number>;

    getDuration(): Promise<number>;

    seek(position: number);

    getFullscreen(): Promise<boolean>;

    getHeight(): Promise<number>;

    getWidth(): Promise<number>;

    setPlaylistItemCallback(callback);

    removePlaylistItemCallback();

    getPlaylistItemPromise(index: number): Promise<Promise<any>>;

    getQualityLevels(): Promise<any>;

    getCurrentQuality(): Promise<number>;

    getVisualQuality(): Promise<any>;

    setCurrentQuality(index: number);

    getPlaybackRate(): Promise<number>;

    //from 0.25 to 4
    setPlaybackRate(rate: number);

    next();

    getPlaylist(): Promise<any>;

    getPlaylistItem(): Promise<any>;

    getPlaylistIndex();

    load(playlist: Array<Playlist>);

    playlistItem(index: number);

    stop();

    getState(): Promise<'buffering' | 'idle' | 'paused' | 'playing'>;

    getAdBlock(): Promise<boolean>;

    pauseAd(state: boolean);

    playAd(tag: string);

    skipAd();

    getAudioTracks(): Promise<any>;

    getCurrentAudioTrack(): Promise<number>;

    setCurrentAudioTrack(index: number);

    addButton({ img, tooltip, callback, id, btnClass });

    addCues(cues);

    getControls(): Promise<boolean>;

    getCues(): Promise<any>;

    getSafeRegion(): Promise<any>;

    removeButton(id: string);

    setControls(state: boolean);

    setCues(cues);

    setCaptions(styles);

    getCaptionsList(): Promise<any>;

    getCurrentCaptions(): Promise<number>;

    setCurrentCaptions(index: number);

    getBuffer(): Promise<number>;

    stopCasting();

    on(eventNames: string, callback: (data: EventData) => void, thisArg?: any);

}

export interface Size {
    width: string | number;
    height: string | number;
}

export interface PlayerModel {
    autostart: boolean;
    floating: boolean;
    responsive: boolean;
    controls: boolean;
    width: string;
    aspectratio: string;
    playlist: Array<Playlist>;
    advertising: { client: string, adscheduleid: string, schedule: Array<Ad> };
}

export interface Playlist {
    file: string;
    label?: string;
}

export interface Ad {
    offset: string;
    tag: string;
}