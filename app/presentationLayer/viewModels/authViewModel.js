const formFieldStatus = require('../../library/enumerations/formFieldStatus.js');
const jsDataType = require('../../library/stringLiterals/jsDataType.js');
const inputCommonInspector = require('../../services/validation/inputCommonInspector.js');

const authViewModel = function(model){

    let jwtAccessToken = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.jwtAccessToken || ''): '',
        fieldStatus: formFieldStatus.Optional,
        fieldDataType: jsDataType.STRING
    };

    let jwtRefreshToken = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.jwtRefreshToken || ''): '',
        fieldStatus: formFieldStatus.Optional,
        fieldDataType: jsDataType.STRING
    };

    let session = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.session || ''): '',
        fieldStatus: formFieldStatus.Optional,
        fieldDataType: jsDataType.STRING
    }

    return {
        jwtAccessToken : jwtAccessToken,
        jwtRefreshToken : jwtRefreshToken,
        session : session
    }
}

module.exports = authViewModel;
