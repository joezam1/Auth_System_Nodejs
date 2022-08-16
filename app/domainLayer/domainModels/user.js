const inputCommonInspector = require('../../services/validation/inputCommonInspector.js');
const inputTypeInspector = require('../../services/validation/inputTypeInspector.js');

const user = function () {
    let _userId = '';
    let _firstName = '';
    let _middleName = '';
    let _lastName = '';
    let _username = '';
    let _email = '';
    let _password = '';
    let _isActive = false


    let setUserId = function(userId){
        _userId = userId;
    }

    let setFirstName= function(firstName){
        _firstName = firstName;
    }

    let setMiddleName= function(middleName){
        _middleName = middleName;
    }
    let setLastName= function(lastName){
        _lastName = lastName;
    }

    let setUsername = function(username){
        _username = username;
    }

    let setEmail = function(email){
        _email = email;
    }

    let setPassword = function(password){
        _password = password;
    }

    let setUserIsActive = function(status){
        _isActive = status;
    }

    let setUserDetails = function(userViewModel){
        if(inputTypeInspector.isTypeObject( userViewModel.firstName ) && !inputCommonInspector.objectIsNullOrEmpty(userViewModel.firstName )){
            setFirstName(userViewModel.firstName.fieldValue);
        }
        if(inputTypeInspector.isTypeObject( userViewModel.middleName ) && !inputCommonInspector.objectIsNullOrEmpty(userViewModel.middleName )){
            setMiddleName(userViewModel.middleName.fieldValue);
        }

        if(inputTypeInspector.isTypeObject( userViewModel.lastName ) && !inputCommonInspector.objectIsNullOrEmpty(userViewModel.lastName )){
            setLastName(userViewModel.lastName.fieldValue);
        }

        if(inputTypeInspector.isTypeObject( userViewModel.username ) && !inputCommonInspector.objectIsNullOrEmpty(userViewModel.username )){
            setUsername(userViewModel.username.fieldValue);
        }

        if(inputTypeInspector.isTypeObject( userViewModel.email ) && !inputCommonInspector.objectIsNullOrEmpty(userViewModel.email )){
            setEmail(userViewModel.email.fieldValue);
        }
        if(inputTypeInspector.isTypeObject( userViewModel.password ) && !inputCommonInspector.objectIsNullOrEmpty(userViewModel.password )){
            setPassword(userViewModel.password.fieldValue);
        }

        setUserIsActive(true);
    }

    let getUserId = function(){
        return _userId;
    }

    let getFirstName = function(){
        return _firstName;
    }

    let getMiddleName = function(){
        return _middleName;
    }

    let getLastName = function(){
        return _lastName;
    }

    let getUsername = function(){
        return _username;
    }

    let getEmail = function(){
        return _email;
    }

    let getPassword = function(){
        return _password;
    }

    let getUserStatusIsActive = function(){
        return _isActive;
    }

    let getUserDetails = function(){
        return {
            firstName:getFirstName(),
            middleName:getMiddleName(),
            lastName:getLastName(),
            username:getUsername(),
            emal:getEmail(),
            password:getPassword(),
            isActive: getUserStatusIsActive()
        }
    }
    return Object.freeze({
        setUserDetails : setUserDetails,
        getUserDetails : getUserDetails,
        setUserId : setUserId,
        setFirstName : setFirstName,
        setMiddleName : setMiddleName,
        setLastName : setLastName,
        setUsername : setUsername,
        setEmail : setEmail,
        setPassword : setPassword,
        setUserIsActive : setUserIsActive,
        getUserId : getUserId,
        getFirstName : getFirstName,
        getMiddleName : getMiddleName,
        getLastName : getLastName,
        getUsername : getUsername,
        getEmail : getEmail,
        getPassword : getPassword,
        getUserStatusIsActive : getUserStatusIsActive
    });
}

module.exports = user;