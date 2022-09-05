const sessionDomainManager = require('../../domainLayer/domainManagers/sessionDomainManager.js');
const httpResponseService = require('../../services/httpProtocol/httpResponseService.js');

let sessionController = function(app){

    //METHOD
    //CREATE
    //READ
    app.get('/api/sessions/sessiontoken', async function(request, response, next){
        console.log('api/sessions/sessiontoken');
        var sessionResult = await sessionDomainManager.resolveGetSessionAsync(request);
        console.log('sessionResult', sessionResult);
        httpResponseService.sendHttpResponse(sessionResult);
        return;

    });

    //UPDATE
    app.put('/api/sessions/update', async function(request, response){
        console.log(' app.put(/api/sessions/updatesession-REQUEST-update-');
        var sessionResult = await sessionDomainManager.resolveSessionAndJsoWebTokenUpdate(request);
        console.log(' app.put(/api/sessions/update-RESPONSE-sessionResult', sessionResult);
        httpResponseService.sendHttpResponse(sessionResult);
        return;
    });
    //DELETE
}

module.exports = sessionController;