const formFieldStatus = require('../../library/enumerations/formFieldStatus.js');
const jsDataType = require('../../library/stringLiterals/jsDataType.js');
const inputCommonInspector = require('../../services/validation/inputCommonInspector.js');

const userRegisterViewModel = function(model){

    let username = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.username || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: jsDataType.STRING
    };

    let password = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.password || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: jsDataType.STRING
    };

    return {
        username:username,
        password:password
    }
}

module.exports = userRegisterViewModel;