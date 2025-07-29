# Digital Catalogue Web App

A modern web application that allows customers to upload PDF catalogues, browse through pages, select items they want, and submit their selections with contact information.

## Features

- **PDF Upload**: Drag & drop or click to upload PDF files (up to 10MB)
- **PDF Viewer**: 
  - View PDFs page by page or in grid view
  - Interactive page selection with visual feedback
  - Responsive design for all devices
- **Selection Management**: 
  - Select/deselect individual pages
  - Bulk select/deselect all pages
  - Visual confirmation of selected items
- **Customer Form**: Collect customer information with validation
- **Submission**: Process and handle customer selections
- **Modern UI**: Clean, responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **PDF Handling**: react-pdf with PDF.js
- **Icons**: Heroicons
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd digital-catalogue-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── components/           # React components
│   │   ├── PDFUpload.tsx    # File upload component
│   │   ├── PDFViewer.tsx    # PDF viewing and selection
│   │   └── SelectionSummary.tsx # Review and submission
│   ├── api/
│   │   └── submit-selection/ # API endpoint for form submissions
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page component
├── public/                  # Static files
├── tailwind.config.js       # Tailwind configuration
├── next.config.js           # Next.js configuration
├── vercel.json             # Vercel deployment config
└── package.json            # Dependencies and scripts
```

## Usage

### For Customers

1. **Upload PDF**: Drag and drop or browse to select a PDF catalogue
2. **Browse Pages**: View all pages in single-page or grid view
3. **Select Items**: Click on pages to select items you want
4. **Review Selection**: Review selected pages and enter contact information
5. **Submit**: Submit your selection to receive a quote

### For Business Owners

The app collects customer selections and contact information. You can extend the API endpoint to:

- Save submissions to a database
- Send email notifications
- Integrate with CRM systems
- Generate quotes automatically

## Customization

### Styling

The app uses Tailwind CSS for styling. You can customize:

- Colors in `tailwind.config.js`
- Component styles in `app/globals.css`
- Individual component styling in each `.tsx` file

### Business Logic

Extend the submission handler in `app/api/submit-selection/route.ts` to:

```typescript
// Example: Save to database
await db.submissions.create({
  fileName: data.fileName,
  selectedPages: data.selectedPages,
  customerInfo: data.customerInfo,
  createdAt: new Date()
})

// Example: Send emails
await emailService.send({
  to: data.customerInfo.email,
  subject: 'Selection Confirmation',
  template: 'confirmation',
  data: data
})
```

## Deployment on Vercel

### Quick Deploy

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Manual Deploy

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Environment Variables

For production, you may want to set:

- `DATABASE_URL` - Database connection string
- `EMAIL_API_KEY` - Email service API key
- `SMTP_*` - SMTP configuration for emails

Add these in your Vercel dashboard under Settings > Environment Variables.

## File Size Limits

- PDF upload limit: 10MB (configurable in `next.config.js`)
- Vercel function timeout: 30 seconds (configurable in `vercel.json`)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

The app is optimized for:
- Fast PDF rendering with react-pdf
- Responsive image loading
- Minimal bundle size
- Server-side rendering where beneficial

## Troubleshooting

### PDF not loading
- Check file size (max 10MB)
- Ensure valid PDF format
- Check browser console for errors

### Upload failing
- Verify network connection
- Check file permissions
- Ensure proper MIME type

### Deployment issues
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure environment variables are set

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the troubleshooting section
- Open an issue on GitHub
- Contact [your-email@example.com]

## Roadmap

Future enhancements may include:
- Multi-file upload support
- Advanced PDF annotations
- User accounts and history
- Administrative dashboard
- Email automation
- Database integration
- Payment processing integration