const reducerServiceAction = Object.freeze({
    startSessionInspector : 0,
    stopSessionInspector : 1,
    updateCleanupIntervalId:2,
    startJwtInspector:3,
    stopJwtInspector:4,
    updateJwtRemovalIntervalId:5,
    0:'startSessionInspector',
    1:'stopSessionInspector',
    2:'updateCleanupIntervalId',
    3:'startJwtInspector',
    4:'stopJwtInspector',
    5:'updateJwtRemovalIntervalId'
});

module.exports = reducerServiceAction;