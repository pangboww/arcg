/**
 * Created by bopang on 25/05/15.
 */

ChessBoard.prototype.init = function(scene){
    this.scene = scene;
    this.board;
    this.loader = new THREE.OBJMTLLoader();
    this.whiteCap = new Array();
    this.blackCap = new Array();

    this.pawn;
    this.rook;
    this.knight;
    this.bishop;
    this.queen;
    this.king;

    this.blackTexture = THREE.ImageUtils.loadTexture('Models/textures/blackmarble1.jpg');
    this.whiteTexture = THREE.ImageUtils.loadTexture('Models/textures/whitemarble1.jpg');
    this.orangeTexture = THREE.ImageUtils.loadTexture("Models/textures/orange.jpg");


    function loadBoard(board, loader){
        loader.load( 'Models/Board/board.obj', 'Models/Board/board.mtl', function ( object ) {
            object.material = null;
            object.traverse(function(mesh){
                if(mesh instanceof THREE.Mesh){
                    mesh.receiveShadow = true;
                    mesh.material.needsUpdate = true;
                }
            })
            board.board = object;
            board.scene.add(board.board);
        } );
    }

    loadBoard(this, this.loader);

    var board = this;
    var loadComplete = 0;

    this.loader.load('Models/Pawn/pawnlow.obj', 'Models/Pawn/pawn.mtl', function (object){
        board.pawn = object;
        loadComplete++;
        start++;
    });
    this.loader.load('Models/Rook/rooklow.obj', 'Models/Rook/rook.mtl', function (object){
        board.rook = object;
        loadComplete++;
        start++;
    });
    this.loader.load('Models/Knight/knightlow.obj', 'Models/Knight/knight.mtl', function (object){
        board.knight = object;

        loadComplete++;
        start++;
    });
    this.loader.load('Models/Bishop/bishoplow.obj', 'Models/Bishop/bishop.mtl', function (object){
        board.bishop = object;
        loadComplete++;
        start++;
    });
    this.loader.load('Models/Queen/queenlow.obj', 'Models/Queen/queen.mtl', function (object){
        board.queen = object;
        loadComplete++;
        start++;
    });
    this.loader.load('Models/King/kinglow.obj', 'Models/King/king.mtl', function (object){
        board.king = object;
        loadComplete++;
        start++;
    });

    var loadCompleted = function(){
        if(loadComplete == 6){
            board.loadPieces(); //When completed load, execute the piece loading
        }else{
            setTimeout(loadCompleted, 200);
        }
    };


    setTimeout(loadCompleted, 200);
}


ChessBoard.prototype.loadPieces = function(){
    this.pieces = new Array(8);
    for(var i = 0; i < this.pieces.length; i++){
        this.pieces[i] = new Array(8);
    }

    var piece;
    for(var x = 0; x < this.pieces.length; x++){
        for(var y = 0; y < this.pieces[x].length; y++){
            if(y == 0){
                if(x == 0 || x == 7){
                    piece = new Rook(this.scene, BLACK, [x, y], this);
                    this.pieces[x][y] = piece;
                }
                if(x == 1 || x == 6){
                    piece = new Knight(this.scene, BLACK, [x, y], this);
                    this.pieces[x][y] = piece;
                }
                if(x == 2 || x == 5){
                    piece = new Bishop(this.scene, BLACK, [x, y], this);
                    this.pieces[x][y] = piece;
                }
                if(x == 3){
                    piece = new Queen(this.scene, BLACK, [x, y], this);
                    this.pieces[x][y] = piece;
                }
                if(x == 4){
                    piece = new King(this.scene, BLACK, [x, y], this);
                    this.pieces[x][y] = piece;
                }
            }else if(y == 1){
                piece = new Pawn(this.scene, BLACK, [x,y], this);
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