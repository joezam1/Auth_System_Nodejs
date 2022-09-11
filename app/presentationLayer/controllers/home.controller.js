const homeDomainManager = require('../../domainLayer/domainManagers/homeDomainManager.js');
const httpResponseService = require('../../services/httpProtocol/httpResponseService.js');
const monitorService = require('../../services/monitoring/monitorService.js');





let homeController = function(app){

    //METHOD
    //CREATE
    //READ
    app.get('/api/home/resources', async function(request, response){
        monitorService.capture('app.get(/home/resources');
        var resourcesResult = await homeDomainManager.resolveGetResourcesAsync(request);
        monitorService.capture('resourcesResult', resourcesResult);
        httpResponseService.sendHttpResponse(resourcesResult);
        return;

    });
    //UPDATE
    //DELETE
}

module.exports = homeController;