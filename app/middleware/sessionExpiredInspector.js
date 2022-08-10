const reducerServices = require('../services/inMemoryStorage/reducerService.js');
const inputCommonInspector = require('../services/validation/inputCommonInspector.js');
const reducerServiceActions = require('../library/enumerations/reducerServiceActions.js');
const workerThreadManager = require('../backgroundWorkers/workerThreadManager.js');
const databaseQueryWorkerFile = '../backgroundWorkers/databaseQueryWorker.js';
const sessionConfig = require('../../configuration/authentication/sessionConfig.js');
const dbContext = require('../dataAccessLayer/mysqlDataStore/context/dbContext.js');


let _context = null;
let _sessionTableName = null;
let _sessionDto = null;
let _columName = null;
const stopIntervalId = -1;
const _dataStoreSessionInspectorProperty = '_sessionInspectorIsActive';
const _dataStoreCleanupIntervalId = '_expiredSessionCleanupIntervalId';


const sessionExpiredInspector = (function(){
    //Test:DONE
    const resolveRemoveExpiredSessions = function(){

        let inspectorStateIsActive = reducerServices.getCurrentStateByProperty(_dataStoreSessionInspectorProperty);
        if(inspectorStateIsActive != true && (inspectorStateIsActive === null || inspectorStateIsActive === false)){

            workerThreadManager.starNewtWorkerThread(databaseQueryWorkerFile ,queryWorkerCallback);
            let intervalId = setInterval(function(){
                let messageObj ={
                    message : 'query',
                    statement : getCountRowsFromTable(),
                    valuesArray : null
                }
                workerThreadManager.sendMessageToWorker(messageObj);

            },sessionConfig.EXPIRED_SESSION_CLEANUP_FREQUENCY_IN_MILLISECONDS );
            updateInspectorStateDataStore(true);
            updateExpiredSessionRemovalIdDataStore(intervalId);
        }
    }
    return {
        resolveRemoveExpiredSessions : resolveRemoveExpiredSessions
    }
})();

onInit();
module.exports = sessionExpiredInspector;

//#REGION Private Functions
function onInit(){
    _context = dbContext.getSequelizeContext();
    _sessionTableName = dbContext.getActiveDatabaseName() + '.' + _context.sessionDtoModel.tableName;
    _sessionDto = new _context.sessionDtoModel();
    _columName = _sessionDto.rawAttributes.UTCDateExpired.fieldName;
}

function updateExpiredSessionRemovalIdDataStore(intervalId){
    let payload = {}
    payload[_dataStoreCleanupIntervalId] = intervalId ;
    let action = { type: reducerServiceActions.updateCleanupIntervalId };
    let result = reducerServices.dispatch(payload, action);
    console.log('reducerService-dispatch-result', result);
    return result;

}

function updateInspectorStateDataStore(status){
    let payload = {};
    payload[ _dataStoreSessionInspectorProperty] = status;
    let action = { type: reducerServiceActions.startSessionInspector };
    let result = reducerServices.dispatch(payload, action);
    console.log('reducerService-dispatch-result', result);
    return result;
}

function getCountRowsFromTable(){
    return `SELECT COUNT(*) FROM ${_sessionTableName};`;
}

function getRemoveRowsWhereQuery(){
    return `DELETE FROM ${_sessionTableName} WHERE ${_columName} < UTC_TIMESTAMP() `;
}

function queryWorkerCallback(event){
    console.log('INSPECTOR-queryWorkerCallback-event', event);
    if( inputCommonInspector.objectIsValid(event.data) && Array.isArray(event.data)){
        let resultCountArray = event.data[0];
        let totalSessionRows = getCountValue(resultCountArray);
        if(totalSessionRows>0){
            executeRemoveExpiredRows();

        }else if(totalSessionRows === 0){
            stopSessionExpiredInspector();
        }
    }
}

function getCountValue(resultCountArray){
    let count = -1;
    if( inputCommonInspector.objectIsValid(resultCountArray) && Array.isArray(resultCountArray)){
        let resultCountObj = resultCountArray[0];
        console.log('resultCount', resultCountObj);

        for(let key in resultCountObj){
            if(resultCountObj.hasOwnProperty(key)){
                if(key === 'COUNT(*)' &&  key.toLowerCase().includes('count')){
                    count = resultCountObj[key];
                    break;
                }
            }
        }
    }
    return count;
}
function executeRemoveExpiredRows(){
    let reply = {
        message : 'query',
        statement : getRemoveRowsWhereQuery(),
        valuesArray : null
    }
    workerThreadManager.sendMessageToWorker(reply);
}

function stopSessionExpiredInspector(){
    let intervalId = reducerServices.getCurrentStateByProperty(_dataStoreCleanupIntervalId);
    clearInterval(intervalId);
    updateExpiredSessionRemovalIdDataStore(stopIntervalId);
    let inspectorIsActive = reducerServices.getCurrentStateByProperty(_dataStoreSessionInspectorProperty);
    if(inputCommonInspector.objectIsValid(inspectorIsActive) && inspectorIsActive ){
        updateInspectorStateDataStore(false);
    }
    workerThreadManager.terminateActiveWorker();
}
//#ENDREGION Private Function des