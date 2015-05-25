var ChessBoard = function (scene, camera) { this.init(scene, camera); }

ChessBoard.prototype.init = function(scene, camera)
{
	this.scene = scene;
	this.board;
	this.camera = new CameraController(camera);
	this.moveQueue = new Array(); // queue of moves to be animated
	this.movingArray = new Array(); // array of concurrently moving pieces
	this.loadStack = new Array();
	this.loader = new THREE.OBJMTLLoader();
	this.pawn;
	this.rook;
	this.knight;
	this.bishop;
	this.queen;
	this.king;
	function loadBoard(board, loader){
	loader.load( 'Models/Board/board.obj', 'Models/Board/board.mtl', function ( object ) {
		object.position.x = -20;
    	object.scale.x = 10;
    	object.scale.y = 10;
    	object.scale.z = 10;
		object.material = null;
		object.receiveShadow = true;	
		board.board = object;
		board.scene.add(board.board);
		start++;
		console.log(start);
    } );
	}
	

	loadBoard(this, this.loader);
	
	//load in all pieces
	var board = this;
	var loadComplete = 0;
	this.loader.load('Models/Pawn/pawnlow.obj', 'Models/Pawn/pawn.mtl', function (object){
		board.pawn = object;
		board.loader.load('Models/Rook/rooklow.obj', 'Models/Rook/rook.mtl', function(object){
			board.rook = object;
			
			board.loader.load('Models/Knight/knightlow.obj', 'Models/Knight/knight.mtl', function(object){
				board.knight = object;
				board.loader.load('Models/Bishop/bishoplow.obj', 'Models/Bishop/bishop.mtl', function(object){
					board.bishop = object;
					board.loader.load('Models/Queen/queenlow.obj', 'Models/Queen/queen.mtl', function(object){
						board.queen = object;
						board.loader.load('Models/King/kinglow.obj', 'Models/King/king.mtl', function(object){
							board.king = object;
							board.loadPieces();
						});
					});
				});
			});
		});
	});

	
}

ChessBoard.prototype.loadPieces = function(){
	this.pieces = new Array(8);
	for(var i = 0; i < this.pieces.length; i++){
		this.pieces[i] = new Array(8);
	}
	
	var blackTex = THREE.ImageUtils.loadTexture('Models/textures/blackmarble1.jpg');

	var piece;
	for(var x = 0; x < this.pieces.length; x++){
		for(var y = 0; y < this.pieces[x].length; y++){
			if(y == 0){
				if(x == 0 || x == 7){
					piece = new Rook(this.scene, BLACK, [x, y], this);
					piece.piece.children[0].children[0].material.map = blackTex;
					this.pieces[x][y] = piece;
				}
				if(x == 1 || x == 6){
					piece = new Knight(this.scene, BLACK, [x, y], this);
					piece.piece.children[0].children[0].material.map = blackTex;
					this.pieces[x][y] = piece;
				}
				if(x == 2 || x == 5){
					piece = new Bishop(this.scene, BLACK, [x, y], this);
					piece.piece.children[0].children[0].material.map = blackTex;
					this.pieces[x][y] = piece;
				}
				if(x == 3){
					piece = new Queen(this.scene, BLACK, [x, y], this);
					piece.piece.children[0].children[0].material.map = blackTex;
					this.pieces[x][y] = piece;
				}
				if(x == 4){
					piece = new King(this.scene, BLACK, [x, y], this);
					piece.piece.children[1].children[0].material.map = blackTex;
					piece.piece.children[1].children[1].material.map = blackTex;
					this.pieces[x][y] = piece;
				}
			}else if(y == 1){
				piece = new Pawn(this.scene, BLACK, [x,y], this);
				piece.piece.children[0].children[0].material.map = blackTex;
				this.pieces[x][y] = piece;
			}else if(y == 6){
				piece = new Pawn(this.scene, WHITE, [x,y], this);
				this.pieces[x][y] = piece;
			}else if(y == 7){
				if(x == 0 || x == 7){
					piece = new Rook(this.scene, WHITE, [x, y], this);
					this.pieces[x][y] = piece;
				}
				if(x == 1 || x == 6){
					piece = new Knight(this.scene, WHITE, [x, y], this);
					this.pieces[x][y] = piece;
				}
				if(x == 2 || x == 5){
					piece = new Bishop(this.scene, WHITE, [x, y], this);
					this.pieces[x][y] = piece;
				}
				if(x == 3){
					piece = new Queen(this.scene, WHITE, [x, y], this);
					this.pieces[x][y] = piece;
				}
				if(x == 4){
					piece = new King(this.scene, WHITE, [x, y], this);
					this.pieces[x][y] = piece;
				}
			}
		}
	}
}
ChessBoard.prototype.update = function(){
	
	var bool = false;
	for(var i = 0; i < this.movingArray.length; i++){
		//console.log(this.movingArray[i].isMoving());
		//console.log(this.movingArray[i].isMoving());
		if(this.movingArray[i].isMoving()){
			this.movingArray[i].update();
			bool = true;
		}
	}
	if(!bool){
		this.movingArray = new Array();
		if(this.moveQueue.length > 0){
			var move = this.moveQueue.shift();
			if(move.isPiece()){
				if(move.castle){
					var x = move.x;
					var y = move.y;
					var x2 = move.x2;
					var y2 = move.y2;
					var rx = -1;
					var ry = y;
					var rx2 = -1;
					var ry2 = y;
					if(move.queenCastle){
						rx = 0;
						rx2 = x2 + 1;
					}else{
						rx = 7;
						rx2 = x2 - 1;
					}
					this.pieces[x][y].move(x2, y2);
					this.pieces[x2][y2] = this.pieces[x][y];
					this.pieces[x][y] = null;
					this.pieces[rx][ry].move(rx2, ry2);
					this.pieces[rx2][ry2] = this.pieces[rx][ry];
					this.pieces[rx][ry] = null;
					this.movingArray.push(this.pieces[x2][y2]);
					this.movingArray.push(this.pieces[rx2][ry2]);
				}else{
					console.log(move);
					var x = move.x;
					var y = move.y;
					var x2 = move.x2;
					var y2 = move.y2;
					this.pieces[x][y].move(x2, y2);
					if(this.pieces[x2][y2]){
						console.log('piece dies');
						this.pieces[x2][y2].destroy(this.pieces[x][y].ttl);
						this.movingArray.push(this.pieces[x2][y2]);
					}else {
						// en passent happens
						if(move.pawnCap){
							console.log('piece dies');
							this.pieces[x2][y].destroy(this.pieces[x][y].ttl);
							this.movingArray.push(this.pieces[x2][y]);
						}
					}
					if(move.promote){
						this.pieces[x][y].promoted();
						this.movingArray.push(this.pieces[x][y]);
						if(move.promoteType == 'Q'){
							this.pieces[x2][y2] = new Queen(this.scene, this.pieces[x][y].color, [x2, y2], this);
						}else if(move.promoteType == 'N'){
							this.pieces[x2][y2] = new Knight(this.scene, this.pieces[x][y].color, [x2, y2], this);
						}else if(move.promoteType == 'R'){
							this.pieces[x2][y2] = new Rook(this.scene, this.pieces[x][y].color, [x2, y2], this);
						}else if(move.promoteType == 'B'){
							this.pieces[x2][y2] = new Bishop(this.scene, this.pieces[x][y].color, [x2, y2], this);
						}
						
						this.pieces[x2][y2].promoted(this.pieces[x][y].ttl);
						this.movingArray.push(this.pieces[x2][y2]);
						this.pieces[x][y] = null;
					}else{
						this.pieces[x2][y2] = this.pieces[x][y];
						this.pieces[x][y] = null;
						this.movingArray.push(this.pieces[x2][y2]);
					}
				}
			}else{
				this.camera.move();
				this.movingArray.push(this.camera);
			}
			
			//console.log(this.movingArray);
			//console.log(this.moveQueue);
			
		}
	}
}
ChessBoard.prototype.move = function(str){
	var move = new PieceMove(str);
	var camMove = new CameraMove();
	this.moveQueue.push(move);
	this.moveQueue.push(camMove);
	
}
