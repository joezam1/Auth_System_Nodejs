const httpResponseStatus = require('../../library/enumerations/httpResponseStatus.js');
const httpResponseService = require('../../services/httpProtocol/httpResponseService.js');
const domainManagerHelper = require('./domainManagerHelper.js');
const sessionRepository = require('../../dataAccessLayer/repositories/sessionRepository.js');
const tokenRepository = require('../../dataAccessLayer/repositories/tokenRepository.js');
const notificationService = require('../../services/notifications/notificationService.js');
const helpers = require('../../library/common/helpers.js');
const sortOrder = require('../../library/enumerations/sortOrder.js');
const tokenType = require('../../library/enumerations/tokenType.js');


//Test:DONE
const processUserLogoutCreateTempSessionActivityDomainModelAsync = async function(sessionDomainModel, userAgent) {

    let sessionsDtoModelResultArray = await sessionRepository.getSessionFromDatabaseAsync(sessionDomainModel);
    console.log('sesionsDtoModelResultArray', sessionsDtoModelResultArray);
    if (sessionsDtoModelResultArray instanceof Error) {
        return httpResponseService.getResponseResultStatus(sessionsDtoModelResultArray, httpResponseStatus._400badRequest);
    }
    let userId = (sessionsDtoModelResultArray.length > 0) ? sessionsDtoModelResultArray[0].UserId.value : null;
    let utcDateCreatedAsDate = (sessionsDtoModelResultArray.length > 0) ? sessionsDtoModelResultArray[0].UTCDateCreated.value : null;
    let sessionUtcDateCreatedDbFormatted = (utcDateCreatedAsDate !== null) ? helpers.composeUTCDateToUTCFormatForDatabase(utcDateCreatedAsDate) : null;

    let tempGeoLocation = {};
    let tempDevice = {};
    let tempSessionActivityModel = domainManagerHelper.createSessionActivityModel(userId, tempGeoLocation, tempDevice, userAgent);

    let sessionInfo = {
        tempSessionActivityModel: tempSessionActivityModel,
        sessionUtcDateCreatedDbFormatted: sessionUtcDateCreatedDbFormatted
    }
    return httpResponseService.getResponseResultStatus(sessionInfo, httpResponseStatus._200ok);
}
//Test:DONE
const processUserLogoutDeleteSessionAndUpdateSessionActivityInDatabaseAsync =async function(sessionModel, sessionActivityModel, sessionUtcDateCreatedDbFormatted) {

    let resultUpdate = await updateSessionActivitiesAsync(sessionActivityModel, sessionUtcDateCreatedDbFormatted);
    if (resultUpdate instanceof Error) {
        return httpResponseService.getResponseResultStatus(resultUpdate, httpResponseStatus._400badRequest);
    }
    return await deleteSessionAsync(sessionModel);

}

const processUserlogoutDeleteJwtRefreshTokenAsync = async function(jwtRefreshToken){

    let tempUserId = null;
    let tempPayload = null;
    let tempTokenModel = domainManagerHelper.createTokenModel(tempUserId, jwtRefreshToken, tokenType.jwtRefreshToken, tempPayload);
    let resultTokenDeleted = await tokenRepository.deleteTokenFromDatabaseAsync(tempTokenModel);
    if (resultTokenDeleted instanceof Error) {
        return httpResponseService.getResponseResultStatus(resultTokenDeleted, httpResponseStatus._400badRequest);
    }
    return httpResponseService.getResponseResultStatus(resultTokenDeleted, httpResponseStatus._200ok);
}

const service = {
    processUserLogoutCreateTempSessionActivityDomainModelAsync: processUserLogoutCreateTempSessionActivityDomainModelAsync,
    processUserLogoutDeleteSessionAndUpdateSessionActivityInDatabaseAsync: processUserLogoutDeleteSessionAndUpdateSessionActivityInDatabaseAsync,
    processUserlogoutDeleteJwtRefreshTokenAsync : processUserlogoutDeleteJwtRefreshTokenAsync
}

module.exports = service;


//#REGION Private Functions

async function updateSessionActivitiesAsync(sessionActivityModel, sessionUtcDateCreatedDbFormatted) {

    let sessionActivitiesResultArray = await sessionRepository.getSessionActivitiesFromDatabaseAsync(sessionActivityModel, sessionUtcDateCreatedDbFormatted);
    if (sessionActivitiesResultArray instanceof Error) {
        return httpResponseService.getResponseResultStatus(sessionActivitiesResultArray, httpResponseStatus._400badRequest);
    }
    if (Array.isArray(sessionActivitiesResultArray) && sessionActivitiesResultArray.length > 0) {
        //sort array by latest to oldest date in case we receive more than one sessionActivity object
        let sortedArrayByDesc = getSortedArray(sessionActivitiesResultArray, sortOrder.descending);
        let latestSessionActivity = sortedArrayByDesc[0];
        let latestSessionActivityDomainModel = domainManagerHelper.createSessionActivityModel(latestSessionActivity.UserId.value, latestSessionActivity.GeoLocation.value, latestSessionActivity.Device.value, latestSessionActivity.UserAgent.value);
        latestSessionActivityDomainModel.setSessionActivityId(latestSessionActivity.SessionActivityId.value);

        let updateSessionActivityResult = await sessionRepository.updateSessionActivitiesTableSetColumnValuesWhereAsync(latestSessionActivityDomainModel);
        if (updateSessionActivityResult instanceof Error) {
            return httpResponseService.getResponseResultStatus(updateSessionActivityResult, httpResponseStatus._400badRequest);
        }
    }
    return httpResponseService.getResponseResultStatus(sessionActivitiesResultArray, httpResponseStatus._200ok);
}




function getSortedArray(ArrayOfObjects, orderType) {

    function sortingCallback(itemA, itemB) {
        let dateA = new Date(itemA.UTCLoginDate.value);
        let dateB = new Date(itemB.UTCLoginDate.value);
        let dateATime = dateA.getTime();
        let dateBTime = dateB.getTime();
        switch (orderType) {
            case sortOrder.ascending:
                return dateATime - dateBTime;

            case sortOrder.descending:
                return dateBTime - dateATime;
        }

    }
    let sortedArray = ArrayOfObjects.sort(sortingCallback);
    return sortedArray;

}


async function deleteSessionAsync(sessionModel){

    let sessionResultArray = await sessionRepository.deleteSessionFromDatabaseAsync(sessionModel);
    if (sessionResultArray instanceof Error) {
        return httpResponseService.getResponseResultStatus(sessionResultArray, httpResponseStatus._400badRequest);
    }
    else if (sessionResultArray.length === 0) {
        return httpResponseService.getResponseResultStatus(notificationService.sessionRemoved, httpResponseStatus._422unprocessableEntity);
    }
    else if (sessionResultArray.length > 0 && sessionResultArray[0].affectedRows === 1) {
        return httpResponseService.getResponseResultStatus(notificationService.sessionRemoved, httpResponseStatus._200ok);
    }

    return httpResponseService.getResponseResultStatus(notificationService.sessionNoLongerActive, httpResponseStatus._401unauthorized);
}
//#ENDREGION Private Functions