const dbContext = require('../mysqlDataStore/context/dbContext.js');
const dbAction = require('../mysqlDataStore/context/dbAction.js');
const queryFactory = require('../mysqlDataStore/preparedStatements/queryFactory.js');
const roleRepositoryHelper = require('../repositories/roleRepositoryHelper.js');

let context = '';
let roleTableName = '';

//Test: DONE
let getAllRolesAsync = async function(){
    let selectStatement = queryFactory.selectAllFromTable(roleTableName);
    let statementResult = await dbAction.executeStatementAsync(selectStatement);
    if(statementResult instanceof Error){
        return statementResult;
    }

    let rolesDtoResult = roleRepositoryHelper.getRolesDtoModelMappedFromDatabase(statementResult[0]);

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

//#ENDREGION Private Functions