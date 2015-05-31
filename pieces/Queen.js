/**
 * Created by bopang on 28/05/15.
 */

var Queen = function(x, y, color, board){
    Piece.call(this, x, y, color, board);
    this.modelUrl = color ? 'Models/White_Queen.dae': 'Models/Black_Queen.dae';
    this.updatePosition();
    this.loadModel();
}

Queen.prototype = Object.create(Piece.prototype);
Queen.prototype.constructor = Queen;

Queen.prototype.couldMoveTo = function(){
    var cmt = [];
    this.x = parseInt(this.x);
    this.y = parseInt(this.y);
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

    console.log(cmt);
    return cmt;
}