const jsonWebTokenDomainManager = require('../../domainLayer/domainManagers/jsonWebTokenDomainManager.js');
const httpResponseService = require('../../services/httpProtocol/httpResponseService.js');


let jsonWebTokenController = function(app){


    //METHOD
    //CREATE
    //READ
    //UPDATE
    app.put('/api/jsonwebtokens/update', async function(request, response){
        console.log('jsonwebtokens-update-request');
        var tokenResult = await jsonWebTokenDomainManager.resolveJsonWebTokenUpdateAsync(request);
        console.log('app.put(/api/jsonwebtokens/update-RESPONSE-tokenResult', tokenResult);
        httpResponseService.sendHttpResponse(tokenResult);
        return;
    });
    //DELETE
}


module.exports = jsonWebTokenController;