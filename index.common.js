import { GridLayout, Property } from "@nativescript/core";
export class JWPlayerWebCommon extends GridLayout { }

JWPlayerWebCommon.ready = "ready";
JWPlayerWebCommon.setupError = "setupError";
JWPlayerWebCommon.remove = "remove";
JWPlayerWebCommon.adBidRequest = "adBidRequest";
JWPlayerWebCommon.adBidResponse = "adBidResponse";
JWPlayerWebCommon.adBlock = "adBlock";
JWPlayerWebCommon.adBreakEnd = "adBreakEnd";
JWPlayerWebCommon.adBreakIgnored = "adBreakIgnored";
JWPlayerWebCommon.adBreakStart = "adBreakStart";
JWPlayerWebCommon.adClick = "adClick";
JWPlayerWebCommon.adCompanions = "adCompanions";
JWPlayerWebCommon.adComplete = "adComplete";
JWPlayerWebCommon.adError = "adError";
JWPlayerWebCommon.adImpression = "adImpression";
JWPlayerWebCommon.adItem = "adItem";
JWPlayerWebCommon.adLoaded = "adLoaded";
JWPlayerWebCommon.adManager = "adManager";
JWPlayerWebCommon.adMeta = "adMeta";
JWPlayerWebCommon.adPause = "adPause";
JWPlayerWebCommon.adPlay = "adPlay";
JWPlayerWebCommon.adRequest = "adRequest";
JWPlayerWebCommon.adSchedule = "adSchedule";
JWPlayerWebCommon.adSkipped = "adSkipped";
JWPlayerWebCommon.adStarted = "adStarted";
JWPlayerWebCommon.adTime = "adTime";
JWPlayerWebCommon.adViewableImpression = "adViewableImpression";
JWPlayerWebCommon.adWarning = "adWarning";
JWPlayerWebCommon.adsManager = "adsManager";
JWPlayerWebCommon.beforeComplete = "beforeComplete";
JWPlayerWebCommon.beforePlay = "beforePlay";
JWPlayerWebCommon.audioTracks = "audioTracks";
JWPlayerWebCommon.audioTrackChanged = "audioTrackChanged";
JWPlayerWebCommon.bufferChange = "bufferChange";
JWPlayerWebCommon.captionsList = "captionsList";
JWPlayerWebCommon.captionsChanged = "captionsChanged";
JWPlayerWebCommon.cast = "cast";
JWPlayerWebCommon.controls = "controls";
JWPlayerWebCommon.displayClick = "displayClick";
JWPlayerWebCommon.meta = "meta";
JWPlayerWebCommon.metadataCueParsed = "metadataCueParsed";
JWPlayerWebCommon.autostartNotAllowed = "autostartNotAllowed";
JWPlayerWebCommon.play = "play";
JWPlayerWebCommon.pause = "pause";
JWPlayerWebCommon.playAttemptFailed = "playAttemptFailed";
JWPlayerWebCommon.buffer = "buffer";
JWPlayerWebCommon.idle = "idle";
JWPlayerWebCommon.complete = "complete";
JWPlayerWebCommon.firstFrame = "firstFrame";
JWPlayerWebCommon.error = "error";
JWPlayerWebCommon.warning = "warning";
JWPlayerWebCommon.playbackRateChanged = "playbackRateChanged";
JWPlayerWebCommon.playlist = "playlist";
JWPlayerWebCommon.playlistItem = "playlistItem";
JWPlayerWebCommon.playlistComplete = "playlistComplete";
JWPlayerWebCommon.levels = "levels";
JWPlayerWebCommon.levelsChanged = "levelsChanged";
JWPlayerWebCommon.visualQuality = "visualQuality";
JWPlayerWebCommon.fullscreen = "fullscreen";
JWPlayerWebCommon.resize = "resize";
JWPlayerWebCommon.seek = "seek";
JWPlayerWebCommon.seeked = "seeked";
JWPlayerWebCommon.time = "time";
JWPlayerWebCommon.viewable = "viewable";
JWPlayerWebCommon.mute = "mute";
JWPlayerWebCommon.volume = "volume";

export const srcProperty = new Property({
    name: 'src'
});
srcProperty.register(JWPlayerWebCommon);