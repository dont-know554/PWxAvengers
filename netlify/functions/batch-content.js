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
    // Log the incoming request for debugging
    console.log('Incoming request path:', event.path);
    console.log('HTTP Method:', event.httpMethod);
    
    // Extract parameters from the path
    const pathSegments = event.path.split('/');
    console.log('Path segments:', pathSegments);
    
    const batchId = pathSegments[3];
    const subjectSlug = pathSegments[5];
    const scheduleId = pathSegments[7];
    
    // Validate required parameters
    if (!batchId || !subjectSlug || !scheduleId) {
      console.error('Missing parameters:', { batchId, subjectSlug, scheduleId });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required parameters',
          details: { batchId, subjectSlug, scheduleId },
          path: event.path,
          pathSegments
        })
      };
    }
    
    const apiUrl = `https://pw-api1-ab3091004643.herokuapp.com/api/batch/${batchId}/subject/${subjectSlug}/schedule/${scheduleId}/content`;
    console.log('Proxying to:', apiUrl);
    
    // Forward the request to the actual API
    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000 // 30 second timeout
    });
    
    console.log('API response status:', response.status);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Detailed proxy error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method
      }
    });
    
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({ 
        error: 'Proxy request failed',
        details: {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url
        }
      })
    };
  }
};
