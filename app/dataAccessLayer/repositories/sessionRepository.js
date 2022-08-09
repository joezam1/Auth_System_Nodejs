const dbContext = require('../mysqlDataStore/context/dbContext.js');
const helpers = require('../../library/common/helpers.js');
const repositoryHelper = require('../repositories/repositoryHelper.js');
const genericQueryStatements = require('../../library/enumerations/genericQueryStatements.js');
const sessionService = require('../../serviceLayer/authentication/sessionService.js');


let context = null;
let sessionTableName = null;
//Test: DONE
let insertSessionIntoTableAsync = async function (sessionDomainModel) {
    console.log('context', context);
    console.log('sessionTableName', sessionTableName);
    console.log('sessionDomainModel', sessionDomainModel);
    let sessionDtoModel = getSessionDtoModelMappedFromDomain(sessionDomainModel);
    let propertiesArray = helpers.createPropertiesArrayFromObjectProperties(sessionDtoModel);

    let statementResult = await repositoryHelper.resolveStatementAsync(propertiesArray, genericQueryStatements.insertIntoTableValues, sessionTableName);

    return statementResult;
}

let getSessionFromDatabaseAsync = async function(sessionDomainModel){
    console.log('context', context);
    console.log('sessionTableName', sessionTableName);
    let sessionDtoModel = getSessionDtoModelMappedFromDomain(sessionDomainModel);
    let propertiesArray = [sessionDtoModel.SessionToken];

    let statementResult = await repositoryHelper.resolveStatementAsync(propertiesArray, genericQueryStatements.selectWhereEqualsAnd, sessionTableName);

    if (statementResult instanceof Error) {
        return statementResult;
    }
    let sessionDtoResult = getSessionsDtoModelMappedFromDatabase(statementResult[0]);

    return sessionDtoResult;
}

let deleteSessionFromDatabaseAsync = async function(sessionDomainModel){
    let sessionDtoModel = getSessionDtoModelMappedFromDomain(sessionDomainModel);
    let propertiesArray = [sessionDtoModel.SessionToken];

    let statementResult = await repositoryHelper.resolveStatementAsync(propertiesArray, genericQueryStatements.deleteFromTableWhere, sessionTableName);

    return statementResult;
}

let updateTableSetColumnValuesWhereAsync = async function(sessionDomainModel){

    let sessionDtoModel = getSessionDtoModelMappedFromDomain(sessionDomainModel);
    let propertiesArray = [sessionDtoModel.SessionToken];
    let conditionalPropertiesArray = [ sessionDtoModel.SessionId ];
    let statementResult = await repositoryHelper.resolveConditionalWhereEqualsStatementAsync (propertiesArray, conditionalPropertiesArray, sessionTableName);

    return statementResult;
}
onInit();
const service = {
    insertSessionIntoTableAsync : insertSessionIntoTableAsync,
    getSessionFromDatabaseAsync : getSessionFromDatabaseAsync,
    updateTableSetColumnValuesWhereAsync : updateTableSetColumnValuesWhereAsync,
    deleteSessionFromDatabaseAsync : deleteSessionFromDatabaseAsync
}

module.exports = service;

//#REGION Private Functions

function onInit(){
    context = dbContext.getSequelizeContext();
    sessionTableName = dbContext.getActiveDatabaseName() + '.' + context.sessionDtoModel.tableName;
}


function getSessionDtoModelMappedFromDomain(sessionDomainModel){
    let dateNow = new Date();
    let utcDateCreated = helpers.getDateUTCFormatForDatabase(dateNow);
    let expiryInMilliseconds = sessionDomainModel.getExpiryInMilliseconds();
    let dateExpiredCalculation = sessionService.getSessionDateExpired(dateNow,expiryInMilliseconds );
    let dateExpiredAsDate = new Date(dateExpiredCalculation);
    let utcDateExpiredFormatted = helpers.getDateUTCFormatForDatabase(dateExpiredAsDate);
    let sessionStatus = (sessionDomainModel.getSessionStatusIsActive());
    let resolvedSessionStatus = (sessionStatus === true)
    ? sessionDomainModel.getSessionStatusIsActive()
    : sessionDomainModel.setSessionStatusIsActive(true); sessionDomainModel.getSessionStatusIsActive() ;

    let _sessionDto = new context.sessionDtoModel();
    _sessionDto.rawAttributes.SessionId.value = sessionDomainModel.getSessionId();
    _sessionDto.rawAttributes.SessionId.type.key = _sessionDto.rawAttributes.SessionId.type.key.toString();
    _sessionDto.rawAttributes.UserId.value = sessionDomainModel.getUserId();
    _sessionDto.rawAttributes.UserId.type.key = _sessionDto.rawAttributes.UserId.type.key.toString();
    _sessionDto.rawAttributes.SessionToken.value = sessionDomainModel.getSessionToken();
    _sessionDto.rawAttributes.SessionToken.type.key = _sessionDto.rawAttributes.SessionToken.type.key;
    _sessionDto.rawAttributes.Expires.value = expiryInMilliseconds;
    _sessionDto.rawAttributes.Expires.type.key = _sessionDto.rawAttributes.Expires.type.key;
    _sessionDto.rawAttributes.Data.value = sessionDomainModel.getData();
    _sessionDto.rawAttributes.Data.type.key = _sessionDto.rawAttributes.Data.type.key;
    _sessionDto.rawAttributes.IsActive.value = resolvedSessionStatus;
    _sessionDto.rawAttributes.IsActive.type.key = _sessionDto.rawAttributes.IsActive.type.key;
    _sessionDto.rawAttributes.UTCDateCreated.value = utcDateCreated;
    _sessionDto.rawAttributes.UTCDateCreated.type.key =  _sessionDto.rawAttributes.UTCDateCreated.type.key.toString();
    _sessionDto.rawAttributes.UTCDateExpired.value = utcDateExpiredFormatted;
    _sessionDto.rawAttributes.UTCDateExpired.type.key =  _sessionDto.rawAttributes.UTCDateExpired.type.key.toString();

    let clonedAttributes = JSON.parse(JSON.stringify(_sessionDto.rawAttributes));
    return clonedAttributes;
}


function getSessionsDtoModelMappedFromDatabase(databaseResultArray) {
    let allSessionsDtoModels = [];
    for (let a = 0; a < databaseResultArray.length; a++) {
        let sessionDatabase = databaseResultArray[a];
        console.log('sessionDatabase', sessionDatabase);
        let _sessionDtoModel =new context.sessionDtoModel();
        console.log('_sessionDtoModel', _sessionDtoModel);

        _sessionDtoModel.rawAttributes.SessionId.value = sessionDatabase.SessionId;
        _sessionDtoModel.rawAttributes.UserId.value = sessionDatabase.UserId;
        _sessionDtoModel.rawAttributes.SessionToken.value = sessionDatabase.SessionToken;
        _sessionDtoModel.rawAttributes.Expires.value = sessionDatabase.Expires;
        _sessionDtoModel.rawAttributes.Data.value = sessionDatabase.Data;
        _sessionDtoModel.rawAttributes.IsActive.value = (sessionDatabase.IsActive !== 0);

        _sessionDtoModel.rawAttributes.UTCDateCreated.value = sessionDatabase.UTCDateCreated;
        _sessionDtoModel.rawAttributes.UTCDateExpired.value = sessionDatabase.UTCDateExpired;

        let clonedAttributes = JSON.parse(JSON.stringify(_sessionDtoModel.rawAttributes));
        allSessionsDtoModels.push(clonedAttributes);
    }

    return allSessionsDtoModels;
}


//#ENDREGION Private Functions