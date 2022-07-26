const inputTypeInspector = require('../app/serviceLayer/validation/inputTypeInspector.js');


describe('File: inputTypeInspector.js',()=>{
    //test('True is True', ()=>{ expect(true).toBe(true); });
    describe('Function: isTypeString', function(){
        test('Input string with value returns TRUE', function(){
            //Arrange
            let input = 'contains value';
            //Act
            let result = inputTypeInspector.isTypeString(input);
            //Assert
            expect(result).toBe(true);
        });

        test('Input Empty string returns TRUE', function(){
            //Arrange
            let input = '';
            //Act
            let result = inputTypeInspector.isTypeString(input);
            //Assert
            expect(result).toBe(true);
        })

        test('Input object returns FALSE', function(){
            //Arrange
            let input = {};
            //Act
            let result = inputTypeInspector.isTypeString(input);
            //Assert
            expect(result).toBe(false);
        })
    });

    describe('Function: isTypeBoolean',function(){
        test('Input type Boolean with value TRUE returns TRUE', function(){
            //Arrange
            let input = true;
            //Act
            let result = inputTypeInspector.isTypeBoolean(input);

            //Assert
            expect(result).toBe(true);
        });

        test('Input type Boolean with value FALSE returns TRUE', function(){
            //Arrange
            let input = false;
            //Act
            let result = inputTypeInspector.isTypeBoolean(input);

            //Assert
            expect(result).toBe(true);
        });

        test('Input type string returns FALSE', function(){
            //Arrange
            let input = 'this is a string';
            //Act
            let result = inputTypeInspector.isTypeBoolean(input);

            //Assert
            expect(result).toBe(false);
        });

        test('Input type object returns FALSE', function(){
            //Arrange
            let input = {};
            //Act
            let result = inputTypeInspector.isTypeBoolean(input);

            //Assert
            expect(result).toBe(false);
        });
    });

    describe('Function: isTypeNumber', function(){

        test('input value 34 returns TRUE', function(){
            //Arrange
            let input = 34;
            //Act
            let result = inputTypeInspector.isTypeNumber(input);
            //Assert
            expect(result).toBe(true);
        });

        test('input value -34.88 returns TRUE', function(){
            //Arrange
            let input = -34.88;
            //Act
            let result = inputTypeInspector.isTypeNumber(input);
            //Assert
            expect(result).toBe(true);
        });

        test('input value string -34.88 returns FALSE', function(){
            //Arrange
            let input = '-34.88';
            //Act
            let result = inputTypeInspector.isTypeNumber(input);
            //Assert
            expect(result).toBe(false);
        });

        test('input object returns FALSE', function(){
            //Arrange
            let input = {value:'-34.88'};
            //Act
            let result = inputTypeInspector.isTypeNumber(input);
            //Assert
            expect(result).toBe(false);
        });

    });

    describe('Function: isTypeInteger', function(){
        test('Input value 34 returns TRUE',function(){
            //Arrange
            let input = 34;
            //Act
            let result = inputTypeInspector.isTypeInteger(input);
            //Assert
            expect(result).toBe(true);

        });

        test('Input value 34.66 returns FALSE',function(){
            //Arrange
            let input = 34.66;
            //Act
            let result = inputTypeInspector.isTypeInteger(input);
            //Assert
            expect(result).toBe(false);

        });

        test('Input of type string value 34 returns FALSE',function(){
            //Arrange
            let input = '34';
            //Act
            let result = inputTypeInspector.isTypeInteger(input);
            //Assert
            expect(result).toBe(false);

        });

        test('Input of type object value 34 returns FALSE',function(){
            //Arrange
            let input = {value:'34'};
            //Act
            let result = inputTypeInspector.isTypeInteger(input);
            //Assert
            expect(result).toBe(false);

        });
    });

    describe('Function: isTypeDecimal', function(){
        test('Input with value 34.66 returns TRUE', function(){
            //Arrange
            let input = 34.66;
            //Act
            let result = inputTypeInspector.isTypeDecimal(input);
            //Assert
            expect(result).toBe(true);
        });

        test('Input with value 34 returns FALSE', function(){
            //Arrange
            let input = 34;
            //Act
            let result = inputTypeInspector.isTypeDecimal(input);
            //Assert
            expect(result).toBe(false);
        });

        test('Input string with value 34.66 returns FALSE', function(){
            //Arrange
            let input = '34.66';
            //Act
            let result = inputTypeInspector.isTypeDecimal(input);
            //Assert
            expect(result).toBe(false);
        });

        test('Input object with value 34.66 returns FALSE', function(){
            //Arrange
            let input = {value:34.66};
            //Act
            let result = inputTypeInspector.isTypeDecimal(input);
            //Assert
            expect(result).toBe(false);
        });
    });

    describe('Function: isTypeObject', function(){
        test('Input object returns TRUE', function(){
            //Arrange
            let input ={value:34.66};
            //Act
            let result = inputTypeInspector.isTypeObject(input);
            //Assert
            expect(result).toBe(true);
        })

        test('Input string returns FALSE', function(){
            //Arrange
            let input ='{value:34.66}';
            //Act
            let result = inputTypeInspector.isTypeObject(input);
            //Assert
            expect(result).toBe(false);
        });

        test('Input null returns FALSE', function(){
            //Arrange
            let input = null;
            //Act
            let result = inputTypeInspector.isTypeObject(input);
            //Assert
            expect(result).toBe(false);
        })
    });

    describe('Function: isTypeNull', function(){
        test('Input value NULL returns TRUE',function(){
            //Arrange
            let input = null;
            //Act
            let result = inputTypeInspector.isTypeNull(input);
            //Assert
            expect(result).toBe(true);
        });

        test('Input string value NULL returns FALSE',function(){
            //Arrange
            let input = 'null';
            //Act
            let result = inputTypeInspector.isTypeNull(input);
            //Assert
            expect(result).toBe(false);
        });

        test('Input object with property value NULL returns FALSE',function(){
            //Arrange
            let input = {value:'null'};
            //Act
            let result = inputTypeInspector.isTypeNull(input);
            //Assert
            expect(result).toBe(false);
        });

    });

    describe('Function: isTypeFunction', function(){
        test('Input value common function returns TRUE', function(){
            //Arrange
            let input = function(){};
            //Act
            let result = inputTypeInspector.isTypeFunction(input);

            //Assert
            expect(result).toBe(true);
        });

        test('Input value arrow function returns TRUE', function(){
            //Arrange
            let input = ()=>{};
            //Act
            let result = inputTypeInspector.isTypeFunction(input);

            //Assert
            expect(result).toBe(true);
        });

        test('Input object with value arrow function returns FALSE', function(){
            //Arrange
            let input ={value: ()=>{}};
            //Act
            let result = inputTypeInspector.isTypeFunction(input);

            //Assert
            expect(result).toBe(false);
        });
    });
    describe('Function: isTypeObjectDate', function(){
        test('Input object DATE returns TRUE', function(){
            //Arrange
            let input = new Date();
            //Act
            let result = inputTypeInspector.isDate(input);
            //Assert
            expect(result).toBe(true);
        })
        test('Input type string with a DATE written returns TRUE', function(){
            //Arrange
            //Date must be formatted in MONTH/DAY/YEAR
            let input = '07/26/2025';
            //Act
            let result = inputTypeInspector.isDate(input);
            //Assert
            expect(result).toBe(true);
        })
        test('A string that cannot be parsed to DATE returns FALSE', function(){
            //Arrange
            let input = 'This is a string';
            //Act
            let result = inputTypeInspector.isDate(input);
            //Assert
            expect(result).toBe(false);
        })
    })
});