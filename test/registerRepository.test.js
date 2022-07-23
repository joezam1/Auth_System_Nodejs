const registerDomainModel = require('../app/domainLayer/register.js');
const registerRepository = require('../app/dataAccessLayer/repositories/registerRepository.js');
const dbAction = require('../app/dataAccessLayer/mysqlDataStore/context/dbAction.js');

jest.mock('../app/dataAccessLayer/mysqlDataStore/context/dbAction.js');

xdescribe('File: registerRepository,js',function(){
    afterAll(()=>{
        jest.resetAllMocks();
    });
    describe('function: insertRegisterIntoTableTransactionAsync',function(){

        test('Database function is called Once and Inserts the user Register OK',async function(){
            //Arrange
            let register = new registerDomainModel();
            register.setRegisterId('adsfp9908jkldrms0');
            register.setUserId('po,.;lkadfioekghew');
            register.setRegisterIsActive(true);
            let connection = 'adsfadsfpoiqer/,.lkadfd650';
            let insertResult = {
                rowInserted:1,
                saved:true
            }
            let resultDatabaseMock = [insertResult]
            dbAction.executeSingleConnectionStatementAsync = jest.fn().mockResolvedValueOnce(resultDatabaseMock);
            //Act
            let resultRegister = await registerRepository.insertRegisterIntoTableTransactionAsync(connection, register);

            let registerCount = resultRegister.length;
            //Assert
            expect(registerCount).toEqual(1);
            expect(dbAction.executeSingleConnectionStatementAsync).toBeCalledTimes(1);
        });
    })


});