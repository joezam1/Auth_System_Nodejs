const jsonWebTokenExpiredInspector = require('../app/middleware/jsonWebTokenExpiredInspector.js');
const reducerService  = require('../app/services/inMemoryStorage/reducerService.js');
const workerThreadManager = require('../app/backgroundWorkers/workerThreadManager.js');
const jwtConfig = require('../configuration/authorization/jwtConfig.js');

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');
jest.mock('../app/services/inMemoryStorage/reducerService.js');
jest.mock('../app/backgroundWorkers/workerThreadManager.js');

describe('File: jsonWebTokenExpiredInspector.js', function(){

    beforeEach(()=>{
        jest.resetAllMocks();
    });
    afterAll(()=>{
        jest.resetAllMocks();
    });
    describe('Function: resolveRemoveExpiredTokens', function(){
        test('When the "_JwtInspectorIsActive" property is set to NULL or FALSE, the Worker Thread is called', function(){
            //Arrange
            let mockPropertyIsActive = null;
            reducerService.getCurrentStateByProperty = jest.fn().mockReturnValueOnce(mockPropertyIsActive);
            reducerService.dispatch = jest.fn();
            workerThreadManager.starNewtWorkerThread = jest.fn();

            //Act
            jsonWebTokenExpiredInspector.resolveRemoveExpiredTokens();
            //Assert
            expect(reducerService.getCurrentStateByProperty).toHaveBeenCalledTimes(1);
            expect(reducerService.dispatch).toHaveBeenCalledTimes(2);
            expect(workerThreadManager.starNewtWorkerThread).toHaveBeenCalledTimes(1);
        });

        test('When the "_JwtInspectorIsActive" property is set to NULL or FALSE, the setInterval Function is called', function(){
            //Arrange
            let mockPropertyIsActive = false;
            reducerService.getCurrentStateByProperty = jest.fn().mockReturnValueOnce(mockPropertyIsActive);
            reducerService.dispatch = jest.fn();
            workerThreadManager.starNewtWorkerThread = jest.fn();

            //Act
            jsonWebTokenExpiredInspector.resolveRemoveExpiredTokens();
            //Assert
            expect(setInterval).toHaveBeenCalledTimes(1);
            expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), jwtConfig.EXPIRED_JWT_TOKEN_CLEANUP_FREQUENCY_IN_MILLISECONDS);
        });

        test('When the "_JwtInspectorIsActive" property is set to TRUE, the Worker Thread is NEVER called', function(){
            //Arrange
            let mockPropertyIsActive = true;
            reducerService.getCurrentStateByProperty = jest.fn().mockReturnValueOnce(mockPropertyIsActive);
            reducerService.dispatch = jest.fn();
            workerThreadManager.starNewtWorkerThread = jest.fn();

            //Act
            jsonWebTokenExpiredInspector.resolveRemoveExpiredTokens();
            //Assert
            expect(reducerService.getCurrentStateByProperty).toHaveBeenCalledTimes(1);
            expect(reducerService.dispatch).toHaveBeenCalledTimes(0);
            expect(workerThreadManager.starNewtWorkerThread).toHaveBeenCalledTimes(0);
            expect(setInterval).toHaveBeenCalledTimes(0);
        });
    });
});