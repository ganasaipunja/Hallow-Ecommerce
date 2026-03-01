import urllib.request
import urllib.error
import json

BASE_URL = 'http://127.0.0.1:8000/api'

def request(url, method='GET', headers=None):
    if headers is None:
        headers = {}
    headers['Content-Type'] = 'application/json'
    
    req = urllib.request.Request(url, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.load(response)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()
    except Exception as e:
        return 999, str(e)

def run():
    print("Testing /products/ (Should be public)...")
    status, data = request(f"{BASE_URL}/products/")
    print(f"Products Status: {status}")
    if status != 200:
        print(f"Products Error: {data}")
    else:
        print(f"Products Count: {len(data)}")

    print("\nTesting /cart/ with BAD token (Should be 401)...")
    status, data = request(f"{BASE_URL}/cart/", headers={'Authorization': 'Token BADTOKEN'})
    print(f"Cart Status: {status}")
    print(f"Cart Response: {data}")

if __name__ == '__main__':
    run()
