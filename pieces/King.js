/**
*	King Class
* 	This class holds all king logic
*	The class also holds onto the king information
*   and the 3D model object
*/

var King = function (scene, color, spot, board) { this.init(scene, color, spot, board); }

/**
*	Constructor - creates a king object
*	also loads the model associated with it
*	@param scene - the king needs to have a reference to the scene graph 
*		so it can add the model into the scene
*	@param color color of the King (white or black)
*	@param spot - the position the King is in
*	@param board - a reference to the board that holds it, so the piece can
*	callback to the board to chain properly
*/
King.prototype.init = function(scene, color, spot, board)
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

	// piece fix info
	this.xfix = -2;
	this.zfix = -2;

	this.x = LEFT + (this.xLoc * 20) + this.xfix;
	this.y = TOP + (this.yLoc * 20) + this.zfix;

	// Animation info
	this.moving = false;
	this.ttl = 0;
	this.duration = 0;
	this.spaces = 0;

	// Low Poly - false || High Poly - true
	this.poly = false;
	// Marble - true || Wood - false
	this.texture = true;
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
	this.piece = cloneObjMtl(board.king);
	//Set it's texture and tell it to cast a shadow
	if(this.color){
		this.piece.traverse(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.material.map = board.whiteTexture;
				mesh.castShadow = true;
			}
		});
	} else {
		this.piece.traverse(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.material.map = board.blackTexture;
				mesh.castShadow = true;
			}
		});
	} 
	// Scale and Place the piece in its position
	this.piece.scale.x = this.piece.scale.y = this.piece.scale.z = 5;
	this.piece.position.x = LEFT + (xPos * 20) + this.xfix;
	this.piece.position.z = TOP + (yPos * 20) + this.zfix;
	this.piece.position.y = 4.5;
	this.piece.rotation.y = 90 * (Math.PI / 180);
	// Add the piece to scene
	this.scene.add(this.piece);
	//Tell the loader the piece has finished loading
	start++;
}



/**
*	Move method sets a piece up to be moved
* 	Move locations are in regards to board spots 1 through 8
*	not WebGL locations
*	@param x the board x location the piece is moved to
* 	@param y the board y location the piece is moved to
*/
King.prototype.move = function(x, y){
	// Counts the number of spaces to move
	if(this.xLoc != x){
		this.spaces = Math.abs(this.xLoc - x);
	}else{
		this.spaces = Math.abs(this.yLoc - y);
	}
	// Recalculates position info for after move
	this.xLoc = x;
	this.yLoc = y;
	this.x2 = LEFT + (x * 20) + this.xfix;
	this.y2 = TOP + (y * 20) + this.zfix;
	//Sets up moving boolean for animation
	this.moving = true;
	// Sets up time to live for animation
	this.ttl = 0;
	// Sets the duration of animation
	this.duration = SPEED_TIME * this.spaces;
	// Calculates the distance traveled in webgl points
	this.dx = (this.x2 - this.x);
	this.dy = (this.y2 - this.y);
	
}

/**
*	Update method is called if the piece is currently moving
* 	This method handles animating the piece
*/
King.prototype.update = function(){
	// Handles Piece movement animation
	// Calculates and sets X and Z position of the piece
	var newYpos = easeInOutSin(this.ttl, this.y, this.dy, this.duration);
	var newXpos = easeInOutSin(this.ttl, this.x, this.dx, this.duration);
	this.piece.position.z = newYpos;
	this.piece.position.x = newXpos;
	// Calculates and sets Y position of the piece
		// This gives the piece lifting effect
	if(this.ttl >= (this.duration / 2)){
		var newTTL = this.ttl - (this.duration / 2);
		this.piece.position.y = easeInOutSin(newTTL, 5.5, -1, (this.duration / 2));
	}else{
		this.piece.position.y = easeInOutSin(this.ttl, 4.5, 1, (this.duration / 2));
	}
	// Moves to next frame
	this.ttl++;
	// Ends animation
	if(this.ttl > this.duration){
		// Sets moving flag to false, ends animation
		this.moving = false;
		// Sets piece coordinates
		this.x = this.x2;
		this.y = this.y2;
	}
}

/**
*	Tells if the piece is moving
*	@return true if moving, false otherwise
*/
King.prototype.isMoving = function(){
	return this.moving;
}

/**
*	Updates the piece model and/or texture
*	@param poly the model being updated to
*	@param texture the texture being updated to
*/
King.prototype.updatePiece = function(poly, texture){
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
		this.piece = cloneObjMtl(this.board.king);
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
					if(temp.children[1].children[0].material.transparent){
						mesh.material.transparent = true;
						mesh.material.opacity = temp.children[1].children[0].material.opacity;
					}
					mesh.castShadow = true;
				}
			});
		} else {
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.map = board.blackTexture;
					if(temp.children[1].children[0].material.transparent){
						mesh.material.transparent = true;
						mesh.material.opacity = temp.children[1].children[0].material.opacity;
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
					if(temp.children[1].children[0].material.transparent){
						mesh.material.transparent = true;
						mesh.material.opacity = temp.children[1].children[0].material.opacity;
					}
					mesh.castShadow = true;
				}
			});
		} else {
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.map = board.blackTexture;
					if(temp.children[1].children[0].material.transparent){
						mesh.material.transparent = true;
						mesh.material.opacity = temp.children[1].children[0].material.opacity;
					}
					mesh.castShadow = true;
				}
			});
		} 
	}
	// Tell loader piece has loaded
	start++;
}