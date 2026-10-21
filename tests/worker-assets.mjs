import assert from 'node:assert/strict';
import { unstable_dev } from 'wrangler';
import worker from '../src/worker.js';

// Exercise the built error document through the real local Workers Assets binding.
const server = await unstable_dev('src/worker.js', {
 config: 'wrangler.jsonc',
 local: true,
 experimental: { disableExperimentalWarning: true },
});
try {
 for (const path of ['/404', '/404/', '/404.html', '/404?probe=a%2Fb', '/404/?probe=a%2Fb', '/404.html?probe=a%2Fb', '/unknown-error-check?probe=1']) {
  for (const method of ['GET', 'HEAD']) {
   const response = await server.fetch(path, { method, redirect: 'manual' });
   assert.equal(response.status, 404, `${method} ${path}`);
   assert.equal(response.headers.get('x-robots-tag'), 'noindex');
   assert.equal(response.headers.get('location'), null);
   const body = await response.text();
   if (method === 'HEAD') assert.equal(body, '');
   else {
    assert.match(body, /This path ends here/);
    assert.match(body, /name="robots" content="noindex/);
   }
   assert.match(response.headers.get('content-security-policy'), /default-src 'self'/);
  }
 }
 for (const path of ['/', '/privacy/', '/terms/', '/cookies/']) {
  const response = await server.fetch(path);
  assert.equal(response.status, 200, path);
  assert.equal(response.headers.get('x-robots-tag'), null);
 }
 // Redirect branches execute before Assets and must preserve path/query.
 for (const host of ['donapaulagoa.com', 'www.donapaulagoa.com']) {
  for (const protocol of ['http:', 'https:']) {
   if (host === 'donapaulagoa.com' && protocol === 'https:') continue;
   for (const method of ['GET', 'HEAD']) {
    const response = await worker.fetch(new Request(`${protocol}//${host}/404.html?probe=a%2Fb`, {method}), {
     ASSETS: { fetch() { throw new Error('Redirect must precede Assets'); } },
    });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), 'https://donapaulagoa.com/404.html?probe=a%2Fb');
   }
  }
 }
 console.log('PASS: real Worker + Assets GET/HEAD error aliases and query strings; normal pages; host/protocol redirect branch invariants.');
} finally {
 await server.stop();
}
