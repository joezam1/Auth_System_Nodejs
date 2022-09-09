const envConfig = require('./configuration/environment/envConfig.js');
const serverConfig = require('./configuration/server/serverConfig.js');
const sessionConfig = require('./configuration/authentication/sessionConfig.js');

const propertyInitializer = require('./app/middleware/propertyInitializer.js');
const userController = require('./app/presentationLayer/controllers/user.controller.js');
const sessionController = require('./app/presentationLayer/controllers/session.controller.js');
const jsonWebTokenController = require('./app/presentationLayer/controllers/jsonWebToken.controller.js');
const homeController = require('./app/presentationLayer/controllers/home.controller.js');

console.log(`server-NODE_ENV=${envConfig.NODE_ENV}`);

const session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http');
const cors = require('cors');
const httpPort = 3500;
const express = require('express');
const app = express();


//#REGION MiddleWare
app.use(session(sessionConfig.activeSession));
app.use(express.json());
app.use(express.urlencoded());
app.use(cors(serverConfig.configuration.corsOptions));
app.use(cookieParser());
app.use(propertyInitializer);
//#ENDREGION Middleware

userController(app);
sessionController(app);
jsonWebTokenController(app);
homeController(app);

const httpServer = http.createServer(app);
httpServer.listen(httpPort, function(){
    console.log(`HTTP Server is running on Port ${httpPort}`);
})
