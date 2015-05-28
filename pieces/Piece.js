/**
 * Created by bopang on 27/05/15.
 */


var Piece = function(x, y, color){
    THREE.Object3D.call(this);
    this.x = x;
    this.y = y;
    this.z = 0;
    this.modelUrl = "";
    this.color = color;
}

Piece.prototype = Object.create(THREE.Object3D.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.move = function(x, y){
    this.x += x;
    this.y += y;
    this.updatePosition();
}

Piece.prototype.updatePosition = function(){
    this.position.x = (this.x > 0 ? (2 * this.x - 1) : (2 * this.x + 1)) * positionScale;
    this.position.y = (this.y > 0 ? (2 * this.y - 1) : (2 * this.y + 1)) * positionScale;
    this.position.z = 1 * positionScale;
}

Piece.prototype.loadModel = function(){
    var container = this;
    loader.load(this.modelUrl, function(collada){
        var dae = collada.scene.children[0];
        dae.scale.set(modelScale,modelScale,modelScale);
        dae.position.set(0,0,0);
        dae.rotation.set(Math.PI/2,0,0);
        container.add(dae);
    });
}
