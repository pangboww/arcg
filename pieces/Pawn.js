/**
 * Created by bopang on 28/05/15.
 */

var Pawn = function(x, y, color, board){
    Piece.call(this, x, y, color, board);
    this.modelUrl = color ? 'Models/White_Pawn.dae': 'Models/Black_Pawn.dae';
    this.updatePosition();
    this.loadModel();
}

Pawn.prototype = Object.create(Piece.prototype);
Pawn.prototype.constructor = Pawn;

Pawn.prototype.couldMoveTo = function(){
    var cmt = [];
    this.x = parseInt(this.x);
    this.y = parseInt(this.y);
    if (this.color == WHITE){
        if (this.board.posMatrix[this.x][this.y+1] === undefined) cmt.push({x:this.x,y:this.y+1});
        if (this.y == 2
            && this.board.posMatrix[this.x][this.y+2] === undefined) cmt.push({x:this.x,y:this.y+2});
        if (this.x == 1){
            if (this.board.posMatrix[this.x+1][this.y+1] !== undefined
                && this.board.posMatrix[this.x+1][this.y+1].color == BLACK){
                cmt.push({x:this.x+1,y:this.y+1});
            }
        }
        else if (this.x == 8){
            if (this.board.posMatrix[this.x-1][this.y+1] !== undefined
                && this.board.posMatrix[this.x-1][this.y+1].color == BLACK){
                cmt.push({x:this.x-1,y:this.y+1});
                console.log('come to here');
            }
        }
        else {
            if (this.board.posMatrix[this.x+1][this.y+1] !== undefined
                && this.board.posMatrix[this.x+1][this.y+1].color == BLACK){
                cmt.push({x:this.x+1,y:this.y+1});
            }
            if (this.board.posMatrix[this.x-1][this.y+1] !== undefined
                && this.board.posMatrix[this.x-1][this.y+1].color == BLACK){
                cmt.push({x:this.x-1,y:this.y+1});
            }
        }
    }
    else {
        if (this.board.posMatrix[this.x][this.y-1] === undefined) cmt.push({x:this.x,y:this.y-1});
        if (this.y == 7
            && this.board.posMatrix[this.x][this.y-2] === undefined) cmt.push({x:this.x,y:this.y-2});
        if (this.x == 1){
            if (this.board.posMatrix[this.x+1][this.y-1] !== undefined
                && this.board.posMatrix[this.x+1][this.y-1].color == WHITE){
                cmt.push({x:this.x+1,y:this.y-1});
            }
        }
        else if (this.x == 8){
            if (this.board.posMatrix[this.x-1][this.y-1] !== undefined
                && this.board.posMatrix[this.x-1][this.y-1].color == WHITE){
                cmt.push({x:this.x-1,y:this.y-1});
            }
        }
        else {
            if (this.board.posMatrix[this.x+1][this.y-1] !== undefined
                && this.board.posMatrix[this.x+1][this.y-1].color == WHITE){
                cmt.push({x:this.x+1,y:this.y-1});
            }
            if (this.board.posMatrix[this.x-1][this.y-1] !== undefined
                && this.board.posMatrix[this.x-1][this.y-1].color == WHITE){
                cmt.push({x:this.x-1,y:this.y-1});
            }
        }
    }
    return cmt;
}
