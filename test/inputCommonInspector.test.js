const inputCommonInspector = require('../app/serviceLayer/validation/inputCommonInspector.js');


describe('File: inputCommonInspector.js', () => {
    //test('True is True', ()=>{ expect(true).toBe(true); });

    describe('Function: stringIsNullOrEmpty', function () {
        test('Empty string returns TRUE', function () {
            //Arrange
            let emptyString = '';
            //Act
            var result = inputCommonInspector.stringIsNullOrEmpty(emptyString);
            //Assert
            expect(result).toBe(true);
        });

        test('NULL string returns TRUE', function () {
            //Arrange
            let nullString = null;
            //Act
            var result = inputCommonInspector.stringIsNullOrEmpty(nullString);
            //Assert
            expect(result).toBe(true);
        });

        test('Empty object returns FALSE', function () {
            //Arrange
            let emptyObj = {};
            //Act
            var result = inputCommonInspector.stringIsNullOrEmpty(emptyObj);
            //Assert
            expect(result).toBe(false);
        });

        test('string with Value returns FALSE', function () {
            //Arrange
            let simpleString = 'this is a string';
            //Act
            var result = inputCommonInspector.stringIsNullOrEmpty(simpleString);
            //Assert
            expect(result).toBe(false);
        });

        test('string written null returns FALSE', function () {
            //Arrange
            let simpleString = 'null';
            //Act
            var result = inputCommonInspector.stringIsNullOrEmpty(simpleString);
            //Assert
            expect(result).toBe(false);
        });
    });

    describe('Function: objectIsNullOrEmpty', function () {
        test('Empty Object returns TRUE', function () {
            //Arrange
            let emptyObj = {};
            //Act
            let result = inputCommonInspector.objectIsNullOrEmpty(emptyObj);
            //Assert
            expect(result).toBe(true);
        });

        test('NULL Object returns TRUE', function () {
            //Arrange
            let nullObj = null;
            //Act
            let result = inputCommonInspector.objectIsNullOrEmpty(nullObj);
            //Assert
            expect(result).toBe(true);
        });

        test('Property Object returns FALSE', function () {
            //Arrange
            let obj = { status: 200, statusText: "OK" };
            //Act
            let result = inputCommonInspector.objectIsNullOrEmpty(obj);
            //Assert
            expect(result).toBe(false);
        });


    });

});