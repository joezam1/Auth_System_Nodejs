'use strict'


const jsDataType = require('../../library/stringLiterals/jsDataType.js');

//Test:DONE
var isValidJson = function(input){
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




var service = {
    isValidJson:isValidJson
}

module.exports = service;