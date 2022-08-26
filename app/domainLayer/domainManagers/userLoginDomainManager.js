const httpResponseStatus = require('../../library/enumerations/httpResponseStatus.js');
const httpResponseService = require('../../services/httpProtocol/httpResponseService.js');

const authViewModel = require('../../presentationLayer/viewModels/authViewModel.js');
const validationService = require('../../services/validation/validationService.js');
const inputCommonInspector = require('../../services/validation/inputCommonInspector.js');
const userRoleEnum = require('../../library/enumerations/userRole.js');
const uuidV4 = require('uuid');
const uuid = uuidV4.v4;
const user = require('../domainModels/user.js');

const domainManagerHelper = require('./domainManagerHelper.js');

const userRepository = require('../../dataAccessLayer/repositories/userRepository.js');
const roleRepository = require('../../dataAccessLayer/repositories/roleRepository.js');
const encryptionService = require('../../services/encryption/encryptionService.js');
const sessionService = require('../../services/authentication/sessionService.js');
const sessionConfig = require('../../../configuration/authentication/sessionConfig.js');
const notificationService = require('../../services/notifications/notificationService.js');
const sessionDomainManager = require('../domainManagers/sessionDomainManager.js');
const helpers = require('../../library/common/helpers.js');
const jwtTokenService = require('../../services/authorization/jwtTokenService.js');
const jwtConfig = require('../../../configuration/authorization/jwtConfig.js');
const tokenType = require('../../library/enumerations/tokenType.js');
const encryptDecryptService = require('../../services/encryption/encryptDecryptService.js');



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

async function processUserLoginStorageToDatabaseAsync(userDtoModel, sessionActivityViewModel) {

    let sessionToken = await sessionService.generateSessionTokenAsync();
    let cookieObj = domainManagerHelper.createCookieObj(sessionToken);
    let sessionModel = getSessionModel(userDtoModel, sessionToken, cookieObj);
    let sessionActivityModel = getSessionActivityModel(userDtoModel, sessionActivityViewModel);

    let allJwtTokens = await createJsonWebTokensAsync(userDtoModel);
    //let refreshTokenPayloadAsString = helpers.convertToStringOrStringifyForDataStorage(allJwtTokens.jwtRefreshTokenPayload);
    //let encryptedRefreshTokenPayload = encryptDecryptService.encryptWithAES(refreshTokenPayloadAsString);
    let tokenModel = domainManagerHelper.createTokenModel( userDtoModel.UserId.value, allJwtTokens.jwtRefreshToken, tokenType.jwtRefreshToken , allJwtTokens.encryptedJwtRefreshTokenPayload );
    let sessionResult = await sessionDomainManager.insertSessionSessionActivityAndTokenTransactionAsync(sessionModel, sessionActivityModel , tokenModel);

    if (sessionResult instanceof Error || sessionResult.result instanceof Error) {
        return httpResponseService.getResponseResultStatus(sessionResult, httpResponseStatus._500internalServerError);
    }
    let isResultArrayOk = (sessionResult.length > 0 && sessionResult[0].affectedRows === 1)
    let isResultObjectOk = (inputCommonInspector.objectIsValid(sessionResult) && sessionResult.result && sessionResult.status === httpResponseStatus._201created);
    if (isResultArrayOk || isResultObjectOk) {

        //sessionExpiredInspector.resolveRemoveExpiredSessions();
        //Create remover jwt expired tokens

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
    let jwtAccessTokenPayload = await getJwtAccessTokenPayloadAsync(userDtoModel);

    //let jwtAccessTokenPayloadString = helpers.convertToStringOrStringifyForDataStorage(jwtAccessTokenPayload);
    //let encryptedJwtAccessTokenPayload = encryptDecryptService.encryptWithAES(jwtAccessTokenPayloadString);

    //let jwtAccessToken = await jwtTokenService.createJsonWebTokenPromiseAsync(encryptedJwtAccessTokenPayload);
    let jwtAccessToken = await jwtTokenService.CreateJsonWebTokenWithEncryptedPayloadAsync(jwtAccessTokenPayload);
    let fingerprint = uuid();
    let jwtRefreshTokenPayload = await getJwtRefreshTokenPayloadAsync(fingerprint);
    let jwtRefreshTokenPayloadString = helpers.convertToStringOrStringifyForDataStorage(jwtRefreshTokenPayload);
    let encryptedJwtRefreshTokenPayload = encryptDecryptService.encryptWithAES(jwtRefreshTokenPayloadString);

    //let jwtRefreshToken = await jwtTokenService.createJsonWebTokenPromiseAsync (encryptedJwtRefreshTokenPayload);
    let jwtRefreshToken = await jwtTokenService.CreateJsonWebTokenWithEncryptedPayloadAsync(jwtRefreshTokenPayload);
    return {
        jwtAccessToken : jwtAccessToken,
        encryptedJwtRefreshTokenPayload : encryptedJwtRefreshTokenPayload,
        jwtRefreshToken : jwtRefreshToken
    }
}

async function getJwtAccessTokenPayloadAsync(userDtoModel){
    let userDomainModel = new user();
    userDomainModel.setUserId(userDtoModel.UserId.value);
    userDomainModel.setFirstName(userDtoModel.FirstName.value);
    userDomainModel.setLastName(userDtoModel.LastName.value);
    userDomainModel.setUsername(userDtoModel.Username.value);
    userDomainModel.setEmail(userDtoModel.Email.value);
    userDomainModel.setUserIsActive(userDtoModel.IsActive.value);

    let userRolesEnumArray = await getAllCurrentUserRolesAsync(userDomainModel);
    let localeDateNow = new Date();
    let utcDateNow = localeDateNow.toISOString(); ///helpers.convertLocaleDateToUTCDate(localeDateNow);
    //let expiryInMilliseconds = jwtConfig.JWT_ACCESS_TOKEN_TOTAL_EXPIRATION_TIME_IN_MILLISECONDS;
    //let localeDateExpiry = sessionService.calculateSessionDateExpiry(localeDateNow, expiryInMilliseconds);
    //let utcDateExpiry = helpers.convertLocaleDateToUTCDate(localeDateExpiry);
    let localeDateExpiry = jwtTokenService.getCalculatedJwtAccessTokenLocaleExpiryDate(localeDateNow);
    let utcDateExpiry = localeDateExpiry.toISOString();
    let accessTokenPayload = jwtTokenService.createAccessTokenPayload(userDomainModel, userRolesEnumArray, utcDateExpiry, utcDateNow);

    return accessTokenPayload;
}

async function getAllCurrentUserRolesAsync(userDomainModel) {

    let allRolesResult = await roleRepository.getAllRolesAsync();
    if (allRolesResult instanceof Error) {
        let objResponse = httpResponseService.getResponseResultStatus(allRolesResult, httpResponseStatus._400badRequest);
        return objResponse;
    }

    let allUserRolesDtoModelResult = await userRepository.getAllUserRolesByUserIdAsync(userDomainModel);
    if (allUserRolesDtoModelResult instanceof Error) {
        let objResponse = httpResponseService.getResponseResultStatus(allUserRolesDtoModelResult, httpResponseStatus._400badRequest);
        return objResponse;
    }
    let userRolesEnumArray = [];
    for (let a = 0; a < allUserRolesDtoModelResult.length; a++) {

        let userRole = allUserRolesDtoModelResult[a];
        let selectedRole = allRolesResult.find((roleObj) => {
            return (roleObj.RoleId.value === userRole.RoleId.value);
        });
        if(inputCommonInspector.inputExist(selectedRole)){
            let roleEnumValue = userRoleEnum[selectedRole.Name.value];
            userRolesEnumArray.push(roleEnumValue);
        }

    }
    return userRolesEnumArray;
}

async function getJwtRefreshTokenPayloadAsync(encryptedFingerprint){

    let localeDateNow = new Date();
    let utcDateNow = localeDateNow.toISOString();//  helpers.convertLocaleDateToUTCDate(localeDateNow);

    //let expiryInMilliseconds = jwtConfig.JWT_REFRESH_TOKEN_TOTAL_EXPIRATION_TIME_IN_MILLISECONDS;
    //let localeDateExpiry = sessionService.calculateSessionDateExpiry(localeDateNow, expiryInMilliseconds);

    //let utcDateExpiry = helpers.convertLocaleDateToUTCDate(localeDateExpiry);

    let localeDateExpiry = jwtTokenService.getCalculatedJwtAccessTokenLocaleExpiryDate(localeDateNow);
    let utcDateExpiry = localeDateExpiry.toISOString();
    let refreshTokenPayload = jwtTokenService.createRefreshTokenPayload(encryptedFingerprint, utcDateExpiry, utcDateNow);

    return refreshTokenPayload;
}

/*function setFingerprintCookie(fingerprint){
    let fingerprintCookie = {
        name: 'fingerprint',
        data: fingerprint,
        properties:{
            maxAge: 24 * 60 * 60 * 1000,
            path:'/',
            //httpOnly: true,
        }
    }
    let allSecureCookiesArray = [fingerprintCookie];
    httpResponseService.setServerResponseCookies(allSecureCookiesArray);
}*/
//#ENDREGION Private Functions