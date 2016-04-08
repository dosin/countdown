var CANVASWIDTH,
	CANVASHEIGHT,
	RADIUS,
	MARGINTOP,
	MARGINLEFT;

var endTime = new Date(new Date().getTime() + 1 * 60 * 60 * 1000);
var curTime;

var balls = [];
var colors = ['#33b5e5','#0099cc','#aa66cc','#9933cc','99cc00','#669900','#ffbb33','#ff8800','#ff4444','cc0000'];

window.onload = function () {

	CANVASWIDTH = document.body.clientWidth || document.documentElement.clientWidth;
	CANVASHEIGHT = document.body.clientHeight || document.documentElement.clientHeight;
	MARGINLEFT = Math.round(CANVASWIDTH / 10);
	MARGINTOP = Math.round(CANVASHEIGHT / 5)
	RADIUS = Math.round(CANVASWIDTH * 4 / 5 / 108) - 1;

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	canvas.width = CANVASWIDTH;
	canvas.height = CANVASHEIGHT;

	curTime = getTime();

	function getTime() {
		var seconds = Math.round((endTime - new Date()) / 1000);
		seconds = seconds > 0 ? seconds : 0;
		return {
			hours : parseInt(seconds / 3600),
			minutes : parseInt((seconds % 3600) / 60),
			seconds : seconds % 60
		}
	}

	setInterval(function () {
		render(context);
		update();
	}, 30)

	function update() {

		var nextTime = getTime();
		
		if (nextTime === curTime) return;

		var nextHours = nextTime.hours;
		var nextMinutes = nextTime.minutes;
		var nextSeconds = nextTime.seconds;

		var curHours = curTime.hours;
		var curMinutes = curTime.minutes;
		var curSeconds = curTime.seconds;

		if (parseInt(nextHours / 10) !== parseInt(curHours / 10)) addBalls(MARGINLEFT, MARGINTOP, parseInt(curHours / 10));
		if (parseInt(nextHours % 10) !== parseInt(curHours % 10)) addBalls(MARGINLEFT + 15 * (RADIUS + 1), MARGINTOP, parseInt(curHours % 10));
		if (parseInt(nextMinutes / 10) !== parseInt(curMinutes / 10)) addBalls(MARGINLEFT + 39 * (RADIUS + 1), MARGINTOP, parseInt(curMinutes / 10));
		if (parseInt(nextMinutes % 10) !== parseInt(curMinutes % 10)) addBalls(MARGINLEFT + 54 * (RADIUS + 1), MARGINTOP, parseInt(curMinutes % 10));
		if (parseInt(nextSeconds / 10) !== parseInt(curSeconds / 10)) addBalls(MARGINLEFT + 78 * (RADIUS + 1), MARGINTOP, parseInt(curSeconds / 10));
		if (parseInt(nextSeconds % 10) !== parseInt(curSeconds % 10)) addBalls(MARGINLEFT + 93 * (RADIUS + 1), MARGINTOP, parseInt(curSeconds % 10));

		function addBalls(x, y, num) {
			for (var i = 0; i < digit[num].length; i++) {
				for (var j = 0; j < digit[num][i].length; j++) {
					if (digit[num][i][j] === 1) {
						var ball = {
							x : x + j * 2 * (RADIUS + 1) + RADIUS + 1,
							y : y + i * 2 * (RADIUS + 1) + RADIUS + 1,
							g : 1.5 + Math.random(),
							vx : Math.pow(-1, Math.ceil(Math.random() * 2)) * 4,
							vy : -5,
							color : colors[Math.floor(Math.random() * colors.length)]
						}
						balls.push(ball);
					}
				}
			}
		}

		updateBalls();

		function updateBalls() {
			for (var i = 0, len = balls.length; i < len; i++) {
				balls[i].x += balls[i].vx;
				balls[i].y += balls[i].vy;
				balls[i].vy += balls[i].g;
				if (balls[i].y >= CANVASHEIGHT - RADIUS) {
					balls[i].y = CANVASHEIGHT - RADIUS;
					balls[i].vy = - Math.abs(balls[i].vy) * 0.6;
				}
			}
			for (var i = 0, j = 0; i < len; i++) {
				if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < CANVASWIDTH) {
					balls[j++] = balls[i];
				}
			}
			balls.length = Math.min(len, j);
		}
		
		curTime = nextTime;

	}

}

function render(ctx) {

	ctx.canvas.width = ctx.canvas.width;

	var hours = curTime.hours;
	var minutes = curTime.minutes;
	var seconds = curTime.seconds;

	renderDigit(MARGINLEFT, MARGINTOP, parseInt(hours / 10), ctx);
	renderDigit(MARGINLEFT + 15 * (RADIUS + 1), MARGINTOP, parseInt(hours % 10), ctx);
	renderDigit(MARGINLEFT + 30 * (RADIUS + 1), MARGINTOP, 10, ctx);
	renderDigit(MARGINLEFT + 39 * (RADIUS + 1), MARGINTOP, parseInt(minutes / 10), ctx);
	renderDigit(MARGINLEFT + 54 * (RADIUS + 1), MARGINTOP, parseInt(minutes % 10), ctx);
	renderDigit(MARGINLEFT + 69 * (RADIUS + 1), MARGINTOP, 10, ctx);
	renderDigit(MARGINLEFT + 78 * (RADIUS + 1), MARGINTOP, parseInt(seconds / 10), ctx);
	renderDigit(MARGINLEFT + 93 * (RADIUS + 1), MARGINTOP, parseInt(seconds % 10), ctx);

	function renderDigit(x, y, num, ctx) {
		ctx.fillStyle = 'rgb(0,102,153)';
		for (var i = 0; i < digit[num].length; i++) {
			for (var j = 0; j < digit[num][i].length; j++) {
				if (digit[num][i][j] === 1) {
					ctx.beginPath();
					ctx.arc(x + j * 2 * (RADIUS + 1) + RADIUS + 1, y + i * 2 * (RADIUS + 1) + RADIUS + 1, RADIUS, 0, 2 * Math.PI);
					ctx.closePath();
					ctx.fill();
				}
			}
		}
	}

	for (var i = 0; i < balls.length; i++) {
		ctx.fillStyle = balls[i].color;
		ctx.beginPath();
		ctx.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI)
		ctx.closePath();
		ctx.fill();
	}

}
