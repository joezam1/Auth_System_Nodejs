const userRepository = require('../app/dataAccessLayer/repositories/userRepository.js');
const userDomainModel = require('../app/domainLayer/domainModels/user.js');
const userRoleDomainModel = require('../app/domainLayer/domainModels/userRole.js');
const roleRepository = require('../app/dataAccessLayer/repositories/roleRepository.js');


const repositoryManager = require('../app/dataAccessLayer/repositories/repositoryManager.js');

jest.mock('../app/dataAccessLayer/repositories/repositoryManager.js');



describe('File: userRepository.js', function () {
    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('Function: getUserByUsernameAndEmailDataAsync', function () {
        test('Database Function is called once and result is returned', async function () {
            //Arrange
            let _user = new userDomainModel();
            _user.setUsername('user01');
            _user.setEmail('a@b.com');
            let email = 'samuel.thomas@west.com'
            let today = new Date();
            let todayUTC = today.toISOString();
            let userResultMock = {
                UserId: 'adsfadlkqewrpoiuer23',
                FirstName: 'Samuel',
                MiddleName: null,
                LastName: 'Thomas',
                Username: 'samuel001',
                Email: email,
                Password: 'abcd',
                IsActive: true,
                UTCDateCreated: todayUTC,
                UTCDateUpdated: todayUTC
            }

            let resultDatabaseMock = [[userResultMock], []]
            repositoryManager.resolveStatementAsync = jest.fn().mockResolvedValueOnce(resultDatabaseMock);
            var userResult = await userRepository.getUserByUsernameAndEmailDataAsync(_user);
            let resultLength = userResult.length;
            let resultEmail = userResult[0].Email.value;
            //Assert
            expect(resultLength).toBe(1);
            expect(resultEmail).toEqual(email);
            expect(repositoryManager.resolveStatementAsync).toBeCalledTimes(1);
        });
    });

    describe('Function: getAllUserRolesByUserIdAsync', function () {

        test('CAN get All User Roles By UserId ', async function(){
            //arrange
            let _userDomainModel = new userDomainModel();
            _userDomainModel.setUserId('abcd');

            let mockResult = {
                UserRoleId: 'adsf',
                UserId: 'adsfadf',
                RoleId: 'poiu',
                UTCDateCreated: new Date(),
                UTCDateUpdated: new Date()
            }
            let resultDb = [mockResult]
            repositoryManager.resolveStatementAsync = jest.fn().mockResolvedValueOnce(resultDb);

            //Act
            let resultTest = await userRepository.getAllUserRolesByUserIdAsync(_userDomainModel);
            //Assert
            expect(repositoryManager.resolveStatementAsync).toHaveBeenCalledTimes(1);
        });
    });

    describe('Function convertAllUserRolesFromDatabaseToUserRoleEnumsAsync', function(){
        test('CAN convert All UserRoles From Database To UserRole Enums', async function(){

            //Arrange
            let roleDb = {
                RoleId:'23445',
                RoleIndex: 1,
                Name:'Admin',
                Description:'Cab manage website',
                IsActive: 1,
                UTCDateCreated: new Date(),
                UTCDateUpdated: new Date()
            }
            let dbResult = [roleDb]
            roleRepository.getAllRolesAsync = jest.fn().mockResolvedValueOnce(dbResult);
            //Act
            let userRole={
                UserRoleId: 'aab',
                UserId: 'xxiks',
                RoleId:'23445',
                UTCDateCreated: new Date(),
                UTCDateUpdated: new Date()
            }
            let allUserRolesDtoModelArray = [userRole]
            let resultTest = await userRepository.convertAllUserRolesFromDatabaseToUserRoleEnumsAsync(allUserRolesDtoModelArray);
            //Assert
            expect(roleRepository.getAllRolesAsync).toHaveBeenCalledTimes(1);
        });
    });

    describe('Function: insertUserIntoTableTransactionAsync', function () {
        test('Database function is called once and user is inserted OK', async function () {
            //Arrange
            let connectionMock = 'abcdEfgMock';
            let _user = new userDomainModel();
            _user.setUsername('user01');
            _user.setEmail('a@b.com');

            let insertResult = {
                rowInserted: 1,
                saved: true
            }
            let resultDatabaseMock = [insertResult]
             repositoryManager.resolveSingleConnectionStatementAsync  = jest.fn().mockResolvedValueOnce(resultDatabaseMock);

            var userResult = await userRepository.insertUserIntoTableTransactionAsync(connectionMock, _user);
            let resultLength = userResult.length;
            let arrayResult = userResult[0];
            //Assert
            expect(resultLength).toBe(1);
            expect(arrayResult.rowInserted).toBe(1);
            expect(repositoryManager.resolveSingleConnectionStatementAsync).toBeCalledTimes(1);
        });
    });

    describe('Function: insertUserRoleIntoTableTransactionAsync', function () {
        test('Database function is called once and userRole is inserted OK', async function () {

            //Arrange
            let connection = 'abaeindfadfmock';
            let userRole = new userRoleDomainModel();
            userRole.setUserRoleId('a5b7cdf8sd3fad3adf3qerqe');
            userRole.setUserId('pi3odfadfjkrq3634mvydsad');
            userRole.setRoleId('4tpff6o58iada7rr3mfeuad');
            let insertResult = {
                rowInserted: 1,
                saved: true
            }
            let resultDatabaseMock = [insertResult]
            repositoryManager.resolveSingleConnectionStatementAsync = jest.fn().mockResolvedValueOnce(resultDatabaseMock);
            //Act
            let userRoleResult = await userRepository.insertUserRoleIntoTableTransactionAsync(connection, userRole);
            //Assert
            let resultLength = userRoleResult.length;
            let arrayResult = userRoleResult[0];
            expect(resultLength).toBe(1);
            expect(arrayResult.rowInserted).toBe(1);
            expect( repositoryManager.resolveSingleConnectionStatementAsync ).toBeCalledTimes(1);

        });
    });
})