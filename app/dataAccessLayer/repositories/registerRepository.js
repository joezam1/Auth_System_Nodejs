const dbContext = require('../mysqlDataStore/context/dbContext.js');
const helpers = require('../../library/common/helpers.js');
const repositoryHelper = require('../repositories/repositoryHelper.js');
const genericQueryStatement = require('../../library/enumerations/genericQueryStatement.js');


let context = null;
let registerTableName = null;

//Test: DONE
let insertRegisterIntoTableTransactionAsync = async function(connectionPool, registerDomainModel){
    let registerDtoModel = getRegisterDtoModelMappedFromDomain(registerDomainModel);
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

function getRegisterDtoModelMappedFromDomain(registerDomainModel){
    let dateNow = new Date();
    let resolvedRegisterStatus = (registerDomainModel.getRegisterStatusIsActive() === true)
    ? registerDomainModel.getRegisterStatusIsActive()
    : registerDomainModel.setRegisterIsActive(true); registerDomainModel.getRegisterStatusIsActive() ;

    let _registerDto = new context.registerDtoModel();
    _registerDto.rawAttributes.RegisterId.value = registerDomainModel.getRegisterId();
    _registerDto.rawAttributes.RegisterId.type.key =  _registerDto.rawAttributes.RegisterId.type.key.toString();
    _registerDto.rawAttributes.UserId.value = registerDomainModel.getUserId();
    _registerDto.rawAttributes.UserId.type.key =  _registerDto.rawAttributes.UserId.type.key.toString();
    _registerDto.rawAttributes.IsActive.value = resolvedRegisterStatus;
    _registerDto.rawAttributes.IsActive.type.key =  _registerDto.rawAttributes.IsActive.type.key.toString();
    _registerDto.rawAttributes.UTCDateCreated.value = helpers.getDateUTCFormatForDatabase(dateNow);
    _registerDto.rawAttributes.UTCDateCreated.type.key =  _registerDto.rawAttributes.UTCDateCreated.type.key.toString();

    let clonedAttributes = JSON.parse(JSON.stringify(_registerDto.rawAttributes));
    return clonedAttributes;
}

//ENDREGION Private Functions