export default {
 async fetch(request, env) {
  const url = new URL(request.url);
  const isSiteHost = ['donapaulagoa.com', 'www.donapaulagoa.com'].includes(url.hostname);
  if (isSiteHost && (url.protocol !== 'https:' || url.hostname !== 'donapaulagoa.com')) {
   url.protocol = 'https:'; url.hostname = 'donapaulagoa.com'; url.port = '';
   return Response.redirect(url.href, 301);
  }
  if (url.pathname === '/index.html' || url.pathname.endsWith('/index.html')) {
   url.pathname = url.pathname.slice(0, -10) || '/';
   return Response.redirect(url.href, 301);
  }
  const response = await env.ASSETS.fetch(request);
  if (response.status !== 404) return response;
  const headers = new Headers(response.headers); headers.set('X-Robots-Tag', 'noindex');
  return new Response(response.body, {status:404, headers});
 }
};
