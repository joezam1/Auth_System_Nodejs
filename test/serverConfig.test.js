const serverConfig = require('../configuration/server/serverConfig.js');
const notificationService = require('../app/services/notifications/notificationService.js');


describe('FILE: ServerConfig',()=>{
    console.log('serverConfig', serverConfig);

    test('HTTP Port Exist and has a number', ()=>{
        var httpPort = serverConfig.configuration.HTTPS_PORT;
        expect(httpPort).toEqual(expect.any(Number));
        expect(httpPort).toBeGreaterThan(0);
    })

    test('HTTPS Port Exist and has a number',()=>{
        var httpsPort = serverConfig.configuration.HTTPS_PORT;
        expect(httpsPort).toEqual(expect.any(Number));
        expect(httpsPort).toBeGreaterThan(0);
    });

    test('CorsOptions Origin NOT WHITELISTED will throw an Error', ()=>{
        function corsCallbackError(response){

            var msg = notificationService.corsErrorNotification;
            var err = new Error(msg);
             expect(response).toEqual(err);
        }
        var origin = 'https://google.com';
        var corsOptionsFunc = serverConfig.configuration.corsOptions;
        corsOptionsFunc.origin(origin, corsCallbackError);
    });

    test('CorsOptions Origin WHITELISTED will continue execution', ()=>{
        function corsCallbackError(response){

             expect(response).toBeNull();
        }
        let whiteListOriginArray = serverConfig.whitelistRemoteOrigins;
        let whitelistedOrigin = (whiteListOriginArray.length > 0 ) ? whiteListOriginArray[0] : '';
        let corsOptionsFunc = serverConfig.configuration.corsOptions;
        corsOptionsFunc.origin(whitelistedOrigin, corsCallbackError);
    });
});
