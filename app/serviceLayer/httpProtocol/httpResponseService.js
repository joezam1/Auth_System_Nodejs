const httpResponseStatusCodes = require('./httpResponseStatusCodes.js');

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


let service = {
    getResponseResultStatus : getResponseResultStatus
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
