const inputCommonInspector = require('../../../services/validation/inputCommonInspector.js');
const dbConnection = require('./dbConnection.js');

let executeStatementAsync = async function(statement, valuesArray = null){
    try{
        var pool = dbConnection.getPool();
        var poolPromise = pool.promise();

        if(inputCommonInspector.objectIsNullOrEmpty(valuesArray)){
            const [rows, fields] = await poolPromise.execute(statement);
            return [rows, fields];
        }

        if(Array.isArray(valuesArray)){
            const [rows, fields] = await poolPromise.execute(statement, valuesArray);
            return [rows, fields];
        }

        var emptyResult = [[],[]];
        return emptyResult;
    }
    catch(err){
        return new Error(err);
    }
}


let getSingleConnectionFromPoolPromiseAsync = async function(){
    var poolOfDbThreads = dbConnection.getPool();
    var promiseConnection = new Promise(function(resolve, reject){
        poolOfDbThreads.getConnection(function(connectionError, singleConnection){

            if(connectionError){
                (reject("Error Occurred while getting the single connection from the pool. Error: "+connectionError))
            }
            resolve(singleConnection)
        });

    });

    let result = await promiseConnection;
    return result;
}

let beginTransactionSingleConnectionAsync = async function(connectionPool){

    await connectionPool.promise().execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    connectionPool.beginTransaction();
}

let executeSingleConnectionStatementAsync = async function(connectionPool, statement, valuesArray = null){
    try{
        if(inputCommonInspector.objectIsNullOrEmpty(valuesArray)){
            const [rows, fields] = await connectionPool.promise().execute(statement);
            return [rows, fields];
        }

        if(Array.isArray(valuesArray)){
            const [rows, fields] = await connectionPool.promise().execute(statement, valuesArray);
            return [rows, fields];
        }
        var emptyResult = [[],[]];
        return emptyResult;
    }
    catch(err){
        console.log('err', err);
        return new Error(err);
    }
}



let rollbackTransactionSingleConnection = function(connectionPool){

    connectionPool.rollback();
    connectionPool.release();
}


let commitTransactionSingleConnection = function(connectionPool){

    connectionPool.commit(function(error){
        if(error){
            rollbackTransactionSingleConnection(connectionPool);
            return;
        }
    });

    connectionPool.release();
}

let service = {
    executeStatementAsync : executeStatementAsync,
    getSingleConnectionFromPoolPromiseAsync : getSingleConnectionFromPoolPromiseAsync,
    beginTransactionSingleConnectionAsync : beginTransactionSingleConnectionAsync,
    executeSingleConnectionStatementAsync : executeSingleConnectionStatementAsync,
    rollbackTransactionSingleConnection : rollbackTransactionSingleConnection,
    commitTransactionSingleConnection : commitTransactionSingleConnection
}

 module.exports = service;