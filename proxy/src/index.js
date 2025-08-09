/**
 * PW x AVENGERS API Proxy Worker
 * Cloudflare Worker that proxies requests to the external PW API
 */

const BASE_API_URL = 'https://pw-api1-ab3091004643.herokuapp.com';

// CORS headers for all responses
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Route handlers
const routes = {
  '/api/batches': handleBatches,
  '/api/batch': handleBatch,
  '/api/batch-content': handleBatchContent,
  '/api/todays-schedule': handleTodaysSchedule,
  '/api/topics': handleTopics,
  '/api/all-contents': handleAllContents,
  '/api/video/stream-info': handleStreamInfo,
  '/api/otp': handleOTP,
  '/api/url': handleUrl,
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: CORS_HEADERS,
      });
    }

    // Find matching route
    const handler = findRouteHandler(url.pathname);
    
    if (handler) {
      try {
        return await handler(request, url);
      } catch (error) {
        console.error('Handler error:', error);
        return createErrorResponse('Internal server error', 500);
      }
    }

    return createErrorResponse('Not Found', 404);
  }
};

/**
 * Find the appropriate route handler for a given path
 */
function findRouteHandler(pathname) {
  // Direct match
  if (routes[pathname]) {
    return routes[pathname];
  }

  // Pattern matching for dynamic routes
  if (pathname.startsWith('/api/batch/') && pathname.includes('/subject/') && pathname.includes('/schedule/') && pathname.includes('/content')) {
    return routes['/api/batch-content'];
  }
  
  if (pathname.startsWith('/api/batch/') && pathname.includes('/todays-schedule')) {
    return routes['/api/todays-schedule'];
  }
  
  if (pathname.startsWith('/api/batch/') && pathname.includes('/subject/') && pathname.includes('/topics')) {
    return routes['/api/topics'];
  }
  
  if (pathname.startsWith('/api/batch/') && pathname.includes('/subject/') && pathname.includes('/topic/') && pathname.includes('/all-contents')) {
    return routes['/api/all-contents'];
  }
  
  if (pathname.startsWith('/api/batch/') && !pathname.includes('/subject/')) {
    return routes['/api/batch'];
  }

  return null;
}

/**
 * Generic proxy function
 */
async function proxyRequest(request, url, apiPath) {
  const apiUrl = `${BASE_API_URL}${apiPath}${url.search}`;
  
  const proxyRequest = new Request(apiUrl, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'PW-Avengers-Proxy/1.0',
    },
    body: request.method !== 'GET' ? request.body : undefined,
  });

  const response = await fetch(proxyRequest);
  const data = await response.text();
  
  return new Response(data, {
    status: response.status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Route Handlers
 */
async function handleBatches(request, url) {
  return proxyRequest(request, url, '/api/batches');
}

async function handleBatch(request, url) {
  const pathParts = url.pathname.split('/');
  const batchId = pathParts[3]; // /api/batch/{batchId}
  return proxyRequest(request, url, `/api/batch/${batchId}`);
}

async function handleBatchContent(request, url) {
  // Extract path parameters from URL like: /api/batch/{batchId}/subject/{subjectSlug}/schedule/{scheduleId}/content
  const pathParts = url.pathname.split('/');
  const batchId = pathParts[3];
  const subjectSlug = pathParts[5];
  const scheduleId = pathParts[7];
  
  const apiPath = `/api/batch/${batchId}/subject/${subjectSlug}/schedule/${scheduleId}/content`;
  return proxyRequest(request, url, apiPath);
}

async function handleTodaysSchedule(request, url) {
  // Extract path parameters from URL like: /api/batch/{batchId}/todays-schedule
  const pathParts = url.pathname.split('/');
  const batchId = pathParts[3];
  
  const apiPath = `/api/batch/${batchId}/todays-schedule`;
  return proxyRequest(request, url, apiPath);
}

async function handleTopics(request, url) {
  // Extract path parameters from URL like: /api/batch/{batchId}/subject/{subjectSlug}/topics
  const pathParts = url.pathname.split('/');
  const batchId = pathParts[3];
  const subjectSlug = pathParts[5];
  
  const apiPath = `/api/batch/${batchId}/subject/${subjectSlug}/topics`;
  return proxyRequest(request, url, apiPath);
}

async function handleAllContents(request, url) {
  // Extract path parameters from URL like: /api/batch/{batchId}/subject/{subjectSlug}/topic/{topicId}/all-contents
  const pathParts = url.pathname.split('/');
  const batchId = pathParts[3];
  const subjectSlug = pathParts[5];
  const topicId = pathParts[7];
  
  const apiPath = `/api/batch/${batchId}/subject/${subjectSlug}/topic/${topicId}/all-contents`;
  return proxyRequest(request, url, apiPath);
}

async function handleStreamInfo(request, url) {
  return proxyRequest(request, url, '/api/video/stream-info');
}

async function handleOTP(request, url) {
  return proxyRequest(request, url, '/api/otp');
}

async function handleUrl(request, url) {
  return proxyRequest(request, url, '/api/url');
}

/**
 * Create error response with CORS headers
 */
function createErrorResponse(message, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
    },
  });
}
