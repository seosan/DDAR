var menuslide = 200;
var selector = 0;
var fl = 0;
var render = setInterval(render, 20)
var tm_fl = setInterval(flash, 400);


function render() {
	if (menuslide>0) { menuslide -= (menuslide-50)/10; }
	$('#canvas').drawRect({
		fillStyle: '#010C00',
		x: 400 , y: 300, width: 800, height: 600,
		opacity: 0.3
	}).drawRect({
		fillStyle: '#6BEE00',
		x: 480+menuslide, y: 250+selector*50, width: 20, height: 20,
		opacity: fl
	}).drawText({
		fillStyle: '#6BEE00',
		x: 400, y: 150-menuslide,
		fontSize: 40,
		fontFamily: 'buggedbit',
		text: "Dirty Disgusting\nAmeba Running-world"
	}).drawText({
		fillStyle: '#6BEE00',
		x: 550+menuslide, y: 250,
		fontSize: 22,
		fontFamily: 'buggedbit',
		text: "Start"
	}).drawText({
		fillStyle: '#6BEE00',
		x: 550+menuslide, y: 300,
		fontSize: 22,
		fontFamily: 'buggedbit',
		text: "Fucking"
	}).drawText({
		fillStyle: '#6BEE00',
		x: 550+menuslide, y: 350,
		fontSize: 22,
		fontFamily: 'buggedbit',
		text: "Shit"
	});
}

$(document).keydown( function(e) {
	if (e.keyCode == 40 && selector<2) {
		selector++; 
		clearInterval(tm_fl);
		fl = true;
		tm_fl = setInterval(flash, 400);

	}
	if (e.keyCode == 38 && selector>0) {
		selector--;
		clearInterval(tm_fl);
		fl = true;
		tm_fl = setInterval(flash, 400);
	}
});

function flash() {
	fl = !fl;
}

