const inputCommonInspector = require('../app/services/validation/inputCommonInspector.js');


describe('File: inputCommonInspector.js', () => {

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

    describe('Function: valueIsUndefined', function(){
        test('Variable on purpose defined UNDEFINED, returns TRUE', function(){
            //Arrange
            let value = undefined;
            //Act
            let result = inputCommonInspector.valueIsUndefined(value);
            //Assert
            expect(result).toBe(true);
        });

        test('Variable left initialized and not assigned value returns TRUE', function(){
            //Arrange
            let value;
            //Act
            let result = inputCommonInspector.valueIsUndefined(value);
            //Assert
            expect(result).toBe(true);
        });


        test('Variable with an initialized value returns FALSE', function(){
            //Arrange
            let value = 'this is a string';
            //Act
            let result = inputCommonInspector.valueIsUndefined(value);
            //Assert
            expect(result).toBe(false);
        });
    });

    describe('Function: stringIsValid', function(){
        test('variable with numeric value returns FALSE', function(){
            //Arrange
            let value = 15;
            //Act
            let result = inputCommonInspector.stringIsValid(value);
            //Assert
            expect(result).toBe(false);
        })

        test('variable with string value returns TRUE', function(){
            //Arrange
            let value = '15';
            let typeResult = (typeof(value));
            //Act
            let result = inputCommonInspector.stringIsValid(value);
            //Assert
            expect(result).toBe(true);
        })

        test('variable not defined returns FALSE', function(){
            //Arrange
            let value;
            //Act
            let result = inputCommonInspector.stringIsValid(value);
            //Assert
            expect(result).toBe(false);
        })
    });

    describe('Function: objectIsValid', function(){
        test('Object with properties will return TRUE',function(){

            //Arrange
            let value = {name:'John'};
            //Act
            let result = inputCommonInspector.objectIsValid(value);
            //Assert
            expect(result).toBe(true);

        });

        test('Input Array Object returns FALSE', function(){
            //Arrange
            let jsObj = ['item1', 1, {code:1}];
            //Act
            let result = inputCommonInspector.objectIsValid(jsObj);
            //Assert
            expect(result).toBe(false);
        });

        test('Object with NO properties will return FALSE',function(){

            //Arrange
            let value = {};
            //Act
            let result = inputCommonInspector.objectIsValid(value);
            //Assert
            expect(result).toBe(false);

        });

        test('Object with NULL value will return FALSE',function(){

            //Arrange
            let value = null;
            //Act
            let result = inputCommonInspector.objectIsValid(value);
            //Assert
            expect(result).toBe(false);

        });

        test('Object with UNDEDFINED value will return FALSE',function(){

            //Arrange
            let value = undefined;
            //Act
            let result = inputCommonInspector.objectIsValid(value);
            //Assert
            expect(result).toBe(false);

        });

        test('Object NOT DEDFINED will return FALSE',function(){

            //Arrange
            let value;
            //Act
            let result = inputCommonInspector.objectIsValid(value);
            //Assert
            expect(result).toBe(false);

        });

        test('Object with Only INHERITED/PROTYPED PROPERTIES AND NOT OWN PROPERTIES will return FALSE',function(){

            //Arrange
            let value = new Object();
            value.__proto__.name = 'John';
            value.__proto__.age = 35;
            //Act
            let result = inputCommonInspector.objectIsValid(value);
            //Assert
            expect(result).toBe(false);

        });
    });


    describe('Function: inputExist', function(){
        test('When input is NULL it returns FALSE', function(){
            //Arrange
            let input = null;
            //Act
            let result = inputCommonInspector.inputExist(input);
            //Assert
            expect(result).toEqual(false);
        });

        test('When input is undefined it returns FALSE', function(){
            //Arrange
            let input = undefined;
            //Act
            let result = inputCommonInspector.inputExist(input);
            //Assert
            expect(result).toEqual(false);
        });

        test('When input is NOT defined it returns FALSE', function(){
            //Arrange
            let input;
            //Act
            let result = inputCommonInspector.inputExist(input);
            //Assert
            expect(result).toEqual(false);
        });

        test('When input has value it returns TRUE', function(){
            //Arrange
            let input = 5;
            //Act
            let result = inputCommonInspector.inputExist(input);
            //Assert
            expect(result).toEqual(true);
        });
    });
});