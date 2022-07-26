const dbContext = require('../mysqlDataStore/context/dbContext.js');
const dbAction = require('../mysqlDataStore/context/dbAction.js');
const queryManager = require('../mysqlDataStore/preparedStatements/queryManager.js');
const valueSanitizer = require('../mysqlDataStore/preparedStatements/valueSanitizer.js');
const helpers = require('../../library/common/helpers.js');


let context = null;
let sessionTableName = null;

let insertSessionIntoTableAsync = async function (sessionDomainModel) {
    console.log('sessionDomainModel', sessionDomainModel);
    let sessionDtoModel = getSessionDtoModelMappedFromDomain(sessionDomainModel);
    let propertiesArray = helpers.createPropertiesArrayFromObjectProperties(sessionDtoModel);
    let truthyPropertiesArray = valueSanitizer.getTruthySequelizeAttributesValues(propertiesArray);
    let insertStatement = queryManager.insertIntoTableValues(sessionTableName, truthyPropertiesArray);

    let sanitizedValues = valueSanitizer.getSanitizedInputs(truthyPropertiesArray);
    let statementResult = await dbAction.executeStatementAsync(insertStatement, sanitizedValues);

    return statementResult;
}
onInit();
const service = {
    insertSessionIntoTableAsync: insertSessionIntoTableAsync
}

module.exports = service;

//#REGION Private Functions

function onInit(){
    context = dbContext.getSequelizeContext();
    sessionTableName = dbContext.getActiveDatabaseName() + '.' + context.sessionDtoModel.tableName;
}


function getSessionDtoModelMappedFromDomain(sessionDomainModel){
    let dateNow = new Date();
    let resolvedSessionStatus = (sessionDomainModel.getSessionStatusIsActive() === true)
    ? sessionDomainModel.getSessionStatusIsActive()
    : sessionDomainModel.setSessionStatusIsActive(true); sessionDomainModel.getSessionStatusIsActive() ;

    let _sessionDto = new context.sessionDtoModel();
    _sessionDto.rawAttributes.SessionId.value = sessionDomainModel.getSessionId();
    _sessionDto.rawAttributes.SessionId.type.key = _sessionDto.rawAttributes.SessionId.type.key.toString();
    _sessionDto.rawAttributes.UserId.value = sessionDomainModel.getUserId();
    _sessionDto.rawAttributes.UserId.type.key = _sessionDto.rawAttributes.UserId.type.key.toString();
    _sessionDto.rawAttributes.SessionToken.value = sessionDomainModel.getSessionToken();
    _sessionDto.rawAttributes.SessionToken.type.key = _sessionDto.rawAttributes.SessionToken.type.key;
    _sessionDto.rawAttributes.Expires.value = sessionDomainModel.getExpiryInMilliseconds();
    _sessionDto.rawAttributes.Expires.type.key = _sessionDto.rawAttributes.Expires.type.key;
    _sessionDto.rawAttributes.Data.value = sessionDomainModel.getData();
    _sessionDto.rawAttributes.Data.type.key = _sessionDto.rawAttributes.Data.type.key;
    _sessionDto.rawAttributes.IsActive.value = resolvedSessionStatus;
    _sessionDto.rawAttributes.IsActive.type.key = _sessionDto.rawAttributes.IsActive.type.key;
    _sessionDto.rawAttributes.UTCDateCreated.value = helpers.getDateUTCFormat(dateNow);
    _sessionDto.rawAttributes.UTCDateCreated.type.key =  _sessionDto.rawAttributes.UTCDateCreated.type.key.toString();
    _sessionDto.rawAttributes.UTCDateUpdated.value = helpers.getDateUTCFormat(dateNow);
    _sessionDto.rawAttributes.UTCDateUpdated.type.key =  _sessionDto.rawAttributes.UTCDateUpdated.type.key.toString();

    let clonedAttributes = JSON.parse(JSON.stringify(_sessionDto.rawAttributes));
    return clonedAttributes;
}

//#ENDREGION Private Functions