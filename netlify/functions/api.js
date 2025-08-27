// Netlify Function with fallback profile support
const handler = async (event, context) => {
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
    console.log('Processed path:', path, 'Original path:', event.path);
    
    // Health check endpoint
    if (path === '/health' || path === '' || path === '/') {
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
    if (path === '/profile') {
      if (event.httpMethod === 'GET') {
        // Get fallback profile from environment or default
        const fallbackProfile = {
          firstName: process.env.FALLBACK_FIRST_NAME || 'John',
          lastName: process.env.FALLBACK_LAST_NAME || 'Doe',
          profileImage: process.env.FALLBACK_PROFILE_IMAGE || null
        };
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            profile: fallbackProfile
          })
        };
      }
      
      if (event.httpMethod === 'PUT') {
        try {
          const body = JSON.parse(event.body || '{}');
          console.log('Profile update request:', body);
          
          // Validate required fields
          if (!body.firstName || !body.lastName) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({
                success: false,
                error: 'First name and last name are required'
              })
            };
          }
          
          // Since we're using fallback mode, just return success
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: 'Profile updated successfully (fallback mode)',
              profile: {
                firstName: body.firstName,
                lastName: body.lastName,
                profileImage: body.profileImage || null
              }
            })
          };
        } catch (parseError) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Invalid JSON in request body'
            })
          };
        }
      }
    }
    
    // Upload endpoint
    if (path === '/upload') {
      if (event.httpMethod === 'POST') {
        try {
          // Parse multipart form data (simplified)
          const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
          
          if (contentType.includes('multipart/form-data')) {
            // For now, return a mock success response
            // In a real implementation, you'd parse the multipart data
            const mockImageUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
            
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                success: true,
                message: 'Image uploaded successfully (fallback mode)',
                imageUrl: mockImageUrl
              })
            };
          } else {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({
                success: false,
                error: 'Content-Type must be multipart/form-data'
              })
            };
          }
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Upload failed',
              message: uploadError.message
            })
          };
        }
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

module.exports = { handler };