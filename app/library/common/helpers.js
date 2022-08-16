const jsDataType = require('../stringLiterals/jsDataType.js');
const inputTypeInspector = require('../../services/validation/inputTypeInspector.js');
const InputValidationSuffix = require('../stringLiterals/inputValidationSuffix.js');

//Test: DONE
let removeLeadingAndTrailingSpaces = function(input){
    let inputNoSpaces = input;
    if(typeof input === jsDataType.STRING){
        inputNoSpaces = input.trim();
    }
    return inputNoSpaces;
}
//Test: DONE
let getDateUTCFormatForDatabase = function(selectedLocaleDate){
    let dateUTC = selectedLocaleDate.toISOString();
    let dateUTCDateTimeFormat = dateUTC.replace('T', ' ').substring(0,19);

    return dateUTCDateTimeFormat;
}

let composeUTCDateToFormatForDatabase = function(selectedUtcDateAsDate){
    let timeStringArray = (selectedUtcDateAsDate.toTimeString()).split(' ');
    let utcDateCreatedArray = (selectedUtcDateAsDate.toISOString()).split('T');
    let composedUTCDateDbFormat =  utcDateCreatedArray[0] + ' ' + timeStringArray[0];

     return composedUTCDateDbFormat;
}
//Test: DONE
let createPropertiesArrayFromObjectProperties = function(obj){
    let properties = [];
    for(const key in obj){
        let newObj =  obj[key];
        properties.push(newObj);
    }
    return properties;
}
//Test: DONE
let formatStringFirstLetterCapital = function(input){

    let newInput = input;
    let allInputsArray = [];
    if(typeof input === jsDataType.STRING){
        let spacedCamelCase = input.replace(/[A-Z]/g, ' $&').trim();
        let normalizedInputArray = spacedCamelCase.split(' ');
        for(let a = 0; a < normalizedInputArray.length; a++){
            let charAtZeroUppercase = normalizedInputArray[a].charAt(0).toUpperCase();
            let capitalFirstLetter = normalizedInputArray[a].replace(normalizedInputArray[a].charAt(0), charAtZeroUppercase);
            allInputsArray.push(capitalFirstLetter);
        }

        newInput = allInputsArray.join(' ');
    }

    return newInput;

}
let convertToStringOrStringifyForDataStorage = function(input){
    let result = '';
    if(inputTypeInspector.isTypeString(input) ){
        return input;
    }
    else if(inputTypeInspector.isDate(input) || inputTypeInspector.isTypeBoolean(input) || inputTypeInspector.isTypeDecimal(input) || inputTypeInspector.isTypeInteger(input) || inputTypeInspector.isTypeNumber(input) || inputTypeInspector.isTypeNull(input) ){
        result = input.toString();
    }
    else if(inputTypeInspector.isTypeFunction(input)){
        let func = { inputFunc : input }
        result = JSON.stringify(func);
    }
    else if(inputTypeInspector.isTypeObject(input)){
        result = JSON.stringify(input);
    }
    return result;
}

let service={
    removeLeadingAndTrailingSpaces : removeLeadingAndTrailingSpaces,
    getDateUTCFormatForDatabase : getDateUTCFormatForDatabase,
    createPropertiesArrayFromObjectProperties : createPropertiesArrayFromObjectProperties,
    formatStringFirstLetterCapital : formatStringFirstLetterCapital,
    convertToStringOrStringifyForDataStorage : convertToStringOrStringifyForDataStorage,
    composeUTCDateToFormatForDatabase : composeUTCDateToFormatForDatabase
}

module.exports = service;