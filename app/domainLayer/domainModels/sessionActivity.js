
const sessionActivity = function () {
    let _sessionActivityId = '';
    let _userId = '';
    let _geolocation = '';
    let _device = '';
    let _userAgent = '';

    let setSessionActivityId = function(sessionActivityId){
        _sessionActivityId = sessionActivityId;
    }

    let setUserId = function(userId){
        _userId = userId;
    }

    let setGeolocation = function(geolocation){
        _geolocation = geolocation;
    }

    let setDevice = function(device){
        _device = device;
    }

    let setUserAgent = function(userAgent){
        _userAgent = userAgent;
    }


    let getSessionActivityId = function(){
        return _sessionActivityId;
    }

    let getUserId = function(){
        return _userId;
    }

    let getGeolocation = function(){
        return _geolocation;
    }

    let getDevice = function(){
        return _device;
    }

    let getUserAgent = function(){
       return _userAgent;
    }

    let getSessionActivitiesDetails = function(){
        return {
            sessionActivityId : getSessionActivityId(),
            userId : getUserId(),
            geolocation : getGeolocation(),
            device : getDevice(),
            userAgent : getUserAgent(),
        }
    }

    return Object.freeze({
        setSessionActivityId : setSessionActivityId,
        setUserId : setUserId,
        setGeolocation : setGeolocation,
        setDevice : setDevice,
        setUserAgent : setUserAgent,
        getSessionActivityId : getSessionActivityId,
        getUserId : getUserId,
        getGeolocation : getGeolocation,
        getDevice : getDevice,
        getUserAgent : getUserAgent,
        getSessionActivitiesDetails : getSessionActivitiesDetails
    });

}

module.exports = sessionActivity;