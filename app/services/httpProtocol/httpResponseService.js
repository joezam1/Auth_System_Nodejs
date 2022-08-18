const httpResponseStatusCodes = require('./httpResponseStatusCodes.js');
const httpResponseStatus = require('../../library/enumerations/httpResponseStatus.js');
const inputCommonInspector = require('../validation/inputCommonInspector.js');
const httpResponseHelper = require('./httpResponseHelper.js');

//Test: DONE
const getResponseResultStatus = function(resultObj, statusCode){

    let responseObj = getResponseStatusObject(statusCode);
    console.log('responseObj', responseObj);
    let obj={
        result: resultObj,
        status:responseObj.code,
        statusText:responseObj.statusText
    }
    return obj;
}
//Test: DONE
const sendHttpResponse = function(resultObj, response){

    try{
            if(!inputCommonInspector.objectIsNullOrEmpty(resultObj) && !inputCommonInspector.objectIsNullOrEmpty(resultObj.status)){
            httpResponseHelper.executeSend(response, resultObj.status, resultObj);
        }else{
            httpResponseHelper.executeSend(response, httpResponseStatus._404notFound, resultObj);
        }
    }
    catch(error){
        let message = 'error sending HTTP Response: ' + error;
        let err = new Error(message);
        httpResponseHelper.executeSend(response, httpResponseStatus._500internalServerError , err)
    }
}


let service = Object.freeze({
    getResponseResultStatus : getResponseResultStatus,
    sendHttpResponse : sendHttpResponse
});

module.exports = service;

//#REGION Private Functions

function getResponseStatusObject(statusCode){

    let responseObj = {
        code: httpResponseStatusCodes.unprocessableEntity422.code,
        statusText:httpResponseStatusCodes.unprocessableEntity422.statusText
    };

    for(let key in httpResponseStatusCodes){
        if(httpResponseStatusCodes.hasOwnProperty(key)){
            let valObj = httpResponseStatusCodes[key];
            if(valObj.code === statusCode){
                responseObj = valObj;
                break;
            }
        }
    }
    return responseObj;
}

//#ENDREGION Private Functions
