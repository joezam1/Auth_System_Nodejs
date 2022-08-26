const httpResponseStatus = require('../../library/enumerations/httpResponseStatus.js');
const userRegisterViewModel = require('../../presentationLayer/viewModels/userRegisterViewModel.js');
const userLoginViewModel = require('../../presentationLayer/viewModels/userLoginViewModel.js');
const uuidV4 = require('uuid');
const uuid = uuidV4.v4;
const session = require('../domainModels/session.js');
const sessionActivityViewModel = require('../../presentationLayer/viewModels/sessionActivityViewModel.js');
const userRegistrationDomainManager = require('./userRegistrationDomainManager.js');
const userLogingDomainManager = require('./userLoginDomainManager.js');
const userLogoutDomainManager = require('./userLogoutDomainManager.js');



let resolveUserRegistrationAsync = async function (request) {
    let _userViewModel = new userRegisterViewModel(request.body);

    let resultInspection = await userRegistrationDomainManager.processUserRegistrationValidationAsync(_userViewModel);
    if (resultInspection.status === httpResponseStatus._200ok) {
        let _currentUserRoleEnum = request.body.userRole;
        let _userDomainModel = resultInspection.result;
        return await userRegistrationDomainManager.processUserRegistrationStorageToDatabaseAsync(_currentUserRoleEnum, _userDomainModel);
    }
    return resultInspection;
}

let resolveUserLoginSessionAsync = async function (request) {
    console.log('resolveUserLoginSessionAsync-request', request);
    let _user = new userLoginViewModel(request.body);
    let resultInspection = await userLogingDomainManager.processUserLoginValidationAsync(_user);
    if (resultInspection.status === httpResponseStatus._200ok) {

        let _userDtoModel = resultInspection.result;
        let _sessionActivityViewModel = new sessionActivityViewModel();
        _sessionActivityViewModel.userId.fieldValue = _userDtoModel.UserId.value;
        _sessionActivityViewModel.geoLocation.fieldValue = request.body.geoLocation;
        _sessionActivityViewModel.deviceAndBrowser.fieldValue = request.body.deviceAndBrowser;
        _sessionActivityViewModel.userAgent.fieldValue = request.body.userAgent;
        return await userLogingDomainManager.processUserLoginStorageToDatabaseAsync(_userDtoModel, _sessionActivityViewModel);
    }
    return resultInspection;
}

let resolveUserLogoutSessionAsync = async function (request) {
    let _userAgent = request.body.userAgent;
    let _sessionToken = request.body.session;
    let _sessionModel = new session();
    _sessionModel.setSessionToken(_sessionToken);

    let sessionInfo = await userLogoutDomainManager.processUserLogoutCreateSessionActivityDomainModelAsync(_sessionModel, _userAgent);
    if (sessionInfo.status === httpResponseStatus._200ok) {
        let sessionActivityModel = sessionInfo.result.tempSessionActivityModel;
        let sessionUtcDateCreatedDbFormatted = sessionInfo.result.sessionUtcDateCreatedDbFormatted;

        return await userLogoutDomainManager.processUserLogoutDeleteSessionAndUpdateSessionActivityInDatabaseAsync(_sessionModel, sessionActivityModel, sessionUtcDateCreatedDbFormatted);
    }

    return sessionInfo;
}

var service = Object.freeze({
    resolveUserRegistrationAsync: resolveUserRegistrationAsync,
    resolveUserLoginSessionAsync: resolveUserLoginSessionAsync,
    resolveUserLogoutSessionAsync: resolveUserLogoutSessionAsync
});


module.exports = service;

//#REGION Private Methods



//#ENDREGION Private Methods