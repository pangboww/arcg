/**
 * Created by bopang on 25/05/15.
 */

var ChessBoard = function () { this.init(); }


ChessBoard.prototype.init = function(){
    this.posMatrix;
    this.chessboard = new THREE.Object3D();
    this.board = new Board();
    this.chessboard.add(this.board);

    this.initPieces = function(){
        this.posMatrix = [];
        for(var i = 1; i <= 8; i++) {
            this.posMatrix[i] = [];
            for(var j = 1; j <= 8; j++) {
                this.posMatrix[i][j] = undefined;
            }
        }
        for(var i = 1; i <= 8; i++) {
            this.posMatrix[i][2] = new Pawn(i,2,WHITE,this);
            this.chessboard.add(this.posMatrix[i][2]);
            this.posMatrix[i][7] = new Pawn(i,7,BLACK,this);
            this.chessboard.add(this.posMatrix[i][7]);
        }
        this.posMatrix[1][1] = new Rook(1,1,WHITE,this);
        this.chessboard.add(this.posMatrix[1][1]);
        this.posMatrix[8][1] = new Rook(8,1,WHITE,this);
        this.chessboard.add(this.posMatrix[8][1]);
        this.posMatrix[1][8] = new Rook(1,8,BLACK,this);
        this.chessboard.add(this.posMatrix[1][8]);
        this.posMatrix[8][8] = new Rook(8,8,BLACK,this);
        this.chessboard.add(this.posMatrix[8][8]);
        this.posMatrix[2][1] = new Knight(2,1,WHITE,this);
        this.chessboard.add(this.posMatrix[2][1]);
        this.posMatrix[7][1] = new Knight(7,1,WHITE,this);
        this.chessboard.add(this.posMatrix[7][1]);
        this.posMatrix[2][8] = new Knight(2,8,BLACK,this);
        this.chessboard.add(this.posMatrix[2][8]);
        this.posMatrix[7][8] = new Knight(7,8,BLACK,this);
        this.chessboard.add(this.posMatrix[7][8]);
        this.posMatrix[3][1] = new Bishop(3,1,WHITE,this);
        this.chessboard.add(this.posMatrix[3][1]);
        this.posMatrix[6][1] = new Bishop(6,1,WHITE,this);
        this.chessboard.add(this.posMatrix[6][1]);
        this.posMatrix[3][8] = new Bishop(3,8,BLACK,this);
        this.chessboard.add(this.posMatrix[3][8]);
        this.posMatrix[6][8] = new Bishop(6,8,BLACK,this);
        this.chessboard.add(this.posMatrix[6][8]);
        this.posMatrix[4][1] = new King(4,1,WHITE,this);
        this.chessboard.add(this.posMatrix[4][1]);
        this.posMatrix[4][8] = new King(4,8,BLACK,this);
        this.chessboard.add(this.posMatrix[4][8]);
        this.posMatrix[5][1] = new Queen(5,1,WHITE,this);
        this.chessboard.add(this.posMatrix[5][1]);
        this.posMatrix[5][8] = new Queen(5,8,BLACK,this);
        this.chessboard.add(this.posMatrix[5][8]);
    }
    this.initPieces();

}

ChessBoard.prototype.getChessBoard = function(){
    return this.chessboard;
}

ChessBoard.prototype.pieceCouldMoveTo = function(x ,y){
    if(this.posMatrix[x][y] === undefined){
        return "No piece here"
    }
    else {
        return this.posMatrix[x][y].couldMoveTo();
    }
}

ChessBoard.prototype.movePieceTo = function(x, y, toX, toY){
    if(this.posMatrix[x][y] === undefined){
        return "No piece here"
    }
    else if(this.posMatrix[x][y].couldMoveTo().contains({x:toX,y:toY})){
        if (this.posMatrix[toX][toY] !== undefined){
            this.removePiece(toX,toY);
        }
        this.posMatrix[x][y].moveTo(toX,toY);
        this.posMatrix[toX][toY] = this.posMatrix[x][y];
        this.posMatrix[x][y] = undefined;
        return "move to x:" + toX + " y:" + toY;
    }
    else {
        return "could not move to x:" + toX + " y:" + toY;
    }
}

ChessBoard.prototype.removePiece = function(x, y){
    if(this.posMatrix[x][y] === undefined){
        return "Could not remove , no piece here."
    }
    this.chessboard.remove(this.posMatrix[x][y]);
    this.posMatrix[x][y] = undefined;
}

Array.prototype.contains = function(value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].x == value.x && this[i].y == value.y){
            return true;
        }
    }
    return false;
}


