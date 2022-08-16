
const cookie = function(){
    let _name = '';
    let _value = '';
    let _properties = {
        path:'',
        maxAge : 0,
        httpOnly : true,
    }


    let setName = function(name){
        _name = name;
    }

    let setValue = function(value){
        _value = value;
    }

    let setProperties = function(path, maxAge, httpOnly){
        _properties.path = path;
        _properties.maxAge = maxAge;
        _properties.httpOnly = httpOnly
    }

    let getName = function(){
        return _name;
    }

    let getValue = function(){
        return _value;
    }

    let getProperties = function(){
        return _properties;
    }

    let getCookieObject = function(){
        return {
        name: getName(),
        value : getValue(),
        properties : getProperties()
    }
}

    return Object.freeze({
        setName : setName,
        setValue : setValue,
        setProperties : setProperties,
        getName : getName,
        getValue : getValue,
        getProperties : getProperties,
        getCookieObject : getCookieObject
    });


}

module.exports = cookie;