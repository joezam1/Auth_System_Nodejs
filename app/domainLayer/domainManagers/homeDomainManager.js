const antiForgeryTokenService = require('../../services/csrfProtection/antiForgeryTokenService.js');
const antiForgeryTokenHelper = require('../../services/csrfProtection/antiForgeryTokenHelper.js');
const httpResponseService = require('../../services/httpProtocol/httpResponseService.js');
const httpResponseStatus = require('../../library/enumerations/httpResponseStatus.js');
const antiForgeryTokenExpiredInspector = require('../../middleware/antiForgeryTokenExpiredInspector.js');


//Test: DONE
const resolveGetResourcesAsync = async function(request){

    let csrfToken = await getCsrfTokenAsync(request);
    antiForgeryTokenExpiredInspector.resolveRemoveExpiredTokens();
    return httpResponseService.getResponseResultStatus(csrfToken, httpResponseStatus._200ok);
}

const service = Object.freeze({
    resolveGetResourcesAsync : resolveGetResourcesAsync
});
module.exports = service;


//#REGION Private Functions
async function getCsrfTokenAsync(request){
    let referer = request.headers.referer;
    let origin = request.headers.origin;
    let userAgent = request.headers['user-agent'];
    let csrfToken  =await antiForgeryTokenService.createAntiForgeryTokenAsync();

    antiForgeryTokenHelper.saveCsrfTokenDataToStorage( referer, origin, userAgent,csrfToken );

    return csrfToken;
}

//#ENDREGION Private Functions