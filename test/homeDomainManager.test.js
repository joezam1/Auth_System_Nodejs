const homeDomainManager = require('../app/domainLayer/domainManagers/homeDomainManager.js');
const antiForgeryTokenExpiredInspector = require('../app/middleware/antiForgeryTokenExpiredInspector.js');
const antiForgeryTokenService = require('../app/services/csrfProtection/antiForgeryTokenService.js');
const antiForgeryTokenHelper = require('../app/services/csrfProtection/antiForgeryTokenHelper.js');



jest.mock('../app/middleware/antiForgeryTokenExpiredInspector.js');
jest.mock('../app/services/csrfProtection/antiForgeryTokenService.js');
jest.mock('../app/services/csrfProtection/antiForgeryTokenHelper.js');

describe('File: homeDomainManager.js', function(){

    describe('Function: resolveGetResourcesAsync', function(){
        test('CAN resolve Get Resources Async', async function(){

            //Arrange

            let request = {
                headers:{
                    referer: 'abc',
                    origin:'abc',
                    'user-agent':'abc'
                }
            }
            let tokenValue = 15;
            antiForgeryTokenService.createAntiForgeryTokenAsync = jest.fn().mockResolvedValue(tokenValue);
            antiForgeryTokenHelper.saveCsrfTokenDataToStorage = jest.fn();
            antiForgeryTokenExpiredInspector.resolveRemoveExpiredTokens = jest.fn();
            //Act
            let resultTest = await homeDomainManager.resolveGetResourcesAsync(request);

            //Assert
            expect(resultTest.result).toEqual(tokenValue);
            expect(antiForgeryTokenService.createAntiForgeryTokenAsync).toHaveBeenCalledTimes(1);
            expect(antiForgeryTokenHelper.saveCsrfTokenDataToStorage ).toHaveBeenCalledTimes(1);
            expect(antiForgeryTokenExpiredInspector.resolveRemoveExpiredTokens).toHaveBeenCalledTimes(1);
        });
    })
});
