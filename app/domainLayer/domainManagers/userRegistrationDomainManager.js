const httpResponseStatus = require('../../library/enumerations/httpResponseStatus.js');
const httpResponseService = require('../../services/httpProtocol/httpResponseService.js');
const validationService = require('../../services/validation/validationService.js');
const inputCommonInspector = require('../../services/validation/inputCommonInspector.js');
const userRoleEnum = require('../../library/enumerations/userRole.js');
const uuidV4 = require('uuid');
const uuid = uuidV4.v4;

const domainManagerHelper = require('./domainManagerHelper.js');
const dbAction = require('../../dataAccessLayer/mysqlDataStore/context/dbAction.js');

const userRepository = require('../../dataAccessLayer/repositories/userRepository.js');
const roleRepository = require('../../dataAccessLayer/repositories/roleRepository.js');
const registerRepository = require('../../dataAccessLayer/repositories/registerRepository.js');
const roleRepositoryHelper = require('../../dataAccessLayer/repositories/roleRepositoryHelper.js');
const encryptionService = require('../../services/encryption/encryptionService.js');
const notificationService = require('../../services/notifications/notificationService.js');
const userModel = require('../domainModels/user');


//Test: DONE
async function processUserRegistrationValidationAsync(userViewModel) {
    let errorsReport = validationService.resolveUserModelValidation(userViewModel);
    if (!inputCommonInspector.objectIsNullOrEmpty(errorsReport)) {
        return httpResponseService.getResponseResultStatus(errorsReport, httpResponseStatus._401unauthorized);
    }

    let _userDomainModel = new userModel();
    _userDomainModel.setUserDetails(userViewModel);
    var userResult = await userRepository.getUserByUsernameAndEmailDataAsync(_userDomainModel);
    if (userResult instanceof Error) {
        return httpResponseService.getResponseResultStatus(userResult, httpResponseStatus._400badRequest);
    }
    else if (userResult.length > 0) {
        return httpResponseService.getResponseResultStatus(notificationService.usernameOrEmailTaken, httpResponseStatus._401unauthorized);
    }

    return httpResponseService.getResponseResultStatus(_userDomainModel, httpResponseStatus._200ok);
}

//Test: DONE
async function processUserRegistrationStorageToDatabaseAsync(currentUserRoleEnumeration, userDomainModel) {
    let selectedRoleDescription = userRoleEnum[currentUserRoleEnumeration];
    let selectedRoleObj = await getSelectedRoleAsync(selectedRoleDescription);

    if (selectedRoleObj instanceof Error) {
        return httpResponseService.getResponseResultStatus(selectedRoleObj, httpResponseStatus._400badRequest);
    }

    else if (selectedRoleObj != null) {
        let userPassword = userDomainModel.getPassword();
        let encryptedPassword = await encryptionService.encryptStringInputAsync(userPassword);
        userDomainModel.setPassword(encryptedPassword);
        let resultTransaction = await createAndRegisterUserTransactionAsync(userDomainModel, selectedRoleObj);
        return resultTransaction;
    }

    return httpResponseService.getResponseResultStatus(notificationService.registrationNotCompleted, httpResponseStatus._400badRequest);
}


const service = {
    processUserRegistrationValidationAsync : processUserRegistrationValidationAsync,
    processUserRegistrationStorageToDatabaseAsync : processUserRegistrationStorageToDatabaseAsync
}

module.exports = service;


//#REGION Private Functions

async function getSelectedRoleAsync(roleName) {

    let allRolesResult = await roleRepository.getAllRolesAsync();
    if (allRolesResult instanceof Error) {
        let objResponse = httpResponseService.getResponseResultStatus(allRolesResult, httpResponseStatus._400badRequest);
        return objResponse;
    }

    for (let a = 0; a < allRolesResult.length; a++) {
        if (allRolesResult[a].Name.value.toLowerCase() === roleName.toLowerCase()) {
            let roleResponse = roleRepositoryHelper.getRoleModelMappedFromRoleDtoModel(allRolesResult[a]);

            return roleResponse;
        }
    }
    return null;
}


async function createAndRegisterUserTransactionAsync(userInfo, selectedRoleObj) {
    let newUuid = uuid();
    userInfo.setUserId(newUuid);
    let singleConnection = await dbAction.getSingleConnectionFromPoolPromiseAsync();
    try {
        await dbAction.beginTransactionSingleConnectionAsync(singleConnection);
        let insertedUserResult = await userRepository.insertUserIntoTableTransactionAsync(singleConnection, userInfo);

        if (insertedUserResult instanceof Error) {
            dbAction.rollbackTransactionSingleConnection(singleConnection);
            return httpResponseService.getResponseResultStatus(insertedUserResult, httpResponseStatus._400badRequest);
        }

        let _userId = userInfo.getUserId();
        let _roleId = selectedRoleObj.getRoleId();
        let userRoleInfo = domainManagerHelper.createUserRoleModel(_userId, _roleId);
        let userRoleCreated = await userRepository.insertUserRoleIntoTableTransactionAsync(singleConnection, userRoleInfo);
        if (userRoleCreated instanceof Error) {
            dbAction.rollbackTransactionSingleConnection(singleConnection);
            return httpResponseService.getResponseResultStatus(userRoleCreated, httpResponseStatus._400badRequest);
        }

        let registerInfo = domainManagerHelper.createRegisterModel(_userId);
        let registerCreated = await registerRepository.insertRegisterIntoTableTransactionAsync(singleConnection, registerInfo);
        if (registerCreated instanceof Error) {
            dbAction.rollbackTransactionSingleConnection(singleConnection);
            return httpResponseService.getResponseResultStatus(registerCreated, httpResponseStatus._400badRequest);
        }

        dbAction.commitTransactionSingleConnection(singleConnection);
        return httpResponseService.getResponseResultStatus(registerCreated, httpResponseStatus._201created);
    }
    catch (error) {
        console.log('message: error', error)
        dbAction.rollbackTransactionSingleConnection(singleConnection);
        return httpResponseService.getResponseResultStatus(error, httpResponseStatus._400badRequest);
    }
}
//#ENDREGION Private Functions
