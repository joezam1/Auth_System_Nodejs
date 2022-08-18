const CommonValidators = require ('../app/services/validation/commonValidators.js');


describe('File: CommonValidators.js', function () {

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
