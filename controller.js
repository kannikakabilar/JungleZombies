stage=null;
view = null;
interval=null;
pause = false;
socket = new WebSocket("ws://192.168.2.15:10083");
userid = '';
playerColour = "#B81D25";
touchPressed = false;
function setupGame(){
	stage=new Stage(document.getElementById('stage'));
	userid = document.getElementById("user").value;
	stage.addPlayer(new Player(stage, Math.floor(stage.width/2), Math.floor(stage.height/2),400,100,"Pistol","#B81D25",userid));
	console.log("I am ",userid);
	socket.send(JSON.stringify({'who':"player",'action':'connected',"colour":playerColour,"id": userid} ));
	// https://javascript.info/keyboard-events
	document.addEventListener('keydown', moveByKey);
	document.addEventListener('keyup', stopMoving);
	document.addEventListener('click',clickToFire);
	document.addEventListener('mousemove',aim);

	//mobile event
	document.addEventListener('touchstart', touchToFire);
	document.addEventListener("touchend", releaseToFire);
	if (window.DeviceOrientationEvent) {
		//window.addEventListener("deviceorientation",tilt);
		window.addEventListener("deviceorientation", (event)=>{
			console.log(event);
			socket.send(JSON.stringify({'who':'tiltingaa','event':event}));
			tilt(event);
		 	//socket.send(JSON.stringify({'who':'tilttest','a':event.alpha, 'b':event.beta, 'c': event.gamma}));
		});
	// document.addEventListener("touchcancel", handleCancel, false);
	// document.addEventListener("touchmove", handleMove, false);
	} else{
		socket.send(JSON.stringify({'who':"notworking1"} ));
	}
	if (window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', shake);
	}else{
		socket.send(JSON.stringify({'who':"notworking2"} ));
	}
}
function startGame(){
	//interval=setInterval(function(){ stage.step(); stage.draw(); },20);
	// interval=setInterval(function(){ 
	// 	if(stage.player == null){
	// 		pauseGame();
	// 		stage.displayGameOver();
	// 		console.log($("#gameScore").text());
	// 		$("#gameScore").text(stage.getScore());
	// 		console.log($("#gameScore").text());
	// 		updateScore();
	// 	}else{
	// 		stage.step();
	// 		stage.draw();
	// 	}},20);

}

function endGame(){
	clearInterval(interval);
	interval=null;
}

function pauseGame(){
	clearInterval(interval);
	interval=null;
}
function moveByKey(event){
	var key = event.key;
	var moveMap = { 
		'a': { "dx": -1, "dy": 0},
		's': { "dx": 0, "dy": 1},
		'd': { "dx": 1, "dy": 0},
		'w': { "dx": 0, "dy": -1},
		'p': "pause"
	};
	if(key == 'p' && stage.player != null){
		if(pause == false){
			pauseGame();
			pause = true;
			stage.displayPause(pause);
		}else{
			startGame();
			pause = false;
			stage.displayPause(pause);
		}
	}else{
		if(key in moveMap && stage.player != null){
			//stage.player.move(stage.player, moveMap[key].dx, moveMap[key].dy);
			console.log("move button pressed",userid)
			socket.send(JSON.stringify({'who':'player','action':'move','dx': moveMap[key].dx, 'dy': moveMap[key].dy,"id": userid} ));
		}
	}
}

function touchToFire(event){
	touchPressed = true
}
function releaseToFire(event){
	if(touchPressed){
		var changes = event.changedTouches;
		touchPressed = false;
		var x = changes[0].x;
		var y = changes[0].y;
		var rect = stage.canvas.getBoundingClientRect();

		if(stage.player != null){
			socket.send(JSON.stringify({'who':"player",'action':'aim','aimX': x-rect.left, 'aimY': y-rect.top ,"id": userid} ));
			socket.send(JSON.stringify({'who':"player",'action':'shoot','aimX': x-rect.left, 'aimY': y-rect.top ,"id": userid} ));
		}
	}
}

function stopMoving(event){
	var key = event.key;
	var moveMap = { 
		'a': { "dx": 0, "dy": 0},
		's': { "dx": 0, "dy": 0},
		'd': { "dx": 0, "dy": 0},
		'w': { "dx": 0, "dy": 0}
	};
	if(key in moveMap && stage.player != null){
		console.log("move button pressed")
		socket.send(JSON.stringify({'who':"player",'action':'move','dx': moveMap[key].dx, 'dy': moveMap[key].dy,"id": userid} ));
		//stage.player.move(stage.player, moveMap[key].dx, moveMap[key].dy);
	}
}

function clickToFire(event){
	var x = event.clientX;
	var y = event.clientY;
	var rect = stage.canvas.getBoundingClientRect();
	if(stage.player != null){
		var coords = "X: " + x + ", Y: " + y + "Player X: "+ stage.player.x + " , Player Y: "+stage.player.y;
		//stage.player.aim(x-rect.left,y-rect.top);
		//stage.player.shoot(stage.player,x-rect.left,y-rect.top);
		socket.send(JSON.stringify({'who':"player",'action':'shoot','aimX': x-rect.left, 'aimY': y-rect.top ,"id": userid} ));
	}
}

function aim(event){
	var x = event.clientX;
	var y = event.clientY;
	var rect = stage.canvas.getBoundingClientRect();
	if(stage.player != null){
		console.log("aiming");
		//stage.player.aim(x-rect.left,y-rect.top);
		socket.send(JSON.stringify({'who':"player",'action':'aim','aimX': x-rect.left, 'aimY': y-rect.top ,"id": userid} ));
		//stage.player.draw(x-rect.left,y-rect.top);
	}
	//console.log("Mouse CurrentX :- "+event.clientX+"Mouse Current Y: "+event.clientY);
}

function shake(event){
    var x = event.accelerationIncludingGravity.x;
    var y = event.accelerationIncludingGravity.y;
	var z = event.accelerationIncludingGravity.z;
	console.log("shake1");
	socket.send(JSON.stringify({'who':'tiltingaa'}));
	if(Math.abs(x) >= 2 && Math.abs(y) >= 2 && Math.abs(z) >= 2){
		socket.send(JSON.stringify({'who':'shake'}));
		playerColour = "rgba("+Math.floor(Math.random() * 256)+","+Math.floor(Math.random() * 256)+","+Math.floor(Math.random() * 256)+",1)";
		socket.send(JSON.stringify({'who':'player','action':'changeColor'}));
		}
}

function tilt(event){
	
	var x = event.beta;  // In degree in the range [-180,180]
	var y = event.gamma; // In degree in the range [-90,90]
	socket.send(JSON.stringify({'who':'pre-tilt','x':x,'y':y,'event':event}));
	// var dx = 0;
	// var dy = 0; 
	
	// // don't let the phone go upside down
	// if (x >  90) { x =  90};
	// if (x < -90) { x = -90};

	// //move from right to left
	// if(x > 1){
	// 	dx = 1
	// }else if (x < -1){
	// 	dx = -1
	// }else{
	// 	dx = 0
	// }

	// // tilt up and down
	// if(y > 1){
	// 	dy = 1
	// }else if (y < -1){
	// 	dy = -1
	// }else{
	// 	dy = 0
	// }

	// if(stage.player != null){
	// 	//stage.player.move(stage.player, moveMap[key].dx, moveMap[key].dy);
	// 	console.log("tilted to move",userid)
	// 	socket.send(JSON.stringify({'who':'tilt'}));
	// 	socket.send(JSON.stringify({'who':'player','action':'move','dx': dx, 'dy': dy,"id": userid} ));
	// }
}

function grantPermissions() {
	// accelerometer
	DeviceMotionEvent.requestPermission().then(response => {
		  if (response == 'granted') {
			window.addEventListener('devicemotion', (event) => {
					   agx = round(event.accelerationIncludingGravity.x);
					   agy = round(event.accelerationIncludingGravity.y);
					   agz = round(event.accelerationIncludingGravity.z);

					   ax = round(event.acceleration.x);
					   ay = round(event.acceleration.y);
					   az = round(event.acceleration.z);
					   document.getElementById("motion").innerHTML = 
						   "ag=(" + agx + "," + agy + "," + agz+")"+
						   "a=(" + ax + "," + ay + "," + az+")";
				   });
		}
}).catch(console.error);
}


socket.onmessage = function (event) {
	parsedMessage=JSON.parse(event.data);
	//console.log(event);
	if((stage != null)){
		console.log("not stage null");
	}
	//console.log("message type: ",parsedMessage.type);
	if((parsedMessage.type == 'gameState')&& (stage != null)){
		// console.log("stage",stage);
		console.log("msg: ",parsedMessage.state)
		// console.log("aaa:",stage.actors.length)

		stage.actors = stage.createNewActors(parsedMessage.state,playerColour);
		stage.numEnemies = parsedMessage.numEnemies;
		stage.score = parsedMessage.score;

		// console.log(stage.actors)
		// console.log(stage.numEnemies)
		// console.log(stage.score)
		stage.draw();
	}
	// console.log(parsedMessage.userid,userid);
	// if(parsedMessage.who == "player" && parsedMessage.action == "move"){
	// 	console.log("I am player who moved steps!",parsedMessage.dx,parsedMessage.dy);
	// 	stage.player.move(stage.player, parsedMessage.dx , parsedMessage.dy)
	// }else if(parsedMessage.who == "player" && parsedMessage.action == "aim"){
	// 	console.log("LOOK AT ME GUN Move!")
	// 	stage.player.aim(parsedMessage.aimX,parsedMessage.aimY)
	// }else if(parsedMessage.who == "player" && parsedMessage.action == "shoot"){
	// 	stage.player.aim(parsedMessage.aimX,parsedMessage.aimY);
	// 	stage.player.shoot(stage.player,parsedMessage.aimX,parsedMessage.aimY,);
	// }else if(parsedMessage.who == "game"){
	// 	parsedMessage.state();
	// 	console.log(parsedMessage.state());
	// 	//updateWorld(parsedMessage);
	// }
}