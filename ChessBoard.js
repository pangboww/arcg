/**
 * Created by bopang on 25/05/15.
 */

var ChessBoard = function () { this.init(); }

ChessBoard.prototype.init = function(){


    this.bishop = new Bishop(1,1,BLACK);



    this.chessboard = new THREE.Object3D();


    this.chessboard.add(this.bishop);


}

ChessBoard.prototype.getChessBoard = function(){
    return this.chessboard;
}

