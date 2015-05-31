/**
 * Created by bopang on 28/05/15.
 */

var King = function(x, y, color, board){
    Piece.call(this, x, y, color, board);
    this.modelUrl = color ? 'Models/White_King.dae': 'Models/Black_King.dae';
    this.updatePosition();
    this.loadModel();
}

King.prototype = Object.create(Piece.prototype);
King.prototype.constructor = King;

King.prototype.couldMoveTo = function(){
    var cmt = [];
    this.x = parseInt(this.x);
    this.y = parseInt(this.y);

    for(var i = -1; i <= 1; i++){
        if (this.x + i <= 0 || this.x + i >= 9) continue;
        for(var j = -1; j <= 1; j++){
            if (this.y + j <= 0 || this.y + j >= 9) continue;
            if (i == 0 && j == 0) continue;
            if (this.board.posMatrix[this.x+i][this.y+j] === undefined) {
                cmt.push({x:this.x+i,y:this.y+j});
            } else {
                if (this.board.posMatrix[this.x+i][this.y+j].color !== this.color) {
                    cmt.push({x:this.x+i,y:this.y+j});
                }
            }
        }
    }
    return cmt;
}