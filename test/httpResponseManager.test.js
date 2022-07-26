const httpResponseService = require('../app/serviceLayer/httpProtocol/httpResponseService.js');
const httpResponseStatusCodes = require('../app/serviceLayer/httpProtocol/httpResponseStatusCodes.js');

describe('File: httpResponseService.js', function(){

    describe('Function : getResponseStatusObject', function(){

        test('When Status code IS NOT EXISTING, response is 422 Unprocessable Entity', function(){
            //Arrange
            let message = 'Code is not existing';
            let statusCode = 123;
            //Act
            let result = httpResponseService.getResponseResultStatus(message,statusCode)
            let resultStatus = result.status;
            let expectedStatusCode = httpResponseStatusCodes.unprocessableEntity422.code;
            //Assert
            expect(resultStatus).toBe(expectedStatusCode);
        });
        test('When Status code IS EXISTING, response is Corresponding Status', function(){
            //Arrange
            let message = 'Code exists';
            let statusCode = 201;
            //Act
            let result = httpResponseService.getResponseResultStatus(message,statusCode)
            let resultStatus = result.status;
            let expectedStatusCode = httpResponseStatusCodes.created201.code;
            //Assert
            expect(resultStatus).toBe(expectedStatusCode);
        });
    });


});