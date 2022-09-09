const mysql = require('mysql2');
const {workerData, parentPort, isMainThread } = require("worker_threads");

console.log('workerData', workerData);
console.log('parentPort', parentPort);
console.log('isMainThread', isMainThread);
if(parentPort === null){ return; }

parentPort.on("message", async function (event) {
    console.log('sessionQueryWorker-on.message-event', event);
    console.log('manager-worker-connection:');
    const originWorker = 'sessionQueryWorker';
    let  replyObj = {};
    let receivedMessage = event.message;
    switch(receivedMessage){

        case 'open':
            replyObj = {
                message:'ok',
                origin:originWorker,
             }
            parentPort.postMessage(replyObj);
            break;

        case 'query':
            let statement = event.statement;
            let valuesArray = event.valuesArray;
            let sessionResultArray = await executeStatementAsync(statement, valuesArray);
            replyObj = {
                message:'ok',
                origin:originWorker,
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

let executeStatementAsync = async function (statement, valuesArray = null) {
    try{
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
