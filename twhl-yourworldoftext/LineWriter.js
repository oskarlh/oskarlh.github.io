
function d(offsetX = 0, text = "TACO ", xStart = 69, yStart = 68, dirX = 1, dirY = 1, lineLength = 4000) {

	
	
	
	
	
	
	



	const maxCharsPerRequest = 140;
	const tileWidth = 16;
	const tileHeight = 8;
	const socket = new WebSocket("wss://www.yourworldoftext.com/twhl2018/ws/");

	let pos = [xStart + offsetX,yStart];
	const dir = [dirX,dirY];

	let editCount = 0 + offsetX;

const t = Date.now();

	function sendNext() {
		const requestMessageObject = {"edits":[],"kind":"write"};


		for(let limit = Math.min(lineLength, editCount + maxCharsPerRequest); editCount != limit; ++editCount) {
			let tileX = Math.floor(pos[0] / tileWidth);
			let charX = pos[0] % tileWidth;
			if(charX < 0) {
				charX += tileWidth;
			} else if(charX === -0) {
				charX = 0;
			}
			let tileY = Math.floor(pos[1] / tileHeight);
			let charY = pos[1] % tileHeight;
			if(charY < 0) {
				charY += tileHeight;
			} else if(charY === -0) {
				charY = 0;
			}

			const edit = [tileY,tileX,charY,charX,t + editCount,text[editCount % text.length], editCount];
			requestMessageObject.edits.push(edit);
			pos[0] += dir[0];
			pos[1] += dir[1];
		}
		
		socket.send(JSON.stringify(requestMessageObject));
	}
	function dataReceived(data) {
		console.log("got websocket message", data);
		if(editCount < lineLength) {
			setTimeout(() => {
				sendNext();
			}, 920);
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
	
	
	
	
}

	










