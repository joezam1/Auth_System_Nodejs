const tokenRepositoryHelper = require('../app/dataAccessLayer/repositories/tokenRepositoryHelper.js');
const tokenDomainModel = require('../app/domainLayer/domainModels/token.js');



describe('File: tokenRepositoryHelper.js', function(){
    describe('Function: getTokenDtoModelMappedFromDomain', function(){
        test('CAN get Token DtoModel Mapped From Domain', function(){
            //Arrange
            let _tokenDomainModel = new tokenDomainModel();
            _tokenDomainModel.setTokenId('adfadf');
            _tokenDomainModel.setUserId('qeqertg');
            _tokenDomainModel.setToken('qqdfad');
            _tokenDomainModel.setType(2);
            _tokenDomainModel.setPayload('adfalkjs');
            _tokenDomainModel.setTokenStatusIsActive(true);
            let tokenUserId = _tokenDomainModel.getUserId();
            //Act
            let resultTest = tokenRepositoryHelper.getTokenDtoModelMappedFromDomain(_tokenDomainModel);
            let resultUserId = resultTest.UserId.value;
            //Assert
            expect(resultUserId).toEqual(tokenUserId);


        })
    });

    describe('Function: getTokensDtoModelMappedFromDatabase', function(){
        test('CAN get Tokens DtoModel Mapped From Database', function(){

            //Arrange
            let tokenResultDb = {
                TokenId:'adfad',
                UserId: 'oosos',
                Token: 'wiskss',
                Payload: 'iodm,cvvpw',
                IsActive: 1,
                UTCDateCreated: new Date(),
                UTCDateExpired: new Date()
            }
            let resultDb = [tokenResultDb];
            //Act
            let resultTestArray = tokenRepositoryHelper.getTokensDtoModelMappedFromDatabase(resultDb);
            let resultUserId = resultTestArray[0].UserId.value;
            //Assert
            expect(resultUserId).toEqual(tokenResultDb.UserId);

        });
    });
});