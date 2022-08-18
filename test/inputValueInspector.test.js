const inputValueInspector = require('../app/services/validation/inputValueInspector.js');

describe('File: InputValueInspector',()=>{

    describe('Function: nameIsValid', function(){

        test('Single Name letters only returns TRUE', function(){
            //Arrange
            let name='John';

            //Act
            let result = inputValueInspector.nameIsValid(name);
            //Assert
            expect(result).toBe(true);
        });

        test('Two Names return TRUE', function(){
            //Arrange
            let name='John Thomas';

            //Act
            let result = inputValueInspector.nameIsValid(name);
            //Assert
            expect(result).toBe(true);
        });

        test('Name letters only and space returns TRUE', function(){
            //Arrange
            let name='    John     ';

            //Act
            let result = inputValueInspector.nameIsValid(name);
            //Assert
            expect(result).toBe(true);
        });

        test('Name letters and numbers returns FALSE', function(){
            //Arrange
            let name='    John 123    ';

            //Act
            let result = inputValueInspector.nameIsValid(name);
            //Assert
            expect(result).toBe(false);
        });





    });

    describe('Function: usernameIsValid', function(){
        test('letters and numbers no space returns TRUE', function(){
            //Arrange
            let username = 'abcd1234'
            //Act
            let result = inputValueInspector.usernameIsValid(username);
            //Assert
            expect(result).toBe(true);
        });

        test('letters, spaces and numbers return FALSE', function(){
            //Arrange
            let username = 'abcd 1234'
            //Act
            let result = inputValueInspector.usernameIsValid(username);
            //Assert
            expect(result).toBe(false);
        });

        test('letters, numbers and characters return FALSE', function(){
            //Arrange
            let username = 'abcd#$%^1234'
            //Act
            let result = inputValueInspector.usernameIsValid(username);
            //Assert
            expect(result).toBe(false);
        });

        test('letters, spaces, numbers and characters return FALSE', function(){
            //Arrange
            let username = 'abcd 1234 %^&*'
            //Act
            let result = inputValueInspector.usernameIsValid(username);
            //Assert
            expect(result).toBe(false);
        });
    });

    describe('Function: emailIsValid', function(){
        test('email simple characters returns TRUE', function(){
            //Arrange
            let email = 'a@babel.com'
            //Act
            let result = inputValueInspector.emailIsValid(email);
            //Assert
            expect(result).toBe(true);
        });

        test('email Incomplete characters returns FALSE', function(){
            //Arrange
            let email = 'a_babel.com'
            //Act
            let result = inputValueInspector.emailIsValid(email);
            //Assert
            expect(result).toBe(false);
        });
        test('email missing com returns FALSE', function(){
            //Arrange
            let email = 'a@babel.'
            //Act
            let result = inputValueInspector.emailIsValid(email);
            //Assert
            expect(result).toBe(false);
        });

        test('email missing dot returns FALSE', function(){
            //Arrange
            let email = 'a@babelcom'
            //Act
            let result = inputValueInspector.emailIsValid(email);
            //Assert
            expect(result).toBe(false);
        });
    });

    describe('Function: passwordMinCharactersIsValid', function(){
        test('Password Character length is greater tnan minimum, returns TRUE', function(){
            //Arrange
            let minimumChars = 3
            let password = 'abcde'
            //Act
            let result = inputValueInspector.passwordMinCharactersIsValid(password,minimumChars);
            //Assert
            expect(result).toBe(true);
        });

        test('Password Character length is smaller tnan minimum, returns FALSE', function(){
            //Arrange
            let minimumChars = 6;
            let password = 'abc';
            //Act
            let result = inputValueInspector.passwordMinCharactersIsValid(password,minimumChars);
            //Assert
            expect(result).toBe(false);
        });
    });

    describe('Function: passwordAndConfirmPasswordAreEqual', function(){
        test('Password and ConfirmPassword are the same. Return TRUE', function(){
            //Arrange
            let password = 'abc'
            let confirmPassword = 'abc'
            //Act
            let result = inputValueInspector.passwordAndConfirmPasswordAreEqual(password,confirmPassword);
            //Assert
            expect(result).toBe(true);
        })
        test('Password and ConfirmPassword are not the same. Return FALSE', function(){
            //Arrange
            let password = 'abc'
            let confirmPassword = 'def'
            //Act
            let result = inputValueInspector.passwordAndConfirmPasswordAreEqual(password,confirmPassword);
            //Assert
            expect(result).toBe(false);
        })
        test('Password and ConfirmPassword with Different Case. Return FALSE', function(){
            //Arrange
            let password = 'abc'
            let confirmPassword = 'ABC'
            //Act
            let result = inputValueInspector.passwordAndConfirmPasswordAreEqual(password,confirmPassword);
            //Assert
            expect(result).toBe(false);
        })
    });

});