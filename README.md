MTCaptcha NodeJS SDK
===============
Integrate MTCaptcha (https://www.mtcaptcha.com/) node module with any NodeJS Website

# node-mtcaptcha

mtcaptcha-nodejs-sdk verifies MTCaptcha (https://www.mtcaptcha.com/)


## Installation

Via git:

    $ git clone git://github.com/mtcaptcha-public/mtcaptcha-nodejs-sdk.git ~/.node_libraries/mtcaptcha-nodejs-sdk

Via npm:

    $ npm install mtcaptcha

## Setup

Before you can use this module, you must visit https://www.mtcaptcha.com/ and create a account in https://admin.mtcaptcha.com/login
to request a public and private key for your domain.

- Import module 
`const MTCaptchaLib = require('mtcaptcha').MTCaptcha;`
- Create an instance of MTCaptcha module with the private key and verified token
`const mtcapInstance = new MTCaptchaLib(MTCaptchaConfig['MTCAPTCHA_PRIVATE_KEY'],req.body['verifiedtoken']);`

- Use this instance to verify the token obtained
`mtcapInstance.verify(function (tokenValidationResponse) {}`

- Sample implementation link: https://github.com/mtcaptcha-public/mtcaptcha-nodejs-sample-api
