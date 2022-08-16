const formFieldStatus = require('../../library/enumerations/formFieldStatus.js');
const jsDataType = require('../../library/stringLiterals/jsDataType.js');
const inputCommonInspector = require('../../services/validation/inputCommonInspector.js');

var sessionViewModel = function(model){

    let sessionToken = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.sessionToken || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: jsDataType.STRING
    };
    let expires = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.expires || 0): 0,
        fieldStatus: formFieldStatus.Required,
        fieldDataType: jsDataType.NUMBER
    }

    var data = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.data || {}): {},
        fieldStatus: formFieldStatus.Required,
        fieldDataType: jsDataType.OBJECT
    };

    var isActive = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.isActive || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: jsDataType.BOOLEAN
    };

    var utcDateCreated = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.utcDateCreated || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: jsDataType.DATE
    };

    var utcDateExpired = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.utcDateExpired || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: jsDataType.DATE
    };



    return {
        sessionToken : sessionToken,
        expires : expires,
        data : data,
        isActive : isActive,
        utcDateCreated : utcDateCreated,
        utcDateExpired : utcDateExpired
    }
}

module.exports = sessionViewModel;