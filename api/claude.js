const https = require('https');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only handle POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Get the request body (Vercel handles parsing automatically)
    const { apiKey, ...anthropicRequest } = req.body;
    
    if (!apiKey) {
      res.status(400).json({ error: 'API key is required' });
      return;
    }

    // Prepare request to Anthropic
    const data = JSON.stringify(anthropicRequest);
    
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    // Make request to Anthropic API
    const apiRequest = https.request(options, (apiResponse) => {
      let responseBody = '';

      apiResponse.on('data', (chunk) => {
        responseBody += chunk;
      });

      apiResponse.on('end', () => {
        try {
          const jsonResponse = JSON.parse(responseBody);
          res.status(apiResponse.statusCode).json(jsonResponse);
        } catch (e) {
          console.error('Failed to parse Anthropic response:', responseBody);
          res.status(500).json({ error: 'Invalid response from Anthropic API' });
        }
      });
    });

    apiRequest.on('error', (error) => {
      console.error('Error calling Anthropic API:', error);
      res.status(500).json({ error: error.message });
    });

    apiRequest.write(data);
    apiRequest.end();

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
};
