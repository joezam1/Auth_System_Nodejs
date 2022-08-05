const httpResponseStatusCodes = require('./httpResponseStatusCodes.js');
const httpResponseStatus = require('../../library/enumerations/httpResponseStatus.js');
const inputCommonInspector = require('../validation/inputCommonInspector.js');

//Test: DONE
let getResponseResultStatus = function(resultObj, statusCode){

    let responseObj = getResponseStatusObject(statusCode);
    console.log('responseObj', responseObj);
    let obj={
        result: resultObj,
        status:responseObj.code,
        statusText:responseObj.statusText
    }
    return obj;
}

let sendHttpResponse = function(resultObj, response){

    try{
        let resultJson = JSON.stringify(resultObj);
        if(!inputCommonInspector.objectIsNullOrEmpty(resultObj) && !inputCommonInspector.objectIsNullOrEmpty(resultObj.status)){
            response.status(resultObj.status).send(resultJson);
        }else{
            response.status(httpResponseStatus._404notFound).send(resultJson);
        }
    }
    catch(error){
        let message = 'error sending HTTP Response: ' + error;
        let err = new Error(message);
        response.status(httpResponseStatus._500internalServerError).send(err);
    }
}


let service = {
    getResponseResultStatus : getResponseResultStatus,
    sendHttpResponse : sendHttpResponse
}

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
