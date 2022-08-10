const sessionRepository = require('../app/dataAccessLayer/repositories/sessionRepository.js');
const sessionModel = require('../app/domainLayer/session.js');
const dbAction = require('../app/dataAccessLayer/mysqlDataStore/context/dbAction.js');
const repositoryHelper = require('../app/dataAccessLayer/repositories/repositoryHelper.js');
const domainManagerHeloer = require('../app/domainLayer/domainManagerHelper.js');

jest.mock('../app/dataAccessLayer/mysqlDataStore/context/dbAction.js');
jest.mock('../app/dataAccessLayer/repositories/repositoryHelper.js');



describe('File: sessionRepository.js',function(){

    afterAll(()=>{
        jest.resetAllMocks();
    });

    describe('Function: insertSessionIntoTableAsync',function(){
        test('When Session is created and saved to the database, the results returns OK', async function(){
            //Arrange
            let insertResult = {
                affectedRows:1,
                saved:true
            }
            let resultDatabaseMock = [insertResult]
            repositoryHelper.resolveStatementAsync = jest.fn().mockReturnValueOnce(resultDatabaseMock);

            let sessionDomain = new sessionModel();
            sessionDomain.setSessionId('123456');
            sessionDomain.setUserId('abcdeiiojfa111');
            sessionDomain.setSessionToken('abcderfafklajdf');
            sessionDomain.setExpiryInMilliseconds('123456789');
            sessionDomain.setData('{name:"", value: "" }');
            sessionDomain.setSessionStatusIsActive(true);
            //Act

            let sessionResult = await sessionRepository.insertSessionIntoTableAsync(sessionDomain);
            console.log('sessionResult',sessionResult)
            //Assert
            expect(sessionResult).toEqual(resultDatabaseMock);
            expect(repositoryHelper.resolveStatementAsync).toBeCalledTimes(1);
        })
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
            repositoryHelper.resolveStatementAsync = jest.fn().mockReturnValueOnce(mockSessionObjectResult);

            let sessionDomainModel = domainManagerHeloer.createSessionModel(userId, sessionToken,data, expirationTimeMilliseconds);
            //Act
            let result = await sessionRepository.getSessionFromDatabaseAsync(sessionDomainModel);
            let tokenValue = result[0].SessionToken.value
            //Assert
            expect(result).not.toBe(null);
            expect(tokenValue).toEqual(sessionToken);
            expect(repositoryHelper.resolveStatementAsync).toBeCalledTimes(1);
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
            repositoryHelper.resolveStatementAsync = jest.fn().mockReturnValueOnce(resultDatabaseMock);

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
            expect(repositoryHelper.resolveStatementAsync).toBeCalledTimes(1);
        })
    });

    describe('Function: updateTableSetColumnValuesWhereAsync',function(){
        test('When Session is UPDATED in the database, the call to database is done and results returns OK', async function(){
            //Arrange
            let updatedResult = {
                affectedRows:1,
                saved:true
            }
            let resultDatabaseMock = [updatedResult]
            repositoryHelper.resolveConditionalWhereEqualsStatementAsync = jest.fn().mockReturnValueOnce(resultDatabaseMock);

            let sessionDomain = new sessionModel();
            sessionDomain.setSessionId('123456');
            sessionDomain.setUserId('abcdeiiojfa111');
            sessionDomain.setSessionToken('abcderfafklajdf');
            sessionDomain.setExpiryInMilliseconds('123456789');
            sessionDomain.setData('{name:"", value: "" }');
            sessionDomain.setSessionStatusIsActive(true);
            //Act

            let sessionResult = await sessionRepository.updateTableSetColumnValuesWhereAsync(sessionDomain);
            console.log('sessionResult',sessionResult)
            //Assert
            expect(sessionResult).toEqual(resultDatabaseMock);
            expect(repositoryHelper.resolveConditionalWhereEqualsStatementAsync).toBeCalledTimes(1);
        })
    });
})