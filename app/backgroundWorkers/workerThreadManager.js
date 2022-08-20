const inputCommonInspector = require('../services/validation/inputCommonInspector.js');
const { Worker } = require('worker_threads');
const path = require('path');

const workerThreadManager = (function(){
    let activeWorker = undefined;
    const starNewtWorkerThread = function(workerFileName, inspectorCallbackFunction){
        activeWorker = new Worker(path.join(__dirname, workerFileName));
        let event = { message:'open' }
        activeWorker.postMessage(event);

        if(inputCommonInspector.objectIsValid(activeWorker)){
            activeWorker.on('message', function(event){
                console.log(`Manager-For=Worker.${workerFileName}-onmessage:MESSAGE RECEIVED: `,event);
                if(inputCommonInspector.inputExist(inspectorCallbackFunction)){
                    inspectorCallbackFunction(event);
                }
            });
        }
    }

    const sendMessageToWorker = function(messageObj){
        console.log('messageObj', messageObj);
        if(inputCommonInspector.objectIsValid(activeWorker)){
            activeWorker.postMessage(messageObj);
        }
    }

    const terminateActiveWorker = function(){
        console.log('BEGIN-terminateActiveWorker-activeWorker',activeWorker);
        activeWorker.terminate();
        activeWorker = undefined;
        console.log('END-terminateActiveWorker-activeWorker',activeWorker);
    }

    return Object.freeze({
        starNewtWorkerThread : starNewtWorkerThread,
        sendMessageToWorker : sendMessageToWorker,
        terminateActiveWorker : terminateActiveWorker
    });
})();

module.exports = workerThreadManager;