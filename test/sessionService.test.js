const sessionService = require('../app/services/authentication/sessionService.js');

describe('File: sessionService.js', function(){
    describe('Function: generateSessionTokenAsync', function(){
        test('When the function is called a token is generated OK', async function(){
            //Arrange
            //Act
            let result = await sessionService.generateSessionTokenAsync();
            //Assert
            expect(result).not.toBeNull();
        });
    });

    describe('Function: sessionIsExpired', function(){
        test('Date in the past will return sessionIsExpired: TRUE', function(){
            //Arrange
            let dateNow = new Date();
            let utcDate =  new Date(dateNow.getTime() + (dateNow.getTimezoneOffset()*60000));
            let dateYesterday = utcDate.setDate(utcDate.getDate() - 1);

            //Act
            let result = sessionService.sessionIsExpired(utcDate);
            //Assert
            expect(result).toBe(true);

        });

        test('Date in the future will return sessionIsExpired: FALSE', function(){
            //Arrange
            let dateNow = new Date();
            let utcDate =  new Date(dateNow.getTime() + (dateNow.getTimezoneOffset()*60000));
            let dateDayAfterTomorrow = utcDate.setDate(utcDate.getDate() + 3);

            //Act
            let result = sessionService.sessionIsExpired(utcDate);
            //Assert
            expect(result).toBe(false);

        });
    });

    describe('Function: calculatSessionDateExpiry', function(){
        test('Once defined the locale date created the Date expired will be always in the future', function(){
            //Arrange
            let dateCreated = new Date();
            let expiry5MinutesInMilliseconds = 1000 * 60 * 5;
            //Act
            let dateExpiry = sessionService.calculatSessionDateExpiry(dateCreated, expiry5MinutesInMilliseconds);
            //Assert
            let expiryIsInTheFuture = (dateExpiry.getTime() > dateCreated.getTime());
            expect(expiryIsInTheFuture).toBe(true);
        });
    });
});
