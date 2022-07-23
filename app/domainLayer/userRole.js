
let userRole = function () {
    let _userRoleId = '';
    let _userId = '';
    let _roleId = '';

    let setUserRoleId= function(userRoleId){
        _userRoleId = userRoleId;
    }

    let setUserId = function(userId){
        _userId = userId;
    }

    let setRoleId = function(roleId){
        _roleId = roleId;
    }

    let getUserRoleId = function(){
        return _userRoleId;
    }

    let getUserId = function(){
        return _userId;
    }

    let getRoleId = function(){
        return _roleId;
    }

    let getUserRoleDetails = function(){
        return {
            userRoleId : getUserRoleId(),
            userId : getUserId(),
            roleId : getRoleId(),
        }
    }

    let service = {
        setUserRoleId : setUserRoleId,
        setUserId : setUserId,
        setRoleId : setRoleId,
        getUserRoleId : getUserRoleId,
        getUserId : getUserId,
        getRoleId : getRoleId,
        getUserRoleDetails : getUserRoleDetails
    }

    return service
}

module.exports = userRole;