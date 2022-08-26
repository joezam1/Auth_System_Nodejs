const httpResponseStatusCodes = require('./httpResponseStatusCodes.js');
const httpResponseStatus = require('../../library/enumerations/httpResponseStatus.js');
const inputCommonInspector = require('../validation/inputCommonInspector.js');
const httpResponseHelper = require('./httpResponseHelper.js');



let _httpResponse = null;


const setHttpResponseProperty = function(httpResponse){

    _httpResponse = httpResponse;
}

const setServerResponseCookies = function(cookiesArray){
    for(let a = 0; a < cookiesArray.length; a++){
        let cookieObj = cookiesArray[a];
        httpResponseHelper.setCookie(_httpResponse, cookieObj);
    }
}

const setServerResponseHeaders = function(headersArray){

    for(let a = 0; a < headersArray.length; a++){
        let headerObj = headersArray[a];
        _httpResponse.set(headerObj.key, headerObj.value);
    }
}

//Test: DONE
const getResponseResultStatus = function(resultObj, statusCode){
    console.log('_httpResponse', _httpResponse);

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
const sendHttpResponse = function(resultObj){
    console.log('_httpResponse', _httpResponse);
    try{
            if(!inputCommonInspector.objectIsNullOrEmpty(resultObj) && !inputCommonInspector.objectIsNullOrEmpty(resultObj.status)){
            httpResponseHelper.executeSend(_httpResponse, resultObj.status, resultObj);
        }else{
            httpResponseHelper.executeSend(_httpResponse, httpResponseStatus._404notFound, resultObj);
        }
    }
    catch(error){
        let message = 'error sending HTTP Response: ' + error;
        let err = new Error(message);
        httpResponseHelper.executeSend(_httpResponse, httpResponseStatus._500internalServerError , err)
    }
}


let service = Object.freeze({
    setHttpResponseProperty : setHttpResponseProperty,
    setServerResponseHeaders : setServerResponseHeaders,
    setServerResponseCookies : setServerResponseCookies,
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
