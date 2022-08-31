const userDomainManager = require('../app/domainLayer/domainManagers/userDomainManager.js');
const userRegistrationDomainManager = require('../app/domainLayer/domainManagers/userRegistrationDomainManager.js');
const userLoginDomainManager = require('../app/domainLayer/domainManagers/userLoginDomainManager.js');
const userLogoutDomainManager = require('../app/domainLayer/domainManagers/userLogoutDomainManager.js');


jest.mock('../app/domainLayer/domainManagers/userRegistrationDomainManager.js');
jest.mock('../app/domainLayer/domainManagers/userLoginDomainManager.js');
jest.mock('../app/domainLayer/domainManagers/userLogoutDomainManager.js');





describe('File: userDomainManager.js', function(){
    afterAll(()=>{
        jest.resetAllMocks();
    });
    describe('Function: resolveUserRegistrationAsync', function(){
        test('CAN resolve User Registration', async function(){

            //Arrange
            let returnValue = {
                result: null,
                status: 200,
                statusText:'ok'
            }
            userRegistrationDomainManager.processUserRegistrationValidationAsync = jest.fn().mockReturnValueOnce(returnValue);
            userRegistrationDomainManager.processUserRegistrationStorageToDatabaseAsync = jest.fn();
            //Act

            let request={
                body:{
                    userRole:2
                }
            }
            let resultTest = await userDomainManager.resolveUserRegistrationAsync(request);

            //Assert
            expect(userRegistrationDomainManager.processUserRegistrationValidationAsync).toHaveBeenCalledTimes(1);
            expect(userRegistrationDomainManager.processUserRegistrationStorageToDatabaseAsync).toHaveBeenCalledTimes(1);
        });
    });

    describe('Function: resolveUserLoginSessionAsync', function(){
        test('CAN resolve User Login Session', async function(){
            //Arrange

            let returnValue = {
                result: {
                    UserId:'123',

                },
                status: 200,
                statusText:'ok'
            }
            userLoginDomainManager.processUserLoginValidationAsync = jest.fn().mockReturnValueOnce(returnValue);
            userLoginDomainManager.processUserLoginStorageToDatabaseAsync = jest.fn();

            let request={
                body:{
                    geoLocation: 'lat:xxx;long:yyy',
                    deviceAndBrowser:'Mozilla Firefox - Tablet',
                    userAgent: 'Mozilla Firefox'
                }
            }
            //Act
            let resultTest = await userDomainManager.resolveUserLoginSessionAsync(request);
            //Assert
            expect(userLoginDomainManager.processUserLoginValidationAsync).toHaveBeenCalledTimes(1);
            expect(userLoginDomainManager.processUserLoginStorageToDatabaseAsync).toHaveBeenCalledTimes(1);
        })
    });

    describe('Function: resolveUserLogoutSessionAsync', function(){
        test('CAN resolve User Logout Session', async function(){
            //Arrange
            let returnValue = {
                result: {
                    tempSessionActivityModel: {},
                    sessionUtcDateCreatedDbFormatted:'2022-12-02 16:20:15'
                },
                status: 200,
                statusText:'ok'
            }
            userLogoutDomainManager.processUserLogoutCreateTempSessionActivityDomainModelAsync = jest.fn().mockReturnValueOnce(returnValue);
            userLogoutDomainManager.processUserlogoutDeleteJwtRefreshTokenAsync = jest.fn();
            userLogoutDomainManager.processUserLogoutDeleteSessionAndUpdateSessionActivityInDatabaseAsync = jest.fn();
            let request= {
                body:{
                    userAgent:'Mozilla Firefox',
                    session:'abcd'
                },
                headers:{
                    authorization: 'Bearer adfadlkfaoiew',
                    refresh_token: 'adklwoinapekah'
                }
            }
            //Act
            let resultTest = await userDomainManager.resolveUserLogoutSessionAsync(request);

            //Assert
            expect(userLogoutDomainManager.processUserLogoutCreateTempSessionActivityDomainModelAsync).toHaveBeenCalledTimes(1);
            expect(userLogoutDomainManager.processUserlogoutDeleteJwtRefreshTokenAsync).toHaveBeenCalledTimes(1);
            expect(userLogoutDomainManager.processUserLogoutDeleteSessionAndUpdateSessionActivityInDatabaseAsync).toHaveBeenCalledTimes(1);
        });
    });
});