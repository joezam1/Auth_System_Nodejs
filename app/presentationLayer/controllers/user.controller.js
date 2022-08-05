const userDomainManager = require('../../domainLayer/userDomainManager.js');
const httpResponseService = require('../../serviceLayer/httpProtocol/httpResponseService.js');

var userController = function(app){

    //METHOD
    //CREATE
    app.post('/api/users/register', async function(request, response){
        console.log('register-request.body', request.body);
        var userRegistrationResult = await userDomainManager.resolveUserRegistrationAsync(request);
        httpResponseService.sendHttpResponse(userRegistrationResult,response);
    });

    app.post('/api/users/login', async function(request, response){
        console.log('login-request.body', request.body);
        var userLoginResult = await userDomainManager.resolveUserLoginSessionAsync(request);
        console.log('userLoginResult', userLoginResult);
        httpResponseService.sendHttpResponse(userLoginResult,response);
    });

    //READ
    app.get('api/users/{GUID}', async function(request, reqponse){

    });

    app.get('/api/users', async function(request, response){

    });

    //UPDATE
    app.put('/api/users/{GUID}', async function(request, response){

    });

    //DELETE
    app.delete('/api/users/{GUID}', async function(request, response){

    });

    app.delete('/api/users/logout', async function(request, response){
        console.log('request', request);
        let userLogoutResult = await userDomainManager.resolveUserLogoutSessionAsync(request);
        console.log('userLogoutResult', userLogoutResult);
        httpResponseService.sendHttpResponse(userLogoutResult, response);
    })
}

module.exports = userController;