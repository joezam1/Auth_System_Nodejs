const TWENTYFOUR_HOURS = 1000 * 60 * 60 * 24;
const THREE_HOURS = 1000 * 60 * 60 * 3;
const FIFTEEN_MINUTES = 1000 * 60 * 15;
const FIVE_MINUTES = 1000 * 60 * 5;
const THREE_MINUTES = 1000 * 60 * 3;
const ONE_MINUTE = 1000 * 60 * 3;

const SESSION_NAME = 'loginUserSession';
const SESSION_SECRET = 'longsecretstringtopreventfromguessingthesessions';
const SESSION_EXPIRATION_TIME = THREE_HOURS;
const SESSION_REPLACEMENT_FREQUENCY = THREE_MINUTES;

const activeSession = {
    name: SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {
        path: '/',
        maxAge: THREE_MINUTES,
        sameSite: true,
        secure: false,
    },
    rolling: true
};

const service = {
    activeSession : activeSession,
    SESSION_NAME : SESSION_NAME,
    SESSION_EXPIRATION_TIME : SESSION_EXPIRATION_TIME,
    SESSION_REPLACEMENT_FREQUENCY : SESSION_REPLACEMENT_FREQUENCY
}

module.exports = service;