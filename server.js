const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

// MIME types for serving files
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
};

const server = http.createServer((req, res) => {
    
    // Handle API proxy requests
    if (req.url.startsWith('/api/')) {
        if (req.method === 'POST' && req.url === '/api/claude') {
            let body = '';
            
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', () => {
                const requestData = JSON.parse(body);
                const apiKey = requestData.apiKey;
                delete requestData.apiKey; // Remove from body before sending to Anthropic
                
                const options = {
                    hostname: 'api.anthropic.com',
                    path: '/v1/messages',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey,
                        'anthropic-version': '2023-06-01'
                    }
                };
                
                const proxyReq = https.request(options, (proxyRes) => {
                    let responseBody = '';
                    
                    proxyRes.on('data', chunk => {
                        responseBody += chunk;
                    });
                    
                    proxyRes.on('end', () => {
                        res.writeHead(proxyRes.statusCode, {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        });
                        res.end(responseBody);
                    });
                });
                
                proxyReq.on('error', (error) => {
                    console.error('Proxy request error:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: error.message }));
                });
                
                proxyReq.write(JSON.stringify(requestData));
                proxyReq.end();
            });
            
            return;
        }
        
        // Handle OPTIONS for CORS preflight
        if (req.method === 'OPTIONS') {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            res.end();
            return;
        }
    }
    
    // Serve static files
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './accountability-mirror-single.html';
    }
    
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n=================================`);
    console.log(`Accountability Mirror Server Running`);
    console.log(`=================================`);
    console.log(`\nOpen your browser to: http://localhost:${PORT}`);
    console.log(`\nPress Ctrl+C to stop the server\n`);
});
