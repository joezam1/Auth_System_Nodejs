
const token = function () {
    let _tokenId = '';
    let _userId = '';
    let _token = '';
    let _type = '';
    let _payload = '';
    let _isActive = false;


    let setTokenId = function( tokenId ){
        _tokenId = tokenId;
    }

    let setUserId = function(userId){
        _userId = userId;
    }

    let setToken = function(token){
        _token = token;
    }

    let setType = function(type){
        _type = type;
    }

    let setPayload = function(payload){
        _payload = payload;
    }

    let setTokenStatusIsActive = function(status){
        _isActive = status;
    }

    let getTokenId = function(){
        return _tokenId;
    }

    let getUserId = function(){
        return _userId;
    }

    let getToken = function(){
        return _token;
    }

    let getType = function(){
        return _type;
    }

    let getPayload = function(){
        return _payload;
    }

    let getTokenStatusIsActive = function(){
        return _isActive;
    }

    let getTokenDetails = function(){
        return {
            tokenId : getTokenId(),
            userId : getUserId(),
            token : getToken(),
            type : getType(),
            payload : getPayload(),
            isActive : getTokenStatusIsActive()
        }
    }
    return Object.freeze({
        setTokenId : setTokenId,
        setUserId : setUserId,
        setToken : setToken,
        setType : setType,
        setPayload : setPayload,
        setTokenStatusIsActive : setTokenStatusIsActive,

        getTokenId : getTokenId,
        getUserId : getUserId,
        getToken : getToken,
        getType : getType,
        getPayload : getPayload,
        getTokenStatusIsActive : getTokenStatusIsActive,
        getTokenDetails : getTokenDetails

    });

}

module.exports = token;