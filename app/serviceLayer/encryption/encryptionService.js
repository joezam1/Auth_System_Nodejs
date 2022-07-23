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

let service = {
    encryptStringInputAsync:encryptStringInputAsync
}

module.exports = service;