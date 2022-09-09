const antiForgeryTokenExpiredInspector = require('../app/middleware/antiForgeryTokenExpiredInspector.js');
const expiredCsrfTokenManager = require('../app/backgroundWorkers/expiredCsrfTokenManager.js');
const reducerService = require('../app/services/inMemoryStorage/reducerService.js');
const antiForgeryTokenConfig = require('../configuration/csrfProtection/antiForgeryTokenConfig.js');

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');
jest.mock('../app/services/inMemoryStorage/reducerService.js');


describe('File: antiForgeryTokenExpiredInspector', function(){
    beforeEach(()=>{
        jest.resetAllMocks();
    });
    afterAll(()=>{
        jest.resetAllMocks();
    });

    describe('Function: resolveRemoveExpiredTokens', function(){
        test('When the Inspector is not started, then IT CAN execute the inspection', function(){
            //Arrange
            let mockValue = false;
            reducerService.getCurrentStateByProperty = jest.fn().mockReturnValueOnce(mockValue);
            reducerService.dispatch = jest.fn();
            //let mockArray = [];
            //reducerService.getCurrentStateByProperty = jest.fn().mockReturnValueOnce(mockArray);
            expiredCsrfTokenManager.createNewtWorkerThread = jest.fn();
            expiredCsrfTokenManager.sendMessageToWorker = jest.fn();
            expiredCsrfTokenManager.terminateActiveWorker = jest.fn();
            //Act
            antiForgeryTokenExpiredInspector.resolveRemoveExpiredTokens();
            //Assert
            expect(reducerService.getCurrentStateByProperty ).toHaveBeenCalledTimes(1);
            expect(setInterval).toHaveBeenCalledTimes(1);
            expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), antiForgeryTokenConfig.TERMINATED_ANTIFORGERY_TOKEN_CLEANUP_FREQUENCY_IN_MILLISECONDS);
        });

        test('When the Inspector is Started, then IT CANNOT execute the inspection', function(){
            //Arrange
            let mockValue = true;
            reducerService.getCurrentStateByProperty = jest.fn().mockReturnValueOnce(mockValue);
            reducerService.dispatch = jest.fn();

            expiredCsrfTokenManager.createNewtWorkerThread = jest.fn();
            expiredCsrfTokenManager.sendMessageToWorker = jest.fn();
            expiredCsrfTokenManager.terminateActiveWorker = jest.fn();
            //Act
            antiForgeryTokenExpiredInspector.resolveRemoveExpiredTokens();
            //Assert
            expect(reducerService.getCurrentStateByProperty ).toHaveBeenCalledTimes(1);
            expect(setInterval).toHaveBeenCalledTimes(0);

        });
    });
});
