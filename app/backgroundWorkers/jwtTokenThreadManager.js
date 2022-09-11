const inputCommonInspector = require('../services/validation/inputCommonInspector.js');
const { Worker } = require('worker_threads');
const path = require('path');
const jwtTokenQueryWorker = './jwtTokenQueryWorker.js';
const monitorService = require('../services/monitoring/monitorService.js');


const jwtTokenThreadManager = (function(){
    let jwtWorker = undefined;
    const createNewtWorkerThread = function(inspectorCallbackFunction){
        if(inputCommonInspector.inputExist(jwtWorker)){ return; }

        monitorService.capture('__dirname', __dirname);
        monitorService.capture('jwtTokenQueryWorker', jwtTokenQueryWorker);
        let workerScript = path.join(__dirname, jwtTokenQueryWorker);
        jwtWorker = new Worker(workerScript);
        let event = { message:'open' }
        jwtWorker.postMessage(event);

        if(inputCommonInspector.objectIsValid(jwtWorker)){
            jwtWorker.on('message', function(event){
                monitorService.capture(`jwtTokenThreadManager-onmessage:MESSAGE RECEIVED: `,event);
                if(inputCommonInspector.inputExist(inspectorCallbackFunction)){
                    inspectorCallbackFunction(event);
                }
            });
        }
    }

    const sendMessageToWorker = function(messageObj){
        monitorService.capture('messageObj', messageObj);
        if(inputCommonInspector.objectIsValid(jwtWorker)){
            jwtWorker.postMessage(messageObj);
        }
    }

    const terminateActiveWorker = function(){
        monitorService.capture('BEGIN-terminateActiveWorker-jwtWorker',jwtWorker);
        if(inputCommonInspector.inputExist(jwtWorker)){
            jwtWorker.terminate();
            jwtWorker = undefined;
        }

        monitorService.capture('END-terminateActiveWorker-jwtWorker',jwtWorker);
    }

    return Object.freeze({
        createNewtWorkerThread : createNewtWorkerThread,
        sendMessageToWorker : sendMessageToWorker,
        terminateActiveWorker : terminateActiveWorker
    });
})();

module.exports = jwtTokenThreadManager;