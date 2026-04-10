# mtcaptcha (Node.js SDK)

Node.js module for **server-side** [MTCaptcha](https://www.mtcaptcha.com) token verification with TypeScript types. MTCaptcha helps protect your applications against spam and automated abuse. Use this package on your backend after the client widget produces a verification token (for example from login, registration, contact forms, or any custom flow).

## Top Highlights of MTCaptcha

- GDPR compliance
- Enterprise friendly
- Accessibility compliance
- Adaptive risk engine
- High availability around the world

## Summary of Features

- Verifies tokens against MTCaptcha’s `checktoken` API over HTTPS.
- Optional parameters for token expiry and duplicate-check behavior.
- Supports standard and explicit ACL verification endpoints.

## Prerequisites

- **Node.js** 14 or higher (aligned with the library build target)
- **MTCaptcha account** with a **private key** for your domain (from the [MTCaptcha admin console](https://admin.mtcaptcha.com/login))

The client side must collect a token using your **site key**; this module only validates that token on the server using the **private key**.

## Installation

```bash
npm install mtcaptcha
```

## Basic Usage

Use the [MTCaptcha demo site](https://service-origin.mtc4ptch4.com/mtcv1/demo/) to configure the client widget. Send the resulting token to your server, then verify it:

```js
const MTCaptcha = require('mtcaptcha');

const captcha = new MTCaptcha({
  privateKey: 'YOUR_PRIVATE_KEY',
});

async function handleSubmit(req, res) {
  const token = req.body.mtcaptchaToken;
  const result = await captcha.verify(token);

  if (!result.success) {
    return res.status(400).json({
      fail_codes: result.fail_codes,
      tokeninfo: result.tokeninfo,
    });
  }

  // Token is valid — continue with login, signup, etc.
  return res.json({ ok: true });
}
```

By default, CheckToken requests go to `https://service.mtcaptcha.com`. Set `explicitAcl: true` if you need the `https://service2.mtcaptcha.com` endpoint for outbound firewall rules (see `explicitAcl` below).

## Constructor Options

Optional CheckToken fields are sent as query parameters when set.

| Name                         | Type      | Required | Default | Description                                                                 |
| ---------------------------- | --------- | -------- | ------- | --------------------------------------------------------------------------- |
| `privateKey`                 | `string`  | Yes      | —       | Your MTCaptcha private key (server secret).                                 |
| `tokenExpireMiniSec`         | `number`  | No       | —       | Sets the minimum expiration time (TTL) in **seconds** for the verified token so it can stay valid longer than the default (commonly **60–120** seconds). Applied only if larger than MTCaptcha’s default. Must be an integer; **max 1200** (20 minutes). Example: `300`. |
| `tokenDuplicateCallMaxCount` | `number`  | No       | —       | Raises the duplicate-call limit from the default of **one** CheckToken call per token to several. Must be an integer; **max 20**. Example: `5`. |
| `explicitAcl`                | `boolean` | No       | `false` | For server environments that **must** restrict outbound traffic with explicit firewall ACLs: when `true`, CheckToken uses **`service2.mtcaptcha.com`**, which supports allowlisting by **explicit IP addresses**. Leave `false` for the standard **`service.mtcaptcha.com`** URL.   |

## `verify(token)` Result

`verify` returns a `Promise` that always resolves (it does not reject on HTTP or parse errors). **Use `fail_codes` as the only error surface:** API failures and SDK issues (empty token, bad JSON, network) all add entries in the same `{ [code]: message }` shape. Optional `tokeninfo` is present when the CheckToken body includes it.

```ts
interface VerificationResult {
  success: boolean;
  fail_codes?: FailCode[];
  tokeninfo?: VerificationTokenInfo;
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

// Each fail code is a single-key object, e.g. { 'invalid-token': '...' }
interface FailCode {
  [key: string]: string;
}
```

SDK-only `fail_codes` examples (same shape): `{ 'missing-input-token': 'Verification token required.' }`, `{ 'bad-request': 'Invalid JSON response: …' }`, `{ 'network-error': '…' }`.

For full product and integration documentation, see the official [MTCaptcha docs](https://docs.mtcaptcha.com/dev-guide-quickstart).

## License

MIT License — see the [LICENSE](https://github.com/mtcaptcha-public/mtcaptcha-nodejs-sdk/blob/master/LICENSE) file in the repository when available.

## Support

For issues and feature requests, use the [GitHub issue tracker](https://github.com/mtcaptcha-public/mtcaptcha-nodejs-sdk/issues).
