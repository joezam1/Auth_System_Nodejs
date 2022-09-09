const sessionExpiredInspector = require("../app/middleware/sessionExpiredInspector.js");
const reducerServices = require('../app/services/inMemoryStorage/reducerService.js');
const sessionThreadManager = require('../app/backgroundWorkers/sessionThreadManager.js');
const sessionConfig = require('../configuration/authentication/sessionConfig.js');

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');

jest.mock('../app/services/inMemoryStorage/reducerService.js');
jest.mock('../app/backgroundWorkers/sessionThreadManager.js');

describe('File sessionExpiredInspector', function(){
    afterAll(()=>{
        jest.resetAllMocks();
    });


    describe('function: resolveRemoveExpiredSessions', function(){
        test('When StoreInspector Property is FALSE, the function calls the setInterval Function', function(){
            //Arrange
            let mockDataStoreInspectorProperty = false;
            reducerServices.getCurrentStateByProperty = jest.fn().mockReturnValueOnce(mockDataStoreInspectorProperty);
            //Act
            sessionExpiredInspector.resolveRemoveExpiredSessions();
            //Assert

            expect(setInterval).toHaveBeenCalledTimes(1);
            expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), sessionConfig.EXPIRED_SESSION_CLEANUP_FREQUENCY_IN_MILLISECONDS);
        });
        test('When StoreInspector Property is TRUE, the worker threads WILL NOT RUN', function(){
            //Arrange
            let mockDataStoreInspectorProperty = true;
            reducerServices.getCurrentStateByProperty = jest.fn().mockReturnValueOnce(mockDataStoreInspectorProperty);
            reducerServices.dispatch = jest.fn().mockReturnValueOnce(true);
            let mockWorkerThreadManager = 'ok'
            sessionThreadManager .createNewtWorkerThread = jest.fn().mockReturnValueOnce(mockWorkerThreadManager);
            let messageObj ={
                message : 'query',
                statement : 'test',
                valuesArray : null
            }
            sessionThreadManager.sendMessageToWorker = jest.fn().mockReturnValueOnce(messageObj);

            //Act
            sessionExpiredInspector.resolveRemoveExpiredSessions();

            //Assert
            expect( reducerServices.getCurrentStateByProperty ).toBeCalledTimes(1);
            expect( reducerServices.dispatch ).toBeCalledTimes(0);
            expect( sessionThreadManager.createNewtWorkerThread ).toBeCalledTimes(0);
            expect(sessionThreadManager.sendMessageToWorker).toBeCalledTimes(0);
        });

        test('When StoreInspector Property is FALSE, the worker threads WILL BE CALLED', function(){
            //Arrange
            let mockDataStoreInspectorProperty = false;
            reducerServices.getCurrentStateByProperty = jest.fn().mockReturnValueOnce(mockDataStoreInspectorProperty);
            reducerServices.dispatch = jest.fn().mockReturnValueOnce(true);
            let mockWorkerThreadManager = 'ok'
            sessionThreadManager.createNewtWorkerThread  = jest.fn().mockReturnValueOnce(mockWorkerThreadManager);
            let messageObj ={
                message : 'query',
                statement : 'test',
                valuesArray : null
            }
            sessionThreadManager.sendMessageToWorker = jest.fn().mockReturnValueOnce(messageObj);

            //Act
            sessionExpiredInspector.resolveRemoveExpiredSessions();

            //Assert
            expect( reducerServices.getCurrentStateByProperty ).toBeCalledTimes(1);
            expect( reducerServices.dispatch ).toBeCalledTimes(2);
            expect(setInterval).toHaveBeenCalledTimes(2);
            expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), sessionConfig.EXPIRED_SESSION_CLEANUP_FREQUENCY_IN_MILLISECONDS);

        });

        test('When StoreInspector Property is NULL, the worker threads WILL BE CALLED', function(){
            //Arrange
            let mockDataStoreInspectorProperty = null;
            reducerServices.getCurrentStateByProperty = jest.fn().mockReturnValueOnce(mockDataStoreInspectorProperty);
            reducerServices.dispatch = jest.fn().mockReturnValueOnce(true);
            let mockWorkerThreadManager = 'ok'
            sessionThreadManager.createNewtWorkerThread  = jest.fn().mockReturnValueOnce(mockWorkerThreadManager);
            let messageObj ={
                message : 'query',
                statement : 'test',
                valuesArray : null
            }
            sessionThreadManager.sendMessageToWorker = jest.fn().mockReturnValueOnce(messageObj);

            //Act
            sessionExpiredInspector.resolveRemoveExpiredSessions();

            //Assert
            expect( reducerServices.getCurrentStateByProperty ).toBeCalledTimes(1);
            expect( reducerServices.dispatch ).toBeCalledTimes(2);
            expect(setInterval).toHaveBeenCalledTimes(3);
            expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), sessionConfig.EXPIRED_SESSION_CLEANUP_FREQUENCY_IN_MILLISECONDS);

        });

        test('When StoreInspector Property is STRING, the worker threads WILL BE NOT CALLED', function(){
            //Arrange
            let mockDataStoreInspectorProperty = 'null';
            reducerServices.getCurrentStateByProperty = jest.fn().mockReturnValueOnce(mockDataStoreInspectorProperty);
            reducerServices.dispatch = jest.fn().mockReturnValueOnce(true);
            let mockWorkerThreadManager = 'ok'
            sessionThreadManager.createNewtWorkerThread = jest.fn().mockReturnValueOnce(mockWorkerThreadManager);
            let messageObj ={
                message : 'query',
                statement : 'test',
                valuesArray : null
            }
            sessionThreadManager.sendMessageToWorker = jest.fn().mockReturnValueOnce(messageObj);

            //Act
            sessionExpiredInspector.resolveRemoveExpiredSessions();

            //Assert
            expect( reducerServices.getCurrentStateByProperty ).toBeCalledTimes(1);
            expect( reducerServices.dispatch ).toBeCalledTimes(0);
            expect( sessionThreadManager.createNewtWorkerThread ).toBeCalledTimes(0);
            expect(sessionThreadManager.sendMessageToWorker).toBeCalledTimes(0);
        });
    });
});