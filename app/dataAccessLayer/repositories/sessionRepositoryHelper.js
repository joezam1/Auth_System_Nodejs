const helpers = require('../../library/common/helpers.js');
const sessionService = require('../../services/authentication/sessionService.js');
const dbContext = require('../mysqlDataStore/context/dbContext.js');


let context = null;

//Test: DONE
const getSessionDtoModelMappedFromDomain = function(sessionDomainModel){
    let dateNow = new Date();
    let utcDateCreated = helpers.convertLocaleDateToUTCFormatForDatabase(dateNow);
    let expiryInMilliseconds = sessionDomainModel.getExpiryInMilliseconds();
    let dateExpiredCalculation = sessionService.calculatSessionDateExpiry(dateNow,expiryInMilliseconds );

    let utcDateExpiredFormatted = helpers.convertLocaleDateToUTCFormatForDatabase(dateExpiredCalculation);
    let sessionStatus = (sessionDomainModel.getSessionStatusIsActive());
    let resolvedSessionStatus = (sessionStatus === true)
    ? sessionDomainModel.getSessionStatusIsActive()
    : sessionDomainModel.setSessionStatusIsActive(true); sessionDomainModel.getSessionStatusIsActive() ;

    let _sessionDto = new context.sessionDtoModel();
    _sessionDto.rawAttributes.SessionId.value = sessionDomainModel.getSessionId();
    _sessionDto.rawAttributes.SessionId.type.key = _sessionDto.rawAttributes.SessionId.type.key.toString();
    _sessionDto.rawAttributes.UserId.value = sessionDomainModel.getUserId();
    _sessionDto.rawAttributes.UserId.type.key = _sessionDto.rawAttributes.UserId.type.key.toString();
    _sessionDto.rawAttributes.SessionToken.value = sessionDomainModel.getSessionToken();
    _sessionDto.rawAttributes.SessionToken.type.key = _sessionDto.rawAttributes.SessionToken.type.key;
    _sessionDto.rawAttributes.Expires.value = expiryInMilliseconds;
    _sessionDto.rawAttributes.Expires.type.key = _sessionDto.rawAttributes.Expires.type.key;
    _sessionDto.rawAttributes.Data.value = sessionDomainModel.getData();
    _sessionDto.rawAttributes.Data.type.key = _sessionDto.rawAttributes.Data.type.key;
    _sessionDto.rawAttributes.IsActive.value = resolvedSessionStatus;
    _sessionDto.rawAttributes.IsActive.type.key = _sessionDto.rawAttributes.IsActive.type.key;
    _sessionDto.rawAttributes.UTCDateCreated.value = utcDateCreated;
    _sessionDto.rawAttributes.UTCDateCreated.type.key =  _sessionDto.rawAttributes.UTCDateCreated.type.key.toString();
    _sessionDto.rawAttributes.UTCDateExpired.value = utcDateExpiredFormatted;
    _sessionDto.rawAttributes.UTCDateExpired.type.key =  _sessionDto.rawAttributes.UTCDateExpired.type.key.toString();

    let clonedAttributes = JSON.parse(JSON.stringify(_sessionDto.rawAttributes));
    return clonedAttributes;
}

//Test: DONE
const getSessionsDtoModelMappedFromDatabase = function(databaseResultArray) {
    let allSessionsDtoModels = [];
    for (let a = 0; a < databaseResultArray.length; a++) {
        let sessionDatabase = databaseResultArray[a];
        console.log('sessionDatabase', sessionDatabase);
        let _sessionDtoModel =new context.sessionDtoModel();
        console.log('_sessionDtoModel', _sessionDtoModel);

        _sessionDtoModel.rawAttributes.SessionId.value = sessionDatabase.SessionId;
        _sessionDtoModel.rawAttributes.UserId.value = sessionDatabase.UserId;
        _sessionDtoModel.rawAttributes.SessionToken.value = sessionDatabase.SessionToken;
        _sessionDtoModel.rawAttributes.Expires.value = sessionDatabase.Expires;
        _sessionDtoModel.rawAttributes.Data.value = sessionDatabase.Data;
        _sessionDtoModel.rawAttributes.IsActive.value = (sessionDatabase.IsActive !== 0);

        _sessionDtoModel.rawAttributes.UTCDateCreated.value = sessionDatabase.UTCDateCreated;
        _sessionDtoModel.rawAttributes.UTCDateExpired.value = sessionDatabase.UTCDateExpired;

        let clonedAttributes = JSON.parse(JSON.stringify(_sessionDtoModel.rawAttributes));
        //NOTE: JSON Parse, converts Date values to Locale, We re-insert the original UTD Dates
        clonedAttributes.UTCDateCreated.value = sessionDatabase.UTCDateCreated;
        clonedAttributes.UTCDateExpired.value = sessionDatabase.UTCDateExpired;
        allSessionsDtoModels.push(clonedAttributes);
    }

    return allSessionsDtoModels;
}

//Test: DONE
const getSessionActivityDtoModelMappedFromDomain = function(sessionActivityDomainModel){
    let dateNow = new Date();
    let utcDateNow = helpers.convertLocaleDateToUTCFormatForDatabase(dateNow);

    let _sessionActivityDto = new context.sessionActivityDtoModel();
    _sessionActivityDto.rawAttributes.SessionActivityId.value = sessionActivityDomainModel.getSessionActivityId();
    _sessionActivityDto.rawAttributes.SessionActivityId.type.key = _sessionActivityDto.rawAttributes.SessionActivityId.type.key.toString();

    _sessionActivityDto.rawAttributes.UserId.value = sessionActivityDomainModel.getUserId();
    _sessionActivityDto.rawAttributes.UserId.type.key = _sessionActivityDto.rawAttributes.UserId.type.key.toString();


    _sessionActivityDto.rawAttributes.GeoLocation.value = sessionActivityDomainModel.getGeolocation();
    _sessionActivityDto.rawAttributes.GeoLocation.type.key = _sessionActivityDto.rawAttributes.GeoLocation.type.key;

    _sessionActivityDto.rawAttributes.Device.value = sessionActivityDomainModel.getDevice();
    _sessionActivityDto.rawAttributes.Device.type.key = _sessionActivityDto.rawAttributes.Device.type.key;

    _sessionActivityDto.rawAttributes.UserAgent.value = sessionActivityDomainModel.getUserAgent();
    _sessionActivityDto.rawAttributes.UserAgent.type.key = _sessionActivityDto.rawAttributes.UserAgent.type.key;

    _sessionActivityDto.rawAttributes.UTCLoginDate.value = utcDateNow;
    _sessionActivityDto.rawAttributes.UTCLoginDate.type.key =  _sessionActivityDto.rawAttributes.UTCLoginDate.type.key.toString();

    _sessionActivityDto.rawAttributes.UTCLogoutDate.value = utcDateNow;
    _sessionActivityDto.rawAttributes.UTCLogoutDate.type.key =  _sessionActivityDto.rawAttributes.UTCLogoutDate.type.key.toString();

    let clonedAttributes = JSON.parse(JSON.stringify(_sessionActivityDto.rawAttributes));
    return clonedAttributes;
}

//Test: DONE
const getSessionActitiviesDtoModelMappedFromDatabase = function(databaseResultArray) {
    let allSessionActivitiesDtoModels = [];
    for (let a = 0; a < databaseResultArray.length; a++) {
        let sessionActivityDatabase = databaseResultArray[a];
        console.log('sessionActivityDatabase', sessionActivityDatabase);
        let _sessionActivityDtoModel = new context.sessionActivityDtoModel();
        console.log('_sessionActivityDtoModel', _sessionActivityDtoModel);

        _sessionActivityDtoModel.rawAttributes.SessionActivityId.value = sessionActivityDatabase.SessionActivityId;
        _sessionActivityDtoModel.rawAttributes.UserId.value = sessionActivityDatabase.UserId;
        _sessionActivityDtoModel.rawAttributes.GeoLocation.value = sessionActivityDatabase.GeoLocation;
        _sessionActivityDtoModel.rawAttributes.Device.value = sessionActivityDatabase.Device;
        _sessionActivityDtoModel.rawAttributes.UserAgent.value = sessionActivityDatabase.UserAgent;
        _sessionActivityDtoModel.rawAttributes.UTCLoginDate.value = sessionActivityDatabase.UTCLoginDate;
        _sessionActivityDtoModel.rawAttributes.UTCLogoutDate.value = sessionActivityDatabase.UTCLogoutDate;

        let clonedAttributes = JSON.parse(JSON.stringify(_sessionActivityDtoModel.rawAttributes));

        allSessionActivitiesDtoModels.push(clonedAttributes);
    }

    return allSessionActivitiesDtoModels;
}


onInit();
const service = Object.freeze({
    getSessionDtoModelMappedFromDomain : getSessionDtoModelMappedFromDomain,
    getSessionsDtoModelMappedFromDatabase : getSessionsDtoModelMappedFromDatabase,
    getSessionActivityDtoModelMappedFromDomain : getSessionActivityDtoModelMappedFromDomain,
    getSessionActitiviesDtoModelMappedFromDatabase : getSessionActitiviesDtoModelMappedFromDatabase
});

module.exports = service;



//#REGION Private Functions
function onInit(){
    context = dbContext.getSequelizeContext();
}
//#ENDREGION Private Functions