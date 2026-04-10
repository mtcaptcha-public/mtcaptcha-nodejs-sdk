const https = require('node:https');

const MTCAPTCHA_SERVICE1_HOST = 'service.mtcaptcha.com';
const MTCAPTCHA_SERVICE2_HOST = 'service2.mtcaptcha.com';

interface FailCode {
    [key: string]: string;
}

interface FailMessageMap {
    [key: string]: string;
}

interface VerificationTokenInfo {
    v: string;
    code: number;
    codeDesc: string;
    tokID: string;
    timestampSec: number;
    timestampISO: string;
    hostname: string;
    isDevHost: boolean;
    action: string;
    ip: string;
    ipCountry: string;
    riskType: string;
    riskInfo: string;
}

interface VerificationResult {
    success: boolean;
    tokeninfo?: VerificationTokenInfo;
    fail_codes?: FailCode[];
}

interface MTCaptchaOptions {
    privateKey: string;
    tokenExpireMiniSec?: number;
    tokenDuplicateCallMaxCount?: number;
    explicitAcl?: boolean;
}

interface MTCaptchaInstance {
    options: MTCaptchaOptions;
    verify(token: string): Promise<VerificationResult>;
}

const failMsg: FailMessageMap = {
    'token-expired': 'The token has expired. Commonly 120 seconds. Can be longer depending on captcha type.',
    'token-duplicate-cal': 'The token has been checked already, and thus should not be used.',
    'bad-request': 'General error for unexpected bad/malformed requests.',
    'missing-input-privatekey': 'The parameter privatekey is missing',
    'missing-input-token': 'The parameter token is missing',
    'invalid-privatekey': 'The privatekey provided is not valid',
    'invalid-token': 'The token is not valid',
    'invalid-token-faildecrypt': 'The token is not valid and failed during decryption',
    'privatekey-mismatch-token': 'The token and the privatekey do not match. i.e., the token was created from another sitekey.',
    'expired-sitekey-or-account': 'The sitekey/privatekey is no longer valid due to expiration or account closure.',
    'network-error': 'Failed to reach MTCaptcha service.',
}

function failCodeEntry(element: string): FailCode {
    return { [element]: failMsg[element] || 'Something went wrong' };
}

function sdkFailCode(code: string, message: string): FailCode {
    return { [code]: message };
}

function normalizeFailCodeItem(item: unknown): FailCode {
    if (typeof item === 'string') {
        return failCodeEntry(item);
    }
    if (item && typeof item === 'object' && !Array.isArray(item)) {
        const record = item as Record<string, unknown>;
        const keys = Object.keys(record);
        if (keys.length === 1) {
            const k = keys[0];
            const v = record[k];
            return { [k]: typeof v === 'string' ? v : String(v) };
        }
    }
    return { 'bad-request': 'Something went wrong' };
}

function withNormalizedFailCodes(body: unknown): VerificationResult {
    const response = body as VerificationResult;
    const rawFail = (response as { fail_codes?: unknown }).fail_codes;
    if (Array.isArray(rawFail) && rawFail.length > 0) {
        response.fail_codes = rawFail.map(normalizeFailCodeItem);
    }
    return response;
}

function jsonParseErrorResult(error: unknown): VerificationResult {
    const message = error instanceof Error ? error.message : String(error);
    const text = `Invalid JSON response: ${message}`;
    return {
        success: false,
        fail_codes: [sdkFailCode('bad-request', text)],
    };
}

function MTCaptcha(this: MTCaptchaInstance, options: MTCaptchaOptions): MTCaptchaInstance {
    this.options = options;
    return this;
}

MTCaptcha.prototype.verify = function (token: string): Promise<VerificationResult> {
    return new Promise((resolve, reject) => {
        if (!token) {
            const msg = 'Verification token required.';
            resolve({
                success: false,
                fail_codes: [sdkFailCode('missing-input-token', msg)],
            });
            return;
        }
        const baseUrl = this.options.explicitAcl
            ? `https://${MTCAPTCHA_SERVICE2_HOST}/mtcv1/api/checktoken`
            : `https://${MTCAPTCHA_SERVICE1_HOST}/mtcv1/api/checktoken`;
        const url = new URL(baseUrl);
        url.searchParams.set('privatekey', this.options.privateKey);
        url.searchParams.set('token', token);
        if (this.options.tokenExpireMiniSec !== undefined) {
            url.searchParams.set('tokenExpireMiniSec', this.options.tokenExpireMiniSec.toString());
        }
        if (this.options.tokenDuplicateCallMaxCount !== undefined) {
            url.searchParams.set('tokenDuplicateCallMaxCount', this.options.tokenDuplicateCallMaxCount.toString());
        }

        https.get(url.toString(), (res: any) => {
            let data = '';
            res.on('data', (chunk: any) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(withNormalizedFailCodes(JSON.parse(data)));
                } catch (error: unknown) {
                    resolve(jsonParseErrorResult(error));
                }
            });
        }).on('error', (err: any) => {
            const msg = err.message;
            resolve({
                success: false,
                fail_codes: [sdkFailCode('network-error', msg)],
            });
        });
    });
}


module.exports = MTCaptcha;