const jwtTokenService = require('../app/services/authorization/jwtTokenService.js');
const user = require('../app/domainLayer/domainModels/user.js');
const userRole = require('../app/library/enumerations/userRole.js');
const jwtConfig = require('../configuration/authorization/jwtConfig.js');
const sessionService = require('../app/services/authentication/sessionService.js');
const helpers = require('../app/library/common/helpers.js');
const encryptionService = require('../app/services/encryption/encryptionService.js');
const encryptDecryptService = require('../app/services/encryption/encryptDecryptService.js');
const uuidV4 = require('uuid');
const uuid = uuidV4.v4;
const userRepository = require('../app/dataAccessLayer/repositories/userRepository.js');
const httpResponseService = require('../app/services/httpProtocol/httpResponseService.js');


jest.mock('../app/dataAccessLayer/repositories/userRepository.js');
jest.mock('../app/services/httpProtocol/httpResponseService.js');



describe('File: jwtTokenService.js', function () {
    afterAll(() => {
        jest.resetAllMocks();
    })
    describe('Function : createAccessTokenPayload', function () {
        test('CAN create AccessToken Payload', function () {
            //Arrange
            let userDomainModel = new user();
            userDomainModel.setUserId('adfadf');
            userDomainModel.setFirstName('John');
            userDomainModel.setLastName('Taylor');
            userDomainModel.setUsername('john01');
            userDomainModel.setPassword('abcd');
            userDomainModel.setEmail('john@taylor.com');
            userDomainModel.setUserIsActive(true);

            let userDomainModelUserId = userDomainModel.getUserId();
            let rolesEnum = [userRole.Editor, userRole.Advertiser]

            let localeDateNow = new Date();
            let localeDateNowUTC = helpers.convertLocaleDateToUTCDate(localeDateNow);
            let expiryInMilliseconds = jwtConfig.JWT_ACCESS_TOKEN_TOTAL_EXPIRATION_TIME_IN_MILLISECONDS;
            let expiryLocaleDate = sessionService.calculateSessionDateExpiry(localeDateNow, expiryInMilliseconds);

            let expiryUTCDate = helpers.convertLocaleDateToUTCDate(expiryLocaleDate);
            //Act
            let result = jwtTokenService.createAccessTokenPayload(userDomainModel, rolesEnum, expiryUTCDate, localeDateNowUTC);
            let resultUserId = result.userInfo.userId;
            //Assert
            expect(resultUserId).toEqual(userDomainModelUserId);
        });
    });

    describe('Function: createRefreshTokenPayload', function () {
        test('CAN Create RefreshToken Payload', async function () {
            //Arrange
            let fingerprint = uuid();
            let encryptedFingerprint = await encryptionService.encryptStringInputAsync(fingerprint);

            let localeDateNow = new Date();
            let dateNowUTC = helpers.convertLocaleDateToUTCDate(localeDateNow);
            let expiryInMilliseconds = jwtConfig.JWT_ACCESS_TOKEN_TOTAL_EXPIRATION_TIME_IN_MILLISECONDS;
            let expiryLocaleDate = sessionService.calculateSessionDateExpiry(localeDateNow, expiryInMilliseconds);

            let expiryUTCDate = helpers.convertLocaleDateToUTCDate(expiryLocaleDate);
            //Act
            let result = jwtTokenService.createRefreshTokenPayload(encryptedFingerprint, expiryUTCDate, dateNowUTC);
            let resultPayloadFingerprint = result.sessionFingerprint;
            let areTheSame = await encryptionService.validateEncryptedStringInputAsync(fingerprint, resultPayloadFingerprint)
            //Assert
            expect(resultPayloadFingerprint).toEqual(encryptedFingerprint);
            expect(areTheSame).toEqual(true);

        });
    });

    describe('Function: createJsonWebTokenPromiseAsync', function () {
        test('CAN create ACCESS-TOKEN JsonWebToken', async function () {

            //Arrange
            let userDomainModel = user();
            userDomainModel.setUserId('adfadf');
            userDomainModel.setFirstName('John');
            userDomainModel.setLastName('Taylor');
            userDomainModel.setUsername('john01');
            userDomainModel.setPassword('abcd');
            userDomainModel.setEmail('john@taylor.com');
            userDomainModel.setUserIsActive(true);

            let rolesEnum = [userRole.Editor, userRole.Advertiser]

            let localeDateNow = new Date();
            let localeDateNowUTC = helpers.convertLocaleDateToUTCDate(localeDateNow);
            let expiryInMilliseconds = jwtConfig.JWT_ACCESS_TOKEN_TOTAL_EXPIRATION_TIME_IN_MILLISECONDS;
            let expiryLocaleDate = sessionService.calculateSessionDateExpiry(localeDateNow, expiryInMilliseconds);
            let expiryUTCDate = helpers.convertLocaleDateToUTCDate(expiryLocaleDate);
            let payload = jwtTokenService.createAccessTokenPayload(userDomainModel, rolesEnum, expiryUTCDate, localeDateNowUTC);

            //Act
            let accessToken = await jwtTokenService.createJsonWebTokenPromiseAsync(payload);
            //Assert
            expect(accessToken).not.toEqual(null);
        });

        test('THREE created ACCESS-TOKENS with SAME data and Same JWT-SECRET return the SAME JsonWebToken', async function () {

            //Arrange
            let userDomainModel = user();
            userDomainModel.setUserId('adfadf');
            userDomainModel.setFirstName('John');
            userDomainModel.setLastName('Taylor');
            userDomainModel.setUsername('john01');
            userDomainModel.setPassword('abcd');
            userDomainModel.setEmail('john@taylor.com');
            userDomainModel.setUserIsActive(true);
            let rolesEnum = [userRole.Editor, userRole.Advertiser];

            let localeDateNow = new Date();
            let localeDateNowUTC = helpers.convertLocaleDateToUTCDate(localeDateNow);
            let expiryInMilliseconds = jwtConfig.JWT_ACCESS_TOKEN_TOTAL_EXPIRATION_TIME_IN_MILLISECONDS;
            let expiryLocaleDate = sessionService.calculateSessionDateExpiry(localeDateNow, expiryInMilliseconds);

            let expiryUTCDate = helpers.convertLocaleDateToUTCDate(expiryLocaleDate);
            let payload = jwtTokenService.createAccessTokenPayload(userDomainModel, rolesEnum, expiryUTCDate, localeDateNowUTC);

            //Act
            let accessToken1 = await jwtTokenService.createJsonWebTokenPromiseAsync(payload)
            let accessToken2 = await jwtTokenService.createJsonWebTokenPromiseAsync(payload)
            let accessToken3 = await jwtTokenService.createJsonWebTokenPromiseAsync(payload)
            let originalPayload1 = await jwtTokenService.getDecodedJWTPayloadPromiseAsync(accessToken1);
            let originalPayload2 = await jwtTokenService.getDecodedJWTPayloadPromiseAsync(accessToken2);
            let originalPayload3 = await jwtTokenService.getDecodedJWTPayloadPromiseAsync(accessToken3);

            //Assert
            expect(accessToken1).toEqual(accessToken2);
            expect(accessToken1).toEqual(accessToken3);
            expect(payload.userInfo).toEqual(originalPayload1.userInfo);
            expect(payload.userInfo).toEqual(originalPayload2.userInfo);
            expect(payload.userInfo).toEqual(originalPayload3.userInfo);

        });


        test('THREE created ACCESS-TOKENS with DIFFERENT data and Same JWT-SECRET return DIFFERENT JsonWebToken', async function () {

            //Arrange
            let userDomainModel = user();
            userDomainModel.setUserId('adfadf');
            userDomainModel.setFirstName('John');
            userDomainModel.setLastName('Taylor');
            userDomainModel.setUsername('john01');
            userDomainModel.setPassword('abcd');
            userDomainModel.setEmail('john@taylor.com');
            userDomainModel.setUserIsActive(true);
            let rolesEnum = [userRole.Editor, userRole.Advertiser]

            let localeDateNow = new Date();
            let localeDateNext1 = new Date(localeDateNow.getDate() + 1);
            let localeDateNext2 = new Date(localeDateNow.getDate() + 2);
            let localeDateUTCNow = helpers.convertLocaleDateToUTCDate(localeDateNow);
            let localeDateUTCNext1 = helpers.convertLocaleDateToUTCDate(localeDateNext1);
            let localeDateUTCNext2 = helpers.convertLocaleDateToUTCDate(localeDateNext2);
            let expiryInMilliseconds = jwtConfig.JWT_ACCESS_TOKEN_TOTAL_EXPIRATION_TIME_IN_MILLISECONDS;
            let expiryLocaleDate = sessionService.calculateSessionDateExpiry(localeDateNow, expiryInMilliseconds);

            let expiryUTCDate = helpers.convertLocaleDateToUTCDate(expiryLocaleDate);

            let payload1 = jwtTokenService.createAccessTokenPayload(userDomainModel, rolesEnum, expiryUTCDate, localeDateUTCNow);
            let payload2 = jwtTokenService.createAccessTokenPayload(userDomainModel, rolesEnum, expiryUTCDate, localeDateUTCNext1);
            let payload3 = jwtTokenService.createAccessTokenPayload(userDomainModel, rolesEnum, expiryUTCDate, localeDateUTCNext2);

            //Act
            let accessToken1 = await jwtTokenService.createJsonWebTokenPromiseAsync(payload1)
            let accessToken2 = await jwtTokenService.createJsonWebTokenPromiseAsync(payload2)
            let accessToken3 = await jwtTokenService.createJsonWebTokenPromiseAsync(payload3)

            let originalPayload1 = await jwtTokenService.getDecodedJWTPayloadPromiseAsync(accessToken1);
            let originalPayload2 = await jwtTokenService.getDecodedJWTPayloadPromiseAsync(accessToken2);
            let originalPayload3 = await jwtTokenService.getDecodedJWTPayloadPromiseAsync(accessToken3);

            //Assert
            expect(accessToken1).not.toEqual(accessToken2);
            expect(accessToken1).not.toEqual(accessToken3);
            expect(payload1.userInfo).toEqual(originalPayload1.userInfo);
            expect(payload1.userInfo).toEqual(originalPayload2.userInfo);
            expect(payload1.userInfo).toEqual(originalPayload3.userInfo);

        });



        test('CAN ENCRYPT ACCESS-TOKEN inside JsonWebToken and decrypt Decoded JWT token', async function () {

            //Arrange
            let userDomainModel = user();
            userDomainModel.setUserId('adfadf');
            userDomainModel.setFirstName('John');
            userDomainModel.setLastName('Taylor');
            userDomainModel.setUsername('john01');
            userDomainModel.setPassword('abcd');
            userDomainModel.setEmail('john@taylor.com');
            userDomainModel.setUserIsActive(true);
            let rolesEnum = [userRole.Editor, userRole.Advertiser]

            let localeDateNow = new Date();
            let localeDateNext1 = new Date(localeDateNow.getDate() + 1);
            let localeDateNext2 = new Date(localeDateNow.getDate() + 2);
            let localeDateUTCNow = helpers.convertLocaleDateToUTCDate(localeDateNow);
            let localeDateUTCNext1 = helpers.convertLocaleDateToUTCDate(localeDateNext1);
            let localeDateUTCNext2 = helpers.convertLocaleDateToUTCDate(localeDateNext2);
            let expiryInMilliseconds = jwtConfig.JWT_ACCESS_TOKEN_TOTAL_EXPIRATION_TIME_IN_MILLISECONDS;
            let expiryLocaleDate = sessionService.calculateSessionDateExpiry(localeDateNow, expiryInMilliseconds);

            let expiryUTCDate = helpers.convertLocaleDateToUTCDate(expiryLocaleDate);

            let payload1 = jwtTokenService.createAccessTokenPayload(userDomainModel, rolesEnum, expiryUTCDate, localeDateUTCNow);
            let originalPayload1String = helpers.convertToStringOrStringifyForDataStorage(payload1);
            let encryptedPayload1 = encryptDecryptService.encryptWithAES(originalPayload1String)
            //Act
            let accessToken1 = await jwtTokenService.createJsonWebTokenPromiseAsync(encryptedPayload1)

            let encryptedPayload1Result = await jwtTokenService.getDecodedJWTPayloadPromiseAsync(accessToken1);

            let decryptedPayload1Result = encryptDecryptService.decryptWithAES(encryptedPayload1Result);
            let originalPayload1Result = JSON.parse(decryptedPayload1Result);
            //Assert

            expect(payload1.userInfo).toEqual(originalPayload1Result.userInfo);

        });
    });

    describe('Function: getDecodedJWTPayloadPromiseAsync', function(){
        test('CAN decode a JWT Token successfully', async function(){

            //Arrange
            let userDomainModel = user();
            userDomainModel.setUserId('adfadf');
            userDomainModel.setFirstName('John');
            userDomainModel.setLastName('Taylor');
            userDomainModel.setUsername('john01');
            userDomainModel.setPassword('abcd');
            userDomainModel.setEmail('john@taylor.com');
            userDomainModel.setUserIsActive(true);
            let rolesEnum = [userRole.Editor, userRole.Advertiser]

            let localeDateNow = new Date();
            let localeDateUTCNow = helpers.convertLocaleDateToUTCDate(localeDateNow);
            let expiryInMilliseconds = jwtConfig.JWT_ACCESS_TOKEN_TOTAL_EXPIRATION_TIME_IN_MILLISECONDS;
            let expiryLocaleDate = sessionService.calculateSessionDateExpiry(localeDateNow, expiryInMilliseconds);

            let expiryUTCDate = helpers.convertLocaleDateToUTCDate(expiryLocaleDate);
            let payload1 = jwtTokenService.createAccessTokenPayload(userDomainModel, rolesEnum, expiryUTCDate, localeDateUTCNow);

            let originalPayload1String = helpers.convertToStringOrStringifyForDataStorage(payload1);
            let encryptedPayload1 = encryptDecryptService.encryptWithAES(originalPayload1String)
            //Act
            let accessToken1 = await jwtTokenService.createJsonWebTokenPromiseAsync(encryptedPayload1)

            let encryptedPayload1Result = await jwtTokenService.getDecodedJWTPayloadPromiseAsync(accessToken1);
            let decryptedPayload1 = encryptDecryptService.decryptWithAES(encryptedPayload1Result);
            let originalPayload1 = JSON.parse(decryptedPayload1);
            //Assert
            expect(payload1.userInfo).toEqual(originalPayload1.userInfo);
        });
    });


    describe('Function: getCalculatedJwtAccessTokenLocaleExpiryDate', function(){
        test('CAN get Calculated Jwt AccessToken Locale Expiry Date ', function(){
            //Arrange
            let localeDateNow = new Date();
            //Act
            let expiryDate = jwtTokenService.getCalculatedJwtAccessTokenLocaleExpiryDate(localeDateNow);
            let localeDateNowTime = localeDateNow.getTime();
            let expiryDateTime = expiryDate.getTime();
            //Assert
            expect(expiryDateTime).toBeGreaterThan(localeDateNowTime)

        });
    });

    describe('Function: CreateJsonWebTokenWithEncryptedPayloadAsync', function(){
        test('CAN Create Json Web Token With Encrypted Payload OK', async function(){

            //Arrange
            let originalTokenPayload = {value: 'this is a payload'}
            //Act
            let encryptedJWT = await jwtTokenService.CreateJsonWebTokenWithEncryptedPayloadAsync(originalTokenPayload);
            let decryptedTokenPayload = await jwtTokenService.getDecryptedPayloadFromDecodedJsonWedTokenAsync(encryptedJWT);
            //Assert
            expect(decryptedTokenPayload).toEqual(originalTokenPayload);

        })
    });


    describe('Function: getDecryptedPayloadFromDecodedJsonWedTokenAsync', function(){
        test('CAN DECODE an Encrypted Json Web Token OK', async function(){

            //Arrange
            let originalTokenPayload = {value: 'this is a payload2'}
            //Act
            let encryptedJWT = await jwtTokenService.CreateJsonWebTokenWithEncryptedPayloadAsync(originalTokenPayload);
            let decryptedTokenPayload = await jwtTokenService.getDecryptedPayloadFromDecodedJsonWedTokenAsync(encryptedJWT);
            //Assert
            expect(decryptedTokenPayload).toEqual(originalTokenPayload);

        })
    })


    describe('Function: resolveCreateJwtAccessTokenPayloadAsync ', function(){
        test('When the internal functions are called payload is created', async function(){
            //Arrange
            userRepository.getAllUserRolesByUserIdAsync = jest.fn();
            userRepository.convertAllUserRolesFromDatabaseToUserRoleEnumsAsync = jest.fn();
            httpResponseService.getResponseResultStatus = jest.fn();
            let userDomainModel = new user();
            userDomainModel.setUserId('abcd');
            //Act
            let result = await jwtTokenService.resolveCreateJwtAccessTokenPayloadAsync(userDomainModel);

            //Assert
            expect(result).not.toEqual(null);
            expect(userRepository.getAllUserRolesByUserIdAsync).toHaveBeenCalledTimes(1);
            expect(userRepository.convertAllUserRolesFromDatabaseToUserRoleEnumsAsync).toHaveBeenCalledTimes(1);
            expect(httpResponseService.getResponseResultStatus).toHaveBeenCalledTimes(0);
        })
    });


    describe('Function: resolveCreateJwtRefreshTokenPayloadAsync', function(){
        test('When function is called the payload is created', async function(){
            //Arrange
            let fingerprint = 'abcd';
            //Act
            let resultRefreshTokenPayload = await jwtTokenService.resolveCreateJwtRefreshTokenPayloadAsync(fingerprint);
            let resultFingerprint = resultRefreshTokenPayload.sessionFingerprint;
            //Assert
            expect(resultRefreshTokenPayload).not.toEqual(null);
            expect(resultFingerprint).toEqual(fingerprint);
        })
    });

    describe('Function: tokenIsExpired', function(){
        test('When token UTCDate Expired is in the FUTURE the function returns FALSE', function(){

            //Arrange

            let localeDateNow = new Date();
            let localeDateTomorrowTime = localeDateNow.setDate(localeDateNow.getDate() + 1);

            let localeDateTomorrow = new Date(localeDateTomorrowTime);
            let utcDateTomorrow = helpers.convertLocaleDateToUTCDate(localeDateTomorrow);
            //Act

            let resultTest = jwtTokenService.tokenIsExpired(utcDateTomorrow);
            //Assert
            expect(resultTest).toEqual(false);
        });

        test('When token UTCDate Expired is in the PAST the function returns TRUE', function(){

            //Arrange

            let localeDateNow = new Date();
            let localeDateYesterdayTime = localeDateNow.setDate(localeDateNow.getDate() - 1);

            let localeDateYesterday = new Date(localeDateYesterdayTime);
            let utcDateYesterday = helpers.convertLocaleDateToUTCDate(localeDateYesterday);
            //Act

            let resultTest = jwtTokenService.tokenIsExpired(utcDateYesterday);
            //Assert
            expect(resultTest).toEqual(true);
        });
    });
});