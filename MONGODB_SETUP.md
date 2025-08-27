# MongoDB Atlas Setup Guide

## Current Issue
The application is failing to connect to MongoDB Atlas with the error:
```
Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted.
```

## Solution: Whitelist Your IP Address

### Step 1: Access MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Select your project (the one containing your cluster)

### Step 2: Configure Network Access
1. In the left sidebar, click on **"Network Access"**
2. Click the **"Add IP Address"** button
3. You have two options:

#### Option A: Add Your Current IP (Recommended for production)
1. Click **"Add Current IP Address"**
2. MongoDB will automatically detect and add your current IP
3. Give it a description like "Development Machine"
4. Click **"Confirm"**

#### Option B: Allow All IPs (For development/testing only)
1. Click **"Allow Access from Anywhere"**
2. This adds `0.0.0.0/0` which allows all IPs
3. **Warning**: This is less secure, only use for development
4. Click **"Confirm"**

### Step 3: Wait for Changes to Apply
- It may take 1-2 minutes for the changes to take effect
- You'll see a status indicator showing when the changes are active

### Step 4: Restart the Backend Server
After whitelisting your IP:
1. Stop the current backend server (Ctrl+C in the terminal)
2. Restart it with: `npm run server:dev`

## Verification
Once your IP is whitelisted and the server restarts, you should see:
```
MongoDB connected successfully
Server running on port 3001
```

## Troubleshooting

### If you're still getting connection errors:
1. **Check your internet connection**
2. **Verify the IP was added correctly** in MongoDB Atlas Network Access
3. **Try the 0.0.0.0/0 option** temporarily for testing
4. **Check if your ISP uses dynamic IPs** - you may need to update the whitelist periodically

### If you're behind a corporate firewall:
- Contact your IT department to get the external IP address
- You may need to whitelist a range of IPs

## Security Notes
- For production deployments, always use specific IP addresses
- Regularly review and update your IP whitelist
- Consider using MongoDB Atlas's VPC peering for enhanced security