
const jwt = require('jsonwebtoken');


const signJwtToken = function(payloadObject, secret , jwtCallback){

    jwt.sign(payloadObject, secret, jwtCallback );
}


const decodeJwtToken = function(jwtToken, secret, jwtCallback){

    jwt.verify(jwtToken, secret, jwtCallback);
}

const service = {
    signJwtToken : signJwtToken,
    decodeJwtToken : decodeJwtToken
}

module.exports = service;