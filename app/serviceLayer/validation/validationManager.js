const ObjectModelInspector = require('./objectModelInspector.js');


//Test: DONE
let resolveUserRegisterValidation = function(userModel){
    let reportInputLength = ObjectModelInspector.inspectInputLength(userModel);
    let reportInputType = ObjectModelInspector.inspectInputType(userModel);
    let reportInputValue = ObjectModelInspector.inspectInputValue(userModel);

    let errorsReport = Object.assign({},reportInputType,reportInputLength,reportInputValue);
    return errorsReport;
}


let validationManagerService = {
    resolveUserRegisterValidation : resolveUserRegisterValidation
}

module.exports = validationManagerService;

//#REGION Private Functions

//#ENDREGION Private Functions
