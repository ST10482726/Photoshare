# PhotoShare Application

A modern photo sharing application built with React, Express.js, and MongoDB. Users can create profiles, upload and manage photos, and customize their experience through a comprehensive settings page.

## Features

- **User Profile Management**: Create and edit user profiles with personal information
- **Photo Upload & Management**: Upload, optimize, and manage photos with metadata
- **Settings Page**: Data management options including profile export and reset functionality
- **Responsive Design**: Modern, clean UI built with Tailwind CSS
- **Image Optimization**: Automatic image processing and optimization using Sharp
- **MongoDB Integration**: Robust data storage with MongoDB Atlas support

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Zustand for state management
- Lucide React for icons

### Backend
- Express.js with TypeScript
- MongoDB with Mongoose ODM
- Multer for file uploads
- Sharp for image processing
- CORS for cross-origin requests

## Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Photoshare
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   - Copy `.env.example` to `.env` (if available)
   - Update the MongoDB connection string in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://st10482726<YOUR_PASSWORD>@cluster0.iww0dy5.mongodb.net/retryWrites=true&w=majority&appName=Cluster0
   NODE_ENV=development
   PORT=3001
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=5242880
   CORS_ORIGIN=http://localhost:5173
   ```
   - Replace `<YOUR_PASSWORD>` with your actual MongoDB Atlas password

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run check` - Run TypeScript type checking
- `npm run client:dev` - Start only the frontend development server
- `npm run server:dev` - Start only the backend development server

## Project Structure

```
Photoshare/
├── api/                     # Backend Express.js application
│   ├── config/             # Database and configuration files
│   ├── models/             # MongoDB/Mongoose models
│   ├── routes/             # API route handlers
│   ├── middleware/         # Express middleware
│   └── server.ts           # Main server file
├── src/                    # Frontend React application
│   ├── components/         # Reusable React components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── main.tsx            # React application entry point
├── public/                 # Static assets
├── uploads/                # File upload directory (created automatically)
├── dist/                   # Production build output
├── vercel.json             # Vercel deployment configuration
├── netlify.toml            # Netlify deployment configuration
└── DEPLOYMENT.md           # Detailed deployment instructions
```

## API Endpoints

### Profile Management
- `GET /api/profile` - Retrieve user profile
- `PUT /api/profile` - Update user profile

### Image Upload
- `POST /api/upload` - Upload and process images

## Database Schema

### Profile Collection
```javascript
{
  name: String,
  email: String,
  bio: String,
  location: String,
  website: String,
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

### ImageMetadata Collection
```javascript
{
  fileName: String,
  originalName: String,
  mimeType: String,
  size: Number,
  uploadDate: Date,
  tags: [String],
  description: String
}
```

## Deployment

The application is ready for deployment on various platforms. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to:

- **Vercel** (Recommended for full-stack apps)
- **Netlify** (Great for static sites with serverless functions)

### Quick Deployment Steps

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set up environment variables** on your deployment platform

3. **Deploy using your preferred method**:
   - Vercel CLI: `vercel`
   - Netlify CLI: `netlify deploy --prod --dir=dist`
   - Or use the respective web dashboards

## Environment Variables

Required environment variables for production:

```env
MONGODB_URI=<your-mongodb-atlas-connection-string>
NODE_ENV=production
PORT=3001
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
CORS_ORIGIN=<your-production-domain>
```

## Development Notes

- The application uses a proxy configuration in Vite to route API calls to the Express backend during development
- File uploads are handled with Multer and processed with Sharp for optimization
- MongoDB connection includes retry logic and proper error handling
- CORS is configured to allow requests from the frontend domain

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Verify your MongoDB Atlas password
   - Check IP whitelist in MongoDB Atlas
   - Ensure connection string format is correct

2. **API Connection Issues**:
   - Verify both frontend and backend servers are running
   - Check proxy configuration in `vite.config.ts`
   - Ensure CORS settings allow your frontend domain

3. **File Upload Problems**:
   - Check file size limits (default: 5MB)
   - Verify upload directory permissions
   - Ensure Sharp library is properly installed

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment-specific issues
2. Review the troubleshooting section above
3. Check the browser console and server logs for error messages
4. Ensure all environment variables are properly configured