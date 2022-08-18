
const registerRepositoryHelper = require('../app/dataAccessLayer/repositories/registerRepositoryHelper.js');
const register = require('../app/domainLayer/domainModels/register.js');

describe('File registerRepositoryHelper.js', function(){

    describe('Function: getRegisterDtoModelMappedFromDomain', function(){
        test('Can Create RegisterDtoModel Mapped From Domain',function(){
            //Arrange

            let dataModel ={
                registerId: 'piodapokmnj',
                userId:'13456',
                isActive:true
            }
            let registerDomainModel = new register();
            registerDomainModel.setRegisterId(dataModel.registerId);
            registerDomainModel.setUserId(dataModel.userId);
            registerDomainModel.setRegisterIsActive(dataModel.isActive);
            //Act
            let result = registerRepositoryHelper.getRegisterDtoModelMappedFromDomain(registerDomainModel);
            let resultUserId = result.UserId.value;
            //Assert
            expect(resultUserId).toEqual(dataModel.userId);

        });
    });
});
