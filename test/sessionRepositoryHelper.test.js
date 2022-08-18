const sessionRepositoryHelper = require('../app/dataAccessLayer/repositories/sessionRepositoryHelper.js');
const session = require('../app/domainLayer/domainModels/session.js');
const sessionActivity = require('../app/domainLayer/domainModels/sessionActivity.js');


describe('File: sessionRepositoryHelper.js', function(){
    describe('Function: getSessionDtoModelMappedFromDomain', function(){
        test('Cam Create SessionDtoModel Mapped From Domain', function(){
            //Arrange
            let dataModel={
                sessionId:'abd',
                userId:'123456',
                sessionToken:'opiouuu-oitrgf-kjh',
                expiry:(1000 * 60 * 15),
                data: 'cookie:info',
                isActive:true
            }
            let sessionDomainModel = new session();
            sessionDomainModel.setSessionId(dataModel.sessionId);
            sessionDomainModel.setUserId(dataModel.userId);
            sessionDomainModel.setSessionToken(dataModel.sessionToken);
            sessionDomainModel.setExpiryInMilliseconds(dataModel.expiry);
            sessionDomainModel.setData(dataModel.data);
            sessionDomainModel.setSessionStatusIsActive(dataModel.isActive);
            //Act
            let result = sessionRepositoryHelper.getSessionDtoModelMappedFromDomain(sessionDomainModel);
            let resultUserId = result.UserId.value;
            //Assert
            expect(resultUserId).toEqual(dataModel.userId);
        });
    });

    describe('Function: getSessionsDtoModelMappedFromDatabase',function(){
        test('Can create SessionsDtoModel Mapped From Database', function(){

            //Arrange
            let dataModel ={
                SessionId:'123456',
                UserId:'adsfpuidf',
                SessionToken: 'afad-adf98-sdf',
                Expires:(1000 * 60 * 15),
                IsActive:1
            };
            let resultArray = [dataModel];
            //Act
            let sessionDtoModelArray = sessionRepositoryHelper.getSessionsDtoModelMappedFromDatabase(resultArray);
            let sessionDtoModelUserId = sessionDtoModelArray[0].UserId.value;
            //Assert
            expect(sessionDtoModelUserId).toEqual(dataModel.UserId);
        });
    });

    describe('Function: getSessionActivityDtoModelMappedFromDomain', function(){
        test('Can Create SessionActivityDtoModel Mapped From Domain', function(){
            //Arrange
            let dataModel = {
                activityId: '123456',
                userId: 'adfadf',
                geolocation: 'coords:{lat:123465, long:123456}',
                device:'mobile phone',
                userAgent:'mozilla firefox'
            }
            let sessionActivityDomainModel = new sessionActivity();
            sessionActivityDomainModel.setSessionActivityId(dataModel.activityId);
            sessionActivityDomainModel.setUserId(dataModel.userId);
            sessionActivityDomainModel.setGeolocation(dataModel.geolocation);
            sessionActivityDomainModel.setDevice(dataModel.device);
            sessionActivityDomainModel.setUserAgent(dataModel.userAgent);
            //Act
            let sessionActivityResult = sessionRepositoryHelper.getSessionActivityDtoModelMappedFromDomain(sessionActivityDomainModel);
            let resultUserId = sessionActivityResult.UserId.value;
            //Assert
            expect(resultUserId).toEqual(dataModel.userId);

        });
    });

    describe('Function: getSessionActitiviesDtoModelMappedFromDatabase', function(){
        test('Can Create SessionActitiviesDtoModel Mapped From Database', function(){
            //arrange
            let dataModel ={
                SessionActivityId:'adfadkljasd',
                UserId:'adfd9ad09564fd',
                Geolocation:'{}',
                Device: 'Mobile Phone',
                UserAgent:'Mozilla Firefox'
            }
            let dbResult = [dataModel]
            //Act
            let sessionActivityDtoModelArray = sessionRepositoryHelper.getSessionActitiviesDtoModelMappedFromDatabase(dbResult);
            let sessionActivityUserId = sessionActivityDtoModelArray[0].UserId.value;
            //Assert
            expect(sessionActivityUserId).toEqual(dataModel.UserId);
        });
    });
});
