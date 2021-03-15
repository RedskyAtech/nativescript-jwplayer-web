
import { Component } from "@angular/core";
import { Page } from "@nativescript/core";


@Component({
    selector: "Patient",
    templateUrl: "./patient.component.html",
    styleUrls: ['./patient.component.css']
})

export class PatientComponent {
    src: any = {};
    webViewSrc: any;
    n: any;

    constructor(private page: Page) {
        this.src.url = "https://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8"
        this.src.title = "Title"
        this.src.description = "Description"

        const i = require('../../../jwplayer.html');

        this.n = i.default;
        this.webViewSrc = `<!DOCTYPE html5>
        <html>
        
        <head>
            <style>
                html,
                body {
                    height: 100%;
                    width: 100%;
                    padding: 0;
                    margin: 0;
                }
        
                #mediaplayer {
                    height: 100%;
                    width: 100%;
                    padding: 0;
                    margin: 0;
                    background-color: red
                }
            </style>
             <script src="https://cdn.jwplayer.com/libraries/g67ksCDX.js">
             </script>
        </head>
        
        <body>
            <div id='myPlayer'></div>
        
        
            <script type='text/javascript'>
        
                var playerInstance = jwplayer('myPlayer').setup({
                  playlist:'https://videos-fms.jwpsrv.com/0_604f583f_0xd11fa83ed701b67aa2a74af288771be431369921/content/conversions/LOPLPiDX/videos/hWF9vG66-24721146.mp4',
                    aspectratio: "16:9",
                });
        
            </script>
        
        </body>
        
        </html>`;

    }

    lf() {
        console.log('LLLLLLLLLFFF')
    }

    ls() {
        console.log('LLLLLLLLLFFFSSSSSSSS')

    }

    pageLoaded(args) {
        var page = args.object;
    }

}
