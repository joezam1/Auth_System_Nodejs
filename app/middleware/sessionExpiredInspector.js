const reducerServices = require('../services/inMemoryStorage/reducerService.js');
const inputCommonInspector = require('../services/validation/inputCommonInspector.js');
const reducerServiceAction = require('../library/enumerations/reducerServiceAction.js');
const sessionThreadManager = require('../backgroundWorkers/sessionThreadManager.js');
const sessionConfig = require('../../configuration/authentication/sessionConfig.js');
const dbContext = require('../dataAccessLayer/mysqlDataStore/context/dbContext.js');
const expiredSessionEventCode = require('../library/enumerations/expiredSessionEventCode.js');
const helpers = require('../library/common/helpers.js');
const backgroundWorker = require('../library/enumerations/backgroundWorker.js');
const monitorService = require('../services/monitoring/monitorService.js');




let _context = null;
let _sessionTableName = null;
let _sessionDto = null;
let _columnNameSessionId = null;
let _columNameUTCDateExpired = null;

let _sessionActivityTableName = null;
let _sessionActivityDto = null;
let _columnNameUserId = null;
let _columnNameUTCLoginDate = null;
let _columnNameUTCLogoutDate = null;

const _stopIntervalId = -1;
const _dataStoreSessionInspectorProperty = '_sessionInspectorIsActive';
const _dataStoreCleanupIntervalId = '_expiredSessionCleanupIntervalId';


const sessionExpiredInspector = (function(){
    //Test:DONE
    const resolveRemoveExpiredSessions = function(){

        let inspectorStateIsActive = reducerServices.getCurrentStateByProperty(_dataStoreSessionInspectorProperty);
        if(inspectorStateIsActive != true && (inspectorStateIsActive === null || inspectorStateIsActive === false)){

            let intervalId = setInterval(function(){
                sessionThreadManager.createNewtWorkerThread(SessionExpiredQueryWorkerCallback);
                let messageObj ={
                    message : 'query',
                    statement : countRowsFromTable(),
                    valuesArray : null
                }
                sessionThreadManager.sendMessageToWorker(messageObj);

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
    _columnNameSessionId = _sessionDto.rawAttributes.SessionId.fieldName;
    _columNameUTCDateExpired = _sessionDto.rawAttributes.UTCDateExpired.fieldName;

    _sessionActivityTableName = dbContext.getActiveDatabaseName() + '.' + _context.sessionActivityDtoModel.tableName;
    _sessionActivityDto = new _context.sessionActivityDtoModel();
    _columnNameUserId = _sessionActivityDto.rawAttributes.UserId.fieldName;
    _columnNameUTCLoginDate = _sessionActivityDto.rawAttributes.UTCLoginDate.fieldName;
    _columnNameUTCLogoutDate = _sessionActivityDto.rawAttributes.UTCLogoutDate.fieldName;
}

function updateExpiredSessionRemovalIdDataStore(intervalId){
    let payload = {}
    payload[_dataStoreCleanupIntervalId] = intervalId ;
    let action = { type: reducerServiceAction.updateCleanupIntervalId };
    let result = reducerServices.dispatch(payload, action);
    monitorService.capture('reducerService-dispatch-result', result);
    return result;
}

function updateInspectorStateDataStore(status){
    let payload = {};
    payload[ _dataStoreSessionInspectorProperty] = status;
    let action = {type: reducerServiceAction.setStateSessionInspector } ;
    let result = reducerServices.dispatch(payload, action);
    monitorService.capture('reducerService-dispatch-result', result);
    return result;
}

function countRowsFromTable(){
    return `SELECT COUNT(*) FROM ${_sessionTableName};`;
}

function selectAllExpiredSessionsOrderByAsc(){
    return `SELECT * FROM ${_sessionTableName} WHERE ${_columNameUTCDateExpired} < UTC_TIMESTAMP() ORDER BY ${_columNameUTCDateExpired} ASC`;
}

function updateSessionActivityWhere(userId, utcLoginDate){
    return `UPDATE ${_sessionActivityTableName} SET ${_columnNameUTCLogoutDate} = UTC_TIMESTAMP() WHERE ${_columnNameUserId} = '${userId}' and ${_columnNameUTCLoginDate} = '${utcLoginDate}' `;
}

function removeSingleRowWhereQuery(sessionId){
    return `DELETE FROM ${_sessionTableName} WHERE ${_columnNameSessionId} = '${sessionId}' `;
}

function SessionExpiredQueryWorkerCallback(event){
    monitorService.capture('SessionExpiredQueryWorkerCallback-event', event);
    let sessionWorkerName = backgroundWorker[backgroundWorker.sessionQueryWorker ];
    if((!inputCommonInspector.inputExist(event.origin)) ||
        (inputCommonInspector.inputExist(event.origin) && event.origin !== sessionWorkerName)){
        return;
    }

    if(inputCommonInspector.inputExist(event.data) && Array.isArray(event.data)){
        let resultEventArray = event.data[0];
        let firstItem = {};
        if(resultEventArray.length>0){
            firstItem = resultEventArray[0];
        }else if(inputCommonInspector.objectIsValid(resultEventArray)){
            firstItem = resultEventArray;
        }

        let eventResult = getEventCode(firstItem);
        if(eventResult.code === expiredSessionEventCode.expiredSessionsTargeted && eventResult.count === -1){

            updateSessionActivitiesAndRemoveSessions(resultEventArray);
        }
        else if( eventResult.code === expiredSessionEventCode.expiredSessionsCount && eventResult.count > 0){

            getAllExpiredSessions();

        }else if( eventResult.code === expiredSessionEventCode.expiredSessionsCount && eventResult.count === 0){

            stopSessionExpiredInspector();

        }
        else if(eventResult.code === expiredSessionEventCode.expiredSessionsRemoved && eventResult.count === null){
            //do nothing
        }
    }
}


function getEventCode(resultEventObj){
    let event = {
        code:null,
        count:null
    }

    monitorService.capture('resultEventObj', resultEventObj);
    for(let key in resultEventObj){
        if(resultEventObj.hasOwnProperty(key)){
            if(key === 'COUNT(*)' &&  key.toLowerCase().includes('count')){
                event.code = expiredSessionEventCode.expiredSessionsCount;
                event.count = resultEventObj[key];
                break;
            }
            if(key === 'SessionId'){
                event.code = expiredSessionEventCode.expiredSessionsTargeted;
                event.count = -1;
                break;
            }
            if(key === 'affectedRows'){
                event.code = expiredSessionEventCode.expiredSessionsRemoved;
                event.count = null;
                break;
            }
        }
    }

    return event;
}


function getAllExpiredSessions(){
    let reply = {
        message : 'query',
        statement : selectAllExpiredSessionsOrderByAsc(),
        valuesArray : null
    }
    sessionThreadManager.sendMessageToWorker(reply);
}

function updateSessionActivitiesAndRemoveSessions(allExpiredSessionsArray){

    executeUpdateSessionActivities(allExpiredSessionsArray);
    executeRemoveExpiredSessions(allExpiredSessionsArray);
}

function executeUpdateSessionActivities(itemsArray){
    for(let a=0; a<itemsArray.length; a++){
        let userId = itemsArray[a].UserId;
        let utcLoginDateDbFormat = helpers.composeUTCDateToUTCFormatForDatabase(itemsArray[a].UTCDateCreated);
        let updateSessionActivity = updateSessionActivityWhere(userId ,utcLoginDateDbFormat )
        let reply = {
            message : 'query',
            statement : updateSessionActivity,
            valuesArray : null
        }
        sessionThreadManager.sendMessageToWorker(reply);
    }
}

function executeRemoveExpiredSessions(itemsArray){
    for(let a=0; a<itemsArray.length; a++){
        let sessionId = itemsArray[a].SessionId;
        let removeSession = removeSingleRowWhereQuery(sessionId);
        let reply = {
            message : 'query',
            statement : removeSession,
            valuesArray : null
        }
        sessionThreadManager.sendMessageToWorker(reply);
    }
}

function stopSessionExpiredInspector(){
    let intervalId = reducerServices.getCurrentStateByProperty(_dataStoreCleanupIntervalId);
    clearInterval(intervalId);
    updateExpiredSessionRemovalIdDataStore(_stopIntervalId);
    let inspectorIsActive = reducerServices.getCurrentStateByProperty(_dataStoreSessionInspectorProperty);
    if(inputCommonInspector.objectIsValid(inspectorIsActive) && inspectorIsActive ){
        updateInspectorStateDataStore(false);
    }
    sessionThreadManager.terminateActiveWorker();
}
//#ENDREGION Private Function