const bcrypt = require('bcryptjs');
const validationConfig = require('../../../configuration/validation/validationConfig.js');

//Test: DONE
let encryptStringInputAsync = async function(input){
    let encrypted = input;
    if(typeof input == 'string'){
        var saltRounds = validationConfig.passwordSaltRounds;
        encrypted = await bcrypt.hash(input, saltRounds);
    }
    return encrypted;
}
//Test:DONE
let validateEncryptedPasswordAsync = async function(passwordRequest, passwordDb) {
    const comparison = await bcrypt.compare(passwordRequest, passwordDb);
    return comparison;
}

let service = {
    encryptStringInputAsync : encryptStringInputAsync,
    validateEncryptedPasswordAsync : validateEncryptedPasswordAsync
}

module.exports = service;