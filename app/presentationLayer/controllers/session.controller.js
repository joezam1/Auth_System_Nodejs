const sessionDomainManager = require('../../domainLayer/sessionDomainManager.js');
const httpResponseService = require('../../serviceLayer/httpProtocol/httpResponseService.js');

var sessionController = function(app){

    //METHOD
    //CREATE
    //READ
    app.get('/api/sessions/sessiontoken', async function(request, response){
        console.log('api/sessions/sessiontoken', request);
        var sessionResult = await sessionDomainManager.resolveGetSessionAsync(request);
        console.log('sessionResult', sessionResult);
        httpResponseService.sendHttpResponse(sessionResult,response);
    });

    //UPDATE
    app.put('/api/sessions/update', async function(request, response){
        console.log('session-update-request.body', request.body);
        var sessionResult = await sessionDomainManager.resolveSessionUpdateAsync(request);
        console.log('sessionResult', sessionResult);
        httpResponseService.sendHttpResponse(sessionResult,response);
    });
    //DELETE
}

module.exports = sessionController;