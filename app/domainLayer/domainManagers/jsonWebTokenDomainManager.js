const domainManagerHelper = require('./domainManagerHelper.js');
const tokenType = require('../../library/enumerations/tokenType.js');
const tokenRepository = require('../../dataAccessLayer/repositories/tokenRepository.js');
const httpResponseService = require('../../services/httpProtocol/httpResponseService.js');
const httpResponseStatus = require('../../library/enumerations/httpResponseStatus.js');
const notificationService = require('../../services/notifications/notificationService.js');
const jwtTokenService = require('../../services/authorization/jwtTokenService.js');
const encryptDecryptService = require('../../services/encryption/encryptDecryptService.js');
const helpers = require('../../library/common/helpers.js');
const authViewModel = require('../../presentationLayer/viewModels/authViewModel.js');
const uuidV4 = require('uuid');
const uuid = uuidV4.v4;

const resolveJsonWebTokenUpdateAsync = async function (request) {

    let authorizationToken = request.headers.authorization;
    let accessToken = authorizationToken.split(' ');
    let accessTokenFromApi = accessToken[1] ;
    let _currentRefreshToken = request.headers.refresh_token;

    let tokenInfo = await processJWTUpdateGetTokenFromDatabaseAsync(_currentRefreshToken);
    if(tokenInfo.status === httpResponseStatus._200ok){
        let refreshTokenDtoModelFound = tokenInfo.result;
        return await processJWTUpdateSaveNewTokenToDatabaseAsync( accessTokenFromApi , refreshTokenDtoModelFound );
    }
    return tokenInfo;
}



const service = Object.freeze({
    resolveJsonWebTokenUpdateAsync: resolveJsonWebTokenUpdateAsync,
});

module.exports = service;


//#REGION Private Functions

async function processJWTUpdateGetTokenFromDatabaseAsync(currentRefreshToken){

    let tempUserId = null;
    let tempPayload = null;
    let tempTokenModel = domainManagerHelper.createTokenModel(tempUserId,currentRefreshToken,tokenType.jwtRefreshToken,tempPayload);
    let tokensDtoModelResultArray = await tokenRepository.getTokensFromDatabaseAsync(tempTokenModel);
    console.log('tokensDtoModelResultArray', tokensDtoModelResultArray);
    if (tokensDtoModelResultArray instanceof Error) {
        return httpResponseService.getResponseResultStatus(tokensDtoModelResultArray, httpResponseStatus._400badRequest);
    }
    else if (tokensDtoModelResultArray.length === 0) {
        return httpResponseService.getResponseResultStatus(notificationService.TokenNoLongerActive, httpResponseStatus._403forbidden);
    }
    let foundTokenDtoModel = tokensDtoModelResultArray[0];
    return httpResponseService.getResponseResultStatus(foundTokenDtoModel, httpResponseStatus._200ok);
}

async function processJWTUpdateSaveNewTokenToDatabaseAsync(accessTokenFromApi, tokenDtoModel){

    let localeDateNow = new Date();
    let utcDateNow = helpers.convertLocaleDateToUTCDate(localeDateNow);
    let accessToken = accessTokenFromApi;
    let tokenUTCDateExpiredTime = tokenDtoModel.UTCDateExpired.value.getTime();
    let utcDateNowTime = utcDateNow.getTime();
    if(tokenUTCDateExpiredTime < utcDateNowTime && tokenDtoModel.Type.value === tokenType.jwtRefreshToken)
    {
        //Remove the token from the database;
        /*
        let currentTokenDomainModel = domainManagerHelper.createTokenModel(tokenDtoModel.UserId.value, tokenDtoModel.Token.value. tokenDtoModel.type.value, tokenDtoModel.payload.value);
        currentTokenDomainModel.setTokenId(tokenDtoModel.TokenId.value);

        let tokenResultArray = tokenRepository.deleteTokenFromDatabaseAsync(currentTokenDomainModel);
        if (tokenResultArray instanceof Error) {
            return httpResponseService.getResponseResultStatus(tokenResultArray, httpResponseStatus._400badRequest);
        }

        //NO TOKEN IS RETURNED Authorization is EXPIRED
        return httpResponseService.getResponseResultStatus(notificationService.tokenRemoved, httpResponseStatus._403forbidden);
        */
        let resultTokenRemovedFromDb = await resolveRemoveTokenFromDatabaseAsync(tokenDtoModel);
        return resultTokenRemovedFromDb;
    }

    //Decrypt accessTokenFromApi
    //let encryptedAccessTokenPayload = jwtTokenService.getDecodedJWTPayloadPromiseAsync(accessTokenFromApi);
    //let decryptedAccessTokenPayload = encryptDecryptService.decryptWithAES(encryptedAccessTokenPayload);
    //let accessTokenPayload = JSON.parse(decryptedAccessTokenPayload);
    let accessTokenPayload = await jwtTokenService.getDecryptedPayloadFromDecodedJsonWedTokenAsync (accessTokenFromApi);
    let accessTokenLocaleDate = new Date(accessTokenPayload.tokenUTCDateExpiry);
    let accessTokenUtcDate = helpers.convertLocaleDateToUTCDate(accessTokenLocaleDate);
    let accessTokenUtcDateTime = accessTokenUtcDate.getTime();
    if( accessTokenUtcDateTime < utcDateNowTime){
        //update the dates
        accessTokenPayload.tokenUTCDateCreated = utcDateNow;
        accessTokenPayload.tokenUTCDateExpiry = jwtTokenService.getCalculatedJwtAccessTokenUTCExpiryDate(localeDateNow);
        accessToken = await jwtTokenService.CreateJsonWebTokenWithEncryptedPayloadAsync(accessTokenPayload);
    }
    //Decrypt refreshTokenFromDb
    //let encryptedRefreshTokenPayload = jwtTokenService.getDecodedJWTPayloadPromiseAsync(refreshTokenFromDb);
    //let decryptedRefreshTokenPayload = encryptDecryptService.decryptWithAES(encryptedRefreshTokenPayload);
    //let jwtRefreshTokenPayload = JSON.parse(decryptedRefreshTokenPayload);
    let jwtRefreshTokenPayload = await jwtTokenService.getDecryptedPayloadFromDecodedJsonWedTokenAsync (tokenDtoModel.Token.value);
    let fingerprint = uuid();
    jwtRefreshTokenPayload.encryptedSessionFingerprint = fingerprint;
    let refreshToken = await jwtTokenService.CreateJsonWebTokenWithEncryptedPayloadAsync(jwtRefreshTokenPayload);
    if(tokenDtoModel.Token.value != refreshToken){
        //update token in database
        let updatedTokenDomainModel = convertTokenDtoModelToTokenDomainModel(tokenDtoModel);
        updatedTokenDomainModel.setToken(refreshToken);
        updatedTokenDomainModel.setType(tokenType.jwtRefreshToken );
        let result = await tokenRepository.updateTokenTableSetColumnValuesWhereAsync(updatedTokenDomainModel);
        if (result instanceof Error) {
            return httpResponseService.getResponseResultStatus(result, httpResponseStatus._400badRequest);
        }
    }

    let authModel = {
        jwtAccessToken : accessToken,
        jwtRefreshToken : refreshToken
    }
    let _authViewModel = new authViewModel(authModel);

    return httpResponseService.getResponseResultStatus(_authViewModel, httpResponseStatus._200ok);

}

function convertTokenDtoModelToTokenDomainModel(tokenDtoModel){
    console.log('convertTokenDtoModelToTokenDomainModel--tokenDtoModel',tokenDtoModel);
    let userId = tokenDtoModel.UserId.value;
    let token = tokenDtoModel.Token.value;
    let type = tokenDtoModel.Type.value;
    let payload = tokenDtoModel.Payload.value;
    let currentTokenDomainModel = domainManagerHelper.createTokenModel(userId ,token ,type ,payload );
    currentTokenDomainModel.setTokenId(tokenDtoModel.TokenId.value);
    return currentTokenDomainModel;
}

async function resolveRemoveTokenFromDatabaseAsync(tokenDtoModel){
     //Remove the token from the database;
     let currentTokenDomainModel = convertTokenDtoModelToTokenDomainModel(tokenDtoModel);
     let tokenResultArray = await tokenRepository.deleteTokenFromDatabaseAsync(currentTokenDomainModel);
     if (tokenResultArray instanceof Error) {
         return httpResponseService.getResponseResultStatus(tokenResultArray, httpResponseStatus._400badRequest);
     }

     //NO TOKEN IS RETURNED Authorization is EXPIRED
     return httpResponseService.getResponseResultStatus(notificationService.tokenRemoved, httpResponseStatus._403forbidden);
}

/*function getDecryptedPayloadFromDecodedJsonWedToken(selectedJsonWebtoken){

    let encryptedTokenPayload = jwtTokenService.getDecodedJWTPayloadPromiseAsync(selectedJsonWebtoken);
    let decryptedTokenPayload = encryptDecryptService.decryptWithAES(encryptedTokenPayload);
    let tokenPayload = JSON.parse(decryptedTokenPayload);
    return tokenPayload;
}*/

/*async function resolveCreateJsonWebTokenAsync(originalTokenPayload){
    let jwtTokenPayloadString = helpers.convertToStringOrStringifyForDataStorage(originalTokenPayload);

    let encryptedJwtTokenPayload = encryptDecryptService.encryptWithAES(jwtTokenPayloadString);
    let jwtToken = await jwtTokenService.createJsonWebTokenPromiseAsync (encryptedJwtTokenPayload);
    return jwtToken;
}*/
//#ENDREGION Private Functions