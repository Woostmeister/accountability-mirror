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

  // Only handle POST to /api/claude
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const requestData = req.body;
    const apiKey = requestData.apiKey;
    
    if (!apiKey) {
      res.status(400).json({ error: 'API key is required' });
      return;
    }

    // Remove API key from body before sending to Anthropic
    delete requestData.apiKey;

    // Prepare request to Anthropic
    const data = JSON.stringify(requestData);
    
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': data.length
      }
    };

    // Make request to Anthropic API
    const apiRequest = https.request(options, (apiResponse) => {
      let responseBody = '';

      apiResponse.on('data', (chunk) => {
        responseBody += chunk;
      });

      apiResponse.on('end', () => {
        res.status(apiResponse.statusCode).json(JSON.parse(responseBody));
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
