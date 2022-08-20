const formFieldStatus = require('../../library/enumerations/formFieldStatus.js');
const jsDataType = require('../../library/stringLiterals/jsDataType.js');
const inputCommonInspector = require('../../services/validation/inputCommonInspector.js');

const userRegisterViewModel = function(model){

    let userId = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.userId || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: jsDataType.STRING
    };

    let geoLocation = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.geoLocation || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: jsDataType.STRING
    };

    let deviceAndBrowser = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.deviceAndBrowser || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: jsDataType.STRING
    };

    let userAgent = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.userAgent || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: jsDataType.STRING
    };

    return {
        userId:userId,
        geoLocation:geoLocation,
        deviceAndBrowser:deviceAndBrowser,
        userAgent:userAgent
    }
}

module.exports = userRegisterViewModel;