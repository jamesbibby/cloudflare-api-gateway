// The base url for the site
const baseURL = '.bibs.codes';

/**
The actual request handler
Remaps the URL from: api.bibs.codes/service_name to service_name.bibs.codes
**/
async function handleRequest(request) {
  const url = new URL(request.url);
  // skip the leading '/' and split the request
  const parts = url.pathname.substring(1).split('/');
  if (parts.length === 0 || parts[0] === '') {
    // if there is no service name, return a 404
    return new Response('Service Not Provided', { status: 404 });
  }
  const serviceURL = ''.concat(
    url.protocol, // use the same protocol
    '//',
    parts[0], // the service name
    '.bibs.codes/',
    parts.slice(1).join('/'), // the rest of the path after the service name
    url.search // the query string
  );
  return fetch(serviceURL, request);
}

/**
Register the request handler
**/
self.addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
