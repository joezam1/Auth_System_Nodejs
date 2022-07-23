'use strict'
const DataTypes = require('../../library/stringLiterals/dataTypes.js');


//Test:DONE
var isValidObj = function(input){
    var result = (typeof input === DataTypes.OBJECT && input !== null && !Array.isArray(input) && input !== undefined && input !== DataTypes.NULL)
    return result;
}

//Test:DONE
var isValidString = function(input){
    if(typeof input === DataTypes.STRING && input != null && input != undefined){
        return true;
    }
    return false;
}

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
    isValidJson:isValidJson,
    isValidString:isValidString,
    isValidObj:isValidObj
}

module.exports = service;