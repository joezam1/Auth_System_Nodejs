const jsonWebTokenExpiredInspector = require('../app/middleware/jsonWebTokenExpiredInspector.js');
const reducerService  = require('../app/services/inMemoryStorage/reducerService.js');
const jwtTokenThreadManager = require('../app/backgroundWorkers/jwtTokenThreadManager.js');
const jwtConfig = require('../configuration/authorization/jwtConfig.js');

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');
jest.mock('../app/services/inMemoryStorage/reducerService.js');
jest.mock('../app/backgroundWorkers/jwtTokenThreadManager.js');

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
            jwtTokenThreadManager.createNewtWorkerThread = jest.fn();

            //Act
            jsonWebTokenExpiredInspector.resolveRemoveExpiredTokens();
            //Assert
            expect(reducerService.getCurrentStateByProperty).toHaveBeenCalledTimes(1);
            expect(reducerService.dispatch).toHaveBeenCalledTimes(2);
            expect(setInterval).toHaveBeenCalledTimes(1);
            expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), jwtConfig.EXPIRED_JWT_TOKEN_CLEANUP_FREQUENCY_IN_MILLISECONDS );

        });

        test('When the "_JwtInspectorIsActive" property is set to NULL or FALSE, the setInterval Function is called', function(){
            //Arrange
            let mockPropertyIsActive = false;
            reducerService.getCurrentStateByProperty = jest.fn().mockReturnValueOnce(mockPropertyIsActive);
            reducerService.dispatch = jest.fn();
            jwtTokenThreadManager.createNewtWorkerThread = jest.fn();

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
            jwtTokenThreadManager.createNewtWorkerThread  = jest.fn();

            //Act
            jsonWebTokenExpiredInspector.resolveRemoveExpiredTokens();
            //Assert
            expect(reducerService.getCurrentStateByProperty).toHaveBeenCalledTimes(1);
            expect(reducerService.dispatch).toHaveBeenCalledTimes(0);
            expect(jwtTokenThreadManager.createNewtWorkerThread).toHaveBeenCalledTimes(0);
            expect(setInterval).toHaveBeenCalledTimes(0);
        });
    });
});