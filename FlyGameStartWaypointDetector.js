(function () {         
    var consoleID;   
    var avatarName;    
    var props;
    var myPosition;    
    var consoleFound = false;
    var myName = "";
    var myID;
    var SEARCH_RADIUS = 10000;
    

    this.preload = function (entityID) {
        this.entityID = entityID;
        myID = entityID;     
        myPosition = Entities.getEntityProperties(this.entityID, 'position').position;
        myName = Entities.getEntityProperties(this.entityID, 'name').name;
    };         
   
    function findConsole() {
        var entities = Entities.findEntities(myPosition, SEARCH_RADIUS);
        for (var i in entities) {
            props = Entities.getEntityProperties(entities[i]);                  
            if (props.name === "BasinskyFlygameConsole") {
                consoleID = props.id;
                print(JSON.stringify("Found Console"+consoleID));
                consoleFound =true;                     
            }
        }        
    }
    
    function sendDataToConsole() {        
        avatarName = MyAvatar.displayName;      
        if (consoleID) {
            Entities.callEntityServerMethod(             
                consoleID, 
                "receiveDataFromWaypoint",
                [avatarName,MyAvatar.sessionUUID,myName,myID]
            );
            print(JSON.stringify("Try to send ..... " + avatarName + " + " + myName));
        }    
    }

    function waypointEntered() {        
        if (!consoleFound) {           
            findConsole();        
        }
        sendDataToConsole();       
    
    }
    this.enterEntity = function(entityID) {       
        waypointEntered(entityID);
    }; 
});