const dbContext = require('../mysqlDataStore/context/dbContext.js');
const helpers = require('../../library/common/helpers.js');
const repositoryHelper = require('./repositoryManager.js');
const genericQueryStatement = require('../../library/enumerations/genericQueryStatement.js');
const registerRepositoryHelper = require('./registerRepositoryHelper.js');

let context = null;
let registerTableName = null;

//Test: DONE
let insertRegisterIntoTableTransactionAsync = async function(connectionPool, registerDomainModel){
    let registerDtoModel = registerRepositoryHelper.getRegisterDtoModelMappedFromDomain(registerDomainModel);
    let propertiesArray = helpers.createPropertiesArrayFromObjectProperties(registerDtoModel);
    let statementResult = await repositoryHelper.resolveSingleConnectionStatementAsync(propertiesArray, genericQueryStatement.insertIntoTableValues, registerTableName, connectionPool);

    return statementResult;

}

onInit();

let services = {
    insertRegisterIntoTableTransactionAsync : insertRegisterIntoTableTransactionAsync,
}
module.exports = services;

//REGION Private Functions

function onInit(){
    context = dbContext.getSequelizeContext();
    registerTableName = dbContext.getActiveDatabaseName() + '.' + context.registerDtoModel.tableName;
}

//ENDREGION Private Functions