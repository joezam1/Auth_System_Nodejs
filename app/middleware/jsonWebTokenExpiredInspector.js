const reducerServices = require('../services/inMemoryStorage/reducerService.js');
const inputCommonInspector = require('../services/validation/inputCommonInspector.js');
const reducerServiceAction = require('../library/enumerations/reducerServiceAction.js');

const jwtTokenThreadManager = require('../backgroundWorkers/jwtTokenThreadManager.js');
const jwtConfig = require('../../configuration/authorization/jwtConfig.js');
const dbContext = require('../dataAccessLayer/mysqlDataStore/context/dbContext.js');
const expiredJwtEventCode = require('../library/enumerations/expiredJwtEventCode.js');
const backgroundWorker = require('../library/enumerations/backgroundWorker.js');


let _context = null;
let _tokenTableName = null;
let _tokenDto = null;
let _columNameUTCDateExpired = null;

const _stopIntervalId = -1;
const _dataStoreJwtInspectorProperty = '_jwtInspectorIsActive';
const _dataStoreJwtCleanupIntervalId = '_expiredJwtCleanupIntervalId';

const jsonWebTokenExpiredInspector = (function(){

    //Test: DONE
    const resolveRemoveExpiredTokens = function(){

        let inspectorStateIsActive = reducerServices.getCurrentStateByProperty(_dataStoreJwtInspectorProperty);
        if(inspectorStateIsActive != true && (inspectorStateIsActive === null || inspectorStateIsActive === false)){

            let intervalId = setInterval(function(){
                jwtTokenThreadManager.createNewtWorkerThread( jwtExpiredQueryWorkerCallback);
                let messageObj ={
                    message : 'query',
                    statement : countRowsFromTable(),
                    valuesArray : null
                }
                jwtTokenThreadManager.sendMessageToWorker(messageObj);

            }, jwtConfig.EXPIRED_JWT_TOKEN_CLEANUP_FREQUENCY_IN_MILLISECONDS );
            updateInspectorStateDataStore(true);
            updateExpiredJwtTokenRemovalIdDataStore(intervalId);
        }
    }
    return {
        resolveRemoveExpiredTokens : resolveRemoveExpiredTokens
    }
})();
onInit();
module.exports = jsonWebTokenExpiredInspector;


//#REGION Private Functions
function onInit(){
    _context = dbContext.getSequelizeContext();
    _tokenTableName = dbContext.getActiveDatabaseName() + '.' + _context.tokenDtoModel.tableName;
    _tokenDto = new _context.tokenDtoModel();
    _columNameUTCDateExpired = _tokenDto.rawAttributes.UTCDateExpired.fieldName;
}


function updateExpiredJwtTokenRemovalIdDataStore(intervalId){
    let payload = {}
    payload[_dataStoreJwtCleanupIntervalId] = intervalId ;
    let action = { type: reducerServiceAction.updateJwtRemovalIntervalId };
    let result = reducerServices.dispatch(payload, action);
    console.log('reducerService-dispatch-result', result);
    return result;
}

function updateInspectorStateDataStore(status){
    let payload = {};
    payload[ _dataStoreJwtInspectorProperty] = status;
    let action = { type: reducerServiceAction.setStateJwtInspector };
    let result = reducerServices.dispatch(payload, action);
    console.log('reducerService-dispatch-result', result);
    return result;
}

function stopTokenExpiredInspector(){
    let intervalId = reducerServices.getCurrentStateByProperty(_dataStoreJwtCleanupIntervalId);
    clearInterval(intervalId);
    updateExpiredJwtTokenRemovalIdDataStore(_stopIntervalId);
    let inspectorIsActive = reducerServices.getCurrentStateByProperty(_dataStoreJwtInspectorProperty);
    if(inputCommonInspector.inputExist(inspectorIsActive) && inspectorIsActive ){
        updateInspectorStateDataStore(false);
    }
    jwtTokenThreadManager.terminateActiveWorker();
}

function executeRemoveAllExpiredTokensMessage(){
    let removeExpiredRows = removeAllRowsWhereQuery();
    let reply ={
        message : 'query',
        statement : removeExpiredRows,
        valuesArray : null
    }
    jwtTokenThreadManager.sendMessageToWorker(reply);
}

function removeAllRowsWhereQuery(){
    return `DELETE FROM ${ _tokenTableName } WHERE ${ _columNameUTCDateExpired } < UTC_TIMESTAMP();`;
}


function countRowsFromTable(){
    return `SELECT COUNT(*) FROM ${_tokenTableName};`;
}


function jwtExpiredQueryWorkerCallback(event){
    console.log('jwtExpiredQueryWorkerCallback-event', event);
    let jwtWorkerName = backgroundWorker[backgroundWorker.jwtTokenQueryWorker] ;
    if((!inputCommonInspector.inputExist(event.origin)) ||
        (inputCommonInspector.inputExist(event.origin) && event.origin !== jwtWorkerName)){
        return;
    }

    if(inputCommonInspector.inputExist(event.data) && Array.isArray(event.data)){
        let _resultEvent = event.data[0];
        let firstItem = {};
        if(_resultEvent.length>0){
            firstItem = _resultEvent[0];
        }else if(inputCommonInspector.objectIsValid(_resultEvent)){
            firstItem = _resultEvent;
        }

        let eventResult = getEventCode(firstItem);
        if( eventResult.code === expiredJwtEventCode.expiredJwtsCount && eventResult.count > 0){
            executeRemoveAllExpiredTokensMessage()
        }else if( eventResult.code === expiredJwtEventCode.expiredJwtsCount && eventResult.count === 0){
            stopTokenExpiredInspector();
        }
        else if(eventResult.code === expiredJwtEventCode.expiredJwtsRemoved && eventResult.count === null){
            //do nothing
        }
    }
}


function getEventCode(resultEventObj){
    let event = {
        code:null,
        count:null
    }

    console.log('resultEventObj', resultEventObj);
    for(let key in resultEventObj){
        if(resultEventObj.hasOwnProperty(key)){
            if(key === 'COUNT(*)' &&  key.toLowerCase().includes('count')){
                event.code = expiredJwtEventCode.expiredJwtsCount;
                event.count = resultEventObj[key];
                break;
            }
            if(key === 'affectedRows'){
                event.code = expiredJwtEventCode.expiredJwtsRemoved;
                event.count = null;
                break;
            }
        }
    }

    return event;
}



//ENDREGION Private Functions