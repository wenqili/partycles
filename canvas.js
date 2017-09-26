var mycolor = "#" + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9);
console.log(mycolor);
var myIdx;
var pNum;
var socket = io.connect();
socket.on('connect', function() {
	myIdx = Math.floor(Math.random() * 4);
	console.log("Connected");
});

window.addEventListener('load', init);

function init() {
	var canvas = document.getElementById('thecanvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var context = canvas.getContext('2d');

	var px = 0;
	var py = 0;
	var mouseFlag = false;
	var alpha = 0;
	var delta = 0.1;

	canvas.addEventListener('mousedown', function(evt) {
		mouseFlag = true;
		px = evt.clientX;
		py = evt.clientY;
		pNum = Math.floor(Math.random() * 100);
	})

	canvas.addEventListener('mouseup', function(evt) {
		mouseFlag = false;
		context.beginPath();
		context.rect(0, 0, canvas.width, canvas.height);
		context.fillStyle = "#FFFFFF";
		context.fill();
	})

	canvas.addEventListener('mousemove', function(evt) {
		if (mouseFlag) {
			context.globalAlpha = 0.05;

			context.beginPath();
			context.moveTo(px, py);
			context.arc(evt.clientX, evt.clientY, 40, 0, 2 * Math.PI);
			context.fillStyle = "#00FF00";
			context.fill();
			context.globalAlpha = 0.5;


			var objtosend = {
				idx: myIdx,
				x: evt.clientX,
				y: evt.clientY,
				w: canvas.width,
				h: canvas.height,
				num: pNum,
			};
			socket.emit('drawing', objtosend);

			px = evt.clientX;
			py = evt.clientY;
		}
	});

	// socket.on('drawing', function(receivedData) {
	// context.beginPath();
	// context.strokeStyle = receivedData.color;
	// context.moveTo(receivedData.px, receivedData.py);
	// context.lineTo(receivedData.x, receivedData.y);
	// context.stroke();
	// px = evt.clientX;
	// py = evt.clientY;
	// });


}
