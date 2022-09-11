const dotenv = require('dotenv');
const path = require('path');


console.log('envConfig-process.env.NODE_ENV', process.env.NODE_ENV);
var envConfiguration = {
    path:path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
}


dotenv.config(envConfiguration);

var envConfig = {
    NODE_ENV: process.env.NODE_ENV,
    HOST: process.env.HOST
}

module.exports = envConfig;
