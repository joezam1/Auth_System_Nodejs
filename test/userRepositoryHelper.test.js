const userRepositoryHelper = require('../app/dataAccessLayer/repositories/userRepositoryHelper.js');
const user = require('../app/domainLayer/domainModels/user.js');
const userRole = require('../app/domainLayer/domainModels/userRole.js');



describe('File: userRepositoryHelper.js', function(){
    describe('Function: getUserDtoModelMappedFromDomain', function(){
        test('Can create object UserDtoModel Mapped From Domain', function(){

            //Arrange
            let userData = {
                userId:{fieldValue:'123'},
                firstName:{fieldValue:'John'},
                lastName:{fieldValue:'Taylor'},
                username:{fieldValue:'john1'},
                email:{fieldValue:'john1@west.com'},
                password:{fieldValue:'abcdefg'}
            }
            let userDomainModel = new user();
            userDomainModel.setUserId(userData.userId.fieldValue);
            userDomainModel.setFirstName(userData.firstName.fieldValue);
            userDomainModel.setLastName(userData.lastName.fieldValue);
            userDomainModel.setUsername(userData.username.fieldValue);
            userDomainModel.setEmail(userData.email.fieldValue);
            userDomainModel.setPassword(userData.password.fieldValue);

            let currentUserId = userDomainModel.getUserId();
            //Act
            let result = userRepositoryHelper.getUserDtoModelMappedFromDomain(userDomainModel);
            //Assert
            expect(result.UserId.value).toEqual(currentUserId);
        });
    });

    describe('Function: getUsersDtoModelMappedFromDatabase', function(){
        test('Can create UserDtoModel Mapped From Database', function(){
            //Arrange
            let userModelDb = {
                UserId:'123',
                FirstName:'John',
                LastName:'Taylor',
                Username:'john1',
                Email:'john1@west.com',
                Password:'abcdefg'
            }
            let databaseResults = [userModelDb];
            //Act
            let resultArray = userRepositoryHelper.getUsersDtoModelMappedFromDatabase(databaseResults);
            let userDtoModelUserId = resultArray[0].UserId.value;
            //Assert
            expect(userDtoModelUserId).toEqual(userModelDb.UserId);
        });
    });

    describe('Function: getUserRoleDtoModelMappedFromDomain', function(){
        test('Can create tUserRoleDtoModel Mapped From Domain', function(){
            //Arrange
            let userRoleData = {
                userRoleId:'123456',
                userId:'abcd',
                roleId:'edgfgh'
            }
            let userRoleDomainModel = new userRole();
            userRoleDomainModel.setUserRoleId( userRoleData.userRoleId);
            userRoleDomainModel.setUserId( userRoleData.userId);
            userRoleDomainModel.setRoleId( userRoleData.roleId);
            //Act
            let result = userRepositoryHelper.getUserRoleDtoModelMappedFromDomain(userRoleDomainModel);
            let userRoleDtoUserId = result.UserId.value;
            //Assert
            expect(userRoleDtoUserId).toEqual(userRoleData.userId);

        });
    });
});
