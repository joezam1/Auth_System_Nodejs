const jwtTokenHelper = require('./jwtTokenHelper.js');
const jwtConfig = require('../../../configuration/authorization/jwtConfig.js');
const helpers = require('../../library/common/helpers.js');
const encryptDecryptService = require('../encryption/encryptDecryptService.js');
const sessionService = require('../authentication/sessionService.js');


//Test: DONE
let createAccessTokenPayload = function(userDomainModel, userRolesArray, utcDateExpiry, utcDateCreated){
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
let createRefreshTokenPayload = function(sessionFingerprintSHA256Hash, utcDateExpiry, utcDateCreated){
    let payload = {
        encryptedSessionFingerprint: sessionFingerprintSHA256Hash,
        tokenUTCDateExpiry : utcDateExpiry,
        tokenUTCDateCreated : utcDateCreated
    }

    return payload;
}
//Test: DONE
let createJsonWebTokenPromiseAsync = async function( payloadObject ){
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
let getDecodedJWTPayloadPromiseAsync = async function(selectedJwtToken){

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


const getCalculatedJwtAccessTokenLocaleExpiryDate = function(localeDateNowAsDate){

    let expiryInMilliseconds = jwtConfig.JWT_ACCESS_TOKEN_TOTAL_EXPIRATION_TIME_IN_MILLISECONDS;
    let localeDateExpiry = sessionService.calculateSessionDateExpiry(localeDateNowAsDate, expiryInMilliseconds);


    return localeDateExpiry;
}

const getCalculatedJwtAccessTokenUTCExpiryDate = function(localeDateNowAsDate){

    let expiryInMilliseconds = jwtConfig.JWT_ACCESS_TOKEN_TOTAL_EXPIRATION_TIME_IN_MILLISECONDS;
    let localeDateExpiry = sessionService.calculateSessionDateExpiry(localeDateNowAsDate, expiryInMilliseconds);
    let utcDateExpiry = helpers.convertLocaleDateToUTCDate(localeDateExpiry);

    return utcDateExpiry;
}

const getCalculatedJwtRefreshTokenUTCExpiryDate = function(localeDateNowAsDate){

    let expiryInMilliseconds = jwtConfig.JWT_REFRESH_TOKEN_TOTAL_EXPIRATION_TIME_IN_MILLISECONDS;
    let localeDateExpiry = sessionService.calculateSessionDateExpiry(localeDateNowAsDate, expiryInMilliseconds);
    let utcDateExpiry = helpers.convertLocaleDateToUTCDate(localeDateExpiry);

    return utcDateExpiry;
}



async function CreateJsonWebTokenWithEncryptedPayloadAsync(originalTokenPayload){
    let jwtTokenPayloadString = helpers.convertToStringOrStringifyForDataStorage(originalTokenPayload);

    let encryptedJwtTokenPayload = encryptDecryptService.encryptWithAES(jwtTokenPayloadString);
    let jwtToken = await createJsonWebTokenPromiseAsync (encryptedJwtTokenPayload);
    return jwtToken;
}


async function getDecryptedPayloadFromDecodedJsonWedTokenAsync(selectedJsonWebtoken){

    let encryptedTokenPayload =await getDecodedJWTPayloadPromiseAsync(selectedJsonWebtoken);
    let decryptedTokenPayload = encryptDecryptService.decryptWithAES(encryptedTokenPayload);
    let tokenPayload = JSON.parse(decryptedTokenPayload);
    return tokenPayload;
}


const service = Object.freeze({
    createAccessTokenPayload : createAccessTokenPayload,
    createRefreshTokenPayload : createRefreshTokenPayload,
    createJsonWebTokenPromiseAsync : createJsonWebTokenPromiseAsync,
    getDecodedJWTPayloadPromiseAsync : getDecodedJWTPayloadPromiseAsync,
    getCalculatedJwtAccessTokenLocaleExpiryDate : getCalculatedJwtAccessTokenLocaleExpiryDate,
    getCalculatedJwtAccessTokenUTCExpiryDate : getCalculatedJwtAccessTokenUTCExpiryDate,
    getCalculatedJwtRefreshTokenUTCExpiryDate : getCalculatedJwtRefreshTokenUTCExpiryDate,
    CreateJsonWebTokenWithEncryptedPayloadAsync : CreateJsonWebTokenWithEncryptedPayloadAsync,
    getDecryptedPayloadFromDecodedJsonWedTokenAsync : getDecryptedPayloadFromDecodedJsonWedTokenAsync
});

module.exports = service;