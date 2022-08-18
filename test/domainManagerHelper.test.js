
const domainManagerHelper = require('../app/domainLayer/domainManagers/domainManagerHelper.js');


describe('File: domainManagerHelper', function(){
    describe('function: createUserRoleModel', function(){
        test('Can create a UserRoleModel', function(){
            //Arrange
            let userId = 'abcd';
            let roleId = '1234';
            //Act
            let userRoleModel = domainManagerHelper.createUserRoleModel(userId, roleId);
            let userRoleId = userRoleModel.getRoleId();
            //Assert
            expect(userRoleId).toEqual(roleId);
        })
    });

    describe('function: createRegisterModel', function(){
        test('Can create a RegisterModel', function(){
            //Arrange
            let userId = 'abcd';
            //Act
            let registerModel = domainManagerHelper.createRegisterModel(userId);
            let registerUserId = registerModel.getUserId();
            //Assert
            expect(registerUserId).toEqual(userId);
        })
    });


    describe('function: createSessionModel', function(){
        test('Can create a SessionModel', function(){
            //Arrange
            let userId = 'abcd';
            let sessionToken = '13456';
            let data = '{info:data}';
            let expiration = 1000 * 60 * 15
            //Act
            let sessionModel = domainManagerHelper.createSessionModel(userId, sessionToken , data, expiration);
            let sessionUserId = sessionModel.getUserId();
            //Assert
            expect(sessionUserId).toEqual(userId);
        })
    });


    describe('function: createSessionActivityModel', function(){
        test('Can create a SessionActivityModel', function(){
            //Arrange
            let userId = 'abcd';
            let geolocationInfo = '13456';
            let deviceInfo = 'mobile phone';
            let userAgentInfo = 'Mozilla Firefox';
            //Act
            let sessionActivityModel = domainManagerHelper.createSessionActivityModel(userId, geolocationInfo , deviceInfo, userAgentInfo);
            let sessionActivityUserId = sessionActivityModel.getUserId();
            //Assert
            expect(sessionActivityUserId).toEqual(userId);
        })
    });


    describe('function: createCookieObj', function(){
        test('Can create a CookieObject', function(){
            //Arrange

            let sessionToken = '13456';
            //Act
            let cookieObj = domainManagerHelper.createCookieObj(sessionToken);
            let cookieValue = cookieObj.value;
            //Assert
            expect(cookieValue).toEqual(sessionToken);
        })
    });
});