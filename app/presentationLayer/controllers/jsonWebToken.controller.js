const jsonWebTokenDomainManager = require('../../domainLayer/domainManagers/jsonWebTokenDomainManager.js');
const httpResponseService = require('../../services/httpProtocol/httpResponseService.js');
const monitorService = require('../../services/monitoring/monitorService.js');




let jsonWebTokenController = function(app){


    //METHOD
    //CREATE
    //READ
    //UPDATE
    app.put('/api/jsonwebtokens/update', async function(request, response){
        monitorService.capture('jsonwebtokens-update-request');
        var tokenResult = await jsonWebTokenDomainManager.resolveJsonWebTokenUpdateAsync(request);
        monitorService.capture('app.put(/api/jsonwebtokens/update-RESPONSE-tokenResult', tokenResult);
        httpResponseService.sendHttpResponse(tokenResult);
        return;
    });
    //DELETE
}


module.exports = jsonWebTokenController;