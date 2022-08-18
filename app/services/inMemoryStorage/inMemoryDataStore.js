let dataStore = {
    _sessionInspectorIsActive: null,
    _expiredSessionCleanupIntervalId : null
}


//Test:DONE
const updateDataStore = function(_newInMemoryDataStore){
    dataStore = _newInMemoryDataStore
}
//Test:DONE
const getDataStore = function(){
    return dataStore;
}


const service = Object.freeze({
    updateDataStore : updateDataStore,
    getDataStore : getDataStore
});

module.exports = service;