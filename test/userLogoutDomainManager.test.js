const userLogoutDomainManager = require('../app/domainLayer/domainManagers/userLogoutDomainManager.js');
const tokenRepository = require('../app/dataAccessLayer/repositories/tokenRepository.js');
const sessionRepository = require('../app/dataAccessLayer/repositories/sessionRepository.js');
const sessionModel = require('../app/domainLayer/domainModels/session.js');
const sessionActivityModel = require('../app/domainLayer/domainModels/sessionActivity.js');
const helpers = require('../app/library/common/helpers.js');


jest.mock('../app/dataAccessLayer/repositories/sessionRepository.js');
jest.mock('../app/dataAccessLayer/repositories/tokenRepository.js');


describe('File: userLogoutDomainManager.js', function(){
    afterAll(()=>{
        jest.resetAllMocks();
    });
    describe('Function: processUserLogoutCreateTempSessionActivityDomainModelAsync', function(){
        test('CAN process User Logout Create Session Activity Domain Model ', async function(){
            //Arrange
            let resolvedValue = {
                UserId : {value:'123'},
                UTCDateCreated : {value: new Date()}
            }
            let value = [resolvedValue];
            sessionRepository.getSessionFromDatabaseAsync = jest.fn().mockResolvedValueOnce(value);
            let _sessionModel = new sessionModel();
            _sessionModel.setSessionId('123465');
            let userAgent = 'Mozilla Firefox';
            //Act
            let resultTest = await userLogoutDomainManager.processUserLogoutCreateTempSessionActivityDomainModelAsync(_sessionModel, userAgent);

            //Assert
            expect(resultTest.statusText).toEqual('ok');
            expect(sessionRepository.getSessionFromDatabaseAsync).toHaveBeenCalledTimes(1);
        });
    });

    describe('Function: processUserLogoutDeleteSessionAndUpdateSessionActivityInDatabaseAsync', function(){
        test('CAN process UserLogout Delete Session And Update Session Activity In Database', async function(){
            //Arrange
            sessionRepository.getSessionActivitiesFromDatabaseAsync = jest.fn().mockResolvedValueOnce();

            let mockResult = {
                affectedRows: 1
            }
            let resultDb = [mockResult];
            sessionRepository.deleteSessionFromDatabaseAsync = jest.fn().mockResolvedValueOnce(resultDb);
            let _sessionModel = new sessionModel();
            _sessionModel.setSessionId('123465');
            let localeDateNow = new Date();
            let _sessionUTCDateCreated = helpers.convertLocaleDateToUTCDate(localeDateNow);
            let _sessionUTCDateCreatedDbFormat = helpers.composeUTCDateToUTCFormatForDatabase(_sessionUTCDateCreated);
            let _sessionActivityModel = new sessionActivityModel();
            _sessionActivityModel.setSessionActivityId('123456');
            //Act
            let resultTest = await userLogoutDomainManager.processUserLogoutDeleteSessionAndUpdateSessionActivityInDatabaseAsync(_sessionModel, _sessionActivityModel, _sessionUTCDateCreatedDbFormat);

            //Assert
            expect(resultTest.statusText).toEqual('ok');
            expect(sessionRepository.getSessionActivitiesFromDatabaseAsync).toHaveBeenCalledTimes(1);
            expect(sessionRepository.deleteSessionFromDatabaseAsync).toHaveBeenCalledTimes(1);
        });
    });

    describe('Function: processUserlogoutDeleteJwtRefreshTokenAsync', function(){
        test('CAN process User logout Delete JwtRefresh Token', async function(){

            //Arrange
            let mockResultDb = {
                affectedRows:1
            }
            let resultDb = [mockResultDb]
            tokenRepository.deleteTokenFromDatabaseAsync = jest.fn().mockResolvedValueOnce(resultDb);
            let refreshToken = 'adfkwies';
            //Act
            let resultTest =await userLogoutDomainManager.processUserlogoutDeleteJwtRefreshTokenAsync(refreshToken);

            //Assert
            expect( tokenRepository.deleteTokenFromDatabaseAsync ).toHaveBeenCalledTimes(1);
        });
    });
});
