const httpResponseService = require('../services/httpProtocol/httpResponseService.js');



//Test: DONE
const propertyInitializer = async function(request, response, next) {

    httpResponseService.setHttpResponseProperty(response);
    next();
}

module.exports = propertyInitializer;