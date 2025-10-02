# Deployment Guide for Vercel

## Required Environment Variables

You need to set up the following environment variables in your Vercel dashboard:

### 1. MongoDB Configuration
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
```

### 2. JWT Configuration
```
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
```

### 3. ImageKit Configuration (for file uploads)
```
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-imagekit-id
```

### 4. Application Configuration
```
NODE_ENV=production
```

## How to Set Up Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable above with its corresponding value

## Deployment Steps

1. Push your changes to GitHub
2. Connect your GitHub repository to Vercel
3. Add the environment variables mentioned above
4. Deploy!

## API Endpoints

Once deployed, your API will be available at:
- `https://your-project.vercel.app/api/health` - Health check endpoint (no DB)
- `https://your-project.vercel.app/api/auth/register` - User registration
- `https://your-project.vercel.app/api/auth/login` - User login

## Testing Your Deployment

1. **Test Basic API**: Visit `https://your-project.vercel.app/api/health` (should work without DB)
2. **Test Registration**: POST to `https://your-project.vercel.app/api/auth/register`
3. **Test Login**: POST to `https://your-project.vercel.app/api/auth/login`
4. **Check Logs**: Go to Vercel dashboard → Your Project → Functions tab to see logs

## Frontend

Your React frontend will be served at the root URL: `https://your-project.vercel.app/`

## Troubleshooting

### 404 API Errors
If you get a 404 error on API endpoints:

1. **Check Function Logs**: 
   - Go to Vercel Dashboard → Your Project → Functions
   - Look for any errors in the `/api/index` function
   - Check if you see the console.log messages from our API handler

2. **Test Simple Endpoint First**:
   - Try `https://your-project.vercel.app/api/test` first
   - This bypasses database connections and tests basic routing

3. **Environment Variables**:
   - Make sure all environment variables are set correctly
   - Check that MONGODB_URI is accessible from Vercel's servers
   - Verify that JWT_SECRET is a secure random string (at least 32 characters)
   - Ensure ImageKit credentials are valid

4. **Build Process**:
   - Check Vercel deployment logs for build errors
   - Make sure all dependencies are installed correctly

### Common Issues

- **Database Connection**: If you see MongoDB connection errors, check your MONGODB_URI
- **CORS Issues**: The app is configured to handle Vercel URLs automatically
- **Build Failures**: Check that all package.json files are valid
