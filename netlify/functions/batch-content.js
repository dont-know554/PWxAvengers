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
    console.log('Raw URL:', event.rawUrl);
    console.log('Headers:', event.headers);
    
    // Extract parameters from the original URL using regex
    // The original URL is available in event.rawUrl or we can parse from headers
    const originalUrl = event.rawUrl || event.headers['x-forwarded-for'] || event.path;
    console.log('Original URL:', originalUrl);
    
    // Parse the URL to extract parameters
    let batchId, subjectSlug, scheduleId;
    
    // Try to match the pattern: /api/batch/{batchId}/subject/{subjectSlug}/schedule/{scheduleId}/content
    const urlMatch = originalUrl.match(/\/api\/batch\/([^/]+)\/subject\/([^/]+)\/schedule\/([^/]+)\/content/);
    
    if (urlMatch) {
      batchId = urlMatch[1];
      subjectSlug = urlMatch[2];
      scheduleId = urlMatch[3];
    } else {
      // Fallback: try to extract from path segments if redirect didn't work as expected
      const pathSegments = event.path.split('/');
      console.log('Path segments:', pathSegments);
      
      // Look for the pattern in path segments
      const batchIndex = pathSegments.indexOf('batch');
      const subjectIndex = pathSegments.indexOf('subject');
      const scheduleIndex = pathSegments.indexOf('schedule');
      
      if (batchIndex !== -1 && subjectIndex !== -1 && scheduleIndex !== -1) {
        batchId = pathSegments[batchIndex + 1];
        subjectSlug = pathSegments[subjectIndex + 1];
        scheduleId = pathSegments[scheduleIndex + 1];
      }
    }
    
    console.log('Extracted parameters:', { batchId, subjectSlug, scheduleId });
    
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
