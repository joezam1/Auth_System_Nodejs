const mysql = require('mysql2');
const {workerData, parentPort, isMainThread } = require("worker_threads");

console.log('parentPort', parentPort);
parentPort.on("message", async function (event) {
    console.log('WORKER-FUNCTION-on.message-event', event);
    console.log('manager-worker-connection:');
    let  replyObj = {};
    let receivedMessage = event.message;
    switch(receivedMessage){

        case 'open':
            replyObj = { message:'ok' }
            parentPort.postMessage(replyObj);
            break;

        case 'query':
            let statement = event.statement;
            let valuesArray = event.valuesArray;
            let sessionResultArray = await executeStatementAsync(statement, valuesArray);
            replyObj = {
                message:'ok',
                data: sessionResultArray
             }
            parentPort.postMessage(replyObj);
            break;
    }

});




const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: 'abcd1234',
    database: 'auth_server',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool = null;
let getPool = function () {
    if (pool === null) {
        pool = createMysqlPool();
    }

    return pool;
}

function createMysqlPool() {
    let poolCreated = mysql.createPool(mysqlConfig);
    return poolCreated;
}

//#ENDREGION Private Functions



let executeStatementAsync = async function (statement, valuesArray = null) {
    try {
        var pool = getPool();
        var poolPromise = pool.promise();

        if ((valuesArray === null) || (valuesArray !== undefined)) {
            const [rows, fields] = await poolPromise.execute(statement);
            return [rows, fields];
        }

        if (Array.isArray(valuesArray) && (valuesArray !== null) && (valuesArray !== undefined)) {
            const [rows, fields] = await poolPromise.execute(statement, valuesArray);
            return [rows, fields];
        }

        var emptyResult = [[], []];
        return emptyResult;
    }
    catch (err) {
        return new Error(err);
    }
}