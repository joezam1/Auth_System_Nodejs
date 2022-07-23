const CommonValidators = require ('../app/serviceLayer/validation/commonValidators.js');


describe('File: CommonValidators.js', function () {

    //NOTE: Test that JEST is working correctly
    //test('True is True', function () { expect(true).toBe(true); });


    describe('Function: isValidObj',function(){
        let jsObj = {
            unit:1,
            address:'street 2'
        }
        test('Input type Object returns TRUE', function(){
            //Arrange
            let isObject = (typeof jsObj === 'object');
            //Act
            let result = CommonValidators.isValidObj(jsObj);
            //Assert
            expect(result).toBe(true);
            expect(isObject).toBe(true);
        });

        test('Input NULL object returns FALSE', function(){
            //Arrange
            jsObj = null;
            //Act
            let result = CommonValidators.isValidObj(jsObj);
            //Assert
            expect(result).toBe(false);
        });

        test('Input Type STRING returns FALSE', function(){
            //Arrange
            jsObj = 'this is a string';
            //Act
            let result = CommonValidators.isValidObj(jsObj);
            //Assert
            expect(result).toBe(false);
        });

        test('Input Array Object returns FALSE', function(){
            //Arrange
            jsObj = ['item1', 1, {code:1}];
            //Act
            let result = CommonValidators.isValidObj(jsObj);
            //Assert
            expect(result).toBe(false);
        });


        test('Input string with the word NULL returns FALSE', function(){
            //Arrange
            jsObj = 'NULL';
            //Act
            let result = CommonValidators.isValidObj(jsObj);
            //Assert
            expect(result).toBe(false);
        });

        test('Input undefined returns FALSE', function(){
            //Arrange
            jsObj = undefined;
            //Act
            let result = CommonValidators.isValidObj(jsObj);
            //Assert
            expect(result).toBe(false);
        });

    });

    describe('Function: isValidString',function(){

        test('Input type STRING returns TRUE',function(){
            //Arrange
            let input = 'the brave fox jumped over the dog';
            //Act
            let result = CommonValidators.isValidString(input);
            //Assert
            expect(result).toBe(true);
        });

        test('Input type object returns FALSE', function(){
            //Arrange
            let input = {code:1};
            //Act
            let result = CommonValidators.isValidString(input);
            //Assert
            expect(result).toBe(false);
        });

        test('Input NULL returns FALSE', function(){
            //Arrange
            let input = null;
            //Act
            let result = CommonValidators.isValidString(input);
            //Assert
            expect(result).toBe(false);
        });

        test('Input undefined returns FALSE', function(){
            //Arrange
            let input = undefined;
            //Act
            let result = CommonValidators.isValidString(input);
            //Assert
            expect(result).toBe(false);
        });
    });

    describe('Function: isValidJson', function(){
        test('Input of type json Object returns TRUE', function(){
            //Arrange
            let jsObj = {code:1, description:'value'};
            let jsObjString = JSON.stringify(jsObj);
            //Act
            let result = CommonValidators.isValidJson(jsObjString);
            //Assert
            expect(result).toBe(true);
        });

        test('Input of type STRING Object returns FALSE', function(){
            //Arrange
            let input = 'the brave fox';
            //Act
            let result = CommonValidators.isValidJson(input);
            //Assert
            expect(result).toBe(false);
        });

        test('Input of type NULL Object returns FALSE', function(){
            //Arrange
            let input = null;
            //Act
            let result = CommonValidators.isValidJson(input);
            //Assert
            expect(result).toBe(false);
        });

    });
});
