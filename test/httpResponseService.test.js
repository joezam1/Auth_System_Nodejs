const httpResponseService = require('../app/services/httpProtocol/httpResponseService.js');
const httpResponseStatusCodes = require('../app/services/httpProtocol/httpResponseStatusCodes.js');
const httpResponseHelper = require('../app/services/httpProtocol/httpResponseHelper.js');
jest.mock('../app/services/httpProtocol/httpResponseHelper.js');

describe('File: httpResponseService.js', function(){

    afterAll(function(){
        jest.resetAllMocks();
    });
    describe('Function : getResponseResultStatus', function(){

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


    describe('Function: sendHttpResponse', function(){
        test('Result object is sent in the Response Correctly', function(){

            //Arrange
            let mockResponseObject = {status:200, statusText:'ok',result:'inserted value'}
            httpResponseHelper.executeSend = jest.fn().mockReturnValueOnce(mockResponseObject);
            //let mockExpressResponse = {};
            let resultObj = {status:200, statusCode:'ok'};
            //Act
            let result = httpResponseService.sendHttpResponse(resultObj);
            //Assert

            expect(httpResponseHelper.executeSend).toBeCalledTimes(1);
        });

        test('When function is called it executes the Response', function(){

            //Arrange
            let err = new Error('error in json object');
            let mockResponseObject = {status:500, statusText:'internalServerError',result:err}
            httpResponseHelper.executeSend = jest.fn();
            httpResponseHelper.executeSend.mockImplementation((response, status, resultObj)=>{

                let _response = response;
                let _status = status;
                let _resultObj = resultObj;

            }).mockReturnValueOnce(mockResponseObject);
            let mockExpressResponse = {};
            let resultObj = 'this is a string {status:200, statusCode:"ok"}';
            //Act
            httpResponseHelper.executeSend(mockExpressResponse, 200, resultObj);
            let result = httpResponseService.sendHttpResponse(resultObj);
            //Assert
            //Called the Mock 1 time and called the original 1 time
            expect(httpResponseHelper.executeSend).toBeCalledTimes(2);
        });
    });

});