# PW x AVENGERS - Netlify Deployment

This is the Netlify-ready version of the PW x AVENGERS educational platform, converted from a local server setup to serverless functions.

## 🚀 Deployment Instructions

### Option 1: Deploy via Netlify Dashboard
1. Zip the entire `main` folder
2. Go to [Netlify](https://netlify.com) and create an account
3. Drag and drop the zip file to deploy
4. Your site will be live instantly!

### Option 2: Deploy via Git
1. Push the `main` folder contents to a GitHub repository
2. Connect the repository to Netlify
3. Netlify will automatically detect the `netlify.toml` configuration
4. Deploy automatically

### Option 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to the main folder
cd main

# Deploy to Netlify
netlify deploy --prod --dir .
```

## 📁 Project Structure

```
main/
├── index.html              # Main frontend application
├── player.html             # Video player page
├── style.css               # Styling
├── package.json            # Dependencies
├── netlify.toml            # Netlify configuration
├── README.md               # This file
└── netlify/
    └── functions/          # Serverless API functions
        ├── batches.js      # Get batches list
        ├── url.js          # Get video URLs
        ├── batch.js        # Get batch details
        ├── batch-content.js # Get batch content
        ├── todays-schedule.js # Get today's schedule
        ├── topics.js       # Get subject topics
        ├── all-contents.js # Get all contents
        ├── stream-info.js  # Get video stream info
        └── otp.js          # Get OTP for videos
```

## 🔧 API Endpoints

All API endpoints are now serverless functions:
- `/api/batches` - Get batches with pagination and search
- `/api/url` - Get video URLs
- `/api/batch/:batchId` - Get specific batch details
- `/api/batch/:batchId/todays-schedule` - Get today's live classes
- `/api/batch/:batchId/subject/:subjectSlug/topics` - Get subject topics
- `/api/batch/:batchId/subject/:subjectSlug/topic/:topicId/all-contents` - Get lecture content
- `/api/video/stream-info` - Get video streaming information
- `/api/otp` - Get OTP for video authentication

## 🌟 Features

- ✅ CORS-free API access via serverless functions
- ✅ Educational content browsing (batches, subjects, lectures)
- ✅ Video streaming with HLS support
- ✅ Live class schedules
- ✅ Search and filter functionality
- ✅ Responsive design
- ✅ Telegram integration

## 🔄 Migration Changes

### From Local Setup:
- **proxy-server.js** → Netlify serverless functions
- **web-server.js** → Netlify static hosting
- **localhost:3000** → Relative API paths

### Key Changes:
1. All proxy endpoints converted to individual serverless functions
2. API base URL changed from `localhost:3000` to relative paths
3. Added `netlify.toml` for proper routing and redirects
4. Updated package.json for Netlify deployment

## 🎯 Ready to Deploy!

Your site is now ready for Netlify deployment. All serverless functions will handle the API proxying automatically, and the frontend will work seamlessly with the new architecture.
