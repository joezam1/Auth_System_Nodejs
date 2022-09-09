const tokenType = Object.freeze({
    sessionAuthentication: 0,
    jwtAccessToken: 1,
    jwtRefreshToken: 2,
    antiforgeryToken:3,
    0: 'sessionAuthentication',
    1: 'jwtAccessToken',
    2: 'jwtRefreshToken',
    3:'antiforgeryToken',
});

module.exports = tokenType;