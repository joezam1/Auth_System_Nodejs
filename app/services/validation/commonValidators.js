'use strict'
const DataTypes = require('../../library/stringLiterals/dataTypes.js');

//Test:DONE
var isValidJson = function(input){
    if(typeof input !== DataTypes.STRING)
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