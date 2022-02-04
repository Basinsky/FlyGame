(function () {      
    var LOCATION_ROOT_URL = Script.resolvePath(".");
    var SEARCH_CLOSE = 20;
    var SEARCH_FAR = 10000;
    var MAX_TIME = 200; // [s]
    var TIME_ACCURACY = 10; // step = 0.1 [s]
    var MS = 1000;
    var STEP = MS / TIME_ACCURACY;
    var MAX_STEP = MAX_TIME * TIME_ACCURACY;
    var LOADING_TIME = 1000;
    var MAX_HIGHSCORE_LENGTH = 18;
    var playerSelected = false;    
    var HighscoreArray =[];    
    var totalWaypointsIDArray = [];
    var visitedWaypoints = [];
    var availableWaypoints = [];    
    var playerName = "Default";
    var playerID;    
    var consolePosition;
    var drawplayerStatusTextId;
    var drawHighScoreTextId;
    var drawplayerTimerTextId;    
    var lastwaypointID;    
    var timer = 0;
    var timerStart = false;
    var timerset= false;        
    var selectsound = SoundCache.getSound(LOCATION_ROOT_URL + "234525__foolboymedia__announcement-begin.wav"); 
    var endsound = SoundCache.getSound(LOCATION_ROOT_URL + "275104__tuudurt__piglevelwin2.mp3");

    this.remotelyCallable = [
        "receiveDataFromWaypoint",
        "receiveDataFromStartButton",
        "receiveDataFromStopButton"
    ];
    
    this.receiveDataFromStartButton = function(id,param) {
        if (!playerSelected) {
            playerName = param[0];
            playerID = param[1];           
            print(JSON.stringify("playerName is: " + playerName));
            print(JSON.stringify("playerID is: " + playerID));    
            playerSelected = true;
            Audio.playSound(selectsound, {
                position: consolePosition,
                volume: 1
            });
            Entities.editEntity(drawplayerStatusTextId, { text: playerName });
            starttimer();            
        }        
    };

    this.receiveDataFromStopButton = function(id,param) {
        var playerStopID = param[1];        
        if (playerSelected) {
            if (playerStopID === playerID) {            
                Script.clearInterval(timerset);            
                Entities.editEntity(drawplayerStatusTextId, { text: "Player: Game Aborted" });
                reset();
                Audio.playSound(selectsound, {
                    position: consolePosition,
                    volume: 1});
            }                   
        }    
    };
    
    this.receiveDataFromWaypoint = function(id,param) {
        var checkAvatar1 = param[1];
        print(JSON.stringify("received playerID is: " + checkAvatar1));
        print(JSON.stringify("check: " + playerID));
        if (checkAvatar1 === playerID && playerSelected === true) {            
            lastwaypointID = param[3];            
            checkWaypoints(lastwaypointID);          
        }        
    };
    
    this.preload = function (entityID) {
        consolePosition = Entities.getEntityProperties(entityID,"position").position;            
    };

    function getTextEntityIDs() {
        var entities = Entities.findEntities(consolePosition, SEARCH_CLOSE);        
        for (var i in entities) {
            var props = Entities.getEntityProperties(entities[i]);                  
            if (props.name === "BasinskyFlygameStatus") {
                drawplayerStatusTextId = props.id;
                print("found status");
            }
            if (props.name === "BasinskyFlygameHighscore") {
                drawHighScoreTextId = props.id;
                print("found score");
            }
            if (props.name === "BasinskyFlygameTimer") {
                drawplayerTimerTextId = props.id;
                print("found timer");
            }
        }    
    }

    function getWaypointsIDs() {  
        totalWaypointsIDArray = [];
        visitedWaypoints = [];
        availableWaypoints = [];
        var entities = Entities.findEntities(consolePosition, SEARCH_FAR);        
        for (var i in entities) {
            var props = Entities.getEntityProperties(entities[i]);                                  
            if (props.name === "BasinskyFlygameWayPointDetector") {
                totalWaypointsIDArray.push(props.id);
                availableWaypoints.push(props.id);
            }               
        }    
    }
    
    function starttimer() {         
        if (!timerStart) {
            timerset = Script.setInterval(function () {
                timer = timer + 1;
                if (timer % 1 === 0) {
                    Entities.editEntity(drawplayerTimerTextId, { text: "     " });    
                    Entities.editEntity(drawplayerTimerTextId, { text: timer/TIME_ACCURACY });
                }
            }, STEP);
            timerStart = true;
        }
        if (timer > MAX_STEP) {
            Script.clearInterval(timerset);          
            print("Stop timer it is taking too long");            
            reset();       
        }        
    }
    
    function checkWaypoints(checkID) {
        if (visitedWaypoints.indexOf(checkID) === -1) {
            print("did not visit this one");
            if (totalWaypointsIDArray.indexOf(checkID) !== -1) {
                print("this one is still available");
                var child = Entities.getChildrenIDs(checkID);
                var childMaterial = Entities.getChildrenIDs(child[0]);
                Entities.editEntity(childMaterial[0],{ materialData: JSON.stringify({
                    materialVersion: 1,
                    materials: {                    
                        albedo: [0, 0, 1],
                        albedoMap: "",            
                        metallic: 0.5,
                        metallicMap: LOCATION_ROOT_URL + "noise.png",
                        roughness: 0.8,
                        roughnessMap: LOCATION_ROOT_URL + "noise.png", 
                        emissive: [0, 0, 1]               
                    }
                })
                });
                var detectionPosition = Entities.getEntityProperties(checkID,"position").position;
                Audio.playSound(selectsound, {
                    position: detectionPosition,
                    volume: 1});
                availableWaypoints.pop(checkID);
                visitedWaypoints.push(checkID);           
            }
        }   
            
        if (visitedWaypoints.length >= totalWaypointsIDArray.length) {           
            setHighscores();                 
            Audio.playSound(endsound, {
                position: consolePosition,
                volume: 1});
        }        
    }    
    
    function setHighscores() {
        Script.clearInterval(timerset);        
        var highScore = {name: playerName,time: timer/ TIME_ACCURACY};
        HighscoreArray.push(highScore);    
        HighscoreArray.sort(function(a, b) {
            return a.time - b.time;
        });       
    
        var highscoreText = "";       
        Entities.editEntity(drawHighScoreTextId, { text: highscoreText});       
        highscoreText = "      High Scores        \n";

        if ( HighscoreArray.length > MAX_HIGHSCORE_LENGTH) {
            HighscoreArray.length = MAX_HIGHSCORE_LENGTH;
        }        
               
        for (var i = 0; i < HighscoreArray.length; i++) {    
            highscoreText = highscoreText+(i+1)+". : "+HighscoreArray[i].name+"   "+HighscoreArray[i].time+"\n";            
        }    
        Entities.editEntity(drawHighScoreTextId, { text: highscoreText});          
        reset();        
    }
    
    function reset() {       
        for (var j in totalWaypointsIDArray) {
            var child = Entities.getChildrenIDs(totalWaypointsIDArray[j]);
            var childMaterial = Entities.getChildrenIDs(child[0]);
            Entities.editEntity(childMaterial[0],{ materialData: JSON.stringify({
                materialVersion: 1,
                materials: {                    
                    albedo: [0.8, 0.8, 0.8],
                    albedoMap: "",            
                    metallic: 0.5,
                    metallicMap: LOCATION_ROOT_URL + "noise.png",
                    roughness: 0.8,
                    roughnessMap: LOCATION_ROOT_URL + "noise.png", 
                    emissive: [0.1, 0.1, 0.1]               
                }
            })
            });
        }      
        getWaypointsIDs();
        playerSelected = false;
        timerStart = false;
        timer = 0;       
    }

    Script.scriptEnding.connect(function () {       
        Script.stop();    
    });  
    
    Script.setTimeout(function () {
        getTextEntityIDs();
        getWaypointsIDs();
    }, LOADING_TIME);           
});