/**
 * upload-sdk.mjs — Minify outrun.js and upload to S3-compatible CDN (SeaweedFS).
 *
 * Uses AWS Signature V4 with built-in crypto + fetch. No extra dependencies.
 * Exits 0 always — upload failure never breaks the build.
 *
 * Required env vars (all prefixed SDK_ to avoid collisions):
 *   SDK_S3_ENDPOINT          e.g. https://10.96.146.78:8333
 *   SDK_S3_BUCKET            e.g. bucket-6459ea3f-...
 *   SDK_AWS_ACCESS_KEY_ID
 *   SDK_AWS_SECRET_ACCESS_KEY
 */

import { readFileSync } from 'fs';
import { createHash, createHmac } from 'crypto';
import { minify } from 'terser';

const TAG = '[sdk-upload]';

const {
  SDK_S3_ENDPOINT,
  SDK_S3_BUCKET,
  SDK_AWS_ACCESS_KEY_ID,
  SDK_AWS_SECRET_ACCESS_KEY,
} = process.env;

if (!SDK_AWS_ACCESS_KEY_ID || !SDK_S3_ENDPOINT || !SDK_S3_BUCKET || !SDK_AWS_SECRET_ACCESS_KEY) {
  console.log(`${TAG} Skipping — SDK_S3_* env vars not set (local build)`);
  process.exit(0);
}

// ── helpers ──────────────────────────────────────────────────────────────────

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

function hmacSha256(key, data) {
  return createHmac('sha256', key).update(data).digest();
}

function signingKey(secret, date, region, service) {
  let k = hmacSha256(`AWS4${secret}`, date);
  k = hmacSha256(k, region);
  k = hmacSha256(k, service);
  k = hmacSha256(k, 'aws4_request');
  return k;
}

// ── S3 PUT with Signature V4 ────────────────────────────────────────────────

async function putObject(endpoint, bucket, key, body, contentType) {
  const url = new URL(`/${bucket}/${key}`, endpoint);
  const region = 'us-east-1';
  const service = 's3';
  const now = new Date();
  const date = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z/, 'Z'); // 20260306T120000Z
  const shortDate = date.slice(0, 8); // 20260306

  const payloadHash = sha256(body);

  const headers = {
    Host: url.host,
    'Content-Type': contentType,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': date,
  };

  // Canonical request
  const signedHeaderKeys = Object.keys(headers).map(h => h.toLowerCase()).sort();
  const signedHeaders = signedHeaderKeys.join(';');
  const canonicalHeaders = signedHeaderKeys.map(h => `${h}:${headers[h.split('-').map((p, i) => i === 0 ? p : p === 'amz' ? p : p === 'sha256' ? p : p).join('-')]}\n`);

  // Build canonical headers properly — lowercase key: trimmed value
  const canonicalHeaderLines = signedHeaderKeys
    .map(k => `${k}:${headers[Object.keys(headers).find(h => h.toLowerCase() === k)].trim()}`)
    .join('\n');

  const canonicalRequest = [
    'PUT',
    `/${bucket}/${key}`,
    '', // no query string
    canonicalHeaderLines + '\n',
    signedHeaders,
    payloadHash,
  ].join('\n');

  const scope = `${shortDate}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    date,
    scope,
    sha256(canonicalRequest),
  ].join('\n');

  const sk = signingKey(SDK_AWS_SECRET_ACCESS_KEY, shortDate, region, service);
  const signature = createHmac('sha256', sk).update(stringToSign).digest('hex');

  const authorization = `AWS4-HMAC-SHA256 Credential=${SDK_AWS_ACCESS_KEY_ID}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(url.toString(), {
    method: 'PUT',
    headers: {
      ...headers,
      Authorization: authorization,
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`S3 PUT failed: ${res.status} ${res.statusText}\n${text}`);
  }

  return res;
}

// ── main ─────────────────────────────────────────────────────────────────────

try {
  console.log(`${TAG} Reading site/assets/js/outrun.js ...`);
  const source = readFileSync('site/assets/js/outrun.js', 'utf-8');

  console.log(`${TAG} Minifying ...`);
  const result = await minify(source, { compress: true, mangle: true });
  const minified = result.code || source;
  console.log(`${TAG} ${source.length} bytes -> ${minified.length} bytes`);

  console.log(`${TAG} Uploading to ${SDK_S3_ENDPOINT}/${SDK_S3_BUCKET}/sdk/outrun.min.js ...`);
  await putObject(SDK_S3_ENDPOINT, SDK_S3_BUCKET, 'sdk/outrun.min.js', minified, 'application/javascript');

  console.log(`${TAG} Upload complete.`);
} catch (err) {
  console.error(`${TAG} WARNING: ${err.message}`);
  console.error(`${TAG} Build continues — SDK upload is non-blocking.`);
  process.exit(0);
}
