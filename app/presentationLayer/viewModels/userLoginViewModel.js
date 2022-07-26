const formFieldStatus = require('../../library/enumerations/formFieldStatus.js');
const dataTypes = require('../../library/stringLiterals/dataTypes.js');


var userRegisterViewModel = function(model){

    var username = {
        fieldValue: (model.username || ''),
        fieldStatus: formFieldStatus.Required,
        fieldDataType: dataTypes.STRING
    };

    var password = {
        fieldValue: (model.password || ''),
        fieldStatus: formFieldStatus.Required,
        fieldDataType: dataTypes.STRING
    };


    return {
        username:username,
        password:password
    }

}

module.exports = userRegisterViewModel;