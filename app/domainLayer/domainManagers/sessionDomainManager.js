const sessionRepository = require('../../dataAccessLayer/repositories/sessionRepository.js');
const sessionConfig = require('../../../configuration/authentication/sessionConfig.js');
const httpResponseStatus = require('../../library/enumerations/httpResponseStatus.js');
const domainManagerHelper = require('./domainManagerHelper.js');
const httpResponseService = require('../../services/httpProtocol/httpResponseService.js');
const sessionService = require('../../services/authentication/sessionService.js');
const notificationService = require('../../services/notifications/notificationService.js');
const dbAction = require('../../dataAccessLayer/mysqlDataStore/context/dbAction.js');
const tokenRepository = require('../../dataAccessLayer/repositories/tokenRepository.js');
const helpers = require('../../library/common/helpers.js');
const encryptDecryptService = require('../../services/encryption/encryptDecryptService.js');

//Test: DONE
const resolveSessionUpdateAsync = async function (request) {

    let _currentSessionToken = request.body.session;
    let sessionInfo = await processSessionUpdateGetSessionFromDatabaseAsync(_currentSessionToken);
    if(sessionInfo.status === httpResponseStatus._200ok){
        let sessionDtoModel = sessionInfo.result;
        if(sessionService.sessionIsExpired(sessionDtoModel.UTCDateExpired.value)){

            let resultSessionRemoved = await resolveRemoveSessionFromDatabaseAsync(sessionDtoModel);
            return resultSessionRemoved;
        }

        return await processSessionUpdateSaveNewTokenToDatabaseAsync(sessionDtoModel);
    }
    return sessionInfo;
}
//Test: DONE
const resolveGetSessionAsync = async function(request){

    let tempUserId = null;
    let currentSessionToken = request.headers.x_session_id;
    let tempCookieJson = null;
    let tempSessionModel = domainManagerHelper.createSessionModel(tempUserId, currentSessionToken, tempCookieJson, sessionConfig.SESSION_EXPIRATION_TIME_IN_MILLISECONDS);
    let sessionsDtoModelResultArray = await sessionRepository.getSessionFromDatabaseAsync(tempSessionModel);
    console.log('sesionsDtoModelResultArray', sessionsDtoModelResultArray);
    if (sessionsDtoModelResultArray instanceof Error) {
        return httpResponseService.getResponseResultStatus(sessionsDtoModelResultArray, httpResponseStatus._400badRequest);
    }
    else if (sessionsDtoModelResultArray.length === 0) {
        return httpResponseService.getResponseResultStatus(notificationService.sessionNoLongerActive, httpResponseStatus._401unauthorized);
    }

    let currentSessionDtoModel = sessionsDtoModelResultArray[0];
    if(sessionService.sessionIsExpired(currentSessionDtoModel.UTCDateExpired.value)){
        let resultSessionRemoved = await resolveRemoveSessionFromDatabaseAsync(currentSessionDtoModel);
            return resultSessionRemoved;
    }

    let currentSessionViewModel = domainManagerHelper.getSessionViewModelMappedFromSessionDtoModel(currentSessionDtoModel);

    return httpResponseService.getResponseResultStatus(currentSessionViewModel, httpResponseStatus._200ok);
}
//Test: DONE
const insertSessionSessionActivityAndTokenTransactionAsync = async function(sessionModel, sessionActivityModel, tokenModel){

    let singleConnection = await dbAction.getSingleConnectionFromPoolPromiseAsync();
    try{

        await dbAction.beginTransactionSingleConnectionAsync(singleConnection);
        let insertedSessionResult = await sessionRepository.insertSessionIntoTableTransactionAsync (singleConnection, sessionModel);

        if(insertedSessionResult.statementResult instanceof Error){
            dbAction.rollbackTransactionSingleConnection(singleConnection);
            return httpResponseService.getResponseResultStatus(insertedSessionResult, httpResponseStatus._400badRequest );
        }

        let sessionLoginDate = insertedSessionResult.sessionDtoModel.UTCDateCreated.value;
        let insertedSessionActivityResult = await sessionRepository.insertSessionActivityIntoTableTransacionAsync( singleConnection , sessionActivityModel, sessionLoginDate);
        if(insertedSessionActivityResult instanceof Error){
            dbAction.rollbackTransactionSingleConnection(singleConnection);
            return httpResponseService.getResponseResultStatus(insertedSessionActivityResult, httpResponseStatus._400badRequest );
        }

        let encryptedPayload = tokenModel.getPayload();
        let decryptedPayloadString = encryptDecryptService.decryptWithAES(encryptedPayload);
        let tokenModelPayload = JSON.parse(decryptedPayloadString);
        let utcDateExpiredDbFormat = helpers.convertISOStringDateToUTCFormatForDatabase( tokenModelPayload.tokenUTCDateExpiry);
        let insertedTokenResult = await tokenRepository.insertTokenIntoTableTransactionAsync(singleConnection,tokenModel, utcDateExpiredDbFormat );
        if(insertedTokenResult instanceof Error){
            dbAction.rollbackTransactionSingleConnection(singleConnection);
            return httpResponseService.getResponseResultStatus(insertedTokenResult, httpResponseStatus._400badRequest );
        }

        dbAction.commitTransactionSingleConnection(singleConnection);
        return httpResponseService.getResponseResultStatus(insertedSessionResult, httpResponseStatus._201created );
    }
    catch(error){
        console.log('message: error', error)
        dbAction.rollbackTransactionSingleConnection(singleConnection);
        return httpResponseService.getResponseResultStatus(error , httpResponseStatus._400badRequest );
    }
}



const service = Object.freeze({
    resolveSessionUpdateAsync: resolveSessionUpdateAsync,
    resolveGetSessionAsync : resolveGetSessionAsync,
    insertSessionSessionActivityAndTokenTransactionAsync : insertSessionSessionActivityAndTokenTransactionAsync
});

module.exports = service;

//#REGION Private Functions
async function processSessionUpdateGetSessionFromDatabaseAsync(currentSessionToken){
    let tempUserId = null;
    let tempCookieJson = null;
    let tempSessionModel = domainManagerHelper.createSessionModel(tempUserId, currentSessionToken, tempCookieJson, sessionConfig.SESSION_EXPIRATION_TIME_IN_MILLISECONDS);
    let sesionsDtoModelResultArray = await sessionRepository.getSessionFromDatabaseAsync(tempSessionModel);
    console.log('sesionsDtoModelResultArray', sesionsDtoModelResultArray);
    if (sesionsDtoModelResultArray instanceof Error) {
        return httpResponseService.getResponseResultStatus(sesionsDtoModelResultArray, httpResponseStatus._400badRequest);
    }
    else if (sesionsDtoModelResultArray.length === 0) {
        return httpResponseService.getResponseResultStatus(notificationService.sessionNoLongerActive, httpResponseStatus._401unauthorized);
    }
    let currentSessionDtoModel = sesionsDtoModelResultArray[0];
    return httpResponseService.getResponseResultStatus(currentSessionDtoModel, httpResponseStatus._200ok);
}

async function processSessionUpdateSaveNewTokenToDatabaseAsync(currentSessionDtoModel){

    let newSessionToken = await sessionService.generateSessionTokenAsync();
    let newCookieObj = domainManagerHelper.createCookieObj(newSessionToken);
    let newCookieJson = JSON.stringify(newCookieObj);
    let updatedSessionModel = domainManagerHelper.createSessionModel(currentSessionDtoModel.UserId.value, newSessionToken, newCookieJson, sessionConfig.SESSION_EXPIRATION_TIME_IN_MILLISECONDS);
    updatedSessionModel.setSessionId(currentSessionDtoModel.SessionId.value);

    let sessionsResultArray = await sessionRepository.updateSessionTableSetColumnValuesWhereAsync(updatedSessionModel);
    if (sessionsResultArray instanceof Error) {
        return httpResponseService.getResponseResultStatus(sessionsResultArray, httpResponseStatus._400badRequest);
    }
    else if(sessionsResultArray.length>0 && sessionsResultArray[0].affectedRows ===1){

        let newSessionViewModel = domainManagerHelper.getSessionViewModelMappedFromSessionDtoModel(currentSessionDtoModel);
        newSessionViewModel.sessionToken.fieldValue = newSessionToken;
        newSessionViewModel.data.fieldValue = newCookieObj;

        return httpResponseService.getResponseResultStatus(newSessionViewModel, httpResponseStatus._200ok);
    }

    return httpResponseService.getResponseResultStatus(notificationService.errorProcessingNewSession, httpResponseStatus._422unprocessableEntity);

}

async function resolveRemoveSessionFromDatabaseAsync(sessionDtoModel){

    let currentSessionDomainModel = domainManagerHelper.getSessionDomainModelMappedFromSessionDtoModel(sessionDtoModel);
    let sessionResultArray = await sessionRepository.deleteSessionFromDatabaseAsync(currentSessionDomainModel);
    if (sessionResultArray instanceof Error) {
        return httpResponseService.getResponseResultStatus(sessionResultArray, httpResponseStatus._400badRequest);
    }

    return httpResponseService.getResponseResultStatus(notificationService.sessionRemoved, httpResponseStatus._401unauthorized);
}

//#ENDREGION Private Functions
