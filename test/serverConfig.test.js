const serverConfig = require('../configuration/server/serverConfig.js');
const notificationService = require('../app/serviceLayer/notifications/notificationService.js');
xdescribe('Jest Installed',()=>{
    test('true is true, jest works OK', ()=>{expect(true).toBe(true);});
});

xdescribe('FILE: ServerConfig',()=>{
    console.log('serverConfig', serverConfig);

    test('HTTP Port Exist and has a number', ()=>{
        var httpPort = serverConfig.HTTPS_PORT;
        expect(httpPort).toEqual(expect.any(Number));
        expect(httpPort).toBeGreaterThan(0);
    })

    test('HTTPS Port Exist and has a number',()=>{
        var httpsPort = serverConfig.HTTPS_PORT;
        expect(httpsPort).toEqual(expect.any(Number));
        expect(httpsPort).toBeGreaterThan(0);
    });

    test('CorsOptions Origin NOT WHITELISTED will throw an Error', ()=>{
        function corsCallbackError(response){
            console.log('corsCallback-response', response);
            var msg = notificationService.corsErrorNotification;
            var err = new Error(msg);
             expect(response).toEqual(err);
        }
        var origin = 'https://google.com';
        var corsOptionsFunc = serverConfig.corsOptions;
        corsOptionsFunc.origin(origin, corsCallbackError);
    });

    test('CorsOptions Origin WHITELISTED will continue execution', ()=>{
        function corsCallbackError(response){
            console.log('corsCallback-response', response);
             expect(response).toBeNull();
        }
        var origin = 'http://localhost:3080';
        var corsOptionsFunc = serverConfig.corsOptions;
        corsOptionsFunc.origin(origin, corsCallbackError);
    });
});
