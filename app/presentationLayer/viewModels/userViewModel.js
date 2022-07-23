const formFieldStatus = require('../../library/enumerations/formFieldStatus.js');
const dataTypes = require('../../library/stringLiterals/dataTypes.js');


var userViewModel = function(model){
    var firstName ={
        fieldValue: (model.firstName || ''),
        fieldStatus: formFieldStatus.Required,
        fieldDataType: dataTypes.STRING
    };
    var middleName = {
        fieldValue: (model.middleName || ''),
        fieldStatus:formFieldStatus.Optional,
        fieldDataType: dataTypes.STRING
    };
    var lastName = {
        fieldValue: (model.lastName || ''),
        fieldStatus: formFieldStatus.Required,
        fieldDataType: dataTypes.STRING
    };
    var username = {
        fieldValue: (model.username || ''),
        fieldStatus: formFieldStatus.Required,
        fieldDataType: dataTypes.STRING
    };
    var email = {
        fieldValue: (model.email || ''),
        fieldStatus:formFieldStatus.Required,
        fieldDataType: dataTypes.STRING
    };
    var password = {
        fieldValue: (model.password || ''),
        fieldStatus: formFieldStatus.Required,
        fieldDataType: dataTypes.STRING
    };
    var confirmPassword = {
        fieldValue: (model.confirmPassword || ''),
        fieldStatus:formFieldStatus.Required,
        fieldDataType: dataTypes.STRING
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

module.exports = userViewModel;