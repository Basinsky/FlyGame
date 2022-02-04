
(function () {
    var reset = false;
    var RESET_TIME = 1000;   
    var consoleID; 
    var avatarName;
    var avatarPosition;

    this.preload = function (entityID) {
        consoleID = entityID;          
    };

    Script.setInterval(function () {
        reset = true;    
    }, RESET_TIME);

    function sendStart() {        
        avatarName = MyAvatar.displayName;
        avatarPosition = MyAvatar.position;      
        if (consoleID) {
            Entities.callEntityServerMethod(             
                consoleID, 
                "receiveDataFromStartButton",
                [avatarName,MyAvatar.sessionUUID,avatarPosition]
            );
            print(JSON.stringify("Try to send ..... " + avatarName));
        }    
    }

    function sendStop() {
        avatarName = MyAvatar.displayName;
        avatarPosition = MyAvatar.position;      
        if (consoleID) {
            Entities.callEntityServerMethod(             
                consoleID, 
                "receiveDataFromStopButton",
                [avatarName,MyAvatar.sessionUUID,avatarPosition]
            );
            print(JSON.stringify("Try to send ..... " + avatarName));
        }    
    }

    Entities.mousePressOnEntity.connect(function (clickedEntity, event) {
        // Signal is triggered for all entities.        
        var props = Entities.getEntityProperties(clickedEntity);
        if (reset === true) {
            if (props.name === "BasinskyFlyGameStart") {
                sendStart();
                reset = false;
            }
            if (props.name === "BasinskyFlyGameStop") {
                sendStop();
                reset = false;
            }
        }
    });
});