const jsDataType = require('../../library/stringLiterals/jsDataType.js');


//Test:DONE
const stringIsNullOrEmpty = function(input){
    if(valueIsUndefined(input)) {
        return false;
    }
    let isValidType = (typeof input === jsDataType.STRING || typeof input === jsDataType.OBJECT);
    let isValidValue = (input === null || (input !==null && input !== undefined && input.length === 0));

    if( (isValidType && isValidValue)){
        return true;
    }
    return false;
}
//Test:DONE
const objectIsNullOrEmpty = function(obj){
    let isObjectType = (typeof obj == jsDataType.OBJECT)
    let isArrayType = Array.isArray(obj);
    let isNotUndefinedType = typeof obj !== 'undefined';

    let isNullValue = ( obj === null)

    let isObject = ( isObjectType && !isArrayType && isNotUndefinedType );
    let isEmptyObj = ( isObject && !isNullValue && Object.keys(obj).length === 0 );

    let result =  (isObject && (isEmptyObj || isNullValue))
    return result;
}
//Test: DONE
const valueIsUndefined = function(value){
    let objUndefinedType = typeof value === 'undefined';
    let valueIsUndefined = (value === undefined)
    let result = (objUndefinedType && valueIsUndefined);
    return result;
}
//Test:DONE
const stringIsValid = function(inputStr){
    let isValidType = (typeof inputStr === jsDataType.STRING);
    let isNullOrEmpty = stringIsNullOrEmpty(inputStr);
    let isUndefined = valueIsUndefined(inputStr);
    if(isValidType && !isNullOrEmpty && !isUndefined) {
        return true;
    }
    return false;
}

//Test:DONE
const objectIsValid = function(obj){
    let isObjectType = (typeof obj == jsDataType.OBJECT)
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

//Test: DONE
const inputExist = function(input){
    if(input !== null && !valueIsUndefined(input)){
            return true;
    }
    return false;
}


const inputCommonInspectorService = Object.freeze({
    stringIsNullOrEmpty : stringIsNullOrEmpty,
    objectIsNullOrEmpty:objectIsNullOrEmpty,
    valueIsUndefined : valueIsUndefined,
    objectIsValid : objectIsValid,
    stringIsValid : stringIsValid,
    inputExist : inputExist
});

module.exports = inputCommonInspectorService