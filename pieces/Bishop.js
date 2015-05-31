/**
 * Created by bopang on 28/05/15.
 */

var Bishop = function(x, y, color, board){
    Piece.call(this, x, y, color, board);
    this.modelUrl = color ? 'Models/White_Bishop.dae': 'Models/Black_Bishop.dae';
    this.updatePosition();
    this.loadModel();
}

Bishop.prototype = Object.create(Piece.prototype);
Bishop.prototype.constructor = Bishop;

Bishop.prototype.couldMoveTo = function(){
    var cmt = [];
    this.x = parseInt(this.x);
    this.y = parseInt(this.y);
    for(var i = 1; i <=7 ; i++){
        if (this.x - i <= 0 || this.y - i <= 0) break;
        if (this.board.posMatrix[this.x-i][this.y-i] === undefined) {
            cmt.push({x:this.x-i,y:this.y-i});
        } else {
            if (this.board.posMatrix[this.x-i][this.y-i].color !== this.color) {
                cmt.push({x:this.x-i,y:this.y-i});
            }
            break;
        }
    }

    for(var i = 1; i <=7 ; i++){
        if (this.x + i >= 9 || this.y + i >= 9) break;
        if (this.board.posMatrix[this.x+i][this.y+i] === undefined) {
            cmt.push({x:this.x+i,y:this.y+i});
        } else {
            if (this.board.posMatrix[this.x+i][this.y+i].color !== this.color) {
                cmt.push({x:this.x+i,y:this.y+i});
            }
            break;
        }
    }

    for(var i = 1; i <=7 ; i++){
        if (this.x - i <= 0 || this.y + i >= 9) break;
        if (this.board.posMatrix[this.x-i][this.y+i] === undefined) {
            cmt.push({x:this.x-i,y:this.y+i});
        } else {
            if (this.board.posMatrix[this.x-i][this.y+i].color !== this.color) {
                cmt.push({x:this.x-i,y:this.y+i});
            }
            break;
        }
    }

    for(var i = 1; i <=7 ; i++){
        if (this.x + i >= 9 || this.y - i <= 0) break;
        if (this.board.posMatrix[this.x+i][this.y-i] === undefined) {
            cmt.push({x:this.x+i,y:this.y-i});
        } else {
            if (this.board.posMatrix[this.x+i][this.y-i].color !== this.color) {
                cmt.push({x:this.x+i,y:this.y-i});
            }
            break;
        }
    }

    return cmt;
}