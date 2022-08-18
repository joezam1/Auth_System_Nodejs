const repositoryManager = require('../app/dataAccessLayer/repositories/repositoryManager.js');
const dbAction = require('../app/dataAccessLayer/mysqlDataStore/context/dbAction.js');
const session = require('../app/domainLayer/domainModels/session.js');
const genericQueryStatement = require('../app/library/enumerations/genericQueryStatement.js');
const sessionRepositoryHelper = require('../app/dataAccessLayer/repositories/sessionRepositoryHelper.js');

jest.mock('../app/dataAccessLayer/mysqlDataStore/context/dbAction.js');

describe('File: repositoryManager.js', function(){

    afterAll(()=>{
        jest.resetAllMocks();
    });

    describe('function: resolveStatementAsync', function(){
        test('When the function is called the system executes the database call', async function(){
            //Arrange
            let dataModelResult = {
                affectedRows:1
            }
            let result = [ dataModelResult];
            dbAction.executeStatementAsync = jest.fn().mockResolvedValueOnce(result);

            let dataModel={
                sessionId:'abd',
                userId:'123456',
                sessionToken:'opiouuu-oitrgf-kjh',
                expiry:(1000 * 60 * 15),
                data: 'cookie:info',
                isActive:true
            }
            let sessionDomainModel = new session();
            sessionDomainModel.setSessionId(dataModel.sessionId);
            sessionDomainModel.setUserId(dataModel.userId);
            sessionDomainModel.setSessionToken(dataModel.sessionToken);
            sessionDomainModel.setExpiryInMilliseconds(dataModel.expiry);
            sessionDomainModel.setData(dataModel.data);
            sessionDomainModel.setSessionStatusIsActive(dataModel.isActive);
            let sessionTableName = 'table_test';
            let sessionDtoModel = sessionRepositoryHelper.getSessionDtoModelMappedFromDomain(sessionDomainModel);
            let propertiesArray = [sessionDtoModel.SessionToken];
            //Act
            let statementResult = await repositoryManager.resolveStatementAsync(propertiesArray, genericQueryStatement.selectWherePropertyEqualsAnd, sessionTableName);
            //Assert
            expect(dbAction.executeStatementAsync).toHaveBeenCalledTimes(1);
        });
    });

    describe('function: resolveSingleConnectionStatementAsync', function(){
        test('When the function is called the system executes the database call', async function(){
            //Arrange
            let dataModelResult = {
                affectedRows:1
            }
            let result = [ dataModelResult];
            dbAction.executeSingleConnectionStatementAsync = jest.fn().mockResolvedValueOnce(result);

            let dataModel={
                sessionId:'abd',
                userId:'123456',
                sessionToken:'opiouuu-oitrgf-kjh',
                expiry:(1000 * 60 * 15),
                data: 'cookie:info',
                isActive:true
            }
            let sessionDomainModel = new session();
            sessionDomainModel.setSessionId(dataModel.sessionId);
            sessionDomainModel.setUserId(dataModel.userId);
            sessionDomainModel.setSessionToken(dataModel.sessionToken);
            sessionDomainModel.setExpiryInMilliseconds(dataModel.expiry);
            sessionDomainModel.setData(dataModel.data);
            sessionDomainModel.setSessionStatusIsActive(dataModel.isActive);
            let connectionPool = 'abcd';
            let sessionTableName = 'table_test';
            let sessionDtoModel = sessionRepositoryHelper.getSessionDtoModelMappedFromDomain(sessionDomainModel);
            let propertiesArray = [sessionDtoModel.SessionToken];
            //Act
            let statementResult = await repositoryManager.resolveSingleConnectionStatementAsync(propertiesArray, genericQueryStatement.selectWherePropertyEqualsAnd, sessionTableName, connectionPool);
            //Assert
            expect(dbAction.executeSingleConnectionStatementAsync).toHaveBeenCalledTimes(1);
        });
    });

    describe('function: resolveConditionalWhereEqualsStatementAsync', function(){
        test('When the function is called the system executes the database call', async function(){
            //Arrange
            let dataModelResult = {
                affectedRows:1
            }
            let result = [ dataModelResult];
            dbAction.executeStatementAsync = jest.fn().mockResolvedValueOnce(result);

            let dataModel={
                sessionId:'abd',
                userId:'123456',
                sessionToken:'opiouuu-oitrgf-kjh',
                expiry:(1000 * 60 * 15),
                data: 'cookie:info',
                isActive:true
            }
            let sessionDomainModel = new session();
            sessionDomainModel.setSessionId(dataModel.sessionId);
            sessionDomainModel.setUserId(dataModel.userId);
            sessionDomainModel.setSessionToken(dataModel.sessionToken);
            sessionDomainModel.setExpiryInMilliseconds(dataModel.expiry);
            sessionDomainModel.setData(dataModel.data);
            sessionDomainModel.setSessionStatusIsActive(dataModel.isActive);
            let connectionPool = 'abcd';
            let sessionTableName = 'table_test';
            let sessionDtoModel = sessionRepositoryHelper.getSessionDtoModelMappedFromDomain(sessionDomainModel);
            let propertiesArray = [sessionDtoModel.SessionToken];
            let conditionalPropertiesArray = [sessionDtoModel.UserId];
            //Act
            let statementResult = await repositoryManager.resolveConditionalWhereEqualsStatementAsync(propertiesArray, conditionalPropertiesArray, sessionTableName );
            //Assert
            expect(dbAction.executeStatementAsync).toHaveBeenCalledTimes(1);
        });
    });

    describe('function: resolveConditionalWhereEqualsStatementAsync', function(){
        test('When the function is called the system executes the database call', async function(){
            //Arrange
            let dataModelResult = {
                affectedRows:1
            }
            let result = [ dataModelResult];
            dbAction.executeStatementAsync = jest.fn().mockResolvedValueOnce(result);

            let dataModel={
                sessionId:'abd',
                userId:'123456',
                sessionToken:'opiouuu-oitrgf-kjh',
                expiry:(1000 * 60 * 15),
                data: 'cookie:info',
                isActive:true
            }
            let sessionDomainModel = new session();
            sessionDomainModel.setSessionId(dataModel.sessionId);
            sessionDomainModel.setUserId(dataModel.userId);
            sessionDomainModel.setSessionToken(dataModel.sessionToken);
            sessionDomainModel.setExpiryInMilliseconds(dataModel.expiry);
            sessionDomainModel.setData(null);
            sessionDomainModel.setSessionStatusIsActive(dataModel.isActive);

            let sessionTableName = 'table_test';
            let sessionDtoModel = sessionRepositoryHelper.getSessionDtoModelMappedFromDomain(sessionDomainModel);
            let propertiesArray = [sessionDtoModel.SessionToken, sessionDtoModel.Data ,sessionDtoModel.UserId];

            //Act
            let statementResult = await repositoryManager.resolveWherePropertyEqualsAndIsNullStatementAsync(propertiesArray, sessionTableName );
            //Assert
            expect(dbAction.executeStatementAsync).toHaveBeenCalledTimes(1);
        });
    });
});
