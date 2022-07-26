const devEnv = require('../../../configuration/environment/envConfig.js');
var connection = require('../../dataAccessLayer/mysqlDataStore/context/dbConnection.js');

var dbAction = require('../../dataAccessLayer/mysqlDataStore/context/dbAction.js');
var userRepository = require('../../dataAccessLayer/repositories/userRepository.js');
const httpResponseService = require('../../serviceLayer/httpProtocol/httpResponseService.js');
const httpResponseStatus = require('../../library/enumerations/HttpResponseStatus.js');

var helloWorld = async function(app){

    app.get('/', async (request, response)=>{
        let objRes = httpResponseService.getResponseResultStatus("hello",httpResponseStatus._401unauthorized);


        var username = 'jthornton1';
        var email = 'john.thornton11@west.com';
        var password = 'abc';
        var userInfo = await userRepository.getUserByUsernameAndEmailDataAsync(username,email,password);
        console.log('userInd', userInfo);

        //var executeStat = await dbAction.executeStatementAsync('SELECT 1');

        response.state = 200;
        var obj={
            result: 'Hello World!! from express-auth! using NODE_ENV: ' + devEnv.NODE_ENV + ' '+ userInfo
        }
        response.send(obj);
    });
}

module.exports = helloWorld;