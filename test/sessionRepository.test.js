const sessionRepository = require('../app/dataAccessLayer/repositories/sessionRepository.js');
const sessionModel = require('../app/domainLayer/session.js');
const dbAction = require('../app/dataAccessLayer/mysqlDataStore/context/dbAction.js');
jest.mock('../app/dataAccessLayer/mysqlDataStore/context/dbAction.js');



describe('File: sessionRepository.js',function(){

    afterAll(()=>{
        jest.resetAllMocks();
    });

    describe('Function: insertSessionIntoTableAsync',function(){
        test('When Session is created and saved to the database, the results returns OK', async function(){
            //Arrange
            let insertResult = {
                rowInserted:1,
                saved:true
            }
            let resultDatabaseMock = [insertResult]

            dbAction.executeStatementAsync = jest.fn().mockResolvedValueOnce(resultDatabaseMock);
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
            expect(dbAction.executeStatementAsync).toBeCalledTimes(1);
        })
    });
})