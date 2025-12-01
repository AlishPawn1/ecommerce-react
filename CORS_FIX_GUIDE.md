# CORS Fix for Production Deployment

This document outlines the changes made to fix CORS issues for the production deployment.

## Issues Fixed

1. **CORS Policy Errors**: Frontend applications were unable to access the backend API due to missing CORS headers
2. **Environment Configuration**: Frontend applications were pointing to localhost URLs instead of production URLs
3. **URL Hardcoding**: Some components had hardcoded localhost URLs

## Changes Made

### Backend Changes (`backend/`)

1. **Updated `.env` file**:
   - Added production frontend URLs to `FRONTEND_URLS`
   - Now includes: `https://newari-frontend.vercel.app,https://ecommerce-react-admin.vercel.app`

2. **Enhanced CORS configuration in `server.js`**:
   - Improved origin checking with detailed logging
   - Added additional CORS headers for better compatibility
   - Added explicit CORS headers middleware
   - Enhanced error handling for CORS issues
   - Added CORS test endpoint at `/api/cors-test`

3. **Serverless deployment support**:
   - Added proper initialization for Vercel serverless functions
   - Improved service initialization handling

### Frontend Changes (`frontend/`)

1. **Updated `.env` file**:
   - Changed `VITE_BACKEND_URL` from `http://localhost:4000` to `https://newari-backend.vercel.app`

2. **Fixed hardcoded URLs**:
   - Updated `src/pages/Test.jsx` to use production backend URL

### Admin Changes (`admin/`)

1. **Updated `.env` file**:
   - Changed `VITE_BACKEND_URL` from `http://localhost:4000` to `https://newari-backend.vercel.app`

2. **Fixed hardcoded URLs**:
   - Updated `src/components/Sidebar.jsx` to point to production frontend URL

## Deployment Instructions

### For Backend (Vercel)

1. Ensure the following environment variables are set in Vercel dashboard:
   ```
   MONGODB_URL=your_mongodb_connection_string
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
   CLOUDINARY_NAME=your_cloudinary_name
   JWT_SECRET=your_jwt_secret
   ADMIN_EMAIL=your_admin_email
   ADMIN_PASSWORD=your_admin_password
   STRIPE_SECRET_KEY=your_stripe_secret_key
   KHALTI_SECRET_KEY=your_khalti_secret_key
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   FRONTEND_URLS=http://localhost:5173,http://localhost:5174,https://newari-frontend.vercel.app,https://ecommerce-react-admin.vercel.app
   BACKEND_URL=https://newari-backend.vercel.app
   ```

2. Deploy the backend to Vercel

### For Frontend Applications (Vercel)

1. Ensure the following environment variable is set in Vercel dashboard:
   ```
   VITE_BACKEND_URL=https://newari-backend.vercel.app
   ```

2. Deploy both frontend and admin applications to Vercel

## Testing

After deployment, you can test CORS functionality by:

1. Visiting the CORS test endpoint: `https://newari-backend.vercel.app/api/cors-test`
2. Check browser console for any remaining CORS errors
3. Verify that all API calls from frontend work properly

## Troubleshooting

If you still encounter CORS issues:

1. Check Vercel deployment logs for backend
2. Verify that all environment variables are properly set
3. Ensure that the frontend URLs match exactly (including https/http and trailing slashes)
4. Check browser network tab for detailed error messages

## Production URLs

- Frontend: `https://newari-frontend.vercel.app`
- Admin: `https://ecommerce-react-admin.vercel.app`
- Backend: `https://newari-backend.vercel.app`