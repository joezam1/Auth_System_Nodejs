const monitorService = require('../app/services/monitoring/monitorService.js');
const monitorConfig = require('../configuration/monitoring/monitorConfig.js');

jest.mock('../configuration/monitoring/monitorConfig.js');


describe('File monitorService', function(){
    describe('function: capture', function(){
        test('When Global Capture is OFF, the function does not log any value', function(){
            //Arrange

            monitorConfig.GLOBAL_SWITCH =false;
            let message = 'This is a Message test';
            let obj1 = {
                messsage: 'this is a message from inside the object',
                status: 'ok',
                isActive: true
            }
            //Act
            let result = monitorService.capture(message, obj1);
            //Assert
            expect(result).toEqual(false);

        });

        test('When Global Capture is OFF, but the First parameter is TRUE, the function logs ALL values for a single record', function(){
            //Arrange

            monitorConfig.GLOBAL_SWITCH =false;
            let singleCapture = true;
            let message = 'This is a Message test';
            let obj1 = {
                messsage: 'this is a message from inside the object',
                status: 'ok',
                isActive: true
            }
            //Act
            console.log(singleCapture, message, obj1);
            let result = monitorService.capture(singleCapture, message, obj1);
            //Assert
            expect(result).toEqual(true);

        });

        test('When Global Capture is ON, but the First parameter is FALSE, the function logs ALL values ANYWAY', function(){
            //Arrange

            monitorConfig.GLOBAL_SWITCH =true;
            let singleCapture = false;
            let message = 'This is a Message test';
            let obj1 = {
                messsage: 'this is a message from inside the object',
                status: 'ok',
                isActive: true
            }
            //Act
            console.log(singleCapture, message, obj1);
            let result = monitorService.capture(singleCapture, message, obj1);
            //Assert
            expect(result).toEqual(true);

        });


        test('When Global Capture is ON, the First parameter is TRUE or any other value, the function logs ALL values ANYWAY', function(){
            //Arrange

            monitorConfig.GLOBAL_SWITCH =true;
            let singleCapture = false;
            let message = 'This is a Message test';
            let obj1 = {
                messsage: 'this is a message from inside the object',
                status: 'ok',
                isActive: true
            }
            //Act
            console.log(singleCapture, message, obj1);
            let result = monitorService.capture(singleCapture, message, obj1);
            //Assert
            expect(result).toEqual(true);

        })


    });
});