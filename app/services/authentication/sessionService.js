const uuidV4 = require('uuid');
const uuid = uuidV4.v4;
const encryptionService = require('../encryption/encryptionService.js');
const sessionConfig = require('../../../configuration/authentication/sessionConfig.js');
const helpers = require('../../library/common/helpers.js')

//Test:DONE
const generateSessionTokenAsync = async function(){
    let sessionUuid = uuid();
    let sessionToken = await encryptionService.encryptStringInputAsync(sessionUuid);
    return sessionToken;
}

//Test: DONE
const sessionIsExpired = function(dateExpiredUTCAsDate ){
    let localeDateNow = new Date();
    //To convert to UTC datetime by subtracting the current Timezone offset
    let utcDate =  helpers.convertLocaleDateToUTCDate(localeDateNow);
    let dateNowUtcAsTime = utcDate.getTime();
    let dateExpiredUtcAsTime = dateExpiredUTCAsDate.getTime();
    if( dateNowUtcAsTime > dateExpiredUtcAsTime){
        return true;
    }
    return false;
}

//test:DONE
const calculateSessionDateExpiry = function(localeDateCreated, expiresInMilliseconds){
    let sessionDate = new Date(localeDateCreated);
    let sessionExpiryInMinutes = expiresInMilliseconds/ sessionConfig.ONE_MINUTE_IN_MILLISECONDS;
    let expirationDateInMinutes = sessionDate.setMinutes( sessionDate.getMinutes() + sessionExpiryInMinutes );
    let expiryDate = sessionDate;
    return expiryDate;
}

const service = Object.freeze({
    generateSessionTokenAsync : generateSessionTokenAsync,
    sessionIsExpired : sessionIsExpired,
    calculateSessionDateExpiry : calculateSessionDateExpiry
});
module.exports = service;