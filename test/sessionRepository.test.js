const sessionRepository = require('../app/dataAccessLayer/repositories/sessionRepository.js');
const sessionModel = require('../app/domainLayer/domainModels/session.js');
const sessionActivity = require('../app/domainLayer/domainModels/sessionActivity.js');
const repositoryManager = require('../app/dataAccessLayer/repositories/repositoryManager.js');
const domainManagerHelper = require('../app/domainLayer/domainManagers/domainManagerHelper.js');
const helpers = require('../app/library/common/helpers.js');

jest.mock('../app/dataAccessLayer/repositories/repositoryManager.js');



describe('File: sessionRepository.js',function(){

    afterAll(()=>{
        jest.resetAllMocks();
    });

    describe('Function: insertSessionIntoTableTransactionAsync',function(){
        test('When Session is created and saved to the database, the results returns OK', async function(){
            //Arrange
            let insertResult = {
                affectedRows:1,
                saved:true
            }
            let resultDatabaseMock = [insertResult]
            repositoryManager.resolveSingleConnectionStatementAsync = jest.fn().mockReturnValueOnce(resultDatabaseMock);
            let mockConnectionPool = 'abcd';
            let sessionDomain = new sessionModel();
            sessionDomain.setSessionId('123456');
            sessionDomain.setUserId('abcdeiiojfa111');
            sessionDomain.setSessionToken('abcderfafklajdf');
            sessionDomain.setExpiryInMilliseconds('123456789');
            sessionDomain.setData('{name:"", value: "" }');
            sessionDomain.setSessionStatusIsActive(true);
            //Act

            let sessionResult = await sessionRepository.insertSessionIntoTableTransactionAsync(mockConnectionPool, sessionDomain);
            console.log('sessionResult',sessionResult)
            //Assert
            expect(sessionResult.statementResult).toEqual(resultDatabaseMock);
            expect(repositoryManager.resolveSingleConnectionStatementAsync).toBeCalledTimes(1);
        })
    });

    describe('Function: insertSessionActivityIntoTableTransacionAsync', function(){
        test('When session Activity is saved to the database the results are returned OK', function(){
            //arrange
            let insertResult = {
                affectedRows:1,
                saved:true
            }
            let resultDatabaseMock = [insertResult]

            let dataModel = {
                activityId: '123456',
                userId: 'adfadf',
                geolocation: 'coords:{lat:123465, long:123456}',
                device:'mobile phone',
                userAgent:'mozilla firefox'
            }
            let sessionActivityDomainModel = new sessionActivity();
            sessionActivityDomainModel.setSessionActivityId(dataModel.activityId);
            sessionActivityDomainModel.setUserId(dataModel.userId);
            sessionActivityDomainModel.setGeolocation(dataModel.geolocation);
            sessionActivityDomainModel.setDevice(dataModel.device);
            sessionActivityDomainModel.setUserAgent(dataModel.userAgent);

            repositoryManager.resolveSingleConnectionStatementAsync = jest.fn().mockReturnValueOnce(resultDatabaseMock);
            let mockConnectionPool = 'abcd';
            let mockLoginDate = new Date();
            let mockLoginDateUtc = helpers.convertLocaleDateToUTCFormatForDatabase(mockLoginDate);
            //Act
            let result = sessionRepository.insertSessionActivityIntoTableTransacionAsync(mockConnectionPool, sessionActivityDomainModel , mockLoginDateUtc);
            //Assert
            expect(repositoryManager.resolveSingleConnectionStatementAsync ).toHaveBeenCalledTimes(1);
        });
    });

    describe('Function: getSessionFromDatabaseAsync', function(){
        test('When the function is called the database returns the corresponding session token',async function(){

            //Arrange
            let userId ='abcd';
            let sessionToken = 'tokenTest';
            let data = 'cookie-information-here';
            let expirationTimeMilliseconds = 1000;

            let sessionDTOModel = {
                SessionId:'',
                UserId:'',
                SessionToken: sessionToken,
                Expires:'',
                Data:'',
                IsActive : 1,
                UTCDateCreated:'',
                UTCDateExpired:''
            }
            let mockSessionObjectResult =[[sessionDTOModel],[]];
            repositoryManager.resolveStatementAsync = jest.fn().mockReturnValueOnce(mockSessionObjectResult);

            let sessionDomainModel = domainManagerHelper.createSessionModel(userId, sessionToken,data, expirationTimeMilliseconds);
            //Act
            let result = await sessionRepository.getSessionFromDatabaseAsync(sessionDomainModel);
            let tokenValue = result[0].SessionToken.value
            //Assert
            expect(result).not.toBe(null);
            expect(tokenValue).toEqual(sessionToken);
            expect(repositoryManager.resolveStatementAsync).toBeCalledTimes(1);
        });
    });

    describe('Function: deleteSessionFromDatabaseAsync',function(){
        test('When Session is DELETED from the database, the call to database is done and results returns OK', async function(){
            //Arrange
            let deleteResult = {
                affectedRows:1,
                saved:true
            }
            let resultDatabaseMock = [deleteResult]
            repositoryManager.resolveStatementAsync = jest.fn().mockReturnValueOnce(resultDatabaseMock);

            let sessionDomain = new sessionModel();
            sessionDomain.setSessionId('123456');
            sessionDomain.setUserId('abcdeiiojfa111');
            sessionDomain.setSessionToken('abcderfafklajdf');
            sessionDomain.setExpiryInMilliseconds('123456789');
            sessionDomain.setData('{name:"", value: "" }');
            sessionDomain.setSessionStatusIsActive(true);
            //Act

            let sessionResult = await sessionRepository.deleteSessionFromDatabaseAsync(sessionDomain);
            console.log('sessionResult',sessionResult)
            //Assert
            expect(sessionResult).toEqual(resultDatabaseMock);
            expect(repositoryManager.resolveStatementAsync).toBeCalledTimes(1);
        })
    });

    describe('Function: updateSessionTableSetColumnValuesWhereAsync',function(){
        test('When Session is UPDATED in the database, the call to database is done and results returns OK', async function(){
            //Arrange
            let updatedResult = {
                affectedRows:1,
                saved:true
            }
            let resultDatabaseMock = [updatedResult]
            repositoryManager.resolveConditionalWhereEqualsStatementAsync = jest.fn().mockReturnValueOnce(resultDatabaseMock);

            let sessionDomain = new sessionModel();
            sessionDomain.setSessionId('123456');
            sessionDomain.setUserId('abcdeiiojfa111');
            sessionDomain.setSessionToken('abcderfafklajdf');
            sessionDomain.setExpiryInMilliseconds('123456789');
            sessionDomain.setData('{name:"", value: "" }');
            sessionDomain.setSessionStatusIsActive(true);
            //Act

            let sessionResult = await sessionRepository.updateSessionTableSetColumnValuesWhereAsync(sessionDomain);
            console.log('sessionResult',sessionResult)
            //Assert
            expect(sessionResult).toEqual(resultDatabaseMock);
            expect(repositoryManager.resolveConditionalWhereEqualsStatementAsync).toBeCalledTimes(1);
        })
    });

    describe('Function: getSessionActivitiesFromDatabaseAsync', function(){
        test('When function is called the SessionActivities object is retrieved', function(){
            //Arrange
            let sessionActivityDataModel = {
                activityId: '123456',
                userId: 'adfadf',
                geolocation: 'coords:{lat:123465, long:123456}',
                device:'mobile phone',
                userAgent:'mozilla firefox'
            }
            let resultDb = [sessionActivityDataModel]
            repositoryManager.resolveWherePropertyEqualsAndIsNullStatementAsync = jest.fn().mockReturnValueOnce(resultDb);

            let mockLoginDate = new Date();
            let mockLoginDateUtc = helpers.convertLocaleDateToUTCFormatForDatabase(mockLoginDate);

            let dataModel = {
                activityId: '123456',
                userId: 'adfadf',
                geolocation: 'coords:{lat:123465, long:123456}',
                device:'mobile phone',
                userAgent:'mozilla firefox'
            }
            let sessionActivityDomainModel = new sessionActivity();
            sessionActivityDomainModel.setSessionActivityId(dataModel.activityId);
            sessionActivityDomainModel.setUserId(dataModel.userId);
            sessionActivityDomainModel.setGeolocation(dataModel.geolocation);
            sessionActivityDomainModel.setDevice(dataModel.device);
            sessionActivityDomainModel.setUserAgent(dataModel.userAgent);
            //Act
            let result = sessionRepository.getSessionActivitiesFromDatabaseAsync(sessionActivityDomainModel, mockLoginDateUtc);
            //Assert
            expect(repositoryManager.resolveWherePropertyEqualsAndIsNullStatementAsync).toBeCalledTimes(1);


        });
    });

    describe('Function: updateSessionActivitiesTableSetColumnValuesWhereAsync', function(){
        test('When function is called the correct Session Activity is retrieved', function(){

            //Arrange
            let sessionActivityDataModel = {
                activityId: '123456',
                userId: 'adfadf',
                geolocation: 'coords:{lat:123465, long:123456}',
                device:'mobile phone',
                userAgent:'mozilla firefox'
            }
            let resultDb = [sessionActivityDataModel]
            repositoryManager.resolveConditionalWhereEqualsStatementAsync = jest.fn().mockReturnValueOnce();

            let dataModel = {
                activityId: '123456',
                userId: 'adfadf',
                geolocation: 'coords:{lat:123465, long:123456}',
                device:'mobile phone',
                userAgent:'mozilla firefox'
            }
            let sessionActivityDomainModel = new sessionActivity();
            sessionActivityDomainModel.setSessionActivityId(dataModel.activityId);
            sessionActivityDomainModel.setUserId(dataModel.userId);
            sessionActivityDomainModel.setGeolocation(dataModel.geolocation);
            sessionActivityDomainModel.setDevice(dataModel.device);
            sessionActivityDomainModel.setUserAgent(dataModel.userAgent);
            //Act
            let result = sessionRepository.updateSessionActivitiesTableSetColumnValuesWhereAsync(sessionActivityDomainModel);
            //Assert
            expect(repositoryManager.resolveConditionalWhereEqualsStatementAsync).toBeCalledTimes(1);
        })
    })
})