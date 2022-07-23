const envConfig = require('./configuration/environment/envConfig.js');
const serverConfig = require('./configuration/server/serverConfig.js');

const helloWorldController = require('./app/presentationLayer/controllers/helloWorld.controller.js');
const userController = require('./app/presentationLayer/controllers/user.controller.js');
console.log(`server-NODE_ENV=${envConfig.NODE_ENV}`);

const http = require('http');
const cors = require('cors');
const httpPort = 3500;
const express = require('express');
const app = express();

//#REGION MiddleWare
app.use(express.json());
app.use(express.urlencoded());
app.use(cors(serverConfig.corsOptions));
//#ENDREGION Middleware


helloWorldController(app);
userController(app);

const httpServer = http.createServer(app);
httpServer.listen(httpPort, function(){
    console.log(`HTTP Server is running on Port ${httpPort}`);
})
