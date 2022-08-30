const userRegistrationDomainManager = require('../app/domainLayer/domainManagers/userRegistrationDomainManager.js');
const validationService = require('../app/services/validation/validationService.js');
const userRepository = require('../app/dataAccessLayer/repositories/userRepository.js');
const roleRepository = require('../app/dataAccessLayer/repositories/roleRepository.js');
const registerRepository = require('../app/dataAccessLayer/repositories/registerRepository.js');
const dbAction = require('../app/dataAccessLayer/mysqlDataStore/context/dbAction.js');
const userRegisterViewModel = require('../app/presentationLayer/viewModels/userRegisterViewModel');
const userDomainModel = require('../app/domainLayer/domainModels/user.js')

jest.mock('../app/services/validation/validationService.js');
jest.mock('../app/dataAccessLayer/repositories/userRepository.js');
jest.mock('../app/dataAccessLayer/repositories/roleRepository.js');
jest.mock('../app/dataAccessLayer/repositories/registerRepository.js');
jest.mock('../app/dataAccessLayer/mysqlDataStore/context/dbAction.js');


describe('File: userRegistrationDomainManager', function(){
    afterAll(()=>{
        jest.resetAllMocks();
    });


    describe('Function: processUserRegistrationValidationAsync', function(){

        test('CAN process UserRegistration Validation', async function(){
            //Arrange
            let mockResult = {};
            validationService.resolveUserModelValidation = jest.fn().mockReturnValueOnce(mockResult);
            let result = [];
            userRepository.getUserByUsernameAndEmailDataAsync = jest.fn().mockReturnValueOnce(result);
            let userViewModel = new userRegisterViewModel();
            userViewModel.firstName.fieldValue = 'Tom'
            //Act
            let resultProcess =await userRegistrationDomainManager.processUserRegistrationValidationAsync(userViewModel);

            //Assert
            expect(validationService.resolveUserModelValidation).toHaveBeenCalledTimes(1);
            expect(userRepository.getUserByUsernameAndEmailDataAsync ).toHaveBeenCalledTimes(1);
        });
    });

    describe('Function: processUserRegistrationStorageToDatabaseAsync', function(){
        test('CAN processUserRegistrationStorageToDatabaseAsync OK', async function(){

            //Arrange
            let admin = {
                RoleId:{value: 'asdf'},
                RoleIndex: {value:1},
                Name: {value:'Admin'},
                Description: {value:'test' },
                isActive:  {value:1},
                UTCDateCreated:{value: new Date()},
                UTCDateUpdated: {value: new Date()}
            };
            let mockResult = [admin];
            roleRepository.getAllRolesAsync = jest.fn().mockResolvedValueOnce(mockResult);
            registerRepository.insertRegisterIntoTableTransactionAsync = jest.fn();
            userRepository.insertUserIntoTableTransactionAsync = jest.fn();
            userRepository.insertUserRoleIntoTableTransactionAsync = jest.fn();
            dbAction.getSingleConnectionFromPoolPromiseAsync = jest.fn();
            dbAction.beginTransactionSingleConnectionAsync = jest.fn();
            dbAction.commitTransactionSingleConnection = jest.fn();

            let userRoleEnum = 1;
            let _userDomainModel = new userDomainModel();
            //Act
            let result = userRegistrationDomainManager.processUserRegistrationStorageToDatabaseAsync(userRoleEnum, _userDomainModel);



            //Assert
            expect(roleRepository.getAllRolesAsync ).toHaveBeenCalledTimes(1);
            expect(registerRepository.insertRegisterIntoTableTransactionAsync ).toHaveBeenCalledTimes(0);
            expect(userRepository.insertUserIntoTableTransactionAsync ).toHaveBeenCalledTimes(0);
            expect(userRepository.insertUserRoleIntoTableTransactionAsync ).toHaveBeenCalledTimes(0);
            expect(dbAction.getSingleConnectionFromPoolPromiseAsync ).toHaveBeenCalledTimes(0);
            expect(dbAction.beginTransactionSingleConnectionAsync ).toHaveBeenCalledTimes(0);
            expect(dbAction.commitTransactionSingleConnection ).toHaveBeenCalledTimes(0);
        })
    });
});
