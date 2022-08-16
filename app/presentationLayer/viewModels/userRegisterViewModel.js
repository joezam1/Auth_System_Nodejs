const formFieldStatus = require('../../library/enumerations/formFieldStatus.js');
const jsDataType = require('../../library/stringLiterals/jsDataType.js');
const inputCommonInspector = require('../../services/validation/inputCommonInspector.js');

const userRegisterViewModel = function(model){
    let firstName ={
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.firstName || '') : '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: jsDataType.STRING
    };
    let middleName = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.middleName || '') : '',
        fieldStatus:formFieldStatus.Optional,
        fieldDataType: jsDataType.STRING
    };
    let lastName = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.lastName || '') : '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: jsDataType.STRING
    };
    let username = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.username || '') : '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: jsDataType.STRING
    };
    let email = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.email || '') : '',
        fieldStatus:formFieldStatus.Required,
        fieldDataType: jsDataType.STRING
    };
    let password = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.password || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: jsDataType.STRING
    };
    let confirmPassword = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.confirmPassword || '') : '',
        fieldStatus:formFieldStatus.Required,
        fieldDataType: jsDataType.STRING
    };

    return {
        firstName:firstName,
        middleName:middleName,
        lastName:lastName,
        username:username,
        email:email,
        password:password,
        confirmPassword:confirmPassword
    }

}

module.exports = userRegisterViewModel;