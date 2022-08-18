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




const service = Object.freeze({
    isValidJson:isValidJson
});

module.exports = service;