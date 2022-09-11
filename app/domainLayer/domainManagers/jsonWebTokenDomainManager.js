const domainManagerHelper = require('./domainManagerHelper.js');
const tokenType = require('../../library/enumerations/tokenType.js');
const tokenRepository = require('../../dataAccessLayer/repositories/tokenRepository.js');
const httpResponseService = require('../../services/httpProtocol/httpResponseService.js');
const httpResponseStatus = require('../../library/enumerations/httpResponseStatus.js');
const notificationService = require('../../services/notifications/notificationService.js');
const jwtTokenService = require('../../services/authorization/jwtTokenService.js');
const authViewModel = require('../../presentationLayer/viewModels/authViewModel.js');
const uuidV4 = require('uuid');
const uuid = uuidV4.v4;
const monitorService = require('../../services/monitoring/monitorService.js');




//Test: DONE
const resolveJsonWebTokenUpdateAsync = async function (request) {

    let authorizationToken = request.headers.authorization;
    let accessToken = authorizationToken.split(' ');
    let accessTokenFromApi = accessToken[1] ;
    let _currentRefreshToken = request.headers.refresh_token;

    let tokenInfo = await processJWTUpdateGetTokenFromDatabaseAsync(_currentRefreshToken);
    monitorService.capture('resolveJsonWebTokenUpdateAsync-NEW token-info', tokenInfo);
    if(tokenInfo.status === httpResponseStatus._200ok){
        let refreshTokenDtoModelFound = tokenInfo.result;
        monitorService.capture('refreshTokenDtoModelFound', refreshTokenDtoModelFound);
        if(jwtTokenService.tokenIsExpired(refreshTokenDtoModelFound.UTCDateExpired.value)){
            monitorService.capture('REFRESH-TOKEN-Is EXPIRED-ok')
            let resultTokenRemovedFromDb = await resolveRemoveTokenFromDatabaseAsync(refreshTokenDtoModelFound);
            return resultTokenRemovedFromDb;
        }

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
    monitorService.capture('tokensDtoModelResultArray', tokensDtoModelResultArray);
    if (tokensDtoModelResultArray instanceof Error) {
        return httpResponseService.getResponseResultStatus(tokensDtoModelResultArray, httpResponseStatus._400badRequest);
    }
    else if (tokensDtoModelResultArray.length === 0) {
        return httpResponseService.getResponseResultStatus(notificationService.TokenNoLongerActive, httpResponseStatus._403forbidden);
    }
    let foundTokenDtoModel = tokensDtoModelResultArray[0];
    return httpResponseService.getResponseResultStatus(foundTokenDtoModel, httpResponseStatus._200ok);
}

async function processJWTUpdateSaveNewTokenToDatabaseAsync(accessTokenFromApi, refreshTokenDtoModel){

    let accessToken = await resolveAccessTokenUpdateAsync(accessTokenFromApi);

    let jwtRefreshTokenPayload = await jwtTokenService.getDecryptedPayloadFromDecodedJsonWedTokenAsync (refreshTokenDtoModel.Token.value);
    let fingerprint = uuid();
    jwtRefreshTokenPayload.sessionFingerprint = fingerprint;
    let refreshToken = await jwtTokenService.CreateJsonWebTokenWithEncryptedPayloadAsync(jwtRefreshTokenPayload);
    if(refreshTokenDtoModel.Token.value != refreshToken){

        let updatedTokenDomainModel =domainManagerHelper.getTokenDomainModelMappedFromTokenDtoModel(refreshTokenDtoModel);
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

async function resolveAccessTokenUpdateAsync(accessTokenFromApi){

    let accessToken = accessTokenFromApi;
    let accessTokenPayload = await jwtTokenService.getDecryptedPayloadFromDecodedJsonWedTokenAsync (accessTokenFromApi);

    if(jwtTokenService.tokenIsExpired(accessTokenPayload.tokenUTCDateExpiry)){
        let localeDateNow = new Date();
        accessTokenPayload.tokenUTCDateCreated = localeDateNow.toISOString();
        let localeDateExpiry = jwtTokenService.getCalculatedJwtAccessTokenLocaleExpiryDate(localeDateNow);
        accessTokenPayload.tokenUTCDateExpiry = localeDateExpiry.toISOString();
        accessToken = await jwtTokenService.CreateJsonWebTokenWithEncryptedPayloadAsync(accessTokenPayload);
    }
    return accessToken;
}

async function resolveRemoveTokenFromDatabaseAsync(tokenDtoModel){

     let currentTokenDomainModel = domainManagerHelper.getTokenDomainModelMappedFromTokenDtoModel(tokenDtoModel);
     let tokenResultArray = await tokenRepository.deleteTokenFromDatabaseAsync(currentTokenDomainModel);
     if (tokenResultArray instanceof Error) {
         return httpResponseService.getResponseResultStatus(tokenResultArray, httpResponseStatus._400badRequest);
     }

     return httpResponseService.getResponseResultStatus(notificationService.tokenRemoved, httpResponseStatus._403forbidden);
}

//#ENDREGION Private Functions