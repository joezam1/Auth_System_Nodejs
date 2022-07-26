const ObjectModelInspector = require('./objectModelInspector.js');


//Test: DONE
let resolveUserModelValidation = function(userModel){
    let reportInputLength = ObjectModelInspector.inspectInputLength(userModel);
    let reportInputType = ObjectModelInspector.inspectInputType(userModel);
    let reportInputValue = ObjectModelInspector.inspectInputValue(userModel);

    let errorsReport = Object.assign({},reportInputType,reportInputLength,reportInputValue);
    return errorsReport;
}


let validationService = {
    resolveUserModelValidation : resolveUserModelValidation
}

module.exports = validationService;

//#REGION Private Functions

//#ENDREGION Private Functions
