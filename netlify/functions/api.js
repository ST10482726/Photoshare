// Simple Netlify Function for testing
export const handler = async (event, context) => {
  console.log('Function called:', event.httpMethod, event.path);
  
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
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
    const path = event.path.replace('/.netlify/functions/api', '');
    
    // Health check endpoint
    if (path === '/health' || path === '/api/health' || path === '') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          path: event.path,
          method: event.httpMethod
        })
      };
    }
    
    // Profile endpoint
    if (path === '/profile' || path === '/api/profile') {
      if (event.httpMethod === 'GET') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            profile: {
              firstName: 'Test',
              lastName: 'User',
              profileImage: null
            }
          })
        };
      }
      
      if (event.httpMethod === 'PUT') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Profile updated successfully'
          })
        };
      }
    }
    
    // Upload endpoint
    if (path === '/upload' || path === '/api/upload') {
      if (event.httpMethod === 'POST') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: 'data:image/jpeg;base64,test'
          })
        };
      }
    }
    
    // 404 for other paths
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Endpoint not found',
        path: event.path
      })
    };
    
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};