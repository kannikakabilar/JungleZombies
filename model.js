function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

class Stage {
    constructor(canvas){
        this.canvas = canvas;
		document.getElementById("stage").style.cursor = "crosshair";
        this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
        this.player=null; // a special actor, the player
        this.numEnemies = 10;
		this.score = 0;

        // the logical width and height of the stage
        this.width=1600;
        this.height=1600;
		
		//Outside walls
        this.addActor(new WallObjects(this,0,0,this.width,30,99999999999)); //top
        this.addActor(new WallObjects(this,0,this.height-30,this.width,30,99999999999)); //bottom
        this.addActor(new WallObjects(this,0,0,30,this.height-30,99999999999));
		this.addActor(new WallObjects(this,this.width-30,0,30,this.height,99999999999));

		//Ammo shed guns
		//Risk to get the ammo
		this.addActor(new Trap(this,800,970,100,30,1,"Pink"));
		this.addActor(new Trap(this,600,1200,500,30,1,"Pink"));

		this.addActor(new WallObjects(this,600,1200,500,30,1000));
		this.addActor(new WallObjects(this,600,1000,30,200,1000));
		this.addActor(new WallObjects(this,1070,1000,30,200,1000));
		this.addActor(new WallObjects(this,600,970,200,30,1000));
		this.addActor(new WallObjects(this,900,970,200,30,1000));


		//Add the three guns and some ammo
		this.addActor(new PickUpGunType(this,1010,1160,60,40,"Pistol","Salmon"));
		this.addActor(new PickUpGunType(this,825,1160,60,40,"Shotgun","Navy"));
		this.addActor(new PickUpGunType(this,630,1160,60,40,"Sniper","Purple"));
		var ammoInBox = 25;
		this.addActor(new AmmoPickup(this,ammoInBox,1050,1000));    
		this.addActor(new AmmoPickup(this,ammoInBox,1050,1050));
		this.addActor(new AmmoPickup(this,ammoInBox,1050,1100));
		this.addActor(new AmmoPickup(this,ammoInBox,630,1000));
		this.addActor(new AmmoPickup(this,ammoInBox,630,1050));
		this.addActor(new AmmoPickup(this,ammoInBox,630,1100));
		//Add various velocity changing tiles
        var sand = new DifferentTerrian(this,400,400,100,100,0.5,"Tan");
        this.addActor(sand);
        var ice = new DifferentTerrian(this,400,1000,100,100,1.25,"SkyBlue");
		this.addActor(ice);
		var sand = new DifferentTerrian(this,1200,400,100,100,0.5,"Tan");
        this.addActor(sand);
        var ice = new DifferentTerrian(this,1200,1000,100,100,1.25,"SkyBlue");
		this.addActor(ice);
		
		//add enemies
        // for (var i = 0; i < this.numEnemies; i++){
		// 	var enemyType = randint(8);
		// 	var enemyStartingX = randint(1500)+31;
		// 	if(enemyStartingX >= 750 && enemyStartingX <= 850){
		// 		enemyStartingX += 200;
		// 	}
		// 	//random generate an enemy with a 
		// 	if(enemyType < 5){				
		// 		this.addActor(new EnemyAI(this,enemyStartingX,randint(1500)+31,4,100));
		// 	}else if(enemyType < 6){
		// 		this.addActor(new FastEnemyAI(this,enemyStartingX,randint(1500)+31, 100));
		// 	}else{
		// 		this.addActor(new ExplosiveEnemyAI(this,enemyStartingX,randint(1500)+31,125));
		// 	}
		// }
		//add health
		var total = 10;
		while(total > 0){
             this.addActor(new HealthPickup(this,ammoInBox,randint(1500),randint(1500)));
             total--;
		}
		//add some obsticles
		this.addActor(new TreeObjects(this,300,300,50));
		this.addActor(new TreeObjects(this,300,1300,40));
		this.addActor(new TreeObjects(this,500,1100,40));
		this.addActor(new TreeObjects(this,1000,400,40));
		this.addActor(new TreeObjects(this,1400,1400,40));
		this.addActor(new TreeObjects(this,700,700,40));

		//add the player with starting item as the pistol
		// Add the player to the center of the stage
		// this.addPlayer(new Player(this, Math.floor(this.width/2), Math.floor(this.height/2),400,100,"Pistol","#B81D25"));
    }

    addPlayer(player){
        this.addActor(player);
        this.player=player;
    }

    removePlayer(){
        this.removeActor(this.player);
        this.player=null;
    }

    addActor(actor){
        this.actors.push(actor);
    }

    removeActor(actor){
        var index=this.actors.indexOf(actor);
        if(index!=-1){
            this.actors.splice(index,1);
        }
    }

    // Take one step in the animation of the game.  Do this by asking each of the actors to take a single step. 
    // NOTE: Careful if an actor died, this may break!
    step(){
        //remove all dead actors
        for(var i=0;i<this.actors.length;i++){
            if(this.actors[i].isDead()){
				if(this.actors[i] instanceof Player){
					this.removePlayer();
				}else{
					this.removeActor(this.actors[i]);
				}
            }
        }
        for(var i=0;i<this.actors.length;i++){
            this.actors[i].step();
		}
		//always have 10 enemies on screen
		while(this.numEnemies <= 10){
			var enemyType = randint(8);
			var enemyStartingX = randint(1500)+31;
			if(enemyStartingX >= 750 && enemyStartingX <= 850){
				enemyStartingX += 200;
			}
			if(enemyType < 5){
				this.addActor(new EnemyAI(this,enemyStartingX,randint(1500)+31,4,100));
			}else if(enemyType < 6){
				this.addActor(new FastEnemyAI(this,enemyStartingX,randint(1500)+31, 100));
			}else{
				this.addActor(new ExplosiveEnemyAI(this,enemyStartingX,randint(1500)+31,125));
			}
			this.numEnemies++;
		}
    }

    draw(){
        var context = this.canvas.getContext('2d');
		context.save();
		context.fillStyle = "#7DC23A";
		context.fillRect(0, 0, this.width, this.height);
        //dcontext.clearRect(0, 0, this.width, this.height);
        if(this.player != null){
			context.translate(-this.player.x+this.canvas.width/2,-this.player.y+this.canvas.height/2);
		}
        
        for(var i=0;i<this.actors.length;i++){
            this.actors[i].draw(context);
        }
        context.resetTransform();

		//Scoreboard
		if(this.player != null){
			context.font = "15px Arial";
			context.fillStyle = "White";
			context.textAlign = "left";
			context.fillText("Bullets left: "+this.player.ammo,this.canvas.width-125,25);
			context.fillText("Health: "+this.player.health,this.canvas.width-125,50);
			context.fillText("Score:"+this.score,this.canvas.width-125,75);
		}

	}
	displayPause(pause){
		var context = this.canvas.getContext('2d');
		if(pause){
			context.save();
			context.fillStyle = "rgba(67,67,67,0.5)";
			context.fillRect(0, 0, this.width, this.height);
			context.font = "30px Arial";
			context.fillStyle = "White";
			context.textAlign = "centre";
			context.fillText("PAUSED",(this.canvas.width/2)-60,this.canvas.height/2);
			context.fillText("Press 'p' to continue",(this.canvas.width/2)-120,(this.canvas.height/2) +30);
		}else{
			context.restore();
		}
	}

	displayGameOver(){
		console.log("DEAD");
		var context = this.canvas.getContext('2d');
		context.save();
		context.fillStyle = "rgba(67,67,67,0.5)";
		context.fillRect(0, 0, this.width, this.height);
		context.font = "30px Arial";
		context.fillStyle = "White";
		context.textAlign = "centre";
		context.fillText("GAME OVER",(this.canvas.width/2)-60,this.canvas.height/2);
		context.fillText("Final Score: "+this.score,(this.canvas.width/2)-100,(this.canvas.height/2)+30);
		//context.restore();
	}

    // return the first actor at coordinates (x,y) return null if there is no such actor
    getActor(x, y){
        for(var i=0;i<this.actors.length;i++){
            if(this.actors[i].x==x && this.actors[i].y==y){
                return this.actors[i];
            }
        }
        return null;
	}
	
	getScore(){
		return this.score;
	}

	createNewActors(state,playerColour){
		// console.log("funny msg: ",state);
		var newActor = [];
		console.log(state);
		for(var i = 0; i < state.length; i++){
			if(state[i].type == 'player'){
				console.log("special color:",playerColour,state[i].colour,state[i])
				var newPlayerState = new Player(this,state[i].x,state[i].y,state[i].ammo,state[i].health,state[i].gunType,playerColour,state[i].id);
				newPlayerState.angle = state[i].angle;
				newActor.push(newPlayerState);
				if(state[i].id == this.player.id){
					console.log("updating!")
					this.player.x = state[i].x;
					this.player.y = state[i].y;
					this.player.ammo = state[i].ammo;
					this.player.health = state[i].health;
					this.player.gunType = state[i].gunType;
					this.player.angle = state[i].angle;
					this.player.colour = state[i].colour;
				}
			}else if(state[i].type == "bullet"){
				newActor.push(new Bullet(this,new Pair(state[i].positionX,state[i].positionY,),new Pair(state[i].velocityX,
					state[i].velocityY),state[i].colour,state[i].radius,state[i].lifespan,state[i].damage))
			}else if(state[i].type == "wallobject"){
				newActor.push(new WallObjects(this,state[i].x,state[i].y,state[i].width,state[i].height,state[i].health));
			}else if(state[i].type == "ammopickup"){
				newActor.push(new AmmoPickup(this,state[i].amount,state[i].x,state[i].y));
			}else if(state[i].type == "healthpickup"){
				newActor.push(new HealthPickup(this,state[i].amount,state[i].x,state[i].y));
			}else if(state[i].type == "treeobject"){
				newActor.push(new TreeObjects(this, state[i].x,state[i].y,state[i].radius));
			}else if(state[i].type == "differentterrian"){
				newActor.push(new DifferentTerrian(this, state[i].x,state[i].y,state[i].width,state[i].height,
					state[i].velocityMultiplier,state[i].colour));
			}else if(state[i].type == "trap"){
				newActor.push(new Trap(this, state[i].x,state[i].y,state[i].width,state[i].height,state[i].damage,state[i].colour));
			}else if(state[i].type == "pickupguntype"){
				newActor.push(new PickUpGunType(this,state[i].x,state[i].y,state[i].width,state[i].height,state[i].gunType,state.color));
			}else if(state[i].type == "enemyai"){
				newActor.push(new EnemyAI(this,state[i].x,state[i].y,state[i].ammo,state[i].health));
			}else if(state[i].type == "fastenemyai"){
				newActor.push(new FastEnemyAI(this,state[i].x,state[i].y,state[i].health));
			}else if(state[i].type == "explosion"){
				newActor.push(new Explosion(this,state[i].x,state[i].y,state[i].maxRadius));
			}else if(state[i].type == "explosiveenemyai"){
				newActor.push(new ExplosiveEnemyAI(this,state[i].x,state[i].y,state[i].health));
			}
		}
		return newActor;
	}

} // End Class Stage

class Pair {
	constructor(x,y){
		this.x=x; this.y=y;
	}

	toString(){
		return "("+this.x+","+this.y+")";
	}

	normalize(){
		var magnitude=Math.sqrt(this.x*this.x+this.y*this.y);
		this.x=this.x/magnitude;
		this.y=this.y/magnitude;
	}
}

class Bullet {
	constructor(stage, position, velocity, colour, radius,lifespan,damage){
		this.stage = stage;
		this.position=position;
		this.intPosition(); // this.x, this.y are int version of this.position

		this.velocity=velocity;
		this.colour = colour;
		this.radius = radius;
		this.lifespan = lifespan;
		this.damage = damage;
	}
	
	headTo(position){
		this.velocity.x=(position.x-this.position.x);
		this.velocity.y=(position.y-this.position.y);
		this.velocity.normalize();
	}

	toString(){
		return this.position.toString() + " " + this.velocity.toString();
	}

	step(){
		if(this.lifespan > 0){
			this.position.x=this.position.x+this.velocity.x;
			this.position.y=this.position.y+this.velocity.y;
			for(var i=0;i<this.stage.actors.length;i++){
				//already checked this
				if((this.stage.actors[i] instanceof Player) == false){
					if(this.stage.actors[i].checkCollision(this,this.position.x,this.position.y)){
						//die if you collide with a wall
						if(this.stage.actors[i] instanceof WallObjects){
							this.lifespan = 0;
						}else if(this.stage.actors[i] instanceof TreeObjects){
							this.lifespan = 0;
						}
					}
				}
			}
			this.intPosition();
			this.lifespan--;
		}
	}
	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}
	draw(context){
		context.fillStyle = this.colour;
   		// context.fillRect(this.x, this.y, this.radius,this.radius);
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();   
	}
	isDead(){
		return this.lifespan <= 0;
	}
	checkCollision(Other,OtherX,OtherY){
		var distanceFromPlayerX= this.x - OtherX;
		var distanceFromPlayerY= this.y - OtherY;
		var euclidDistance = Math.sqrt((distanceFromPlayerX* distanceFromPlayerX) + (distanceFromPlayerY*distanceFromPlayerY));
		if(euclidDistance <= Other.radius + this.radius){
			return true;
		}
	}
}

class Player {
	constructor(stage, x, y,ammo,health,gunType,colour,id){
		this.stage = stage;
		this.x=x;
		this.y=y; // this.x, this.y are int version of this.position
		this.colour = colour;
		this.radius = 25;
		this.ammo = ammo;
		this.health = health;
		this.gunType = gunType;
		this.reload = 1;
		this.isReloading = false;
		this.velocity = new Pair(0,0);
		this.shootRequested = false;
		this.requestedShootLocation = new Pair(0,0);
		this.angle = 0;
		this.id = id;
	}
	draw(){
		//draw my player in the x,y positions
		var context = this.stage.canvas.getContext('2d');
		 
		//TODO UNDO AFTER
		//context.clearRect(0, 0, this.stage.canvas.width, this.stage.canvas.height);
		//Reference for gradient: https://code.tutsplus.com/tutorials/canvas-from-scratch-transformations-and-gradients--net-19637
		if(this.health >=0){
			var gradient = context.createRadialGradient(this.x, this.y, this.health*5, this.x, this.y, 0);
			gradient.addColorStop(0, "rgb(0, 0, 0)");
			gradient.addColorStop(1, "transparent");
			
			context.save();
			context.fillStyle = gradient;
			context.fillRect(0, 0, this.stage.width, this.stage.height);
			context.restore();
		}

		context.save();
		context.translate(this.x,this.y);
		context.rotate(-this.angle);
		context.translate(-this.x,-this.y);
		
		context.fillStyle = this.colour;
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fillRect(this.x, this.y+this.radius, 5,20);  
		context.fill();
		context.restore();
	}
	step(){
		//make a move functions
			for(var i=0;i<this.stage.actors.length;i++){
			if((this.stage.actors[i] instanceof Player) == false){
				if(this.stage.actors[i].checkCollision(this,this.x,this.y)){
					if(this.stage.actors[i] instanceof WallObjects){
						this.velocity.x = -this.velocity.x;
						this.velocity.y = -this.velocity.y;
					}else if(this.stage.actors[i] instanceof Bullet){
						//take damage
						if (this.health - this.stage.actors[i].damage > 0) {
							this.health -= this.stage.actors[i].damage;
						}else{
							this.health = 0;
						}
						//update and kill the object by setting life span to 0
						this.stage.actors[i].lifespan = 0;
					}else if(this.stage.actors[i] instanceof AmmoPickup){
						//player update
						this.ammo += this.stage.actors[i].amount;
						this.reload = 1;
						//object update
						this.stage.actors[i].state = "dead";
					}else if (this.stage.actors[i] instanceof HealthPickup){
						if(this.health != 100){
							if(this.health <= 75 && this.health > 0){
								this.health += this.stage.actors[i].amount;
							}else if(this.health > 75 && this.health < 100){
								this.health += (100 - this.health);
							}
							this.stage.actors[i].state = "dead";
						}
					} else if (this.stage.actors[i] instanceof TreeObjects){
						//collidion detected, back up
						// console.log("collided with tree");
						this.stage.player.velocity.x = -this.stage.player.velocity.x;
						this.stage.player.velocity.y = -this.stage.player.velocity.y;
					} else if(this.stage.actors[i] instanceof DifferentTerrian){
						this.velocity.x *= this.stage.actors[i].velocityMultiplier;
						this.velocity.y *= this.stage.actors[i].velocityMultiplier;
					} else if (this.stage.actors[i] instanceof Trap){
						if (this.health - this.stage.actors[i].damage > 0) {
							this.health -= this.stage.actors[i].damage;
						}else{
							this.health = 0;
						}
					}else if(this.stage.actors[i] instanceof PickUpGunType){
						this.gunType = this.stage.actors[i].gunType;
						this.stage.actors[i].state = "dead";
					}else if(this.stage.actors[i] instanceof Explosion){
						if(this.health - 10 <= 0){
							this.health = 0;
						}else{
							this.health-=10;
						}
					}
				}
			}
		}
		this.x = this.x + this.velocity.x;
		this.y = this.y + this.velocity.y;
		//Shooting functions
		if(this.shootRequested == true){
			this.shootRequested = false;
			if(this.ammo > 0){
				//this will cause the gun to wait before firing again
				if(this.gunType == "Pistol"){
					if(this.reload%7 == 0){
						if(!this.isReloading){
							//TODO fix bullet firing
							setTimeout(this.reloadAmmo(),3000);
							//setTimeout(function(){ this.reload+=1;console.log("done reloading: "+this.reload); this.isReloading=false;}, 3000);
						}
						//TODO add a wait function that doesn't accept mouse input for 3 seconds
					}else{
						var velocity = new Pair ((this.requestedShootLocation.x-(this.stage.canvas.width/2)),(this.requestedShootLocation.y-(this.stage.canvas.height/2)));
						velocity.normalize();
						var position = new Pair(this.x + 50*(velocity.x),this.y + 50*(velocity.y));
						velocity.x = velocity.x*10;
						velocity.y = velocity.y*10;
						var bullet = new Bullet(this.stage, position, velocity, "black", 10,50,25);
						//bullet.headTo(x,y);
						this.stage.addActor(bullet);
						//reduce the amount of ammo
						this.ammo--;
						this.reload++;
					}
				}else if(this.player.gunType == "Shotgun"){
					if (this.reload%3 == 0){
						if(!this.isReloading){
							setTimeout(this.reloadAmmo(),3000);
							//setTimeout(function(){ this.reload+=1;console.log("done reloading: "+this.reload); this.isReloading=false;}, 3000);
						}
					}else{
						var velocity = new Pair ((this.requestedShootLocation.x-(this.stage.canvas.width/2)),(this.requestedShootLocation.y-(this.stage.canvas.height/2)));
						velocity.normalize();
						var position = new Pair(this.x + 50*(velocity.x),this.y + 50*(velocity.y));
						velocity.x = velocity.x*10;
						velocity.y = velocity.y*10;
						var bullet1 = new Bullet(this.stage, position, velocity, "black",5,20,50);

						var velocity2 = new Pair ((this.requestedShootLocation.x-this.stage.canvas.width/2+this.radius),(this.requestedShootLocation.y-this.stage.canvas.height/2+this.radius));
						velocity2.normalize();
						var position2 = new Pair(this.x + 50*(velocity2.x),this.y + 50*(velocity2.y));
						velocity2.x = (velocity2.x)*10;
						velocity2.y = (velocity2.y)*10;
						var bullet2 = new Bullet(this.stage, position2, velocity2, "black",5,20,50);

						var velocity3 = new Pair ((this.requestedShootLocation.x-this.stage.canvas.width/2-this.radius),(this.requestedShootLocation.y-this.stage.canvas.height/2-this.radius));
						velocity3.normalize();
						var position3 = new Pair(this.x + 50*(velocity3.x),this.y + 50*(velocity3.y));
						velocity3.x = (velocity3.x)*10;
						velocity3.y = (velocity3.y)*10;
						var bullet3 = new Bullet(this.stage, position3, velocity3, "black",5,20,50);

						this.player.stage.addActor(bullet1);
						this.player.stage.addActor(bullet2);
						this.player.stage.addActor(bullet3);

						//reduce the amount of ammo
						this.ammo--;
						this.reload++;
					}
				}else if(this.player.gunType == "Sniper"){
					if(this.reload%2 == 0){
						if(!this.isReloading){
								setTimeout(this.reloadAmmo(),5000);
						}
					}else{
						var velocity = new Pair ((this.requestedShootLocation.x-(this.stage.canvas.width/2)),(this.requestedShootLocation.y-(this.stage.canvas.height/2)));
						velocity.normalize();
						var position = new Pair(this.x + 50*(velocity.x),this.y + 50*(velocity.y));
						velocity.x = velocity.x*10*3;
						velocity.y = velocity.y*10*3;
						var bullet = new Bullet(this.stage, position, velocity, "black",5,100,100);
						this.player.stage.addActor(bullet);
						//reduce the amount of ammo
						this.ammo--;
						this.reload++;
					}
				}
			}
		}
	}
	move(player, dx , dy){
		this.player = player;
		this.velocity.x = 5*(dx);
		this.velocity.y = 5*(dy);
	}
	shoot(player,mouseX,mouseY){
		this.shootRequested = true;
		this.requestedShootLocation = new Pair(mouseX,mouseY);
	}
	isDead(){
		return this.health <= 0;
	}
	aim(mouseX,mouseY){
		this.angle = Math.atan2(mouseX-this.stage.canvas.width/2,mouseY-this.stage.canvas.height/2);
	}
	reloadAmmo(){
		this.reload++;
		console.log("done reloading: "+this.reload); 
		this.isReloading=false;
	}
	checkCollision(OtherObj,OtherX,OtherY){
		var distanceFromPlayerX= this.x - OtherX;
		var distanceFromPlayerY= this.y - OtherY;
		var euclidDistance = Math.sqrt((distanceFromPlayerX* distanceFromPlayerX) + (distanceFromPlayerY*distanceFromPlayerY));
		if(euclidDistance <= OtherObj.radius + this.radius){
			return true;
		}
		return false;
	}
}

class WallObjects{
	constructor(stage, x, y,width,height,health){
		this.stage = stage;
		this.x=x;
		this.y=y; // this.x, this.y are int version of this.position
		this.width = width;
		this.height = height;
		this.health = health;
	}
	draw(context){
		//draw my player in the x,y positions
		context.fillStyle = "#696969";
		context.fillRect(this.x, this.y, this.width,this.height);
	}
	step(){
		//this.checkCollision();
	}
	updateOnCollision(){
		this.health -= 25;
		//console.log("The wall is dying!");
	}
	checkCollision(OtherObj,OtherX,OtherY){
		var distanceFromCentreforOtherX= Math.abs(this.x+(this.width/2) - OtherX);
		var distanceFromCentreforOtherY= Math.abs(this.y+(this.height/2) - OtherY);
		if((distanceFromCentreforOtherX < (OtherObj.radius + this.width/2) )&&
		 (distanceFromCentreforOtherY < OtherObj.radius+ this.height/2)){
			return true;
		}else{
			return false;
		}
	}
	isDead(){
		return this.health <= 0;
	}
}
class AmmoPickup{
	constructor(stage, amount,x,y){
		this.stage = stage;
		this.x=x;
		this.y=y; // this.x, this.y are int version of this.position
		this.colour = "black";
		this.amount = amount;
		this.state = "alive";
		this.height = 20;
		this.width = 20;
	}
	draw(context){
		//draw my player in the x,y positions
		context.fillStyle = this.colour;
		context.fillRect(this.x, this.y, 20,20);
	}
	step(){
		this.checkCollision(this.stage);
	}
	checkCollision(OtherObj,OtherX,OtherY){
		var distanceFromCentreforOtherX= Math.abs(this.x+(this.width/2) - OtherX);
		var distanceFromCentreforOtherY= Math.abs(this.y+(this.height/2) - OtherY);
		if((distanceFromCentreforOtherX < (OtherObj.radius + this.width/2) )&&
		 (distanceFromCentreforOtherY < OtherObj.radius+ this.height/2)){
			 return true;
		 }else{
			 return false;
		 }
	}
	isDead(){
		return this.state == "dead";
	}
}
class HealthPickup{
	constructor(stage, amount,x,y){
		this.stage = stage;
		this.x=x;
		this.y=y; // this.x, this.y are int version of this.position
		this.colour = "green";
		this.amount = amount;
		this.width = 20;
		this.height = 20;
		this.state = "alive";
	}
	draw(context){
		context.fillStyle = this.colour;
		context.fillRect(this.x, this.y, this.width,this.height);
	}
	step(){
	}
	checkCollision(OtherObj,OtherX,OtherY){
		var distanceFromCentreforOtherX= Math.abs(this.x+(this.width/2) - OtherX);
		var distanceFromCentreforOtherY= Math.abs(this.y+(this.height/2) - OtherY);
		if((distanceFromCentreforOtherX < (OtherObj.radius + this.width/2) )&&
		 (distanceFromCentreforOtherY < OtherObj.radius+ this.height/2)){
			 return true;
		 }else{
			 return false;
		 }
	}
	isDead(){
		return this.state == "dead";
	}
}
class TreeObjects{
	constructor(stage, x, y,radius){
		this.stage = stage;
		this.x=x;
		this.y=y; // this.x, this.y are int version of this.position
		this.radius = radius;
	}
	draw(context){
		context.fillStyle = "rgba(56,93,56,1.0)";
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();
	}
	step(){
	}
	checkCollision(OtherObj,OtherX,OtherY){
		var distanceFromPlayerX= this.x - OtherX;
		var distanceFromPlayerY= this.y - OtherY;
		var euclidDistance = Math.sqrt((distanceFromPlayerX* distanceFromPlayerX) + (distanceFromPlayerY*distanceFromPlayerY));
		if(euclidDistance <= OtherObj.radius + this.radius){
			return true;
		}
		return false;
	}
	isDead(){
		return false;
	}

}

class DifferentTerrian{
	constructor(stage, x, y,width,height,velocityMultiplier,colour){
		this.stage = stage;
		this.x=x;
		this.y=y; // this.x, this.y are int version of this.position
		this.width = width;
		this.height = height;
		this.velocityMultiplier = velocityMultiplier;
		this.colour = colour;
	}
	draw(context){
		//draw my player in the x,y positions
		context.fillStyle = this.colour;
		context.fillRect(this.x, this.y, this.width,this.height);
	}
	step(){
	}
	checkCollision(OtherObj,OtherX,OtherY){
		var distanceFromCentreforOtherX= Math.abs(this.x+(this.width/2) - OtherX);
		var distanceFromCentreforOtherY= Math.abs(this.y+(this.height/2) - OtherY);
		if((distanceFromCentreforOtherX < (OtherObj.radius + this.width/2) )&&
		 (distanceFromCentreforOtherY < OtherObj.radius+ this.height/2)){
			return true;
		}
		return false;
	}
	isDead(){
		return false;
	}
}

class Trap{
	constructor(stage, x, y,width,height,damage,colour){
		this.stage = stage;
		this.x=x;
		this.y=y; // this.x, this.y are int version of this.position
		this.width = width;
		this.height = height;
		this.damage = damage;
		this.colour = colour;
	}
	draw(context){
		//draw my player in the x,y positions
		context.fillStyle = this.colour;
		context.fillRect(this.x, this.y, this.width,this.height);
	}
	step(){
	}
	checkCollision(OtherObj,OtherX,OtherY){
		var distanceFromCentreforOtherX= Math.abs(this.x+(this.width/2) - OtherX);
		var distanceFromCentreforOtherY= Math.abs(this.y+(this.height/2) - OtherY);
		if((distanceFromCentreforOtherX < (OtherObj.radius + this.width/2) )&&
		 (distanceFromCentreforOtherY < OtherObj.radius+ this.height/2)){
			 return true;
		}
		return false;

	}
	isDead(){
		return false;
	}

}
class PickUpGunType{
	constructor(stage, x, y,width,height,gunType,color){
		this.stage = stage;
		this.x=x;
		this.y=y; // this.x, this.y are int version of this.position
		this.width = width;
		this.height = height;
		this.gunType = gunType;
		this.color = color;
		this.state = "alive";
	}
	draw(context){
		//draw my player in the x,y positions
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width,this.height);
	}
	step(){
	}
	checkCollision(OtherObj,OtherX,OtherY){
		var distanceFromCentreforOtherX= Math.abs(this.x+(this.width/2) - OtherX);
		var distanceFromCentreforOtherY= Math.abs(this.y+(this.height/2) - OtherY);
		if((distanceFromCentreforOtherX < (OtherObj.radius + this.width/2) )&&
		 (distanceFromCentreforOtherY < OtherObj.radius+ this.height/2)){
			 return true;
		}
		return false;
	}
	isDead(){
		return this.state == "dead";
	}
}
class EnemyAI{
	constructor(stage, x, y,ammo,health){
		this.stage = stage;
		this.x=x;
		this.y=y; // this.x, this.y are int version of this.position
		this.colour = "rgba(29,41,81,0.9)";
		this.radius = 25;
		this.health = health;
		this.velocity = new Pair(0,0);
	}

	draw(context){
		//draw my player in the x,y positions
		context.fillStyle = this.colour;
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();  
	}
	step(){
		if(this.stage.player != null){
			var playerX = this.stage.player.x;
			var playerY = this.stage.player.y;
		}else{
			var playerX = this.stage.width/2;
			var playerY = this.stage.height/2;
		}

		if(Math.sqrt((playerX - this.x)**2 + (playerY - this.y)**2) > 50){
			this.velocity = new Pair ((playerX-this.x),(playerY-this.y));
			this.velocity.normalize();
			var OldX = this.x;
			var OldY = this.y; 
			this.x=this.x+2*this.velocity.x;
			this.y=this.y+2*this.velocity.y;
		}
		for(var i=0;i<this.stage.actors.length;i++){
			if((this.stage.actors[i] instanceof EnemyAI) == false){
				if(this.stage.actors[i].checkCollision(this,this.x,this.y)){
					if(this.stage.actors[i] instanceof WallObjects){
						this.x = OldX;
						this.y = OldY;
						//SEND THE ENEMY BACK
					}else if(this.stage.actors[i] instanceof Bullet){
						this.health -= this.stage.actors[i].damage;
						this.stage.actors[i].lifespan = 0;
					}else if(this.stage.actors[i] instanceof Trap){
						this.health  -= this.stage.actors[i].damage;
					}else if(this.stage.actors[i] instanceof TreeObjects){
						//sendback
						this.x = OldX;
						this.y = OldY;
					}else if(this.stage.actors[i] instanceof DifferentTerrian){
						this.velocity.x *= this.stage.actors[i].velocityMultiplier;
						this.velocity.y *= this.stage.actors[i].velocityMultiplier;
					}else if(this.stage.actors[i] instanceof Explosion){
						this.health-=10;
					}
				}
			}
		}
		var probOfShooting = randint(500);
		if(probOfShooting == 2){
			this.shoot(this.stage,this.x,this.y,this.ammo);
		}
	}
	shoot(stage,enemyX,enemyY){
		this.stage = stage;
		if(this.stage.player != null){
			var playerX = this.stage.player.x;
			var playerY = this.stage.player.y;
		}else{
			var playerX = this.stage.width/2;
			var playerY = this.stage.height/2;
		}

		var velocity = new Pair ((playerX-this.x),(playerY-this.y));
		velocity.normalize();

		var position = new Pair(enemyX+ this.radius*(velocity.x) + 10,enemyY + this.radius*(velocity.y) +10);
		velocity.x = velocity.x*10;
		velocity.y = velocity.y*10;
		var EnemyBullet = new Bullet(this.stage, position, velocity, "black", 10,50,25);
		this.stage.addActor(EnemyBullet);
	}
	checkCollision(OtherObj,OtherX,OtherY){
		var distanceFromPlayerX= this.x - OtherX;
		var distanceFromPlayerY= this.y - OtherY;
		var euclidDistance = Math.sqrt((distanceFromPlayerX* distanceFromPlayerX) + (distanceFromPlayerY*distanceFromPlayerY));
		if(euclidDistance <= OtherObj.radius + this.radius){
			return true;
		}
		return false;
	}
	isDead(){
		if(this.health <= 0){
			this.stage.score +=150;
			this.stage.numEnemies--;
		}
		return this.health <= 0;
	}
}
class FastEnemyAI{
	constructor(stage, x, y,health){
		this.stage = stage;
		this.x=x;
		this.y=y; // this.x, this.y are int version of this.position
		this.colour = "YELLOW";
		this.radius = 15;
		this.health = health;
		this.velocity = new Pair(0,0);
	}

	draw(context){
		context.fillStyle = this.colour;
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();  
	}
	step(){
		if(this.stage.player != null){
			var playerX = this.stage.player.x;
			var playerY = this.stage.player.y;
		}else{
			var playerX = this.stage.width/2;
			var playerY = this.stage.height/2;
		}

		this.velocity = new Pair ((playerX-this.x),(playerY-this.y));
		this.velocity.normalize();
		var OldX = this.x;
		var OldY = this.y;
		this.x=this.x+this.velocity.x*5;
		this.y=this.y+this.velocity.y*5;

		for(var i=0;i<this.stage.actors.length;i++){
			if((this.stage.actors[i] instanceof EnemyAI) == false){
				if(this.stage.actors[i].checkCollision(this,this.x,this.y)){
					if(this.stage.actors[i] instanceof WallObjects){
						//SEND THE ENEMY BACK
						//TODO
						this.x = OldX;
						this.y = OldY;
						this.stage.actors[i].health -=25;
					}else if(this.stage.actors[i] instanceof Bullet){
						this.health  -= this.stage.actors[i].damage;
						this.stage.actors[i].lifespan = 0;
					}else if(this.stage.actors[i] instanceof Trap){
						this.health  -= this.stage.actors[i].damage;
					}else if(this.stage.actors[i] instanceof TreeObjects){
						//sendback TODO
						this.x = OldX;
						this.y = OldY;
					}else if(this.stage.actors[i] instanceof Player){
						this.stage.actors[i].health--;
						this.health-=2;
					}else if(this.stage.actors[i] instanceof DifferentTerrian){
						this.velocity.x *= this.stage.actors[i].velocityMultiplier;
						this.velocity.y *= this.stage.actors[i].velocityMultiplier;
					}else if(this.stage.actors[i] instanceof Explosion){
						this.health-=10;
					}
				}
			}

		}
	}
	checkCollision(OtherObj,OtherX,OtherY){
		var distanceFromPlayerX= this.x - OtherX;
		var distanceFromPlayerY= this.y - OtherY;
		var euclidDistance = Math.sqrt((distanceFromPlayerX* distanceFromPlayerX) + (distanceFromPlayerY*distanceFromPlayerY));
		if(euclidDistance <= OtherObj.radius + this.radius){
			return true;
		}
		return false;
	}
	isDead(){
		if(this.health <= 0){
			this.stage.score +=100;
			this.stage.numEnemies--;
		}
		return this.health <= 0;
	}
}
class Explosion{
	constructor(stage, x, y,maxRadius){
		this.stage = stage;
		this.x=x;
		this.y=y; // this.x, this.y are int version of this.position
		this.colour = "Red";
		this.radius = 1;
		this.maxRadius = maxRadius;
		this.explode = true;
	}
	draw(context){
		context.fillStyle = this.colour;
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();  
	}	
	step(){
		if(this.explode){
			this.radius++;
			if(this.radius == this.maxRadius){
				this.explode = false;
			}
		}else{
			this.radius--;
		}
	}
	checkCollision(OtherObj,OtherX,OtherY){
		var distanceFromPlayerX= this.x - OtherX;
		var distanceFromPlayerY= this.y - OtherY;
		var euclidDistance = Math.sqrt((distanceFromPlayerX* distanceFromPlayerX) + (distanceFromPlayerY*distanceFromPlayerY));
		if(euclidDistance <= OtherObj.radius + this.radius){
			return true;
		}
		return false;
	}
	isDead(){
		return this.radius <= 0;
	}
}
class ExplosiveEnemyAI{
	constructor(stage, x, y,health){
		this.stage = stage;
		this.x=x;
		this.y=y; // this.x, this.y are int version of this.position
		this.colour = "Navy";
		this.radius = 40;
		this.health = health;
		this.velocity = new Pair(0,0);
	}

	draw(context){
		//draw my player in the x,y positions
		if(this.health > 50){
			this.colour = "Navy";
		}else if(this.health > 25){
			this.colour = "Green";
		}else{
			this.colour = "Orange";
		}
		context.fillStyle = this.colour;
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();  
	}
	step(){
		if(this.stage.player != null){
			var playerX = this.stage.player.x;
			var playerY = this.stage.player.y;
		}else{
			var playerX = this.stage.width/2;
			var playerY = this.stage.height/2;
		}

		this.velocity = new Pair ((playerX-this.x),(playerY-this.y));
		this.velocity.normalize();
		var OldX = this.x;
		var OldY = this.y;
		this.x=this.x+0.5*this.velocity.x;
		this.y=this.y+0.5*this.velocity.y;

		for(var i=0;i<this.stage.actors.length;i++){
			if((this.stage.actors[i] instanceof EnemyAI) == false){
				if(this.stage.actors[i].checkCollision(this,this.x,this.y)){
					if(this.stage.actors[i] instanceof WallObjects){
						//SEND THE ENEMY BACK
						this.x = OldX;
						this.y = OldY;
						this.stage.actors[i].health -=25;
					}else if(this.stage.actors[i] instanceof Bullet){
						this.health  -= this.stage.actors[i].damage;
						this.stage.actors[i].lifespan = 0;
					}else if(this.stage.actors[i] instanceof Trap){
						this.health  -= this.stage.actors[i].damage;
					}else if(this.stage.actors[i] instanceof TreeObjects){
						//sendback
						this.x = OldX;
						this.y = OldY;
					}else if(this.stage.actors[i] instanceof DifferentTerrian){
						this.velocity.x *= this.stage.actors[i].velocityMultiplier;
						this.velocity.y *= this.stage.actors[i].velocityMultiplier;
					}else if(this.stage.actors[i] instanceof Explosion){
						this.health-=10;
					}else if(this.stage.actors[i] instanceof Player){
						this.stage.actors[i].health -= 25;
					}
				}
			}

		}
	}
	checkCollision(OtherObj,OtherX,OtherY){
		var distanceFromPlayerX= this.x - OtherX;
		var distanceFromPlayerY= this.y - OtherY;
		var euclidDistance = Math.sqrt((distanceFromPlayerX* distanceFromPlayerX) + (distanceFromPlayerY*distanceFromPlayerY));
		if(euclidDistance <= OtherObj.radius + this.radius){
			return true;
		}
		return false;
	}
	isDead(){
		if(this.health <= 0){
			var explosion = new Explosion(this,this.x,this.y,100);
			this.stage.addActor(explosion);
			if(this.health <= 0){
				this.stage.score +=250;
				this.stage.numEnemies--;
			}
		}
		return this.health <= 0;
	}
}
/*------------------------------------------------------------------------------------------------------------- */
