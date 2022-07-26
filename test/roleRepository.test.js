const roleRepository = require('../app/dataAccessLayer/repositories/roleRepository.js');
const dbAction = require('../app/dataAccessLayer/mysqlDataStore/context/dbAction.js');
jest.mock('../app/dataAccessLayer/mysqlDataStore/context/dbAction.js');



describe('File: roleRepository.js', function(){

    afterAll(()=>{
        jest.resetAllMocks();
    });
    describe('Function: getAllRolesAsync', function(){
        test('Database Function Called once and Rows retrieved',async function(){

            //Arrange
            let dateNow = new Date();
            let dateNowUtc = dateNow.toISOString();
            let role1 = {
                RoleId:'adfadfadf123456',
                RoleIndex : 1,
                Name: 'Admin',
                Description: 'The user that manages the website',
                IsActive: 1,
                UTCDateCreated: dateNowUtc,
                UTCDateUpdated: dateNowUtc
            }
            let role2 = {
                RoleId:'adfadfadf546987165',
                RoleIndex : 2,
                Name: 'Customer',
                Description: 'The user that is registered and is willing to purchase goods and services',
                IsActive: 1,
                UTCDateCreated: dateNowUtc,
                UTCDateUpdated: dateNowUtc
            }
            let role3 = {
                RoleId:'adfadfadf123456',
                RoleIndex : 3,
                Name: 'AnonymousUser',
                Description: 'The user that anonymously browses the website',
                IsActive: 1,
                UTCDateCreated: dateNowUtc,
                UTCDateUpdated: dateNowUtc
            }
            let resultMockDatabase = [[role1, role2, role3], []]
            dbAction.executeStatementAsync = jest.fn().mockResolvedValueOnce(resultMockDatabase);
            //Act
            let resultRoles = await roleRepository.getAllRolesAsync();
            let rolesCount = resultRoles.length;
            //Assert
            expect(rolesCount).toEqual(3);
            expect(dbAction.executeStatementAsync).toBeCalledTimes(1);
        });
    });
});