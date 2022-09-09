const inMemoryDataStore = require('./inMemoryDataStore.js');
const inputCommonInspector = require('../validation/inputCommonInspector.js');
const reducerServiceAction = require('../../library/enumerations/reducerServiceAction.js');
const reducerServiceHelper = require('./reducerServiceHelper.js');


function reducerService(payloadObj, action){
    let originalDataStore = inMemoryDataStore.getDataStore();
    let csrfTokensArray = [];
    let newDataStore ={};
    let updatedObj= {};
    switch(action.type){
        case reducerServiceAction.setStateSessionInspector:
            newDataStore = reducerServiceHelper.getUpdatedDataStore(payloadObj, originalDataStore);
        break;

        case reducerServiceAction.updateCleanupIntervalId:
            if(inputCommonInspector.inputExist(payloadObj._expiredSessionCleanupIntervalId)){
                newDataStore = reducerServiceHelper.getUpdatedDataStore(payloadObj , originalDataStore);
                break;
            }
            newDataStore = reducerServiceHelper.getOriginalDataStore(originalDataStore);
        break;

        case reducerServiceAction.setStateJwtInspector:
            newDataStore = reducerServiceHelper.getUpdatedDataStore(payloadObj, originalDataStore);
        break;

        case reducerServiceAction.updateJwtRemovalIntervalId:
            if(inputCommonInspector.inputExist(payloadObj._expiredJwtCleanupIntervalId)){
                newDataStore = reducerServiceHelper.getUpdatedDataStore(payloadObj , originalDataStore);
                break;
            }
            newDataStore = reducerServiceHelper.getOriginalDataStore(originalDataStore);
        break;

        case reducerServiceAction.addDataToAntiforgeryTokensArray:
            csrfTokensArray = getCurrentStateByProperty('antiforgeryTokens');
            updatedObj= {};
            updatedObj.antiforgeryTokens = reducerServiceHelper.addCsrfTokenToArray(payloadObj.csrfTokenData , csrfTokensArray);
            newDataStore = reducerServiceHelper.getUpdatedDataStore(updatedObj , originalDataStore);

        break;

        case reducerServiceAction.updateDataInAntiforgeryTokensArray:
            csrfTokensArray = getCurrentStateByProperty('antiforgeryTokens');
            updatedObj= {};
            updatedObj.antiforgeryTokens = reducerServiceHelper.updateCsrfTokenInArray( payloadObj.index, payloadObj.newCsrfToken, csrfTokensArray );
            newDataStore = reducerServiceHelper.getUpdatedDataStore(updatedObj , originalDataStore);

        break;

        case reducerServiceAction.removeDataFromAntiforgeryTokensArray:
            csrfTokensArray = getCurrentStateByProperty('antiforgeryTokens');
            updatedObj= {};
            updatedObj.antiforgeryTokens = reducerServiceHelper.removeSingleCsrfTokenDataFromArray( payloadObj.csrfToken , csrfTokensArray);
            newDataStore = reducerServiceHelper.getUpdatedDataStore( updatedObj , originalDataStore );

        break;

        case reducerServiceAction.setExpiredTokensInspectorStatus:
            newDataStore = reducerServiceHelper.getUpdatedDataStore(payloadObj, originalDataStore);
        break;

        case reducerServiceAction.removeAllExpiredAntiForgeryTokensFromArray:
            csrfTokensArray = getCurrentStateByProperty('antiforgeryTokens');
            let activeTokensArray = reducerServiceHelper.removeAllSelectedCsrfTokensFromArray(payloadObj.tokensForDeletion , csrfTokensArray);
            let newestTokenArray = getCurrentStateByProperty('antiforgeryTokens');
            let latestTokenAdditionsArray = reducerServiceHelper.removeAllDuplicateElementsFromNewestArray( csrfTokensArray , newestTokenArray);
            let _updatedArray = reducerServiceHelper.mergeTwoArraysAndCreateSingleArrayWithUniqueElements(activeTokensArray, latestTokenAdditionsArray);
            updatedObj = { antiforgeryTokens : _updatedArray };
            newDataStore = reducerServiceHelper.getUpdatedDataStore( updatedObj , originalDataStore );
        break;
    }
    inMemoryDataStore.updateDataStore(newDataStore);
    return newDataStore;
}

//test: DONE
const dispatch = function(payload, action){
    let newInMemoryDataStore = reducerService(payload, action);
    return newInMemoryDataStore;
}

//test: DONE
const getCurrentStateByProperty = function(property){
    let currentDataStore = inMemoryDataStore.getDataStore();
    let propertyValue =  currentDataStore[property];
    return propertyValue;
}

const service = Object.freeze({
    dispatch : dispatch,
    getCurrentStateByProperty : getCurrentStateByProperty

});

module.exports = service;