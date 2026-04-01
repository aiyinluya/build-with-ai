import urllib.request
import json
import os

port = os.environ.get('AUTH_GATEWAY_PORT', '19000')
url = 'http://localhost:' + port + '/proxy/prosearch/search'
payload = {'keyword': 'deer-flow bytedance multi-agent framework github'}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data)
req.add_header('Content-Type', 'application/json')
try:
    resp = urllib.request.urlopen(req, timeout=15)
    result = resp.read().decode('utf-8')
    print(result)
except Exception as e:
    print('ERROR: ' + str(e))
