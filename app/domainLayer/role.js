
var role = function () {
    let _roleId = '';
    let _name = '';
    let _description = '';
    let _isActive = false


    let setRoleId = function(roleId){
        _roleId = roleId;
    }

    let setName= function(name){
        _name = name;
    }

    let setDescription = function(description){
        _description = description;
    }

    let setRpleIsActive = function(status){
        _isActive = status;
    }

    let getRoleId = function(){
        return _roleId;
    }

    let getName = function(){
        return _name;
    }

    let getDescription = function(){
        return _description;
    }

    let getRoleStatusIsActive = function(){
        return _isActive;
    }


    let getRoleDetails = function(){
        return {
            roleId : getRoleId(),
            name : getName(),
            description : getDescription(),
            isActive : getRoleStatusIsActive()
        }
    }
    let service = {
        setRoleId : setRoleId,
        setName : setName,
        setDescription : setDescription,
        setRpleIsActive : setRpleIsActive,
        getRoleId : getRoleId,
        getName : getName,
        getDescription : getDescription,
        getRoleStatusIsActive : getRoleStatusIsActive,
        getRoleDetails : getRoleDetails
    }
    return service
}

module.exports = role;