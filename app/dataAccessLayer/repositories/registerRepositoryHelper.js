const helpers = require('../../library/common/helpers.js');
const dbContext = require('../mysqlDataStore/context/dbContext.js');

let context = null;
//test: DONE
const getRegisterDtoModelMappedFromDomain = function(registerDomainModel){
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
    _registerDto.rawAttributes.UTCDateCreated.value = helpers.convertLocaleDateToUTCFormatForDatabase(dateNow);
    _registerDto.rawAttributes.UTCDateCreated.type.key =  _registerDto.rawAttributes.UTCDateCreated.type.key.toString();

    let clonedAttributes = JSON.parse(JSON.stringify(_registerDto.rawAttributes));
    return clonedAttributes;
}

onInit();

const service = {
    getRegisterDtoModelMappedFromDomain : getRegisterDtoModelMappedFromDomain
}

module.exports = service;
//REGION Private Functions

function onInit(){
    context = dbContext.getSequelizeContext();
    registerTableName = dbContext.getActiveDatabaseName() + '.' + context.registerDtoModel.tableName;
}

//ENDREGION Private Functions