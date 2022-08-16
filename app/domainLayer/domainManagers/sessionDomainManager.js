const sessionRepository = require('../../dataAccessLayer/repositories/sessionRepository.js');
const sessionConfig = require('../../../configuration/authentication/sessionConfig.js');
const httpResponseStatus = require('../../library/enumerations/httpResponseStatus.js');
const domainManagerHelper = require('./domainManagerHelper.js');
const httpResponseService = require('../../services/httpProtocol/httpResponseService.js');
const sessionService = require('../../services/authentication/sessionService.js');
const notificationService = require('../../services/notifications/notificationService.js');
const userDomainManager = require('./userDomainManager.js');
const sessionViewModel = require('../../presentationLayer/viewModels/sessionViewModel.js');
const dbAction = require('../../dataAccessLayer/mysqlDataStore/context/dbAction.js');


let resolveSessionUpdateAsync = async function (request) {

    let tempUserId = null;
    let currentSessionToken = request.body.session;
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

    if(sessionService.sessionIsExpired(currentSessionDtoModel.UTCDateExpired.value)){
        userDomainManager.resolveUserLogoutSessionAsync(request);
    }

    let newSessionToken = await sessionService.generateSessionTokenAsync();
    let cookieObj = domainManagerHelper.createCookieObj(newSessionToken);

    let cookieJson = JSON.stringify(cookieObj);

    let updatedSessionModel = domainManagerHelper.createSessionModel(currentSessionDtoModel.UserId.value, newSessionToken, cookieJson, sessionConfig.SESSION_EXPIRATION_TIME_IN_MILLISECONDS);
    updatedSessionModel.setSessionId(currentSessionDtoModel.SessionId.value);

    let sessionsResultArray = await sessionRepository.updateSessionTableSetColumnValuesWhereAsync(updatedSessionModel);
    if (sessionsResultArray instanceof Error) {
        return httpResponseService.getResponseResultStatus(sessionsResultArray, httpResponseStatus._400badRequest);
    }
    else if(sessionsResultArray.length>0 && sessionsResultArray[0].affectedRows ===1){

        let newSessionViewModel = new sessionViewModel();
        newSessionViewModel.sessionToken.fieldValue = newSessionToken;
        newSessionViewModel.expires.fieldValue = currentSessionDtoModel.Expires.value;
        newSessionViewModel.data.fieldValue = cookieObj;
        newSessionViewModel.isActive.fieldValue = currentSessionDtoModel.IsActive.value;
        newSessionViewModel.utcDateCreated.fieldValue = currentSessionDtoModel.UTCDateCreated.value.toString();
        newSessionViewModel.utcDateExpired.fieldValue = currentSessionDtoModel.UTCDateExpired.value.toString();

        return httpResponseService.getResponseResultStatus(newSessionViewModel, httpResponseStatus._200ok);
    }

    return httpResponseService.getResponseResultStatus(notificationService.errorProcessingNewSession, httpResponseStatus._422unprocessableEntity);

}

let resolveGetSessionAsync = async function(request){

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
        return userDomainManager.resolveUserLogoutSessionAsync(request);
    }

    let currentSessionViewModel = new sessionViewModel();
    currentSessionViewModel.sessionToken.fieldValue = currentSessionDtoModel.SessionToken.value;
    currentSessionViewModel.expires.fieldValue = currentSessionDtoModel.Expires.value;
    currentSessionViewModel.data.fieldValue = currentSessionDtoModel.Data.value;
    currentSessionViewModel.isActive.fieldValue = currentSessionDtoModel.IsActive.value;
    currentSessionViewModel.utcDateCreated.fieldValue = currentSessionDtoModel.UTCDateCreated.value.toString();
    currentSessionViewModel.utcDateExpired.fieldValue = currentSessionDtoModel.UTCDateExpired.value.toString();
    return httpResponseService.getResponseResultStatus(currentSessionViewModel, httpResponseStatus._200ok);
}

let insertSessionAndSessionActivityTransactionAsync = async function(sessionModel, sessionActivityModel){

    let singleConnection = await dbAction.getSingleConnectionFromPoolPromiseAsync();
    try{

        await dbAction.beginTransactionSingleConnectionAsync(singleConnection);
        let insertedSessionResult = await sessionRepository.insertSessionIntoTableTransactionAsync (singleConnection, sessionModel);

        if(insertedSessionResult.statementResult instanceof Error){
            dbAction.rollbackTransactionSingleConnection(singleConnection);
            return httpResponseService.getResponseResultStatus(insertedSessionResult, httpResponseStatus._400badRequest );
        }
        let sessionLoginDate = insertedSessionResult.sessionDtoModel.UTCDateCreated.value;
        let insertedSessionActivityResult = await sessionRepository.insertSessionActivityIntoTrableTransacionAsync( singleConnection , sessionActivityModel, sessionLoginDate);
        if(insertedSessionActivityResult instanceof Error){
            dbAction.rollbackTransactionSingleConnection(singleConnection);
            return httpResponseService.getResponseResultStatus(insertedSessionActivityResult, httpResponseStatus._400badRequest );
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


var service = Object.freeze({
    resolveSessionUpdateAsync: resolveSessionUpdateAsync,
    resolveGetSessionAsync : resolveGetSessionAsync,
    insertSessionAndSessionActivityTransactionAsync : insertSessionAndSessionActivityTransactionAsync
});

module.exports = service;

//#REGION Private Functions

//#ENDREGION Private Functions