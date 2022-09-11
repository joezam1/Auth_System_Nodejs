const inputCommonInspector = require('../services/validation/inputCommonInspector.js');
const { Worker } = require('worker_threads');
const path = require('path');
const sessionQueryWorker = './sessionQueryWorker.js';
const monitorService = require('../services/monitoring/monitorService.js');


const sessionThreadManager = (function(){
    let sessionWorker = undefined;
    const createNewtWorkerThread = function( inspectorCallbackFunction ){
        if(inputCommonInspector.inputExist(sessionWorker)){ return; }

        monitorService.capture('__dirname', __dirname);
        monitorService.capture('sessionQueryWorker', sessionQueryWorker);
        let workerScript = path.join(__dirname, sessionQueryWorker)
        sessionWorker = new Worker(workerScript);
        let event = { message:'open' }
        sessionWorker.postMessage(event);

        if(inputCommonInspector.objectIsValid(sessionWorker)){
            sessionWorker.on('message', function(event){
                monitorService.capture('sessionThreadManager-onmessage:MESSAGE RECEIVED:',event);
                if(inputCommonInspector.inputExist(inspectorCallbackFunction)){
                    inspectorCallbackFunction(event);
                }
            });
        }
    }

    const sendMessageToWorker = function(messageObj){
        monitorService.capture('messageObj', messageObj);
        if(inputCommonInspector.objectIsValid(sessionWorker)){
            sessionWorker.postMessage(messageObj);
        }
    }

    const terminateActiveWorker = function(){
        monitorService.capture('BEGIN-terminateActiveWorker-sessionWorker',sessionWorker);
        if(inputCommonInspector.inputExist(sessionWorker)){
            sessionWorker.terminate();
            sessionWorker = undefined;
        }

        monitorService.capture('END-terminateActiveWorker-sessionWorker',sessionWorker);
    }

    return Object.freeze({
        createNewtWorkerThread : createNewtWorkerThread,
        sendMessageToWorker : sendMessageToWorker,
        terminateActiveWorker : terminateActiveWorker
    });
})();

module.exports = sessionThreadManager;