const axios = require('axios');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { page, limit, q } = event.queryStringParameters || {};
    let apiUrl = `https://pw-api1-ab3091004643.herokuapp.com/api/batches?page=${page}&limit=${limit}`;
    
    // Add search query parameter if provided
    if (q) {
      apiUrl += `&q=${encodeURIComponent(q)}`;
    }
    
    // Forward the request to the actual API
    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Proxy error:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Proxy request failed' })
    };
  }
};
