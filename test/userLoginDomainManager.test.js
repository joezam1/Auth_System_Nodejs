
const userLoginDomainManager = require('../app/domainLayer/domainManagers/userLoginDomainManager.js');
const validationService = require('../app/services/validation/validationService.js');
const encryptionService = require('../app/services/encryption/encryptionService.js');
const userRepository = require('../app/dataAccessLayer/repositories/userRepository.js');
const sessionDomainManager = require('../app/domainLayer/domainManagers/sessionDomainManager.js');
const userViewModel = require('../app/presentationLayer/viewModels/userLoginViewModel');
const sessionActivityViewModel = require('../app/presentationLayer/viewModels/sessionActivityViewModel.js');

jest.mock('../app/services/validation/validationService.js');
jest.mock('../app/services/encryption/encryptionService.js');
jest.mock('../app/dataAccessLayer/repositories/userRepository.js');
jest.mock('../app/domainLayer/domainManagers/sessionDomainManager.js');



describe('File: userLoginDomainManager.js', function(){

    describe('Function: processUserLoginValidationAsync', function(){
        test('CAN process User Login Validation', async function(){
            //Arrange

            let validationReturnValue = {};
            validationService.resolveUserModelValidation = jest.fn().mockReturnValueOnce(validationReturnValue);

            let _userViewModel = new userViewModel();
            _userViewModel.username.fieldValue = 'john1';
            _userViewModel.password.fieldValue = 'abcd';
            let userDbModel = {
                UserId:'1234',
                Username:'john1',
                Password:'abcd'
            }
            let resultDb = [userDbModel]
            userRepository.getUserByUsernameAndEmailDataAsync = jest.fn().mockReturnValueOnce(resultDb);

            let mockValidationResult = true;
            encryptionService.validateEncryptedStringInputAsync = jest.fn().mockReturnValueOnce(mockValidationResult);
            //Act
            let resultTest = await userLoginDomainManager.processUserLoginValidationAsync(_userViewModel);

            //Assert
            expect(resultTest.statusText).toEqual('ok');
            expect(validationService.resolveUserModelValidation).toHaveBeenCalledTimes(1);
            expect(userRepository.getUserByUsernameAndEmailDataAsync ).toHaveBeenCalledTimes(1);
            expect(encryptionService.validateEncryptedStringInputAsync).toHaveBeenCalledTimes(1);
        });
    });

    describe('Function: processUserLoginStorageToDatabaseAsync', function(){
        test('CAN process User Login Storage To Database', async function(){

            //Arrange
            let _userDtoModel = {
                UserId:{value:'xxxxxx'},
                FirstName:{value:'John'},
                LastName:{value:'Tyler'},
                Username:{value:'abcd'},
                Email:{value:'ab@cd.com'},
                IsActive:{value:true}
            }
            let _sessionActivityviewModel = new sessionActivityViewModel();
            _sessionActivityviewModel.userId.fieldValue = 'a;kldeiw'

            let mockReturnValue = {
                affectedRows : 1
            }
            let mockResultDb = [mockReturnValue]
            sessionDomainManager.insertSessionSessionActivityAndTokenTransactionAsync = jest.fn().mockReturnValueOnce(mockResultDb);
            //Act
            let resultTest = await userLoginDomainManager.processUserLoginStorageToDatabaseAsync(_userDtoModel, _sessionActivityviewModel);

            //Assert
            expect(resultTest.statusText).toEqual('ok');
            expect(sessionDomainManager.insertSessionSessionActivityAndTokenTransactionAsync).toHaveBeenCalledTimes(1);


        });
    } );
});
