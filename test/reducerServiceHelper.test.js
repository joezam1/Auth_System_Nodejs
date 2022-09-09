const reducerServiceHelper = require('../app/services/inMemoryStorage/reducerServiceHelper.js');




describe('File: reducerServiceHelper.js', function () {
    describe('Function: getOriginalDataStore', function () {
        test('CAN get Original DataStore', function () {
            //Arrange
            let originalDataStore = {
                data: 'info'
            }
            //Act
            let result = reducerServiceHelper.getOriginalDataStore(originalDataStore);
            //Assert

            expect(result.data).toEqual(originalDataStore.data);
        });
    });

    describe('Function: getUpdatedDataStore', function () {
        test('CAN update DataStore', function () {
            //Arrange
            let originalDataStore = {
                data: 'info'
            }

            let newDataStore = {
                data: ['valule1', {}],
                info: 'this is a test',
                token: 'adfadf'
            }
            //Act
            let result = reducerServiceHelper.getUpdatedDataStore(newDataStore, originalDataStore);

            //Assert
            expect(result.token).toEqual(newDataStore.token);
            expect(result.data).toEqual(newDataStore.data);
        });
        test('When the DataStore does not contain a property it Inserts in the update dataStore', function () {
            //Arrange
            let originalDataStore = {};

            let newDataStore = {
                data: ['valule1', {}],
                info: 'this is a test',
                token: 'adfadf'
            }
            //Act
            let result = reducerServiceHelper.getUpdatedDataStore(newDataStore, originalDataStore);

            //Assert
            expect(result.token).toEqual(newDataStore.token);
            expect(result.data).toEqual(newDataStore.data);
        });
    });

    describe('Function: addCsrfTokenToArray', function () {
        test('When csrfToken does not exist in Array is Added to it', function () {
            //Arrange
            let tokenData = { csrfToken: 31 };
            let tokensArray = [{ csrfToken: 1 }, { csrfToken: 2 }, { csrfToken: 3 }, { csrfToken: 4 }, { csrfToken: 5 }]
            //Act
            let updatedArray = reducerServiceHelper.addCsrfTokenToArray(tokenData, tokensArray);

            //Assert
            expect(updatedArray[5].csrfToken).toEqual(tokenData.csrfToken);
        });

        test('When csrfToken ALREADY exist in Array is NOT Added to it', function () {
            //Arrange
            let tokenData = { csrfToken: 1 };
            let tokensArray = [{ csrfToken: 1 }, { csrfToken: 2 }, { csrfToken: 3 }, { csrfToken: 4 }, { csrfToken: 5 }]
            //Act
            let updatedArray = reducerServiceHelper.addCsrfTokenToArray(tokenData, tokensArray);

            //Assert
            expect(updatedArray[4].csrfToken).toEqual(5);
        });
    });

    describe('Function: updateCsrfTokenInArray', function () {
        test('When index is out of Bounds of Array the Array is NOT UPDATE', function () {
            //Arrange
            let index = 15;
            let tokenData = { csrfToken: 1 };
            let tokensArray = [{ csrfToken: 1 }, { csrfToken: 2 }, { csrfToken: 3 }, { csrfToken: 4 }, { csrfToken: 5 }]
            //Act
            let updatedArray = reducerServiceHelper.updateCsrfTokenInArray(index, tokenData, tokensArray);

            //Assert
            expect(updatedArray).toEqual(tokensArray);
        });

        test('When index is valid inside the Array, the element is UPDATE', function () {
            //Arrange
            let index = 1;
            let tokenData = 411;
            let tokensArray = [{ csrfToken: 1 }, { csrfToken: 2 }, { csrfToken: 3 }, { csrfToken: 4 }, { csrfToken: 5 }]
            //Act
            let updatedArray = reducerServiceHelper.updateCsrfTokenInArray(index, tokenData, tokensArray);

            //Assert
            expect(updatedArray[index].csrfToken).toEqual(tokenData);
        });
    });

    describe('Function: removeSingleCsrfTokenDataFromArray', function () {
        test('When value is present in Target Array, the array element is removed', function () {
            //Arrange

            let tokenData = 1;
            let tokensArray = [{ csrfToken: 1 }, { csrfToken: 2 }, { csrfToken: 3 }, { csrfToken: 4 }, { csrfToken: 5 }]
            //Act
            let updatedArray = reducerServiceHelper.removeSingleCsrfTokenDataFromArray(tokenData, tokensArray);

            //Assert
            expect(updatedArray[0].csrfToken).toEqual(2);
            expect(updatedArray.length).toEqual(4);
        })

        test('When value is NOT present in Target Array, the array remains the same', function () {
            //Arrange

            let tokenData = 91;
            let tokensArray = [{ csrfToken: 1 }, { csrfToken: 2 }, { csrfToken: 3 }, { csrfToken: 4 }, { csrfToken: 5 }]
            //Act
            let updatedArray = reducerServiceHelper.removeSingleCsrfTokenDataFromArray(tokenData, tokensArray);

            //Assert
            expect(updatedArray[0].csrfToken).toEqual(1);
            expect(updatedArray.length).toEqual(5);
        })
    });

    describe('Function: removeAllSelectedCsrfTokensFromArray', function () {
        test('When Tokens for removal are present in the latest array, they are removed', function () {

            //Arrange
            let originalTokenArray = [{ csrfToken: 1 }, { csrfToken: 2 }, { csrfToken: 3 }, { csrfToken: 4 }, { csrfToken: 5 }]

            let tokensForDeletionArray = [ 1, 2];
            let newestTokensArray = [{ csrfToken: 1 }, { csrfToken: 2 }, { csrfToken: 3 }, { csrfToken: 4 }, { csrfToken: 5 }, { csrfToken: 6 }, { csrfToken: 7 }]

            let expectedArray = [{ csrfToken: 3 }, { csrfToken: 4 }, { csrfToken: 5 }, { csrfToken: 6 }, { csrfToken: 7 }]
            //Act
            let resultArray = reducerServiceHelper.removeAllSelectedCsrfTokensFromArray(tokensForDeletionArray, newestTokensArray);
            //Assert
            expect(resultArray).toEqual(expectedArray);
        });
    });

    describe('Function: removeAllDuplicateElementsFromNewestArray', function(){
        test('When comparing 2 Arrays, the unique elements are selected', function () {

            //Arrange
            let baseTokensArray =  [{ csrfToken: 1 }, { csrfToken: 2 }, { csrfToken: 3 }, { csrfToken: 4 }, { csrfToken: 5 }, { csrfToken: 6 }, { csrfToken: 7 }]

            let latestArrayAfterTokenRemoval =  [{ csrfToken: 1 }, { csrfToken: 2 }, { csrfToken: 3 }, { csrfToken: 4 }, { csrfToken: 5 }, { csrfToken: 6 }, { csrfToken: 7 }, { csrfToken: 8 }, { csrfToken: 9 }]
            let expectedArray = [{ csrfToken: 8 }, { csrfToken: 9 }]
            //Act
            let arrayResult = reducerServiceHelper.removeAllDuplicateElementsFromNewestArray(baseTokensArray,latestArrayAfterTokenRemoval);
            //Assert
            expect(arrayResult).toEqual(expectedArray);
        });
    });

    describe('Function: mergeTwoArraysAndCreateSingleArrayWithUniqueElements', function(){
        test('When duplicated elements are found, they are removed', function(){
             //Arrange
             let baseTokensArray =  [{ csrfToken: 1 }, { csrfToken: 2 }, { csrfToken: 3 ,referer:'abc', origin:'abc'}, { csrfToken: 4 ,referer:'def', origin:'def'}]

             let latestArrayAfterTokenRemoval =  [ { csrfToken: 3,referer:'abc', origin:'abc' }, { csrfToken: 4 ,referer:'def', origin:'def' }, { csrfToken: 5 }, { csrfToken: 6 }, { csrfToken: 7 }]
             let expectedArray = [{ csrfToken: 1 }, { csrfToken: 2 }, { csrfToken: 3 ,referer:'abc', origin:'abc'}, { csrfToken: 4 ,referer:'def', origin:'def'},{ csrfToken: 5 }, { csrfToken: 6 }, { csrfToken: 7 }]
             //Act
             let arrayResult = reducerServiceHelper.mergeTwoArraysAndCreateSingleArrayWithUniqueElements(baseTokensArray,latestArrayAfterTokenRemoval);
             //Assert
             expect(arrayResult).toEqual(expectedArray);
        })
    });

});