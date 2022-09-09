const reducerServiceAction = Object.freeze({
    setStateSessionInspector : 0,
    updateCleanupIntervalId:1,
    setStateJwtInspector:2,
    updateJwtRemovalIntervalId:3,
    addDataToAntiforgeryTokensArray:4,
    updateDataInAntiforgeryTokensArray:5,
    removeDataFromAntiforgeryTokensArray:6,
    setExpiredTokensInspectorStatus:7,
    removeAllExpiredAntiForgeryTokensFromArray:8,
    0:'setStateSessionInspector',
    1:'updateCleanupIntervalId',
    2:'setStateJwtInspector',
    3:'updateJwtRemovalIntervalId',
    4:'addDataToAntiforgeryTokensArray',
    5:'updateDataInAntiforgeryTokensArray',
    6:'removeDataFromAntiforgeryTokensArray',
    7:'setExpiredTokensInspectorStatus',
    8:'removeAllExpiredAntiForgeryTokensFromArray'
});

module.exports = reducerServiceAction;