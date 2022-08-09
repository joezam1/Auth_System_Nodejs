const uuidV4 = require('uuid');
const uuid = uuidV4.v4;
const encryptionService = require('../encryption/encryptionService.js');
const sessionConfig = require('../../../configuration/authentication/sessionConfig.js');


let generateSessionTokenAsync = async function(){
    let sessionUuid = uuid();
    let sessionToken = await encryptionService.encryptStringInputAsync(sessionUuid);
    return sessionToken;
}

function sessionIsExpired(utcDateExpired){
    let dateNow = new Date();
    let dateNowUtc = dateNow.toISOString();
    let expirationDateUTCAsDate = new Date(utcDateExpired);
    if(dateNowUtc > expirationDateUTCAsDate){
        return true;
    }
    return false;
}

function getSessionDateExpired(dateCreated, expiresInMilliseconds){
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