/**
*	Knight Class
* 	This class holds all knight logic
*	The class also holds onto the knight information
*   and the 3D model object
*/

var Knight = function (scene, color, spot, board) { this.init(scene, color, spot, board); }

	
/**
*	Constructor - creates a knight object
*	also loads the model associated with it
*	@param scene - the knight needs to have a reference to the scene graph 
*		so it can add the model into the scene
*	@param color color of the Knight (white or black)
*	@param spot - the position the Knight is in
*	@param board - a reference to the board that holds it, so the piece can
*	callback to the board to chain properly
*/
Knight.prototype.init = function(scene, color, spot, board)
{
	// Holds board and scene references
	this.board = board;
	this.scene = scene;
	// Sets Color
	this.color = color;
	//Sets all required position info
	this.xLoc = spot[0];
	this.yLoc = spot[1];
	this.x2 = 0;
	this.y2 = 0;
	this.dx = 0;
	this.dy = 0;
	this.zfix = 0;
	this.xfix = -2;
	// Animation info
	this.moving = false;
	this.dest = false;
	this.duration = 0;
	this.ttl = 0;
	this.spaces = 3;
	
	//Promotion Info
	this.promote = false;

	// Greater distance of movement flag
	this.yMove = true;

	// Dead position - needed for moving off table
	this.deadx = 0;
	this.deady = 0;
	this.deadz = 0;
	this.dead = false;

	// Low Poly - false || High Poly - true
	this.poly = board.highpoly;
	// Marble - true || Wood - false
	this.texture = board.texture;
	// create object for scene graph
	this.piece = new THREE.Object3D();
	// instantiate a loader
	this.loader = new THREE.OBJMTLLoader();
	
	//local variables to the init method to help loading the model
	var xPos = this.xLoc;
	var yPos = this.yLoc;
	
	//Particles
	this.clock = new THREE.Clock();
	this.particles = false;
	this.firedSmoke = false;
	this.smoke =
	{
		positionStyle  : Type.SPHERE,
		positionBase   : new THREE.Vector3( 0, 50, 0 ),
		positionRadius : 2,
				
		velocityStyle : Type.SPHERE,
		speedBase     : 40,
		speedSpread   : 8,
		
		particleTexture : THREE.ImageUtils.loadTexture( 'Models/textures/smokeparticle.png' ),

		sizeTween    : new Tween( [0, 0.1], [1, 150] ),
		opacityTween : new Tween( [0.7, 1], [1, 0] ),
		colorBase    : new THREE.Vector3(0.02, 1, 0.4),
		blendStyle   : THREE.AdditiveBlending,  
		
		particlesPerSecond : 60,
		particleDeathAge   : 0.1,		
		emitterDeathAge    : 0.1
	};
	
	// Clone piece from the reference piece in board
	this.piece = cloneObjMtl(board.knight);
	//Set it's texture and tell it to cast a shadow
	if(this.color){
		this.zfix = 3;
		this.piece.rotation.y = -90 * (Math.PI / 180);
		this.piece.traverse(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.material.map = board.whiteTexture;
				mesh.castShadow = true;
			}
		});
	} else {
		this.zfix = -3;
		this.piece.rotation.y = 90 * (Math.PI / 180);
		this.piece.traverse(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.material.map = board.blackTexture;
				mesh.castShadow = true;
			}
		});
	} 
	// Scale and Place the piece in its position
	this.x = LEFT + (this.xLoc * 20) + this.xfix;
	this.y = TOP + (this.yLoc * 20) + this.zfix;
	this.piece.scale.x = this.piece.scale.y = this.piece.scale.z = 5;
	this.piece.position.x = LEFT + (xPos * 20) + this.xfix;
	this.piece.position.z = TOP + (yPos * 20) + this.zfix;
	this.piece.position.y = 12.5;
	// Add the piece to scene
	this.scene.add(this.piece);
	//Tell the loader the piece has finished loading
	start++;
}

/**
*	Promotion method sets up a Pawn to be promoted to a Knight
*	@param ttl time until Pawn reaches end of its animation
*/
Knight.prototype.promoted = function(ttl){
	// Set the opacity to 0 and transparency on
	this.piece.traverse(function(mesh){
		if(mesh instanceof THREE.Mesh){
			mesh.material.transparent = true;
			mesh.material.opacity = 0;
		}
	});
	// Calculate time
	this.ttl = ttl + (FADE_TIME * 2);
	// Set animation flags on
	this.moving = true;
	this.promote = true;
}

/**
*	Move method sets a piece up to be moved
* 	Move locations are in regards to board spots 1 through 8
*	not WebGL locations
*	@param x the board x location the piece is moved to
* 	@param y the board y location the piece is moved to
*/
Knight.prototype.move = function(x, y){
	// Recalculates position info for after move
	this.xLoc = x;
	this.yLoc = y;
	this.x2 = LEFT + (x * 20) + this.xfix;
	this.y2 = TOP + (y * 20) + this.zfix;
	
	//Sets up moving boolean for animation
	this.moving = true;
	// Sets the duration of animation
	this.duration = SPEED_TIME * this.spaces;
	// Sets up time to live for animation
	this.ttl = 0;
	// Calculates the distance traveled in webgl points
	this.dx = (this.x2 - this.x);
	this.dy = (this.y2 - this.y);
	// Calculates which direction the Knight moves furthur in
	if(Math.abs(this.dy) > Math.abs(this.dx)){
		this.yMove = true;
	}else{
		this.yMove = false;
	}
}

/**
*	Update method is called if the piece is currently moving
* 	This method handles animating the piece
*/
Knight.prototype.update = function(){
	// Handles Fading out piece on capture
	if(this.dest){
		var self = this;
		// Fades out pieces once the capturing piece gets close
		if(this.ttl <= (this.duration / this.spaces)){
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					if(!mesh.material.transparent){
						mesh.material.transparent = true;
						mesh.material.opacity = 1;
					}
					mesh.material.opacity -= (1 / (self.duration / self.spaces));
				}
			});
		}
		// Moves to Next frame
		this.ttl--;
		// Ends fade out
		if(this.ttl == 0){
			// Ends Fading out and set ups fade in on the table
			this.dest = false;
			this.dead = true;
			this.ttl = 0;
			//Sets up duration for Fade back in
			this.duration = (this.duration / this.spaces);
			//Sets location on table
			this.piece.position.x = this.deadx;
			this.piece.position.y = this.deady;
			this.piece.position.z = this.deadz;
		}
	// Handles fading back in on the table
	}else if(this.dead){
		// Particle effect when the piece is placed on the table
		if(!this.firedSmoke)
		{
			this.board.engine.push(new ParticleEngine(this.scene));
			this.smoke.positionBase = new THREE.Vector3(this.piece.position.x,this.piece.position.y,this.piece.position.z);
			this.board.engine[this.board.engine.length-1].setValues( this.smoke );
			this.board.engine[this.board.engine.length-1].initialize();
			this.firedSmoke = true;
			this.particles = true;
		}
		// Fades back in on table
		var self = this;
		this.piece.traverse(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.material.opacity += (1 / self.duration);
			
			}
		});
		// Move to next frame
		this.ttl++;
		// Ends dead animation
		if(this.ttl == this.duration){
			this.moving = false;
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.transparent = false;
				}
			});
		}
	// Handles Promoting to this piece
	}else if(this.promote){
		// Fades Piece in
		if(this.ttl <= FADE_TIME){
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.opacity += (1 / FADE_TIME);
				}
			});
		}
		// Move to next frame
		this.ttl--;
		// End fading
		if(this.ttl == 0){
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.transparent = false;
				}
			});
			// Set promotion flags off
			this.moving = false;
			this.promote = false;
		}
	// Handles Piece movement animation
	}else {
		// Calculates X and Z position of the piece
		if(this.yMove){
			var newYpos = easeInOutExp(this.ttl, this.y, this.dy, this.duration);
			var newXpos = easeInOutSin(this.ttl, this.x, this.dx, this.duration);
		}else{
			var newYpos = easeInOutSin(this.ttl, this.y, this.dy, this.duration);
			var newXpos = easeInOutExp(this.ttl, this.x, this.dx, this.duration);
		}
		// Sets X and Z postion of the piece
		this.piece.position.z = newYpos;
		this.piece.position.x = newXpos;
		// Calculates and sets Y position of piece 
		if(this.ttl >= (this.duration / 2)){
			var newTTL = this.ttl - (this.duration / 2);
			this.piece.position.y = easeInOutSin(newTTL, 16.5, -4, (this.duration / 2));
		}else{
			this.piece.position.y = easeInOutSin(this.ttl, 12.5, 4, (this.duration / 2));
		}
		// Moves to next frame
		this.ttl++;
		// Ends animation
		if(this.ttl > this.duration){
			this.moving = false;
			this.x = this.x2;
			this.y = this.y2;
		}
	}
}

/**
*	Destroy method sets up piece to be capture
*	@param ttl the duration of the piece capping it
* 	@param spaces the number of spaces the piece capturing
*		it has to move
*/
Knight.prototype.destroy = function(ttl, spaces){
	this.spaces = spaces;
	this.moving = true;
	this.ttl = ttl;
	this.duration = ttl;
	this.dest = true;

}

/**
*	Tells if the piece is moving
*	@return true if moving, false otherwise
*/
Knight.prototype.isMoving = function(){
	return this.moving;
}

/**
*	Updates the piece model and/or texture
*	@param poly the model being updated to
*	@param texture the texture being updated to
*/
Knight.prototype.updatePiece = function(poly, texture){

	// Set up references for anonymous functions
	var board = this.board;
	var temp = this.piece;

	// Update the Piece Geometries
	if(this.poly != poly){
		// Set geometry flag
		this.poly = poly;
		//Remove old model from scene
		this.scene.remove(this.piece);
		// Clone model reference and position it
		this.piece = cloneObjMtl(this.board.knight);
		this.piece.scale.x = this.piece.scale.y = this.piece.scale.z = 5;
		this.piece.position.x = temp.position.x;
		this.piece.position.z = temp.position.z;
		this.piece.position.y = temp.position.y;
		this.piece.rotation.y = temp.rotation.y;
		// Set texture flag
		this.texture = texture;
		// Update texture of model
		if(this.color){
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.map = board.whiteTexture;
					if(temp.children[0].children[0].material.transparent){
						mesh.material.transparent = true;
						mesh.material.opacity = temp.children[0].children[0].material.opacity;
					}
					mesh.castShadow = true;
				}
			});
		} else {
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.map = board.blackTexture;
					if(temp.children[0].children[0].material.transparent){
						mesh.material.transparent = true;
						mesh.material.opacity = temp.children[0].children[0].material.opacity;
					}
					mesh.castShadow = true;
				}
			});
		} 
		// Add piece to scene
		this.scene.add(this.piece);
	}
	// Update Texture of model
	if(this.texture != texture){
		// Set texture flag
		this.texture = texture;
		// Update Texture
		if(this.color){
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.map = board.whiteTexture;
					if(temp.children[0].children[0].material.transparent){
						mesh.material.transparent = true;
						mesh.material.opacity = temp.children[0].children[0].material.opacity;
					}
					mesh.castShadow = true;
				}
			});
		} else {
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.map = board.blackTexture;
					if(temp.children[0].children[0].material.transparent){
						mesh.material.transparent = true;
						mesh.material.opacity = temp.children[0].children[0].material.opacity;
					}
					mesh.castShadow = true;
				}
			});
		} 
	}
	// Tell loader piece has loaded
	start++;

}

/**
*	outPos calculates piece location outside on table
*	@param pos the place the pice goes logically
*/
Knight.prototype.outPos = function(pos){
	var spot = pos;
	if(pos > 11){
		spot -= 11;
	}
	if(this.color){
		this.deadx = -85;
		if(pos > 11){
			this.deadx -= 15;
		}
		this.deadz = TOP + ((spot - 1) * 15) - 5; 
	}else{
		this.deadx = 90;
		if(pos > 11){
			this.deadx += 15;
		}
		this.deadz = 80 - ((spot - 1) * 15) + 5;
		
	}

	this.deadz += this.zfix;
	this.deadx += this.xfix;	
	
	this.deady = 10.2;

}