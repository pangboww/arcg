/**
 * Created by bopang on 23/05/15.
 */

var video, canvas, context, imageData, detector, posit;
var renderer;
var scene1, scene2;
var camera1, camera2;
var model, texture;
var board;
var x, y;

var loader = new THREE.ColladaLoader();

function onLoad(){
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.style.display = "none";


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
        updateScenes(markers);

        render();
    }
};

function snapshot(){
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
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

    var light1 = new THREE.PointLight(0xfffff3, 1);
    light1.position.set(-100,400,200);
    scene2.add(light1);
    var light2 = new THREE.PointLight(0xfffff3, 0.3);
    light2.position.set(400,200,200);
    scene2.add(light2);
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
    board = new ChessBoard();
    var object = board.getChessBoard();
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

function choosePiece(){
    x = document.getElementById("x").value;
    y = document.getElementById("y").value;
    var posList = document.getElementById("posList");
    while (posList.firstChild) {
        posList.removeChild(posList.firstChild);
    }
    var moveList = board.pieceCouldMoveTo(x,y);
    if (typeof moveList == 'string'){
        var textNode = document.createTextNode("No Piece Here");
        document.getElementById("posList").appendChild(textNode);
    }
    else if (moveList instanceof Array){
        if (moveList.length > 0){
            var form = document.createElement("form");
            form.setAttribute("id","choices");
            for (var i = 0; i < moveList.length; i++){
                var p = moveList[i];
                var choice = document.createElement("input");
                choice.setAttribute("type","radio");
                choice.setAttribute("name","moveTo");
                choice.setAttribute("x",p.x);
                choice.setAttribute("y",p.y);
                form.appendChild(choice);
                var textNode = document.createTextNode("x: "+ p.x + "  y: " + p.y);
                form.appendChild(textNode);
                var br = document.createElement('br');
                form.appendChild(br);

            }
            var button = document.createElement("button");
            button.setAttribute("type","button");
            button.setAttribute("onclick","movePiece()");
            button.innerHTML = "Move";
            form.appendChild(button);
            posList.appendChild(form);
        }
        else {
            var textNode = document.createTextNode("No Place to move")
            document.getElementById("posList").appendChild(textNode);
        }
    }
}

function movePiece(){
    var choices = document.getElementsByName('moveTo');
    var toX, toY;
    for(var i = 0; i < choices.length; i++){
        if(choices[i].checked){
            toX = choices[i].getAttribute("x");
            toY = choices[i].getAttribute("y");
        }
        board.movePieceTo(x, y, toX, toY);
    }
}


window.onload = onLoad;