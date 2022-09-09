const inputCommonInspector = require('../services/validation/inputCommonInspector.js');
const { Worker } = require('worker_threads');
const path = require('path');
const sessionQueryWorker = './sessionQueryWorker.js';

const sessionThreadManager = (function(){
    let sessionWorker = undefined;
    const createNewtWorkerThread = function( inspectorCallbackFunction ){
        if(inputCommonInspector.inputExist(sessionWorker)){ return; }

        console.log('__dirname', __dirname);
        console.log('sessionQueryWorker', sessionQueryWorker);
        let workerScript = path.join(__dirname, sessionQueryWorker)
        sessionWorker = new Worker(workerScript);
        let event = { message:'open' }
        sessionWorker.postMessage(event);

        if(inputCommonInspector.objectIsValid(sessionWorker)){
            sessionWorker.on('message', function(event){
                console.log('sessionThreadManager-onmessage:MESSAGE RECEIVED:',event);
                if(inputCommonInspector.inputExist(inspectorCallbackFunction)){
                    inspectorCallbackFunction(event);
                }
            });
        }
    }

    const sendMessageToWorker = function(messageObj){
        console.log('messageObj', messageObj);
        if(inputCommonInspector.objectIsValid(sessionWorker)){
            sessionWorker.postMessage(messageObj);
        }
    }

    const terminateActiveWorker = function(){
        console.log('BEGIN-terminateActiveWorker-sessionWorker',sessionWorker);
        if(inputCommonInspector.inputExist(activeWorker)){
            sessionWorker.terminate();
            sessionWorker = undefined;
        }

        console.log('END-terminateActiveWorker-sessionWorker',sessionWorker);
    }

    return Object.freeze({
        createNewtWorkerThread : createNewtWorkerThread,
        sendMessageToWorker : sendMessageToWorker,
        terminateActiveWorker : terminateActiveWorker
    });
})();

module.exports = sessionThreadManager;