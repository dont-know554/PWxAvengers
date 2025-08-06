const axios = require('axios');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': true
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Length': '0'
      },
      body: ''
    };
  }

  // Token authentication
  const authHeader = event.headers.authorization || event.headers.Authorization;
  const expectedToken = `Bearer ${process.env.API_AUTH_TOKEN}`;
  
  if (!authHeader || authHeader !== expectedToken) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized access' })
    };
  }

  try {
    const { batch_id, schedule_id } = event.queryStringParameters || {};
    const apiUrl = `https://pw-api1-ab3091004643.herokuapp.com/api/url?batch_id=${batch_id}&schedule_id=${schedule_id}`;
    
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
