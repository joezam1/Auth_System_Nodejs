
const dbContext = require('../mysqlDataStore/context/dbContext.js');


let context = null;


//Test: DONE
const getRolesDtoModelMappedFromDatabase = function(databaseResultArray){
    let allRoles = [];
    for(let a = 0; a< databaseResultArray.length; a++){
        let roleDatabase = databaseResultArray[a];
        let _roleDtoModel = new context.roleDtoModel();
        _roleDtoModel.rawAttributes.RoleId.value = roleDatabase.RoleId;
        _roleDtoModel.rawAttributes.RoleIndex.value = roleDatabase.RoleIndex;
        _roleDtoModel.rawAttributes.Name.value = roleDatabase.Name;
        _roleDtoModel.rawAttributes.Description.value = roleDatabase.Description;
        _roleDtoModel.rawAttributes.IsActive.value = (roleDatabase.IsActive !== 0);
        _roleDtoModel.rawAttributes.UTCDateCreated.value = roleDatabase.UTCDateCreated;
        _roleDtoModel.rawAttributes.UTCDateUpdated.value = roleDatabase.UTCDateUpdated;

        let clonedAttributes = JSON.parse(JSON.stringify(_roleDtoModel.rawAttributes));
        allRoles.push(clonedAttributes);
    }

    return allRoles;
}

onInit();
const service = {
    getRolesDtoModelMappedFromDatabase : getRolesDtoModelMappedFromDatabase
}

module.exports = service;

//#REGION: Private Functions
function onInit(){
    context = dbContext.getSequelizeContext();
}
//#ENDREGION: Private Functions
