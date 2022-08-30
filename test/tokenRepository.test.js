const tokenRepository = require('../app/dataAccessLayer/repositories/tokenRepository.js');
const repositoryManager = require('../app/dataAccessLayer/repositories/repositoryManager.js');
const tokenDomainModel = require('../app/domainLayer/domainModels/token.js');




jest.mock('../app/dataAccessLayer/repositories/repositoryManager.js');


describe('Function: tokenRepository.js', function(){

    afterAll(()=>{
        jest.resetAllMocks();
    });

    describe('Function: insertTokenIntoTableTransactionAsync', function(){
        test('CAN insert Token Into Table using Transactions',async function(){
            //Arrange
            let inserted = {
                affectedRows:1
            }
            let resultDb = [inserted];
            repositoryManager.resolveSingleConnectionStatementAsync = jest.fn().mockResolvedValueOnce(resultDb);
            let _connectionPool = 'asdf';
            let _tokenDomainModel = new tokenDomainModel();
            _tokenDomainModel.setTokenId('dosmskes');
            _tokenDomainModel.setUserId('1ers2dd4d5');
            _tokenDomainModel.setToken('adfadf');
            _tokenDomainModel.setType(2);
            _tokenDomainModel.setPayload('aadfd');
            _tokenDomainModel.setTokenStatusIsActive(true);

            let _expiryDate = new Date();
            //Act
            let resultTest = await tokenRepository.insertTokenIntoTableTransactionAsync(_connectionPool, _tokenDomainModel, _expiryDate);
            let resultAffectedRows = resultTest[0].affectedRows;
            //Assert
            expect(resultAffectedRows).toEqual( inserted.affectedRows );
            expect(repositoryManager.resolveSingleConnectionStatementAsync).toHaveBeenCalledTimes(1);


        });
    });

    describe('Function: getTokensFromDatabaseAsync', function(){
        test('CAN get Tokens From Database', async function(){
            //Arrange
            let _tokenDb = {
                TokenId: 'dfadf',
                UserId:'adafdowie',
                Token:'oskwkws',
                Payload:'skslkapoie',
                Type:2,
                IsActive:1,
                UTCDateCreated: new Date(),
                UTCDateExpired : new Date()
            }

            let resultDb = [[_tokenDb], []];
            repositoryManager.resolveStatementAsync = jest.fn().mockResolvedValueOnce(resultDb);

            let _tokenDomainModel = new tokenDomainModel();
            _tokenDomainModel.setTokenId('dosmskes');
            _tokenDomainModel.setUserId('1ers2dd4d5');
            _tokenDomainModel.setToken('oskwkws');
            _tokenDomainModel.setType(2);
            _tokenDomainModel.setPayload('aadfd');
            _tokenDomainModel.setTokenStatusIsActive(true);

            //Act
            let resultTest =await  tokenRepository.getTokensFromDatabaseAsync(_tokenDomainModel);
            let resultTestUserId = resultTest[0].UserId.value;
            //Assert

            expect(resultTestUserId).toEqual(_tokenDb.UserId);
            expect(repositoryManager.resolveStatementAsync).toHaveBeenCalledTimes(1);

        });
    });

    describe('Function: deleteTokenFromDatabaseAsync', function(){
        test('CAN delete Token From Database', async function(){
            //Arrange

            let _tokenDomainModel = new tokenDomainModel();
            _tokenDomainModel.setTokenId('dosmskes');
            _tokenDomainModel.setUserId('1ers2dd4d5');
            _tokenDomainModel.setToken('oskwkws');
            _tokenDomainModel.setType(2);
            _tokenDomainModel.setPayload('aadfd');
            _tokenDomainModel.setTokenStatusIsActive(true);
            let inserted={
                affectedRows:1
            }
            let resultDb = [inserted]
            repositoryManager.resolveStatementAsync = jest.fn().mockResolvedValueOnce(resultDb);
            //Act
            let resultTest = await tokenRepository.deleteTokenFromDatabaseAsync(_tokenDomainModel);
            let resultAffectedRows = resultTest[0].affectedRows;
            //Assert
            expect(resultAffectedRows).toEqual(1);
            expect(repositoryManager.resolveStatementAsync).toHaveBeenCalledTimes(1);
        });
    });

    describe('Function: updateTokenTableSetColumnValuesWhereAsync', function(){
        test('CAN update Token Table Set Column Values Where', async function(){
            //Arrange

            let _tokenDomainModel = new tokenDomainModel();
            _tokenDomainModel.setTokenId('dosmskes');
            _tokenDomainModel.setUserId('1ers2dd4d5');
            _tokenDomainModel.setToken('oskwkws');
            _tokenDomainModel.setType(2);
            _tokenDomainModel.setPayload('aadfd');
            _tokenDomainModel.setTokenStatusIsActive(true);
            let inserted={
                affectedRows:1
            }
            let resultDb = [inserted]
            repositoryManager.resolveConditionalWhereEqualsStatementAsync = jest.fn().mockResolvedValueOnce(resultDb);
            //Act
            let resultTest = await tokenRepository.updateTokenTableSetColumnValuesWhereAsync(_tokenDomainModel);
            let resultAffectedRows = resultTest[0].affectedRows;
            //Assert
            expect(resultAffectedRows).toEqual(1);
            expect(repositoryManager.resolveConditionalWhereEqualsStatementAsync).toHaveBeenCalledTimes(1);

        });
    });

});
