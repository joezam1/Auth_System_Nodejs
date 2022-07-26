const DataTypes = require('../../library/stringLiterals/dataTypes.js');


//Test:DONE
let stringIsNullOrEmpty = function(input){
    let isValidType = (typeof input === DataTypes.STRING || typeof input === DataTypes.OBJECT);
    let isValidValue = (input === null || (input !==null && input.length === 0));

    if( (isValidType && isValidValue)){
        return true;
    }
    return false;
}
//Test:DONE
let objectIsNullOrEmpty = function(obj){
    let isObject = ((typeof obj === DataTypes.OBJECT ) && !Array.isArray(obj) && typeof obj !== undefined );
    let isEmptyObj = ( isObject &&  obj !== null && Object.keys(obj).length === 0 );
    let isNullObj = ( obj === null)
    let result =  (isObject && (isEmptyObj || isNullObj))
    return result;
}



let inputCommonInspectorService = {
    stringIsNullOrEmpty : stringIsNullOrEmpty,
    objectIsNullOrEmpty:objectIsNullOrEmpty
}

module.exports = inputCommonInspectorService