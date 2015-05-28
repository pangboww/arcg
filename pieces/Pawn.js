/**
 * Created by bopang on 28/05/15.
 */

var Pawn = function(x, y, color){
    Piece.call(this, x, y, color);
    this.modelUrl = color ? 'Models/White_Pawn.dae': 'Models/Black_Pawn.dae';
    this.updatePosition();
    this.loadModel();
}

Pawn.prototype = Object.create(Piece.prototype);
Pawn.prototype.constructor = Pawn;