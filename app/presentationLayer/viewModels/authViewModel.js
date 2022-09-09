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

    let csrfToken = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.csrfToken || ''): '',
        fieldStatus: formFieldStatus.Optional,
        fieldDataType: jsDataType.STRING
    }
    let csrfTokenClient = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.csrfTokenClient || ''): '',
        fieldStatus: formFieldStatus.Optional,
        fieldDataType: jsDataType.STRING
    }
    let referer = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.referer || ''): '',
        fieldStatus: formFieldStatus.Optional,
        fieldDataType: jsDataType.STRING
    }

    let origin = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.origin || ''): '',
        fieldStatus: formFieldStatus.Optional,
        fieldDataType: jsDataType.STRING
    }

    let userAgent = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.userAgent || ''): '',
        fieldStatus: formFieldStatus.Optional,
        fieldDataType: jsDataType.STRING
    }

    return {
        jwtAccessToken : jwtAccessToken,
        jwtRefreshToken : jwtRefreshToken,
        session : session,
        csrfToken : csrfToken,
        csrfTokenClient : csrfTokenClient,
        referer : referer,
        origin : origin,
        userAgent : userAgent
    }
}

module.exports = authViewModel;
