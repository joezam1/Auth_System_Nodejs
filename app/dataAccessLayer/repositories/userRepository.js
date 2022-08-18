const dbContext = require('../mysqlDataStore/context/dbContext.js');
const helpers = require('../../library/common/helpers.js');
const repositoryHelper = require('./repositoryManager.js');
const genericQueryStatement = require('../../library/enumerations/genericQueryStatement.js');
const userRepositoryHelper = require('./userRepositoryHelper.js');


let context = null;
let userTableName = null;
let userRoleTableName = null;
//Test: DONE
const getUserByUsernameAndEmailDataAsync = async function (userDomainModel) {
    console.log('context', context);
    console.log('userTableName', userTableName);
    let userDtoModel = userRepositoryHelper.getUserDtoModelMappedFromDomain(userDomainModel);
    let propertiesArray = [userDtoModel.Username, userDtoModel.Email];
    let statementResult = await repositoryHelper.resolveStatementAsync(propertiesArray, genericQueryStatement.selectWherePropertyEqualsAnd, userTableName);
    if (statementResult instanceof Error) {
        return statementResult;
    }
    let userDtoResult = userRepositoryHelper.getUsersDtoModelMappedFromDatabase(statementResult[0]);

    return userDtoResult;
}
//Test: DONE
const insertUserIntoTableTransactionAsync = async function (connectionPool, userDomainModel) {
    console.log('userDomainModel', userDomainModel);
    let userDtoModel = userRepositoryHelper.getUserDtoModelMappedFromDomain(userDomainModel);
    let propertiesArray = helpers.createPropertiesArrayFromObjectProperties(userDtoModel);
    let statementResult = await repositoryHelper.resolveSingleConnectionStatementAsync(propertiesArray, genericQueryStatement.insertIntoTableValues, userTableName, connectionPool);

    return statementResult;
}
//Test: DONE
const insertUserRoleIntoTableTransactionAsync = async function (connectionPool, userRoleDomainModel) {
    let userRoleDtoModel = userRepositoryHelper.getUserRoleDtoModelMappedFromDomain(userRoleDomainModel);
    let propertiesArray = helpers.createPropertiesArrayFromObjectProperties(userRoleDtoModel);
    let statementResult = await repositoryHelper.resolveSingleConnectionStatementAsync(propertiesArray, genericQueryStatement.insertIntoTableValues, userRoleTableName, connectionPool);

    return statementResult;
}

onInit();

const service = {
    getUserByUsernameAndEmailDataAsync: getUserByUsernameAndEmailDataAsync,
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
