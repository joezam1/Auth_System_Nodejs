const httpResponseStatus = Object.freeze({
    _200ok:200,
    _201created:201,
    _202accepted:202,
    _203nonAuthInfo:203,
    _204noContent:204,
    _301movedPermanently:301,
    _302found:302,
    _303seeOther:303,
    _400badRequest:400,
    _401unauthorized:401,
    _402paymentRequired:402,
    _403forbidden:403,
    _404notFound:404,
    _405methodNotAllowed:405,
    _406notAcceptable:406,
    _407proxyAuthRequired:407,
    _408requestTimeout:408,
    _409conflict:409,
    _422unprocessableEntity:422,
    200:'200ok',
    201:'201created',
    202:'202accepted',
    203:'203nonAuthInfo',
    204:'204noContent',
    301:'301movedPermanently',
    302:'302found',
    303:'seeOther',
    400:'badRequest:400',
    401:'Unauthorized401',
    402:'paymentRequired',
    403:'forbidden',
    404:'notFound',
    405:'methodNotAllowed',
    406:'notAcceptable',
    407:'proxyAuthRequired',
    408:'requestTimeout',
    409:'conflict',
    422:'unprocessableEntity'
});

module.exports = httpResponseStatus