const antiforgeryTokenService = require('../app/services/csrfProtection/antiForgeryTokenService.js');
const antiforgeryTokenHelper = require('../app/services/csrfProtection/antiForgeryTokenHelper.js');
const authViewModel = require('../app/presentationLayer/viewModels/authViewModel.js');

jest.mock('../app/services/csrfProtection/antiForgeryTokenHelper.js');

describe('File antiForgeryTokenService.js', function(){

    beforeEach(()=>{
        jest.resetAllMocks();
    });
    afterAll(()=>{
        jest.resetAllMocks();
    });
    describe('Function: createAntiForgeryTokenAsync', function(){
        test('CAN create AntiForgery Token', async function(){
            //Arrange
            //Act
            let csrfExpiringToken = await antiforgeryTokenService.createAntiForgeryTokenAsync();
            let csrfExpiringTokenLength = csrfExpiringToken.length;
            //Assert
            expect(csrfExpiringTokenLength).not.toEqual(null);

        });


    });
    describe('Function: verifyAntiForgeryTokenIsValidAsync', function(){

        test('CAN Verify AntiForgery Token', async function(){
            //Arrange
            //Act
            let csrfToken = await antiforgeryTokenService.createAntiForgeryTokenAsync();
            let isValid = await antiforgeryTokenService.verifyAntiForgeryTokenIsValidAsync(csrfToken);
            //Assert
            expect(isValid).toEqual(true);

        });

    });

    describe('Function: resolveAntiForgeryTokenValidationAsync', function(){

        test('CAN resolve AntiForgery Token Validation', async function(){
            //Arrange
            let _csrfToken = await antiforgeryTokenService.createAntiForgeryTokenAsync();
            let isValid = await antiforgeryTokenService.verifyAntiForgeryTokenIsValidAsync(_csrfToken);
            let _csrfTokenClient = await antiforgeryTokenService.createAntiForgeryTokenAsync();

            let model = {
                csrfTokenClient : _csrfTokenClient,
                csrfToken : _csrfToken,
                referer : 'abc',
                origin: 'abc',
                userAgent: 'abc'
            }
            let newAuth = new authViewModel(model);
            antiforgeryTokenHelper.getIndexOfCurrentCsrfTokenSavedInDataStore = jest.fn().mockReturnValue(5);
            antiforgeryTokenHelper.getCurrentCsrfTokenSavedInDataStoreByIndex = jest.fn();
            antiforgeryTokenHelper.isValidIncomingCsrfData = jest.fn().mockReturnValue(true);
            antiforgeryTokenHelper.updateCsrfTokenDataStorage = jest.fn();
            //Act
            let result = await antiforgeryTokenService.resolveAntiForgeryTokenValidationAsync(newAuth);

            //Assert
            expect( antiforgeryTokenHelper.getIndexOfCurrentCsrfTokenSavedInDataStore ).toHaveBeenCalledTimes(1);
            expect( antiforgeryTokenHelper.getCurrentCsrfTokenSavedInDataStoreByIndex ).toHaveBeenCalledTimes(1);
            expect( antiforgeryTokenHelper.isValidIncomingCsrfData ).toHaveBeenCalledTimes(1);
            expect( antiforgeryTokenHelper.updateCsrfTokenDataStorage ).toHaveBeenCalledTimes(1);

        });
    });
});
