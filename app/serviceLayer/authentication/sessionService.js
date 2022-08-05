const uuidV4 = require('uuid');
const uuid = uuidV4.v4;
const encryptionService = require('../encryption/encryptionService.js');
const sessionConfig = require('../../../configuration/authentication/sessionConfig.js');


let generateSessionTokenAsync = async function(){

    let sessionUuid = uuid();
    let sessionToken = await encryptionService.encryptStringInputAsync(sessionUuid);
    return sessionToken;
}

function sessionIsExpired(sessionDtoModel){
    let dateNow = new Date();
    let dateNowUtc = dateNow.toISOString();
    let sessionDateCreatedUtc = new Date(sessionDtoModel.UTCDateCreated.value);
    let sessionExpiryInSeconds = sessionDtoModel.Expires.value / sessionConfig.ONE_SECOND_IN_MILLISECONDS;
    let sessionExpiryInMinutes = sessionDtoModel.Expires.value / sessionConfig.ONE_MINUTE_IN_MILLISECONDS;
    let expirationDateUtcInMinutes = sessionDateCreatedUtc.setMinutes( sessionDateCreatedUtc.getMinutes() + sessionExpiryInMinutes );
    let expirationDateUTCAsDate = sessionDateCreatedUtc.toISOString();
    if(dateNowUtc > expirationDateUTCAsDate){
        return true;
    }
    return false;
}

const service ={
    generateSessionTokenAsync : generateSessionTokenAsync,
    sessionIsExpired : sessionIsExpired
}
module.exports = service;