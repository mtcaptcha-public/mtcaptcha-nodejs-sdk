const request = require('request');

var MTCaptcha = exports.MTCaptcha = function MTCaptcha(private_key, data) {
    this.private_key = private_key;
    this.data = data
    return this;
}
var failMsg = {
    'token-expired': 'The token has expired.',
    'token-duplicate-cal': 'The token has been verified already.',
    'bad-request': 'The request is invalid or malformed.',
    'missing-input-privatekey': '`privatekey` parameter is missing',
    'missing-input-token': ' ‘token’ parameter is missing.',
    'invalid-privatekey': 'The private key is invalid or malformed.',
    'invalid-token': 'The token parameter is invalid or malformed.',
    'invalid-token-faildecrypt': 'The token parameter is invalid or malformed.',
    'privatekey-mismatch-token': 'The token and the privatekey does not match.',
    'expired-sitekey-or-account': 'The sitekey/privatekey is no longer valid due to expiration or account closure.',
    'network-error': 'Something went wrong!',
    'unknown-error': 'Something went wrong!',
}
MTCaptcha.prototype.verify = function (callback) {

    if (!this.data && callback) {
        callback({ "success": false, "error": "Verification token required." });
        return;
    }
    var checkTokenURI = "https://service.mtcaptcha.com/mtcv1/api/checktoken.json";
    request.get({
        'rejectUnauthorized': false,
        'url': checkTokenURI,
        'qs': {
            'privatekey': this.private_key,
            'token': this.data
        }
    }, (error, response, body) => {
        if (error && !response && callback) {
            callback(JSON.parse(error));
            return;
        }
        if (body && callback) {
            var tokenValidationResponse = JSON.parse(body);
            if (tokenValidationResponse.fail_codes) {
                var failCodeList = [];
                tokenValidationResponse.fail_codes.forEach(element => {
                    var tokenValidationResponse = {};
                    tokenValidationResponse[element] = failMsg[element] || "Something went wrong";
                    failCodeList.push(tokenValidationResponse);
                });
                tokenValidationResponse.fail_codes = failCodeList;
            }
            callback(tokenValidationResponse);
            return;
        }
    });

}