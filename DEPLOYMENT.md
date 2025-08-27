# PhotoShare Deployment Guide

This guide provides instructions for deploying the PhotoShare application to various platforms.

## Prerequisites

1. **MongoDB Atlas Setup**: Replace `<db_password>` in the `.env` file with your actual MongoDB Atlas password
2. **Build the Application**: Run `npm run build` to create production build
3. **Environment Variables**: Set up the required environment variables on your deployment platform

## Required Environment Variables

```
MONGODB_URI=mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@<YOUR_CLUSTER>.mongodb.net/<YOUR_DATABASE>?retryWrites=true&w=majority
NODE_ENV=production
PORT=3001
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
CORS_ORIGIN=https://your-domain.vercel.app
```

## Vercel Deployment

### Option 1: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables:
   ```bash
   vercel env add MONGODB_URI
   vercel env add NODE_ENV
   vercel env add UPLOAD_DIR
   vercel env add MAX_FILE_SIZE
   vercel env add CORS_ORIGIN
   ```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables in the dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
   - `UPLOAD_DIR`: `./uploads`
   - `MAX_FILE_SIZE`: `5242880`
   - `CORS_ORIGIN`: Your Vercel domain (e.g., `https://your-app.vercel.app`)
5. Deploy

## Netlify Deployment

### Option 1: Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Build and deploy:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Option 2: Netlify Dashboard

1. Go to [netlify.com](https://netlify.com) and sign in
2. Drag and drop your `dist` folder after running `npm run build`
3. Configure environment variables in Site Settings > Environment Variables

## Post-Deployment Steps

1. **Update CORS_ORIGIN**: Update the `CORS_ORIGIN` environment variable with your actual deployment URL
2. **Test API Endpoints**: Verify that all API endpoints are working correctly
3. **Test File Uploads**: Ensure image upload functionality works in production
4. **Monitor Logs**: Check deployment logs for any errors

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Verify your MongoDB Atlas password is correct
   - Check that your IP address is whitelisted in MongoDB Atlas
   - Ensure the connection string format is correct

2. **API Routes Not Working**:
   - Verify `vercel.json` configuration is correct
   - Check that all API routes are properly defined
   - Ensure environment variables are set correctly

3. **File Upload Issues**:
   - Check file size limits
   - Verify upload directory permissions
   - Ensure Sharp library is properly installed

4. **CORS Errors**:
   - Update `CORS_ORIGIN` environment variable with your deployment URL
   - Verify CORS configuration in the backend

### Build Commands

- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Type Check**: `npm run check`

### File Structure for Deployment

```
Photoshare/
├── api/                 # Backend API routes
├── src/                 # Frontend React application
├── public/              # Static assets
├── dist/                # Production build (generated)
├── vercel.json          # Vercel configuration
├── netlify.toml         # Netlify configuration
└── package.json         # Dependencies and scripts
```

## Security Notes

1. Never commit `.env` files to version control
2. Use environment variables for all sensitive data
3. Regularly rotate your MongoDB Atlas password
4. Keep dependencies updated for security patches
5. Enable HTTPS in production (handled automatically by Vercel/Netlify)

## Support

If you encounter issues during deployment, check:
1. Platform-specific documentation (Vercel/Netlify)
2. MongoDB Atlas connection logs
3. Browser developer console for frontend errors
4. Deployment platform logs for backend errors