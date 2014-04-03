var camera;
var box;

var dx=0.0;
var dy=0.0;
var dz=0.0;
var drifty=0.0;
var caly=0.00001;

window.updateData = function(data) {
    var gyroy=data.gyro.y/100000;
    var diffy=gyroy-drifty+caly;

    dy+=diffy;

    drifty=(gyroy+drifty*9)/10;

    dx+=data.gyro.x/1000000;
    dz+=data.gyro.z/1000000;

    box.rotation.y-=dy;

    box.rotation.x-=dx;
    box.rotation.z-=dz;

//    box.rotation.x*=0.99;
//    box.rotation.z*=0.99;

    box.rotation.y+=box.rotation.x/10;

    box.locallyTranslate(new BABYLON.Vector3(0,0,1));

//    dy*=0.9;
    dx*=0.9;
    dz*=0.9;

//    camera.alpha+=dalpha;

//    camera.locallyTranslate(new BABYLON.Vector3(-1, 0, 0));
//    var pos=box.getPositionExpressedInLocalSpace();

//    camera.position=new BABYLON.Vector3(pos.x, pos.y, pos.z-200);
//    camera.target=box;
//    camera.rotation.x=box.rotation.x;
//    camera.rotation.y=box.rotation.y;
//    camera.rotation.z=box.rotation.z;

    document.getElementById("p1").innerText="drifty: "+drifty+", dy: "+dy+", diffy: "+diffy;
    document.getElementById("p2").innerText=JSON.stringify(box.rotation, null, 2);
};

window.onload = function(){
    var canvas = document.getElementById("canvas");
    var sceneData = document.getElementById("scene").innerText;

    if ( !canvas ) {
        console.error("Canvas not found!");
    }

    if (!BABYLON.Engine.isSupported()) {
        throw "Browser not supported";
    }

    // Babylon
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);

    var xhr=new XMLHttpRequest();
    xhr.open("GET", "scene.babylon", true);
    xhr.onload = function(d) {
        if ( this.status != 200 ) {
            throw "Failed to load scene data";
        }
        var success=BABYLON.SceneLoader._getPluginForFilename("scene.babylon").load(scene, this.response, "");
        if ( !success ) {
            throw "Failed to load scene from data";
        }

        var light1 = new BABYLON.PointLight("Omni1", new BABYLON.Vector3(0, 30, 30), scene);
        var light2 = new BABYLON.HemisphericLight("Omni2", new BABYLON.Vector3(0, -20, -10), scene);

//        box = BABYLON.Mesh.CreateBox("Box", 20.0, scene);
//        box.position = new BABYLON.Vector3(0, 20, 0);
//        var matBox = new BABYLON.StandardMaterial("textureBox", scene);
//        matBox.diffuseColor=new BABYLON.Color3(0.8, 0.5, 1);
//        box.material=matBox;

        //Adding of the Arc Rotate Camera
        camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, 0.8, 20, new BABYLON.Vector3(0,0,0), scene);
//        camera.parent=box;

//        var torus = BABYLON.Mesh.CreateTorus("torus", 5, 1, 20, scene, false);
//        torus.position=new BABYLON.Vector3(0, 12, 0);

//        var hughsSphere= BABYLON.Mesh.CreateSphere("hugh", 20, 20, scene);
//        hughsSphere.position= new BABYLON.Vector3(0,5,0);
//        var material1 = new BABYLON.StandardMaterial("texture1", scene);
//        material1.diffuseColor=new BABYLON.Color3(0.5, 0.5, 1);
//        hughsSphere.material=material1;
//        hughsSphere.alpha=0.5;

//        var floor= BABYLON.Mesh.CreateGround("Floor", 400, 600, 10, scene);
//        var material2 = new BABYLON.StandardMaterial("texture2", scene);
//        material2.diffuseColor=new BABYLON.Color3(0.5, 1, 0.5);
//        floor.material=material2;

        scene.activeCamera.attachControl(canvas);

        console.log("Running render loop");

        // Once the scene is loaded, just register a render loop to render it
        engine.runRenderLoop(function () {
            scene.render();
        });
    };
    xhr.send();

    // Resize
    window.addEventListener("resize", function () {
        engine.resize();
    });
};