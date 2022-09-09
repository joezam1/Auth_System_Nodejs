const sessionDomainManager = require('../app/domainLayer/domainManagers/sessionDomainManager.js');
const helpers = require('../app/library/common/helpers.js');
const sessionService = require('../app/services/authentication/sessionService.js');
const sessionRepository = require('../app/dataAccessLayer/repositories/sessionRepository.js');
const tokenRepository = require('../app/dataAccessLayer/repositories/tokenRepository.js');
const dbAction = require('../app/dataAccessLayer/mysqlDataStore/context/dbAction.js');
const tokenDomainModel = require('../app/domainLayer/domainModels/token.js');
const sessionDomainModel = require('../app/domainLayer/domainModels/session.js');
const sessionActivityDomainModel = require('../app/domainLayer/domainModels/sessionActivity.js');
const encryptDecryptService = require('../app/services/encryption/encryptDecryptService.js');
const jsonWebTokenDomainManager = require('../app/domainLayer/domainManagers/jsonWebTokenDomainManager.js');


jest.mock('../app/dataAccessLayer/repositories/sessionRepository.js');
jest.mock('../app/dataAccessLayer/mysqlDataStore/context/dbAction.js');
jest.mock('../app/dataAccessLayer/repositories/tokenRepository.js');
jest.mock('../app/domainLayer/domainManagers/jsonWebTokenDomainManager.js');


describe('File: sessionDomainManager.js', function(){

    beforeEach(()=>{
        jest.resetAllMocks();
    });
    afterAll(()=>{
        jest.resetAllMocks();
    });

    describe('function: resolveSessionAndJsoWebTokenUpdate', function(){
        test('CAN resolve Session And JsoWebToken Update', async function(){

            //Arrange
            let localeDateNow = new Date();
            let utcDateNow = helpers.convertLocaleDateToUTCDate(localeDateNow);
            let expiry1HourInMilliseconds = 1000 * 60 * 60;
            let localeExpiryDate = sessionService.calculateSessionDateExpiry(localeDateNow, expiry1HourInMilliseconds);
            let utcExpiryDate = helpers.convertLocaleDateToUTCDate(localeExpiryDate);
            let mockSessionResult = {
                SessionId: {value:'123'},
                UserId: {value:'abc'},
                SessionToken: {value:'fapoidlkevnaopie'},
                Expires:{value: 60000},
                Data:{value: 'this is the data section'},
                IsActive: {value:1},
                UTCDateCreated:{value: utcDateNow },
                UTCDateExpired: {value: utcExpiryDate}
            }
            let resultDb = [mockSessionResult]
            sessionRepository.getSessionFromDatabaseAsync = jest.fn().mockResolvedValueOnce(resultDb);
            let mockSessionUpdate = {
                affectedRows: 1
            }
            let mockSessionResultUpdate = [mockSessionUpdate]
            let mockJwtTokenResult = {};
            jsonWebTokenDomainManager.resolveJsonWebTokenUpdateAsync = jest.fn().mockResolvedValueOnce(mockJwtTokenResult);
            sessionRepository.updateSessionTableSetColumnValuesWhereAsync = jest.fn().mockResolvedValueOnce(mockSessionResultUpdate);
            let request = {
                body:{
                    session: 'adklerpoivnei'
                }
            }
            //Act

            let resultTest =await sessionDomainManager.resolveSessionAndJsoWebTokenUpdate(request);
            //Assert
            expect(jsonWebTokenDomainManager.resolveJsonWebTokenUpdateAsync).toHaveBeenCalledTimes(1);
            expect(sessionRepository.getSessionFromDatabaseAsync).toHaveBeenCalledTimes(1);
            expect(sessionRepository.updateSessionTableSetColumnValuesWhereAsync).toHaveBeenCalledTimes(1);
        });
    });

    describe('function: resolveSessionUpdateAsync', function(){
        test('CAN resolve Session Update', async function(){

            //Arrange
            let localeDateNow = new Date();
            let utcDateNow = helpers.convertLocaleDateToUTCDate(localeDateNow);
            let expiry1HourInMilliseconds = 1000 * 60 * 60;
            let localeExpiryDate = sessionService.calculateSessionDateExpiry(localeDateNow, expiry1HourInMilliseconds);
            let utcExpiryDate = helpers.convertLocaleDateToUTCDate(localeExpiryDate);
            let mockSessionResult = {
                SessionId: {value:'123'},
                UserId: {value:'abc'},
                SessionToken: {value:'fapoidlkevnaopie'},
                Expires:{value: 60000},
                Data:{value: 'this is the data section'},
                IsActive: {value:1},
                UTCDateCreated:{value: utcDateNow },
                UTCDateExpired: {value: utcExpiryDate}
            }
            let resultDb = [mockSessionResult]
            sessionRepository.getSessionFromDatabaseAsync = jest.fn().mockResolvedValueOnce(resultDb);
            let mockSessionUpdate = {
                affectedRows: 1
            }
            let mockSessionResultUpdate = [mockSessionUpdate]
            sessionRepository.updateSessionTableSetColumnValuesWhereAsync = jest.fn().mockResolvedValueOnce(mockSessionResultUpdate);
            let request = {
                body:{
                    session: 'adklerpoivnei'
                }
            }
            //Act

            let resultTest =await sessionDomainManager.resolveSessionUpdateAsync(request);
            //Assert
            expect(sessionRepository.getSessionFromDatabaseAsync).toHaveBeenCalledTimes(1);
            expect(sessionRepository.updateSessionTableSetColumnValuesWhereAsync).toHaveBeenCalledTimes(1);
        });
    });

    describe('function: resolveGetSessionAsync', function(){
        test('CAN resolve Geting Session', async function(){

            //Arrange
            let localeDateNow = new Date();
            let utcDateNow = helpers.convertLocaleDateToUTCDate(localeDateNow);
            let expiry1HourInMilliseconds = 1000 * 60 * 60;
            let localeExpiryDate = sessionService.calculateSessionDateExpiry(localeDateNow, expiry1HourInMilliseconds);
            let utcExpiryDate = helpers.convertLocaleDateToUTCDate(localeExpiryDate);
            let mockSessionResult = {
                SessionId: {value:'123'},
                UserId: {value:'abc'},
                SessionToken: {value:'fapoidlkevnaopie'},
                Expires:{value: 60000},
                Data:{value: 'this is the data section'},
                IsActive: {value:1},
                UTCDateCreated:{value: utcDateNow },
                UTCDateExpired: {value: utcExpiryDate}
            }
            let resultDb = [mockSessionResult]
            sessionRepository.getSessionFromDatabaseAsync = jest.fn().mockResolvedValueOnce(resultDb);

            let request = {
                body:{
                    session: 'adklerpoivnei'
                },
                headers:{
                    x_session_id : 'oiu.aduyeljkasiwa'
                }
            }
            //Act

            let resultTest =await sessionDomainManager.resolveGetSessionAsync(request);
            //Assert
            expect(sessionRepository.getSessionFromDatabaseAsync).toHaveBeenCalledTimes(1);

        });
    });

    describe('function: insertSessionSessionActivityAndTokenTransactionAsync', function(){
        test('CAN insert Session, SessionActivity And Token In Database', async function(){

            //Arrange
            let localeDateNow = new Date();
            let utcDateNow = helpers.convertLocaleDateToUTCDate(localeDateNow);
            let expiry1HourInMilliseconds = 1000 * 60 * 60;
            let localeExpiryDate = sessionService.calculateSessionDateExpiry(localeDateNow, expiry1HourInMilliseconds);
            let utcExpiryDate = helpers.convertLocaleDateToUTCDate(localeExpiryDate);
            let sessionDtoModel = {
                SessionId: {value:'123'},
                UserId: {value:'abc'},
                SessionToken: {value:'fapoidlkevnaopie'},
                Expires:{value: 60000},
                Data:{value: 'this is the data section'},
                IsActive: {value:1},
                UTCDateCreated:{value: utcDateNow },
                UTCDateExpired: {value: utcExpiryDate}
            }
            let mockSessionInserted = {
                sessionDtoModel:sessionDtoModel
            }

            sessionRepository.insertSessionIntoTableTransactionAsync = jest.fn().mockResolvedValueOnce(mockSessionInserted);
            sessionRepository.insertSessionActivityIntoTableTransacionAsync = jest.fn();
            tokenRepository.insertTokenIntoTableTransactionAsync = jest.fn();

            dbAction.getSingleConnectionFromPoolPromiseAsync = jest.fn();
            dbAction.beginTransactionSingleConnectionAsync = jest.fn();
            dbAction.commitTransactionSingleConnection = jest.fn();

            let mockSessionModel = new sessionDomainModel();
            mockSessionModel.setSessionId('13465');
            let mockSessionActivityModel = new sessionActivityDomainModel();
            mockSessionActivityModel.setSessionActivityId('456789');
            let mockTokenModel =  new tokenDomainModel();
            let payload = {
                result: 'adsfakldpoiewn',
                tokenUTCDateExpiry: new Date(),
                tokenUTCDateExpiry: new Date()
            }
            let payloadString = helpers.convertToStringOrStringifyForDataStorage(payload);
            let encryptedPayload = encryptDecryptService.encryptWithAES(payloadString);
            mockTokenModel.setPayload(encryptedPayload);

            //Act
            let resultTest = await sessionDomainManager.insertSessionSessionActivityAndTokenTransactionAsync( mockSessionModel, mockSessionActivityModel,mockTokenModel);
            //Assert

            expect(sessionRepository.insertSessionIntoTableTransactionAsync).toHaveBeenCalledTimes(1);
            expect(sessionRepository.insertSessionActivityIntoTableTransacionAsync ).toHaveBeenCalledTimes(1);
            expect(tokenRepository.insertTokenIntoTableTransactionAsync).toHaveBeenCalledTimes(1);
            expect(dbAction.getSingleConnectionFromPoolPromiseAsync).toHaveBeenCalledTimes(1);
            expect(dbAction.beginTransactionSingleConnectionAsync ).toHaveBeenCalledTimes(1);
            expect(dbAction.commitTransactionSingleConnection).toHaveBeenCalledTimes(1);
        });
    });
});
