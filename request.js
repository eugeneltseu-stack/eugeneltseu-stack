// Request page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('photo-request-form');
    const fileInput = document.getElementById('photo-upload');
    const uploadArea = document.getElementById('upload-area');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');

    let selectedFile = null;

    // File upload handling
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleFileDrop);

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



    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate form
        const email = document.getElementById('email').value;
        const instructions = document.getElementById('instructions').value;
        
        if (!selectedFile) {
            window.PhotoEditPro.showNotification('Please upload a photo', 'error');
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
            total_price: '$1.00',
            submission_date: new Date().toISOString(),
            status: 'pending',
            payment_status: 'pending'
        };
        
        // Store file as base64 for admin panel preview (for demo purposes)
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                submissionData.file_data = e.target.result;
                saveSubmissionData(submissionData);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            saveSubmissionData(submissionData);
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