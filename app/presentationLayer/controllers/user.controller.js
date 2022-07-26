const domainManager = require('../../domainLayer/domainManager.js');
const inputCommonInspector = require('../../serviceLayer/validation/inputCommonInspector.js');
const httpREsponseStatus = require('../../library/enumerations/httpResponseStatus.js');


var user = function(app){

    //METHOD
    //CREATE
    app.post('/api/users/register', async function(request, response){
        console.log('register-request.body', request.body);
        var userRegistrationResult = await domainManager.resolveUserRegistrationAsync(request);
        if(!inputCommonInspector.objectIsNullOrEmpty(userRegistrationResult) && !inputCommonInspector.objectIsNullOrEmpty(userRegistrationResult.status)){
            response.status(userRegistrationResult.status).send(userRegistrationResult);
        }else{
            response.status(httpREsponseStatus._404notFound).send(userRegistrationResult);
        }
    });
    app.post('/api/users/login', async function(request, response){
        console.log('login-request.body', request.body);
        var userLoginResult = await domainManager.resolveUserLoginSessionAsync(request);
        console.log('userLoginResult', userLoginResult);
        if(!inputCommonInspector.objectIsNullOrEmpty(userLoginResult) && !inputCommonInspector.objectIsNullOrEmpty(userLoginResult.status)){
            response.status(userLoginResult.status).send(userLoginResult);
        }else{
            response.status(httpREsponseStatus._404notFound).send(userLoginResult);
        }
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
}

module.exports = user;