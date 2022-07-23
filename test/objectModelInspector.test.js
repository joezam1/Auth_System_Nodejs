const ObjectModelInspector = require('../app/serviceLayer/validation/objectModelInspector.js');
const userViewModel = require('../app/presentationLayer/viewModels/userViewModel.js');
const InputCommonInspector = require('../app/serviceLayer/validation/inputCommonInspector.js');
const UserRoles = require('../app/library/enumerations/userRoles.js');

describe('File: ObjectModelInspector.js', function () {

    describe('Function: inspectInputLength', function(){
        test('Inputs filled up completely do not generate Error Report', function(){
            //Arrange
            let dataModel = {
                firstName : 'Thomas',
                lastName : 'Gurlyie',
                username : 'thomas01',
                email : 'thomas11@west.com',
                password : 'abcd',
                confirmPassword : 'abcd',
                userRole : UserRoles.Customer,
            };
            let userModel = new userViewModel(dataModel);
            //Act
            let resultInputLength = ObjectModelInspector.inspectInputLength(userModel);
            let errorReportDoesNotExist = InputCommonInspector.objectIsNullOrEmpty(resultInputLength);
            //Assert
            expect(errorReportDoesNotExist).toBe(true);
        });

        test('Input Forms Empty generate an Error Report', function(){

            //Arrange
            let dataModel = {
                firstName : 'Thomas',
                lastName : 'Gurlyie',
                username : '',
                email : 'thomas11@west.com',
                password : 'abcd',
                confirmPassword : 'abcd',
                userRole : UserRoles.Customer,
            };
            let userModel = new userViewModel(dataModel);
            //Act
            let resultInputLength = ObjectModelInspector.inspectInputLength(userModel);
            let result = InputCommonInspector.objectIsNullOrEmpty(resultInputLength);
            //Assert
            expect(result).toBe(false);
        });
    });

    describe('Function: inspectInputType',function(){

        test('Inputs filled up with their corresponding data type Do Not Generate Error Report',function(){
            //Arrange
            let dataModel = {
                firstName : 'Thomas',
                lastName : 'Gurlyie',
                username : 'thomas01',
                email : 'thomas11@west.com',
                password : 'abcd',
                confirmPassword : 'abcd',
                userRole : UserRoles.Customer,
            };
            let userModel = new userViewModel(dataModel);
            //Act

            let resultInputType = ObjectModelInspector.inspectInputType(userModel);
            //Assert
            let result = InputCommonInspector.objectIsNullOrEmpty(resultInputType);

            expect(result).toBe(true);
        });

        test('Inputs filled up with their WRONG data type Do Generate Error Report',function(){
            //Arrange
            let dataModel = {
                firstName : 'Thomas',
                lastName : 'Gurlyie',
                username : {},
                email : 'thomas11@west.com',
                password : null,
                confirmPassword : 'abcd',
                userRole : UserRoles.Customer,
            };
            let userModel = new userViewModel(dataModel);
            //Act

            let resultInputType = ObjectModelInspector.inspectInputType(userModel);
            //Assert
            let result = InputCommonInspector.objectIsNullOrEmpty(resultInputType);

            expect(result).toBe(false);
        });
    });

    describe('Function: inspectInputValue', function(){
        test('Input FirstName and LastName Inserted only Letters or No Space, DOES NOT generate Error Report',function(){

            //Arrange
            let dataModel = {
                firstName : 'Thomas',
                lastName : '',
                username : 'thomas01',
                email : 'thomas11@west.com',
                password : 'abcd',
                confirmPassword : 'abcd',
                userRole : UserRoles.Customer,
            };
            let userModel = new userViewModel(dataModel);
            //Act
            let resultInputValue = ObjectModelInspector.inspectInputValue(userModel);
            let result = InputCommonInspector.objectIsNullOrEmpty(resultInputValue);
            //Assert
            expect(result).toBe(true);

        });

        test('Input FirstName and LastName Insert Letters AND NUMBERS, DO generate Error Report',function(){

            //Arrange
            let dataModel = {
                firstName : 'Thomas009',
                lastName : 'Gurlyie5678',
                username : 'thomas01',
                email : 'thomas11@west.com',
                password : 'abcd',
                confirmPassword : 'abcd',
                userRole : UserRoles.Customer,
            };
            let userModel = new userViewModel(dataModel);
            //Act
            let resultInputValue = ObjectModelInspector.inspectInputValue(userModel);
            let result = InputCommonInspector.objectIsNullOrEmpty(resultInputValue);
            //Assert
            expect(result).toBe(false);

        });
    });
});