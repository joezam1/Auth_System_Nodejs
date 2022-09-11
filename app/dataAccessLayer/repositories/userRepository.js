const dbContext = require('../mysqlDataStore/context/dbContext.js');
const helpers = require('../../library/common/helpers.js');
const repositoryManager = require('./repositoryManager.js');
const genericQueryStatement = require('../../library/enumerations/genericQueryStatement.js');
const userRepositoryHelper = require('./userRepositoryHelper.js');
const roleRepository = require('../repositories/roleRepository.js');
const inputCommonInspector = require('../../services/validation/inputCommonInspector.js');
const userRoleEnum = require('../../library/enumerations/userRole.js');
const monitorService = require('../../services/monitoring/monitorService.js');




let context = null;
let userTableName = null;
let userRoleTableName = null;

//Test: DONE
const getUserByUsernameAndEmailDataAsync = async function (userDomainModel) {
    monitorService.capture('context', context);
    monitorService.capture('userTableName', userTableName);
    let userDtoModel = userRepositoryHelper.getUserDtoModelMappedFromDomain (userDomainModel);
    let propertiesArray = [userDtoModel.Username, userDtoModel.Email];
    let statementResult = await repositoryManager.resolveStatementAsync(propertiesArray, genericQueryStatement.selectWherePropertyEqualsAnd, userTableName);
    if (statementResult instanceof Error) {
        return statementResult;
    }
    let userDtoResult = userRepositoryHelper.getUsersDtoModelMappedFromDatabase(statementResult[0]);

    return userDtoResult;
}

//Test: DONE
const getAllUserRolesByUserIdAsync = async function (userDomainModel) {

    monitorService.capture('context', context);
    monitorService.capture('userRoleTableName', userRoleTableName);
    let userDtoModel = userRepositoryHelper.getUserDtoModelMappedFromDomain(userDomainModel);
    let propertiesArray = [userDtoModel.UserId];
    let statementResult = await repositoryManager.resolveStatementAsync(propertiesArray, genericQueryStatement.selectWherePropertyEqualsAnd, userRoleTableName);
    if (statementResult instanceof Error) {
        return statementResult;
    }
    let userRolesDtoResult = userRepositoryHelper.getUserRolesDtoModelMappedFromDatabase(statementResult[0]);

    return userRolesDtoResult;

}

//Test: DONE
const convertAllUserRolesFromDatabaseToUserRoleEnumsAsync = async function (allUserRolesDtoModelArray) {

    let allRolesResult = await roleRepository.getAllRolesAsync();
    if (allRolesResult instanceof Error) {
        let objResponse = httpResponseService.getResponseResultStatus(allRolesResult, httpResponseStatus._400badRequest);
        return objResponse;
    }

    let userRolesEnumArray = [];
    for (let a = 0; a < allUserRolesDtoModelArray.length; a++) {

        let userRole = allUserRolesDtoModelArray[a];
        let selectedRole = allRolesResult.find((roleObj) => {
            return (roleObj.RoleId.value === userRole.RoleId.value);
        });
        if (inputCommonInspector.inputExist(selectedRole)) {
            let roleEnumValue = userRoleEnum[selectedRole.Name.value];
            userRolesEnumArray.push(roleEnumValue);
        }

    }
    return userRolesEnumArray;

}

//Test: DONE
const insertUserIntoTableTransactionAsync = async function (connectionPool, userDomainModel) {
    monitorService.capture('userDomainModel', userDomainModel);
    let userDtoModel = userRepositoryHelper.getUserDtoModelMappedFromDomain(userDomainModel);
    let propertiesArray = helpers.createPropertiesArrayFromObjectProperties(userDtoModel);
    let statementResult = await repositoryManager.resolveSingleConnectionStatementAsync(propertiesArray, genericQueryStatement.insertIntoTableValues, userTableName, connectionPool);

    return statementResult;
}

//Test: DONE
const insertUserRoleIntoTableTransactionAsync = async function (connectionPool, userRoleDomainModel) {
    let userRoleDtoModel = userRepositoryHelper.getUserRoleDtoModelMappedFromDomain(userRoleDomainModel);
    let propertiesArray = helpers.createPropertiesArrayFromObjectProperties(userRoleDtoModel);
    let statementResult = await repositoryManager.resolveSingleConnectionStatementAsync(propertiesArray, genericQueryStatement.insertIntoTableValues, userRoleTableName, connectionPool);

    return statementResult;
}



onInit();

const service = {
    getUserByUsernameAndEmailDataAsync: getUserByUsernameAndEmailDataAsync,
    getAllUserRolesByUserIdAsync: getAllUserRolesByUserIdAsync,
    convertAllUserRolesFromDatabaseToUserRoleEnumsAsync : convertAllUserRolesFromDatabaseToUserRoleEnumsAsync,
    insertUserIntoTableTransactionAsync: insertUserIntoTableTransactionAsync,
    insertUserRoleIntoTableTransactionAsync: insertUserRoleIntoTableTransactionAsync
}

module.exports = service;


//#REGION Private Functions
function onInit() {
    context = dbContext.getSequelizeContext();
    userTableName = dbContext.getActiveDatabaseName() + '.' + context.userDtoModel.tableName;
    userRoleTableName = dbContext.getActiveDatabaseName() + '.' + context.userRoleDtoModel.tableName;
}

//#ENDREGION Private Functions
