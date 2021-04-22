declare class JWPlayerWeb extends View {

    //player events

    public static ready;
    public static setupError;
    public static remove;
    public static adBidRequest;
    public static adBidResponse;
    public static adBlock;
    public static adBreakEnd;
    public static adBreakIgnored;
    public static adBreakStart;
    public static adClick;
    public static adCompanions;
    public static adComplete;
    public static adError;
    public static adImpression;
    public static adItem;
    public static adLoaded;
    public static adManager;
    public static adMeta;
    public static adPause;
    public static adPlay;
    public static adRequest;
    public static adSchedule;
    public static adSkipped;
    public static adStarted;
    public static adTime;
    public static adViewableImpression;
    public static adWarning;
    public static adsManager;
    public static beforeComplete;
    public static beforePlay;
    public static audioTracks;
    public static audioTrackChanged;
    public static bufferChange;
    public static captionsList;
    public static captionsChanged;
    public static cast;
    public static controls;
    public static displayClick;
    public static meta;
    public static metadataCueParsed;
    public static autostartNotAllowed;
    public static play;
    public static pause;
    public static playAttemptFailed;
    public static buffer;
    public static idle;
    public static complete;
    public static firstFrame;
    public static error;
    public static warning;
    public static playbackRateChanged;
    public static playlist;
    public static playlistItem;
    public static playlistComplete;
    public static levels;
    public static levelsChanged;
    public static visualQuality;
    public static fullscreen;
    public static resize;
    public static seek;
    public static seeked;
    public static time;
    public static viewable;
    public static mute;
    public static volume;

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

    getMute();

    getVolume();

    setMute(state: boolean);

    //from 1-100
    setVolume(volume: number);

    getPercentViewable();

    getViewable();

    getPosition();

    getDuration();

    seek(position: number);

    getFullscreen();

    getHeight();

    getWidth();

    setPlaylistItemCallback(callback);

    removePlaylistItemCallback();

    getPlaylistItemPromise(index: number);

    getQualityLevels();

    getCurrentQuality();

    getVisualQuality();

    setCurrentQuality(index: number);

    getPlaybackRate();

    //from 0.25 to 4
    setPlaybackRate(rate: number);

    next();

    getPlaylist();

    getPlaylistItem();

    getPlaylistIndex();

    load(playlist: Array<Playlist>);

    playlistItem(index: number);

    stop();

    getState();

    getAdBlock();

    pauseAd(state: boolean);

    playAd(tag: string);

    skipAd();

    getAudioTracks();

    getCurrentAudioTrack();

    setCurrentAudioTrack(index: number);

    addButton({ img, tooltip, callback, id, btnClass });

    addCues(cues);

    getControls();

    getCues();

    getSafeRegion();

    removeButton(id: string);

    setControls(state: boolean);

    setCues(cues);

    setCaptions(styles);

    getCaptionsList();

    getCurrentCaptions();

    setCurrentCaptions(index: number);

    getBuffer();

    stopCasting();

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
    label?: string;
}

declare interface Ad {
    offset: string;
    tag: string;
}