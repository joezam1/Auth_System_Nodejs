const dbContext = require('../mysqlDataStore/context/dbContext.js');
const helpers = require('../../library/common/helpers.js');
const repositoryManager = require('../repositories/repositoryManager.js');
const tokenRepositoryHelper = require('../repositories/tokenRepositoryHelper.js');
const genericQueryStatement = require('../../library/enumerations/genericQueryStatement.js');


let context = '';
let tokenTableName = '';


//Test: DONE
const insertTokenIntoTableTransactionAsync = async function (connectionPool, tokenDomainModel , utcDateExpired) {
    console.log('tokenDomainModel', tokenDomainModel);
    let tokenDtoModel = tokenRepositoryHelper.getTokenDtoModelMappedFromDomain (tokenDomainModel);
    tokenDtoModel.UTCDateExpired.value = utcDateExpired;

    let propertiesArray = helpers.createPropertiesArrayFromObjectProperties(tokenDtoModel);
    let statementResult = await repositoryManager.resolveSingleConnectionStatementAsync(propertiesArray, genericQueryStatement.insertIntoTableValues, tokenTableName, connectionPool);

    return statementResult;
}
//Test: DONE
const getTokensFromDatabaseAsync = async function(tokenDomainModel){
    console.log('context', context);
    console.log('tokenTableName', tokenTableName);
    let tokenDtoModel = tokenRepositoryHelper.getTokenDtoModelMappedFromDomain(tokenDomainModel);
    let propertiesArray = [tokenDtoModel.Token, tokenDtoModel.Type];
    let statementResult = await repositoryManager.resolveStatementAsync(propertiesArray,genericQueryStatement.selectWherePropertyEqualsAnd, tokenTableName);

    if(statementResult instanceof Error){
        return statementResult;
    }
    let tokenDtoResult = tokenRepositoryHelper.getTokensDtoModelMappedFromDatabase(statementResult[0]);
    return tokenDtoResult;
}
//Test: DONE
let deleteTokenFromDatabaseAsync = async function(tokenDomainModel){
    let tokenDtoModel = tokenRepositoryHelper.getTokenDtoModelMappedFromDomain(tokenDomainModel);
    let propertiesArray = [tokenDtoModel.Token, tokenDtoModel.Type];
    let statementResult = await repositoryManager.resolveStatementAsync(propertiesArray, genericQueryStatement.deleteFromTableWhere, tokenTableName);

    return statementResult;
}
//Test: DONE
let updateTokenTableSetColumnValuesWhereAsync = async function(tokenDomainModel){

    let tokenDtoModel = tokenRepositoryHelper.getTokenDtoModelMappedFromDomain(tokenDomainModel);
    let propertiesArray = [tokenDtoModel.Token];
    let conditionalPropertiesArray = [ tokenDtoModel.TokenId ];
    let statementResult = await repositoryManager.resolveConditionalWhereEqualsStatementAsync (propertiesArray, conditionalPropertiesArray, tokenTableName);

    return statementResult;
}


onInit();

const service = {
    insertTokenIntoTableTransactionAsync: insertTokenIntoTableTransactionAsync,
    getTokensFromDatabaseAsync : getTokensFromDatabaseAsync,
    deleteTokenFromDatabaseAsync : deleteTokenFromDatabaseAsync,
    updateTokenTableSetColumnValuesWhereAsync : updateTokenTableSetColumnValuesWhereAsync
}

module.exports = service;

//#REGION Private Functions

function onInit() {
    context = dbContext.getSequelizeContext();
    let tokenDto = context.tokenDtoModel;
    tokenTableName = dbContext.getActiveDatabaseName() + '.' + tokenDto.tableName;
}

//#ENDREGION Private Functions