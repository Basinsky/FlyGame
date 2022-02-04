var LOCATION_ROOT_URL = Script.resolvePath(".");
var rot = Quat.fromPitchYawRollDegrees(0, 180, 0);
var AMOUNT_WAYPOINTS = 10;
var consolePosition;
var consoleRotation;

AMOUNT_WAYPOINTS = Window.prompt("How many rings?","");

var consoleID = Entities.addEntity({
    type: "Model",
    modelURL: LOCATION_ROOT_URL + "FlygameStart.fbx?" + Date.now(),
    shapeType: "static-mesh",
    name: "BasinskyFlygameConsole",
    serverScripts: LOCATION_ROOT_URL + "FlygameServer.js?" + Date.now(),
    script: LOCATION_ROOT_URL + "FlygameClient.js?" + Date.now(),
    description: "",
    color: { red: 0, green: 0, blue: 50 },
    position: Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, { x: 0, y: 2, z: -5 })),
    rotation: Quat.multiply(MyAvatar.orientation, Quat.fromPitchYawRollDegrees(0, -90, 0 )),
    dimensions: { x: 7, y: 7, z: 7 },
    lifetime: -1,
    userData: "{ \"grabbableKey\": { \"grabbable\": false} }"
});

consolePosition = Entities.getEntityProperties(consoleID, "position").position;
consoleRotation = Entities.getEntityProperties(consoleID, "rotation").rotation;

print(JSON.stringify("CreatingButton..."));

rot = Quat.fromPitchYawRollDegrees(0, 0, -60);
var startButton = Entities.addEntity({
    type: "Model",
    name: "BasinskyFlyGameStart",
    modelURL: LOCATION_ROOT_URL + "FlyGameStartButton.fbx?" + Date.now(),
    parentID: consoleID,
    description: "",
    collisionless: false,
    localPosition: { x: -2.47, y: -1.7, z: 0.2 },
    localRotation: rot,
    dimensions: { x: 0.2, y: 0.02, z: 0.2 },
    lifetime: -1,
    userData: "{ \"grabbableKey\": { \"grabbable\": false, \"triggerable\": true}}"
});

var buttonprops = Entities.getEntityProperties(startButton);
var buttonposition = buttonprops.position;

print(JSON.stringify("CreatingButton..."));
rot = Quat.fromPitchYawRollDegrees(0, 0, -60);

var stopButton = Entities.addEntity({
    type: "Model",
    name: "BasinskyFlyGameStop",
    modelURL: LOCATION_ROOT_URL + "FlyGameStopButton.fbx?" + Date.now(),
    parentID: consoleID,
    description: "",
    collisionless: false,
    localPosition: { x: -2.47, y: -1.7, z: -0.2 },
    localRotation: rot,
    dimensions: { x: 0.2, y: 0.02, z: 0.2 },
    lifetime: -1,
    userData: "{ \"grabbableKey\": { \"grabbable\": false, \"triggerable\": true}}"
});

rot = Quat.fromPitchYawRollDegrees(0, 90, 0);
var highscoreText = "";
var drawHighScoreTextId = Entities.addEntity({
    type: "Text",
    name: "BasinskyFlygameHighscore",
    text: highscoreText,
    lineHeight: 0.15,
    parentID: consoleID,
    localPosition: { x: -2.65, y: 1.5, z: 0 },
    localRotation: rot,
    dimensions: { x: 1.4, y: 2.8, z: 0.2 },
    lifetime: -1,
    backgroundColor: { r: 12, g: 50, b: 133 },
    textColor: { r: 255, g: 255, b: 255 },
    userData: "{ \"grabbableKey\": { \"grabbable\": false, \"triggerable\": true}}"
});

var drawplayerStatusTextId = Entities.addEntity({
    type: "Text",
    name: "BasinskyFlygameStatus",
    text: "Player:",
    lineHeight: 0.1,
    parentID: consoleID,
    localPosition: { x: -2.65, y: -0.1, z: 0.2 },
    localRotation: rot,
    dimensions: { x: 1, y: 0.15, z: 0.2 },
    lifetime: -1,
    backgroundColor: { r: 12, g: 50, b: 133 },
    textColor: { r: 255, g: 255, b: 255 },
    userData: "{ \"grabbableKey\": { \"grabbable\": false, \"triggerable\": true}}"
});

var drawplayerTimerTextId = Entities.addEntity({
    type: "Text",
    name: "BasinskyFlygameTimer",
    text: "",
    lineHeight: 0.1,
    parentID: consoleID,
    localPosition: { x: -2.65, y: -0.1, z: -0.5 },
    localRotation: rot,
    dimensions: { x: 0.25, y: 0.15, z: 0.2 },
    lifetime: -1,
    backgroundColor: { r: 12, g: 50, b: 133 },
    textColor: { r: 255, g: 255, b: 255 },
    userData: "{ \"grabbableKey\": { \"grabbable\": false, \"triggerable\": true}}"
});

for (var i = 0; i < AMOUNT_WAYPOINTS; i++) {
    var waypointID = Entities.addEntity({
        type: "Model",
        modelURL: LOCATION_ROOT_URL + "Waypoint.fbx?" + Date.now(),
        shapeType: "static-mesh",
        // parentID:consoleID,
        name: "BasinskyFlygameWayPoint",
        description: "",
        color: { red: 0, green: 0, blue: 0 },
        position: Vec3.sum(consolePosition, Vec3.multiplyQbyV(consoleRotation, { x: (-10 * i) - 10, y: 5, z: 0 })),
        rotation: consoleRotation,
        dimensions: { x: 2, y: 24, z: 16 },
        lifetime: -1,
        userData: "{ \"grabbableKey\": { \"grabbable\": false, \"triggerable\": true}}"
    });

    var materialID = Entities.addEntity({
        type: "Material",
        parentID: waypointID,
        name: "BasinskyMaterialWayPoint",
        materialURL: "materialData",
        priority: 1,
        materialData: JSON.stringify({
            materialVersion: 1,
            materials: {
                // Value overrides entity's "color" property.
                albedo: [0, 0, 0],
                albedoMap: "",
                metallic: 0.5,
                metallicMap: LOCATION_ROOT_URL + "noise.png",
                roughness: 0.8,
                roughnessMap: LOCATION_ROOT_URL + "noise.png"
            }
        })
    });

    var waypointdetector = Entities.addEntity({
        type: "Sphere",
        parentID: waypointID,
        collisionless: true,
        name: "BasinskyFlygameWayPointDetector",
        description: "",
        visible: true,
        script: LOCATION_ROOT_URL + "FlyGameStartWaypointDetector.js?" + Date.now(),
        color: { red: 255, green: 0, blue: 0 },
        localPosition: { x: 0, y: 3, z: 0 },
        dimensions: { x: 1, y: 12, z: 12 },
        lifetime: -1,
        userData: "{ \"grabbableKey\": { \"grabbable\": false, \"triggerable\": true}}"
    });

    materialID = Entities.addEntity({
        type: "Material",
        parentID: waypointdetector,
        name: "BasinskyMaterialWayPointDetector",
        materialURL: "materialData",
        priority: 1,
        materialData: JSON.stringify({
            materialVersion: 1,
            materials: {
                // Value overrides entity's "color" property.
                albedo: [0, 0, 1.0],
                albedoMap: "",
                metallic: 0.5,
                metallicMap: LOCATION_ROOT_URL + "noise.png",
                roughness: 0.1,
                roughnessMap: LOCATION_ROOT_URL + "noise.png",
                emissive: 0,
                emissiveMap: "",
                opacity: 0.3,
                opacityMap: "",
                unlit: false,
                normalMap: "",
                scattering: 0,
                scatteringMap: "",
                occlusionMap: ""
            }
        })
    });

    var torus = Entities.addEntity({
        type: "Model",
        modelURL: LOCATION_ROOT_URL + "detectiontorus.fbx?" + Date.now(),
        shapeType: "static-mesh",
        parentID: waypointdetector,
        name: "BasinskyDetectiontorus",
        description: "",
        collisioness: true,
        color: { red: 200, green: 200, blue: 200 },
        localPosition: { x: 0, y: 1, z: 0 },
        dimensions: { x: 2, y: 11, z: 11 },
        lifetime: -1,
        userData: "{ \"grabbableKey\": { \"grabbable\": false, \"triggerable\": true}}"
    });

    materialID = Entities.addEntity({
        type: "Material",
        parentID: torus,
        serverScripts: LOCATION_ROOT_URL + "empty.js",
        name: "BasinskyMaterialTorus",
        materialURL: "materialData",
        priority: 1,
        materialData: JSON.stringify({
            materialVersion: 1,
            materials: {
                // Value overrides entity's "color" property.
                albedo: [0.8, 0.8, 0.8],
                albedoMap: "",
                metallic: 0.5,
                metallicMap: LOCATION_ROOT_URL + "noise.png",
                roughness: 0.8,
                roughnessMap: LOCATION_ROOT_URL + "noise.png"
            }
        })
    });
}
Script.stop();
