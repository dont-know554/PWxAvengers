# PW x AVENGERS API Proxy (pwxavengers-proxy)

A Cloudflare Worker that proxies API requests for the PW x AVENGERS educational platform with logging enabled.

## 🚀 Features

- **High Performance**: Edge-deployed for global low latency
- **Scalable**: 100K requests/day on free tier (vs 125K/month on Netlify)
- **CORS Enabled**: Handles cross-origin requests properly
- **Route Mapping**: All original API endpoints preserved
- **Error Handling**: Robust error responses with proper status codes

## 📁 Project Structure

```
proxy/
├── src/
│   └── index.js          # Main worker script with routing logic
├── wrangler.toml         # Cloudflare Workers configuration
├── package.json          # Dependencies and scripts
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## 🛠️ Setup & Deployment

### Prerequisites
- Node.js 16+ installed
- Cloudflare account
- Wrangler CLI installed globally: `npm install -g wrangler`

### Local Development
```bash
# Install dependencies
npm install

# Login to Cloudflare (first time only)
wrangler auth login

# Start local development server
npm run dev
```

### Deployment
```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## 🔗 API Endpoints

All endpoints proxy to: `https://pw-api1-ab3091004643.herokuapp.com`

| Endpoint | Description |
|----------|-------------|
| `GET /api/batches` | Get available batches |
| `GET /api/batch/{id}` | Get specific batch details |
| `GET /api/batch/{id}/subject/{slug}/schedule/{id}/content` | Get batch content |
| `GET /api/batch/{id}/todays-schedule` | Get today's schedule |
| `GET /api/batch/{id}/subject/{slug}/topics` | Get subject topics |
| `GET /api/batch/{id}/subject/{slug}/topic/{id}/all-contents` | Get all topic contents |
| `GET /api/video/stream-info` | Get video streaming info |
| `GET /api/otp` | Get OTP for video access |
| `GET /api/url` | Handle URL requests |

## ⚙️ Configuration

### Custom Domain Setup
1. Add your domain to Cloudflare
2. Update `wrangler.toml` routes section:
```toml
[[env.production.routes]]
pattern = "api.your-domain.com/*"
zone_name = "your-domain.com"
```

### Environment Variables
Set in Cloudflare Dashboard → Workers → Your Worker → Settings → Variables

## 🔧 Migration from Netlify Functions

### What Changed:
- Single worker handles all routes (vs separate functions)
- Different configuration format (`wrangler.toml` vs `netlify.toml`)
- Enhanced performance and scaling

### What Stayed Same:
- All API endpoints work identically
- Same CORS handling
- Same proxy logic
- Zero frontend changes needed

## 📊 Performance Benefits

| Metric | Netlify Functions | Cloudflare Workers |
|--------|------------------|-------------------|
| Free Requests | 125K/month | 100K/day (3M/month) |
| Cold Start | ~500ms | ~5ms |
| Global Edge | Limited | 200+ locations |
| Cost at Scale | Higher | Lower |

## 🚀 GitHub Integration

1. Push this folder to a new GitHub repository
2. Connect repository to Cloudflare Workers in dashboard
3. Auto-deploy on push to main branch

## 📝 Notes

- Worker handles dynamic route parameters automatically
- CORS headers included in all responses
- Error handling with proper HTTP status codes
- Optimized for the PW API structure

## 🔍 Monitoring

Use Cloudflare Dashboard to monitor:
- Request volume and errors
- Response times
- Geographic distribution
- Resource usage
