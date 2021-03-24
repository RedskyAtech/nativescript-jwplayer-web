
import { Component } from "@angular/core";
import { registerElement } from "@nativescript/angular";
import { ApplicationSettings, Page, Screen, WebView } from "@nativescript/core";
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

        this.srcN={controls:true}


        const i = require('../../../jwplayer.html');

        this.n = i.default;
        // this.webViewSrc = `<!DOCTYPE html5>
        // <html>
        
        // <head>
        //     <style>
        //         html,
        //         body {
        //             height: 100%;
        //             width: 100%;
        //             padding: 0;
        //             margin: 0;
        //         }
        
        //         #mediaplayer {
        //             height: 100%;
        //             width: 100%;
        //             padding: 0;
        //             margin: 0;
        //             background-color: red
        //         }
        //     </style>
        //     <script src="https://cdn.jwplayer.com/libraries/g67ksCDX.js">
        //     </script>
        // </head>
        
        // <body>
        //     <div id='myPlayer'></div>
        
        
        //     <script type='text/javascript'>
        
        
        //         let autostart = true;
        //         let floating = true;
        //         let responsive = true;
        //         let width = "100%";
        
        
        //         let p = [{
        //             file: 'https://cdn.jwplayer.com/videos/hWF9vG66-TNpruJId.mp4', type: 'video/mp4', height: '270px', width: '480px',
        //             label: 'H.264 480px'
        //         }]
        
        //         let a = {
        //             "client": "vast",
        //             "adscheduleid": "Az87bY12",
        //             "schedule": [
        //                 {
        //                     "offset": "pre",
        //                     "tag": "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator="
        //                 },
        //                 {
        //                     "offset": "25%",
        //                     "tag": "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator="
        //                 },
        //             ]
        //         }
        
        //         var playerInstance = jwplayer('myPlayer').setup({
        //             playlist: p,
        //             "advertising": a,
        //             autostart: autostart,
        //             floating: floating,
        //             responsive: responsive,
        //             width: width,
        //             aspectratio: "16:9",
        
        //         });
        
        
        
        
        
        
        //         var isWaitingForOncePlay = false;
        //         var oWebViewInterface = window.nsWebViewInterface;
        
        //         oWebViewInterface.on('triggerAd', function (args) {
        //             if(args && typeof args=='string'){
        //                 playerInstance.playAd(args).then(()=>{
                         
        //                 },error=>{

        //                 });
        //             }else{
        //                 console.error('Invalid ad tag provided\nUsing default one')
        //                 playerInstance.playAd(tag).then(()=>{
                         
        //                 },error=>{

        //                 });;
        //             }
        //         });
        
        //         oWebViewInterface.on('resizePlayer', function (args) {
        //             playerInstance.resize(args.width, args.height).then(()=>{
                         
        //             },error=>{

        //             });;
        //         });
        
        //         oWebViewInterface.on('play', function (args) {
        //             playerInstance.play(true).then(()=>{
                         
        //             },error=>{

        //             });;
        //         });
        
        //         oWebViewInterface.on('pause', function (args) {
        //             playerInstance.pause(true).then(()=>{
                         
        //             },error=>{

        //             });;
        //         });
        
        //         oWebViewInterface.on('onceplayresult', function (args) {
        //             if (isWaitingForOncePlay && typeof args == 'string') {
        //                 isWaitingForOncePlay = false;
        //                 let cookieData = args;
        //                 if (!cookieData) {
        //                     return;
        //                 }
        //                 const [resumeAt, duration] = cookieData.split(':');
        
        //                 if (resumeAt < duration) {
        //                     playerInstance.seek(resumeAt);
        //                     return;
        //                 }
        //             }
        //         });
        
        //         playerInstance.on('time', function (e) {
        //             let p = Math.floor(e.position);
        //             let d = playerInstance.getDuration();
        //             oWebViewInterface.emit('resumevideodata', p + ':' + d)
        //             // Cookies.set('resumevideodata', p + ':' + d);
        //         });
        
        //         playerInstance.once('play', function () {
        //             isWaitingForOncePlay = true;
        //             oWebViewInterface.emit('onceplay', {})
        //         });
        
        //     </script>
        
        // </body>
        
        // </html>`;

        // this.src = { src: this.webViewSrc, webViewId: 'web' }

    }

    lf() {
        console.log('LLLLLLLLLFFF')
    }

    ls() {
        console.log('LLLLLLLLLFFFSSSSSSSS')

    }

    pageLoaded(args) {


        var page = args.object as Page;
        if (page) {
            let w = page.getViewById('web') as WebView;
            this.webInt = new WebViewInterface(w, this.webViewSrc)

            this.webInt.on('resumevideodata', (args) => {
                ApplicationSettings.setString('resumevideodata', args);
            });

            this.webInt.on('onceplay', (args) => {
                this.webInt.emit('onceplayresult', ApplicationSettings.getString('resumevideodata'))
            })
        }



    }

    onPl(args) {

    }

    onPa(args) {

    }

    resizePlayer(){
        if (this.jww) {
            this.jww.resizePlayer({width:'100px',height:'100px'})
        }   
    }

    onLoadd(args) {
        this.jww = args.object;
        console.log('LOLOLO::', this.jww)
    }

    onTapR() {
        // this.resizePlayer({ width: Screen.mainScreen.widthPixels / Screen.mainScreen.scale + 'px', height: Screen.mainScreen.heightPixels / Screen.mainScreen.scale + 'px' })
    }

    triggerAd() {
        if (this.jww) {
            this.jww.triggerAd('https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=')
        }
    }

    // resizePlayer(args: { width: string, height: string }) {
    //     if (this.webInt) {
    //         this.webInt.emit('resizePlayer', args)
    //     }
    // }

play() {
        if (this.jww) {
            this.jww.play();
        }
    }

    pause() {
        if (this.jww) {
            this.jww.pause()
        }
    }

}
