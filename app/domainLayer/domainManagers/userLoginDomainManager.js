const httpResponseStatus = require('../../library/enumerations/httpResponseStatus.js');
const httpResponseService = require('../../services/httpProtocol/httpResponseService.js');

const authViewModel = require('../../presentationLayer/viewModels/authViewModel.js');
const validationService = require('../../services/validation/validationService.js');
const inputCommonInspector = require('../../services/validation/inputCommonInspector.js');
const uuidV4 = require('uuid');
const uuid = uuidV4.v4;
const user = require('../domainModels/user.js');

const domainManagerHelper = require('./domainManagerHelper.js');

const userRepository = require('../../dataAccessLayer/repositories/userRepository.js');
const encryptionService = require('../../services/encryption/encryptionService.js');
const sessionService = require('../../services/authentication/sessionService.js');
const sessionConfig = require('../../../configuration/authentication/sessionConfig.js');
const notificationService = require('../../services/notifications/notificationService.js');
const sessionDomainManager = require('../domainManagers/sessionDomainManager.js');
const helpers = require('../../library/common/helpers.js');
const jwtTokenService = require('../../services/authorization/jwtTokenService.js');
const tokenType = require('../../library/enumerations/tokenType.js');
const encryptDecryptService = require('../../services/encryption/encryptDecryptService.js');
const sessionExpiredInspector = require('../../middleware/sessionExpiredInspector.js');
const jsonWebTokenExpiredInspector = require('../../middleware/jsonWebTokenExpiredInspector.js');

//Test: DONE
async function processUserLoginValidationAsync(userViewModel) {

    let errorsReport = validationService.resolveUserModelValidation(userViewModel);
    if (!inputCommonInspector.objectIsNullOrEmpty(errorsReport)) {
        return httpResponseService.getResponseResultStatus(errorsReport, httpResponseStatus._401unauthorized);
    }

    let userInfo = new user();
    userInfo.setUserDetails(userViewModel);
    var UsersDtoModelArray = await userRepository.getUserByUsernameAndEmailDataAsync(userInfo);
    if (UsersDtoModelArray instanceof Error) {
        return httpResponseService.getResponseResultStatus(UsersDtoModelArray, httpResponseStatus._400badRequest);
    }
    else if (UsersDtoModelArray.length === 0) {
        return httpResponseService.getResponseResultStatus(notificationService.usernameOrPasswordNotMatching, httpResponseStatus._401unauthorized);
    }

    let pwdPlainText = userInfo.getPassword();
    let userDtoModel = UsersDtoModelArray[0];
    let pwdDatabase = userDtoModel.Password.value;
    let passwordsAreTheSame = await encryptionService.validateEncryptedStringInputAsync(pwdPlainText, pwdDatabase);
    if (!passwordsAreTheSame) {
        return httpResponseService.getResponseResultStatus(notificationService.usernameOrPasswordNotMatching, httpResponseStatus._401unauthorized);
    }

    return httpResponseService.getResponseResultStatus(userDtoModel, httpResponseStatus._200ok);
}

//Test: DONE
async function processUserLoginStorageToDatabaseAsync(userDtoModel, sessionActivityViewModel) {

    let sessionToken = await sessionService.generateSessionTokenAsync();
    let cookieObj = domainManagerHelper.createCookieObj(sessionToken);
    let sessionModel = getSessionModel(userDtoModel, sessionToken, cookieObj);
    let sessionActivityModel = getSessionActivityModel(userDtoModel, sessionActivityViewModel);

    let allJwtTokens = await createJsonWebTokensAsync(userDtoModel);
    let tokenModel = domainManagerHelper.createTokenModel( userDtoModel.UserId.value, allJwtTokens.jwtRefreshToken, tokenType.jwtRefreshToken , allJwtTokens.encryptedJwtRefreshTokenPayload );
    let sessionResult = await sessionDomainManager.insertSessionSessionActivityAndTokenTransactionAsync(sessionModel, sessionActivityModel , tokenModel);

    if (sessionResult instanceof Error || sessionResult.result instanceof Error) {
        return httpResponseService.getResponseResultStatus(sessionResult, httpResponseStatus._500internalServerError);
    }
    let isResultArrayOk = (sessionResult.length > 0 && sessionResult[0].affectedRows === 1)
    let isResultObjectOk = (inputCommonInspector.objectIsValid(sessionResult) && sessionResult.result && sessionResult.status === httpResponseStatus._201created);
    if (isResultArrayOk || isResultObjectOk) {

        //Create remover for expired sessions
        //sessionExpiredInspector.resolveRemoveExpiredSessions();
        //Create remover for jwt expired tokens
        //jsonWebTokenExpiredInspector.resolveRemoveExpiredTokens();
        let authModel = {
            jwtAccessToken : allJwtTokens.jwtAccessToken,
            jwtRefreshToken : allJwtTokens.jwtRefreshToken,
            session : cookieObj
        }
        let _authnViewModel = new authViewModel(authModel);

        return httpResponseService.getResponseResultStatus( _authnViewModel, httpResponseStatus._200ok);
    }

    return httpResponseService.getResponseResultStatus(notificationService.errorProcessingUserLogin, httpResponseStatus._422unprocessableEntity);
}

const service = {
    processUserLoginValidationAsync : processUserLoginValidationAsync,
    processUserLoginStorageToDatabaseAsync : processUserLoginStorageToDatabaseAsync
}


module.exports = service;


//#REGION Private Functions

function getSessionModel(userDtoModel, sessionToken, cookieObj) {

    let cookieJson = JSON.stringify(cookieObj);
    let sessionModel = domainManagerHelper.createSessionModel(userDtoModel.UserId.value, sessionToken, cookieJson, sessionConfig.SESSION_EXPIRATION_TIME_IN_MILLISECONDS);
    return sessionModel;
}

function getSessionActivityModel(userDtoModel, sessionActivityViewModel) {

    let currentGeoLocation = sessionActivityViewModel.geoLocation.fieldValue;
    let currentDeviceAndBrowser = sessionActivityViewModel.deviceAndBrowser.fieldValue;
    let currentUserAgent = sessionActivityViewModel.userAgent.fieldValue;
    let sessionActivityModel = domainManagerHelper.createSessionActivityModel(userDtoModel.UserId.value, currentGeoLocation, currentDeviceAndBrowser, currentUserAgent);
    return sessionActivityModel;
}

async function createJsonWebTokensAsync(userDtoModel) {
    let userDomainModel = domainManagerHelper.getUserDomainModelMappedFromUserDtoModel(userDtoModel);
    let jwtAccessTokenPayload = await jwtTokenService.resolveCreateJwtAccessTokenPayloadAsync(userDomainModel);
    let jwtAccessToken = await jwtTokenService.CreateJsonWebTokenWithEncryptedPayloadAsync(jwtAccessTokenPayload);

    let fingerprint = uuid();
    let jwtRefreshTokenPayload = await jwtTokenService.resolveCreateJwtRefreshTokenPayloadAsync(fingerprint);

    let jwtRefreshTokenPayloadString = helpers.convertToStringOrStringifyForDataStorage(jwtRefreshTokenPayload);
    let encryptedJwtRefreshTokenPayload = encryptDecryptService.encryptWithAES(jwtRefreshTokenPayloadString);

    let jwtRefreshToken = await jwtTokenService.CreateJsonWebTokenWithEncryptedPayloadAsync(jwtRefreshTokenPayload);
    return {
        jwtAccessToken : jwtAccessToken,
        encryptedJwtRefreshTokenPayload : encryptedJwtRefreshTokenPayload,
        jwtRefreshToken : jwtRefreshToken
    }
}



//#ENDREGION Private Functions