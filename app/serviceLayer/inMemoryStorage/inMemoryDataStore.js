let dataStore = {
    _sessionInspectorIsActive: null,
    _expiredSessionCleanupIntervalId : null
}



function updateDataStore(_newInMemoryDataStore){
    dataStore = _newInMemoryDataStore
}

function getDataStore(){
    return dataStore;
}


const service = Object.freeze({
    updateDataStore : updateDataStore,
    getDataStore : getDataStore
});

module.exports = service;