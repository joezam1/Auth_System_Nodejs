const queryFactory = require('../mysqlDataStore/preparedStatements/queryFactory.js');
const valueSanitizer = require('../mysqlDataStore/preparedStatements/valueSanitizer.js');
const dbAction = require('../mysqlDataStore/context/dbAction.js');


const resolveStatementAsync = async function(propertiesArray , genericQueryStatementsEnum , tableName){
    let truthyPropertiesArray = valueSanitizer.getTruthySequelizeAttributesValues(propertiesArray);
    let queryStatement = queryFactory.createSimpleQueryStatement(genericQueryStatementsEnum, tableName, truthyPropertiesArray);

    let sanitizedValues = valueSanitizer.getSanitizedInputs(truthyPropertiesArray);
    let statementResult = await dbAction.executeStatementAsync(queryStatement, sanitizedValues);

    return statementResult;
}

const resolveSingleConnectionStatementAsync = async function(propertiesArray, genericQueryStatementsEnum, tableName, connectionPool){
    let truthyPropertiesArray = valueSanitizer.getTruthySequelizeAttributesValues(propertiesArray);
    let queryStatement = queryFactory.createSimpleQueryStatement(genericQueryStatementsEnum, tableName, truthyPropertiesArray);

    let sanitizedInputs = valueSanitizer.getSanitizedInputs(truthyPropertiesArray);
    let statementResult = await dbAction.executeSingleConnectionStatementAsync(connectionPool, queryStatement, sanitizedInputs);

    return statementResult;
}

const resolveConditionalWhereEqualsStatementAsync = async function(propertiesArray, whereConditionsPropertiesArray, tableName){
    try{
        let truthyPropertiesArray = valueSanitizer.getTruthySequelizeAttributesValues(propertiesArray);
        let whereConditionTruthyPropertiesArray = valueSanitizer.getTruthySequelizeAttributesValues(whereConditionsPropertiesArray);

        let queryStatement = queryFactory.updateTableSetColumnValuesWhere(tableName, truthyPropertiesArray, whereConditionTruthyPropertiesArray);
        truthyPropertiesArray.push.apply(truthyPropertiesArray, whereConditionTruthyPropertiesArray);
        let sanitizedValues = valueSanitizer.getSanitizedInputs(truthyPropertiesArray);
        let statementResult = await dbAction.executeStatementAsync(queryStatement, sanitizedValues);

        return statementResult;
    }catch(error){

        console.log('Error while executing function resolveConditionalWhereEqualsStatementAsync()- Error:');
        console.log(error);
        return new Error(error);
    }
}

const resolveWherePropertyEqualsAndIsNullStatementAsync = async function(propertiesIncludingNullValueArray, tableName){

    let nullPositionsArray = getNullValuesIndexPositions(propertiesIncludingNullValueArray);
    let queryStatement = queryFactory.selectWherePropertyEqualsAndIsNull (tableName, propertiesIncludingNullValueArray, nullPositionsArray);
    let truthyPropertiesArray = valueSanitizer.getTruthySequelizeAttributesValues(propertiesIncludingNullValueArray);
    let sanitizedValues = valueSanitizer.getSanitizedInputs(truthyPropertiesArray);
    let statementResult = await dbAction.executeStatementAsync(queryStatement, sanitizedValues);

    return statementResult;
}




const service = {
    resolveStatementAsync : resolveStatementAsync,
    resolveSingleConnectionStatementAsync : resolveSingleConnectionStatementAsync,
    resolveConditionalWhereEqualsStatementAsync : resolveConditionalWhereEqualsStatementAsync,
    resolveWherePropertyEqualsAndIsNullStatementAsync : resolveWherePropertyEqualsAndIsNullStatementAsync
}

module.exports = service;
//#REGION Private Functions
function getNullValuesIndexPositions(propertiesArray){
    let positionsArray = [];
    for(let a=0;a<propertiesArray.length; a++){
        if(propertiesArray[a].value === null){
            positionsArray.push(a);
        }
    }
    return positionsArray;
}
//#ENDREGION Private Functions