/**
 * Created by bopang on 23/05/15.
 */

var video, canvas, context, imageData, detector, posit;
var renderer;
var scene1, scene2;
var camera1, camera2;
var model, texture;
var modelSize = 36;

THREE.Object3D.prototype.move = function(x, y, z){
    this.position.x += x;
    this.position.y += y;
    this.position.z += z;
}

function onLoad(){
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    canvas.width = parseInt(canvas.style.width);
    canvas.height = parseInt(canvas.style.height);

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (navigator.getUserMedia){
        init();
    }
};

function init(){
    navigator.getUserMedia({video:true},
        function (stream){
            if (window.URL) {
                video.src = window.URL.createObjectURL(stream);
            } else if (video.mozSrcObject !== undefined) {
                video.mozSrcObject = stream;
            } else {
                video.src = stream;
            }
        },
        function(error){
        }
    );

    detector = new AR.Detector();
    posit = new POS.Posit(modelSize, canvas.width);

    createRenderers();
    createScenes();

    requestAnimationFrame(tick);
};

function tick(){
    requestAnimationFrame(tick);

    if (video.readyState === video.HAVE_ENOUGH_DATA){
        snapshot();

        var markers = detector.detect(imageData);
        drawCorners(markers);
        updateScenes(markers);

        render();
    }
};

function snapshot(){
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
};

function drawCorners(markers){
    var corners, i;
    var length;

    context.lineWidth = 3;

    for (i = 0; i < markers.length; ++ i){
        corners = markers[i].corners;

        length = corners[1].x - corners[0].x;
        length = length > 0 ? length : -length;
        context.strokeStyle = "blue";
        context.strokeRect(corners[0].x, corners[0].y, length, length);
    }
};

function createRenderers(){
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff, 1);
    renderer.setSize(canvas.width, canvas.height);
    document.getElementById("container").appendChild(renderer.domElement);
    scene1 = new THREE.Scene();
    camera1 = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5);
    scene1.add(camera1);

    scene2 = new THREE.Scene();
    camera2 = new THREE.PerspectiveCamera(40, canvas.width / canvas.height, 1, 1000);
    scene2.add(camera2);

    var light = new THREE.PointLight(0xfffff3, 1);
    light.position.set(-100,400,200);
    scene2.add(light);
};

function render(){
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(scene1, camera1);
    renderer.render(scene2, camera2);
};

function createScenes(){
    texture = createTexture();
    scene1.add(texture);

    model = createModel();
    scene2.add(model);
};



function createTexture(){
    var texture = new THREE.Texture(video),
        object = new THREE.Object3D(),
        geometry = new THREE.PlaneGeometry(1.0, 1.0, 0.0),
        material = new THREE.MeshBasicMaterial( {map: texture, depthTest: false, depthWrite: false} ),
        mesh = new THREE.Mesh(geometry, material);

    object.position.z = -1;

    object.add(mesh);

    return object;
};

function createModel(){
    var object = new ChessBoard();

    //var loader = new THREE.ColladaLoader();

    //loader.options.convertUpAxis = true;
    //
    //loader.load( 'Models/Board.dae', function ( collada ) {
    //    var dae = collada.scene.children[0];
    //    dae.scale.set(15,15,15);
    //    dae.rotation.set(Math.PI/2,0,0);
    //    dae.name = "Board";
    //    object.add(dae);
    //});
    //
    //loader.load( 'Models/White_King.dae', function ( collada ) {
    //    var dae = collada.scene;
    //    dae.position.set(15,15,15);
    //    dae.scale.set(12,12,12);
    //    dae.rotation.set(Math.PI/2,0,0);
    //    object.add(dae);
    //});
    //loader.load( 'Models/White_Bishop.dae', function ( collada ) {
    //    var dae = collada.scene;
    //    dae.position.set(-15,-15,15);
    //    dae.scale.set(12,12,12);
    //    dae.rotation.set(Math.PI/2,0,0);
    //    object.add(dae);
    //});
    //loader.load( 'Models/Black_Queen.dae', function ( collada ) {
    //    var dae = collada.scene;
    //    dae.position.set(15,-15,15);
    //    dae.scale.set(12,12,12);
    //    dae.rotation.set(Math.PI/2,0,0);
    //    object.add(dae);
    //});
    //loader.load( 'Models/Black_Pawn.dae', function ( collada ) {
    //    var dae = collada.scene;
    //    dae.position.set(-15,15,15);
    //    dae.scale.set(12,12,12);
    //    dae.rotation.set(Math.PI/2,0,0);
    //    object.add(dae);
    //});



    return object;
}

function updateScenes(markers){
    var corners, corner, pose, i;

    if (markers.length > 0){
        corners = markers[0].corners;

        for (i = 0; i < corners.length; ++ i){
            corner = corners[i];

            corner.x = corner.x - (canvas.width / 2);
            corner.y = (canvas.height / 2) - corner.y;
        }

        pose = posit.pose(corners);
        updateObject(model, pose.bestRotation, pose.bestTranslation);
    }

    texture.children[0].material.map.needsUpdate = true;
};

function updateObject(object, rotation, translation){
    object.scale.x = modelSize/100;
    object.scale.y = modelSize/100;
    object.scale.z = modelSize/100;

    object.rotation.x = -Math.asin(-rotation[1][2]);
    object.rotation.y = -Math.atan2(rotation[0][2], rotation[2][2]);
    object.rotation.z = Math.atan2(rotation[1][0], rotation[1][1]);


    object.position.x = translation[0];
    object.position.y = translation[1];
    object.position.z = -translation[2];
};


window.onload = onLoad;