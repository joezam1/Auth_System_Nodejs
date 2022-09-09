const antiForgeryTokenHelper = require('../app/services/csrfProtection/antiForgeryTokenHelper.js');
const reducerService = require('../app/services/inMemoryStorage/reducerService.js');
const { EXPIRING_ANTIFORGERY_TOKEN_CRYPTO_KEY } = require('../configuration/csrfProtection/antiForgeryTokenConfig');


jest.mock('../app/services/inMemoryStorage/reducerService.js');


describe('File: antiForgeryTokenHelper.js', function(){
    describe('Function: saveCsrfTokenDataToStorage', function(){
        test('CAN save CsrfToken Data To Storage', function(){
            //Arrange
            let referer = 'abcd';
            let origin = 'abcd';
            let userAgent = 'abcd';
            let csrfToken = 'abcd';

            reducerService.dispatch = jest.fn();
            //Act
            let result = antiForgeryTokenHelper.saveCsrfTokenDataToStorage(referer, origin, userAgent, csrfToken);

            //Assert
            expect(reducerService.dispatch).toHaveBeenCalledTimes(1);
        });
    });

    describe('Function: getIndexOfCurrentCsrfTokenSavedInDataStore', function(){
        test('CAN get Index Of Current CsrfToken Saved In DataStore', function(){
            //Arrange
            let tokensArray =  [{ csrfToken: 1 }, { csrfToken: 2 }, { csrfToken: 3 }, { csrfToken: 4 }, { csrfToken: 5 }, { csrfToken: 6 }, { csrfToken: 7 }]
            reducerService.getCurrentStateByProperty = jest.fn().mockReturnValue(tokensArray);

            let selectedToken = 2;
            let expectedIndex = 1;
            //Act
            let result = antiForgeryTokenHelper.getIndexOfCurrentCsrfTokenSavedInDataStore(selectedToken);

            //Assert
            expect(reducerService.getCurrentStateByProperty).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedIndex);
        });
    });

    describe('Function: getCurrentCsrfTokenSavedInDataStoreByIndex', function(){
        describe('CAN get Current CsrfToken Saved In DataStore By Index', function(){

            //Arrange
            let index = 3;
             //Arrange
             let tokensArray =  [{ csrfToken: 1 }, { csrfToken: 2 }, { csrfToken: 3 }, { csrfToken: 4 }, { csrfToken: 5 }, { csrfToken: 6 }, { csrfToken: 7 }]
             reducerService.getCurrentStateByProperty = jest.fn().mockReturnValue(tokensArray);
             let expectedTokenValue = 4;
             //Act
             let result = antiForgeryTokenHelper.getCurrentCsrfTokenSavedInDataStoreByIndex(index);
            let valueResult = result.csrfToken;
             //Assert
             expect(reducerService.getCurrentStateByProperty).toHaveBeenCalledTimes(1);
             expect(valueResult).toEqual(expectedTokenValue);
        });
    });

    describe('Function: isValidIncomingCsrfData', function(){
        test('When a single value is discrepant, The RESULT is FALSE', function(){

            //Arrange
            let tokenDataStore ={
                referer: 'abc',
                origin: 'abc',
                userAgent: 'abc'
            };
            let requestData ={
                referer: '123',
                origin: 'abc',
                userAgent: 'abc'
            }
            //Act
            let result = antiForgeryTokenHelper.isValidIncomingCsrfData(tokenDataStore, requestData);
            //Assert
            expect(result).toEqual(false);
        });
        test('When Referer value is undefined is considered valid and Referer ignored for Validation', function(){
            //Arrange
            let tokenDataStore ={
                referer: null,
                origin: 'abc',
                userAgent: 'abc'
            };
            let requestData ={
                referer: '123',
                origin: 'abc',
                userAgent: 'abc'
            }
            //Act
            let result = antiForgeryTokenHelper.isValidIncomingCsrfData(tokenDataStore, requestData);
            //Assert
            expect(result).toEqual(true);
        });

        test('When all values are the same, the Result is TRUE', function(){
             //Arrange
             let tokenDataStore ={
                referer: '123',
                origin: 'abc',
                userAgent: 'abc'
            };
            let requestData ={
                referer: '123',
                origin: 'abc',
                userAgent: 'abc'
            }
            //Act
            let result = antiForgeryTokenHelper.isValidIncomingCsrfData(tokenDataStore, requestData);
            //Assert
            expect(result).toEqual(true);
        })
    });

    describe('Function: updateCsrfTokenDataStorage', function(){
        test('CAN update CsrfToken DataStorage', function(){
            //Arrange
            let index = 10;
            let selectedToken = {
                csrfToken: 5
            }
            reducerService.dispatch = jest.fn();
            //Act
            let result = antiForgeryTokenHelper.updateCsrfTokenDataStorage(index, selectedToken);
            //Assert
            expect(reducerService.dispatch).toHaveBeenCalledTimes(1);

        })
    });


    describe('Function: removeCsrfTokenFromDataStorage', function(){
        test('CAN remove CsrfToken From DataStorage', function(){
            //Arrange

            let selectedToken = {
                csrfToken: 5
            }
            reducerService.dispatch = jest.fn();
            //Act
            let result = antiForgeryTokenHelper.removeCsrfTokenFromDataStorage(selectedToken);
            //Assert
            expect(reducerService.dispatch).toHaveBeenCalledTimes(1);

        })
    });
});
