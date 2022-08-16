const jsDataType = require('../../library/stringLiterals/jsDataType.js');

//Test: DONE
var isTypeString = function (input) {
    var result = (typeof input === jsDataType.STRING);
    return result;
}
//Test: DONE
var isTypeBoolean = function (input) {
    var result = (typeof input === jsDataType.BOOLEAN)
    return result;
}
//Test: DONE
var isTypeNumber = function (input) {
    var isNumeric = !isNaN(input);
    var isTypeNumber = (typeof input === jsDataType.NUMBER);
    var result = (isNumeric && isTypeNumber)
    return result;
}
//Test: DONE
var isTypeInteger = function (input) {
    var isNumeric = isTypeNumber(input);
    var isInteger = ((input - Math.floor(input)) === 0)
    var result = (isNumeric && isInteger)
    return result;
}
//test: DONE
var isTypeDecimal = function (input) {
    var isNumeric = isTypeNumber(input);
    var isDecimal = ((input - Math.floor(input)) !== 0)
    var result = (isNumeric && isDecimal)
    return result;
}
//Test: DONE
var isTypeNull = function (input) {
    var result = (typeof input === jsDataType.OBJECT && input !== undefined && input === null && !Array.isArray(input) && input !== jsDataType.NULL)
    return result;
}
//Test: DONE
var isTypeFunction = function (input) {
    var result = (typeof input ===jsDataType.FUNCTION)
    return result;
}
//Test: DONE
var isTypeObject = function (input) {
    var result = (typeof input ===jsDataType.OBJECT && input !== undefined && input !== null && !Array.isArray(input) && input !==jsDataType.NULL)
    return result;
}
//Test: DONE
var isDate = function(input){
    let inputData = input;
    if(typeof input === jsDataType.STRING ){
        let result = Date.parse(input)
        inputData =(isNaN(result))? result : new Date(result);
    }
    var result = (inputData instanceof Date);

    return result;
}

var service = {
    isTypeString: isTypeString,
    isTypeBoolean: isTypeBoolean,
    isTypeNumber: isTypeNumber,
    isTypeInteger: isTypeInteger,
    isTypeDecimal: isTypeDecimal,
    isTypeNull: isTypeNull,
    isTypeFunction: isTypeFunction,
    isTypeObject: isTypeObject,
    isDate : isDate
}

module.exports = service;