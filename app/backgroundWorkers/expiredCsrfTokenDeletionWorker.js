const {workerData, parentPort, isMainThread } = require("worker_threads");

console.log('workerData', workerData);
console.log('parentPort', parentPort);
console.log('isMainThread', isMainThread);

if(parentPort ==null){ return;}

parentPort.on("message", function (event) {
    console.log('WORKER-FUNCTION-on.message-event', event);
    console.log('manager-worker-connection:');
    let  replyObj = {};
    let receivedMessage = event.message;
    switch(receivedMessage){

        case 'open':
            replyObj = { message:'ok' }
            parentPort.postMessage(replyObj);
            break;

        case 'remove':

            let expiredCsrfTokensArray = getExpiredTokens(event.csrfTokensArray);
            replyObj = {
                message:'ok',
                data:{
                    expiredCsrfTokensArray : expiredCsrfTokensArray,
                    originalCsrfTokensArray : event.csrfTokensArray
                }
             }
            parentPort.postMessage(replyObj);
            break;
    }
});


function getExpiredTokens(tokenArray){
    let localeDateNow = new Date();
    let utcTimestampNow = localeDateNow.getTime();
    let expiredTokensArray = [];
    for(let a = 0; a < tokenArray.length; a++){
        let tokenData = tokenArray[a];
        let localeExpiredDate = new Date(tokenData.utcDateExpired);
        let utcTimestampExpiredDate = localeExpiredDate.getTime();
        if(utcTimestampExpiredDate < utcTimestampNow){
            expiredTokensArray.push(tokenData.csrfToken);
        }
    }
    return expiredTokensArray;

}