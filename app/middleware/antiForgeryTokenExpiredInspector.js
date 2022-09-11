const reducerServices = require('../services/inMemoryStorage/reducerService.js');
const reducerServiceAction = require('../library/enumerations/reducerServiceAction.js');
const antiForgeryTokenConfig = require('../../configuration/csrfProtection/antiForgeryTokenConfig.js');
const expiredCsrfTokenManager = require('../backgroundWorkers/expiredCsrfTokenManager');
const inputCommonInspector = require('../services/validation/inputCommonInspector.js');
const monitorService = require('../services/monitoring/monitorService.js');


const _dataStoreExpiredCsrfTokenInspectorIsActive = '_expiredCsrfTokenInspectorIsActive';
const _dataStoreCsrfTokensArray = 'antiforgeryTokens';

const antiForgeryTokenExpiredInspector = (function(){

    //Test: DONE
    const resolveRemoveExpiredTokens = function(){

        let inspectorStateIsActive = reducerServices.getCurrentStateByProperty(_dataStoreExpiredCsrfTokenInspectorIsActive);
        if(inspectorStateIsActive != true && (inspectorStateIsActive === null || inspectorStateIsActive === false)){
            setStateExpiredCsrfTokensInspector(true);
            let _intervalId = setInterval(function(){
                let _tokensArray = reducerServices.getCurrentStateByProperty( _dataStoreCsrfTokensArray );
                if(_tokensArray.length > 0){

                    expiredCsrfTokenManager.createNewtWorkerThread( csrfTokenWorkerCallback );
                    let messageObj ={
                        message : 'remove',
                        csrfTokensArray : _tokensArray
                    }
                    expiredCsrfTokenManager.sendMessageToWorker(messageObj);
                }
                else{
                    stopCsrfTokenExpiredInspector(_intervalId);
                }
            }, antiForgeryTokenConfig.TERMINATED_ANTIFORGERY_TOKEN_CLEANUP_FREQUENCY_IN_MILLISECONDS );
        }
    }
    return {
        resolveRemoveExpiredTokens : resolveRemoveExpiredTokens
    }
})();

module.exports = antiForgeryTokenExpiredInspector;


//#REGION Private Functions

function setStateExpiredCsrfTokensInspector(status){
    let payload = {}
    payload[_dataStoreExpiredCsrfTokenInspectorIsActive] = status ;
    let action = { type: reducerServiceAction.setExpiredTokensInspectorStatus };
    let result = reducerServices.dispatch(payload, action);
    monitorService.capture('reducerService-dispatch-result', result);

    return result;
}

function stopCsrfTokenExpiredInspector(intervalId){
    clearInterval(intervalId);
    setStateExpiredCsrfTokensInspector(false);
    expiredCsrfTokenManager.terminateActiveWorker();
}

function csrfTokenWorkerCallback(event){
    monitorService.capture('SessionExpiredINSPECTOR-queryWorkerCallback-event', event);
    if(!inputCommonInspector.inputExist(event) || !inputCommonInspector.inputExist(event.data)){
        return;
    }

    let tokensForDeletionArray = event.data.expiredCsrfTokensArray;
    let originalCsrfTokensArray = event.data.originalCsrfTokensArray;

    let payload = {
        originalTokensArray : originalCsrfTokensArray,
        tokensForDeletion : tokensForDeletionArray
    };
    let action = { type: reducerServiceAction.removeAllExpiredAntiForgeryTokensFromArray } ;
    let result = reducerServices.dispatch(payload, action);
    monitorService.capture('reducerService-dispatch-result', result);

    return result;
}

//ENDREGION Private Functions