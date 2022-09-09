const inputCommonInspector = require('../validation/inputCommonInspector.js');

//Test: DONE
function getOriginalDataStore(originalDataStoreObj){
    let dataStoreCopy = Object.assign({}, originalDataStoreObj);
    return dataStoreCopy;
}

//Test: DONE
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

//Test:DONE
function addCsrfTokenToArray(tokenData , csrfTokensArray){
    let csrfTokensArrayCopy = JSON.parse(JSON.stringify(csrfTokensArray));
    let tokenFound = csrfTokensArrayCopy.find((tokenObj)=>{
        return (tokenObj.csrfToken === tokenData.csrfToken);
    })

    if(!inputCommonInspector.inputExist(tokenFound)){
        csrfTokensArrayCopy.push(tokenData);
    }

    return csrfTokensArrayCopy;
}

//Test: DONE
function updateCsrfTokenInArray(index, newCsrfToken , csrfTokensArray){
    let csrfTokensArrayCopy = JSON.parse(JSON.stringify(csrfTokensArray));
    if(index > 0 && index < csrfTokensArrayCopy.length){
        csrfTokensArrayCopy[index].csrfToken = newCsrfToken;
    }

    return csrfTokensArrayCopy;
}

//Test: DONE
function removeSingleCsrfTokenDataFromArray( csrfTokenForDeletion , csrfTokensArray){
    let csrfTokensArrayCopy = JSON.parse(JSON.stringify(csrfTokensArray));
    for(let a = 0; a < csrfTokensArrayCopy.length; a++){
        if(csrfTokensArrayCopy[a].csrfToken === csrfTokenForDeletion)
        {
            csrfTokensArrayCopy.splice(a,1);
            break;
        }
    }

    return csrfTokensArrayCopy;
}

//Test: DONE
function removeAllSelectedCsrfTokensFromArray(tokensForDeletionArray , csrfTokensArray){
    let csrfTokensArrayCopy = JSON.parse(JSON.stringify(csrfTokensArray));

    for(let a = 0; a< tokensForDeletionArray.length; a++){
        for(let b = csrfTokensArrayCopy.length -1; b>=0; b--){
            if(csrfTokensArrayCopy[b].csrfToken === tokensForDeletionArray[a]){
                csrfTokensArrayCopy.splice(b, 1);
                break;
            }
        }
    }
    return csrfTokensArrayCopy;
}

//Test: DONE
function removeAllDuplicateElementsFromNewestArray( originalArray, newestArray ){

    let originalArrayCopy = JSON.parse(JSON.stringify(originalArray));
    let newestArrayCopy = JSON.parse(JSON.stringify(newestArray));
    let newestUniqueItemsArray = [];
    for(let a= 0 ; a<newestArrayCopy.length; a++){
        let isUnique = true;
        for(let b = 0; b< originalArrayCopy.length; b++){
            if(newestArrayCopy[a].csrfToken === originalArrayCopy[b].csrfToken){
                newestArrayCopy.splice(a,1);
                originalArrayCopy.splice(b, 1);
                a--;
                isUnique = false;
                break;
            }
        }
        if(isUnique){
            newestUniqueItemsArray.push(newestArrayCopy[a]);
        }
    }
    return newestUniqueItemsArray;
}

//Test: DONE
function mergeTwoArraysAndCreateSingleArrayWithUniqueElements( initialArray, aditionsArray){

    let initialArrayCopy = JSON.parse(JSON.stringify(initialArray));
    let newestArrayCopy = JSON.parse(JSON.stringify(aditionsArray));
    let uniqueElementsFromNewestArray = removeAllDuplicateElementsFromNewestArray(initialArrayCopy , newestArrayCopy );
    var updatedArray = initialArray.concat(uniqueElementsFromNewestArray);

    return updatedArray;
}



const service = Object.freeze({

    getOriginalDataStore : getOriginalDataStore,
    getUpdatedDataStore : getUpdatedDataStore,
    addCsrfTokenToArray : addCsrfTokenToArray,
    updateCsrfTokenInArray : updateCsrfTokenInArray,
    removeSingleCsrfTokenDataFromArray : removeSingleCsrfTokenDataFromArray,
    removeAllSelectedCsrfTokensFromArray : removeAllSelectedCsrfTokensFromArray,
    removeAllDuplicateElementsFromNewestArray : removeAllDuplicateElementsFromNewestArray,
    mergeTwoArraysAndCreateSingleArrayWithUniqueElements : mergeTwoArraysAndCreateSingleArrayWithUniqueElements


});

module.exports = service;