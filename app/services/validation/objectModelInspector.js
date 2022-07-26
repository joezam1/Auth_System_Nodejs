const Helpers = require('../../library/common/helpers.js');
const InputCommonInspector = require('./inputCommonInspector.js');
const InputTypeInspector = require('./inputTypeInspector.js');
const InputValueInspector = require('./inputValueInspector');
const ValidationConfig = require('../../../configuration/validation/validationConfig.js');
const FormFieldStatus = require('../../library/enumerations/formFieldStatus.js');
const jsDataType = require('../../library/stringLiterals/jsDataType.js');
const InputValidationSuffix = require('../../library/stringLiterals/inputValidationSuffix.js');

//Test: DONE
const inspectInputLength = function(objViewModel){
    let inputLengthReport = {};
    for(var key in objViewModel){
        if(!objViewModel.hasOwnProperty(key)){
            continue;
        }
        let value = objViewModel[key].fieldValue;
        let fieldStatus = objViewModel[key].fieldStatus;

        if(fieldStatus === FormFieldStatus.Required && InputCommonInspector.stringIsNullOrEmpty(value)){
            let allCapitalLettersKey = Helpers.formatStringFirstLetterCapital(key);
            inputLengthReport[`${key + InputValidationSuffix.REQUIRED}`] = `${allCapitalLettersKey} is empty. ${allCapitalLettersKey} is Required`;
        }
    }
    return inputLengthReport;
}

//Test: DONE
let inspectInputType = function(objViewModel){
    let reportTypeErrors = {};
    for(let key in objViewModel){
        if(objViewModel.hasOwnProperty(key)){
            let selectedDataType = objViewModel[key].fieldDataType;
            switch(selectedDataType){
                case jsDataType.STRING:
                if(!InputTypeInspector.isTypeString(objViewModel[key].fieldValue)){
                    reportTypeErrors[`${key + InputValidationSuffix.DATATYPE}`] = getReportErrorInputType(objViewModel, key);
                }
                break;

                case jsDataType.DATE:
                if(!InputTypeInspector.isDate(objViewModel[key].fieldValue)){
                    reportTypeErrors[`${key + InputValidationSuffix.DATATYPE}`] = getReportErrorInputType(objViewModel, key);
                }
                break;

                case jsDataType.NUMBER:
                if(!InputTypeInspector.isTypeNumber(objViewModel[key].fieldValue)){
                    reportTypeErrors[`${key + InputValidationSuffix.DATATYPE}`] = getReportErrorInputType(objViewModel, key);
                }
                break;

                case jsDataType.BOOLEAN:
                if(!InputTypeInspector.isTypeBoolean(objViewModel[key].fieldValue)){
                    reportTypeErrors[`${key + InputValidationSuffix.DATATYPE}`] = getReportErrorInputType(objViewModel, key);
                }
                break;

                case jsDataType.OBJECT:
                if(!InputTypeInspector.isTypeObject(objViewModel[key].fieldValue)){
                    reportTypeErrors[`${key + InputValidationSuffix.DATATYPE}`] = getReportErrorInputType(objViewModel, key);
                }
                break;
            }
        }
    }
    return reportTypeErrors;
}

//Test: DONE
function inspectInputValue(objViewModel){
    let dataReportErrors = {};
    let selectedPassword = '';
    for(let key in objViewModel){
        if(objViewModel.hasOwnProperty(key)){

            if(key.toLowerCase() ===('username')){
                let value = objViewModel[key].fieldValue;
                if(!InputValueInspector.usernameIsValid(value)){
                    let allCapitalLettersKey = Helpers.formatStringFirstLetterCapital(key);
                    dataReportErrors[`${key + InputValidationSuffix.INVALID}`] = `${allCapitalLettersKey} is Invalid`;
                }
            }

            else if(key.toLowerCase().includes('name')){
                let value = objViewModel[key].fieldValue;
                if(!InputValueInspector.nameIsValid(value)){
                    let allCapitalLettersKey = Helpers.formatStringFirstLetterCapital(key);
                    dataReportErrors[`${key + InputValidationSuffix.INVALID}`] = `${allCapitalLettersKey} is Invalid`;
                }
            }


            else if(key.toLowerCase().includes('email')){
                let value = objViewModel[key].fieldValue;
                if(!InputValueInspector.emailIsValid(value)){
                    let allCapitalLettersKey = Helpers.formatStringFirstLetterCapital(key);
                    dataReportErrors[`${key + InputValidationSuffix.INVALID}`] = `${allCapitalLettersKey} is Invalid`;
                }
            }

            else if(key.toLowerCase() === ('password')){
                selectedPassword = objViewModel[key].fieldValue;
                if(!InputValueInspector.passwordMinCharactersIsValid(selectedPassword, ValidationConfig.passwordMinCharacters)){
                    let allCapitalLettersKey = Helpers.formatStringFirstLetterCapital(key);
                    dataReportErrors[`${key + InputValidationSuffix.INVALID}`] = `${allCapitalLettersKey} must have ${ValidationConfig.passwordMinCharacters} minimum characters`;
                }
            }

            else if(key.toLowerCase() === ('confirmpassword')){
                let selectedConfirmPasswordValue = objViewModel[key].fieldValue;
                if(!InputValueInspector.passwordAndConfirmPasswordAreEqual(selectedPassword , selectedConfirmPasswordValue)){
                    let allCapitalLettersKey = Helpers.formatStringFirstLetterCapital(key);
                    dataReportErrors.confirmPasswordInvalid  = `Password and ${allCapitalLettersKey} are not the same`;
                }
            }
        }
    }
    return dataReportErrors;
}

const service = {
    inspectInputLength : inspectInputLength,
    inspectInputType : inspectInputType,
    inspectInputValue : inspectInputValue
}

module.exports = service;

//#REGION Private Functions
function getReportErrorInputType(userViewModel,key){
    let allCapitalLettersKey = Helpers.formatStringFirstLetterCapital(  key );
    let reportValue =  `${allCapitalLettersKey} must be of type ${userViewModel[key].fieldDataType}`;

    return reportValue;
}

//#ENDREGION Private Functions
