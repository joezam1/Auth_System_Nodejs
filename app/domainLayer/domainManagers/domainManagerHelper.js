const session = require('../domainModels/session.js');
const cookie = require('../domainModels/cookie.js');
const userRole = require('../domainModels/userRole.js');
const register = require('../domainModels/register.js');
const sessionActivity = require('../domainModels/sessionActivity.js');
const sessionConfig = require('../../../configuration/authentication/sessionConfig.js');
const uuidV4 = require('uuid');
const uuid = uuidV4.v4;
const helpers = require('../../library/common/helpers.js');

//Test: DONE
const createUserRoleModel = function(userId, roleId){
    let _userRoleInfo = new userRole();
    let userRoleUuid = uuid();
    _userRoleInfo.setUserRoleId(userRoleUuid);
    _userRoleInfo.setUserId(userId);
    _userRoleInfo.setRoleId(roleId);

    return _userRoleInfo;
}
//Test: DONE
const createRegisterModel = function(userId){
    let _registerInfo = new register();
    let registerUuid = uuid();
    _registerInfo.setRegisterId(registerUuid);
    _registerInfo.setUserId(userId);
    if(_registerInfo.getRegisterStatusIsActive() === false){
        _registerInfo.setRegisterIsActive(true);
    }

    return _registerInfo
}
//Test: DONE
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

//Test: DONE
const createSessionActivityModel = function(userId, geoLocationInfo, deviceInfo, userAgentInfo ){
    let sessionActivityUuid = uuid();
    let geoLocation = helpers.convertToStringOrStringifyForDataStorage(geoLocationInfo);
    let device = helpers.convertToStringOrStringifyForDataStorage(deviceInfo);
    let userAgent = helpers.convertToStringOrStringifyForDataStorage(userAgentInfo);
    let sessionActivityDomainModel = new sessionActivity();
    sessionActivityDomainModel.setSessionActivityId(sessionActivityUuid);
    sessionActivityDomainModel.setUserId(userId);
    sessionActivityDomainModel.setGeolocation(geoLocation);
    sessionActivityDomainModel.setDevice(device);
    sessionActivityDomainModel.setUserAgent(userAgent);

    return sessionActivityDomainModel;
}

//Test:DONE
const createCookieObj = function(sessionToken){
    let defaultPath = '/';
    let _cookieModel = new cookie();
    _cookieModel.setName(sessionConfig.SESSION_NAME);
    _cookieModel.setValue(sessionToken);
    _cookieModel.setProperties(defaultPath, sessionConfig.SESSION_EXPIRATION_TIME_IN_MILLISECONDS,true);
    let cookieObject = _cookieModel.getCookieObject();
    return cookieObject;
}



const service = Object.freeze({
    createUserRoleModel : createUserRoleModel,
    createRegisterModel : createRegisterModel,
    createSessionModel : createSessionModel,
    createSessionActivityModel : createSessionActivityModel,
    createCookieObj : createCookieObj
});

module.exports = service;