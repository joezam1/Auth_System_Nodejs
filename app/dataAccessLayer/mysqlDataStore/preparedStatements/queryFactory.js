const genericQueryStatements = require('../../../library/enumerations/genericQueryStatements.js');


//Test: DONE
let selectWhereEqualsAnd = function(tableName, sequelizePropertiesArray){

    let allProperties = '';
    let totalArrayElements = sequelizePropertiesArray.length;
    for(let a = 0; a < totalArrayElements; a++){
        if(a <= (totalArrayElements - 2)){
            allProperties += sequelizePropertiesArray[a].field +' = ? AND '
        }
        if(a == (totalArrayElements - 1)){
            allProperties += sequelizePropertiesArray[a].field +' = ?'
        }
    }
    let statement = `SELECT * FROM ${tableName} WHERE ${allProperties}`;

    return statement;
}
//Test: DONE
let selectAllFromTable = function(tableName){
    let statement = `SELECT * FROM ${tableName}`;

    return statement;
}

//Test: DONE
let insertIntoTableValues = function(tableName, sequelizePropertiesArray){

    let columnNames = '';
    let values = '';
    for(let a = 0; a< sequelizePropertiesArray.length ; a++){
        if(a == 0){
            columnNames += ''+sequelizePropertiesArray[a].field;
            values += '?';
        }else{
            columnNames += ','+sequelizePropertiesArray[a].field;
            values += ',?'
        }
    }
    var statement = `INSERT INTO ${tableName} ( ${columnNames} ) VALUES ( ${values} );`;

    return statement;
}

let deleteFromTableWhere = function(tableName, sequelizePropertiesArray){

    let allProperties = '';
    let totalArrayElements = sequelizePropertiesArray.length;
    for(let a = 0; a < totalArrayElements; a++){
        if(a <= (totalArrayElements - 2)){
            allProperties += sequelizePropertiesArray[a].field +' = ? AND '
        }
        if(a == (totalArrayElements - 1)){
            allProperties += sequelizePropertiesArray[a].field +' = ?'
        }
    }
    let statement = `DELETE FROM ${tableName} WHERE ${allProperties}`;

    return statement;
}

let updateTableSetColumnValuesWhere = function(tableName, sequelizePropertiesArray , sequelizeWhereConditionPropertiesArray){
    let allProperties = '';
    let totalArrayElements = sequelizePropertiesArray.length;
    for(let a = 0; a < totalArrayElements; a++){
        if(a <= (totalArrayElements - 2)){
            allProperties += sequelizePropertiesArray[a].field +' = ? , '
        }
        if(a == (totalArrayElements - 1)){
            allProperties += sequelizePropertiesArray[a].field +' = ?'
        }
    }

    let allConditionalProperties = '';
    if(sequelizeWhereConditionPropertiesArray !== null && Array.isArray(sequelizeWhereConditionPropertiesArray)){
        allConditionalProperties += ' WHERE ';
        let totalConditionalElement = sequelizeWhereConditionPropertiesArray.length;
        for(let b = 0; b< totalConditionalElement; b++){
            if(b <= (totalConditionalElement - 2)){
                allConditionalProperties += sequelizeWhereConditionPropertiesArray[b].field +' = ? AND '
            }
            if(b == (totalConditionalElement - 1)){
                allConditionalProperties += sequelizeWhereConditionPropertiesArray[b].field +' = ?'
            }
        }
    }
    let statement = `UPDATE ${tableName} SET ${allProperties} ${allConditionalProperties}`;

    return statement;
}


let getSelectedQueryStatement = function(genericQueryStatementsEnum, tableName, sequelizePropertiesArray , sequelizeWhereConditionPropertiesArray){

    let selectedStatement = '';
    switch(genericQueryStatementsEnum){

        case genericQueryStatements.selectWhereEqualsAnd:
            selectedStatement = selectWhereEqualsAnd(tableName, sequelizePropertiesArray);
            break;

        case genericQueryStatements.selectAllFromTable:
            selectedStatement = selectAllFromTable(tableName);
            break;

        case genericQueryStatements.insertIntoTableValues:
            selectedStatement = insertIntoTableValues(tableName, sequelizePropertiesArray);
            break;

        case genericQueryStatements.deleteFromTableWhere:
            selectedStatement = deleteFromTableWhere(tableName, sequelizePropertiesArray);
            break;

        case genericQueryStatements.updateTableSetColumnValuesWhere:
            selectedStatement = updateTableSetColumnValuesWhere(tableName, sequelizePropertiesArray, sequelizeWhereConditionPropertiesArray);
            break;
    }

    return selectedStatement;
}


let createSimpleQueryStatement = function( genericQueryStatementsEnum, tableName, sequelizePropertiesArray ){

    let selectedStatement = '';
    switch(genericQueryStatementsEnum){

        case genericQueryStatements.selectWhereEqualsAnd:
            selectedStatement = selectWhereEqualsAnd(tableName, sequelizePropertiesArray);
            break;

        case genericQueryStatements.selectAllFromTable:
            selectedStatement = selectAllFromTable(tableName);
            break;

        case genericQueryStatements.insertIntoTableValues:
            selectedStatement = insertIntoTableValues(tableName, sequelizePropertiesArray);
            break;

        case genericQueryStatements.deleteFromTableWhere:
            selectedStatement = deleteFromTableWhere(tableName, sequelizePropertiesArray);
            break;

    }

    return selectedStatement;
}

let service = {
    getSelectedQueryStatement : getSelectedQueryStatement,
    createSimpleQueryStatement : createSimpleQueryStatement,
    selectWhereEqualsAnd : selectWhereEqualsAnd,
    selectAllFromTable : selectAllFromTable,
    insertIntoTableValues : insertIntoTableValues,
    deleteFromTableWhere : deleteFromTableWhere,
    updateTableSetColumnValuesWhere : updateTableSetColumnValuesWhere
}

module.exports = service;