const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const pdf = require('pdf-poppler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Upload PDF and convert to images
app.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        const pdfPath = req.file.path;
        const outputDir = path.join('uploads', 'images', req.file.filename.replace('.pdf', ''));
        
        // Create output directory
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Convert PDF to images
        const options = {
            format: 'jpeg',
            out_dir: outputDir,
            out_prefix: 'page',
            page: null // Convert all pages
        };

        await pdf.convert(pdfPath, options);

        // Get list of generated images
        const imageFiles = fs.readdirSync(outputDir)
            .filter(file => file.endsWith('.jpg'))
            .sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)[0]);
                const numB = parseInt(b.match(/\d+/)[0]);
                return numA - numB;
            });

        const imageUrls = imageFiles.map(file => 
            `/uploads/images/${req.file.filename.replace('.pdf', '')}/${file}`
        );

        res.json({
            success: true,
            catalogueId: req.file.filename.replace('.pdf', ''),
            images: imageUrls,
            totalPages: imageFiles.length
        });

    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({ error: 'Failed to process PDF' });
    }
});

// Submit selected pages
app.post('/submit-selection', (req, res) => {
    try {
        const { catalogueId, selectedPages, customerInfo } = req.body;
        
        // Save selection to a JSON file (in production, use a database)
        const selection = {
            catalogueId,
            selectedPages,
            customerInfo,
            timestamp: new Date().toISOString()
        };

        const selectionsDir = 'uploads/selections';
        if (!fs.existsSync(selectionsDir)) {
            fs.mkdirSync(selectionsDir, { recursive: true });
        }

        const selectionFile = path.join(selectionsDir, `${catalogueId}-${Date.now()}.json`);
        fs.writeFileSync(selectionFile, JSON.stringify(selection, null, 2));

        res.json({
            success: true,
            message: 'Selection submitted successfully',
            selectionId: path.basename(selectionFile, '.json')
        });

    } catch (error) {
        console.error('Error saving selection:', error);
        res.status(500).json({ error: 'Failed to save selection' });
    }
});

// Get all selections (admin endpoint)
app.get('/admin/selections', (req, res) => {
    try {
        const selectionsDir = 'uploads/selections';
        if (!fs.existsSync(selectionsDir)) {
            return res.json({ selections: [] });
        }

        const selectionFiles = fs.readdirSync(selectionsDir)
            .filter(file => file.endsWith('.json'));

        const selections = selectionFiles.map(file => {
            const filePath = path.join(selectionsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(content);
        });

        res.json({ selections });

    } catch (error) {
        console.error('Error fetching selections:', error);
        res.status(500).json({ error: 'Failed to fetch selections' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});