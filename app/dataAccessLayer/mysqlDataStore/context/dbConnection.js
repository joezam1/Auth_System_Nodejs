const mysql = require('mysql2');
const dbConnection = require('../../../../configuration/database/mysqlConfig.js');


let pool = null;
let getPool = function(){
    if(pool === null){
        pool = createMysqlPool();
    }

    return pool;
}

let getPoolPromise = function(){
    if(pool === null){
        pool = createMysqlPool();
    }
    return pool.promise;
}

let service = {
    getPool : getPool,
    getPoolPromise : getPoolPromise
}

module.exports = service;

//#REGION Private Functions
function createMysqlPool(){
    let poolConnection = dbConnection;
    let poolCreated = mysql.createPool(poolConnection);
    return poolCreated;
}

//#ENDREGION Private Functions