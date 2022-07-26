const uuidV4 = require('uuid');
const uuid = uuidV4.v4;
const encryptionService = require('../encryption/encryptionService.js');



let generateSessionTokenAsync = async function(){

    let sessionUuid = uuid();
    let sessionToken = await encryptionService.encryptStringInputAsync(sessionUuid);
    return sessionToken;
}

const service ={
    generateSessionTokenAsync : generateSessionTokenAsync
}
module.exports = service;