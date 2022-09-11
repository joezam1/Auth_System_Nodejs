const inputCommonInspector = require('../services/validation/inputCommonInspector.js');
const { Worker } = require('worker_threads');
const path = require('path');
const expiredCsrfTokenDeletionWorker = './expiredCsrfTokenDeletionWorker.js';
const monitorService = require('../services/monitoring/monitorService.js');


const expiredCsrfTokenManager = (function(){
    let activeWorker = undefined;
    const createNewtWorkerThread = function( inspectorCallbackFunction ){

        if(inputCommonInspector.inputExist(activeWorker)){ return; }

        monitorService.capture('__dirname', __dirname);
        monitorService.capture('workerFileName', expiredCsrfTokenDeletionWorker);
        let workerScript = path.join(__dirname, expiredCsrfTokenDeletionWorker);
        activeWorker = new Worker(workerScript);
        let event = { message:'open' }
        activeWorker.postMessage(event);

        if(inputCommonInspector.objectIsValid(activeWorker)){
            activeWorker.on('message', function(event){
                monitorService.capture(`Manager-For-Worker-onmessage:MESSAGE RECEIVED: `,event);
                if(inputCommonInspector.inputExist(inspectorCallbackFunction)){
                    inspectorCallbackFunction(event);
                }
            });
        }
    }

    const sendMessageToWorker = function(messageObj){
        monitorService.capture('messageObj', messageObj);
        if(inputCommonInspector.objectIsValid(activeWorker)){
            activeWorker.postMessage(messageObj);
        }
    }

    const terminateActiveWorker = function(){
        monitorService.capture('BEGIN-terminateActiveWorker-activeWorker',activeWorker);
        if(inputCommonInspector.inputExist(activeWorker)){
            activeWorker.terminate();
            activeWorker = undefined;
        }
        monitorService.capture('END-terminateActiveWorker-activeWorker',activeWorker);
    }

    return Object.freeze({
        createNewtWorkerThread : createNewtWorkerThread,
        sendMessageToWorker : sendMessageToWorker,
        terminateActiveWorker : terminateActiveWorker
    });
})();

module.exports = expiredCsrfTokenManager;