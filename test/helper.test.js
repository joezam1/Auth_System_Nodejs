const helper = require('../app/library/common/helpers.js');

describe('File: Helper.js',function(){
    describe('Function: removeLeadingAndTrailingSpaces',function(){

        test('Input with Spaces will have them removed',function(){
            //Arrange
            let inputWithSpaces = '  input with spaces    ';
            let inputWithSpacesLength = inputWithSpaces.length;
            //Act
            let noSpacesInput = helper.removeLeadingAndTrailingSpaces(inputWithSpaces);
            let inputNoSpacesLength = noSpacesInput.length;
            //Assert

            let spacesRemovedCount = inputWithSpacesLength - inputNoSpacesLength;
            expect(spacesRemovedCount).toBeGreaterThan(0);

        });
    });


    describe('Function: getDateUTCFormatForDatabase', function(){
        test('Common LOCALE Date gets converted to UTC-Date', function(){
            //Arrange
            let localeDate = new Date();
            let localeDateUtc = localeDate.toISOString().replace('T', ' ').substring(0, 19);

            //Act
            let utcDate = helper.getDateUTCFormatForDatabase(localeDate);

            //Assert
            expect(utcDate).toEqual(localeDateUtc);
        });
    });

    describe('Function: createPropertiesArrayFromObjectProperties',function(){
        test('object can be transformed in Array of objects', function(){

            //Arrange
            let obj = {
                name:'Tom',
                phone:'04123456789'
            }
            let objArray = ['Tom','04123456789' ]
            //Act
            let result = helper.createPropertiesArrayFromObjectProperties(obj);
            //Assert
            expect(result).toEqual(objArray);
        });
    });

    describe('Function: formatStringFirstLetterCapital', function(){
        test('camel case string is formatted as First Letter is Capital', function(){
            //Arrange
            let camelCaseInput = 'inputInCamelCaseFormat';
            let expectedResult = 'Input In Camel Case Format'
            //Act
            let resultInput = helper.formatStringFirstLetterCapital(camelCaseInput);
            //Assert
            expect(resultInput).toEqual(expectedResult);
        });
        test('simple sentence all small letters will have their first letter capitalized', function(){
            //Arrange
            let camelCaseInput = 'input in small letters';
            let expectedResult = 'Input In Small Letters';
            //Act
            let resultInput = helper.formatStringFirstLetterCapital(camelCaseInput);
            //Assert
            expect(resultInput).toEqual(expectedResult);
        });
        test('mixed sentence with small letters and cammel case will be spaced and their first letter capitalized', function(){
            //Arrange
            let camelCaseInputAndSpacedSmallLetters = 'mixedWords in small letters andCamelCase letters';
            let expectedResult = 'Mixed Words In Small Letters And Camel Case Letters';
            //Act
            let resultInput = helper.formatStringFirstLetterCapital(camelCaseInputAndSpacedSmallLetters);
            //Assert
            expect(resultInput).toEqual(expectedResult);
        })
        test('Input of types different from STRING will not be processed and returned as they are originally', function(){

            //Arrange
            let input = {sentence:'this isATest'};
            let expectedResult = {sentence:'this isATest'};;
            //Act
            let resultInput = helper.formatStringFirstLetterCapital(input);
            //Assert
            expect(resultInput).toEqual(expectedResult);
        })
    })


});
