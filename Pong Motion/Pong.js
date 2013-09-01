
/*
* Pong
* September 2013. Copyright Javier Quevedo-Fernández.
* Twitter: senc01a
* Github: http://github.com/senc01a
*
* License Information
*
* 
*/

var stage;
var leftFinger;  // 3D vector containing the position of the left most finger
var rightFinger; // 3D vector containing the position of the right most finger
var playerHeight = 130;
var playerWidth = 20;
var playerMargin = 20;
var ballSpeed = 15/50;
var ballRadius = 20;
var gameBorder = 5;

var ball;
var leftPlayer;
var rightPlayer;
var leftPlayerScore = 0;
var rightPlayerScore = 0;


/**
* Constructs the Player object
* @class Player
* @memberof Jqf
* @classdesc
* Defines a player (paddle) of the pong game
**/
function Player(xPos, yPos, minY, maxY, color){
	this.node = new createjs.Bitmap("assets/paddle.png");
	this.node.x = xPos;
	this.node.y = yPos;
	this.node.regX = playerWidth/2;
	this.node.regY = playerHeight/2;
	this.maxY = maxY;
	this.minY = minY;
}


/**
* Constructs the Player object
* @class Ball
* @memberof Jqf
* @classdesc
* Defines the ball of the pong game
**/
function Ball(speed){
	this.direction = []; // Vector that holds the direction of the ball
	this.direction[0] = 0; // Vx = 0
	this.direction[1] = 0; // Vy = 0
	this.speed = speed;
	this.node = new createjs.Bitmap("assets/ball.png");
	this.node.x = 100;
	this.node.y = 50;
	this.node.regX = ballRadius;
	this.node.regY = ballRadius;
	
	// The last wall that was hit
	this.borderHit = "none"; // left | right | top | bottom | none 
}

Ball.prototype.update = function(delta){
	this.node.x += this.direction[0] * (delta) * ballSpeed;
	this.node.y += this.direction[1] * (delta) * ballSpeed;
}

/**
* Constructs the Ball object
* @class Pong
* @memberof Jqf
* @classdesc
* The main class of the Pong Game.
* 
**/
function Pong(_stage){
	
	this.leftPlayerScore = 0;
	this.rightPlayerScore = 0;
	stage = _stage;
	this.leftPlayer = new Player(playerMargin, _stage.canvas.height/2, playerMargin, _stage.height-playerMargin);
	stage.addChild(this.leftPlayer.node);
	
	this.rightPlayer = new Player(_stage.canvas.width-playerMargin, _stage.canvas.height/2, playerMargin, _stage.height-playerMargin);
	stage.addChild(this.rightPlayer.node);
	
	this.ball = new Ball(ballSpeed);
	stage.addChild(this.ball.node);
	this.ball.direction[0] = 1;
	this.ball.direction[1] = 1;
	
	ball = this.ball;
	leftPlayer = this.leftPlayer;
	rightPlayer = this.rightPlayer;

	stage.update();
}

Pong.prototype.update = function(delta){
	
	// Score update
	if (ball.node.x >= stage.canvas.width + ballRadius){
		console.log('Left player score');
		ball.node.x = 500;
		ball.node.y = 100;
		
		var scoreEvent = new CustomEvent('score');
		scoreEvent.leftPlayerScore = ++leftPlayerScore;
		scoreEvent.rightPlayerScore = rightPlayerScore;
			dispatchEvent(scoreEvent);

	}else if (ball.node.x <= 0 - ballRadius){
		console.log('Right player score');
		ball.node.x = 100;
		ball.node.y = 100;
		var scoreEvent = new CustomEvent('score');
		scoreEvent.leftPlayerScore = leftPlayerScore;
		scoreEvent.rightPlayerScore = ++rightPlayerScore;
		dispatchEvent(scoreEvent);
	}

	// Paddle Collision
	if (ndgmr.checkPixelCollision(ball.node,rightPlayer.node,0,false) && ball.borderHit != "rightPlayer"){
		ball.direction[0] = ball.direction[0] * -1;		
		ball.borderHit = "rightPlayer";
		
	}else if (ndgmr.checkPixelCollision(ball.node,leftPlayer.node,0,false) && ball.borderHit != "leftPlayer"){
		ball.direction[0] = ball.direction[0] * -1;		
		ball.borderHit = "leftPlayer";
	}
	// Top and bottom wall collision
	if (ball.node.y - ballRadius<= 0 && ball.borderHit != "top"){
		ball.direction[1] = ball.direction[1] * -1;		
		ball.borderHit = "top";
	}else if (ball.node.y + ballRadius >= stage.canvas.height && ball.borderHit != "bottom"){
		ball.direction[1] = ball.direction[1] * -1;		
		ball.borderHit = "bottom";
	}
	this.ball.update(delta);
	stage.update();
}

// Receives the normalized Y Value of the Left hand
// Sets the Left Player, that is, the left paddle on the corresponding position
Pong.prototype.setLeftPlayerYPos = function(normalizedY){
	this.leftPlayer.node.y = (1- normalizedY) * stage.canvas.height;
}

// Receives the normalized Y Value of the Right hand
// Sets the Right Player, that is, the right paddle on the corresponding position

Pong.prototype.setRightPlayerYPos = function(normalizedY){
	this.rightPlayer.node.y = (1- normalizedY) * stage.canvas.height;
}
