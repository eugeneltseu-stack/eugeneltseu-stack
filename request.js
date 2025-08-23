// Request page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('photo-request-form');
    const fileInput = document.getElementById('photo-upload');
    const uploadArea = document.getElementById('upload-area');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    
    // Payment confirmation elements
    const paymentInput = document.getElementById('payment-confirmation');
    const paymentUploadArea = document.getElementById('payment-upload-area');
    const paymentFileInfo = document.getElementById('payment-file-info');
    const paymentFileName = document.getElementById('payment-file-name');
    const paymentFileSize = document.getElementById('payment-file-size');
    
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');

    let selectedFile = null;
    let selectedPaymentFile = null;

    // File upload handling
    fileInput.addEventListener('change', handleFileSelect);
    paymentInput.addEventListener('change', handlePaymentFileSelect);
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleFileDrop);
    
    // Payment upload drag and drop
    paymentUploadArea.addEventListener('dragover', handlePaymentDragOver);
    paymentUploadArea.addEventListener('dragleave', handlePaymentDragLeave);
    paymentUploadArea.addEventListener('drop', handlePaymentFileDrop);

    // Form submission
    form.addEventListener('submit', handleFormSubmit);

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    }

    function handleDragLeave(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    }

    function handleFileDrop(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            fileInput.files = files; // Set the file input
            processFile(file);
        }
    }

    function processFile(file) {
        const validation = window.PhotoEditPro.validateImageFile(file);
        
        if (!validation.valid) {
            window.PhotoEditPro.showNotification(validation.message, 'error');
            return;
        }

        selectedFile = file;
        
        // Update UI
        fileName.textContent = file.name;
        fileSize.textContent = window.PhotoEditPro.formatFileSize(file.size);
        fileInfo.style.display = 'block';
        
        // Hide upload instructions
        uploadArea.querySelector('h4').style.display = 'none';
        uploadArea.querySelector('p').style.display = 'none';
        uploadArea.querySelector('.upload-icon').style.display = 'none';

        window.PhotoEditPro.showNotification('File uploaded successfully!');
    }

    // Payment file handling functions
    function handlePaymentFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            processPaymentFile(file);
        }
    }

    function handlePaymentDragOver(e) {
        e.preventDefault();
        paymentUploadArea.classList.add('dragover');
    }

    function handlePaymentDragLeave(e) {
        e.preventDefault();
        paymentUploadArea.classList.remove('dragover');
    }

    function handlePaymentFileDrop(e) {
        e.preventDefault();
        paymentUploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processPaymentFile(files[0]);
        }
    }

    function processPaymentFile(file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            window.PhotoEditPro.showNotification('Please upload a valid image file (JPG, PNG, WebP)', 'error');
            return;
        }

        // Validate file size (max 5MB for payment confirmation)
        if (file.size > 5 * 1024 * 1024) {
            window.PhotoEditPro.showNotification('Payment confirmation file must be less than 5MB', 'error');
            return;
        }

        selectedPaymentFile = file;
        
        // Update UI
        paymentFileName.textContent = file.name;
        paymentFileSize.textContent = window.PhotoEditPro.formatFileSize(file.size);
        paymentFileInfo.style.display = 'block';
        
        // Hide upload instructions
        paymentUploadArea.querySelector('h4').style.display = 'none';
        paymentUploadArea.querySelector('p').style.display = 'none';
        paymentUploadArea.querySelector('.upload-icon').style.display = 'none';

        window.PhotoEditPro.showNotification('Payment confirmation uploaded successfully!');
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate form
        const email = document.getElementById('email').value;
        const instructions = document.getElementById('instructions').value;
        
        if (!selectedFile) {
            window.PhotoEditPro.showNotification('Please upload a photo', 'error');
            return;
        }
        
        if (!selectedPaymentFile) {
            window.PhotoEditPro.showNotification('Please upload your payment confirmation screenshot', 'error');
            return;
        }
        
        if (!window.PhotoEditPro.validateEmail(email)) {
            window.PhotoEditPro.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        if (instructions.trim().length < 10) {
            window.PhotoEditPro.showNotification('Please provide more detailed instructions (at least 10 characters)', 'error');
            return;
        }

        // Show loading state
        const buttonText = submitBtn.querySelector('.button-text');
        const buttonLoading = submitBtn.querySelector('.button-loading');
        
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'flex';
        submitBtn.disabled = true;

        // Store submission directly to admin panel
        storeSubmission(email, document.getElementById('name').value, instructions);
    }

    function storeSubmission(email, name, instructions) {
        // Create submission data
        const submissionData = {
            id: 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            email: email,
            name: name || 'Not provided',
            instructions: instructions,
            file_name: selectedFile ? selectedFile.name : '',
            file_size: selectedFile ? selectedFile.size : 0,
            file_type: selectedFile ? selectedFile.type : '',
            payment_file_name: selectedPaymentFile ? selectedPaymentFile.name : '',
            payment_file_size: selectedPaymentFile ? selectedPaymentFile.size : 0,
            payment_file_type: selectedPaymentFile ? selectedPaymentFile.type : '',
            total_price: '$25.00',
            submission_date: new Date().toISOString(),
            status: 'pending',
            payment_status: 'paid' // Since payment confirmation is uploaded
        };
        
        // Store files as base64 for admin panel preview (for demo purposes)
        let filesProcessed = 0;
        const totalFiles = 2; // photo + payment confirmation
        
        function checkAllFilesProcessed() {
            filesProcessed++;
            if (filesProcessed === totalFiles) {
                saveSubmissionData(submissionData);
            }
        }
        
        if (selectedFile) {
            const photoReader = new FileReader();
            photoReader.onload = function(e) {
                submissionData.file_data = e.target.result;
                checkAllFilesProcessed();
            };
            photoReader.readAsDataURL(selectedFile);
        } else {
            checkAllFilesProcessed();
        }
        
        if (selectedPaymentFile) {
            const paymentReader = new FileReader();
            paymentReader.onload = function(e) {
                submissionData.payment_file_data = e.target.result;
                checkAllFilesProcessed();
            };
            paymentReader.readAsDataURL(selectedPaymentFile);
        } else {
            checkAllFilesProcessed();
        }
    }
    
    function saveSubmissionData(submissionData) {
        try {
            // Get existing submissions
            const existingSubmissions = JSON.parse(localStorage.getItem('photoEditSubmissions') || '[]');
            
            // Add new submission
            existingSubmissions.push(submissionData);
            
            // Store back to localStorage
            localStorage.setItem('photoEditSubmissions', JSON.stringify(existingSubmissions));
            
            // Simulate processing time
            setTimeout(() => {
                showSuccessMessage();
            }, 1500);
            
        } catch (error) {
            console.error('Error storing submission:', error);
            window.PhotoEditPro.showNotification('There was an error submitting your request. Please try again.', 'error');
            resetSubmitButton();
        }
    }

    function showSuccessMessage() {
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth' });
        
        // Reset submit button
        resetSubmitButton();
    }

    function resetSubmitButton() {
        const buttonText = submitBtn.querySelector('.button-text');
        const buttonLoading = submitBtn.querySelector('.button-loading');
        
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
        submitBtn.disabled = false;
    }


});

// Function to submit another request
function submitAnother() {
    const form = document.getElementById('photo-request-form');
    const successMessage = document.getElementById('success-message');
    
    // Reset form
    form.reset();
    
    // Reset file upload area
    const uploadArea = document.getElementById('upload-area');
    const fileInfo = document.getElementById('file-info');
    
    uploadArea.querySelector('h4').style.display = 'block';
    uploadArea.querySelector('p').style.display = 'block';
    uploadArea.querySelector('.upload-icon').style.display = 'block';
    fileInfo.style.display = 'none';
    
    // Show form, hide success message
    form.style.display = 'block';
    successMessage.style.display = 'none';
    
    // Scroll to top of form
    form.scrollIntoView({ behavior: 'smooth' });
}