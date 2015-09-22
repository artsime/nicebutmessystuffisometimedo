/**
* PreloadJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011 gskinner.com, inc.
* 
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
**/
var createjs = window;

this.createjs=this.createjs||{};
(function(){var d=function(){this.init()};d.prototype={};var a=d.prototype;a.loaded=false;a.canceled=false;a.progress=0;a._item=null;a.onProgress=null;a.onLoadStart=null;a.onFileLoad=null;a.onFileProgress=null;a.onComplete=null;a.onError=null;a.getItem=function(){return this._item};a.init=function(){};a.load=function(){};a.cancel=function(){};a._sendLoadStart=function(){if(!this._isCanceled()&&this.onLoadStart)this.onLoadStart({target:this})};a._sendProgress=function(a){if(!this._isCanceled()){var b;if(a instanceof
Number)this.progress=a,b={loaded:this.progress,total:1};else if(b=a,this.progress=a.loaded/a.total,isNaN(this.progress)||this.progress==Infinity)this.progress=0;b.target=this;if(this.onProgress)this.onProgress(b)}};a._sendFileProgress=function(a){if(this._isCanceled())this._cleanUp();else if(this.onFileProgress)a.target=this,this.onFileProgress(a)};a._sendComplete=function(){if(!this._isCanceled()&&this.onComplete)this.onComplete({target:this})};a._sendFileComplete=function(a){if(!this._isCanceled()&&
this.onFileLoad)a.target=this,this.onFileLoad(a)};a._sendError=function(a){if(!this._isCanceled()&&this.onError)a==null&&(a={}),a.target=this,this.onError(a)};a._isCanceled=function(){return window.createjs==null||this.canceled?true:false};a.toString=function(){return"[PreloadJS AbstractLoader]"};createjs.AbstractLoader=d})();this.createjs=this.createjs||{};
(function(){var d=function(b){this.initialize(b)},a=d.prototype=new createjs.AbstractLoader;d.IMAGE="image";d.SVG="svg";d.SOUND="sound";d.JSON="json";d.JAVASCRIPT="javascript";d.CSS="css";d.XML="xml";d.TEXT="text";d.TIMEOUT_TIME=8E3;a.useXHR=true;a.stopOnError=false;a.maintainScriptOrder=true;a.next=null;a.typeHandlers=null;a.extensionHandlers=null;a._loadStartWasDispatched=false;a._maxConnections=1;a._currentLoads=null;a._loadQueue=null;a._loadedItemsById=null;a._loadedItemsBySrc=null;a._targetProgress=
0;a._numItems=0;a._numItemsLoaded=null;a._scriptOrder=null;a._loadedScripts=null;a.TAG_LOAD_OGGS=true;a.initialize=function(b){this._targetProgress=this._numItemsLoaded=this._numItems=0;this._paused=false;this._currentLoads=[];this._loadQueue=[];this._scriptOrder=[];this._loadedScripts=[];this._loadedItemsById={};this._loadedItemsBySrc={};this.typeHandlers={};this.extensionHandlers={};this._loadStartWasDispatched=false;this.useXHR=b!=false&&window.XMLHttpRequest!=null;this.determineCapabilities()};
a.determineCapabilities=function(){var b=createjs.PreloadJS.BrowserDetect;if(b!=null)createjs.PreloadJS.TAG_LOAD_OGGS=b.isFirefox||b.isOpera};d.isBinary=function(b){switch(b){case createjs.PreloadJS.IMAGE:case createjs.PreloadJS.SOUND:return true;default:return false}};a.installPlugin=function(b){if(!(b==null||b.getPreloadHandlers==null)){b=b.getPreloadHandlers();if(b.types!=null)for(var a=0,c=b.types.length;a<c;a++)this.typeHandlers[b.types[a]]=b.callback;if(b.extensions!=null)for(a=0,c=b.extensions.length;a<
c;a++)this.extensionHandlers[b.extensions[a]]=b.callback}};a.setMaxConnections=function(b){this._maxConnections=b;this._paused||this._loadNext()};a.loadFile=function(b,a){b==null?this._sendError({text:"File is null."}):(this._addItem(b),a!==false&&this.setPaused(false))};a.loadManifest=function(b,a){var c;if(b instanceof Array){if(b.length==0){this._sendError({text:"Manifest is empty."});return}c=b}else{if(b==null){this._sendError({text:"Manifest is null."});return}c=[b]}for(var d=0,f=c.length;d<
f;d++)this._addItem(c[d],false);a!==false&&this._loadNext()};a.load=function(){this.setPaused(false)};a.getResult=function(b){return this._loadedItemsById[b]||this._loadedItemsBySrc[b]};a.setPaused=function(b){(this._paused=b)||this._loadNext()};a.close=function(){for(;this._currentLoads.length;)this._currentLoads.pop().cancel();this._scriptOrder.length=0;this._loadedScripts.length=0};a._addItem=function(b){b=this._createLoadItem(b);b!=null&&(this._loadQueue.push(b),this._numItems++,this._updateProgress(),
b.getItem().type==createjs.PreloadJS.JAVASCRIPT&&(this._scriptOrder.push(b.getItem()),this._loadedScripts.push(null)))};a._loadNext=function(){if(!this._paused){if(!this._loadStartWasDispatched)this._sendLoadStart(),this._loadStartWasDispatched=true;if(this._numItems==this._numItemsLoaded)this.loaded=true,this._sendComplete(),this.next&&this.next.load&&this.next.load.apply(this.next);for(;this._loadQueue.length&&this._currentLoads.length<this._maxConnections;)this._loadItem(this._loadQueue.shift())}};
a._loadItem=function(b){b.onProgress=createjs.PreloadJS.proxy(this._handleProgress,this);b.onComplete=createjs.PreloadJS.proxy(this._handleFileComplete,this);b.onError=createjs.PreloadJS.proxy(this._handleFileError,this);this._currentLoads.push(b);b.load()};a._handleFileError=function(b){var b=b.target,a=this._createResultData(b.getItem());this._numItemsLoaded++;this._updateProgress();this._sendError(a);this.stopOnError||(this._removeLoadItem(b),this._loadNext())};a._createResultData=function(b){var a=
{id:b.id,result:null,data:b.data,type:b.type,src:b.src};this._loadedItemsById[b.id]=a;return this._loadedItemsBySrc[b.src]=a};a._handleFileComplete=function(b){var b=b.target,a=b.getItem(),c=this._createResultData(a);this._removeLoadItem(b);c.result=b instanceof createjs.XHRLoader?this._createResult(a,b.getResult()):a.tag;switch(a.type){case createjs.PreloadJS.IMAGE:if(b instanceof createjs.XHRLoader){var d=this;c.result.onload=function(){d._handleFileTagComplete(a,c)};return}break;case createjs.PreloadJS.JAVASCRIPT:if(this.maintainScriptOrder){this._loadedScripts[this._scriptOrder.indexOf(a)]=
a;this._checkScriptLoadOrder(b);return}}this._handleFileTagComplete(a,c)};a._checkScriptLoadOrder=function(){for(var b=this._loadedScripts.length,a=0;a<b;a++){var c=this._loadedScripts[a];if(c===null)break;if(c!==true){var d=this.getResult(c.src),c=this.getResult(c.id);c.result=d.result;this._handleFileTagComplete(d,c);this._loadedScripts[a]=true;a--;b--}}};a._handleFileTagComplete=function(b,a){this._numItemsLoaded++;b.completeHandler&&b.completeHandler(a);this._updateProgress();this._sendFileComplete(a);
this._loadNext()};a._removeLoadItem=function(b){for(var a=this._currentLoads.length,c=0;c<a;c++)if(this._currentLoads[c]==b){this._currentLoads.splice(c,1);break}};a._createResult=function(b,a){var c=null,d;switch(b.type){case createjs.PreloadJS.IMAGE:c=this._createImage();break;case createjs.PreloadJS.SOUND:c=b.tag||this._createAudio();break;case createjs.PreloadJS.CSS:c=this._createLink();break;case createjs.PreloadJS.JAVASCRIPT:c=this._createScript();break;case createjs.PreloadJS.SVG:var c=this._createSVG(),
f=this._createXML(a,"image/svg+xml");c.appendChild(f);break;case createjs.PreloadJS.XML:d=this._createXML(a,"text/xml");break;case createjs.PreloadJS.JSON:case createjs.PreloadJS.TEXT:d=a}if(c){if(b.type==createjs.PreloadJS.CSS)c.href=b.src;else if(b.type!=createjs.PreloadJS.SVG)c.src=b.src;return c}else return d};a._createXML=function(b,a){var c;window.DOMParser?(c=new DOMParser,c=c.parseFromString(b,a)):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async=false,c.loadXML(b));return c};a._handleProgress=
function(b){var b=b.target,a=this._createResultData(b.getItem());a.progress=b.progress;this._sendFileProgress(a);this._updateProgress()};a._updateProgress=function(){var b=this._numItemsLoaded/this._numItems,a=this._numItems-this._numItemsLoaded;if(a>0){for(var c=0,d=0,f=this._currentLoads.length;d<f;d++)c+=this._currentLoads[d].progress;b+=c/a*(a/this._numItems)}this._sendProgress({loaded:b,total:1})};a._createLoadItem=function(a){var c={};switch(typeof a){case "string":c.src=a;break;case "object":a instanceof
HTMLAudioElement?(c.tag=a,c.src=c.tag.src,c.type=createjs.PreloadJS.SOUND):c=a}c.ext=this._getNameAfter(c.src,".");if(!c.type)c.type=this.getType(c.ext);if(c.id==null||c.id=="")c.id=c.src;if(a=this.typeHandlers[c.type]||this.extensionHandlers[c.ext]){a=a(c.src,c.type,c.id,c.data);if(a===false)return null;else if(a!==true){if(a.src!=null)c.src=a.src;if(a.id!=null)c.id=a.id;if(a.tag!=null&&a.tag.load instanceof Function)c.tag=a.tag}c.ext=this._getNameAfter(c.src,".")}a=this.useXHR;switch(c.type){case createjs.PreloadJS.JSON:case createjs.PreloadJS.XML:case createjs.PreloadJS.TEXT:a=
true;break;case createjs.PreloadJS.SOUND:c.ext=="ogg"&&createjs.PreloadJS.TAG_LOAD_OGGS&&(a=false)}return this.useXHR==true&&(c.type==createjs.PreloadJS.IMAGE||c.type==createjs.PreloadJS.SVG)?(c=this._createTagItem(c),c.useXHR=true,c):a?new createjs.XHRLoader(c):c.tag?new createjs.TagLoader(c):this._createTagItem(c)};a._createTagItem=function(a){var c,d="src",e=false;switch(a.type){case createjs.PreloadJS.IMAGE:c=this._createImage();break;case createjs.PreloadJS.SOUND:c=this._createAudio();break;
case createjs.PreloadJS.CSS:d="href";e=true;c=this._createLink();break;case createjs.PreloadJS.JAVASCRIPT:e=true;c=this._createScript();break;case createjs.PreloadJS.SVG:d="data",c=this._createSVG()}a.tag=c;return new createjs.TagLoader(a,d,e)};a.getType=function(a){switch(a){case "jpeg":case "jpg":case "gif":case "png":return createjs.PreloadJS.IMAGE;case "ogg":case "mp3":case "wav":return createjs.PreloadJS.SOUND;case "json":return createjs.PreloadJS.JSON;case "xml":return createjs.PreloadJS.XML;
case "css":return createjs.PreloadJS.CSS;case "js":return createjs.PreloadJS.JAVASCRIPT;case "svg":return createjs.PreloadJS.SVG;default:return createjs.PreloadJS.TEXT}};a._getNameAfter=function(a,c){var d=a.lastIndexOf(c),d=a.substr(d+1),e=d.lastIndexOf(/[\b|\?|\#|\s]/);return e==-1?d:d.substr(0,e)};a._createImage=function(){return document.createElement("img")};a._createSVG=function(){var a=document.createElement("object");a.type="image/svg+xml";return a};a._createAudio=function(){var a=document.createElement("audio");
a.autoplay=false;a.type="audio/ogg";return a};a._createScript=function(){var a=document.createElement("script");a.type="text/javascript";return a};a._createLink=function(){var a=document.createElement("link");a.type="text/css";a.rel="stylesheet";return a};a.toString=function(){return"[PreloadJS]"};d.proxy=function(a,c){return function(d){return a.apply(c,arguments)}};createjs.PreloadJS=d;var c=function(){};c.init=function(){var a=navigator.userAgent;c.isFirefox=a.indexOf("Firefox")>-1;c.isOpera=window.opera!=
null;c.isIOS=a.indexOf("iPod")>-1||a.indexOf("iPhone")>-1||a.indexOf("iPad")>-1};c.init();createjs.PreloadJS.BrowserDetect=c})();this.createjs=this.createjs||{};
(function(){var d=function(a,b,d){this.init(a,b,d)},a=d.prototype=new createjs.AbstractLoader;a._srcAttr=null;a._loadTimeOutTimeout=null;a.tagCompleteProxy=null;a.init=function(a,b,d){this._item=a;this._srcAttr=b||"src";this.useXHR=d==true;this.isAudio=a.tag instanceof HTMLAudioElement;this.tagCompleteProxy=createjs.PreloadJS.proxy(this._handleTagLoad,this)};a.cancel=function(){this.canceled=true;this._clean();var a=this.getItem();if(a!=null)a.src=null};a.load=function(){this.useXHR?this.loadXHR():
this.loadTag()};a.loadXHR=function(){var a=this.getItem(),a=new createjs.XHRLoader(a);a.onProgress=createjs.PreloadJS.proxy(this._handleProgress,this);a.onFileLoad=createjs.PreloadJS.proxy(this._handleXHRComplete,this);a.onComplete=createjs.PreloadJS.proxy(this._handleXHRComplete,this);a.onError=createjs.PreloadJS.proxy(this._handleLoadError,this);a.load()};a._handleXHRComplete=function(a){if(!this._isCanceled()){this._clean();a.target.onFileLoad=null;a.target.onComplete=null;var b=a.target.getItem();
a.target.getResult();b.type==createjs.PreloadJS.IMAGE?(b.tag.onload=createjs.PreloadJS.proxy(this._sendComplete,this),b.tag.src=b.src):(b.tag[this._srcAttr]=b.src,this._sendComplete())}};a._handleLoadError=function(a){a.error&&a.error.code==101?this.loadTag():(this._clean(),this._sendError(a))};a.loadTag=function(){var a=this.getItem(),b=a.tag;clearTimeout(this._loadTimeOutTimeout);this._loadTimeOutTimeout=setTimeout(createjs.PreloadJS.proxy(this._handleLoadTimeOut,this),createjs.PreloadJS.TIMEOUT_TIME);
if(this.isAudio)b.src=null,b.preload="auto",b.setAttribute("data-temp","true");b.onerror=createjs.PreloadJS.proxy(this._handleLoadError,this);b.onprogress=createjs.PreloadJS.proxy(this._handleProgress,this);this.isAudio?(b.onstalled=createjs.PreloadJS.proxy(this._handleStalled,this),b.addEventListener("canplaythrough",this.tagCompleteProxy,false)):b.onload=createjs.PreloadJS.proxy(this._handleTagLoad,this);b[this._srcAttr]=a.src;a.type==createjs.PreloadJS.SVG&&document.getElementsByTagName("body")[0].appendChild(b);
a=a.type==createjs.PreloadJS.SOUND&&a.ext=="ogg"&&createjs.PreloadJS.BrowserDetect.isFirefox;b.load!=null&&!a&&b.load()};a._handleLoadTimeOut=function(){this._clean();this._sendError()};a._handleStalled=function(){};a._handleLoadError=function(){this._clean();this._sendError()};a._handleTagLoad=function(){if(!this._isCanceled()){var a=this.getItem().tag;clearTimeout(this._loadTimeOutTimeout);if(!(this.loaded||this.isAudio&&a.readyState!==4))this.getItem().type==createjs.PreloadJS.SVG&&document.getElementsByTagName("body")[0].removeChild(a),
this.loaded=true,this._clean(),this._sendComplete()}};a._clean=function(){clearTimeout(this._loadTimeOutTimeout);var a=this.getItem().tag;a.onload=null;a.removeEventListener&&a.removeEventListener("canplaythrough",this.tagCompleteProxy,false);a.onstalled=null;a.onprogress=null;a.onerror=null};a._handleProgress=function(a){clearTimeout(this._loadTimeOutTimeout);if(this.isAudio){a=this.getItem();if(a.buffered==null)return;a={loaded:a.buffered.length>0?a.buffered.end(0):0,total:a.duration}}this._sendProgress(a)};
a.toString=function(){return"[PreloadJS TagLoader]"};createjs.TagLoader=d})();this.createjs=this.createjs||{};
(function(){var d=function(a){this.init(a)},a=d.prototype=new createjs.AbstractLoader;a._wasLoaded=false;a._request=null;a._loadTimeOutTimeout=null;a._xhrLevel=null;a.init=function(a){this._item=a;this._createXHR(a)};a.getResult=function(){try{return this._request.responseText}catch(a){}return this._request.response};a.cancel=function(){this.canceled=true;this._clean();this._request.abort()};a.load=function(){if(this._request==null)this.handleError();else{if(this._xhrLevel==1)this._loadTimeOutTimeout=
setTimeout(createjs.PreloadJS.proxy(this.handleTimeout,this),createjs.PreloadJS.TIMEOUT_TIME);this._request.onloadstart=createjs.PreloadJS.proxy(this.handleLoadStart,this);this._request.onprogress=createjs.PreloadJS.proxy(this.handleProgress,this);this._request.onabort=createjs.PreloadJS.proxy(this.handleAbort,this);this._request.onerror=createjs.PreloadJS.proxy(this.handleError,this);this._request.ontimeout=createjs.PreloadJS.proxy(this.handleTimeout,this);this._request.onload=createjs.PreloadJS.proxy(this.handleLoad,
this);this._request.onreadystatechange=createjs.PreloadJS.proxy(this.handleReadyStateChange,this);try{this._request.send()}catch(a){this._sendError({source:a})}}};a.handleProgress=function(a){a.loaded>0&&a.total==0||this._sendProgress({loaded:a.loaded,total:a.total})};a.handleLoadStart=function(){clearTimeout(this._loadTimeOutTimeout);this._sendLoadStart()};a.handleAbort=function(){this._clean();this._sendError()};a.handleError=function(){this._clean();this._sendError()};a.handleReadyStateChange=
function(){this._request.readyState==4&&this.handleLoad()};a._checkError=function(){switch(parseInt(this._request.status)){case 404:case 0:return false}return this._hasResponse()||this._hasTextResponse()||this._hasXMLResponse()};a._hasResponse=function(){return this._request.response!=null};a._hasTextResponse=function(){try{return this._request.responseText!=null}catch(a){return false}};a._hasXMLResponse=function(){try{return this._request.responseXML!=null}catch(a){return false}};a.handleLoad=function(){if(!this.loaded)this.loaded=
true,this._checkError()?(this._clean(),this._sendComplete()):this.handleError()};a.handleTimeout=function(){this._clean();this._sendError()};a._createXHR=function(a){this._xhrLevel=1;if(window.ArrayBuffer)this._xhrLevel=2;if(window.XMLHttpRequest)this._request=new XMLHttpRequest;else try{this._request=new ActiveXObject("MSXML2.XMLHTTP.3.0")}catch(b){return null}a.type==createjs.PreloadJS.TEXT&&this._request.overrideMimeType&&this._request.overrideMimeType("text/plain; charset=x-user-defined");this._request.open("GET",
a.src,true);if(createjs.PreloadJS.isBinary(a.type))this._request.responseType="arraybuffer";return true};a._clean=function(){clearTimeout(this._loadTimeOutTimeout);var a=this._request;a.onloadstart=null;a.onprogress=null;a.onabort=null;a.onerror=null;a.onload=null;a.ontimeout=null;a.onloadend=null;a.onreadystatechange=null;clearInterval(this._checkLoadInterval)};a.toString=function(){return"[PreloadJS XHRLoader]"};createjs.XHRLoader=d})();