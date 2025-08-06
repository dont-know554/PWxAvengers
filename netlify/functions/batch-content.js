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
    // Extract parameters from the path
    const pathSegments = event.path.split('/');
    const batchId = pathSegments[4];
    const subjectSlug = pathSegments[5];
    const scheduleId = pathSegments[6];
    
    const apiUrl = `https://pw-api1-ab3091004643.herokuapp.com/api/batch/${batchId}/subject/${subjectSlug}/schedule/${scheduleId}/content`;
    
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
