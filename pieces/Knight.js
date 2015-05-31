/**
 * Created by bopang on 28/05/15.
 */

var Knight = function(x, y, color, board){
    Piece.call(this, x, y, color, board);
    this.modelUrl = color ? 'Models/White_Knight.dae': 'Models/Black_Knight.dae';
    this.updatePosition();
    this.updateRotation();
    this.loadModel();
}

Knight.prototype = Object.create(Piece.prototype);
Knight.prototype.constructor = Knight;

Knight.prototype.updatePosition = function(){
    this.position.x = (2 * this.x - 9) * positionScale + (this.color ? 10 : -10);
    this.position.y = (2 * this.y - 9) * positionScale + (this.color ? 94 : -94);
    this.position.z = 1 * positionScale - 11;
}

Knight.prototype.updateRotation = function(){
    this.color ? this.rotation.set(0,0,-Math.PI/2) : this.rotation.set(0,0,Math.PI/2);
}

Knight.prototype.couldMoveTo = function(){
    var cmt = [];
    this.x = parseInt(this.x);
    this.y = parseInt(this.y);

    for (var i = -2; i <= 2; i++) {
        if (i == 0) continue;
        if (this.x + i <= 0 || this.x + i >= 9) continue;
        var j;
        if (Math.abs(i) == 2)  j = 1;
        if (Math.abs(i) == 1)  j = 2;

        if (this.y + j <= 8){
            if (this.board.posMatrix[this.x + i][this.y + j] === undefined) {
                cmt.push({x: this.x + i, y: this.y + j});
            }
            else if (this.board.posMatrix[this.x + i][this.y + j].color !== this.color) {
                cmt.push({x: this.x + i, y: this.y + j});
            }
        }
        if (this.y - j >= 1){
            if (this.board.posMatrix[this.x + i][this.y - j] === undefined) {
                cmt.push({x: this.x + i, y: this.y - j});
            }
            else if (this.board.posMatrix[this.x + i][this.y - j].color !== this.color) {
                cmt.push({x: this.x + i, y: this.y - j});
            }
        }
    }
    return cmt;
}