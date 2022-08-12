const DataTypes = require('../../library/stringLiterals/dataTypes.js');


//Test:DONE
let stringIsNullOrEmpty = function(input){
    if(valueIsUndefined(input)) {
        return false;
    }
    let isValidType = (typeof input === DataTypes.STRING || typeof input === DataTypes.OBJECT);
    let isValidValue = (input === null || (input !==null && input !== undefined && input.length === 0));

    if( (isValidType && isValidValue)){
        return true;
    }
    return false;
}
//Test:DONE
let objectIsNullOrEmpty = function(obj){
    let isObjectType = (typeof obj == DataTypes.OBJECT)
    let isArrayType = Array.isArray(obj);
    let isNotUndefinedType = typeof obj !== 'undefined';

    let isNullValue = ( obj === null)

    let isObject = ( isObjectType && !isArrayType && isNotUndefinedType );
    let isEmptyObj = ( isObject && !isNullValue && Object.keys(obj).length === 0 );

    let result =  (isObject && (isEmptyObj || isNullValue))
    return result;
}
//Test: DONE
let valueIsUndefined = function(value){
    let objUndefinedType = typeof value === 'undefined';
    let valueIsUndefined = (value === undefined)
    let result = (objUndefinedType && valueIsUndefined);
    return result;
}
//Test:DONE
let stringIsValid = function(inputStr){
    let isValidType = (typeof inputStr === DataTypes.STRING);
    let isNullOrEmpty = stringIsNullOrEmpty(inputStr);
    let isUndefined = valueIsUndefined(inputStr);
    if(isValidType && !isNullOrEmpty && !isUndefined) {
        return true;
    }
    return false;
}

//Test:DONE
function objectIsValid(obj){
    let isObjectType = (typeof obj == DataTypes.OBJECT)
    let isArrayType = Array.isArray(obj);
    let isNotUndefinedType = typeof obj !== 'undefined';
    let isValidType = (isObjectType && !isArrayType && isNotUndefinedType);
    let isNullOrEmpty = objectIsNullOrEmpty(obj);
    let isUndefined = valueIsUndefined(obj);
    if(isValidType && !isNullOrEmpty && !isUndefined) {
        return true;
    }
    return false;
}


let inputCommonInspectorService = {
    stringIsNullOrEmpty : stringIsNullOrEmpty,
    objectIsNullOrEmpty:objectIsNullOrEmpty,
    valueIsUndefined : valueIsUndefined,
    objectIsValid : objectIsValid,
    stringIsValid : stringIsValid
}

module.exports = inputCommonInspectorService