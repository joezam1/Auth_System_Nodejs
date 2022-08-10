const inMemoryDataStore = require('../app/services/inMemoryStorage/inMemoryDataStore.js');



describe('File: inMemoryDataStore.js', function(){
    describe('Function: updateDataStore', function(){
        test('Updated data Store brings the one with the new properties', function(){
            //Arrange
            let mockDataStore = {test:'ok'};

            //Act
            let originalDataStore = inMemoryDataStore.getDataStore();
            inMemoryDataStore.updateDataStore(mockDataStore);
            let updatedMockDataStore = inMemoryDataStore.getDataStore();

            //Assert
            expect(updatedMockDataStore).toEqual(mockDataStore);
            inMemoryDataStore.updateDataStore(originalDataStore);
        });
    });

    describe('Function: getDataStore', function(){
        test('Calling the function getDataStore() brings the current dataStore', function(){
            //Arrange
            //Act
            let currentDataStore = inMemoryDataStore.getDataStore();
            let isTypeObject = (typeof(currentDataStore) === 'object');
            //Assert
            expect(isTypeObject).toBe(true);
            expect(currentDataStore).not.toEqual(null);
        });
    });
});