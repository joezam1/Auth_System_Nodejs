const formFieldStatus = require('../../library/enumerations/formFieldStatus.js');
const dataTypes = require('../../library/stringLiterals/dataTypes.js');
const inputCommonInspector = require('../../serviceLayer/validation/inputCommonInspector.js');

const userRegisterViewModel = function(model){

    let username = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.username || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: dataTypes.STRING
    };

    let password = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.password || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: dataTypes.STRING
    };

    return {
        username:username,
        password:password
    }
}

module.exports = userRegisterViewModel;