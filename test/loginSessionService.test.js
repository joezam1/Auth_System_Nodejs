const loginSessionService = require('../app/serviceLayer/authentication/loginSessionService.js');

describe('File: loginSessionService.js', function(){
    test('Function: generateSessionTokenAsync', async function(){
        //Arrange

        //Act
        let result = await loginSessionService.generateSessionTokenAsync();
        //Assert
        expect(result).not.toBeNull();
    });
});