const sessionExpiredInspector = require("../app/middleware/sessionExpiredInspector.js");
const reducerServices = require('../app/services/inMemoryStorage/reducerService.js');
const workerThreadManager = require("../app/backgroundWorkers/workerThreadManager.js");



jest.mock('../app/services/inMemoryStorage/reducerService.js');
jest.mock('../app/backgroundWorkers/workerThreadManager.js');

describe('File sessionExpiredInspector', function(){
    afterAll(()=>{
        jest.resetAllMocks();
    });
    describe('function: resolveRemoveExpiredSessions', function(){
        test('When StoreInspector Property is TRUE, the worker threads WILL NOT RUN', function(){
            //Arrange
            let mockDataStoreInspectorProperty = true;
            reducerServices.getCurrentStateByProperty = jest.fn().mockReturnValueOnce(mockDataStoreInspectorProperty);
            reducerServices.dispatch = jest.fn().mockReturnValueOnce(true);
            let mockWorkerThreadManager = 'ok'
            workerThreadManager.starNewtWorkerThread = jest.fn().mockReturnValueOnce(mockWorkerThreadManager);
            let messageObj ={
                message : 'query',
                statement : 'test',
                valuesArray : null
            }
            workerThreadManager.sendMessageToWorker = jest.fn().mockReturnValueOnce(messageObj);

            //Act
            sessionExpiredInspector.resolveRemoveExpiredSessions();

            //Assert
            expect( reducerServices.getCurrentStateByProperty ).toBeCalledTimes(1);
            expect( reducerServices.dispatch ).toBeCalledTimes(0);
            expect( workerThreadManager.starNewtWorkerThread ).toBeCalledTimes(0);
            expect(workerThreadManager.sendMessageToWorker).toBeCalledTimes(0);
        });

        test('When StoreInspector Property is FALSE, the worker threads WILL BE CALLED', function(){
            //Arrange
            let mockDataStoreInspectorProperty = false;
            reducerServices.getCurrentStateByProperty = jest.fn().mockReturnValueOnce(mockDataStoreInspectorProperty);
            reducerServices.dispatch = jest.fn().mockReturnValueOnce(true);
            let mockWorkerThreadManager = 'ok'
            workerThreadManager.starNewtWorkerThread = jest.fn().mockReturnValueOnce(mockWorkerThreadManager);
            let messageObj ={
                message : 'query',
                statement : 'test',
                valuesArray : null
            }
            workerThreadManager.sendMessageToWorker = jest.fn().mockReturnValueOnce(messageObj);

            //Act
            sessionExpiredInspector.resolveRemoveExpiredSessions();

            //Assert
            expect( reducerServices.getCurrentStateByProperty ).toBeCalledTimes(1);
            expect( reducerServices.dispatch ).toBeCalledTimes(2);
            expect( workerThreadManager.starNewtWorkerThread ).toBeCalledTimes(1);
            expect(workerThreadManager.sendMessageToWorker).toBeCalledTimes(0);
        });

        test('When StoreInspector Property is NULL, the worker threads WILL BE CALLED', function(){
            //Arrange
            let mockDataStoreInspectorProperty = null;
            reducerServices.getCurrentStateByProperty = jest.fn().mockReturnValueOnce(mockDataStoreInspectorProperty);
            reducerServices.dispatch = jest.fn().mockReturnValueOnce(true);
            let mockWorkerThreadManager = 'ok'
            workerThreadManager.starNewtWorkerThread = jest.fn().mockReturnValueOnce(mockWorkerThreadManager);
            let messageObj ={
                message : 'query',
                statement : 'test',
                valuesArray : null
            }
            workerThreadManager.sendMessageToWorker = jest.fn().mockReturnValueOnce(messageObj);

            //Act
            sessionExpiredInspector.resolveRemoveExpiredSessions();

            //Assert
            expect( reducerServices.getCurrentStateByProperty ).toBeCalledTimes(1);
            expect( reducerServices.dispatch ).toBeCalledTimes(2);
            expect( workerThreadManager.starNewtWorkerThread ).toBeCalledTimes(1);
            expect(workerThreadManager.sendMessageToWorker).toBeCalledTimes(0);
        });

        test('When StoreInspector Property is STRING, the worker threads WILL BE NOT CALLED', function(){
            //Arrange
            let mockDataStoreInspectorProperty = 'null';
            reducerServices.getCurrentStateByProperty = jest.fn().mockReturnValueOnce(mockDataStoreInspectorProperty);
            reducerServices.dispatch = jest.fn().mockReturnValueOnce(true);
            let mockWorkerThreadManager = 'ok'
            workerThreadManager.starNewtWorkerThread = jest.fn().mockReturnValueOnce(mockWorkerThreadManager);
            let messageObj ={
                message : 'query',
                statement : 'test',
                valuesArray : null
            }
            workerThreadManager.sendMessageToWorker = jest.fn().mockReturnValueOnce(messageObj);

            //Act
            sessionExpiredInspector.resolveRemoveExpiredSessions();

            //Assert
            expect( reducerServices.getCurrentStateByProperty ).toBeCalledTimes(1);
            expect( reducerServices.dispatch ).toBeCalledTimes(0);
            expect( workerThreadManager.starNewtWorkerThread ).toBeCalledTimes(0);
            expect(workerThreadManager.sendMessageToWorker).toBeCalledTimes(0);
        });
    });
});