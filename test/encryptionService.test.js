
const encryptionService = require('../app/serviceLayer/encryption/encryptionService.js');
const validationConfig = require('../configuration/validation/validationConfig.js');
const bcrypt = require('bcryptjs');



xdescribe('File: encryptionService.js', function(){
    describe('Function: encryptStringInputAsync', function(){

        test('If input is Type STRING, then the string is encrypted',async function(){

            //Arrange
            let plainTextInput = 'this is a string'
            //Act
            let hashResult = await encryptionService.encryptStringInputAsync(plainTextInput);
            var result = await bcrypt.compare(plainTextInput,hashResult);
            //Assert
            let resultType = (typeof hashResult === 'string');
            expect(hashResult).not.toEqual(plainTextInput);
            expect(result).toBe(true);
            expect(resultType).toBe(true);
        });

        test('If input is not Type STRING, then the result is NOT encrypted',async function(){

            //Arrange
            let plainTextInput = {};
            //Act
            let hashResult = await encryptionService.encryptStringInputAsync(plainTextInput);
            //Assert
            let resultType = (typeof hashResult === 'object');
            expect(hashResult).toEqual(plainTextInput);
            expect(resultType).toBe(true);
        });
    });
});


/*
describe('File: httpResponseManager.js', function(){

    describe('Function : getResponseStatusObject', function(){

        test('When Status code IS NOT EXISTING, response is 422 Unprocessable Entity', function(){
            //Arrange
            let message = 'Code is not existing';
            let statusCode = 123;
            //Act
            let result = httpResponseManager.getResponseResultStatus(message,statusCode)
            let resultStatus = result.status;
            let expectedStatusCode = httpResponseStatusCodes.unprocessableEntity422.code;
            //Assert
            expect(resultStatus).toBe(expectedStatusCode);
        });

    });
})*/