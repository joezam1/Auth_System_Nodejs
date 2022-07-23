const httpResponseStatus = require('../library/enumerations/httpResponseStatus');
const httpResponseManager = require('../serviceLayer/httpProtocol/httpResponseManager.js');
const userViewModel = require('../presentationLayer/viewModels/userViewModel.js');
const validationManager = require('../serviceLayer/validation/validationManager.js');
const inputCommonInspector = require('../serviceLayer/validation/inputcommonInspector.js');
const user = require('./user.js');
const userRepository = require('../dataAccessLayer/repositories/userRepository.js');
const userRoles = require('../library/enumerations/userRoles.js');
const roleRepository = require('../dataAccessLayer/repositories/roleRepository.js');
const uuidV4 = require('uuid');
const uuid = uuidV4.v4;
const role = require('./role.js');
const userRole = require('./userRole.js');
const register = require('./register.js');
const dbAction = require('../dataAccessLayer/mysqlDataStore/context/dbAction.js');
const registerRepository = require('../dataAccessLayer/repositories/registerRepository.js');
const encryptionService = require('../serviceLayer/encryption/encryptionService.js');


let resolveUserRegistrationAsync =async function(request){
    let _user = new userViewModel(request.body);
    let errorsReport = validationManager.resolveUserRegisterValidation(_user);
    if(!inputCommonInspector.objectIsNullOrEmpty(errorsReport)){
        return httpResponseManager.getResponseResultStatus(errorsReport,httpResponseStatus._401unauthorized );
    }

    let userInfo = new user();
    userInfo.setUserDetails(_user);
    var userResult = await userRepository.getUserByDataAsync(userInfo);
    if(userResult instanceof Error){
        return httpResponseManager.getResponseResultStatus(userResult,httpResponseStatus._400badRequest );
    }

    if( userResult.length > 0 ){
        let message = 'username or email already taken';
        return httpResponseManager.getResponseResultStatus(message, httpResponseStatus._401unauthorized);
    }

    let userRoleEnum = request.body.userRole;
    let selectedRoleDescription = userRoles[userRoleEnum];
    let selectedRoleObj = await getSelectedRoleAsync(selectedRoleDescription);
    if(selectedRoleObj instanceof Error){
        return httpResponseManager.getResponseResultStatus(selectedRoleObj ,httpResponseStatus._400badRequest );
    }

    if(selectedRoleObj != null){
        let userPassword = userInfo.getPassword();
        let encryptedPassword = await encryptionService.encryptStringInputAsync(userPassword);
        userInfo.setPassword(encryptedPassword);
        let resultTransaction = await createAndRegisterUserTransactionAsync(userInfo, selectedRoleObj);
        return resultTransaction;
    }

    let message = 'Registration could not be completed.';
    return httpResponseManager.getResponseResultStatus(message , httpResponseStatus._400badRequest );
}

var service = {
    resolveUserRegistrationAsync : resolveUserRegistrationAsync
}


module.exports = service;

//#REGION Private Methods

async function getSelectedRoleAsync(roleName){

    let allRolesResult = await roleRepository.getAllRolesAsync();
    if(allRolesResult instanceof Error){
        let objResponse = httpResponseManager.getResponseResultStatus(allRolesResult,httpResponseStatus._400badRequest );
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
            return httpResponseManager.getResponseResultStatus(insertedUserResult,httpResponseStatus._400badRequest );
        }

        let _userId = userInfo.getUserId();
        let _roleId = selectedRoleObj.getRoleId();
        let userRoleInfo = createUserRoleModel(_userId ,_roleId);
        let userRoleCreated = await userRepository.insertUserRoleIntoTableTransactionAsync( singleConnection , userRoleInfo);
        if(userRoleCreated instanceof Error){
            dbAction.rollbackTransactionSingleConnection(singleConnection);
            return httpResponseManager.getResponseResultStatus(userRoleCreated,httpResponseStatus._400badRequest );
        }

        let registerInfo = createRegisterModel(_userId);
        let registerCreated = await registerRepository.insertRegisterIntoTableTransactionAsync(singleConnection , registerInfo );
        if(registerCreated instanceof Error){
            dbAction.rollbackTransactionSingleConnection(singleConnection);
            return httpResponseManager.getResponseResultStatus(registerCreated,httpResponseStatus._400badRequest );
        }

        dbAction.commitTransactionSingleConnection(singleConnection);
        return httpResponseManager.getResponseResultStatus(registerCreated,httpResponseStatus._201created );
    }
    catch(error){
        console.log('error', error)
        dbAction.rollbackTransactionSingleConnection(singleConnection);
        return httpResponseManager.getResponseResultStatus(error , httpResponseStatus._400badRequest );
    }
}


//#ENDREGION Private Methods