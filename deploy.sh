#!/bin/bash

# Digital Catalogue App - Quick Deploy Script
echo "🚀 Digital Catalogue App Deployment"
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami || vercel login

# Deploy the application
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your digital catalogue app is now live!"
echo ""
echo "📋 Next steps:"
echo "1. Test PDF upload functionality"
echo "2. Browse through converted pages"
echo "3. Test customer selection and form submission"
echo "4. Check admin panel for submissions"
echo ""
echo "🎯 Your app is ready for customers!"