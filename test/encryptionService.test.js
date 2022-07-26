
const encryptionService = require('../app/serviceLayer/encryption/encryptionService.js');
const bcrypt = require('bcryptjs');



describe('File: encryptionService.js', function(){
    describe('Function: encryptStringInputAsync', function(){

        test('If input is Type STRING, then the string is encrypted',async function(){

            //Arrange
            let plainTextInput = 'this is a string'
            //Act
            let hashResult = await encryptionService.encryptStringInputAsync(plainTextInput);
            var result = await bcrypt.compare(plainTextInput,hashResult);
            //Assert
            let resultType = (typeof hashResult === 'string');
            expect(hashResult).not.toEqual(plainTextInput);
            expect(result).toBe(true);
            expect(resultType).toBe(true);
        });

        test('If input is not Type STRING, then the result is NOT encrypted',async function(){

            //Arrange
            let plainTextInput = {};
            //Act
            let hashResult = await encryptionService.encryptStringInputAsync(plainTextInput);
            //Assert
            let resultType = (typeof hashResult === 'object');
            expect(hashResult).toEqual(plainTextInput);
            expect(resultType).toBe(true);
        });
    });

    describe('Function validateEncryptedPasswordAsync', function(){
        test('When plain Text password is the same as encrypted Password Comparisson is SUCCESSFUL',async function(){

            //Arrange
            let plainTextInput = 'this is a string'
            //Act
            let hashResult = await encryptionService.encryptStringInputAsync(plainTextInput);
            var result = await encryptionService.validateEncryptedPasswordAsync (plainTextInput,hashResult);
            //Assert
            let resultType = (typeof hashResult === 'string');
            expect(hashResult).not.toEqual(plainTextInput);
            expect(result).toBe(true);
            expect(resultType).toBe(true);
        });

        test('When plain Text password is the same as encrypted Password Comparisson is SUCCESSFUL',async function(){

            //Arrange
            let plainTextInput = 'this is a string'
            let differentInput = 'this is a wrong input';
            //Act
            let hashResult = await encryptionService.encryptStringInputAsync(plainTextInput);
            var result = await encryptionService.validateEncryptedPasswordAsync (differentInput,hashResult);
            //Assert
            expect(hashResult).not.toEqual(plainTextInput);
            expect(result).toBe(false);
        });
    });
});
