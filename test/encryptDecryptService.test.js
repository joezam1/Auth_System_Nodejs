const encryptDecryptService = require('../app/services/encryption/encryptDecryptService.js');



describe('File: encryptDecryptService.js', function(){
    describe('Function: encryptWithAES', function(){

        test('CAN encrypt any text correctly', function(){
            //Arrange
            let input = 'this is a text';
            //Act
            let encrypted = encryptDecryptService.encryptWithAES(input);

            let encryptedTypeIsString = (typeof(encrypted) === 'string');
            //Assert
            expect(encrypted).not.toEqual(input);
            expect(encryptedTypeIsString).toEqual(true);
        } );

        test('ANY INPUT which is NOT TYPE STRING is not encrypted and function returns original value', function(){
            //Arrange
            let input = {value:'this is a text'};
            //Act
            let encrypted = encryptDecryptService.encryptWithAES(input);

            let encryptedTypeIsObject = (typeof(encrypted) === 'object');
            //Assert
            expect(encrypted).toEqual(input);
            expect(encryptedTypeIsObject).toEqual(true);
        } );
    });

    describe('Function: decryptWithAES', function(){
        test('CAN Decrypt any previously encrypted text', function(){
             //Arrange
             let input = 'this is a text';
             //Act
             let encrypted = encryptDecryptService.encryptWithAES(input);

             let decrypted = encryptDecryptService.decryptWithAES(encrypted);
            //Assert
            expect(decrypted).toEqual(input);
        });

        test('ANY STRING input that is not previous encrypted value is not decrypted', function(){
            //Arrange
            let input = 'this is a text';
            //Act
            //let encrypted = encryptDecryptService.encryptWithAES(input);

            let decrypted = encryptDecryptService.decryptWithAES(input);
            let emptyString = '';
           //Assert
           expect(decrypted).toEqual(emptyString);
       });

       test('ANY INPUT which is NOT TYPE STRING is not decrypted and the function returns original value', function(){
        //Arrange
        let input = {value:'this is a text'};
        //Act
        let decrypted = encryptDecryptService.decryptWithAES(input);
        let decryptedTypeIsObject = (typeof(decrypted) === 'object');
        //Assert
        expect(decrypted).toEqual(input);
        expect(decryptedTypeIsObject).toEqual(true);
    } );
    });
});