const dbContext = require('../mysqlDataStore/context/dbContext.js');
const queryManager = require('../mysqlDataStore/preparedStatements/queryManager.js');
const dbAction = require('../mysqlDataStore/context/dbAction.js');

let context = '';
let roleTableName = '';

//Test: DONE
let getAllRolesAsync = async function(){
    let selectStatement = queryManager.selectAllFromTable(roleTableName);
    let statementResult = await dbAction.executeStatementAsync(selectStatement);
    if(statementResult instanceof Error){
        return statementResult;
    }
    let rolesDtoResult = getRolesDtoModelMappedFromDatabase(statementResult[0]);

    return rolesDtoResult;
}

onInit();

let service = {
    getAllRolesAsync : getAllRolesAsync
}

module.exports = service;

//#REGION Private Functions

function onInit(){
    context = dbContext.getSequelizeContext();
    let roleDto = context.roleDtoModel;
    roleTableName = dbContext.getActiveDatabaseName() + '.' + roleDto.tableName;
}

function getRolesDtoModelMappedFromDatabase(databaseResultArray){
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

//#ENDREGION Private Functions