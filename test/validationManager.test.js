const validationManager = require('../app/serviceLayer/validation/validationManager.js');
const userModel = require('../app/presentationLayer/viewModels/userViewModel.js');
const inputCommonInspector = require('../app/serviceLayer/validation/inputCommonInspector.js');

xdescribe('File: validationManager.js',()=>{

    //test('True is True', ()=>{ expect(true).toBe(true); });
    describe('Function: resolveUserRegisterValidation',function(){
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
            let user = new userModel(userObject);

            //Act
            let report = validationManager.resolveUserRegisterValidation(user);
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
            let user = new userModel(userObject);

            //Act
            let report = validationManager.resolveUserRegisterValidation(user);
            let objectIsEmpty = inputCommonInspector.objectIsNullOrEmpty(report);
            //Assert
            expect(report.firstName).not.toEqual('');
            expect(report.confirmPassword).not.toEqual('');
            expect(objectIsEmpty).toBe(false);
        });
    });

});