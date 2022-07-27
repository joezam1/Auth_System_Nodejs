const httpResponseStatus = require('../library/enumerations/httpResponseStatus');
const httpResponseService = require('../serviceLayer/httpProtocol/httpResponseService.js');
const userRegisterViewModel = require('../presentationLayer/viewModels/userRegisterViewModel.js');
const userLoginViewModel = require('../presentationLayer/viewModels/userLoginViewModel.js');
const validationService = require('../serviceLayer/validation/validationService.js');
const inputCommonInspector = require('../serviceLayer/validation/inputcommonInspector.js');
const userRoles = require('../library/enumerations/userRoles.js');
const uuidV4 = require('uuid');
const uuid = uuidV4.v4;
const user = require('./user.js');
const role = require('./role.js');
const userRole = require('./userRole.js');
const register = require('./register.js');
const session = require('./session.js');
const cookieModel = require('./cookie.js');
const dbAction = require('../dataAccessLayer/mysqlDataStore/context/dbAction.js');

const userRepository = require('../dataAccessLayer/repositories/userRepository.js');
const roleRepository = require('../dataAccessLayer/repositories/roleRepository.js');
const registerRepository = require('../dataAccessLayer/repositories/registerRepository.js');
const sessionRepository = require('../dataAccessLayer/repositories/sessionRepository.js');
const encryptionService = require('../serviceLayer/encryption/encryptionService.js');
const loginSessionService = require('../serviceLayer/authentication/loginSessionService.js');
const sessionConfig = require('../../configuration/authentication/sessionConfig.js');

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

    if( userResult.length > 0 ){
        let message = 'username or email already taken';
        return httpResponseService.getResponseResultStatus(message, httpResponseStatus._401unauthorized);
    }

    let userRoleEnum = request.body.userRole;
    let selectedRoleDescription = userRoles[userRoleEnum];
    let selectedRoleObj = await getSelectedRoleAsync(selectedRoleDescription);
    if(selectedRoleObj instanceof Error){
        return httpResponseService.getResponseResultStatus(selectedRoleObj ,httpResponseStatus._400badRequest );
    }

    if(selectedRoleObj != null){
        let userPassword = userInfo.getPassword();
        let encryptedPassword = await encryptionService.encryptStringInputAsync(userPassword);
        userInfo.setPassword(encryptedPassword);
        let resultTransaction = await createAndRegisterUserTransactionAsync(userInfo, selectedRoleObj);
        return resultTransaction;
    }

    let message = 'Registration could not be completed.';
    return httpResponseService.getResponseResultStatus(message , httpResponseStatus._400badRequest );
}



let resolveUserLoginSessionAsync = async function(request){
    let _user = new userLoginViewModel(request.body);
    let errorsReport = validationService.resolveUserModelValidation(_user);
    if(!inputCommonInspector.objectIsNullOrEmpty(errorsReport)){
        return httpResponseService.getResponseResultStatus(errorsReport,httpResponseStatus._401unauthorized );
    }
    //Create user DOMAIN MODEL
    let userInfo = new user();
    userInfo.setUserDetails(_user);
    var UsersDtoModelArray = await userRepository.getUserByUsernameAndEmailDataAsync(userInfo);
    if(UsersDtoModelArray instanceof Error){
        return httpResponseService.getResponseResultStatus(UsersDtoModelArray,httpResponseStatus._400badRequest );
    }
    else if( UsersDtoModelArray.length === 0 ){
        let message = 'username or password do not match records.';
        return httpResponseService.getResponseResultStatus(message, httpResponseStatus._401unauthorized);
    }

    let pwdPlainText = userInfo.getPassword();
    let UsersDtoModel = UsersDtoModelArray[0];
    let pwdDatabase = UsersDtoModel.Password.value;
    let passwordsAreTheSame = await encryptionService.validateEncryptedPasswordAsync( pwdPlainText, pwdDatabase);
    if(!passwordsAreTheSame){
        let message = 'username or password do not match records.';
        return httpResponseService.getResponseResultStatus(message, httpResponseStatus._401unauthorized);
    }

    let sessionToken =await loginSessionService.generateSessionTokenAsync();
    let cookieObj = createCookieObj(sessionToken);
    let cookieJson = JSON.stringify(cookieObj);
    let sessionModel = createSessionModel(UsersDtoModel.UserId.value, sessionToken, cookieJson, sessionConfig.SESSION_EXPIRATION_TIME);

    let sessionResult = await sessionRepository.insertSessionIntoTableAsync(sessionModel);
    if(sessionResult instanceof Error){
       return httpResponseService.getResponseResultStatus(sessionResult ,httpResponseStatus._400badRequest );
    }
    return httpResponseService.getResponseResultStatus(cookieObj,httpResponseStatus._200ok );

}

var service = {
    resolveUserRegistrationAsync : resolveUserRegistrationAsync,
    resolveUserLoginSessionAsync : resolveUserLoginSessionAsync
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

function createCookieObj(sessionToken){
    let defaultPath = '/';
    let _cookieModel = new cookieModel();
    _cookieModel.setName(sessionConfig.SESSION_NAME);
    _cookieModel.setValue(sessionToken);
    _cookieModel.setProperties(defaultPath, sessionConfig.SESSION_EXPIRATION_TIME,true);
    let cookieObject = _cookieModel.getCookieObject();
    return cookieObject;
}

function createSessionModel(userId, sessionToken, data, expirationTimeMilliseconds){
    let sessionUuid = uuid();
    let _sessionModel  = new session();
    _sessionModel.setSessionId(sessionUuid);
    _sessionModel.setUserId(userId);
    _sessionModel.setSessionToken(sessionToken);
    _sessionModel.setData(data);
    _sessionModel.setExpiryInMilliseconds(expirationTimeMilliseconds);
    _sessionModel.setSessionStatusIsActive(true);

    return _sessionModel;
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
        console.log('error', error)
        dbAction.rollbackTransactionSingleConnection(singleConnection);
        return httpResponseService.getResponseResultStatus(error , httpResponseStatus._400badRequest );
    }
}


//#ENDREGION Private Methods