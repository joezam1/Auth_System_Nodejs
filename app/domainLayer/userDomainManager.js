const httpResponseStatus = require('../library/enumerations/httpResponseStatus');
const httpResponseService = require('../services/httpProtocol/httpResponseService.js');
const userRegisterViewModel = require('../presentationLayer/viewModels/userRegisterViewModel.js');
const userLoginViewModel = require('../presentationLayer/viewModels/userLoginViewModel.js');
const validationService = require('../services/validation/validationService.js');
const inputCommonInspector = require('../services/validation/inputCommonInspector.js');
const userRoles = require('../library/enumerations/userRoles.js');
const uuidV4 = require('uuid');
const uuid = uuidV4.v4;
const user = require('./user.js');
const role = require('./role.js');
const userRole = require('./userRole.js');
const register = require('./register.js');
const session = require('./session.js');
const domainManagerHelper = require('./domainManagerHelper.js');
const dbAction = require('../dataAccessLayer/mysqlDataStore/context/dbAction.js');

const userRepository = require('../dataAccessLayer/repositories/userRepository.js');
const roleRepository = require('../dataAccessLayer/repositories/roleRepository.js');
const registerRepository = require('../dataAccessLayer/repositories/registerRepository.js');
const sessionRepository = require('../dataAccessLayer/repositories/sessionRepository.js');
const encryptionService = require('../services/encryption/encryptionService.js');
const sessionService = require('../services/authentication/sessionService.js');
const sessionConfig = require('../../configuration/authentication/sessionConfig.js');
const notificationService = require('../services/notifications/notificationService.js');
const sessionExpiredInspector = require('../middleware/sessionExpiredInspector.js');

let resolveUserRegistrationAsync =async function(request){
    let _user = new userRegisterViewModel(request.body);
    let errorsReport = validationService.resolveUserModelValidation(_user);
    if(!inputCommonInspector.objectIsNullOrEmpty(errorsReport)){
        return httpResponseService.getResponseResultStatus(errorsReport,httpResponseStatus._401unauthorized );
    }

    let userInfo = new user();
    userInfo.setUserDetails(_user);
    var userResult = await userRepository.getUserByUsernameAndEmailDataAsync(userInfo);
    if(userResult instanceof Error){
        return httpResponseService.getResponseResultStatus(userResult,httpResponseStatus._400badRequest );
    }

    else if( userResult.length > 0 ){
        return httpResponseService.getResponseResultStatus(notificationService.usernameOrEmailTaken, httpResponseStatus._401unauthorized);
    }

    let userRoleEnum = request.body.userRole;
    let selectedRoleDescription = userRoles[userRoleEnum];
    let selectedRoleObj = await getSelectedRoleAsync(selectedRoleDescription);
    if(selectedRoleObj instanceof Error){
        return httpResponseService.getResponseResultStatus(selectedRoleObj ,httpResponseStatus._400badRequest );
    }

    else if(selectedRoleObj != null){
        let userPassword = userInfo.getPassword();
        let encryptedPassword = await encryptionService.encryptStringInputAsync(userPassword);
        userInfo.setPassword(encryptedPassword);
        let resultTransaction = await createAndRegisterUserTransactionAsync(userInfo, selectedRoleObj);
        return resultTransaction;
    }

    return httpResponseService.getResponseResultStatus(notificationService.registrationNotCompleted , httpResponseStatus._400badRequest );
}

let resolveUserLoginSessionAsync = async function(request){
    let _user = new userLoginViewModel(request.body);
    let errorsReport = validationService.resolveUserModelValidation(_user);
    if(!inputCommonInspector.objectIsNullOrEmpty(errorsReport)){
        return httpResponseService.getResponseResultStatus(errorsReport,httpResponseStatus._401unauthorized );
    }

    let userInfo = new user();
    userInfo.setUserDetails(_user);
    var UsersDtoModelArray = await userRepository.getUserByUsernameAndEmailDataAsync(userInfo);
    if(UsersDtoModelArray instanceof Error){
        return httpResponseService.getResponseResultStatus(UsersDtoModelArray,httpResponseStatus._400badRequest );
    }
    else if( UsersDtoModelArray.length === 0 ){
        return httpResponseService.getResponseResultStatus(notificationService.usernameOrPasswordNotMatching, httpResponseStatus._401unauthorized);
    }

    let pwdPlainText = userInfo.getPassword();
    let UsersDtoModel = UsersDtoModelArray[0];
    let pwdDatabase = UsersDtoModel.Password.value;
    let passwordsAreTheSame = await encryptionService.validateEncryptedPasswordAsync( pwdPlainText, pwdDatabase);
    if(!passwordsAreTheSame){
        return httpResponseService.getResponseResultStatus(notificationService.usernameOrPasswordNotMatching, httpResponseStatus._401unauthorized);
    }

    let sessionToken =await sessionService.generateSessionTokenAsync();
    let cookieObj = domainManagerHelper.createCookieObj(sessionToken);
    let cookieJson = JSON.stringify(cookieObj);
    let sessionModel = domainManagerHelper.createSessionModel(UsersDtoModel.UserId.value, sessionToken, cookieJson, sessionConfig.SESSION_EXPIRATION_TIME_IN_MILLISECONDS);

    let sessionResultArray = await sessionRepository.insertSessionIntoTableAsync(sessionModel);
    if(sessionResultArray instanceof Error){
       return httpResponseService.getResponseResultStatus(sessionResultArray ,httpResponseStatus._400badRequest );
    }
    else if(sessionResultArray.length > 0  && sessionResultArray[0].affectedRows === 1 ){
        //sessionExpiredInspector.resolveRemoveExpiredSessions();
        return httpResponseService.getResponseResultStatus(cookieObj,httpResponseStatus._200ok );
    }

    return httpResponseService.getResponseResultStatus(notificationService.errorProcessingUserLogin, httpResponseStatus._422unprocessableEntity );
}

let resolveUserLogoutSessionAsync = async function(request){
    let sessionValue = request.body.session;
    let sessionModel = new session();
    sessionModel.setSessionToken(sessionValue);
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

var service = {
    resolveUserRegistrationAsync : resolveUserRegistrationAsync,
    resolveUserLoginSessionAsync : resolveUserLoginSessionAsync,
    resolveUserLogoutSessionAsync : resolveUserLogoutSessionAsync
}


module.exports = service;

//#REGION Private Methods

async function getSelectedRoleAsync(roleName){

    let allRolesResult = await roleRepository.getAllRolesAsync();
    if(allRolesResult instanceof Error){
        let objResponse = httpResponseService.getResponseResultStatus(allRolesResult,httpResponseStatus._400badRequest );
        return objResponse;
    }

    for(let a = 0; a < allRolesResult.length; a++){
        if(allRolesResult[a].Name.value.toLowerCase() === roleName.toLowerCase()){
            let roleResponse = getMappedRoleModel(allRolesResult[a]);

            return roleResponse;
        }
    }
    return null;
}

function getMappedRoleModel(roleDtoModel){
    let _roleInfo = new role();
    _roleInfo.setRoleId(roleDtoModel.RoleId.value);
    _roleInfo.setName(roleDtoModel.Name.value);
    _roleInfo.setDescription(roleDtoModel.Description.value);
    _roleInfo.setRpleIsActive(roleDtoModel.IsActive.value);

    return _roleInfo;
}

function createUserRoleModel(userId, roleId){
    let _userRoleInfo = new userRole();
    let userRoleUuid = uuid();
    _userRoleInfo.setUserRoleId(userRoleUuid);
    _userRoleInfo.setUserId(userId);
    _userRoleInfo.setRoleId(roleId);

    return _userRoleInfo;
}

function createRegisterModel(userId){
    let _registerInfo = new register();
    let registerUuid = uuid();
    _registerInfo.setRegisterId(registerUuid);
    _registerInfo.setUserId(userId);
    if(_registerInfo.getRegisterStatusIsActive() === false){
        _registerInfo.setRegisterIsActive(true);
    }

    return _registerInfo
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
        let userRoleInfo = createUserRoleModel(_userId ,_roleId);
        let userRoleCreated = await userRepository.insertUserRoleIntoTableTransactionAsync( singleConnection , userRoleInfo);
        if(userRoleCreated instanceof Error){
            dbAction.rollbackTransactionSingleConnection(singleConnection);
            return httpResponseService.getResponseResultStatus(userRoleCreated,httpResponseStatus._400badRequest );
        }

        let registerInfo = createRegisterModel(_userId);
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


//#ENDREGION Private Methods