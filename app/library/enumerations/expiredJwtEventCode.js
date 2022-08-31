const expiredJwtEventCode = Object.freeze({
    expiredJwtsCount:0,
    expiredJwtsTargeted:1,
    expiredJwtsRemoved:2,
    0:'expiredJwtsCount',
    1:'expiredJwtsTargeted',
    2:'expiredJwtsRemoved',
});

module.exports = expiredJwtEventCode;