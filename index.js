import { ApplicationSettings, WebView, isAndroid, Screen } from '@nativescript/core';
import { WebViewInterface } from "nativescript-webview-interface";
import { JWPlayerWebCommon, srcProperty } from "./index.common";

export class JWPlayerWeb extends JWPlayerWebCommon {

    constructor() {
        super();
        setTimeout(() => {

            let autostart = true;
            let floating = false;
            let responsive = true;
            let controls = true;
            let width = Screen.mainScreen.widthPixels + 'px';
            let aspectratio = "16:9";
            let link = "";

            let playlist = [
                {
                    file: 'https://cdn.jwplayer.com/videos/hWF9vG66-TNpruJId.mp4',
                    label: 'A Nice Video'
                }
            ];

            let advertisement = {};

            if (this.src) {
                if (this.src.autostart != undefined) {
                    autostart = this.src.autostart;
                }
                if (this.src.floating != undefined) {
                    floating = this.src.floating;
                }
                if (this.src.responsive != undefined) {
                    responsive = this.src.responsive;
                }
                if (this.src.controls != undefined) {
                    controls = this.src.controls;
                }
                if (this.src.width != undefined) {
                    width = this.src.width;
                }
                if (this.src.aspectratio != undefined) {
                    aspectratio = this.src.aspectratio;
                }
                if (this.src.playlist != undefined) {
                    playlist = this.src.playlist;
                } else {
                    console.warn(`Playing Default video, please remember to provide me with a playlist video ${String.fromCodePoint(0x1F605)}`)
                }
                if (this.src.advertising != undefined) {
                    advertisement = this.src.advertising;
                } else {
                    console.warn(`Wow,no ads,you seem like a rich one ${String.fromCodePoint(0x1F61C)}`)
                }
                if (this.src.link) {
                    link = this.src.link;
                } else {
                    throw new Error(`Please provide JW Player link, I am not able to move ahead ${String.fromCodePoint(0x1F62C)}`);
                }
            }

            var li = new WebView();
            let script = `<!DOCTYPE html5>
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
                <script src=${link}>
                </script>
            </head>
            
            <body allowfullscreen>
                <div allowfullscreen id='myPlayer'></div>
            
                <script type='text/javascript'>
            
                    /**
                     * WebViewInterface class to handle communication between webView and Android/iOS.
                     */
                    var NSWebViewinterface = (function () {
                        function NSWebViewinterface() {
            
                            /**
                             * Mapping of native eventName and its handler in webView
                             */
                            this.eventListenerMap = {};
            
                            /**
                             * Mapping of JS Call responseId and result for iOS
                             */
                            this._iosResponseMap = {};
            
                            /**
                             * Counter of iOS JS Call responseId
                             */
                            this._iosCntResponseId = 0;
                        }
            
                        /**
                         * Handles events/commands emitted by android/ios. This function is called from nativescript.
                         * @param   {string}    eventName - Native event/command name
                         * @param   {data}      data - Payload for the event/command
                         */
                        NSWebViewinterface.prototype._onNativeEvent = function (eventName, data) {
                            var lstEvtListeners = this.eventListenerMap[eventName] || [];
                            for (var _i = 0; _i < lstEvtListeners.length; _i++) {
                                var listener = lstEvtListeners[_i];
                                var retnVal = listener && listener(data);
                                // if any handler return false, not executing any further handlers for that event.
                                if (retnVal === false) {
                                    break;
                                }
                            }
                        };
            
                        /**
                          * Handles JS function calls by android/ios. This function is called from nativescript.
                          * Result value of JS function call can be promise or any other data.
                          * @param   {number}    reqId - Internal communication id
                          * @param   {string}    functionName - Function to be executed in webView
                          * @param   {any[]}     args
                          */
                        NSWebViewinterface.prototype._callJSFunction = function (reqId, functionName, args) {
                            var _this = this;
                            var resolvedFn = _this._getResolvedFunction(functionName);
                            if (resolvedFn) {
                                var retnVal = resolvedFn.apply(window, args);
                                if (retnVal && retnVal.then) {
                                    retnVal.then(function (value) {
                                        _this._sendJSCallResponse(reqId, value);
                                    }, function (error) {
                                        _this._sendJSCallResponse(reqId, error, true);
                                    });
                                }
                                else {
                                    this._sendJSCallResponse(reqId, retnVal);
                                }
                            }
                        }
            
                        /**
                         * Resolves a function, if the function to be executed is in deep object chain.
                         * e.g If we want to execute a function 'parent.child.child.fn' from native app,
                         * this function will extract fn from the object chain.
                         * We can do it by using eval also, but as there is a way, why to invite unknown security risks?
                         *
                         */
                        NSWebViewinterface.prototype._getResolvedFunction = function (functionName) {
                            if (functionName && (functionName = functionName.trim()).length) {
                                functionName = functionName.indexOf('window.') === 0 ? functionName.replace('window.', '') : functionName;
                                var arrFnPath = functionName.split('.');
                                var fn = window;
                                for (var i = 0; i < arrFnPath.length; i++) {
                                    if (!fn[arrFnPath[i]]) {
                                        fn = null;
                                        break;
                                    }
                                    fn = fn[arrFnPath[i]];
                                }
                                return fn;
                            }
                        }
            
                        /**
                         * Returns JS Call response by emitting internal _jsCallRespone event
                         */
                        NSWebViewinterface.prototype._sendJSCallResponse = function (reqId, response, isError) {
                            var oResponse = {
                                reqId: reqId,
                                response: response || null,
                                isError: !!isError
                            };
                            this.emit('_jsCallResponse', oResponse);
                        };
            
                        /**
                         * Creates temporary iFrame element to load custom url, for sending handshake message
                         * to iOS which is necessary to initiate data transfer from webView to iOS
                         */
                        NSWebViewinterface.prototype._createIFrame = function (src) {
                            var rootElm = document.documentElement;
                            var newFrameElm = document.createElement("IFRAME");
                            newFrameElm.setAttribute("src", src);
                            rootElm.appendChild(newFrameElm);
                            return newFrameElm;
                        };
            
                        /**
                         * Sends handshaking signal to iOS using custom url, for sending event payload or JS Call response.
                         * As iOS do not allow to send any data from webView. Here we are sending data in two steps.
                         * 1. Send handshake signal, by loading custom url in iFrame with metadata (eventName, unique responseId)
                         * 2. On intercept of this request, iOS calls _getIOSResponse with the responseId to fetch the data.
                         */
                        NSWebViewinterface.prototype._emitEventToIOS = function (eventName, data) {
                            this._iosResponseMap[++this._iosCntResponseId] = data;
                            var metadata = { eventName: eventName, resId: this._iosCntResponseId };
                            var url = 'js2ios:' + JSON.stringify(metadata);
                            var iFrame = this._createIFrame(url);
                            iFrame.parentNode.removeChild(iFrame);
                        };
            
                        /**
                         * Returns data to iOS. This function is called from iOS.
                         */
                        NSWebViewinterface.prototype._getIOSResponse = function (resId) {
                            var response = this._iosResponseMap[resId];
                            delete this._iosResponseMap[resId];
                            return response;
                        };
            
                        /**
                         * Calls native android function to emit event and payload to android
                         */
                        NSWebViewinterface.prototype._emitEventToAndroid = function (eventName, data) {
                            window.androidWebViewInterface.handleEventFromWebView(eventName, data);
                        };
            
                        /**
                         * Registers handlers for android/ios event/command
                         */
                        NSWebViewinterface.prototype.on = function (eventName, callback) {
                            var lstListeners = this.eventListenerMap[eventName] || (this.eventListenerMap[eventName] = []);
                            lstListeners.push(callback);
                        };
            
                        /**
                         * Removes handler for android/ios event/command. If handler is not provided, all handlers for provided
                         * event will be removed
                         */
                        NSWebViewinterface.prototype.off = function (eventName, callback) {
                            if (!this.eventListenerMap[eventName] || this.eventListenerMap[eventName].length === 0) {
                                return;
                            }
            
                            if (callback) {
                                this.eventListenerMap[eventName] = this.eventListenerMap[eventName].filter(function (oldCallback) {
                                    return oldCallback !== callback;
                                });
                            } else {
                                delete this.eventListenerMap[eventName];
                            }
                        };
            
                        /**
                         * Emits event to android/ios
                         */
                        NSWebViewinterface.prototype.emit = function (eventName, data) {
                            var strData = typeof data === 'object' ? JSON.stringify(data) : data;
                            if (window.androidWebViewInterface) {
                                this._emitEventToAndroid(eventName, strData);
                            }
                            else {
                                this._emitEventToIOS(eventName, strData);
                            }
                        };
                        return NSWebViewinterface;
                    })();
                    window.nsWebViewInterface = new NSWebViewinterface();
            
                    var player = jwplayer('myPlayer');
            
                    var playerInstance = player.setup({
                        playlist: ${JSON.stringify(playlist)},
                        advertising: ${JSON.stringify(advertisement)},
                        autostart: ${autostart},
                        floating: ${floating},
                        responsive: ${responsive},
                        controls: ${controls},
                        width:${width},
                        aspectratio: ${aspectratio}
                    });
            
                    let oWebViewInterface = window.nsWebViewInterface;
            
                    player.on('ready', function (args) { oWebViewInterface.emit('ready', args) })
                    player.on('setupError', function (args) { oWebViewInterface.emit('setupError', args) })
                    player.on('remove', function (args) { oWebViewInterface.emit('remove', args) })
                    player.on('adBidRequest', function (args) { oWebViewInterface.emit('adBidRequest', args) })
                    player.on('adBidResponse', function (args) { oWebViewInterface.emit('adBidResponse', args) })
                    player.on('adBlock', function (args) { oWebViewInterface.emit('adBlock', args) })
                    player.on('adBreakEnd', function (args) { oWebViewInterface.emit('adBreakEnd', args) })
                    player.on('adBreakIgnored', function (args) { oWebViewInterface.emit('adBreakIgnored', args) })
                    player.on('adBreakStart', function (args) { oWebViewInterface.emit('adBreakStart', args) })
                    player.on('adClick', function (args) { oWebViewInterface.emit('adClick', args) })
                    player.on('adCompanions', function (args) { oWebViewInterface.emit('adCompanions', args) })
                    player.on('adComplete', function (args) { oWebViewInterface.emit('adComplete', args) })
                    player.on('adError', function (args) { oWebViewInterface.emit('adError', args) })
                    player.on('adImpression', function (args) { oWebViewInterface.emit('adImpression', args) })
                    player.on('adItem', function (args) { oWebViewInterface.emit('adItem', args) })
                    player.on('adLoaded', function (args) { oWebViewInterface.emit('adLoaded', args) })
                    player.on('adManager', function (args) { oWebViewInterface.emit('adManager', args) })
                    player.on('adMeta', function (args) { oWebViewInterface.emit('adMeta', args) })
                    player.on('adPause', function (args) { oWebViewInterface.emit('adPause', args) })
                    player.on('adPlay', function (args) { oWebViewInterface.emit('adPlay', args) })
                    player.on('adRequest', function (args) { oWebViewInterface.emit('adRequest', args) })
                    player.on('adSchedule', function (args) { oWebViewInterface.emit('adSchedule', args) })
                    player.on('adSkipped', function (args) { oWebViewInterface.emit('adSkipped', args) })
                    player.on('adStarted', function (args) { oWebViewInterface.emit('adStarted', args) })
                    player.on('adTime', function (args) { oWebViewInterface.emit('adTime', args) })
                    player.on('adViewableImpression', function (args) { oWebViewInterface.emit('adViewableImpression', args) })
                    player.on('adWarning', function (args) { oWebViewInterface.emit('adWarning', args) })
                    player.on('adsManager', function (args) { oWebViewInterface.emit('adsManager', args) })
                    player.on('beforeComplete', function (args) { oWebViewInterface.emit('beforeComplete', args) })
                    player.on('beforePlay', function (args) { oWebViewInterface.emit('beforePlay', args) })
            
                    player.on('audioTracks', function (args) { oWebViewInterface.emit('audioTracks', args) })
                    player.on('audioTrackChanged', function (args) { oWebViewInterface.emit('audioTrackChanged', args) })
                    player.on('bufferChange', function (args) { oWebViewInterface.emit('bufferChange', args) })
            
                    player.on('captionsList', function (args) { oWebViewInterface.emit('captionsList', args) })
                    player.on('captionsChanged', function (args) { oWebViewInterface.emit('captionsChanged', args) })
                    player.on('cast', function (args) { oWebViewInterface.emit('cast', args) })
                    player.on('controls', function (args) { oWebViewInterface.emit('controls', args) })
                    player.on('displayClick', function (args) { oWebViewInterface.emit('displayClick', args) })
            
                    player.on('meta', function (args) { oWebViewInterface.emit('meta', args) })
                    player.on('metadataCueParsed', function (args) { oWebViewInterface.emit('metadataCueParsed', args) })
            
                    player.on('autostartNotAllowed', function (args) { oWebViewInterface.emit('autostartNotAllowed', args) })
                    player.on('play', function (args) { oWebViewInterface.emit('play', {}) });
                    player.on('pause', function (args) { oWebViewInterface.emit('pause', {}); });
                    player.on('playAttemptFailed', function (args) { oWebViewInterface.emit('playAttemptFailed', args) })
                    player.on('buffer', function (args) { oWebViewInterface.emit('buffer', args) })
                    player.on('idle', function (args) { oWebViewInterface.emit('idle', args) })
                    player.on('complete', function (args) { oWebViewInterface.emit('complete', args) })
                    player.on('firstFrame', function (args) { oWebViewInterface.emit('firstFrame', args) })
                    player.on('error', function (args) { oWebViewInterface.emit('error', args) })
                    player.on('warning', function (args) { oWebViewInterface.emit('warning', args) })
                    player.on('playbackRateChanged', function (args) { oWebViewInterface.emit('playbackRateChanged', args) })
            
                    player.on('playlist', function (args) { oWebViewInterface.emit('playlist', args) })
                    player.on('playlistItem', function (args) { oWebViewInterface.emit('playlistItem', args) })
                    player.on('playlistComplete', function (args) { oWebViewInterface.emit('playlistComplete', args) })
            
                    player.on('levels', function (args) { oWebViewInterface.emit('levels', args) })
                    player.on('levelsChanged', function (args) { oWebViewInterface.emit('levelsChanged', args) })
                    player.on('visualQuality', function (args) { oWebViewInterface.emit('visualQuality', args) })
            
                    player.on('fullscreen', function (args) { oWebViewInterface.emit('fullscreen', args) })
                    player.on('resize', function (args) { oWebViewInterface.emit('resize', args) })
                    player.on('seek', function (args) { oWebViewInterface.emit('seek', args) })
                    player.on('seeked', function (args) { oWebViewInterface.emit('seeked', args) })
                    player.on('time', function (args) { oWebViewInterface.emit('time', args) })
            
                    player.on('viewable', function (args) { oWebViewInterface.emit('viewable', args) })
            
                    player.on('mute', function (args) { oWebViewInterface.emit('mute', args) })
                    player.on('volume', function (args) { oWebViewInterface.emit('volume', args) })
            
                    window.getMute = function () {
                        return player.getMute();
                    }
            
                    window.getVolume = function () {
                        return player.getVolume();
                    }
            
                    window.getPercentViewable = function () {
                        return player.getPercentViewable();
                    }
                    window.getViewable = function () {
                        return player.getViewable();
                    }
                    window.getPosition = function () {
                        return player.getPosition();
                    }
            
                    window.getDuration = function () {
                        return player.getDuration();
                    }
            
                    window.getFullscreen = function () {
                        return player.getFullscreen();
                    }
            
                    window.getHeight = function () {
                        return player.getHeight();
                    }
            
                    window.getWidth = function () {
                        return player.getWidth();
                    }
            
                    window.getPlaylistItemPromise = function (args) {
                        return player.getPlaylistItemPromise(args[0]);
                    }
            
                    window.getQualityLevels = function () {
                        return player.getQualityLevels();
                    }
            
                    window.getCurrentQuality = function () {
                        return player.getCurrentQuality();
                    }
            
                    window.getVisualQuality = function () {
                        return player.getVisualQuality();
                    }
            
                    window.getPlaybackRate = function () {
                        return player.getPlaybackRate();
                    }
            
                    window.getPlaylist = function () {
                        return player.getPlaylist();
                    }
            
                    window.getPlaylistItem = function () {
                        return player.getPlaylistItem();
                    }
            
                    window.getPlaylistIndex = function () {
                        return player.getPlaylistIndex();
                    }
            
                    window.getState = function () {
                        return player.getState();
                    }
            
                    window.getAdBlock = function () {
                        return player.getAdBlock();
                    }
            
                    window.getAudioTracks = function () {
                        return player.getAudioTracks();
                    }
            
                    window.getCurrentAudioTrack = function () {
                        return player.getCurrentAudioTrack();
                    }
            
                    window.getControls = function () {
                        return player.getControls();
                    }
            
                    window.getCues = function () {
                        return player.getCues();
                    }
            
                    window.getSafeRegion = function () {
                        return player.getSafeRegion();
                    }
            
                    window.getCaptionsList = function () {
                        return player.getCaptionsList();
                    }
            
                    window.getCurrentCaptions = function () {
                        return player.getCurrentCaptions();
                    }
            
                    window.getBuffer = function () {
                        return player.getBuffer();
                    }
            
                    oWebViewInterface.on('triggerAd', function (args) {
                        if (args && typeof args == 'string') {
                            playerInstance.playAd(args);
                        } else {
                            console.error('Please provide a valid ad tag')
                        }
                    });
            
                    oWebViewInterface.on('setMute', function (args) {
                        player.setMute(args.state)
                    });
            
                    oWebViewInterface.on('setVolume', function (args) {
                        player.setVolume(args.volume)
                    });
            
                    oWebViewInterface.on('setFloating', function (args) {
                        player.setFloating(args.state)
                    });
            
                    oWebViewInterface.on('setConfig', function (args) {
                        player.setConfig(args)
                    });
            
                    oWebViewInterface.on('seek', function (args) {
                        player.seek(args.position)
            
                    });
            
                    oWebViewInterface.on('resizePlayer', function (args) {
                        let width, height;
                        if (args) {
                            if (typeof args.width == 'string') {
                                if (args.width.indexOf('px') > 0) {
                                    width = args.width;
                                } else {
                                    width = args.width + 'px';
                                }
                            } else if (typeof args.width == 'number') {
                                width = args.width + 'px';
                            }
                            if (typeof args.height == 'string') {
                                if (args.height.indexOf('px') > 0) {
                                    height = args.height;
                                } else {
                                    height = args.height + 'px';
                                }
                            } else if (typeof args.height == 'number') {
                                height = args.height + 'px';
                            }
                            if (width && height) {
                                playerInstance.resize(width, height);
                            }
                        }
                    });
            
                    window.setPlaylistItemCallback = function (args) {
                        return player.setPlaylistItemCallback(args[0]);
                    }
            
                    window.removePlaylistItemCallback = function () {
                        return player.removePlaylistItemCallback();
                    }
            
                    oWebViewInterface.on('setCurrentQuality', function (args) {
                        player.setCurrentQuality(args.index);
                    });
            
                    oWebViewInterface.on('setPlaybackRate', function (args) {
                        player.setPlaybackRate(args.rate);
                    });
            
                    oWebViewInterface.on('next', function (args) {
                        player.next();
                    });
            
                    oWebViewInterface.on('load', function (args) {
                        player.load(args.playlist);
                    });
            
                    oWebViewInterface.on('playlistItem', function (args) {
                        player.playlistItem(args.index);
                    });
            
                    oWebViewInterface.on('play', function (args) {
                        player.play(true);
                    });
            
                    oWebViewInterface.on('pause', function (args) {
                        player.pause(true);
                    });
            
                    oWebViewInterface.on('stop', function (args) {
                        player.stop();
                    });
            
                    oWebViewInterface.on('pauseAd', function (args) {
                        player.pauseAd(args[0]);
                    });
            
                    oWebViewInterface.on('playAd', function (args) {
                        player.playAd(args[0]);
                    });
            
                    oWebViewInterface.on('skipAd', function (args) {
                        player.skipAd();
                    });
            
                    window.addButton = function (args) {
                        return player.addButton(args[0], args[1], args[2], args[3], args[4]);
                    }
            
                    oWebViewInterface.on('addCues', function (args) {
                        player.addCues(args['cues']);
                    });
            
                    oWebViewInterface.on('removeButton', function (args) {
                        player.removeButton(args.id);
                    });
            
                    oWebViewInterface.on('setControls', function (args) {
                        player.setControls(args.state);
                    });
            
                    oWebViewInterface.on('setCues', function (args) {
                        player.setCues(args['cues']);
                    });
            
                    oWebViewInterface.on('setCaptions', function (args) {
                        player.setCaptions(args.styles);
                    });
            
                    oWebViewInterface.on('setCurrentCaptions', function (args) {
                        player.setCurrentCaptions(args.index);
                    });
            
                    oWebViewInterface.on('stopCasting', function (args) {
                        player.stopCasting();
                    });
            
                    oWebViewInterface.on('onceplayresult', function (args) {
                        // if (isWaitingForOncePlay && typeof args == 'string') {
                        //     isWaitingForOncePlay = false;
                        //     let cookieData = args;
                        //     if (!cookieData) {
                        //         return;
                        //     }
                        //     const [resumeAt, duration] = cookieData.split(':');
            
                        //     if (resumeAt < duration) {
                        //         playerInstance.seek(resumeAt);
                        //         return;
                        //     }
                        // }
                    });
            
                    playerInstance.on('time', function (e) {
                        let p = Math.floor(e.position);
                        let d = playerInstance.getDuration();
                        oWebViewInterface.emit('resumevideodata', p + ':' + d)
                    });
            
                    playerInstance.once('play', function () {
                        // isWaitingForOncePlay = true;
                        // oWebViewInterface.emit('onceplay', {})
                    });
            
                </script>
            </body>
            
            </html>`;

            li.src = script;

            this.addChild(li);
            this.webInt = new WebViewInterface(li);
            this.webInt.on('resumevideodata', (args) => {
                ApplicationSettings.setString('resumevideodata', args);
            });
            this.webInt.on('onceplay', (args) => {
                this.webInt.emit('onceplayresult', ApplicationSettings.getString('resumevideodata'));
            });
            this.webInt.on('ready', (args) => { this.notify({ eventName: JWPlayerWeb.ready, object: this, eventData: args }); });
            this.webInt.on('setupError', (args) => { this.notify({ eventName: JWPlayerWeb.setupError, object: this, eventData: args }); });
            this.webInt.on('remove', (args) => { this.notify({ eventName: JWPlayerWeb.remove, object: this, eventData: args }); });
            this.webInt.on('adBidRequest', (args) => { this.notify({ eventName: JWPlayerWeb.adBidRequest, object: this, eventData: args }); });
            this.webInt.on('adBidResponse', (args) => { this.notify({ eventName: JWPlayerWeb.adBidResponse, object: this, eventData: args }); });
            this.webInt.on('adBlock', (args) => { this.notify({ eventName: JWPlayerWeb.adBlock, object: this, eventData: args }); });
            this.webInt.on('adBreakEnd', (args) => { this.notify({ eventName: JWPlayerWeb.adBreakEnd, object: this, eventData: args }); });
            this.webInt.on('adBreakIgnored', (args) => { this.notify({ eventName: JWPlayerWeb.adBreakIgnored, object: this, eventData: args }); });
            this.webInt.on('adBreakStart', (args) => { this.notify({ eventName: JWPlayerWeb.adBreakStart, object: this, eventData: args }); });
            this.webInt.on('adClick', (args) => { this.notify({ eventName: JWPlayerWeb.adClick, object: this, eventData: args }); });
            this.webInt.on('adCompanions', (args) => { this.notify({ eventName: JWPlayerWeb.adCompanions, object: this, eventData: args }); });
            this.webInt.on('adComplete', (args) => { this.notify({ eventName: JWPlayerWeb.adComplete, object: this, eventData: args }); });
            this.webInt.on('adError', (args) => { this.notify({ eventName: JWPlayerWeb.adError, object: this, eventData: args }); });
            this.webInt.on('adImpression', (args) => { this.notify({ eventName: JWPlayerWeb.adImpression, object: this, eventData: args }); });
            this.webInt.on('adItem', (args) => { this.notify({ eventName: JWPlayerWeb.adItem, object: this, eventData: args }); });
            this.webInt.on('adLoaded', (args) => { this.notify({ eventName: JWPlayerWeb.adLoaded, object: this, eventData: args }); });
            this.webInt.on('adManager', (args) => { this.notify({ eventName: JWPlayerWeb.adManager, object: this, eventData: args }); });
            this.webInt.on('adMeta', (args) => { this.notify({ eventName: JWPlayerWeb.adMeta, object: this, eventData: args }); });
            this.webInt.on('adPause', (args) => { this.notify({ eventName: JWPlayerWeb.adPause, object: this, eventData: args }); });
            this.webInt.on('adPlay', (args) => { this.notify({ eventName: JWPlayerWeb.adPlay, object: this, eventData: args }); });
            this.webInt.on('adRequest', (args) => { this.notify({ eventName: JWPlayerWeb.adRequest, object: this, eventData: args }); });
            this.webInt.on('adSchedule', (args) => { this.notify({ eventName: JWPlayerWeb.adSchedule, object: this, eventData: args }); });
            this.webInt.on('adSkipped', (args) => { this.notify({ eventName: JWPlayerWeb.adSkipped, object: this, eventData: args }); });
            this.webInt.on('adStarted', (args) => { this.notify({ eventName: JWPlayerWeb.adStarted, object: this, eventData: args }); });
            this.webInt.on('adTime', (args) => { this.notify({ eventName: JWPlayerWeb.adTime, object: this, eventData: args }); });
            this.webInt.on('adViewableImpression', (args) => { this.notify({ eventName: JWPlayerWeb.adViewableImpression, object: this, eventData: args }); });
            this.webInt.on('adWarning', (args) => { this.notify({ eventName: JWPlayerWeb.adWarning, object: this, eventData: args }); });
            this.webInt.on('adsManager', (args) => { this.notify({ eventName: JWPlayerWeb.adManager, object: this, eventData: args }); });
            this.webInt.on('beforeComplete', (args) => { this.notify({ eventName: JWPlayerWeb.beforeComplete, object: this, eventData: args }); });
            this.webInt.on('beforePlay', (args) => { this.notify({ eventName: JWPlayerWeb.beforePlay, object: this, eventData: args }); });
            this.webInt.on('audioTracks', (args) => { this.notify({ eventName: JWPlayerWeb.audioTracks, object: this, eventData: args }); });
            this.webInt.on('audioTrackChanged', (args) => { this.notify({ eventName: JWPlayerWeb.audioTrackChanged, object: this, eventData: args }); });
            this.webInt.on('bufferChange', (args) => { this.notify({ eventName: JWPlayerWeb.bufferChange, object: this, eventData: args }); });
            this.webInt.on('captionsList', (args) => { this.notify({ eventName: JWPlayerWeb.captionsList, object: this, eventData: args }); });
            this.webInt.on('captionsChanged', (args) => { this.notify({ eventName: JWPlayerWeb.captionsChanged, object: this, eventData: args }); });
            this.webInt.on('cast', (args) => { this.notify({ eventName: JWPlayerWeb.cast, object: this, eventData: args }); });
            this.webInt.on('controls', (args) => { this.notify({ eventName: JWPlayerWeb.controls, object: this, eventData: args }); });
            this.webInt.on('displayClick', (args) => { this.notify({ eventName: JWPlayerWeb.displayClick, object: this, eventData: args }); });
            this.webInt.on('meta', (args) => { this.notify({ eventName: JWPlayerWeb.meta, object: this, eventData: args }); });
            this.webInt.on('metadataCueParsed', (args) => { this.notify({ eventName: JWPlayerWeb.metadataCueParsed, object: this, eventData: args }); });
            this.webInt.on('autostartNotAllowed', (args) => { this.notify({ eventName: JWPlayerWeb.autostartNotAllowed, object: this, eventData: args }); });
            this.webInt.on('play', (args) => { this.notify({ eventName: JWPlayerWeb.play, object: this, eventData: args }); });
            this.webInt.on('pause', (args) => { this.notify({ eventName: JWPlayerWebCommon.pause, object: this, eventData: args }); });
            this.webInt.on('playAttemptFailed', (args) => { this.notify({ eventName: JWPlayerWeb.playAttemptFailed, object: this, eventData: args }); });
            this.webInt.on('buffer', (args) => { this.notify({ eventName: JWPlayerWeb.buffer, object: this, eventData: args }); });
            this.webInt.on('idle', (args) => { this.notify({ eventName: JWPlayerWeb.idle, object: this, eventData: args }); });
            this.webInt.on('complete', (args) => { this.notify({ eventName: JWPlayerWeb.complete, object: this, eventData: args }); });
            this.webInt.on('firstFrame', (args) => { this.notify({ eventName: JWPlayerWeb.firstFrame, object: this, eventData: args }); });
            this.webInt.on('error', (args) => { this.notify({ eventName: JWPlayerWeb.error, object: this, eventData: args }); });
            this.webInt.on('warning', (args) => { this.notify({ eventName: JWPlayerWeb.warning, object: this, eventData: args }); });
            this.webInt.on('playbackRateChanged', (args) => { this.notify({ eventName: JWPlayerWeb.playbackRateChanged, object: this, eventData: args }); });
            this.webInt.on('playlist', (args) => { this.notify({ eventName: JWPlayerWeb.playlist, object: this, eventData: args }); });
            this.webInt.on('playlistItem', (args) => { this.notify({ eventName: JWPlayerWeb.playlistItem, object: this, eventData: args }); });
            this.webInt.on('playlistComplete', (args) => { this.notify({ eventName: JWPlayerWeb.playlistComplete, object: this, eventData: args }); });
            this.webInt.on('levels', (args) => { this.notify({ eventName: JWPlayerWeb.levels, object: this, eventData: args }); });
            this.webInt.on('levelsChanged', (args) => { this.notify({ eventName: JWPlayerWeb.levelsChanged, object: this, eventData: args }); });
            this.webInt.on('visualQuality', (args) => { this.notify({ eventName: JWPlayerWeb.visualQuality, object: this, eventData: args }); });
            this.webInt.on('fullscreen', (args) => { this.notify({ eventName: JWPlayerWeb.fullscreen, object: this, eventData: args }); });
            this.webInt.on('resize', (args) => { this.notify({ eventName: JWPlayerWeb.resize, object: this, eventData: args }); });
            this.webInt.on('seek', (args) => { this.notify({ eventName: JWPlayerWeb.seek, object: this, eventData: args }); });
            this.webInt.on('seeked', (args) => { this.notify({ eventName: JWPlayerWeb.seeked, object: this, eventData: args }); });
            this.webInt.on('time', (args) => { this.notify({ eventName: JWPlayerWeb.time, object: this, eventData: args }); });
            this.webInt.on('viewable', (args) => { this.notify({ eventName: JWPlayerWeb.viewable, object: this, eventData: args }); });
            this.webInt.on('mute', (args) => { this.notify({ eventName: JWPlayerWeb.mute, object: this, eventData: args }); });
            this.webInt.on('volume', (args) => { this.notify({ eventName: JWPlayerWeb.volume, object: this, eventData: args }); });
            this.isLiLoaded = false;

            li.on("loadFinished", () => {
                setTimeout(() => {
                    this.isLiLoaded = true;
                    this.updateState();
                    if (isAndroid) {
                        let w = li.android
                        w.setWebViewClient(new android.webkit.WebViewClient());
                        w.setWebChromeClient(new android.webkit.WebChromeClient());
                        let webSettings = w.getSettings();
                        webSettings.setJavaScriptEnabled(true);
                        webSettings.setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
                        webSettings.setAllowFileAccess(true);
                        webSettings.setAppCacheEnabled(true);
                    }
                }, 1)
            })
        }, 2)

    }

    [srcProperty.setNative](value) {
        this.src = value;
        if (this.isLiLoaded) {
            this.updateState();
        }
    }

    updateState() {
        if (this.src.playlist != undefined) {
            this.load(this.src.playlist);
        }
        if (this.src.controls != undefined) {
            this.setControls(this.src.controls);
        }
        if (this.src.floating != undefined) {
            this.setFloating(this.src.floating)
        }
        this.setConfig();
    }

    setConfig() {
        if (this.webInt) {
            let config = {}

            if (this.src.autostart != undefined) {
                config["autostart"] = this.src.autostart;
            }
            if (this.src.aspectratio != undefined) {
                config["aspectratio"] = this.src.aspectratio;
            }
            setTimeout(() => {
                this.webInt.emit('setConfig', config);
            }, 1)
        }
    }


    triggerAd(tag) {
        if (this.webInt) {
            setTimeout(() => {
                this.webInt.emit('triggerAd', tag);
            }, 1)
        }
    }
    resizePlayer(args) {
        if (this.webInt) {
            setTimeout(() => {
                this.webInt.emit('resizePlayer', args);
            }, 1)
        }
    }
    play() {
        if (this.webInt) {
            setTimeout(() => {
                this.webInt.emit('play', {});
            }, 1)
        }
    }
    pause() {
        if (this.webInt) {
            setTimeout(() => {
                this.webInt.emit('pause', {});
            }, 1)
        }
    }
    getMute() {
        setTimeout(() => {
            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getMute', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)
    }
    getVolume() {
        setTimeout(() => {
            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getVolume', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)
    }
    setMute(state) {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('setMute', { state });
            }
        }, 1)

    }
    setVolume(volume) {
        setTimeout(() => {
            if (this.webInt) {
                this.webInt.emit('setVolume', { volume });
            }
        }, 1)
    }
    setFloating(state) {
        setTimeout(() => {
            if (this.webInt) {
                this.webInt.emit('setFloating', { state });
            }
        }, 1)
    }
    getPercentViewable() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getPercentViewable', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    getViewable() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getViewable', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    getPosition() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getPosition', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    getDuration() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getDuration', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    seek(position) {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('seek', { position });
            }
        }, 1)

    }
    getFullscreen() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getFullscreen', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    getHeight() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getHeight', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    getWidth() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getWidth', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    setPlaylistItemCallback(callback) {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('setPlaylistItemCallback', [callback], (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    removePlaylistItemCallback() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('removePlaylistItemCallback', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    getPlaylistItemPromise(index) {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getPlaylistItemPromise', [index], (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    getQualityLevels() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getQualityLevels', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    getCurrentQuality() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getCurrentQuality', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    getVisualQuality() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getVisualQuality', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    setCurrentQuality(index) {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('setCurrentQuality', { index });
            }
        }, 1)

    }
    getPlaybackRate() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getPlaybackRate', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    setPlaybackRate(rate) {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('setPlaybackRate', { rate });
            }
        }, 1)

    }
    next() {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('next', {});
            }
        }, 1)

    }
    getPlaylist() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getPlaylist', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    getPlaylistItem() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getPlaylistItem', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });

                return p;
            }
        }, 1)

    }
    getPlaylistIndex() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getPlaylistIndex', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    load(playlist) {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('load', { playlist });
            }
        }, 1)

    }
    playlistItem(index) {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('playlistItem', { index });
            }
        }, 1)

    }
    stop() {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('stop', {});
            }
        }, 1)

    }
    getState() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getState', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    getAdBlock() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getAdBlock', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    pauseAd(state) {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('pauseAd', [state], (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    playAd(tag) {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('playAd', [tag], (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    skipAd() {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('skipAd', {});
            }
        }, 1)

    }
    getAudioTracks() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getAudioTracks', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    getCurrentAudioTrack() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getCurrentAudioTrack', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    setCurrentAudioTrack(index) {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('setCurrentAudioTrack', { index });
            }
        }, 1)

    }
    addButton({ img, tooltip, callback, id, btnClass }) {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('addButton', [img, tooltip, callback, id, btnClass], (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    addCues(cues) {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('addCues', { cues });
            }
        }, 1)

    }
    getControls() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getControls', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    getCues() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getCues', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    getSafeRegion() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getSafeRegion', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    removeButton(id) {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('removeButton', { id });
            }
        }, 1)

    }
    setControls(state) {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('setControls', { state });
            }
        }, 1)

    }
    setCues(cues) {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('setCues', { cues });
            }
        }, 1)

    }
    setCaptions(styles) {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('setCaptions', { styles });
            }
        }, 1)

    }
    getCaptionsList() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getCaptionsList', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    getCurrentCaptions() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getCurrentCaptions', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    setCurrentCaptions(index) {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('setCurrentCaptions', { index });
            }
        }, 1)

    }
    getBuffer() {
        setTimeout(() => {

            if (this.webInt) {
                let p = new Promise((resolve, reject) => {
                    this.webInt.callJSFunction('getBuffer', null, (res) => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    });
                });
                return p;
            }
        }, 1)

    }
    stopCasting() {
        setTimeout(() => {

            if (this.webInt) {
                this.webInt.emit('stopCasting', {});
            }
        }, 1)

    }

}
