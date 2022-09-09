const backgroundWorker = Object.freeze({
    expiredCsrfTokenDeletionWorker:0,
    jwtTokenQueryWorker:1,
    sessionQueryWorker:2,
    0: 'expiredCsrfTokenDeletionWorker',
    1: 'jwtTokenQueryWorker',
    2: 'sessionQueryWorker'

});

module.exports = backgroundWorker;