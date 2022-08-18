const roleRepositoryHelper = require('../app/dataAccessLayer/repositories/roleRepositoryHelper.js');



describe('File: roleRepositoryHelper.js', function(){
    describe('Function: getRolesDtoModelMappedFromDatabase', function(){
        test('Can Create RolesDtoModel Mapped From Database', function(){
            //Arrange
            let dataModel1 = {
                RoleId:'adsfadoi',
                RoleIndex: 1,
                Name:'Customer',
                Description:'Customer Info',
                IsActive: 1
            }
            let dataModel2 = {
                RoleId:'mkxlkjwi',
                RoleIndex: 2,
                Name:'Admin',
                Description:'Admin Info',
                IsActive: 1
            }
            let dbResult = [dataModel1, dataModel2];
            //Act
            let rolesDtoModelArray = roleRepositoryHelper.getRolesDtoModelMappedFromDatabase(dbResult);
            let roleId = rolesDtoModelArray[0].RoleId.value;
            //Assert
            expect(roleId).toEqual(dataModel1.RoleId);
        });
    });
});