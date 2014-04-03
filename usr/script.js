// about ball

		var ballspeed = 8;
			function Ball(r, p, v, a) {
				this.radius = r;
				this.point = p;
				this.vector = v;
				this.maxVec = ballspeed;
				this.numSegment = Math.floor(r / 3 + 2);
				this.boundOffset = [];
				this.boundOffsetBuff = [];
				this.sidePoints = [];
				if(!a) this.path = new Path({
					fillColor: {
						hue: '80',
						saturation: 1,
						brightness: 1
					},
					blendMode: 'screen'
				});
				else this.path = new Path({
					fillColor: {
						hue: '0',
						saturation: 1,
						brightness: 1
					},
					blendMode: 'screen'
				});

	for (var i = 0; i < this.numSegment; i ++) {
		this.boundOffset.push(this.radius);
		this.boundOffsetBuff.push(this.radius);
		this.path.add(new Point());
		this.sidePoints.push(new Point({
			angle: 360 / this.numSegment * i,
			length: 1
		}));
	}
}

Ball.prototype = {
	iterate: function() {
		this.checkBorders();
		if (this.vector.length > this.maxVec)
			this.vector.length = this.maxVec;
		this.point += this.vector;
		this.updateShape();
	},

	checkBorders: function() {
		var size = view.size;
		if (this.point.x < -this.radius)
			this.point.x = size.width + this.radius;
		if (this.point.x > size.width + this.radius)
			this.point.x = -this.radius;
		if (this.point.y < -this.radius)
			this.point.y = size.height + this.radius;
		if (this.point.y > size.height + this.radius)
			this.point.y = -this.radius;
	},

	updateShape: function() {
		var segments = this.path.segments;
		for (var i = 0; i < this.numSegment; i ++)
			segments[i].point = this.getSidePoint(i);

		this.path.smooth();
		for (var i = 0; i < this.numSegment; i ++) {
			if (this.boundOffset[i] < this.radius / 4)
				this.boundOffset[i] = this.radius / 4;
			var next = (i + 1) % this.numSegment;
			var prev = (i > 0) ? i - 1 : this.numSegment - 1;
			var offset = this.boundOffset[i];
			offset += (this.radius - offset) / 15;
			offset += ((this.boundOffset[next] + this.boundOffset[prev]) / 2 - offset) / 3;
			this.boundOffsetBuff[i] = this.boundOffset[i] = offset;
		}
	},

	react: function(b) {
		var dist = this.point.getDistance(b.point);
		if (dist < this.radius + b.radius && dist != 0) {
			var overlap = this.radius + b.radius - dist;
			var direc = (this.point - b.point).normalize(overlap * 0.015);
			this.vector += direc;
			b.vector -= direc;

			this.calcBounds(b);
			b.calcBounds(this);
			this.updateBounds();
			b.updateBounds();
		}
	},

	getBoundOffset: function(b) {
		var diff = this.point - b;
		var angle = (diff.angle + 180) % 360;
		return this.boundOffset[Math.floor(angle / 360 * this.boundOffset.length)];
	},

	calcBounds: function(b) {
		for (var i = 0; i < this.numSegment; i ++) {
			var tp = this.getSidePoint(i);
			var bLen = b.getBoundOffset(tp);
			var td = tp.getDistance(b.point);
			if (td < bLen) {
				this.boundOffsetBuff[i] -= (bLen  - td) / 2;
			}
		}
	},

	getSidePoint: function(index) {
		return this.point + this.sidePoints[index] * this.boundOffset[index];
	},

	updateBounds: function() {
		for (var i = 0; i < this.numSegment; i ++)
			this.boundOffset[i] = this.boundOffsetBuff[i];
	}
};

// about ball

//--------------------- main ---------------------
var temptext = new PointText({
	point: [0, 0],
	content: ' '
});
temptext.characterStyle = {
	fontSize: '40px',
	font: 'buggedbit',
	fillColor: '#6BEE00'
};
// ready font


var menustart = 0;
var gamestart = 0;
var menuslide = 200;
var maintext = new PointText;
var menutext = new Array();
var menuselector;
var selectvalue = 0;
var bgfilter;
var fl = 0;
var balls = [];
var numBalls = 20;
var tm_mainmenu = setInterval(mainmenu, 1500);

var score = 300;
var scoretext;
var press = 20;
var presstext;

var gameover = 0;
var overscore;

var bgmain = new Path.Rectangle(0, 0, 800, 600);
	bgmain.fillColor = '#042F00';

var bgover;

var tm_fl = setInterval(flash, 400);

for (var i = 0; i < numBalls-1; i++) {
	var position = Point.random() * view.size;
	var vector = new Point({
		angle: 0,
		length: Math.random() * 10
	});
	var radius = Math.random() * 20 + 30;
	balls.push(new Ball(radius, position, vector, false));
}
var agl = 0;
var lgth = 0;

function flash() {
	fl = !fl;
}

var keydown = false;
function onKeyUp(e) {
	keydown = false;
}
function onKeyDown(e) {
	if(menustart && !gameover) {
		if (e.key == 'down' & selectvalue<2) {
			selectvalue++;
			clearInterval(tm_fl);
			fl = true;
			tm_fl = setInterval(flash, 400);
		}
		if (e.key == 'up' & selectvalue>0) {
			selectvalue--;
			clearInterval(tm_fl);
			fl = true;
			tm_fl = setInterval(flash, 400);
		}
		if (e.key == 'enter') {
			if (selectvalue == 0) {
				maingame();
				clearInterval(tm_fl);
			}
			if (selectvalue == 1) {
				windows.close();
			}
		}
	}
	if(gamestart) {
		if (!keydown) {
			keydown = true;
			if (e.key == 'right') {
				agl = 0;
				lgth = 3;
				console.log('right');
				press--;
			}
			if (e.key == 'down') {
				agl = 90;
				lgth = 3;
				console.log('down');
				press--;
			}
			if (e.key == 'left') {
				agl = 180;
				lgth = 3;
				console.log('left');
				press--;
			}
			if (e.key == 'up') {
				agl = 280;
				lgth = 3;
				console.log('up');
				press--;
			}
			console.log('onetime');
			var pp = new Point({
					angle: agl,
					length: lgth
				});
				balls[numBalls].vector = pp;
		}
	}
}

function onFrame() {
	for (var i = 0; i < balls.length - 1; i++) {
			for (var j = i + 1; j < balls.length; j++) {
				balls[i].react(balls[j]);
			}
		}
	for (var i = 0, l = balls.length; i < l; i++) {
		balls[i].iterate();
	}

	if(gameover) {
		if(bgover.opacity<0.8) bgover.opacity += 0.01;
		console.log(bgover.opacity);
	}

	if (menustart) {
		console.log("menustart");

		maintext.point = [100, 120-menuslide];
		menutext[0].point = [550+menuslide, 300];
		menutext[1].point = [550+menuslide, 350];
		menutext[2].point = [550+menuslide, 400];
		menuselector.position = [510+menuslide, 290+selectvalue*50];
		menuselector.opacity = fl;

		if(menuslide>0) {
			bgfilter.opacity += menuslide/4000;
		}
	}

	if(gamestart){
		//if gamestarted
		console.log(balls[numBalls].point.x);
		if (balls[numBalls].point.x < 290) {
			for (var i = 0; i < numBalls; i++) {
				balls[i].point.x += 300-balls[numBalls].point.x;
			}
			score += (balls[numBalls].point.x-290)*2;
			balls[numBalls].point.x = 290;
		}
		if (balls[numBalls].point.x > 310) {
			for (var i = 0; i < numBalls; i++) {
				balls[i].point.x += 300-balls[numBalls].point.x;
			}
			score += balls[numBalls].point.x-310;
			balls[numBalls].point.x = 310;
		}
		if(score<0) overgame();
		scoretext.content = 'Score : '+Math.floor(score);
		if(press<0) overgame();
		else presstext.content = 'Press : '+press;
	}
	if(gameover) {
		if(overscore.point.y < 300) overscore.point.y += 1+overscore.point.y/10;

	}
}
function mainmenu() {
	if(!menustart) {
		bgfilter = new Path.Rectangle(0, 0, 800, 600);
		bgfilter.fillColor = 'black';
		bgfilter.opacity = 0;
		maintext = new PointText({
			point: [100, 0],
			content: 'Dirty Disgusting\nAmeba Running-world',
			justificaton: 'center',
			fontSize: '40px',
			fontFamily: 'buggedbit',
			fillColor: '#6BEE00'
		});
		menuselector = new Path.Rectangle( {
			point : [510, 300],
			size : [20, 20],
			fillColor: '#6BEE00'
		});

		menutext[0] = new PointText({
			point: [550, 300],
			content: 'Start',
			fillColor: '#6BEE00',
			fontFamily: 'buggedbit',
			fontSize: '30px',
			justificaton: 'left'
		});

		menutext[1] = new PointText({
			point: [550, 350],
			content: 'Exit',
			fillColor: '#6BEE00',
			fontFamily: 'buggedbit',
			fontSize: '30px',
			justificaton: 'left'
		});

		clearInterval(mainmenu);
		setInterval(mainmenu, 20);
		console.log("mainmenu");
		menustart = 1;
	}
	if (menuslide>0) { menuslide -= (menuslide)/10; }
	if (menuslide<1) { clearInterval(mainmenu); }
}
function maingame() {
	if (!gamestart) {
		balls = [];
		gamestart = true;
		ballspeed = 5;
		var bgmain2 = new Path.Rectangle(0, 0, 800, 600);
		bgmain2.fillColor = '#042F00';
		for (var i = 0; i < numBalls; i++) {
			var position = Point.random() * view.size;
			var vector = new Point({
				angle: 180,
				length: Math.random() * 10
			});
			var radius = Math.random() * 20 + 30;
			balls.push(new Ball(radius, position, vector, false));
		}

		scoretext = new PointText({
			point: [100, 80],
			content: 'Score : '+score,
			fillColor: '#FFFFFF',
			strokeColor: '#042F00',
			fontFamily: 'buggedbit',
			fontSize: '30px',
			justificaton: 'left'
		});
		presstext = new PointText({
			point: [100, 130],
			content: 'Remain : '+press,
			fillColor: '#FFFFFF',
			strokeColor: '#042F00',
			fontFamily: 'buggedbit',
			fontSize: '30px',
			justificaton: 'left'
		});

		var pPosition = new Point(300, 300);
		var pVector = new Point({
			angle: 0,
			length: 2
		});
		var pRadius = 40;
		balls.push(new Ball(pRadius, pPosition, pVector, true));
	}
} //maingame

function overgame() {
	if (!gameover) {
		console.log("GAMEOVER");
		gamestart = false;
		gameover = true;
		menuslide = 200;
		bgover = new Path.Rectangle(0, 0, 800, 600);
		bgover.fillColor = 'black';
		bgover.opacity = 0;
		overscore = new PointText({
			point: [350, 0],
			content: Math.floor(score),
			fillColor: '#6BEE00',
			fontFamily: 'buggedbit',
			fontSize: '80px',
			justificaton: 'center'
		});
		setInterval(overgame, 20);
	}
	if (menuslide>0) { menuslide -= (menuslide)/10; }
	if (menuslide<1) { clearInterval(mainmenu); }
}
