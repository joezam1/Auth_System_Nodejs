const domainManagerHelper = require('../app/domainLayer/domainManagers/domainManagerHelper.js');


describe('File: domainManagerHelper', function(){
    describe('Function: createUserRoleModel', function(){
        test('Can create a UserRoleModel', function(){
            //Arrange
            let userId = 'abcd';
            let roleId = '1234';
            //Act
            let userRoleModel = domainManagerHelper.createUserRoleModel(userId, roleId);
            let userRoleId = userRoleModel.getRoleId();
            //Assert
            expect(userRoleId).toEqual(roleId);
        })
    });

    describe('Function: createRegisterModel', function(){
        test('Can create a RegisterModel', function(){
            //Arrange
            let userId = 'abcd';
            //Act
            let registerModel = domainManagerHelper.createRegisterModel(userId);
            let registerUserId = registerModel.getUserId();
            //Assert
            expect(registerUserId).toEqual(userId);
        })
    });

    describe('Function: createSessionModel', function(){
        test('Can create a SessionModel', function(){
            //Arrange
            let userId = 'abcd';
            let sessionToken = '13456';
            let data = '{info:data}';
            let expiration = 1000 * 60 * 15
            //Act
            let sessionModel = domainManagerHelper.createSessionModel(userId, sessionToken , data, expiration);
            let sessionUserId = sessionModel.getUserId();
            //Assert
            expect(sessionUserId).toEqual(userId);
        })
    });

    describe('Function: createSessionActivityModel', function(){
        test('Can create a SessionActivityModel', function(){
            //Arrange
            let userId = 'abcd';
            let geolocationInfo = '13456';
            let deviceInfo = 'mobile phone';
            let userAgentInfo = 'Mozilla Firefox';
            //Act
            let sessionActivityModel = domainManagerHelper.createSessionActivityModel(userId, geolocationInfo , deviceInfo, userAgentInfo);
            let sessionActivityUserId = sessionActivityModel.getUserId();
            //Assert
            expect(sessionActivityUserId).toEqual(userId);
        })
    });

    describe('Function: createCookieObj', function(){
        test('Can create a CookieObject', function(){
            //Arrange

            let sessionToken = '13456';
            //Act
            let cookieObj = domainManagerHelper.createCookieObj(sessionToken);
            let cookieValue = cookieObj.value;
            //Assert
            expect(cookieValue).toEqual(sessionToken);
        })
    });

    describe('Function: createTokenModel', function(){
        test('CAN create Token Model', function(){
            //Arrange
            let userId = 'abc';
            //Act
            let resultTest = domainManagerHelper.createTokenModel( userId,'xsdd',1,'ssss');
            //Assert
            let resultUserId = resultTest.getUserId();
            expect(resultUserId).toEqual(userId);
        });
    });

    describe('Function: getUserDomainModelMappedFromUserDtoModel', function(){
        test('CAN get User Domain Model Mapped From User DtoModel', function(){
            //Arrange
            let userDtoModel ={
                UserId:{value: 'dfadf'},
                FirstName:{value:'Tom'},
                LastName:{value:'Jones'},
                Username:{value:'tom1'},
                Email:{value:'tom1@jones.com'},
                IsActive:{value:true}
            }
            //Act
            let resultTest = domainManagerHelper.getUserDomainModelMappedFromUserDtoModel(userDtoModel);
            resultUserId = resultTest.getUserId();
            //Assert
            expect(resultUserId).toEqual(userDtoModel.UserId.value);
        });
    });

    describe('Function: getTokenDomainModelMappedFromTokenDtoModel', function(){
        test('CAN get Token Domain Model Mapped From Token DtoModel', function(){

            //Arrange
            let tokenDtoModel = {
                TokenId:{value:'13256'},
                UserId:{value:'abc'},
                Token:{value:'sssadfpoijf'},
                Type:{value:2},
                Payload:{value: 'adsadfad'}
            }
            //Act
            let resultTest = domainManagerHelper.getTokenDomainModelMappedFromTokenDtoModel(tokenDtoModel);
            let resultTokenId = resultTest.getTokenId();
            //Assert
            expect( resultTokenId ).toEqual(tokenDtoModel.TokenId.value);

        });
    });

    describe('Function: getSessionViewModelMappedFromSessionDtoModel', function(){
        test('CAN get Session ViewModel Mapped From Session DtoModel', function(){

            //Arrange
            let sessionDtoModel ={
                SessionToken:{value:'132'},
                Expires:{value: 60000},
                Data:{value: 'abc'},
                IsActive:{value:1},
                UTCDateCreated:{value: new Date()},
                UTCDateExpired:{value: new Date()}
            }
            //Act
            let resultTest = domainManagerHelper.getSessionViewModelMappedFromSessionDtoModel(sessionDtoModel);
            let resultSessionToken = resultTest.sessionToken.fieldValue;
            //Assert
            expect(resultSessionToken).toEqual(sessionDtoModel.SessionToken.value);
        });
    });

    describe('Function: getSessionDomainModelMappedFromSessionDtoModel', function(){
        test('CAN get Session DomainModel Mapped From Session DtoModel', function(){

            //Arrange
            let mockSessionDtoModel = {
                SessionId:{value:'adfad'},
                UserId:{value:'adf'},
                SessionToken:{value:'aadsf'},
                Expires:{value:6000},
                Data:{value:'abc'},
                IsActive:{value:true},
            }
            //Act
            let sessionResult = domainManagerHelper.getSessionDomainModelMappedFromSessionDtoModel(mockSessionDtoModel);
            let sessionResultUserId = sessionResult.getUserId();
            //Assert
            expect(sessionResultUserId).toEqual(mockSessionDtoModel.UserId.value);
        });
    });

    describe('Function: createAuthViewModelFromRequest', function(){
        test('CAN createAuthViewModelFromRequest', function(){
            //Arrange
            let requestMock ={
                headers:{
                    x_csrf_token:'ads',
                    x_csrf_token_client:'eee',
                    referer:'abc',
                    origin:'abc',
                    'user-agent':'Mozilla Firefox'
                }
            }
            //Act
            let result = domainManagerHelper.createAuthViewModelFromRequest(requestMock);
            let resultOrigin = result.origin.fieldValue;

            //Assert
            expect(resultOrigin).toEqual(requestMock.headers.origin);
        })
    });

});