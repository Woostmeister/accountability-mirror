#!/usr/bin/env python3
import http.server
import socketserver
import json
import urllib.request
import urllib.error
from urllib.parse import urlparse

PORT = 8000

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        """Handle POST requests to proxy API calls"""
        if self.path == '/api/claude':
            # Read the request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                # Parse the request
                request_data = json.loads(post_data.decode('utf-8'))
                api_key = request_data.pop('apiKey')  # Remove API key from body
                
                # Create request to Anthropic API
                api_url = 'https://api.anthropic.com/v1/messages'
                headers = {
                    'Content-Type': 'application/json',
                    'x-api-key': api_key,
                    'anthropic-version': '2023-06-01'
                }
                
                # Make the API request
                req = urllib.request.Request(
                    api_url,
                    data=json.dumps(request_data).encode('utf-8'),
                    headers=headers,
                    method='POST'
                )
                
                try:
                    with urllib.request.urlopen(req) as response:
                        response_data = response.read()
                        
                        # Send successful response
                        self.send_response(200)
                        self.send_header('Content-Type', 'application/json')
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.end_headers()
                        self.wfile.write(response_data)
                        
                except urllib.error.HTTPError as e:
                    # Forward API errors to the client
                    error_data = e.read()
                    self.send_response(e.code)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(error_data)
                    
            except Exception as e:
                # Handle any other errors
                error_response = json.dumps({
                    'error': {
                        'message': str(e),
                        'type': 'proxy_error'
                    }
                }).encode('utf-8')
                
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(error_response)
        else:
            # Return 404 for other POST endpoints
            self.send_response(404)
            self.end_headers()
    
    def do_GET(self):
        """Serve static files"""
        # Default to serving accountability-mirror-single.html for root
        if self.path == '/':
            self.path = '/accountability-mirror-single.html'
        
        return http.server.SimpleHTTPRequestHandler.do_GET(self)
    
    def log_message(self, format, *args):
        """Custom logging to make it cleaner"""
        if self.path.startswith('/api/'):
            print(f"API Request: {args[0]}")
        else:
            # Don't log static file requests to reduce noise
            pass

if __name__ == '__main__':
    print("\n" + "="*50)
    print("  Accountability Mirror Server Running")
    print("="*50)
    print(f"\nOpen your browser to: http://localhost:{PORT}")
    print("\nPress Ctrl+C to stop the server\n")
    print("="*50 + "\n")
    
    with socketserver.TCPServer(("", PORT), ProxyHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nShutting down server...")
            httpd.shutdown()
