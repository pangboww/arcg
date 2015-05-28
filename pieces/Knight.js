/**
 * Created by bopang on 28/05/15.
 */

var Knight = function(x, y, color){
    Piece.call(this, x, y, color);
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