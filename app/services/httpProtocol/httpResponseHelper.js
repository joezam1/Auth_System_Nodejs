

const setHeader = function(response, headerObj){

    response.set(headerObj.key, headerObj.value);
}


const setCookie = function(response, cookieObj){

    response.cookie(cookieObj.name, JSON.stringify(cookieObj.data), cookieObj.properties);
}

const executeSend = function(response, status, resultObj ){

    let resultJson = JSON.stringify( resultObj );
    response.status(status);
    response.send(resultJson);
}



const service = Object.freeze({
    setHeader : setHeader,
    setCookie : setCookie,
    executeSend : executeSend
});



module.exports = service;