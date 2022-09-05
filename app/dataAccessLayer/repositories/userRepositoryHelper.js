const dbContext = require('../mysqlDataStore/context/dbContext.js');
const helpers = require('../../library/common/helpers.js');

let context = null;

//Test:DONE
const getUserDtoModelMappedFromDomain = function(userDomainModel) {
    //console.log('userDomainModel', userDomainModel);

    let dateNow = new Date();
    let resolvedUserStatus = (userDomainModel.getUserStatusIsActive() === true)
        ? userDomainModel.getUserStatusIsActive()
        : userDomainModel.setUserIsActive(true); userDomainModel.getUserStatusIsActive();

    let _userDtoModel = new context.userDtoModel();
    //console.log('_userDtoModel', _userDtoModel);
    _userDtoModel.rawAttributes.UserId.value = userDomainModel.getUserId();
    _userDtoModel.rawAttributes.UserId.type.key =  _userDtoModel.rawAttributes.UserId.type.key.toString();
    _userDtoModel.rawAttributes.FirstName.value = userDomainModel.getFirstName();
    _userDtoModel.rawAttributes.FirstName.type.key =  _userDtoModel.rawAttributes.FirstName.type.key.toString();
    _userDtoModel.rawAttributes.MiddleName.value = userDomainModel.getMiddleName();
    _userDtoModel.rawAttributes.MiddleName.type.key =  _userDtoModel.rawAttributes.MiddleName.type.key.toString();
    _userDtoModel.rawAttributes.LastName.value = userDomainModel.getLastName();
    _userDtoModel.rawAttributes.LastName.type.key =  _userDtoModel.rawAttributes.LastName.type.key.toString();
    _userDtoModel.rawAttributes.Username.value = userDomainModel.getUsername();
    _userDtoModel.rawAttributes.Username.type.key =  _userDtoModel.rawAttributes.Username.type.key.toString();
    _userDtoModel.rawAttributes.Email.value = userDomainModel.getEmail();
    _userDtoModel.rawAttributes.Email.type.key =  _userDtoModel.rawAttributes.Email.type.key.toString();
    _userDtoModel.rawAttributes.Password.value = userDomainModel.getPassword();
    _userDtoModel.rawAttributes.Password.type.key =  _userDtoModel.rawAttributes.Password.type.key.toString();
    _userDtoModel.rawAttributes.IsActive.value = resolvedUserStatus;
    _userDtoModel.rawAttributes.IsActive.type.key =  _userDtoModel.rawAttributes.IsActive.type.key.toString();
    _userDtoModel.rawAttributes.UTCDateCreated.value = helpers.convertLocaleDateToUTCFormatForDatabase(dateNow);
    _userDtoModel.rawAttributes.UTCDateCreated.type.key =  _userDtoModel.rawAttributes.UTCDateCreated.type.key.toString();
    _userDtoModel.rawAttributes.UTCDateUpdated.value = helpers.convertLocaleDateToUTCFormatForDatabase(dateNow);
    _userDtoModel.rawAttributes.UTCDateUpdated.type.key =  _userDtoModel.rawAttributes.UTCDateUpdated.type.key.toString();

    let clonedAttributes = JSON.parse(JSON.stringify(_userDtoModel.rawAttributes));
    return clonedAttributes;
}
//Test:DONE
const getUsersDtoModelMappedFromDatabase = function(databaseResultArray) {
    let allUsersDtoModels = [];
    for (let a = 0; a < databaseResultArray.length; a++) {
        let userDatabase = databaseResultArray[a];
        //console.log('userDatabase', userDatabase);
        let _userDtoModel =new context.userDtoModel();
        //console.log('_userDtoModel', _userDtoModel);
        _userDtoModel.rawAttributes.UserId.value = userDatabase.UserId;
        _userDtoModel.rawAttributes.FirstName.value = userDatabase.FirstName;
        _userDtoModel.rawAttributes.MiddleName.value = userDatabase.MiddleName;
        _userDtoModel.rawAttributes.LastName.value = userDatabase.LastName;
        _userDtoModel.rawAttributes.Username.value = userDatabase.Username;
        _userDtoModel.rawAttributes.Email.value = userDatabase.Email;
        _userDtoModel.rawAttributes.Password.value = userDatabase.Password;
        _userDtoModel.rawAttributes.IsActive.value = (userDatabase.IsActive !== 0);
        _userDtoModel.rawAttributes.UTCDateCreated.value = userDatabase.UTCDateCreated;
        _userDtoModel.rawAttributes.UTCDateUpdated.value = userDatabase.UTCDateUpdated;

        let clonedAttributes = JSON.parse(JSON.stringify(_userDtoModel.rawAttributes));
        allUsersDtoModels.push(clonedAttributes);
    }

    return allUsersDtoModels;
}
//Test:DONE
const getUserRoleDtoModelMappedFromDomain = function(userRoleDomainModel) {
    //console.log('userRoleDomainModel', userRoleDomainModel);
    let dateNow = new Date();
    let _userRoleDtoModel = new context.userRoleDtoModel();
    _userRoleDtoModel.rawAttributes.UserRoleId.value = userRoleDomainModel.getUserRoleId();
    _userRoleDtoModel.rawAttributes.UserRoleId.type.key =  _userRoleDtoModel.rawAttributes.UserRoleId.type.key.toString();
    _userRoleDtoModel.rawAttributes.UserId.value = userRoleDomainModel.getUserId();
    _userRoleDtoModel.rawAttributes.UserId.type.key =  _userRoleDtoModel.rawAttributes.UserId.type.key.toString();
    _userRoleDtoModel.rawAttributes.RoleId.value = userRoleDomainModel.getRoleId();
    _userRoleDtoModel.rawAttributes.RoleId.type.key =  _userRoleDtoModel.rawAttributes.RoleId.type.key.toString();
    _userRoleDtoModel.rawAttributes.UTCDateCreated.value = helpers.convertLocaleDateToUTCFormatForDatabase(dateNow);
    _userRoleDtoModel.rawAttributes.UTCDateCreated.type.key =  _userRoleDtoModel.rawAttributes.UTCDateCreated.type.key.toString();
    _userRoleDtoModel.rawAttributes.UTCDateUpdated.value = helpers.convertLocaleDateToUTCFormatForDatabase(dateNow);
    _userRoleDtoModel.rawAttributes.UTCDateUpdated.type.key =  _userRoleDtoModel.rawAttributes.UTCDateUpdated.type.key.toString();

    let clonedAttributes = JSON.parse(JSON.stringify(_userRoleDtoModel.rawAttributes));
    return clonedAttributes;
}
//Test: DONE
const getUserRolesDtoModelMappedFromDatabase = function(databaseResultArray) {
    let allUserRolesDtoModels = [];
    for (let a = 0; a < databaseResultArray.length; a++) {
        let userRoleDatabase = databaseResultArray[a];
        //console.log('userRoleDatabase', userRoleDatabase);
        let _userRoleDtoModel =new context.userRoleDtoModel();
        //console.log('_userRoleDtoModel', _userRoleDtoModel);
        _userRoleDtoModel.rawAttributes.UserRoleId.value = userRoleDatabase.UserRoleId;
        _userRoleDtoModel.rawAttributes.UserId.value = userRoleDatabase.UserId;
        _userRoleDtoModel.rawAttributes.RoleId.value = userRoleDatabase.RoleId;

        _userRoleDtoModel.rawAttributes.UTCDateCreated.value = userRoleDatabase.UTCDateCreated;
        _userRoleDtoModel.rawAttributes.UTCDateUpdated.value = userRoleDatabase.UTCDateUpdated;

        let clonedAttributes = JSON.parse(JSON.stringify(_userRoleDtoModel.rawAttributes));
        allUserRolesDtoModels.push(clonedAttributes);
    }

    return allUserRolesDtoModels;
}



onInit();
const service = Object.freeze({
    getUserDtoModelMappedFromDomain : getUserDtoModelMappedFromDomain,
    getUsersDtoModelMappedFromDatabase : getUsersDtoModelMappedFromDatabase,
    getUserRoleDtoModelMappedFromDomain : getUserRoleDtoModelMappedFromDomain,
    getUserRolesDtoModelMappedFromDatabase : getUserRolesDtoModelMappedFromDatabase
});

module.exports = service;

//#REGION Private Functions
function onInit(){
    context = dbContext.getSequelizeContext();
}
//#ENDREGION Private Functions