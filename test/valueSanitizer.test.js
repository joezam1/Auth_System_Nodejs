const dbContext = require('../app/dataAccessLayer/mysqlDataStore/context/dbContext.js');
const valueSanitizer = require('../app/dataAccessLayer/mysqlDataStore/preparedStatements/valueSanitizer.js');
const monitorService = require('../app/services/monitoring/monitorService.js');


describe('File: valueSanitizer.js',function(){

        function getUserAttributes(){
            let dateNow = new Date();
            let dateNowUtc = dateNow.toISOString();
            let context = dbContext.getSequelizeContext();
            let _userDtoModel = new context.userDtoModel();
            monitorService.capture('_userDtoModel', _userDtoModel);
            _userDtoModel.rawAttributes.UserId.value = 'asdfaklsdfpoiuere'
            _userDtoModel.rawAttributes.UserId.type.key =  _userDtoModel.rawAttributes.UserId.type.key.toString();
            _userDtoModel.rawAttributes.FirstName.value = 'Thomas'
            _userDtoModel.rawAttributes.FirstName.type.key =  _userDtoModel.rawAttributes.FirstName.type.key.toString();
            _userDtoModel.rawAttributes.MiddleName.value = undefined
            _userDtoModel.rawAttributes.MiddleName.type.key =  _userDtoModel.rawAttributes.MiddleName.type.key.toString();
            _userDtoModel.rawAttributes.LastName.value = 'Lennard'
            _userDtoModel.rawAttributes.LastName.type.key =  _userDtoModel.rawAttributes.LastName.type.key.toString();
            _userDtoModel.rawAttributes.Username.value = 'thomas001'
            _userDtoModel.rawAttributes.Username.type.key =  _userDtoModel.rawAttributes.Username.type.key.toString();
            _userDtoModel.rawAttributes.Email.value = 'thomas.lennard@west.com'
            _userDtoModel.rawAttributes.Email.type.key =  _userDtoModel.rawAttributes.Email.type.key.toString();
            _userDtoModel.rawAttributes.Password.value = 'abcd1324'
            _userDtoModel.rawAttributes.Password.type.key =  _userDtoModel.rawAttributes.Password.type.key.toString();
            _userDtoModel.rawAttributes.IsActive.value = true;
            _userDtoModel.rawAttributes.IsActive.type.key =  _userDtoModel.rawAttributes.IsActive.type.key.toString();
            _userDtoModel.rawAttributes.UTCDateCreated.value = dateNowUtc;
            _userDtoModel.rawAttributes.UTCDateCreated.type.key =  _userDtoModel.rawAttributes.UTCDateCreated.type.key.toString();
            _userDtoModel.rawAttributes.UTCDateUpdated.value = dateNowUtc;
            _userDtoModel.rawAttributes.UTCDateUpdated.type.key =  _userDtoModel.rawAttributes.UTCDateUpdated.type.key.toString();

            let clonedAttributes = JSON.parse(JSON.stringify(_userDtoModel.rawAttributes));

            return clonedAttributes;
        }


    describe('Function: getTruthySequelizeAttributesValues',function(){
        test('All null and undefined values are removed',function(){
            //Arrange
            let userAttributes = getUserAttributes();
            let attributesArray = [ userAttributes.FirstName, userAttributes.MiddleName, userAttributes.LastName]

            //Act
            let result = valueSanitizer.getTruthySequelizeAttributesValues(attributesArray);
            let resultLength = result.length;
            //Assert
            expect(resultLength).toEqual(2);
        });
    });

    describe('Function: getSanitizedInputs', function(){
        test('Dangerous Characters are removed', function(){
            //Arrange
            let userAttributes = getUserAttributes();
            monitorService.capture('userAttributes', userAttributes);
            userAttributes.FirstName.value = "Marcus%%%^^''''";
            userAttributes.LastName.value = "Jones'''''^^$$%%####";
            let attributesArray = [ userAttributes.FirstName, userAttributes.MiddleName, userAttributes.LastName];
            //Act
            let result = valueSanitizer.getSanitizedInputs(attributesArray);
            let indexResult = result.indexOf("'");
            //Assert
            expect(indexResult).toEqual(-1);
        });
    });
});