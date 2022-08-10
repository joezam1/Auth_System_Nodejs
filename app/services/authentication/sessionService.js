const uuidV4 = require('uuid');
const uuid = uuidV4.v4;
const encryptionService = require('../encryption/encryptionService.js');
const sessionConfig = require('../../../configuration/authentication/sessionConfig.js');

//Test:DONE
let generateSessionTokenAsync = async function(){
    let sessionUuid = uuid();
    let sessionToken = await encryptionService.encryptStringInputAsync(sessionUuid);
    return sessionToken;
}
//Test: DONE
let sessionIsExpired = function(dateExpiredUTCAsDate ){
    let dateNow = new Date();
    //To convert to UTC datetime by subtracting the current Timezone offset
    let utcDate =  new Date(dateNow.getTime() + (dateNow.getTimezoneOffset()*60000));
    let dateNowUtcAsTime = utcDate.getTime();
    let dateExpiredUtcAsTime = dateExpiredUTCAsDate.getTime();
    if( dateNowUtcAsTime > dateExpiredUtcAsTime){
        return true;
    }
    return false;
}
//test:DONE
let getSessionDateExpired = function(dateCreated, expiresInMilliseconds){
    let sessionDate = new Date(dateCreated);
    let sessionExpiryInMinutes = expiresInMilliseconds/ sessionConfig.ONE_MINUTE_IN_MILLISECONDS;
    let expirationDateInMinutes = sessionDate.setMinutes( sessionDate.getMinutes() + sessionExpiryInMinutes );

    return sessionDate;
}

const service ={
    generateSessionTokenAsync : generateSessionTokenAsync,
    sessionIsExpired : sessionIsExpired,
    getSessionDateExpired : getSessionDateExpired
}
module.exports = service;