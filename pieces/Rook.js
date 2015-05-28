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