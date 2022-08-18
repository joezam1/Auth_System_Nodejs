const dbContext = require('../mysqlDataStore/context/dbContext.js');
const helpers = require('../../library/common/helpers.js');
const repositoryManager = require('./repositoryManager.js');
const genericQueryStatement = require('../../library/enumerations/genericQueryStatement.js');

const sessionRepositoryHelper = require('../repositories/sessionRepositoryHelper.js');



let context = null;
let sessionTableName = null;
let sessionActivityTableName = null;


//Test: DONE
let insertSessionIntoTableTransactionAsync = async function ( connectionPool, sessionDomainModel ) {
    console.log('context', context);
    console.log('sessionTableName', sessionTableName);
    console.log('sessionDomainModel', sessionDomainModel);
    let sessionDtoModel = sessionRepositoryHelper.getSessionDtoModelMappedFromDomain(sessionDomainModel);
    console.log('sessionDtoModel: ', sessionDtoModel);
    let propertiesArray = helpers.createPropertiesArrayFromObjectProperties(sessionDtoModel);

    let statementResult = await repositoryManager.resolveSingleConnectionStatementAsync(propertiesArray, genericQueryStatement.insertIntoTableValues, sessionTableName, connectionPool);

    return Object.freeze({
        statementResult : statementResult,
        sessionDtoModel : sessionDtoModel
    });
}
//Test: DONE
let insertSessionActivityIntoTableTransacionAsync = async function(connectionPool,  sessionActivityDomainModel , sessionLoginDate){
    console.log('sessionActivityDomainModel', sessionActivityDomainModel);
    let sessionActivityDtoModel = sessionRepositoryHelper.getSessionActivityDtoModelMappedFromDomain(sessionActivityDomainModel);
    sessionActivityDtoModel.UTCLoginDate.value = sessionLoginDate;
    sessionActivityDtoModel.UTCLogoutDate.value = null;
    let propertiesArray = helpers.createPropertiesArrayFromObjectProperties(sessionActivityDtoModel);

    let statementResult = await repositoryManager.resolveSingleConnectionStatementAsync(propertiesArray, genericQueryStatement.insertIntoTableValues, sessionActivityTableName, connectionPool);

    return statementResult;
}

//Test: DONE
let getSessionFromDatabaseAsync = async function(sessionDomainModel){
    console.log('context', context);
    console.log('sessionTableName', sessionTableName);
    let sessionDtoModel = sessionRepositoryHelper.getSessionDtoModelMappedFromDomain(sessionDomainModel);
    let propertiesArray = [sessionDtoModel.SessionToken];

    let statementResult = await repositoryManager.resolveStatementAsync(propertiesArray, genericQueryStatement.selectWherePropertyEqualsAnd, sessionTableName);

    if (statementResult instanceof Error) {
        return statementResult;
    }
    let sessionDtoResult = sessionRepositoryHelper.getSessionsDtoModelMappedFromDatabase(statementResult[0]);

    return sessionDtoResult;
}
//Test: DONE
let deleteSessionFromDatabaseAsync = async function(sessionDomainModel){
    let sessionDtoModel = sessionRepositoryHelper.getSessionDtoModelMappedFromDomain(sessionDomainModel);
    let propertiesArray = [sessionDtoModel.SessionToken];

    let statementResult = await repositoryManager.resolveStatementAsync(propertiesArray, genericQueryStatement.deleteFromTableWhere, sessionTableName);

    return statementResult;
}
//Test: DONE
let updateSessionTableSetColumnValuesWhereAsync = async function(sessionDomainModel){

    let sessionDtoModel = sessionRepositoryHelper.getSessionDtoModelMappedFromDomain(sessionDomainModel);
    let propertiesArray = [sessionDtoModel.SessionToken];
    let conditionalPropertiesArray = [ sessionDtoModel.SessionId ];
    let statementResult = await repositoryManager.resolveConditionalWhereEqualsStatementAsync (propertiesArray, conditionalPropertiesArray, sessionTableName);

    return statementResult;
}
//Test: DONE
let getSessionActivitiesFromDatabaseAsync = async function(sessionActivityDomainModel , utcDateCreatedDbFormatted){
    console.log('context', context);
    console.log('sessionActivityTableName', sessionActivityTableName);
    let sessionActivityDtoModel = sessionRepositoryHelper.getSessionActivityDtoModelMappedFromDomain(sessionActivityDomainModel);
    sessionActivityDtoModel.UTCLoginDate.value = utcDateCreatedDbFormatted
    sessionActivityDtoModel.UTCLogoutDate.value = null;

    let propertiesArray = [sessionActivityDtoModel.UserId , sessionActivityDtoModel.UserAgent, sessionActivityDtoModel.UTCLoginDate, sessionActivityDtoModel.UTCLogoutDate];
    let statementResult = await repositoryManager.resolveWherePropertyEqualsAndIsNullStatementAsync (propertiesArray, sessionActivityTableName);

    if (statementResult instanceof Error) {
        return statementResult;
    }
    let sessionActivitiesDtoResultArray = sessionRepositoryHelper.getSessionActitiviesDtoModelMappedFromDatabase(statementResult[0]);

    return sessionActivitiesDtoResultArray;
}
//Test: DONE
let updateSessionActivitiesTableSetColumnValuesWhereAsync = async function(sessionActivityDomainModel){

    let sessionActivityDtoModel = sessionRepositoryHelper.getSessionActivityDtoModelMappedFromDomain(sessionActivityDomainModel);
    let propertiesArray = [sessionActivityDtoModel.UTCLogoutDate];
    let conditionalPropertiesArray = [ sessionActivityDtoModel.SessionActivityId ];
    let statementResult = await repositoryManager.resolveConditionalWhereEqualsStatementAsync (propertiesArray, conditionalPropertiesArray, sessionActivityTableName);

    return statementResult;
}

onInit();
const service = {
    insertSessionIntoTableTransactionAsync : insertSessionIntoTableTransactionAsync,
    insertSessionActivityIntoTableTransacionAsync : insertSessionActivityIntoTableTransacionAsync,
    getSessionFromDatabaseAsync : getSessionFromDatabaseAsync,
    getSessionActivitiesFromDatabaseAsync : getSessionActivitiesFromDatabaseAsync,
    updateSessionTableSetColumnValuesWhereAsync : updateSessionTableSetColumnValuesWhereAsync,
    updateSessionActivitiesTableSetColumnValuesWhereAsync : updateSessionActivitiesTableSetColumnValuesWhereAsync,
    deleteSessionFromDatabaseAsync : deleteSessionFromDatabaseAsync
}

module.exports = service;

//#REGION Private Functions

function onInit(){
    context = dbContext.getSequelizeContext();
    sessionTableName = dbContext.getActiveDatabaseName() + '.' + context.sessionDtoModel.tableName;
    sessionActivityTableName = dbContext.getActiveDatabaseName() + '.' + context.sessionActivityDtoModel.tableName;
}

//#ENDREGION Private Functions