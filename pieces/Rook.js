/**
 * Created by bopang on 28/05/15.
 */

var Rook = function(x, y, color, board){
    Piece.call(this, x, y, color, board);
    this.modelUrl = color ? 'Models/White_Rook.dae': 'Models/Black_Rook.dae';
    this.updatePosition();
    this.loadModel();
}

Rook.prototype = Object.create(Piece.prototype);
Rook.prototype.constructor = Rook;

Rook.prototype.couldMoveTo = function(){
    this.x = parseInt(this.x);
    this.y = parseInt(this.y);
    var cmt = [];

    for(var i = 1; i <=7 ; i++){
        if (this.x - i <= 0) break;
        if (this.board.posMatrix[this.x-i][this.y] === undefined) {
            cmt.push({x:this.x-i,y:this.y});
        } else {
            if (this.board.posMatrix[this.x-i][this.y].color !== this.color) {
                cmt.push({x:this.x-i,y:this.y});
            }
            break;
        }
    }

    for(var i = 1; i <=7 ; i++){
        if (this.x + i >= 9) break;
        if (this.board.posMatrix[this.x+i][this.y] === undefined) {
            cmt.push({x:this.x+i,y:this.y});
        } else {
            if (this.board.posMatrix[this.x+i][this.y].color !== this.color) {
                cmt.push({x:this.x+i,y:this.y});
            }
            break;
        }
    }

    for(var i = 1; i <=7 ; i++){
        if (this.y - i <= 0) break;
        if (this.board.posMatrix[this.x][this.y-i] === undefined) {
            cmt.push({x:this.x,y:this.y-i});
        } else {
            if (this.board.posMatrix[this.x][this.y-i].color !== this.color) {
                cmt.push({x:this.x,y:this.y-i});
            }
            break;
        }
    }

    for(var i = 1; i <=7 ; i++){
        if (this.y + i >= 9) break;
        if (this.board.posMatrix[this.x][this.y+i] === undefined) {
            cmt.push({x:this.x,y:this.y+i});
        } else {
            if (this.board.posMatrix[this.x][this.y+i].color !== this.color) {
                cmt.push({x:this.x,y:this.y+i});
            }
            break;
        }
    }
    return cmt;
}