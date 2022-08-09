const formFieldStatus = require('../../library/enumerations/formFieldStatus.js');
const dataTypes = require('../../library/stringLiterals/dataTypes.js');
const inputCommonInspector = require('../../serviceLayer/validation/inputCommonInspector.js');

var sessionViewModel = function(model){

    let sessionToken = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.sessionToken || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: dataTypes.STRING
    };
    let expires = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.expires || 0): 0,
        fieldStatus: formFieldStatus.Required,
        fieldDataType: dataTypes.NUMBER
    }

    var data = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.data || {}): {},
        fieldStatus: formFieldStatus.Required,
        fieldDataType: dataTypes.OBJECT
    };

    var isActive = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.isActive || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: dataTypes.BOOLEAN
    };

    var utcDateCreated = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.utcDateCreated || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: dataTypes.DATE
    };

    var utcDateExpired = {
        fieldValue: inputCommonInspector.objectIsValid(model) ? (model.utcDateExpired || ''): '',
        fieldStatus: formFieldStatus.Required,
        fieldDataType: dataTypes.DATE
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