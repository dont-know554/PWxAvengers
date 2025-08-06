const axios = require('axios');

exports.handler = async (event, context) => {
  // Define allowed origins (your domains only)
  const allowedOrigins = [
    'https://your-domain.com',
    'https://www.your-domain.com',
    'http://localhost:3000',
    'http://localhost:8888',
    'http://127.0.0.1:8888'
  ];
  
  // Get the origin from the request
  const origin = event.headers.origin || event.headers.Origin;
  
  // Check if the origin is allowed
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
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
    // Extract parameters from the path
    const pathSegments = event.path.split('/');
    const batchId = pathSegments[3];
    const subjectSlug = pathSegments[5];
    const scheduleId = pathSegments[7];
    
    const apiUrl = `https://pw-api1-ab3091004643.herokuapp.com/api/batch/${batchId}/subject/${subjectSlug}/schedule/${scheduleId}/content`;
    
    // Forward the request to the actual API
    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Update headers with the allowed origin
    const responseHeaders = {
      ...headers,
      'Access-Control-Allow-Origin': allowedOrigin
    };
    
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    // Update headers with the allowed origin
    const errorHeaders = {
      ...headers,
      'Access-Control-Allow-Origin': allowedOrigin
    };
    
    return {
      statusCode: 500,
      headers: errorHeaders,
      body: JSON.stringify({ error: 'Proxy request failed' })
    };
  }
};
