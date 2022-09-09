const homeDomainManager = require('../../domainLayer/domainManagers/homeDomainManager.js');
const httpResponseService = require('../../services/httpProtocol/httpResponseService.js');

let homeController = function(app){

    //METHOD
    //CREATE
    //READ
    app.get('/api/home/resources', async function(request, response){
        console.log('app.get(/home/resources');
        var resourcesResult = await homeDomainManager.resolveGetResourcesAsync(request);
        console.log('resourcesResult', resourcesResult);
        httpResponseService.sendHttpResponse(resourcesResult);
        return;

    });
    //UPDATE
    //DELETE
}

module.exports = homeController;