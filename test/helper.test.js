const helper = require('../app/library/common/helpers.js');
const jsDataType = require('../app/library/stringLiterals/jsDataType.js');

describe('File: Helper.js', function () {
    describe('Function: removeLeadingAndTrailingSpaces', function () {
        test('Input with Spaces will have them removed', function () {
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


    describe('Function: convertLocaleDateToUTCFormatForDatabase', function () {
        test('Common LOCALE Date gets converted to UTC-Date Database Format', function () {
            //Arrange
            let localeDate = new Date();
            let localeDateUtc = localeDate.toISOString().replace('T', ' ').substring(0, 19);

            //Act
            let utcDate = helper.convertLocaleDateToUTCFormatForDatabase(localeDate);

            //Assert
            expect(utcDate).toEqual(localeDateUtc);
        });
    });

    describe('Function: composeUTCDateToUTCFormatForDatabase', function () {
        test('When a UTC DATE is provided, the function converts it to UTC Database format OK', function () {
            //Arrange
            let dateNowLocale = new Date('2022-08-17 18:05:36');
            let dateNowToIsoString = dateNowLocale.toISOString();
            let dateNowISOString_No_T = dateNowToIsoString.replace('T', ' ');
            let dateNowUTC = helper.convertLocaleDateToUTCDate(dateNowLocale);
            //Act
            let result = helper.composeUTCDateToUTCFormatForDatabase(dateNowUTC);
            resultMatchesISOStandard = (dateNowISOString_No_T.includes(result));
            //Assert
            expect(resultMatchesISOStandard).toBe(true);
        });
    });

    describe('Function: convertLocaleDateToUTCDate', function () {
        test('When Locale Date is provided, it is converted to UTC Date', function () {
            //Arrange
            let dateNowLocale = new Date();

            let utcYear = dateNowLocale.getUTCFullYear();
            let utcMonth = dateNowLocale.getUTCMonth();
            let utcDay = dateNowLocale.getUTCDay();
            let utcDate = dateNowLocale.getUTCDate();
            let utcHours = dateNowLocale.getUTCHours();
            let utcMinutes = dateNowLocale.getUTCMinutes();
            let utcSeconds = dateNowLocale.getUTCSeconds();

            //Act
            let dateNowUTC = helper.convertLocaleDateToUTCDate(dateNowLocale);

            let dateNowUTCYear = dateNowUTC.getFullYear();
            let dateNowUTCMonth = dateNowUTC.getMonth();
            let dateNowUTCDay = dateNowUTC.getDay();
            let dateNowUTCDate = dateNowUTC.getDate();
            let dateNowUTCHours = dateNowUTC.getHours();
            let dateNowUTCMinutes = dateNowUTC.getMinutes();
            let dateNowUTCSeconds = dateNowUTC.getSeconds();

            //Assert
            expect(utcYear).toEqual(dateNowUTCYear);
            expect(utcMonth).toEqual(dateNowUTCMonth);
            expect(utcDay).toEqual(dateNowUTCDay);
            expect(utcDate).toEqual(dateNowUTCDate);
            expect(utcHours).toEqual(dateNowUTCHours);
            expect(utcMinutes).toEqual(dateNowUTCMinutes);
            expect(utcSeconds).toEqual(dateNowUTCSeconds);

        });
    });

    describe('Function: createPropertiesArrayFromObjectProperties', function () {
        test('object can be transformed in Array of objects', function () {

            //Arrange
            let obj = {
                name: 'Tom',
                phone: '04123456789'
            }
            let objArray = ['Tom', '04123456789']
            //Act
            let result = helper.createPropertiesArrayFromObjectProperties(obj);
            //Assert
            expect(result).toEqual(objArray);
        });
    });

    describe('Function: formatStringFirstLetterCapital', function () {
        test('camel case string is formatted as First Letter is Capital', function () {
            //Arrange
            let camelCaseInput = 'inputInCamelCaseFormat';
            let expectedResult = 'Input In Camel Case Format'
            //Act
            let resultInput = helper.formatStringFirstLetterCapital(camelCaseInput);
            //Assert
            expect(resultInput).toEqual(expectedResult);
        });
        test('simple sentence all small letters will have their first letter capitalized', function () {
            //Arrange
            let camelCaseInput = 'input in small letters';
            let expectedResult = 'Input In Small Letters';
            //Act
            let resultInput = helper.formatStringFirstLetterCapital(camelCaseInput);
            //Assert
            expect(resultInput).toEqual(expectedResult);
        });
        test('mixed sentence with small letters and cammel case will be spaced and their first letter capitalized', function () {
            //Arrange
            let camelCaseInputAndSpacedSmallLetters = 'mixedWords in small letters andCamelCase letters';
            let expectedResult = 'Mixed Words In Small Letters And Camel Case Letters';
            //Act
            let resultInput = helper.formatStringFirstLetterCapital(camelCaseInputAndSpacedSmallLetters);
            //Assert
            expect(resultInput).toEqual(expectedResult);
        })
        test('Input of types different from STRING will not be processed and returned as they are originally', function () {

            //Arrange
            let input = { sentence: 'this isATest' };
            let expectedResult = { sentence: 'this isATest' };;
            //Act
            let resultInput = helper.formatStringFirstLetterCapital(input);
            //Assert
            expect(resultInput).toEqual(expectedResult);
        })
    })

    describe('Function: convertToStringOrStringifyForDataStorage', function () {
        test('NULL value is converted to EMPTY STRING', function () {
            //Arrange
            let input = null;
            //Act
            let result = helper.convertToStringOrStringifyForDataStorage(input);
            //Assert
            let resultType = typeof (result);
            expect(resultType).toEqual(jsDataType.STRING);
            expect(result).toEqual('');

        });
        test('ARRAY object is Converted to STRING', function () {
            //Arrange
            let input = [null, 'string', {}];
            let inputType = typeof (input);
            let inputStr = input.toString();
            //Act
            let result = helper.convertToStringOrStringifyForDataStorage(input);
            //Assert
            let resultType = typeof (result);
            expect(resultType).toEqual(jsDataType.STRING);
            expect(result).toEqual(inputStr);
        });
        test('UNDEFINED value is Converted to EMPTY STRING', function () {
            //Arrange
            let input;
            let inputType = typeof (input);
            //Act
            let result = helper.convertToStringOrStringifyForDataStorage(input);
            //Assert
            let resultType = typeof (result);
            expect(resultType).toEqual(jsDataType.STRING);
            expect(result).toEqual('');
        });
        test('FUNCTION type is converted to STRING', function () {
            //Arrange
            let input = function(){ console.log('this is a function');};
            let inputType = typeof (input);
            let inputStr = input.toString();
            //Act
            let result = helper.convertToStringOrStringifyForDataStorage(input);
            //Assert
            let resultType = typeof (result);
            expect(resultType).toEqual(jsDataType.STRING);
            expect(result).toEqual(inputStr);
        });

        test('OBJECT type is STRINGIFIED', function () {
            //Arrange
            let input ={
                func : function(){ console.log('this is a function');},
                obj: {name:'John', surname:'Taylor'},
                stringType: 'this is a string'
            };
            let inputType = typeof (input);
            let inputStr = input.toString();
            //Act
            let result = helper.convertToStringOrStringifyForDataStorage(input);
            //Assert
            let resultType = typeof (result);
            expect(resultType).toEqual(jsDataType.STRING);
        });
    });

});
