const DataTypes = require('../../library/stringLiterals/dataTypes.js');

//Test: DONE
var isTypeString = function (input) {
    var result = (typeof input === DataTypes.STRING);
    return result;
}
//Test: DONE
var isTypeBoolean = function (input) {
    var result = (typeof input === DataTypes.BOOLEAN)
    return result;
}
//Test: DONE
var isTypeNumber = function (input) {
    var isNumeric = !isNaN(input);
    var isTypeNumber = (typeof input === DataTypes.NUMBER);
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
    var result = (typeof input === DataTypes.OBJECT && input !== undefined && input === null && !Array.isArray(input) && input !== DataTypes.NULL)
    return result;
}
//Test: DONE
var isTypeFunction = function (input) {
    var result = (typeof input ===DataTypes.FUNCTION)
    return result;
}
//Test: DONE
var isTypeObject = function (input) {
    var result = (typeof input ===DataTypes.OBJECT && input !== undefined && input !== null && !Array.isArray(input) && input !==DataTypes.NULL)
    return result;
}
//Test: DONE
var isDate = function(input){
    let inputData = input;
    if(typeof input === DataTypes.STRING ){
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