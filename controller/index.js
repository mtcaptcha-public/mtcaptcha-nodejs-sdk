const MTCaptchaLib = require('.././lib/MTCaptchaLib').MTCaptchaLib;
const MTCaptchaConfig = require('.././config/config.json');

/**
 * @method demoValidateToken
 * @description Validate the verification token to identify whether it is valid or not.
 * @returns JSON
 */
exports.demoValidateToken = function (req, res) {
    const mtcapInstance = new MTCaptchaLib(MTCaptchaConfig['MTCAPTCHA_PRIVATE_KEY']);
    mtcapInstance.validateTokenDetail(req.body['mtcaptcha-verifiedtoken'], function (tokenValidationResponse) {
        return res.send(tokenValidationResponse);
    });
}
