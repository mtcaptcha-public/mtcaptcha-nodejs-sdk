const request = require('request');

/**
 * @class MTCaptchaLib 
 * @description MTCaptcha Library SDK to check whether captcha verification token is valid or not.
 * @requires privateKey
 */
class MTCaptchaLib {

    constructor(privateKey) {
        this.mtcapPrivateKey = privateKey;
    }

    validateTokenDetail(verificationToken, callback) {
        if (!verificationToken && callback) {
            callback({ "success": false, "error": "Verification token required." });
            return;
        }
        var checkTokenURI = "https://service.mtcaptcha.com/mtcv1/api/checktoken.json";
        request.get({
            'rejectUnauthorized': false,
            'url': checkTokenURI,
            'qs': {
                'privatekey': this.mtcapPrivateKey,
                'token': verificationToken
            }
        }, (error, response, body) => {
            if (error && !response && callback) {
                callback(JSON.parse(error));
                return;
            }
            if (body && callback) {
                callback(JSON.parse(body));
                return;
            }
        });
    }

    validateToken(verificationToken, callback) {
        this.validateTokenDetail(verificationToken, function(response){
            if(callback){
                callback({ "valid": response.success });
                return;
            }
        });
    }

}

exports.MTCaptchaLib = MTCaptchaLib;
