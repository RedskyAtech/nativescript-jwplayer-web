# NativeScript JW Player

This plugin is provides an interface to use native jwplayer android/ios sdks in nativescript.

Register at [jwplayer.com](jwplayer.com),create a Cloud-hosted player and get the script link.

## Installation

From the command prompt go to your app's root folder and execute:

```bash
tns plugin add nativescript-jwplayer-web
```

## Usage

Typescript/Javascript with XML

```xml
<Page xmlns="http://schemas.nativescript.org/tns.xsd" xmlns:jw="nativescript-jwplayer-web">
   <GridLayout>
    <jw:JWPlayerWeb src="{{src}}" play="{{onPlay}}"
        pause="{{onPause}}"></jw:JWPlayerWeb>
</GridLayout>
</Page>
```

### Angular

in app.module.ts

```js
import { registerElement } from "@nativescript/angular";
registerElement(
  "JWPlayerWeb",
  () => require("nativescript-jwplayer-web").JWPlayerWeb
);
```

```html
<GridLayout>
  <JWPlayerWeb
    [src]="src"
    (play)="onPlay($event)"
    (pause)="onPause($event)"
  ></JWPlayerWeb>
</GridLayout>
```

<!-- ## Demo apps

### NativeScript-Core (XML)

This demo is the one with the most options, so it's a cool one to check out:

```bash
git clone https://github.com/EddyVerbruggen/nativescript-local-notifications
cd nativescript-local-notifications/src
npm run demo.ios # or demo.android
```

### NativeScript-Angular

This plugin is part of the [plugin showcase app](https://github.com/EddyVerbruggen/nativescript-pluginshowcase/tree/master/app/feedback) I built using Angular.

There's also a simple Angular [demo in this repo](https://github.com/EddyVerbruggen/nativescript-local-notifications/tree/master/demo-ng):

```bash
git clone https://github.com/EddyVerbruggen/nativescript-local-notifications
cd nativescript-local-notifications/src
npm run demo-ng.ios # or demo-ng.android
``` -->

## Plugin API

You can pass src property for video link and other details:

| option        | required | type            |
| ------------- | -------- | --------------- |
| `link`        | Yes      | string          |
| `autostart`   | no       | boolean         |
| `floating`    | no       | boolean         |
| `responsive`  | no       | boolean         |
| `controls`    | no       | boolean         |
| `width`       | no       | string(with px) |
| `playlist`    | Yes      | Object          |
| `advertising` | no       | Object          |

wrap these properties in an object and pass it to the src.

Here is the how playlist and advertising can be set in src:

```js
let src = {};
src["playlist"] = [{ file: "VIDEO_URL", label: "VIDEO_LABEL" }];
src["advertising"] = {
  client: "vast",
  adscheduleid: "AD_SCHEDULE_ID",
  schedule: [
    {
      offset: "pre", //pre|post|5%,10% etc...
      tag: "AD_TAG",
    },
  ],
};
```

## Event list

Change in or initialization will trigger these events

ready;<br/>
setupError;<br/>
remove;<br/>
adBidRequest;<br/>
adBidResponse;<br/>
adBlock;<br/>
adBreakEnd;<br/>
adBreakIgnored;<br/>
adBreakStart;<br/>
adClick;<br/>
adCompanions;<br/>
adComplete;<br/>
adError;<br/>
adImpression;<br/>
adItem;<br/>
adLoaded;<br/>
adManager;<br/>
adMeta;<br/>
adPause;<br/>
adPlay;<br/>
adRequest;<br/>
adSchedule;<br/>
adSkipped;<br/>
adStarted;<br/>
adTime;<br/>
adViewableImpression;<br/>
adWarning;<br/>
adsManager;<br/>
beforeComplete;<br/>
beforePlay;<br/>
audioTracks;<br/>
audioTrackChanged;<br/>
bufferChange;<br/>
captionsList;<br/>
captionsChanged;<br/>
cast;<br/>
controls;<br/>
displayClick;<br/>
meta;<br/>
metadataCueParsed;<br/>
autostartNotAllowed;<br/>
play;<br/>
pause;<br/>
playAttemptFailed;<br/>
buffer;<br/>
idle;<br/>
complete;<br/>
firstFrame;<br/>
error;<br/>
warning;<br/>
playbackRateChanged;<br/>
playlist;<br/>
playlistItem;<br/>
playlistComplete;<br/>
levels;<br/>
levelsChanged;<br/>
visualQuality;<br/>
fullscreen;<br/>
resize;<br/>
seek;<br/>
seeked;<br/>
time;<br/>
viewable;<br/>
mute;<br/>
volume;<br/>

## Function to manipulate the player

```js
play();

pause();

resizePlayer(size: { width: string, height: string });

triggerAd(tag: string);


setControls(state:boolean);

setFloating(state:boolean);

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
```
