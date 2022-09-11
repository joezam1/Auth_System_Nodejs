const httpResponseStatusCodes = require('./httpResponseStatusCodes.js');
const httpResponseStatus = require('../../library/enumerations/httpResponseStatus.js');
const inputCommonInspector = require('../validation/inputCommonInspector.js');
const httpResponseHelper = require('./httpResponseHelper.js');
const monitorService = require('../monitoring/monitorService.js');


let _httpResponse = null;

//Test: DONE
const setHttpResponseProperty = function (httpResponse) {

    _httpResponse = httpResponse;
}

//Test: DONE
const getHttpResponseProperty = function () {
    return _httpResponse;
}
//Test:DONE
const setServerResponseCookies = function (cookiesArray) {
    for (let a = 0; a < cookiesArray.length; a++) {
        let cookieObj = cookiesArray[a];
        httpResponseHelper.setCookie(_httpResponse, cookieObj);
    }
}
//Test: DONE
const setServerResponseHeaders = function (headersArray) {

    for (let a = 0; a < headersArray.length; a++) {
        let headerObj = headersArray[a];
        httpResponseHelper.setHeader(_httpResponse, headerObj);

    }
}

//Test: DONE
const getResponseResultStatus = function (resultObj, statusCode) {
    let responseObj = getResponseStatusObject(statusCode);

    let obj = {
        result: resultObj,
        status: responseObj.code,
        statusText: responseObj.statusText
    }
     //console.log('getResponseResultStatus-obj', obj);
    return obj;
}
//Test: DONE
const sendHttpResponse = function (resultObj) {
    monitorService.capture('sendHttpResponse_httpResponse');
    try{
        if (inputCommonInspector.inputExist(resultObj) && inputCommonInspector.inputExist(resultObj.status)) {
            httpResponseHelper.executeSend(_httpResponse, resultObj.status, resultObj);
        } else {
            httpResponseHelper.executeSend(_httpResponse, httpResponseStatus._404notFound, resultObj);
        }
        return;
    }
    catch (error) {
        let err = new Error(error);
        console.log('Error WHILE Sending HTTP Response');
        console.log('sendHttpResponse-TRY-CATCH-error', err);
        return;
    }
}


let service = Object.freeze({
    setHttpResponseProperty: setHttpResponseProperty,
    getHttpResponseProperty: getHttpResponseProperty,
    setServerResponseHeaders: setServerResponseHeaders,
    setServerResponseCookies: setServerResponseCookies,
    getResponseResultStatus: getResponseResultStatus,
    sendHttpResponse: sendHttpResponse
});

module.exports = service;

//#REGION Private Functions

function getResponseStatusObject(statusCode) {

    let responseObj = {
        code: httpResponseStatusCodes.unprocessableEntity422.code,
        statusText: httpResponseStatusCodes.unprocessableEntity422.statusText
    };

    for (let key in httpResponseStatusCodes) {
        if (httpResponseStatusCodes.hasOwnProperty(key)) {
            let valObj = httpResponseStatusCodes[key];
            if (valObj.code === statusCode) {
                responseObj = valObj;
                break;
            }
        }
    }
    return responseObj;
}

//#ENDREGION Private Functions
