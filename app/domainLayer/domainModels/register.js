
const register = function () {
    let _registerId = '';
    let _userId = '';
    let _isActive = false


    let setRegisterId = function(registerId){
        _registerId = registerId;
    }

    let setUserId= function(userId){
        _userId = userId;
    }

    let setRegisterIsActive = function(status){
        _isActive = status;
    }


    let getRegisterId = function(){
        return _registerId;
    }

    let getUserId = function(){
        return _userId;
    }


    let getRegisterStatusIsActive = function(){
        return _isActive;
    }

    let getRegisterDetails = function(){
        return {
            registerId : getRegisterId(),
            userId : getUserId(),
            isActive : getRegisterStatusIsActive()
        }
    }
    return Object.freeze({
        setRegisterId : setRegisterId,
        setUserId : setUserId,
        setRegisterIsActive : setRegisterIsActive,
        getRegisterId : getRegisterId,
        getUserId : getUserId,
        getRegisterStatusIsActive : getRegisterStatusIsActive,
        getRegisterDetails : getRegisterDetails

    });

}

module.exports = register;