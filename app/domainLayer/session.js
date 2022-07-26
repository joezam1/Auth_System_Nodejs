
var sessionBusinessModel = function () {
    let _sessionId = '';
    let _userId = '';
    let _sessionToken = '';
    let _expires = '';
    let _data = '';
    let _isActive = false;


    let setSessionId = function(sessionId){
        _sessionId = sessionId;
    }

    let setUserId = function(userId){
        _userId = userId;
    }

    let setSessionToken = function(sessionToken){
        _sessionToken = sessionToken;
    }

    let setExpiryInMilliseconds = function(expiryMilliseconds){
        _expires = expiryMilliseconds;
    }

    let setData = function(data){
        _data = data;
    }

    let setSessionStatusIsActive = function(status){
        _isActive = status;
    }

    let getSessionId = function(){
        return _sessionId;
    }

    let getUserId = function(){
        return _userId;
    }

    let getSessionToken = function(){
        return _sessionToken;
    }

    let getExpiryInMilliseconds = function(){
        return _expires;
    }

    let getData = function(){
        return _data;
    }

    let getSessionStatusIsActive = function(){
        return _isActive;
    }

    let getSessionDetails = function(){
        return {
            sessionId : getSessionId(),
            userId : getUserId(),
            sessionToken : getSessionToken(),
            expires : getExpiryInMilliseconds(),
            data : getData(),
            isActive : getSessionStatusIsActive()
        }
    }
    let service = {
        setSessionId : setSessionId,
        setUserId : setUserId,
        setSessionToken : setSessionToken,
        setExpiryInMilliseconds : setExpiryInMilliseconds,
        setData : setData,
        setSessionStatusIsActive : setSessionStatusIsActive,

        getSessionId : getSessionId,
        getUserId : getUserId,
        getSessionToken : getSessionToken,
        getExpiryInMilliseconds : getExpiryInMilliseconds,
        getData : getData,
        getSessionStatusIsActive : getSessionStatusIsActive,
        getSessionDetails : getSessionDetails

    }
    return service
}

module.exports = sessionBusinessModel;