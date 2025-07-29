class DigitalCatalogue {
    constructor() {
        this.selectedPages = new Set();
        this.catalogueId = null;
        this.totalPages = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAdminSelections();
    }

    setupEventListeners() {
        // PDF upload
        const pdfInput = document.getElementById('pdf-input');
        const uploadBox = document.querySelector('.upload-box');
        
        pdfInput.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Drag and drop
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = '#764ba2';
        });
        
        uploadBox.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = '#667eea';
        });
        
        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = '#667eea';
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type === 'application/pdf') {
                pdfInput.files = files;
                this.handleFileUpload({ target: { files } });
            }
        });

        // Clear selection
        document.getElementById('clear-selection').addEventListener('click', () => {
            this.clearSelection();
        });

        // Customer form submission
        document.getElementById('customer-form').addEventListener('submit', (e) => {
            this.handleFormSubmission(e);
        });

        // Admin panel
        document.getElementById('view-selections').addEventListener('click', () => {
            this.toggleSelectionsView();
        });
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please select a PDF file');
            return;
        }

        this.showProgress();
        
        const formData = new FormData();
        formData.append('pdf', file);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                this.catalogueId = result.catalogueId;
                this.totalPages = result.totalPages;
                this.displayCatalogue(result.images);
                this.hideProgress();
                this.showCatalogueSection();
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload PDF: ' + error.message);
            this.hideProgress();
        }
    }

    showProgress() {
        document.getElementById('upload-progress').style.display = 'block';
        const progressFill = document.querySelector('.progress-fill');
        progressFill.style.width = '100%';
    }

    hideProgress() {
        document.getElementById('upload-progress').style.display = 'none';
        const progressFill = document.querySelector('.progress-fill');
        progressFill.style.width = '0%';
    }

    showCatalogueSection() {
        document.getElementById('catalogue-section').style.display = 'block';
        document.getElementById('catalogue-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    displayCatalogue(images) {
        const grid = document.getElementById('catalogue-grid');
        grid.innerHTML = '';

        images.forEach((imageUrl, index) => {
            const pageItem = document.createElement('div');
            pageItem.className = 'page-item';
            pageItem.dataset.pageNumber = index + 1;

            pageItem.innerHTML = `
                <img src="${imageUrl}" alt="Page ${index + 1}" loading="lazy">
                <div class="page-number">Page ${index + 1}</div>
                <div class="page-overlay">
                    <div class="checkmark">✓</div>
                </div>
            `;

            pageItem.addEventListener('click', () => {
                this.togglePageSelection(index + 1, pageItem);
            });

            grid.appendChild(pageItem);
        });
    }

    togglePageSelection(pageNumber, element) {
        if (this.selectedPages.has(pageNumber)) {
            this.selectedPages.delete(pageNumber);
            element.classList.remove('selected');
        } else {
            this.selectedPages.add(pageNumber);
            element.classList.add('selected');
        }
        
        this.updateSelectionCount();
    }

    updateSelectionCount() {
        const count = this.selectedPages.size;
        const countElement = document.getElementById('selection-count');
        countElement.textContent = `${count} item${count !== 1 ? 's' : ''} selected`;
    }

    clearSelection() {
        this.selectedPages.clear();
        document.querySelectorAll('.page-item').forEach(item => {
            item.classList.remove('selected');
        });
        this.updateSelectionCount();
    }

    async handleFormSubmission(event) {
        event.preventDefault();
        
        if (this.selectedPages.size === 0) {
            alert('Please select at least one page from the catalogue');
            return;
        }

        const customerInfo = {
            name: document.getElementById('customer-name').value,
            email: document.getElementById('customer-email').value,
            phone: document.getElementById('customer-phone').value,
            notes: document.getElementById('customer-notes').value
        };

        const submissionData = {
            catalogueId: this.catalogueId,
            selectedPages: Array.from(this.selectedPages).sort((a, b) => a - b),
            customerInfo
        };

        try {
            const response = await fetch('/submit-selection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionData)
            });

            const result = await response.json();
            
            if (result.success) {
                alert('Selection submitted successfully! We will contact you soon.');
                this.resetForm();
                this.clearSelection();
            } else {
                throw new Error(result.error || 'Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit selection: ' + error.message);
        }
    }

    resetForm() {
        document.getElementById('customer-form').reset();
    }

    async loadAdminSelections() {
        try {
            const response = await fetch('/admin/selections');
            const result = await response.json();
            
            if (result.selections) {
                this.displaySelections(result.selections);
            }
        } catch (error) {
            console.error('Error loading selections:', error);
        }
    }

    displaySelections(selections) {
        const selectionsList = document.getElementById('selections-list');
        
        if (selections.length === 0) {
            selectionsList.innerHTML = '<p>No selections yet.</p>';
            return;
        }

        selectionsList.innerHTML = selections.map(selection => `
            <div class="selection-item">
                <h4>Customer: ${selection.customerInfo.name}</h4>
                <p><strong>Email:</strong> ${selection.customerInfo.email}</p>
                <p><strong>Phone:</strong> ${selection.customerInfo.phone || 'Not provided'}</p>
                <p><strong>Catalogue ID:</strong> ${selection.catalogueId}</p>
                <p><strong>Submitted:</strong> ${new Date(selection.timestamp).toLocaleString()}</p>
                <div class="pages">
                    <strong>Selected Pages:</strong> ${selection.selectedPages.join(', ')}
                </div>
                ${selection.customerInfo.notes ? `<p><strong>Notes:</strong> ${selection.customerInfo.notes}</p>` : ''}
            </div>
        `).join('');
    }

    toggleSelectionsView() {
        const selectionsList = document.getElementById('selections-list');
        const button = document.getElementById('view-selections');
        
        if (selectionsList.style.display === 'none') {
            selectionsList.style.display = 'block';
            button.textContent = 'Hide Selections';
            this.loadAdminSelections();
        } else {
            selectionsList.style.display = 'none';
            button.textContent = 'View All Selections';
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new DigitalCatalogue();
});