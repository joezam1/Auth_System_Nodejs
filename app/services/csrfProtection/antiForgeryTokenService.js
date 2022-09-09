const CSRFToken = require('csrf');
const TokenValidator = require('token-validator');
const antiForgeryTokenConfig = require('../../../configuration/csrfProtection/antiForgeryTokenConfig.js');
const tokenDuration = require('../../library/enumerations/tokenDuration.js');
const antiforgeryTokenHelper = require('./antiForgeryTokenHelper.js');

const antiforgeryTokenService = (function(){

    let _csrfToken = null;
    let _tokenValidator = null;
    let _nonExpiringTokenSecret = null;
    let _expiringTokenCryptoKey = null;
    let _enabledTokenType = null;

    //Test: DONE
    const createAntiForgeryTokenAsync = async function( utcTimestamp = null ){
        //NOTE: The static Date.now() method returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
        _enabledTokenType = antiForgeryTokenConfig.ANTIFORGERY_TOKEN_ACTIVATED;
        let promise = new Promise(function(resolve, reject){
            try{
                let _token = null;
                switch(_enabledTokenType){
                    case tokenDuration.expiringToken:
                        let selectedUtcTimestamp = (utcTimestamp === null) ? Date.now() : utcTimestamp;
                        _token = _tokenValidator.generate(selectedUtcTimestamp , _expiringTokenCryptoKey );
                        resolve(_token);
                    break;

                    case tokenDuration.nonExpiringToken:
                        _token = _csrfToken.create(_nonExpiringTokenSecret)
                        resolve(_token);
                    break;
                }
            }
            catch(error){
                reject(error);
            }
        });
        let csrfToken = await promise;
        return csrfToken;
    }

    //Test: DONE
    const verifyAntiForgeryTokenIsValidAsync = async function( antiforgeryToken , utcTimestamp = null){
        _enabledTokenType = antiForgeryTokenConfig.ANTIFORGERY_TOKEN_ACTIVATED;
        let promise = new Promise(function(resolve, reject){
            try{
                let tokenIsValid = false;
                switch( _enabledTokenType ){
                    case tokenDuration.expiringToken:
                        let selectedUtcTimestamp = (utcTimestamp === null) ? Date.now() : utcTimestamp;
                        tokenIsValid = _tokenValidator.verify( selectedUtcTimestamp , _expiringTokenCryptoKey , antiforgeryToken );
                        resolve(tokenIsValid);
                    break;

                    case tokenDuration.nonExpiringToken:
                        tokenIsValid = _csrfToken.verify( _nonExpiringTokenSecret , antiforgeryToken );
                        resolve(tokenIsValid);
                    break;
                }
            }
            catch(error){
                reject(error);
            }
        });
        let resultValidation = await promise;
        return resultValidation
    }
    //Test: DONE
    const resolveAntiForgeryTokenValidationAsync = async function(authViewModel){

        let errorMessage= new Error('csrfToken is invalid');
        let antiforgeryTokenClient = authViewModel.csrfTokenClient.fieldValue;
        let antiforgeryToken = authViewModel.csrfToken.fieldValue;
        let verifiedTokenClient = await verifyAntiForgeryTokenIsValidAsync(antiforgeryTokenClient);
        let verifiedToken = await verifyAntiForgeryTokenIsValidAsync(antiforgeryToken);

        if(!verifiedTokenClient || !verifiedToken){
           return errorMessage;
        }

        let index = antiforgeryTokenHelper.getIndexOfCurrentCsrfTokenSavedInDataStore(antiforgeryToken);
        if(index < 0){
            return errorMessage;
        }
        let incomingData = {
            referer : authViewModel.referer.fieldValue,
            origin: authViewModel.origin.fieldValue,
            userAgent: authViewModel.userAgent.fieldValue
        }
        let tokenData = antiforgeryTokenHelper.getCurrentCsrfTokenSavedInDataStoreByIndex(index);
        let incomingDataIsValid = antiforgeryTokenHelper.isValidIncomingCsrfData(tokenData , incomingData);
        if(!incomingDataIsValid){
            return errorMessage;
        }

        let newCsrfToken = await createAntiForgeryTokenAsync();
        antiforgeryTokenHelper.updateCsrfTokenDataStorage( index, newCsrfToken );

        return newCsrfToken;
    }

    //#REGION Private Functions

    function onInit(){
        console.log('AntiforgeryTokenConfiguration: ', antiForgeryTokenConfig);
        _csrfToken = new CSRFToken();

        _nonExpiringTokenSecret = antiForgeryTokenConfig.NON_EXPIRING_ANTIFORGERY_TOKEN_SECRET;
        _expiringTokenCryptoKey = antiForgeryTokenConfig.EXPIRING_ANTIFORGERY_TOKEN_CRYPTO_KEY;
        let expiringTokenSecret = antiForgeryTokenConfig.EXPIRING_ANTIFORGERY_TOKEN_SECRET;
        var expiringTokenDuration = antiForgeryTokenConfig.EXPIRING_ANTIFORGERY_TOKEN_ACTIVE_TIME_IN_MILLISECONDS;
        var expiringTokenHashLength = antiForgeryTokenConfig.EXPIRING_ANTIFORGERY_TOKEN_HASH_LENGTH;
        _tokenValidator = new TokenValidator(expiringTokenSecret, expiringTokenDuration, expiringTokenHashLength);
    }

    //#ENDREGION Private Functions


    function constructor(){
        onInit();
        return Object.freeze({
            createAntiForgeryTokenAsync : createAntiForgeryTokenAsync,
            verifyAntiForgeryTokenIsValidAsync : verifyAntiForgeryTokenIsValidAsync,
            resolveAntiForgeryTokenValidationAsync : resolveAntiForgeryTokenValidationAsync
        });
    }

    return constructor();

})();

module.exports = antiforgeryTokenService;
