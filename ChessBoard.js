/**
 * Created by bopang on 25/05/15.
 */

var ChessBoard = function () { this.init(); }
var knight;

ChessBoard.prototype.init = function(){



    this.chessboard = new THREE.Object3D();

    this.board = new Board();
    this.chessboard.add(this.board);
    this.chessboard.add(new Pawn(3,-4,WHITE));
    this.chessboard.add(new Pawn(3,-3,WHITE));
    this.chessboard.add(new Pawn(3,-2,WHITE));
    this.chessboard.add(new Pawn(3,-1,WHITE));
    this.chessboard.add(new Pawn(3, 1,WHITE));
    this.chessboard.add(new Pawn(3, 2,WHITE));
    this.chessboard.add(new Pawn(3, 3,WHITE));
    this.chessboard.add(new Pawn(3, 4,WHITE));
    this.chessboard.add(new Rook(4,-4,WHITE));
    this.chessboard.add(new Rook(4, 4,WHITE));
    knight = new Knight(4,-3,WHITE)
    this.chessboard.add(knight);
    this.chessboard.add(new Knight(4, 3,WHITE));
    this.chessboard.add(new Bishop(4,-2,WHITE));
    this.chessboard.add(new Bishop(4, 2,WHITE));
    this.chessboard.add(new King(4,-1,WHITE));
    this.chessboard.add(new Queen(4,1,WHITE));

    this.chessboard.add(new Pawn(-3,-4,BLACK));
    this.chessboard.add(new Pawn(-3,-3,BLACK));
    this.chessboard.add(new Pawn(-3,-2,BLACK));
    this.chessboard.add(new Pawn(-3,-1,BLACK));
    this.chessboard.add(new Pawn(-3, 1,BLACK));
    this.chessboard.add(new Pawn(-3, 2,BLACK));
    this.chessboard.add(new Pawn(-3, 3,BLACK));
    this.chessboard.add(new Pawn(-3, 4,BLACK));
    this.chessboard.add(new Rook(-4,-4,BLACK));
    this.chessboard.add(new Rook(-4, 4,BLACK));
    this.chessboard.add(new Knight(-4,-3,BLACK));
    this.chessboard.add(new Knight(-4, 3,BLACK));
    this.chessboard.add(new Bishop(-4,-2,BLACK));
    this.chessboard.add(new Bishop(-4, 2,BLACK));
    this.chessboard.add(new King(-4,-1,BLACK));
    this.chessboard.add(new Queen(-4,1,BLACK));

}

ChessBoard.prototype.getChessBoard = function(){
    return this.chessboard;
}

