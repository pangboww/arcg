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