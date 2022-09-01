const jwtTokenHelper = require('./jwtTokenHelper.js');
const jwtConfig = require('../../../configuration/authorization/jwtConfig.js');
const helpers = require('../../library/common/helpers.js');
const encryptDecryptService = require('../encryption/encryptDecryptService.js');
const sessionService = require('../authentication/sessionService.js');
const userRepository = require('../../dataAccessLayer/repositories/userRepository.js');
const commonValidators = require('../validation/commonValidators.js');

//Test: DONE
const createAccessTokenPayload = function(userDomainModel, userRolesArray, utcDateExpiry, utcDateCreated){
    let payload = {
        userInfo : {
            userId: userDomainModel.getUserId(),
            username: userDomainModel.getUsername(),
            email: userDomainModel.getEmail(),
            roles: userRolesArray
        },
        tokenUTCDateExpiry: utcDateExpiry,
        tokenUTCDateCreated : utcDateCreated
    }
    return payload;
}
//Test: DONE
const createRefreshTokenPayload = function(fingerprint, utcDateExpiry, utcDateCreated){
    let payload = {
        sessionFingerprint: fingerprint,
        tokenUTCDateExpiry : utcDateExpiry,
        tokenUTCDateCreated : utcDateCreated
    }

    return payload;
}
//Test: DONE
const createJsonWebTokenPromiseAsync = async function( payloadObject ){
    let promise = new Promise(function(resolve, reject){

        function jwtCallback(err, token) {
            resolve(token);
            reject(err);
        }

        jwtTokenHelper.signJwtToken(payloadObject, jwtConfig.JWT_SECRET, jwtCallback);
    });

    let result = await promise;

    return result;
}
//Test: DONE
const getDecodedJWTPayloadPromiseAsync = async function(selectedJwtToken){

    let promise = new Promise(function(resolve, reject){
        function decodedTokenCallback(error, jwtDecodedPayload) {

            resolve(jwtDecodedPayload);
            reject(error);
        }
        jwtTokenHelper.decodeJwtToken(selectedJwtToken, jwtConfig.JWT_SECRET, decodedTokenCallback );

    });
    let result = await promise;
    return result;
}

//Test: DONE
const getCalculatedJwtAccessTokenLocaleExpiryDate = function(localeDateNowAsDate){

    let expiryInMilliseconds = jwtConfig.JWT_ACCESS_TOKEN_TOTAL_EXPIRATION_TIME_IN_MILLISECONDS;
    let localeDateExpiry = sessionService.calculateSessionDateExpiry(localeDateNowAsDate, expiryInMilliseconds);

    return localeDateExpiry;
}

//Test: DONE
const CreateJsonWebTokenWithEncryptedPayloadAsync = async function(originalUnencryptedTokenPayload){
    let jwtTokenPayloadString = helpers.convertToStringOrStringifyForDataStorage(originalUnencryptedTokenPayload);

    let encryptedJwtTokenPayload = encryptDecryptService.encryptWithAES(jwtTokenPayloadString);
    let jwtToken = await createJsonWebTokenPromiseAsync (encryptedJwtTokenPayload);
    return jwtToken;
}

//Test: DONE
const getDecryptedPayloadFromDecodedJsonWedTokenAsync = async function (selectedJsonWebtoken){

    let encryptedTokenPayload =await getDecodedJWTPayloadPromiseAsync(selectedJsonWebtoken);
    let decryptedTokenPayload = encryptDecryptService.decryptWithAES(encryptedTokenPayload);
    let tokenPayload = commonValidators.safeJsonParse(decryptedTokenPayload);
    return tokenPayload;
}


//Test: DONE
const resolveCreateJwtAccessTokenPayloadAsync= async function (userDomainModel){

    let allUserRolesDtoModelArray = await userRepository.getAllUserRolesByUserIdAsync(userDomainModel);
    if (allUserRolesDtoModelArray instanceof Error) {
        let objResponse = httpResponseService.getResponseResultStatus(allUserRolesDtoModelArray, httpResponseStatus._400badRequest);
        return objResponse;
    }
    let userRolesEnumArray = await userRepository.convertAllUserRolesFromDatabaseToUserRoleEnumsAsync(allUserRolesDtoModelArray);
    if (userRolesEnumArray instanceof Error) {
        let objResponse = httpResponseService.getResponseResultStatus(userRolesEnumArray, httpResponseStatus._400badRequest);
        return objResponse;
    }

    let localeDateNow = new Date();
    let utcDateNow = localeDateNow.toISOString();
    let localeDateExpiry = getCalculatedJwtAccessTokenLocaleExpiryDate(localeDateNow);
    let utcDateExpiry = localeDateExpiry.toISOString();
    let accessTokenPayload = createAccessTokenPayload(userDomainModel, userRolesEnumArray, utcDateExpiry, utcDateNow);

    return accessTokenPayload;
}
//Test: DONE
const resolveCreateJwtRefreshTokenPayloadAsync = async function (fingerprint){

    let localeDateNow = new Date();
    let utcDateNow = localeDateNow.toISOString();

    let localeDateExpiry = getCalculatedJwtRefreshTokenLocaleExpiryDate(localeDateNow);
    let utcDateExpiry = localeDateExpiry.toISOString();
    let refreshTokenPayload = createRefreshTokenPayload(fingerprint, utcDateExpiry, utcDateNow);

    return refreshTokenPayload;
}
//Test: DONE
const tokenIsExpired = function (tokenUTCDateExpired){

    let localeDateNow = new Date();
    let utcDateNow = helpers.convertLocaleDateToUTCDate(localeDateNow);
    let utcDateNowTime = utcDateNow.getTime();
    let tokenLocaleDateExpired = new Date(tokenUTCDateExpired);
    let tokenUTCDateExpiredAsDate = helpers.convertLocaleDateToUTCDate(tokenLocaleDateExpired);
    let tokenUTCDateExpiredTime = tokenUTCDateExpiredAsDate.getTime();

    if( tokenUTCDateExpiredTime < utcDateNowTime ){
        return true;
    }

    return false;
}

const service = Object.freeze({
    createAccessTokenPayload : createAccessTokenPayload,
    createRefreshTokenPayload : createRefreshTokenPayload,

    getCalculatedJwtAccessTokenLocaleExpiryDate : getCalculatedJwtAccessTokenLocaleExpiryDate,

    resolveCreateJwtAccessTokenPayloadAsync : resolveCreateJwtAccessTokenPayloadAsync,
    resolveCreateJwtRefreshTokenPayloadAsync : resolveCreateJwtRefreshTokenPayloadAsync,

    createJsonWebTokenPromiseAsync : createJsonWebTokenPromiseAsync,
    getDecodedJWTPayloadPromiseAsync : getDecodedJWTPayloadPromiseAsync,
    CreateJsonWebTokenWithEncryptedPayloadAsync : CreateJsonWebTokenWithEncryptedPayloadAsync,
    getDecryptedPayloadFromDecodedJsonWedTokenAsync : getDecryptedPayloadFromDecodedJsonWedTokenAsync,
    tokenIsExpired : tokenIsExpired
});

module.exports = service;


//#REGION Private Functions


function getCalculatedJwtRefreshTokenLocaleExpiryDate(localeDateNowAsDate){

    let expiryInMilliseconds = jwtConfig.JWT_REFRESH_TOKEN_TOTAL_EXPIRATION_TIME_IN_MILLISECONDS;
    let localeDateExpiry = sessionService.calculateSessionDateExpiry(localeDateNowAsDate, expiryInMilliseconds);

    return localeDateExpiry;
}

//#ENDREGION Private Functions
