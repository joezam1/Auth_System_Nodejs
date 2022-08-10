

const executeSend =function(response, status, resultObj){

    let resultJson = JSON.stringify( resultObj );
    response.status(status).send(resultJson);
}

const service = Object.freeze({
    executeSend : executeSend
});



module.exports = service;