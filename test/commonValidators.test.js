const commonValidators = require ('../app/services/validation/commonValidators.js');


describe('File: commonValidators.js', function () {

    describe('Function: isValidJson', function(){
        test('Input of type json Object returns TRUE', function(){
            //Arrange
            let jsObj = {code:1, description:'value'};
            let jsObjString = JSON.stringify(jsObj);
            //Act
            let result = commonValidators.isValidJson(jsObjString);
            //Assert
            expect(result).toBe(true);
        });

        test('Input of type STRING Object returns FALSE', function(){
            //Arrange
            let input = 'the brave fox';
            //Act
            let result = commonValidators.isValidJson(input);
            //Assert
            expect(result).toBe(false);
        });

        test('Input of type NULL Object returns FALSE', function(){
            //Arrange
            let input = null;
            //Act
            let result = commonValidators.isValidJson(input);
            //Assert
            expect(result).toBe(false);
        });

    });


    describe('Function: safeJsonParse', function () {

        var obj = {
            code: 1,
            description: "week",
            daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            period: {
                month: {
                    time: 'morning'
                }
            }
        }


        test('Can parse a json Object',
            function () {
                var jsonObj = JSON.stringify(obj);
                var resultObj = commonValidators.safeJsonParse(jsonObj);
                var resultIsTypeObject = (typeof resultObj === 'object');
                var time = resultObj.period.month.time;
                expect(time).toBe('morning');
                expect(resultIsTypeObject).toBe(true);
            });


        test('Will return the original string input when is NOT a valid json object',
            function () {
                var originalString = "this is Just a String, not a json object";
                var result = commonValidators.safeJsonParse(originalString);
                expect(result).toBe(originalString);
                expect(result).toStrictEqual(originalString);
            });

        test('Will return the original object input when is NOT a valid json object',
            function () {
                //Arrange
                var invalidObj = +'[]' + obj;
                var jsonObj = JSON.stringify(invalidObj);
                //Act
                var resultObj = commonValidators.safeJsonParse(jsonObj);
                var resultIsTypeObject = (typeof resultObj === 'object');
                var time = resultObj.period;
                //Assert
                expect(time).toBe(undefined);
                expect(resultIsTypeObject).toBe(false);
                expect(resultObj).toStrictEqual(invalidObj);
            });
    });


});
