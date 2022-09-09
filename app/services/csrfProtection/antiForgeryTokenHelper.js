const sessionService = require('../authentication/sessionService.js');
const reducerServiceAction = require('../../library/enumerations/reducerServiceAction.js');
const reducerService = require('../inMemoryStorage/reducerService.js');
const antiForgeryTokenConfig = require('../../../configuration/csrfProtection/antiForgeryTokenConfig.js');
const inputCommonInspector = require('../validation/inputCommonInspector.js');

const DATASTORAGE_PROPERTY = 'antiforgeryTokens';

//Test: DONE
const saveCsrfTokenDataToStorage = function(referer ,origin , userAgent, csrfToken){
    let localeDateNow = new Date();
    let localeExpiryDate = getCalculatedCsrfTokenLocaleExpiryDate(localeDateNow);
    let utcExpiryDate = localeExpiryDate.toISOString();
    let payload = {
        csrfTokenData: {
            referer: referer,
            origin : origin,
            userAgent : userAgent,
            csrfToken : csrfToken,
            utcDateExpired : utcExpiryDate
        }
    }

    let action = { type: reducerServiceAction.addDataToAntiforgeryTokensArray };
    let result = reducerService.dispatch(payload, action);
    console.log('reducerService-dispatch-result', result);
    return result;
}
//Test: DONE
const getIndexOfCurrentCsrfTokenSavedInDataStore = function(antiforgeryToken){
    let currentTokenArray = reducerService.getCurrentStateByProperty( DATASTORAGE_PROPERTY );
    for(let a = 0; a< currentTokenArray.length; a++){
        if (currentTokenArray[a].csrfToken === antiforgeryToken){
            return a;
        }
    }
    return -1;
}
//Test: DONE
const getCurrentCsrfTokenSavedInDataStoreByIndex = function(index){
    let currentTokenArray = reducerService.getCurrentStateByProperty( DATASTORAGE_PROPERTY );
    if(index >=0 && index <currentTokenArray.length){
        return currentTokenArray[index];
    }
    return null;
}
//Test: DONE
const isValidIncomingCsrfData = function( tokenDataStore , requestData ){
    let referersAreEqual = inputCommonInspector.inputExist(tokenDataStore.referer) ? (tokenDataStore.referer === requestData.referer) : true;
    let originsAreEqual = (tokenDataStore.origin === requestData.origin);
    let userAgentsAreEqual = (tokenDataStore.userAgent === requestData.userAgent);
    if(referersAreEqual && originsAreEqual && userAgentsAreEqual){
        return true;
    }
    return false;
}
//Test: DONE
const updateCsrfTokenDataStorage = function(index, selectedToken){
    let payload = {
        index: index,
        newCsrfToken : selectedToken
    }
    let action = { type: reducerServiceAction.updateDataInAntiforgeryTokensArray };
    let result = reducerService.dispatch(payload, action);
    console.log('reducerService-dispatch-result', result);
    return result;
}
//Test: DONE
const removeCsrfTokenFromDataStorage = function(csrfToken){
    let payload = {
        csrfToken: csrfToken
    }
    let action = { type: reducerServiceAction.removeDataFromAntiforgeryTokensArray };
    let result = reducerService.dispatch(payload, action);
    console.log('reducerService-dispatch-result', result);
    return result;
}

const service = Object.freeze({
    saveCsrfTokenDataToStorage : saveCsrfTokenDataToStorage,
    getIndexOfCurrentCsrfTokenSavedInDataStore : getIndexOfCurrentCsrfTokenSavedInDataStore,
    getCurrentCsrfTokenSavedInDataStoreByIndex : getCurrentCsrfTokenSavedInDataStoreByIndex,
    isValidIncomingCsrfData : isValidIncomingCsrfData,
    updateCsrfTokenDataStorage : updateCsrfTokenDataStorage,
    removeCsrfTokenFromDataStorage : removeCsrfTokenFromDataStorage
});


module.exports = service;

//#REGION Private Functions

function getCalculatedCsrfTokenLocaleExpiryDate(localeDateNowAsDate){
    let expiryInMilliseconds = antiForgeryTokenConfig.ANTIFORGERY_TOKEN_TERMINATION_TIME_IN_MILLISECONDS;
    let localeDateExpiry = sessionService.calculateSessionDateExpiry(localeDateNowAsDate, expiryInMilliseconds);

    return localeDateExpiry;
}

//#ENDREGION Private Functions
