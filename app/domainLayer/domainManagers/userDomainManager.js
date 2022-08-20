const httpResponseStatus = require('../../library/enumerations/httpResponseStatus.js');
const httpResponseService = require('../../services/httpProtocol/httpResponseService.js');
const userRegisterViewModel = require('../../presentationLayer/viewModels/userRegisterViewModel.js');
const userLoginViewModel = require('../../presentationLayer/viewModels/userLoginViewModel.js');
const validationService = require('../../services/validation/validationService.js');
const inputCommonInspector = require('../../services/validation/inputCommonInspector.js');
const userRoleEnum = require('../../library/enumerations/userRole.js');
const uuidV4 = require('uuid');
const uuid = uuidV4.v4;
const user = require('../domainModels/user.js');
const role = require('../domainModels/role.js');
const session = require('../domainModels/session.js');

const domainManagerHelper = require('./domainManagerHelper.js');
const dbAction = require('../../dataAccessLayer/mysqlDataStore/context/dbAction.js');

const userRepository = require('../../dataAccessLayer/repositories/userRepository.js');
const roleRepository = require('../../dataAccessLayer/repositories/roleRepository.js');
const registerRepository = require('../../dataAccessLayer/repositories/registerRepository.js');
const sessionRepository = require('../../dataAccessLayer/repositories/sessionRepository.js');
const encryptionService = require('../../services/encryption/encryptionService.js');
const sessionService = require('../../services/authentication/sessionService.js');
const sessionConfig = require('../../../configuration/authentication/sessionConfig.js');
const notificationService = require('../../services/notifications/notificationService.js');
const sessionExpiredInspector = require('../../middleware/sessionExpiredInspector.js');
const sessionDomainManager = require('../domainManagers/sessionDomainManager.js');
const helpers = require('../../library/common/helpers.js');
const sortOrder = require('../../library/enumerations/sortOrder.js');
const sessionActivityViewModel = require('../../presentationLayer/viewModels/sessionActivityViewModel.js');


let resolveUserRegistrationAsync =async function(request){
    let _userViewModel = new userRegisterViewModel(request.body);

    let resultInspection = await processUserRegistrationValidationAsync(_userViewModel );
    if( resultInspection.status === httpResponseStatus._200ok ){
        let _currentUserRoleEnum = request.body.userRole;
        let _userDomainModel = resultInspection.result;
        return await processUserRegistrationStorageToDatabaseAsync(_currentUserRoleEnum , _userDomainModel );
    }
    return resultInspection;
}

let resolveUserLoginSessionAsync = async function(request){
    console.log('resolveUserLoginSessionAsync-request', request);
    let _user = new userLoginViewModel(request.body);
    let resultInspection = await processUserLoginValidationAsync(_user);
    if(resultInspection.status === httpResponseStatus._200ok){

        let _userDtoModel = resultInspection.result;
        let _sessionActivityViewModel = new sessionActivityViewModel();
        _sessionActivityViewModel.userId.fieldValue = _userDtoModel.UserId.value;
        _sessionActivityViewModel.geoLocation.fieldValue = request.body.geoLocation;
        _sessionActivityViewModel.deviceAndBrowser.fieldValue = request.body.deviceAndBrowser;
        _sessionActivityViewModel.userAgent.fieldValue = request.body.userAgent;
        return await processUserLoginStorageToDatabaseAsync( _userDtoModel , _sessionActivityViewModel);
    }
    return resultInspection;
}

let resolveUserLogoutSessionAsync = async function(request){
    let _userAgent = request.body.userAgent;
    let _sessionToken = request.body.session;
    let _sessionModel = new session();
    _sessionModel.setSessionToken(_sessionToken);

    let sessionInfo = await processUserLogoutCreateSessionActivityDomainModelAsync(_sessionModel , _userAgent);
    if(sessionInfo.status === httpResponseStatus._200ok){
        let sessionActivityModel = sessionInfo.result.tempSessionActivityModel;
        let sessionUtcDateCreatedDbFormatted = sessionInfo.result.sessionUtcDateCreatedDbFormatted;

        return await processUserLogoutDeleteSessionAndUpdateSessionActivityInDatabaseAsync(_sessionModel, sessionActivityModel , sessionUtcDateCreatedDbFormatted );
    }

    return sessionInfo;
}

var service = Object.freeze({
    resolveUserRegistrationAsync : resolveUserRegistrationAsync,
    resolveUserLoginSessionAsync : resolveUserLoginSessionAsync,
    resolveUserLogoutSessionAsync : resolveUserLogoutSessionAsync
});


module.exports = service;

//#REGION Private Methods

async function processUserRegistrationValidationAsync(userViewModel){
    let errorsReport = validationService.resolveUserModelValidation(userViewModel);
    if(!inputCommonInspector.objectIsNullOrEmpty(errorsReport)){
        return httpResponseService.getResponseResultStatus(errorsReport,httpResponseStatus._401unauthorized );
    }

    let _userDomainModel = new user();
    _userDomainModel.setUserDetails(userViewModel);
    var userResult = await userRepository.getUserByUsernameAndEmailDataAsync(_userDomainModel);
    if(userResult instanceof Error){
        return httpResponseService.getResponseResultStatus(userResult,httpResponseStatus._400badRequest );
    }
    else if( userResult.length > 0 ){
        return httpResponseService.getResponseResultStatus(notificationService.usernameOrEmailTaken, httpResponseStatus._401unauthorized);
    }

    return httpResponseService.getResponseResultStatus(_userDomainModel, httpResponseStatus._200ok);
}

async function processUserRegistrationStorageToDatabaseAsync(currentUserRoleEnumeration, userDomainModel ){
    let selectedRoleDescription = userRoleEnum[currentUserRoleEnumeration];
    let selectedRoleObj = await getSelectedRoleAsync(selectedRoleDescription);

    if(selectedRoleObj instanceof Error){
        return httpResponseService.getResponseResultStatus(selectedRoleObj ,httpResponseStatus._400badRequest );
    }

    else if(selectedRoleObj != null){
        let userPassword = userDomainModel.getPassword();
        let encryptedPassword = await encryptionService.encryptStringInputAsync(userPassword);
        userDomainModel.setPassword(encryptedPassword);
        let resultTransaction = await createAndRegisterUserTransactionAsync(userDomainModel, selectedRoleObj);
        return resultTransaction;
    }

    return httpResponseService.getResponseResultStatus(notificationService.registrationNotCompleted , httpResponseStatus._400badRequest );
}

async function processUserLoginValidationAsync(userViewModel){

    let errorsReport = validationService.resolveUserModelValidation(userViewModel);
    if(!inputCommonInspector.objectIsNullOrEmpty(errorsReport)){
        return httpResponseService.getResponseResultStatus(errorsReport,httpResponseStatus._401unauthorized );
    }

    let userInfo = new user();
    userInfo.setUserDetails(userViewModel);
    var UsersDtoModelArray = await userRepository.getUserByUsernameAndEmailDataAsync(userInfo);
    if(UsersDtoModelArray instanceof Error){
        return httpResponseService.getResponseResultStatus(UsersDtoModelArray,httpResponseStatus._400badRequest );
    }
    else if( UsersDtoModelArray.length === 0 ){
        return httpResponseService.getResponseResultStatus(notificationService.usernameOrPasswordNotMatching, httpResponseStatus._401unauthorized);
    }

    let pwdPlainText = userInfo.getPassword();
    let userDtoModel = UsersDtoModelArray[0];
    let pwdDatabase = userDtoModel.Password.value;
    let passwordsAreTheSame = await encryptionService.validateEncryptedPasswordAsync( pwdPlainText, pwdDatabase);
    if(!passwordsAreTheSame){
        return httpResponseService.getResponseResultStatus(notificationService.usernameOrPasswordNotMatching, httpResponseStatus._401unauthorized);
    }

    return httpResponseService.getResponseResultStatus( userDtoModel , httpResponseStatus._200ok);
}

async function processUserLoginStorageToDatabaseAsync( userDtoModel ,sessionActivityViewModel){

    let sessionToken =await sessionService.generateSessionTokenAsync();
    let cookieObj = domainManagerHelper.createCookieObj(sessionToken);
    let cookieJson = JSON.stringify(cookieObj);
    let sessionModel = domainManagerHelper.createSessionModel(userDtoModel.UserId.value, sessionToken, cookieJson, sessionConfig.SESSION_EXPIRATION_TIME_IN_MILLISECONDS);

    let currentGeoLocation = sessionActivityViewModel.geoLocation.fieldValue;
    let currentDeviceAndBrowser = sessionActivityViewModel.deviceAndBrowser.fieldValue;
    let currentUserAgent = sessionActivityViewModel.userAgent.fieldValue;
    let sessionActivityModel = domainManagerHelper.createSessionActivityModel(userDtoModel.UserId.value, currentGeoLocation, currentDeviceAndBrowser, currentUserAgent);
    let sessionResult = await sessionDomainManager.insertSessionAndSessionActivityTransactionAsync(sessionModel, sessionActivityModel);

    if(sessionResult instanceof Error || sessionResult.result instanceof Error){
       return httpResponseService.getResponseResultStatus(sessionResultArray ,httpResponseStatus._500internalServerError );
    }
    let isResultArrayOk = (sessionResult.length > 0  && sessionResult[0].affectedRows === 1 )
    let isResultObjectOk = (inputCommonInspector.objectIsValid(sessionResult) && sessionResult.result && sessionResult.status === httpResponseStatus._201created);
    if(isResultArrayOk || isResultObjectOk ){

        sessionExpiredInspector.resolveRemoveExpiredSessions();
        return httpResponseService.getResponseResultStatus( cookieObj, httpResponseStatus._200ok );
    }

    return httpResponseService.getResponseResultStatus(notificationService.errorProcessingUserLogin, httpResponseStatus._422unprocessableEntity );
}

async function processUserLogoutCreateSessionActivityDomainModelAsync(sessionDomainModel ,userAgent){

    let sessionsDtoModelResultArray = await sessionRepository.getSessionFromDatabaseAsync(sessionDomainModel);
    console.log('sesionsDtoModelResultArray', sessionsDtoModelResultArray);
    if (sessionsDtoModelResultArray instanceof Error) {
        return httpResponseService.getResponseResultStatus(sessionsDtoModelResultArray, httpResponseStatus._400badRequest);
    }
    let userId = (sessionsDtoModelResultArray.length> 0) ? sessionsDtoModelResultArray[0].UserId.value : null;
    let utcDateCreatedAsDate = (sessionsDtoModelResultArray.length> 0) ? sessionsDtoModelResultArray[0].UTCDateCreated.value : null;
    let sessionUtcDateCreatedDbFormatted = (utcDateCreatedAsDate !== null) ? helpers.composeUTCDateToUTCFormatForDatabase(utcDateCreatedAsDate) : null;

    let tempGeoLocation = {};
    let tempDevice = {};
    let tempSessionActivityModel = domainManagerHelper.createSessionActivityModel( userId, tempGeoLocation, tempDevice, userAgent );

    let sessionInfo = {
        tempSessionActivityModel : tempSessionActivityModel,
        sessionUtcDateCreatedDbFormatted : sessionUtcDateCreatedDbFormatted
    }
    return httpResponseService.getResponseResultStatus(sessionInfo, httpResponseStatus._200ok);
}

async function processUserLogoutDeleteSessionAndUpdateSessionActivityInDatabaseAsync(sessionModel, sessionActivityModel , sessionUtcDateCreatedDbFormatted){
    let sessionActivitiesResultArray =await sessionRepository.getSessionActivitiesFromDatabaseAsync(sessionActivityModel , sessionUtcDateCreatedDbFormatted);
    if (sessionActivitiesResultArray instanceof Error) {
        return httpResponseService.getResponseResultStatus(sessionActivitiesResultArray, httpResponseStatus._400badRequest);
    }
    if(Array.isArray(sessionActivitiesResultArray) && sessionActivitiesResultArray.length > 0){
        //sort array by latest to oldest date in case we receive more than one sessionActivity object
        let sortedArrayByDesc = getSortedArray(sessionActivitiesResultArray, sortOrder.descending);
        let latestSessionActivity = sortedArrayByDesc[0];
        let latestSessionActivityDomainModel = domainManagerHelper.createSessionActivityModel(latestSessionActivity.UserId.value, latestSessionActivity.GeoLocation.value,latestSessionActivity.Device.value, latestSessionActivity.UserAgent.value);
        latestSessionActivityDomainModel.setSessionActivityId(latestSessionActivity.SessionActivityId.value);

        let updateSessionActivityResult = await sessionRepository.updateSessionActivitiesTableSetColumnValuesWhereAsync(latestSessionActivityDomainModel);
        if (updateSessionActivityResult instanceof Error) {
            return httpResponseService.getResponseResultStatus(updateSessionActivityResult, httpResponseStatus._400badRequest);
        }
    }
    let sessionResultArray = await sessionRepository.deleteSessionFromDatabaseAsync(sessionModel);
    if(sessionResultArray instanceof Error){
        return httpResponseService.getResponseResultStatus(sessionResultArray, httpResponseStatus._400badRequest );
    }
    else if( sessionResultArray.length === 0 ){
        return httpResponseService.getResponseResultStatus(notificationService.sessionRemoved, httpResponseStatus._422unprocessableEntity);
    }
    else if (sessionResultArray.length > 0 && sessionResultArray[0].affectedRows === 1){
        return httpResponseService.getResponseResultStatus(notificationService.sessionRemoved, httpResponseStatus._200ok);
    }

    return httpResponseService.getResponseResultStatus(notificationService.sessionNoLongerActive, httpResponseStatus._401unauthorized);
}



async function getSelectedRoleAsync(roleName){

    let allRolesResult = await roleRepository.getAllRolesAsync();
    if(allRolesResult instanceof Error){
        let objResponse = httpResponseService.getResponseResultStatus(allRolesResult,httpResponseStatus._400badRequest );
        return objResponse;
    }

    for(let a = 0; a < allRolesResult.length; a++){
        if(allRolesResult[a].Name.value.toLowerCase() === roleName.toLowerCase()){
            let roleResponse = getRoleModelMappedFromDatabase(allRolesResult[a]);

            return roleResponse;
        }
    }
    return null;
}

function getRoleModelMappedFromDatabase(roleDtoModel){
    let _roleInfo = new role();
    _roleInfo.setRoleId(roleDtoModel.RoleId.value);
    _roleInfo.setName(roleDtoModel.Name.value);
    _roleInfo.setDescription(roleDtoModel.Description.value);
    _roleInfo.setRpleIsActive(roleDtoModel.IsActive.value);

    return _roleInfo;
}

async function createAndRegisterUserTransactionAsync(userInfo, selectedRoleObj){
    let newUuid = uuid();
    userInfo.setUserId(newUuid);
    let singleConnection = await dbAction.getSingleConnectionFromPoolPromiseAsync();
    try{
        await dbAction.beginTransactionSingleConnectionAsync(singleConnection);
        let insertedUserResult = await userRepository.insertUserIntoTableTransactionAsync(singleConnection, userInfo);

        if(insertedUserResult instanceof Error){
            dbAction.rollbackTransactionSingleConnection(singleConnection);
            return httpResponseService.getResponseResultStatus(insertedUserResult,httpResponseStatus._400badRequest );
        }

        let _userId = userInfo.getUserId();
        let _roleId = selectedRoleObj.getRoleId();
        let userRoleInfo = domainManagerHelper.createUserRoleModel(_userId ,_roleId);
        let userRoleCreated = await userRepository.insertUserRoleIntoTableTransactionAsync( singleConnection , userRoleInfo);
        if(userRoleCreated instanceof Error){
            dbAction.rollbackTransactionSingleConnection(singleConnection);
            return httpResponseService.getResponseResultStatus(userRoleCreated,httpResponseStatus._400badRequest );
        }

        let registerInfo = domainManagerHelper.createRegisterModel(_userId);
        let registerCreated = await registerRepository.insertRegisterIntoTableTransactionAsync(singleConnection , registerInfo );
        if(registerCreated instanceof Error){
            dbAction.rollbackTransactionSingleConnection(singleConnection);
            return httpResponseService.getResponseResultStatus(registerCreated,httpResponseStatus._400badRequest );
        }

        dbAction.commitTransactionSingleConnection(singleConnection);
        return httpResponseService.getResponseResultStatus(registerCreated,httpResponseStatus._201created );
    }
    catch(error){
        console.log('message: error', error)
        dbAction.rollbackTransactionSingleConnection(singleConnection);
        return httpResponseService.getResponseResultStatus(error , httpResponseStatus._400badRequest );
    }
}

function getSortedArray(ArrayOfObjects, orderType){

    function sortingCallback(itemA, itemB){
        let dateA = new Date(itemA.UTCLoginDate.value);
        let dateB = new Date(itemB.UTCLoginDate.value);
        let dateATime = dateA.getTime();
        let dateBTime = dateB.getTime();
        switch(orderType){
            case sortOrder.ascending:
                return dateATime - dateBTime;

            case sortOrder.descending:
                return dateBTime - dateATime;
        }

    }
    let sortedArray = ArrayOfObjects.sort(sortingCallback);
    return sortedArray
}
//#ENDREGION Private Methods