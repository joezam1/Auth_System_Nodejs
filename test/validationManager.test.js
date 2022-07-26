const validationService = require('../app/serviceLayer/validation/validationService.js');
const userRegisterViewModel = require('../app/presentationLayer/viewModels/userRegisterViewModel.js');
const inputCommonInspector = require('../app/serviceLayer/validation/inputCommonInspector.js');

describe('File: validationService.js',()=>{

    //test('True is True', ()=>{ expect(true).toBe(true); });
    describe('Function: resolveUserModelValidation',function(){
        test('Model is complete, The Errors reports is Empty', function(){
            //Arrange
            let userObject = {
                firstName:'John',
                middleName:'Frederic',
                lastName:'Solyman',
                username:'john101',
                email:'john@test.com',
                password:'abcde12345!@#$%',
                confirmPassword:'abcde12345!@#$%'

            }
            let user = new userRegisterViewModel(userObject);

            //Act
            let report = validationService.resolveUserModelValidation(user);
            let objectIsEmpty = inputCommonInspector.objectIsNullOrEmpty(report);
            //Assert
            expect(objectIsEmpty).toBe(true);
        });

        test('Model is incomplete, The Errors reports the Errors', function(){
            //Arrange
            let userObject = {
                firstName:'John11',
                middleName:'',
                lastName:'Solyman',
                username:'john101',
                email:'john@test.com',
                password:'abcde12345!@#$%',
                confirmPassword:'abcde12345'

            }
            let user = new userRegisterViewModel(userObject);

            //Act
            let report = validationService.resolveUserModelValidation(user);
            let objectIsEmpty = inputCommonInspector.objectIsNullOrEmpty(report);
            //Assert
            expect(report.firstName).not.toEqual('');
            expect(report.confirmPassword).not.toEqual('');
            expect(objectIsEmpty).toBe(false);
        });
    });

});