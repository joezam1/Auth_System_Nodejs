const inputCommonInspector = require('../services/validation/inputCommonInspector.js');
const { Worker } = require('worker_threads');
const path = require('path');
const expiredCsrfTokenDeletionWorker = './expiredCsrfTokenDeletionWorker.js';



const expiredCsrfTokenManager = (function(){
    let activeWorker = undefined;
    const createNewtWorkerThread = function( inspectorCallbackFunction ){

        if(inputCommonInspector.inputExist(activeWorker)){ return; }

        console.log('__dirname', __dirname);
        console.log('workerFileName', expiredCsrfTokenDeletionWorker);
        let workerScript = path.join(__dirname, expiredCsrfTokenDeletionWorker);
        activeWorker = new Worker(workerScript);
        let event = { message:'open' }
        activeWorker.postMessage(event);

        if(inputCommonInspector.objectIsValid(activeWorker)){
            activeWorker.on('message', function(event){
                console.log(`Manager-For-Worker-onmessage:MESSAGE RECEIVED: `,event);
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
        if(inputCommonInspector.inputExist(activeWorker)){
            activeWorker.terminate();
            activeWorker = undefined;
        }
        console.log('END-terminateActiveWorker-activeWorker',activeWorker);
    }

    return Object.freeze({
        createNewtWorkerThread : createNewtWorkerThread,
        sendMessageToWorker : sendMessageToWorker,
        terminateActiveWorker : terminateActiveWorker
    });
})();

module.exports = expiredCsrfTokenManager;