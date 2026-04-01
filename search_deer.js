const http = require('http');

const port = process.env.AUTH_GATEWAY_PORT || '19000';
const url = `http://localhost:${port}/proxy/prosearch/search`;

const postData = JSON.stringify({ keyword: 'deer-flow bytedance multi-agent framework' });

const options = {
  hostname: 'localhost',
  port: port,
  path: '/proxy/prosearch/search',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log(data); });
});

req.on('error', (e) => {
  console.error('ERROR: ' + e.message);
});

req.write(postData);
req.end();
