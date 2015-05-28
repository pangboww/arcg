/**
 * Created by bopang on 28/05/15.
 */

var Board = function(){
    THREE.Object3D.call(this);
    this.modelUrl = "Models/Board.dae";
    this.loadModel();
}

Board.prototype = Object.create(THREE.Object3D.prototype);
Board.prototype.constructor = Board;


Board.prototype.loadModel = function(){
    var container = this;
    loader.load(this.modelUrl, function(collada){
        var dae = collada.scene.children[0];
        dae.scale.set(positionScale,positionScale,positionScale);
        dae.position.set(0,0,0);
        dae.rotation.set(Math.PI/2,0,0);
        container.add(dae);
    });
}