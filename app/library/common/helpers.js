const DataTypes = require('../stringLiterals/dataTypes.js');
const CommonValidators = require('../../services/validation/commonValidators.js.js');//require('../../serviceLayer/validation/commonValidators.js');

//Test: DONE
let removeLeadingAndTrailinsSpaces = function(input){
    let inputNoSpaces = input;
    if(typeof input === DataTypes.STRING){
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
    if(typeof input === DataTypes.STRING){
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
function getHtmlBreakSeparator(input){
    let inputIsValid = CommonValidators.isValidString(input);
    return (inputIsValid ? '<br/>' : '');
}
//Test: DONE
function getmessageFormatForDisplay(input){
    if(CommonValidators.isValidString(input)){
        return input;
    }
    return '';
}


let service={
    removeLeadingAndTrailinsSpaces : removeLeadingAndTrailinsSpaces,
    getDateUTCFormatForDatabase : getDateUTCFormatForDatabase,
    createPropertiesArrayFromObjectProperties : createPropertiesArrayFromObjectProperties,
    formatStringFirstLetterCapital : formatStringFirstLetterCapital,
    getHtmlBreakSeparator : getHtmlBreakSeparator,
    getmessageFormatForDisplay : getmessageFormatForDisplay
}

module.exports = service;