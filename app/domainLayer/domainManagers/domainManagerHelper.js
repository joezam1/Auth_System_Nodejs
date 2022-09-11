const session = require('../domainModels/session.js');
const cookie = require('../domainModels/cookie.js');
const userRole = require('../domainModels/userRole.js');
const register = require('../domainModels/register.js');
const userDomainModel = require('../domainModels/user.js');
const sessionActivity = require('../domainModels/sessionActivity.js');
const tokenModel = require('../domainModels/token.js');
const sessionViewModel = require('../../presentationLayer/viewModels/sessionViewModel.js');
const sessionConfig = require('../../../configuration/authentication/sessionConfig.js');
const uuidV4 = require('uuid');
const uuid = uuidV4.v4;
const helpers = require('../../library/common/helpers.js');
const authViewModel = require('../../presentationLayer/viewModels/authViewModel.js');
const monitorService = require('../../services/monitoring/monitorService.js');




//Test: DONE
const createUserRoleModel = function (userId, roleId) {
    let _userRoleInfo = new userRole();
    let userRoleUuid = uuid();
    _userRoleInfo.setUserRoleId(userRoleUuid);
    _userRoleInfo.setUserId(userId);
    _userRoleInfo.setRoleId(roleId);

    return _userRoleInfo;
}

//Test: DONE
const createRegisterModel = function (userId) {
    let _registerInfo = new register();
    let registerUuid = uuid();
    _registerInfo.setRegisterId(registerUuid);
    _registerInfo.setUserId(userId);
    if (_registerInfo.getRegisterStatusIsActive() === false) {
        _registerInfo.setRegisterIsActive(true);
    }

    return _registerInfo
}

//Test: DONE
const createSessionModel = function (userId, sessionToken, data, expirationTimeMilliseconds) {
    let sessionUuid = uuid();
    let _sessionModel = new session();
    _sessionModel.setSessionId(sessionUuid);
    _sessionModel.setUserId(userId);
    _sessionModel.setSessionToken(sessionToken);
    _sessionModel.setData(data);
    _sessionModel.setExpiryInMilliseconds(expirationTimeMilliseconds);
    _sessionModel.setSessionStatusIsActive(true);

    return _sessionModel;
}

//Test: DONE
const createSessionActivityModel = function (userId, geoLocationInfo, deviceInfo, userAgentInfo) {
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
const createCookieObj = function (sessionToken) {
    let defaultPath = '/';
    let _cookieModel = new cookie();
    _cookieModel.setName(sessionConfig.SESSION_NAME);
    _cookieModel.setValue(sessionToken);
    _cookieModel.setProperties(defaultPath, sessionConfig.SESSION_EXPIRATION_TIME_IN_MILLISECONDS, true);
    let cookieObject = _cookieModel.getCookieObject();
    return cookieObject;
}

//Test: DONE
const createTokenModel = function (userId, token, type, payload) {
    let tokenUuid = uuid();
    let _tokenModel = new tokenModel();
    _tokenModel.setTokenId(tokenUuid);
    _tokenModel.setUserId(userId);
    _tokenModel.setToken(token);
    _tokenModel.setType(type);
    _tokenModel.setPayload(payload);
    _tokenModel.setTokenStatusIsActive(true);
    return _tokenModel;
}

//Test: DONE
const getUserDomainModelMappedFromUserDtoModel = function (userDtoModel) {
    let _userDomainModel = new userDomainModel();
    _userDomainModel.setUserId(userDtoModel.UserId.value);
    _userDomainModel.setFirstName(userDtoModel.FirstName.value);
    _userDomainModel.setLastName(userDtoModel.LastName.value);
    _userDomainModel.setUsername(userDtoModel.Username.value);
    _userDomainModel.setEmail(userDtoModel.Email.value);
    _userDomainModel.setUserIsActive(userDtoModel.IsActive.value);

    return _userDomainModel;
}

//Test: DONE
function getTokenDomainModelMappedFromTokenDtoModel(tokenDtoModel) {
    monitorService.capture('getTokenDomainModelMappedFromTokenDtoModel--tokenDtoModel', tokenDtoModel);
    let userId = tokenDtoModel.UserId.value;
    let token = tokenDtoModel.Token.value;
    let type = tokenDtoModel.Type.value;
    let payload = tokenDtoModel.Payload.value;
    let currentTokenDomainModel = createTokenModel(userId, token, type, payload);
    currentTokenDomainModel.setTokenId(tokenDtoModel.TokenId.value);
    return currentTokenDomainModel;
}

//Test: DONE
const getSessionViewModelMappedFromSessionDtoModel = function (sessionDtoModel) {
    let currentSessionViewModel = new sessionViewModel();
    currentSessionViewModel.sessionToken.fieldValue = sessionDtoModel.SessionToken.value;
    currentSessionViewModel.expires.fieldValue = sessionDtoModel.Expires.value;
    currentSessionViewModel.data.fieldValue = sessionDtoModel.Data.value;
    currentSessionViewModel.isActive.fieldValue = sessionDtoModel.IsActive.value;
    currentSessionViewModel.utcDateCreated.fieldValue = sessionDtoModel.UTCDateCreated.value.toString();
    currentSessionViewModel.utcDateExpired.fieldValue = sessionDtoModel.UTCDateExpired.value.toString();
    return currentSessionViewModel;
}
//Test: DONE
const getSessionDomainModelMappedFromSessionDtoModel = function(sessionDtoModel){

    let _sessionModel = new session();
    _sessionModel.setSessionId(sessionDtoModel.SessionId.value);
    _sessionModel.setUserId(sessionDtoModel.UserId.value);
    _sessionModel.setSessionToken(sessionDtoModel.SessionToken.value);
    _sessionModel.setExpiryInMilliseconds(sessionDtoModel.Expires.value);
    _sessionModel.setData(sessionDtoModel.Data.value);
    _sessionModel.setSessionStatusIsActive(sessionDtoModel.IsActive.value);

    return _sessionModel;
}

//Test: DONE
const createAuthViewModelFromRequest = function(request){

    let model = {
        csrfToken : request.headers.x_csrf_token,
        csrfTokenClient : request.headers.x_csrf_token_client,
        referer : request.headers.referer,
        origin: request.headers.origin,
        userAgent: request.headers['user-agent']

    }
    let _authViewModel = new authViewModel( model );
    return _authViewModel;
}


const service = Object.freeze({

    createUserRoleModel: createUserRoleModel,
    createRegisterModel: createRegisterModel,
    createSessionModel: createSessionModel,
    createSessionActivityModel: createSessionActivityModel,
    createCookieObj: createCookieObj,
    createTokenModel: createTokenModel,
    getUserDomainModelMappedFromUserDtoModel: getUserDomainModelMappedFromUserDtoModel,
    getTokenDomainModelMappedFromTokenDtoModel: getTokenDomainModelMappedFromTokenDtoModel,
    getSessionViewModelMappedFromSessionDtoModel : getSessionViewModelMappedFromSessionDtoModel,
    getSessionDomainModelMappedFromSessionDtoModel : getSessionDomainModelMappedFromSessionDtoModel,
    createAuthViewModelFromRequest : createAuthViewModelFromRequest
});

module.exports = service;