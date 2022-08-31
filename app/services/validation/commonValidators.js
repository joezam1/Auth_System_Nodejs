'use strict'
const jsDataType = require('../../library/stringLiterals/jsDataType.js');

//Test:DONE
const isValidJson = function(input){
    if(typeof input !== jsDataType.STRING)
    {
        return false;
    }
    try{
        JSON.parse(input);
    }
    catch(error){
        return false;
    }
    return true;
}

//Test:DONE
let safeJsonParse = function (input) {
    var value = input;
    if (isValidJson(input)) {
        value = JSON.parse(input);
    }
    return value;
}



const service = Object.freeze({
    isValidJson:isValidJson,
    safeJsonParse : safeJsonParse
});

module.exports = service;