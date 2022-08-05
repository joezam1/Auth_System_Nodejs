const session = require('./session.js');
const cookieModel = require('./cookie');
const sessionConfig = require('../../configuration/authentication/sessionConfig.js');
const uuidV4 = require('uuid');
const uuid = uuidV4.v4;

const createSessionModel = function(userId, sessionToken, data, expirationTimeMilliseconds){
    let sessionUuid = uuid();
    let _sessionModel  = new session();
    _sessionModel.setSessionId(sessionUuid);
    _sessionModel.setUserId(userId);
    _sessionModel.setSessionToken(sessionToken);
    _sessionModel.setData(data);
    _sessionModel.setExpiryInMilliseconds(expirationTimeMilliseconds);
    _sessionModel.setSessionStatusIsActive(true);

    return _sessionModel;
}


function createCookieObj(sessionToken){
    let defaultPath = '/';
    let _cookieModel = new cookieModel();
    _cookieModel.setName(sessionConfig.SESSION_NAME);
    _cookieModel.setValue(sessionToken);
    _cookieModel.setProperties(defaultPath, sessionConfig.SESSION_EXPIRATION_TIME_IN_MILLISECONDS,true);
    let cookieObject = _cookieModel.getCookieObject();
    return cookieObject;
}



const service = {
    createSessionModel : createSessionModel,
    createCookieObj : createCookieObj
}

module.exports = service;