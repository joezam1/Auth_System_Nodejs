const envConfig = require('../../configuration/environment/envConfig.js');
const environmentDescription = require('../environment/environmentDescription.js');
const notificationService = require('../../app/serviceLayer/notifications/notificationService.js');

const whitelistRemoteOrigins = ['http://localhost:8080']

const configuration = {
    HTTP_PORT: 5500,
    HTTPS_PORT: 5443,
    corsOptions:{
        origin: function(origin, callback){
            resolveOriginWhiteListing(origin,callback);
        }
    }
}
const service = {
    configuration : configuration,
    whitelistRemoteOrigins : whitelistRemoteOrigins
}

module.exports = service;

//#REGION Private functions
function resolveOriginWhiteListing(origin, callback){
    var environment = envConfig.NODE_ENV;
    console.log('resolveOriginWhiteListing-origin',origin);
    console.log('resolveOriginWhiteListing-environment', environment);
    switch(environment){

        case environmentDescription.DEVELOPMENT:
            if(origin === undefined){
                //NOTE: Usage for development with POSTMAN
                callback(null, true);
                break;
            }
            whitelistOrigin(origin, callback);
            break;

        case environmentDescription.PRODUCTION:
            whitelistOrigin(origin, callback);
            break;

    }
}

function whitelistOrigin(origin, callback){
    if(whitelistRemoteOrigins.indexOf(origin) === -1){
        var msg = notificationService.corsErrorNotification;
        var corsError = new Error(msg);
        callback(corsError);
        return;
    }else{
        callback(null, true);
    }
}
//#ENDREGION Private functions