const request =  require('request');

var MTCaptcha =  exports.MTCaptcha  = function MTCaptcha(private_key, data) {
    this.private_key = private_key;
    this.data = data
    return this;
}
MTCaptcha.prototype.verify =  function(callback){

    if (!this.data && callback) {
        callback({ "success": false, "error": "Verification token required." });
        return;
    }
    var checkTokenURI = "https://sysvinemp011.local/mtcv1/api/checktoken.json";
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
            callback(JSON.parse(body));
            return;
        }
    });

}