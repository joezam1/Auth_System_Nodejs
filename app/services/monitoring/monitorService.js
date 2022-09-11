const monitorConfig = require('../../../configuration/monitoring/monitorConfig.js');
const helpers = require('../../library/common/helpers.js');



const monitorService = (function(){

    const capture = function( ){

        try{
            let systemIsActive = monitorConfig.GLOBAL_SWITCH;
            let argumentsArray = helpers.createPropertiesArrayFromObjectProperties(arguments);
            let singleCapture = (argumentsArray.length>0) ? argumentsArray[0] : false;
            let singleRecordingIsActive = (typeof(singleCapture) === 'boolean' && singleCapture === true )
            switch(systemIsActive){

                case true:
                console.log(arguments);
                return true;

                case false:
                    if(singleRecordingIsActive){
                        console.log(arguments);
                        return true;
                    }
                return false;
            }
        }
        catch(err){
            let errorMessage = 'There is an Error:';
            let error = new Error(err);
            console.log(errorMessage);
            console.log(error);
            return false;
        }
    }

    const constructor = function(){
        return {
            capture: capture
        }
    }
    return constructor();
})();

module.exports = monitorService;
