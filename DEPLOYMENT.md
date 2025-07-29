# Deployment Guide

## Quick Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Keyursinh06-s/digital-catalogue-app)

### Option 2: Manual Deployment

1. **Fork this repository** to your GitHub account

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your forked repository

3. **Configure Build Settings**:
   - Framework Preset: Other
   - Build Command: `npm install`
   - Output Directory: `public`
   - Install Command: `npm install`

4. **Deploy**: Click "Deploy" and wait for completion

## Environment Setup

### Required Dependencies
The app will automatically install these dependencies:
- `express` - Web server framework
- `multer` - File upload handling
- `pdf-poppler` - PDF to image conversion
- `cors` - Cross-origin resource sharing

### System Requirements
- Node.js 16+ (automatically provided by Vercel)
- PDF processing capabilities (handled by pdf-poppler)

## Testing Your Deployment

1. **Access your app** at the provided Vercel URL
2. **Upload a PDF** using the upload interface
3. **Browse pages** and select items
4. **Submit a selection** with customer info
5. **Check admin panel** to view submissions

## Production Considerations

### File Storage
- Current setup uses local file storage
- For production, consider:
  - AWS S3 for file storage
  - Database for selections (PostgreSQL/MongoDB)
  - CDN for image delivery

### Scaling
- Vercel automatically handles scaling
- Consider upgrading plan for high traffic
- Monitor function execution time limits

### Security
- Add authentication for admin panel
- Implement rate limiting
- Validate file uploads more strictly
- Add CSRF protection

## Custom Domain

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Click "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

## Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Check Vercel function logs
- **Usage Metrics**: Monitor bandwidth and function invocations

## Troubleshooting

### Common Issues

1. **PDF Upload Fails**:
   - Check file size limits (Vercel: 50MB max)
   - Verify PDF format compatibility
   - Check function timeout settings

2. **Images Not Loading**:
   - Verify file paths in uploads directory
   - Check static file serving configuration
   - Ensure proper CORS settings

3. **Form Submission Errors**:
   - Check network connectivity
   - Verify API endpoint accessibility
   - Review browser console for errors

### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Node.js Deployment Guide](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [GitHub Repository Issues](https://github.com/Keyursinh06-s/digital-catalogue-app/issues)

---

**Your digital catalogue app is ready to go live! 🚀**