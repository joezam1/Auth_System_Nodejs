const inMemoryDataStore = require('./inMemoryDataStore.js');
const inputCommonInspector = require('../validation/inputCommonInspector.js');
const reducerServiceAction = require('../../library/enumerations/reducerServiceAction.js');

function reducerService(payloadObj, action){
    let originalDataStore = inMemoryDataStore.getDataStore();
    let newDataStore ={};
    switch(action.type){
        case reducerServiceAction.startSessionInspector:
        case reducerServiceAction.stopSessionInspector:
            newDataStore = getUpdatedDataStore(payloadObj, originalDataStore);
        break;

        case reducerServiceAction.updateCleanupIntervalId:
            if(inputCommonInspector.inputExist(payloadObj._expiredSessionCleanupIntervalId)){
                newDataStore = getUpdatedDataStore(payloadObj , originalDataStore);
                break;
            }
            newDataStore = getOriginalDataStore(originalDataStore);
            break;

        case reducerServiceAction.startJwtInspector:
        case reducerServiceAction.stopJwtInspector:
            newDataStore = getUpdatedDataStore(payloadObj, originalDataStore);
        break;

        case reducerServiceAction.updateJwtRemovalIntervalId:
            if(inputCommonInspector.inputExist(payloadObj._expiredJwtCleanupIntervalId)){
                newDataStore = getUpdatedDataStore(payloadObj , originalDataStore);
                break;
            }
            newDataStore = getOriginalDataStore(originalDataStore);
            break;

    }
    inMemoryDataStore.updateDataStore(newDataStore);
    return newDataStore;
}

function getOriginalDataStore(originalDataStoreObj){
    let dataStoreCopy = Object.assign({}, originalDataStoreObj);
    return dataStoreCopy;
}

function getUpdatedDataStore(temporaryStateObj, originalDataStoreObj){
    let newDataStore = Object.assign({}, originalDataStoreObj);
    if(inputCommonInspector.objectIsValid(temporaryStateObj)){
        for(let tempKey in temporaryStateObj){
            if(temporaryStateObj.hasOwnProperty(tempKey)){
                let existInDataStore = false;
                let newValue = temporaryStateObj[tempKey];
                for(let dataKey in newDataStore){
                    if(newDataStore.hasOwnProperty(dataKey)){
                        if(tempKey === dataKey){
                            newDataStore[dataKey] = newValue;
                            existInDataStore = true;
                            break;
                        }
                    }
                }
                if(!existInDataStore){
                    newDataStore[tempKey] = newValue;
                }
            }
        }
    }
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