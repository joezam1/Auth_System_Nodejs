const inputCommonInspector = require('../services/validation/inputCommonInspector.js');
const { Worker } = require('worker_threads');
const path = require('path');
const jwtTokenQueryWorker = './jwtTokenQueryWorker.js';



const jwtTokenThreadManager = (function(){
    let jwtWorker = undefined;
    const createNewtWorkerThread = function(inspectorCallbackFunction){
        if(inputCommonInspector.inputExist(jwtWorker)){ return; }

        console.log('__dirname', __dirname);
        console.log('jwtTokenQueryWorker', jwtTokenQueryWorker);
        let workerScript = path.join(__dirname, jwtTokenQueryWorker);
        jwtWorker = new Worker(workerScript);
        let event = { message:'open' }
        jwtWorker.postMessage(event);

        if(inputCommonInspector.objectIsValid(jwtWorker)){
            jwtWorker.on('message', function(event){
                console.log(`jwtTokenThreadManager-onmessage:MESSAGE RECEIVED: `,event);
                if(inputCommonInspector.inputExist(inspectorCallbackFunction)){
                    inspectorCallbackFunction(event);
                }
            });
        }
    }

    const sendMessageToWorker = function(messageObj){
        console.log('messageObj', messageObj);
        if(inputCommonInspector.objectIsValid(jwtWorker)){
            jwtWorker.postMessage(messageObj);
        }
    }

    const terminateActiveWorker = function(){
        console.log('BEGIN-terminateActiveWorker-jwtWorker',jwtWorker);
        if(inputCommonInspector.inputExist(jwtWorker)){
            jwtWorker.terminate();
            jwtWorker = undefined;
        }

        console.log('END-terminateActiveWorker-jwtWorker',jwtWorker);
    }

    return Object.freeze({
        createNewtWorkerThread : createNewtWorkerThread,
        sendMessageToWorker : sendMessageToWorker,
        terminateActiveWorker : terminateActiveWorker
    });
})();

module.exports = jwtTokenThreadManager;