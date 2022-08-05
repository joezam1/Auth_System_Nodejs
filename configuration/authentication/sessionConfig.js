
const TWENTYFOUR_HOURS_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
const THREE_HOURS_IN_MILLISECONDS = 1000 * 60 * 60 * 3;
const FIFTEEN_MINUTES_IN_MILLISECONDS = 1000 * 60 * 15;
const FIVE_MINUTES_IN_MILLISECONDS = 1000 * 60 * 5;
const THREE_MINUTES_IN_MILLISECONDS= 1000 * 60 * 3;
const ONE_MINUTE_IN_MILLISECONDS = 1000 * 60 * 1;
const ONE_SECOND_IN_MILLISECONDS = 1000;
const SESSION_NAME = 'loginUserSession';
const SESSION_SECRET = 'longsecretstringtopreventfromguessingthesessions';
const SESSION_EXPIRATION_TIME_IN_MILLISECONDS = FIFTEEN_MINUTES_IN_MILLISECONDS;
const SESSION_REFRESH_FREQUENCY_IN_MILLISECONDS = THREE_MINUTES_IN_MILLISECONDS;

const activeSession = {
    name: SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {
        path: '/',
        maxAge: THREE_MINUTES_IN_MILLISECONDS,
        sameSite: true,
        secure: false,
    },
    rolling: true
};

const service = {
    activeSession : activeSession,
    SESSION_NAME : SESSION_NAME,
    ONE_SECOND_IN_MILLISECONDS:ONE_SECOND_IN_MILLISECONDS,
    ONE_MINUTE_IN_MILLISECONDS:ONE_MINUTE_IN_MILLISECONDS,
    SESSION_EXPIRATION_TIME_IN_MILLISECONDS : SESSION_EXPIRATION_TIME_IN_MILLISECONDS,
    SESSION_REFRESH_FREQUENCY_IN_MILLISECONDS : SESSION_REFRESH_FREQUENCY_IN_MILLISECONDS
}

module.exports = service;