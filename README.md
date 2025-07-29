# Digital Catalogue Web App

A modern web application that allows businesses to upload PDF catalogues and enables customers to browse and select items interactively.

## 🚀 Live Demo
**Status: Ready for Production Deployment**

## Features

### 🚀 Core Functionality
- **PDF Upload**: Upload PDF catalogues that are automatically converted to browsable images
- **Interactive Browsing**: Customers can scroll through all pages and select desired items
- **Customer Information**: Collect customer details with their selections
- **Admin Panel**: View all customer selections and inquiries

### 🎨 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Drag & Drop**: Easy PDF upload with drag and drop support
- **Visual Selection**: Clear visual indicators for selected items
- **Progress Tracking**: Real-time upload and processing feedback

### 🛠 Technical Features
- **PDF to Image Conversion**: Automatic conversion using pdf-poppler
- **File Management**: Organized storage of uploads and selections
- **RESTful API**: Clean API endpoints for all operations
- **Error Handling**: Comprehensive error handling and user feedback

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Keyursinh06-s/digital-catalogue-app.git
   cd digital-catalogue-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Setup

1. **Install dependencies**
   ```bash
   npm install --production
   ```

2. **Start the server**
   ```bash
   npm start
   ```

## Usage

### For Business Owners

1. **Upload Catalogue**
   - Click the upload area or drag and drop your PDF catalogue
   - Wait for the PDF to be processed into browsable pages

2. **Share with Customers**
   - Share the application URL with your customers
   - Customers can browse and select items they want

3. **View Selections**
   - Use the Admin Panel to view all customer selections
   - Get customer contact information and selected items

### For Customers

1. **Browse Catalogue**
   - Scroll through all pages of the catalogue
   - Click on pages/items you want to select

2. **Provide Information**
   - Fill in your contact details
   - Add any additional notes or requirements

3. **Submit Selection**
   - Submit your selection to the business
   - Receive confirmation of your inquiry

## API Endpoints

### Upload PDF
```
POST /upload
Content-Type: multipart/form-data
Body: PDF file
```

### Submit Selection
```
POST /submit-selection
Content-Type: application/json
Body: {
  catalogueId: string,
  selectedPages: number[],
  customerInfo: object
}
```

### Get Selections (Admin)
```
GET /admin/selections
```

## File Structure

```
digital-catalogue-app/
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # CSS styling
│   └── script.js           # Frontend JavaScript
├── uploads/
│   ├── images/             # Converted PDF pages
│   └── selections/         # Customer selections
├── server.js               # Express server
├── package.json            # Dependencies
└── README.md              # Documentation
```

## Dependencies

### Backend
- **express**: Web framework
- **multer**: File upload handling
- **pdf-poppler**: PDF to image conversion
- **cors**: Cross-origin resource sharing

### Frontend
- **Vanilla JavaScript**: No framework dependencies
- **Modern CSS**: Grid, Flexbox, and animations
- **Responsive Design**: Mobile-first approach

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically with each push
3. Environment variables are handled automatically

### Other Platforms
- **Heroku**: Add `Procfile` with `web: node server.js`
- **Railway**: Works out of the box
- **DigitalOcean**: Use App Platform for easy deployment

## Customization

### Styling
- Modify `public/styles.css` for custom branding
- Update colors, fonts, and layout as needed

### Functionality
- Add database integration for persistent storage
- Implement user authentication for admin features
- Add email notifications for new selections

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for commercial purposes.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

---

**Built with ❤️ for modern businesses**

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Keyursinh06-s/digital-catalogue-app)