


function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }



const fs = require('fs');
let out = fs.readFileSync("download.txt").toString("UTF-8").replace(/\r/g, "").split("\n");
let trimx = out[0].length;
for(let i = 0; i != out.length; ++i) {
	const x = out[i].search(/[^ ]/g);
	if(x !== -1 && x < trimx) {
		trimx = x;
	} else if(x === -1) {
		out[i] = "";
	}
}

for(let i = 0; i != out.length; ++i) {
	line = out[i].substr(trimx);
	line = line.replace(/ +$/g, "");
	line = escapeHtml(line);
	if(line.length && line[0] === " " && line[1] !== " ") {
		line = "&nbsp;" + line.substr(1);
	}
	line = line.replace(/\s+/g, (m) => { return " &nbsp;".repeat(Math.floor(m.length / 2)) + " ".repeat(m.length%2); });
	out[i] = line;
	console.log(i + "/" + out.length);
}

out = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\" /><title>TWHL's Old YourWorldOfText</title><style>html, body{margin: 0; padding: 0; font-family: \"Courier New\", monospace; white-space: nowrap;}</style></head>" +
	"<body><h1>A copy of <a href=\"https://www.yourworldoftext.com/twhl\">yourworldoftext.com/twhl</a>, created on 2018-09-14</h1><p><a href=\"#center\">Go to the middle</a><div>\n" + out.join("<br />\n") + "\n</div></body></html>";
out = out.replace(/Mount Penis/g, "<span id=\"center\">Mount Penis</span>");
	fs.writeFileSync("downloadx.html", out);



















Scraper:
(() => {

	var saveAs = saveAs || (function(view) {
		"use strict";
		// IE <10 is explicitly unsupported
		if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
			return;
		}
		var
			  doc = view.document
			  // only get URL when necessary in case Blob.js hasn't overridden it yet
			, get_URL = function() {
				return view.URL || view.webkitURL || view;
			}
			, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
			, can_use_save_link = "download" in save_link
			, click = function(node) {
				var event = new MouseEvent("click");
				node.dispatchEvent(event);
			}
			, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
			, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
			, setImmediate = view.setImmediate || view.setTimeout
			, throw_outside = function(ex) {
				setImmediate(function() {
					throw ex;
				}, 0);
			}
			, force_saveable_type = "application/octet-stream"
			// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
			, arbitrary_revoke_timeout = 1000 * 40 // in ms
			, revoke = function(file) {
				var revoker = function() {
					if (typeof file === "string") { // file is an object URL
						get_URL().revokeObjectURL(file);
					} else { // file is a File
						file.remove();
					}
				};
				setTimeout(revoker, arbitrary_revoke_timeout);
			}
			, dispatch = function(filesaver, event_types, event) {
				event_types = [].concat(event_types);
				var i = event_types.length;
				while (i--) {
					var listener = filesaver["on" + event_types[i]];
					if (typeof listener === "function") {
						try {
							listener.call(filesaver, event || filesaver);
						} catch (ex) {
							throw_outside(ex);
						}
					}
				}
			}
			, auto_bom = function(blob) {
				// prepend BOM for UTF-8 XML and text/* types (including HTML)
				// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
				if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
					return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
				}
				return blob;
			}
			, FileSaver = function(blob, name, no_auto_bom) {
				if (!no_auto_bom) {
					blob = auto_bom(blob);
				}
				// First try a.download, then web filesystem, then object URLs
				var
					  filesaver = this
					, type = blob.type
					, force = type === force_saveable_type
					, object_url
					, dispatch_all = function() {
						dispatch(filesaver, "writestart progress write writeend".split(" "));
					}
					// on any filesys errors revert to saving with object URLs
					, fs_error = function() {
						if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
							// Safari doesn't allow downloading of blob urls
							var reader = new FileReader();
							reader.onloadend = function() {
								var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
								var popup = view.open(url, '_blank');
								if(!popup) view.location.href = url;
								url=undefined; // release reference before dispatching
								filesaver.readyState = filesaver.DONE;
								dispatch_all();
							};
							reader.readAsDataURL(blob);
							filesaver.readyState = filesaver.INIT;
							return;
						}
						// don't create more object URLs than needed
						if (!object_url) {
							object_url = get_URL().createObjectURL(blob);
						}
						if (force) {
							view.location.href = object_url;
						} else {
							var opened = view.open(object_url, "_blank");
							if (!opened) {
								// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
								view.location.href = object_url;
							}
						}
						filesaver.readyState = filesaver.DONE;
						dispatch_all();
						revoke(object_url);
					}
				;
				filesaver.readyState = filesaver.INIT;
	
				if (can_use_save_link) {
					object_url = get_URL().createObjectURL(blob);
					setImmediate(function() {
						save_link.href = object_url;
						save_link.download = name;
						click(save_link);
						dispatch_all();
						revoke(object_url);
						filesaver.readyState = filesaver.DONE;
					}, 0);
					return;
				}
	
				fs_error();
			}
			, FS_proto = FileSaver.prototype
			, saveAs = function(blob, name, no_auto_bom) {
				return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
			}
		;
	
		// IE 10+ (native saveAs)
		if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
			return function(blob, name, no_auto_bom) {
				name = name || blob.name || "download";
	
				if (!no_auto_bom) {
					blob = auto_bom(blob);
				}
				return navigator.msSaveOrOpenBlob(blob, name);
			};
		}
	
		// todo: detect chrome extensions & packaged apps
		//save_link.target = "_blank";
	
		FS_proto.abort = function(){};
		FS_proto.readyState = FS_proto.INIT = 0;
		FS_proto.WRITING = 1;
		FS_proto.DONE = 2;
	
		FS_proto.error =
		FS_proto.onwritestart =
		FS_proto.onprogress =
		FS_proto.onwrite =
		FS_proto.onabort =
		FS_proto.onerror =
		FS_proto.onwriteend =
			null;
	
		return saveAs;
	}(
		   typeof self !== "undefined" && self
		|| typeof window !== "undefined" && window
		|| this
	));
	
	
	
	
	
	
	
	
	
	
	
	const tileWidth = 16;
	const tileHeight = 8;
	const tilesPerRequestX = 32;
	const tilesPerRequestY = 31;
	const dlWidth = 30;
	const dlHeight = 20;
	
	const spaces = " ".repeat(tileWidth);
	
	const xMin = 0 - Math.floor(dlWidth / 2);
	const yMin = 0 - Math.floor(dlHeight / 2);
	const xPTE = Math.ceil(dlWidth / 2);
	const yPTE = Math.ceil(dlHeight / 2);
	
	let x = xMin;
	let y = yMin;
	let end = false;
	const socket = new WebSocket("wss://www.yourworldoftext.com/twhl/ws/");
	
	const requestMessageObject = {"fetchRectangles":[{"minY":0,"minX":0,"maxY":31,"maxX":30}],"kind":"fetch","v":"3"};
	let lastX = x;
	let lastY = y;
	
	let eol = false;
	
	let lines = [];
	for(let ll = 0; ll != dlHeight * tilesPerRequestY * tileHeight; ++ll) {
		lines.push("");
	}
	
	let firstGoodLine = null;
	let lastGoodLine = 0;
	
	function sendNext() {
		const myMinY = y * tilesPerRequestY;
		requestMessageObject.fetchRectangles[0].minX = x * tilesPerRequestX;
		requestMessageObject.fetchRectangles[0].minY = myMinY;
		requestMessageObject.fetchRectangles[0].maxX = (1 + x) * tilesPerRequestX - 1;
		requestMessageObject.fetchRectangles[0].maxY = (1 + y ) * tilesPerRequestY - 1;
		lastX = x;
		lastY = y;
		console.log("AAAA" + JSON.stringify(requestMessageObject));
		++x;
		eol = false;
		if(x >= xPTE) {
			x = xMin;
			++y;
			end = (y === yPTE);
			eol = true;
		}
		
		socket.send(JSON.stringify(requestMessageObject));
		
	}
	function dataReceived(data) {
		//console.log("got websocket message", data);
		//console.log(data);
		if(typeof data.tiles !== "object") {
			throw new Error("Bad data");
		}
		for(let v = lastY * tilesPerRequestY; v != (1 + lastY) * tilesPerRequestY; ++v) {
			for(let h = lastX * tilesPerRequestX; h != (1 + lastX) * tilesPerRequestX; ++h) {
				const tileName = v + "," + h;
				try {
					const tile = data.tiles[tileName];
					for(let p = 0; p != tileHeight; ++p) {
						let text = spaces;
						const lineNumber = -yMin*tilesPerRequestY*tileHeight + (v) * tileHeight + p;
						if(tile !== null) {
							text = tile.content.substr(p * tileWidth, tileWidth);
							if(text !== spaces) {
								firstGoodLine = firstGoodLine === null ? lineNumber : firstGoodLine;
								lastGoodLine = Math.max(lastGoodLine, lineNumber);
							}
						}
						lines[lineNumber] += text;
					}
				} catch(e) {
					console.error(e);
					console.error(data.tiles);
					console.error(tileName);
					return;
				}
			}
		}
		if(eol) {
			
			/*for(let i = lastY * tilesPerRequestY * tileHeight + -yMin*tilesPerRequestY*tileHeight; i < lines.length; ++i) {
				lines[i] = lines[i].replace(/ +$/g, "");
			}*/
		}
		if(end) {
			if(firstGoodLine === null) throw new Error("No meaningful lines");
			lines = lines.slice(firstGoodLine, lastGoodLine + 1);
			/*let firstGoodLeft = tileWidth *  tilesPerRequestX * dlWidth;
			for(let i = 0; i != lines.length; ++i) {
				const sr = lines[i].search(/[^ ]/g);
				if(sr !== -1) {
					firstGoodLeft = Math.min(firstGoodLeft, sr);
				}
			}
			for(let i = 0; i != lines.length; ++i) {
				lines[i] = lines[i].substr(firstGoodLeft);
			}*/
			saveAs(new Blob([lines.join("\n")]));
			console.log(window.l = lines);
		} else {
			sendNext();
		}
	}
	
	
	socket.onerror = (error) => {
		console.error("Error: %o", error);
	};
	socket.onmessage = (helloMessage) => { 
		socket.onmessage = (message) => {
			let data = JSON.parse(message.data);
			dataReceived(data);
		};
		sendNext();
	};
	
	
	
	
	})();
	










