import urllib.request
import urllib.parse
import urllib.error
import json
import sys

from typing import Dict, Any, Optional

BASE_URL = 'http://127.0.0.1:8000/api'

def request(url: str, method: str = 'GET', data: Optional[Dict[str, Any]] = None, headers: Optional[Dict[str, str]] = None):
    req_headers = headers.copy() if headers else {}
    req_headers['Content-Type'] = 'application/json'
    
    encoded_data = None
    if data:
        encoded_data = json.dumps(data).encode('utf-8')
    
    req = urllib.request.Request(url, data=encoded_data, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.load(response)
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())

def run():
    # 1. Register
    username = 'test_user_repro_2'
    password = 'test_password'
    email = 'test2@example.com'
    
    print(f"Registering user: {username}...")
    status, data = request(f"{BASE_URL}/auth/register/", 'POST', {
        'username': username,
        'password': password,
        'email': email
    })
    
    token = None
    if status == 201:
        print("Registration successful.")
        token = data['token']
    elif status == 400 and 'username' in data:
        print("User already exists, trying login...")
        status, data = request(f"{BASE_URL}/auth/login/", 'POST', {
            'username': username,
            'password': password
        })
        if status == 200:
            print("Login successful.")
            token = data['token']
        else:
            print(f"Login failed: {status} {data}")
            return
    else:
        print(f"Registration failed: {status} {data}")
        return

    print(f"Token: {token}")

    # 2. Access Cart
    print("Accessing Cart...")
    headers = {'Authorization': f'Token {token}'}
    status, data = request(f"{BASE_URL}/cart/", 'GET', headers=headers)
    
    print(f"Cart Response: {status}")
    print(data)

if __name__ == '__main__':
    run()
