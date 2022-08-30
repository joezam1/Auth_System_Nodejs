const jsonWebTokenDomainManager = require('../app/domainLayer/domainManagers/jsonWebTokenDomainManager.js');
const jwtTokenService = require('../app/services/authorization/jwtTokenService.js');
const helpers = require('../app/library/common/helpers.js');
const userDomainModel = require('../app/domainLayer/domainModels/user.js');
const tokenRepository = require('../app/dataAccessLayer/repositories/tokenRepository.js');


jest.mock('../app/dataAccessLayer/repositories/tokenRepository.js');




describe('File: jsonWebTokenDomainManager.js', function(){
    describe('Function: resolveJsonWebTokenUpdateAsync', function(){
        test('CAN resolve Json Web Token Update', async function(){
            //Arrange
            let mockTokenResult = {
                TokenId:{value:'123'},
                UserId:{value:'adfadk'},
                Token:{value:'adsfasdf'},
                Type:{value:2},
                Payload:{value: 'ugk'},
                IsActive:{value:1},
                UTCDateCreated:{value: new Date()},
                UTCDateExpired:{value: new Date()}

            }
            let resultDb = [mockTokenResult];
            tokenRepository.getTokensFromDatabaseAsync = jest.fn().mockResolvedValueOnce(resultDb);
            tokenRepository.updateTokenTableSetColumnValuesWhereAsync = jest.fn();

            let _userDomainModel = new userDomainModel();
            let localeDateNow = new Date();
            let dateNowUtc = helpers.convertLocaleDateToUTCDate(localeDateNow);
            let localeDate2DaysFuture = new Date(localeDateNow.getDate() + 2);
            let utcDate2DaysFuture = helpers.convertLocaleDateToUTCDate(localeDate2DaysFuture);
            //let localeDateExpiry =
            let rolesArray = ['a', 'b'];
            let accessTokenPayload = jwtTokenService.createAccessTokenPayload(_userDomainModel,rolesArray, utcDate2DaysFuture,dateNowUtc );

            let accessToken = jwtTokenService.CreateJsonWebTokenWithEncryptedPayloadAsync(accessTokenPayload)
            let refreshTokenPayload = jwtTokenService.createRefreshTokenPayload('firngerpring', utcDate2DaysFuture,dateNowUtc);
            let refreshToken = jwtTokenService.createJsonWebTokenPromiseAsync(refreshTokenPayload);

            let request ={
                headers:{
                    authorization:'Bearer ' + accessToken,
                    refreshToken: refreshToken
                }
            }
            //Act
            let resultTest = await jsonWebTokenDomainManager.resolveJsonWebTokenUpdateAsync(request);
            //Assert

            expect(tokenRepository.getTokensFromDatabaseAsync).toHaveBeenCalledTimes(1);
            expect(tokenRepository.updateTokenTableSetColumnValuesWhereAsync).toHaveBeenCalledTimes(0);


        });
    });
});