var socket = io.connect();
socket.on('connect', function() {
	console.log("Connected");
});

window.addEventListener('load', init);
var BGcanvas, context, p;

var pArr = [];
var colors = ["#00FF00", "#138A36", "#04E824", "#18FF6D"];
var colIdx = 0;
for (let i = 0; i < 10; i++) {
	var p;
	pArr.push(p);
}

function init() {
	BGcanvas = document.getElementById('bgCanvas');
	BGcanvas.width = window.innerWidth;
	BGcanvas.height = window.innerHeight;
	context = BGcanvas.getContext('2d');

	for (let i = 0; i < 100; i++) {
		pArr[i] = new Particle();
		pArr[i].display();
	}


	socket.on('drawing', function(receivedData) {

		colIdx = receivedData.idx;
		for (let i = 0; i < receivedData.num; i++) {
			pArr[i].colIdx = colIdx;
			realX = receivedData.x / receivedData.w * BGcanvas.width;
			realY = receivedData.y / receivedData.h * BGcanvas.height;
			pArr[i].applyForce(realX, realY);
		}
	});
	animate();

}

function Particle() {

	this.posX = BGcanvas.width;
	this.posY = BGcanvas.height;


	this.velX = 0;
	this.velY = 0;

	this.accX = 0.0;
	this.accY = 0.0;

	this.m = 8000 + Math.random() * 2000;
	this.r = 10;
	this.colIdx = 0;

	this.applyForce = function(x, y) {
		this.accX = (x - this.posX) / this.m;
		this.accY = (y - this.posY) / this.m;
	}

	this.update = function() {
		this.velX += this.accX;
		this.velY += this.accY;

		this.posX += this.velX;
		this.posY += this.velY;

		// this.accX *= 0.99;
		// this.accY *= 0.99;
		this.velX *= 0.99;
		this.velY *= 0.99;
		this.bounce();

	}

	this.display = function() {
		context.globalAlpha = 1;
		context.beginPath();
		context.arc(this.posX, this.posY, this.r, 0, 2 * Math.PI);
		context.fillStyle = colors[this.colIdx];
		context.fill();
	}

	this.bounce = function() {
		if (this.posX > BGcanvas.width) {
			this.posX = BGcanvas.width;
			this.velX *= -1
		} else if (this.posX < 0) {
			this.posX = 0;
			this.velX *= -1
		}

		if (this.posY > BGcanvas.height) {
			this.posY = BGcanvas.height;
			this.velY *= -1;
		} else if (this.posY < 0) {
			this.posY = 0;
			this.velY *= -1;
		}
	}


}

function animate() {
	requestAnimationFrame(animate);
	context.globalAlpha = 0.07;
	context.beginPath();
	context.rect(0, 0, BGcanvas.width, BGcanvas.height);
	context.fillStyle = "#FFFFFF";
	context.fill();

	for (let i = 0; i < 100; i++) {
		pArr[i].update();
		pArr[i].display();
	}

}
