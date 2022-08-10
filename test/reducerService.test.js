const reducerService = require('../app/services/inMemoryStorage/reducerService.js');
const inMemoryDataStore = require('../app/services/inMemoryStorage/inMemoryDataStore.js');
const reducerServiceActions = require('../app/library/enumerations/reducerServiceActions.js');

jest.mock('../app/services/inMemoryStorage/inMemoryDataStore.js');

describe('File: reducerService.js', function(){
    afterAll(()=>{
        jest.resetAllMocks();
    });

    describe('Function: dispatch', function(){
        test('Payload updates the dataStore', function(){
            //Arrange
            let mockDataStore = {};
            let mockUpdatedDataStore = { sessionInspector:true };
            inMemoryDataStore.getDataStore = jest.fn().mockReturnValueOnce(mockDataStore);
            inMemoryDataStore.updateDataStore = jest.fn().mockReturnValueOnce(mockUpdatedDataStore);
            let payloadObj = {sessionInspector:true};
            let action={type: reducerServiceActions.startSessionInspector};
            //Act
            let result = reducerService.dispatch(payloadObj, action);
            //Assert
            expect(result).toEqual(payloadObj);
            expect(inMemoryDataStore.getDataStore).toBeCalledTimes(1);
        });
    });

    describe('Function: getCurrentStateByProperty', function(){
        test('Calling the function for Existing DataStore Property brings its correct Value', function(){

            //Arrange
            let mockDataStore = { testProperty: 'ok'};
            let property = 'testProperty';
            inMemoryDataStore.getDataStore = jest.fn().mockReturnValueOnce(mockDataStore);
            //Act
            let result = reducerService.getCurrentStateByProperty(property);
            //Assert
            expect(result).toEqual('ok');
            expect(inMemoryDataStore.getDataStore).toBeCalledTimes(1);

        })

        test('Calling the function for NON-EXISTING DataStore Property returns UNDEFINED Value', function(){

            //Arrange
            let mockDataStore = { testProperty: 'ok'};
            let property = 'INFO';
            inMemoryDataStore.getDataStore = jest.fn().mockReturnValueOnce(mockDataStore);
            //Act
            let result = reducerService.getCurrentStateByProperty(property);
            //Assert
            expect(result).toEqual(undefined);
            expect(inMemoryDataStore.getDataStore).toBeCalledTimes(1);

        })
    });
});
