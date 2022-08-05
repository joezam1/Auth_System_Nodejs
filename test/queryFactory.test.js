const queryFactory = require('../app/dataAccessLayer/mysqlDataStore/preparedStatements/queryFactory.js');
const dbContext = require('../app/dataAccessLayer/mysqlDataStore/context/dbContext.js');


//let selectWhereEqualsAnd = function(tableName, sequelizePropertiesArray){
describe('File: queryFactory.js', function(){



    function getUserAttributes(){
        let dateNow = new Date();
        let dateNowUtc = dateNow.toISOString();
        let context = dbContext.getSequelizeContext();
        let _userDtoModel = new context.userDtoModel();
        console.log('_userDtoModel', _userDtoModel);
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


    describe('Function: selectWhereEqualsAnd', function(){
        test('Selected attributes are added OK', function(){

            //Arrange
            let tableName = 'TestingTable';
            let userAttributes = getUserAttributes();
            let attributesArray = [ userAttributes.FirstName, userAttributes.MiddleName, userAttributes.LastName]

            //Act
            let result = queryFactory.selectWhereEqualsAnd(tableName, attributesArray);
            //Assert

            expect(result).toContain('FirstName');
        });
    });

    describe('Function: selectAllFromTable', function(){

        test('Table name is included in statement', function(){

            //Arrange
            let tableName = 'test'
            //Act
            let result = queryFactory.selectAllFromTable(tableName);
            //Assert
            expect(result).toContain(tableName);

        });
    });

    describe('', function(){
        //let insertIntoTableValues = function(tableName, sequelizePropertiesArray){
        test('Statement contains Attribute in column name', function(){

            //Arrange
            let tableName = 'Test';
            let userAttributes = getUserAttributes();
            let attributesArray = [ userAttributes.FirstName, userAttributes.MiddleName, userAttributes.LastName]
            //Act
            let result = queryFactory.insertIntoTableValues(tableName, attributesArray);
            //Assert
            expect(result).toContain('FirstName');
        });
    });
});