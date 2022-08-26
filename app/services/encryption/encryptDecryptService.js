const CryptoJS = require('crypto-js');

const cryptoJsConfig = require('../../../configuration/encryption/cryptoJsConfig.js');
const inputTypeInspector = require('../validation/inputTypeInspector.js');


const encryptWithAES = function(plainText) {
    if(!inputTypeInspector.isTypeString(plainText)){
        return plainText;
    }

  let encrypted = CryptoJS.AES.encrypt(plainText, cryptoJsConfig.PASSPHRASE).toString();
  return encrypted;
};


const decryptWithAES = (cipherText) => {
    if(!inputTypeInspector.isTypeString(cipherText)){
        return cipherText;
    }

    const bytes = CryptoJS.AES.decrypt(cipherText, cryptoJsConfig.PASSPHRASE);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  };


  const service = Object.freeze({
    encryptWithAES : encryptWithAES,
    decryptWithAES : decryptWithAES
  });

  module.exports = service;