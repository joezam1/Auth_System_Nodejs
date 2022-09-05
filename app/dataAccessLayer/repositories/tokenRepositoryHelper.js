const dbContext = require('../mysqlDataStore/context/dbContext.js');
const helpers = require('../../library/common/helpers.js');

let context = null;

//Test: DONE
const getTokenDtoModelMappedFromDomain = function(tokenDomainModel) {
    //console.log('tokenDomainModel', tokenDomainModel);

    let dateNow = new Date();
    let resolvedTokenStatus = (tokenDomainModel.getTokenStatusIsActive() === true)
        ? tokenDomainModel.getTokenStatusIsActive()
        : tokenDomainModel.setTokenStatusIsActive(true); tokenDomainModel.getTokenStatusIsActive();

    let _tokenDtoModel = new context.tokenDtoModel();
    //console.log('_tokenDtoModel', _tokenDtoModel);

    _tokenDtoModel.rawAttributes.TokenId.value = tokenDomainModel.getTokenId();
    _tokenDtoModel.rawAttributes.TokenId.type.key =  _tokenDtoModel.rawAttributes.TokenId.type.key.toString();
    _tokenDtoModel.rawAttributes.UserId.value = tokenDomainModel.getUserId();
    _tokenDtoModel.rawAttributes.UserId.type.key =  _tokenDtoModel.rawAttributes.UserId.type.key.toString();

    _tokenDtoModel.rawAttributes.Token.value = tokenDomainModel.getToken();
    _tokenDtoModel.rawAttributes.Token.type.key =  _tokenDtoModel.rawAttributes.Token.type.key.toString();
    _tokenDtoModel.rawAttributes.Type.value = tokenDomainModel.getType();
    _tokenDtoModel.rawAttributes.Type.type.key =  _tokenDtoModel.rawAttributes.Type.type.key.toString();
    _tokenDtoModel.rawAttributes.Payload.value = tokenDomainModel.getPayload();
    _tokenDtoModel.rawAttributes.Payload.type.key =  _tokenDtoModel.rawAttributes.Payload.type.key.toString();
    _tokenDtoModel.rawAttributes.IsActive.value = resolvedTokenStatus;
    _tokenDtoModel.rawAttributes.IsActive.type.key =  _tokenDtoModel.rawAttributes.IsActive.type.key.toString();

    _tokenDtoModel.rawAttributes.UTCDateCreated.value = helpers.convertLocaleDateToUTCFormatForDatabase(dateNow);
    _tokenDtoModel.rawAttributes.UTCDateCreated.type.key =  _tokenDtoModel.rawAttributes.UTCDateCreated.type.key.toString();
    _tokenDtoModel.rawAttributes.UTCDateExpired.value = helpers.convertLocaleDateToUTCFormatForDatabase(dateNow);
    _tokenDtoModel.rawAttributes.UTCDateExpired.type.key =  _tokenDtoModel.rawAttributes.UTCDateExpired.type.key.toString();

    let clonedAttributes = JSON.parse(JSON.stringify(_tokenDtoModel.rawAttributes));
    return clonedAttributes;
}
//Test: DONE
const getTokensDtoModelMappedFromDatabase = function(databaseResultArray) {
    let allTokensDtoModels = [];
    for (let a = 0; a < databaseResultArray.length; a++) {
        let tokenDatabase = databaseResultArray[a];
        //console.log('tokenDatabase', tokenDatabase);
        let _tokenDtoModel = new context.tokenDtoModel();
        //console.log('_tokenDtoModel', _tokenDtoModel);

        _tokenDtoModel.rawAttributes.TokenId.value = tokenDatabase.TokenId;
        _tokenDtoModel.rawAttributes.UserId.value = tokenDatabase.UserId;
        _tokenDtoModel.rawAttributes.Token.value = tokenDatabase.Token;
        _tokenDtoModel.rawAttributes.Type.value = tokenDatabase.Type;
        _tokenDtoModel.rawAttributes.Payload.value = tokenDatabase.Payload;
        _tokenDtoModel.rawAttributes.IsActive.value = (tokenDatabase.IsActive !== 0);

        _tokenDtoModel.rawAttributes.UTCDateCreated.value = tokenDatabase.UTCDateCreated;
        _tokenDtoModel.rawAttributes.UTCDateExpired.value = tokenDatabase.UTCDateExpired;

        let clonedAttributes = JSON.parse(JSON.stringify(_tokenDtoModel.rawAttributes));
        //NOTE: JSON Parse, converts Date values to Locale, We re-insert the original UTC Dates
        clonedAttributes.UTCDateCreated.value = tokenDatabase.UTCDateCreated;
        clonedAttributes.UTCDateExpired.value = tokenDatabase.UTCDateExpired;
        allTokensDtoModels.push(clonedAttributes);
    }

    return allTokensDtoModels;
}


onInit();

const service = {
    getTokenDtoModelMappedFromDomain : getTokenDtoModelMappedFromDomain,
    getTokensDtoModelMappedFromDatabase : getTokensDtoModelMappedFromDatabase
}

module.exports = service;


//#REGION Private Functions
function onInit(){
    context = dbContext.getSequelizeContext();
}
//#ENDREGION Private Functions