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