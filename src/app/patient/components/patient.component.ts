
import { Component } from "@angular/core";
import { registerElement } from "@nativescript/angular";
import { ApplicationSettings, Frame, Observable, Page, Screen, WebView } from "@nativescript/core";
import { topmost } from "@nativescript/core/ui/frame/frame-common";
import { WebViewInterface } from "nativescript-webview-interface"

registerElement('JWPlayerWeb', () => require('nativescript-jwplayer-web').JWPlayerWeb)

@Component({
    selector: "Patient",
    templateUrl: "./patient.component.html",
    styleUrls: ['./patient.component.css']
})

export class PatientComponent {
    src: any = {};
    webViewSrc: any;
    n: any;
    webInt: WebViewInterface;
    jww;
    srcN;

    constructor(private page: Page) {
        this.src.url = "https://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8"
        this.src.title = "Title"
        this.src.description = "Description"
        this.srcN = { controls: true };

//         if(topmost().page){
//             topmost().page.on('onPlay',()=>{console.log('hapended2')})
//         }
    }


    onLoadd(args) {
        this.jww = args.object;
        this.resizePlayer({ width: (Screen.mainScreen.widthPixels / 2 * Screen.mainScreen.scale) + 'px', height: (Screen.mainScreen.heightPixels / 2 * Screen.mainScreen.scale) + 'px' });
        this.jww.on('onPlay',(args)=>{console.log('uyuyuyuyuyuy')})
    }

    triggerAd() {
        if (this.jww) {
            this.jww.triggerAd('https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=')
        }
    }

    resizePlayer(args: { width: string, height: string }) {
        if (this.jww) {
            // this.jww.emit('resizePlayer', args)
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

    onPl(args) {
        console.log('PLPLPLPLPLPL')
    }

}
