const httpResponseStatus = require('../../library/enumerations/httpResponseStatus.js');

var statuses = {
    ok200:{
        code:httpResponseStatus._200ok,
        statusText:'ok'
    },
    created201:{
        code:httpResponseStatus._201created,
        statusText:'created'
    },
    accepted202:{
        code:httpResponseStatus._202accepted,
        statusText:'accepted'
    },
    nonAuthInfo203:{
        code:httpResponseStatus._203nonAuthInfo,
        statusText:'non authoritative content'
    },
    noContent204:{
        code:httpResponseStatus._204noContent,
        statusText:'no content'
    },
    movedPermanently301:{
        code:httpResponseStatus._301movedPermanently,
        statusText:'moved permanently'
    },
    found302:{
        code:httpResponseStatus._302found,
        statusText:'found'
    },
    seeOther303:{
        code:httpResponseStatus._303seeOther,
        statusText:'see other'
    },
    badRequest400:{
        code:httpResponseStatus._400badRequest,
        statusText:'bad request'
    },
    unauthorized401:{
        code:httpResponseStatus._401unauthorized,
        statusText:'unauthorized'
    },
    paymentRequired402:{
        code:httpResponseStatus._402paymentRequired,
        statusText:'payment required'
    },
    forbidden403:{
        code:httpResponseStatus._403forbidden,
        statusText:'forbidden'
    },
    notFound404:{
        code:httpResponseStatus._404notFound,
        statusText:'not found'
    },
    methodNotAllowed405:{
        code:httpResponseStatus._405methodNotAllowed,
        statusText:'method not allowed'
    },
    notAcceptable406:{
        code:httpResponseStatus._406notAcceptable,
        statusText:'method not acceptable'
    },
    proxyAuthRequired407:{
        code:httpResponseStatus._407proxyAuthRequired,
        statusText:'proxy authorization required'
    },

    requestTimeout408:{
        code:httpResponseStatus._408requestTimeout,
        statusText:'request timeout'
    },

    conflict409:{
        code:httpResponseStatus._409conflict,
        statusText:'conflict'
    },

    unprocessableEntity422:{
        code:httpResponseStatus._422unprocessableEntity,
        statusText:'unprocessable Entity'
    }

}

module.exports = statuses;