const jsDataType = require('../stringLiterals/jsDataType.js');
const inputTypeInspector = require('../../services/validation/inputTypeInspector.js');
const inputCommonInspector = require('../../services/validation/inputCommonInspector.js');
const encryptionService = require('../../services/encryption/encryptionService.js');


//Test: DONE
const removeLeadingAndTrailingSpaces = function(input){
    let inputNoSpaces = input;
    if(typeof input === jsDataType.STRING){
        inputNoSpaces = input.trim();
    }
    return inputNoSpaces;
}
//Test: DONE
const convertLocaleDateToUTCFormatForDatabase = function(selectedLocaleDateAsDate){
    let dateUTC = selectedLocaleDateAsDate.toISOString();
    let dateUTCDateTimeFormat = convertISOStringDateToUTCFormatForDatabase(dateUTC);//.replace('T', ' ').substring(0,19);

    return dateUTCDateTimeFormat;
}
//Test: DONE
const convertISOStringDateToUTCFormatForDatabase = function(ISOStringDate){
    let dateUTCDateTimeFormat = ISOStringDate.replace('T', ' ').substring(0,19);

    return dateUTCDateTimeFormat;
}
//Test: DONE
const composeUTCDateToUTCFormatForDatabase = function(selectedUtcDateAsDate){

    let selectedUTCYear = selectedUtcDateAsDate.getFullYear();
    let selectedUTCMonth = selectedUtcDateAsDate.getMonth();
    let selectedUTCDate = selectedUtcDateAsDate.getDate();
    let utcTimeStringArray = (selectedUtcDateAsDate.toTimeString()).split(' ');
    let adjustedUTCMonth = (selectedUTCMonth + 1);
    let formattedUTCMonth = ( adjustedUTCMonth < 10) ? '0'+adjustedUTCMonth : adjustedUTCMonth;
    let composedUTCDateDbFormat = selectedUTCYear + '-' + formattedUTCMonth + '-' + selectedUTCDate + ' ' + utcTimeStringArray[0];

     return composedUTCDateDbFormat;
}
//Test: DONE
const convertLocaleDateToUTCDate = function(localeDAteAsDate ){
    //To convert to UTC datetime by subtracting the current Timezone offset
    let utcDate =  new Date(localeDAteAsDate.getTime() + (localeDAteAsDate.getTimezoneOffset()*60000));
    return utcDate;
}

//Test: DONE
const createPropertiesArrayFromObjectProperties = function(obj){
    let properties = [];
    for(const key in obj){
        let newObj =  obj[key];
        properties.push(newObj);
    }
    return properties;
}
//Test: DONE
const formatStringFirstLetterCapital = function(input){

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

//Test: DONE
const convertToStringOrStringifyForDataStorage = function(input){

    if(inputTypeInspector.isTypeString(input) ){
        return input;
    }

    else if(inputTypeInspector.isDate(input) ||
            inputTypeInspector.isTypeBoolean(input) ||
            inputTypeInspector.isTypeDecimal(input) ||
            inputTypeInspector.isTypeInteger(input) ||
            inputTypeInspector.isTypeNumber(input)){
        return input.toString();
    }

    else if(Array.isArray(input) || inputTypeInspector.isTypeFunction(input)){
        return input.toString();
    }

    else if(inputTypeInspector.isTypeNull(input) || inputCommonInspector.valueIsUndefined(input) ){
        return '';
    }

    else if(inputTypeInspector.isTypeObject(input)){
        return JSON.stringify(input);
    }
    return '';
}
//Test: DONE
const composeErrorObjectToStringify = function(errorObj){
    console.log('composeErrorObjectToStringify-errorObj', errorObj);
    let newErrorObj = Object.assign({}, errorObj);
    let propertyExist  =  (('toJSON' in Error.prototype));
    if (!propertyExist){
        Object.defineProperty(newErrorObj, 'toJSON', {
            value: function () {
                var alt = {};
                Object.getOwnPropertyNames(errorObj).forEach(function (key) {
                    alt[key] = errorObj[key];
                }, errorObj);
                return alt;
            },
            configurable: true,
            writable: true
        });
    }

    return newErrorObj;
}


const service= Object.freeze({
    removeLeadingAndTrailingSpaces : removeLeadingAndTrailingSpaces,
    convertLocaleDateToUTCFormatForDatabase : convertLocaleDateToUTCFormatForDatabase,
    convertISOStringDateToUTCFormatForDatabase : convertISOStringDateToUTCFormatForDatabase,
    createPropertiesArrayFromObjectProperties : createPropertiesArrayFromObjectProperties,
    formatStringFirstLetterCapital : formatStringFirstLetterCapital,
    convertToStringOrStringifyForDataStorage : convertToStringOrStringifyForDataStorage,
    composeUTCDateToUTCFormatForDatabase : composeUTCDateToUTCFormatForDatabase,
    convertLocaleDateToUTCDate : convertLocaleDateToUTCDate,
    composeErrorObjectToStringify : composeErrorObjectToStringify
});

module.exports = service;