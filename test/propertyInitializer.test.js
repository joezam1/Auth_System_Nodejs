const propertyInitializer = require('../app/middleware/propertyInitializer.js');
const httpResponseService = require('../app/services/httpProtocol/httpResponseService.js');



jest.mock('../app/services/httpProtocol/httpResponseService.js');

describe('File: propertyInitializer.js', function(){
    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('Function: propertyInitializer', function(){
        test('Function is called OK', async function(){
            //Arrange
            httpResponseService.setHttpResponseProperty = jest.fn();
            let mockRequest = {};
            let mockResponse = {};
            let mockNext = function(){

            }
            //Act

            let result = await propertyInitializer(mockRequest, mockResponse, mockNext);
            //Assert
            expect(httpResponseService.setHttpResponseProperty).toHaveBeenCalledTimes(1);
        })
    })
});