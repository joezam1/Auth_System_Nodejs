const sessionService = require('../app/serviceLayer/authentication/sessionService.js');

describe('File: sessionService.js', function(){
    test('Function: generateSessionTokenAsync', async function(){
        //Arrange

        //Act
        let result = await sessionService.generateSessionTokenAsync();
        //Assert
        expect(result).not.toBeNull();
    });
});