const inMemoryDataStore = require('./inMemoryDataStore.js');
const inputCommonInspector = require('../validation/inputCommonInspector.js');
const inputTypeInspector = require('../validation/inputTypeInspector.js');
const reducerServiceActions = require('../../library/enumerations/reducerServiceActions.js');

function reducerService(payloadObj, action){
    let originalDataStore = inMemoryDataStore.getDataStore();
    let newDataStore ={};
    switch(action.type){
        case reducerServiceActions.startSessionInspector:
        case reducerServiceActions.stopSessionInspector:
            newDataStore = getUpdatedDataStore(payloadObj, originalDataStore);

        case reducerServiceActions.updateCleanupIntervalId:
            if(inputCommonInspector.objectIsValid(payloadObj._expiredSessionCleanupIntervalId)){
                newDataStore = getUpdatedDataStore(payloadObj , originalDataStore);
            }
        break;
    }
    inMemoryDataStore.updateDataStore(newDataStore);
    return newDataStore;
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

let dispatch = function(payload, action){
    let newInMemoryDataStore = reducerService(payload, action);
    return newInMemoryDataStore;
}

let getCurrentStateByProperty = function(property){
    let currentDataStore = inMemoryDataStore.getDataStore();
    let propertyValue =  currentDataStore[property];
    return propertyValue;
}

const service = {
    dispatch : dispatch,
    getCurrentStateByProperty : getCurrentStateByProperty

}
module.exports = service;