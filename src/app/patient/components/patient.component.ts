
import { Component } from "@angular/core";
import { Screen } from "@nativescript/core";
import { registerElement } from "@nativescript/angular";

registerElement('JWPlayerWeb', () => require('nativescript-jwplayer-web').JWPlayerWeb)

@Component({
    selector: "Patient",
    templateUrl: "./patient.component.html",
    styleUrls: ['./patient.component.css']
})

export class PatientComponent {

    src: any = {};
    jww;

    constructor() {
        this.src = {
            controls: true,
            playlist: [{
                file: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                label: 'Nice Video'
            },
            {
                file: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                label: 'Nice Video1'
            },
            {
                file: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                label: 'Nice Video2'
            }]
        };
    }

    onPlay(args) {
        console.log('Video is playing');
    }

    onPause(args) {
        console.log('Video is paused');
    }

    onLoaded(args) {
        this.jww = args.object;
        this.jww.on('ready', (args) => {
            console.log('Player is ready')
        })
    }

    triggerAd() {
        if (this.jww) {
            this.jww.triggerAd('https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=')
        }
    }

    resizePlayer(args: { width: string, height: string }) {
        if (this.jww) {
            this.jww.emit('resizePlayer', { width: (Screen.mainScreen.widthPixels / 2 * Screen.mainScreen.scale) + 'px', height: (Screen.mainScreen.heightPixels / 2 * Screen.mainScreen.scale) + 'px' });
        }
    }

    play() {
        if (this.jww) {
            this.jww.play();
        }
    }

    pause() {
        if (this.jww) {
            this.jww.pause();
        }
    }

}
