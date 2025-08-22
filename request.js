// Request page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('photo-request-form');
    const fileInput = document.getElementById('photo-upload');
    const uploadArea = document.getElementById('upload-area');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const rushOrderCheckbox = document.getElementById('rush-order');
    const highResCheckbox = document.getElementById('high-res');
    const totalPriceElement = document.getElementById('total-price');
    const rushPriceElement = document.getElementById('rush-price');
    const highresPriceElement = document.getElementById('highres-price');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');

    let selectedFile = null;

    // File upload handling
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleFileDrop);

    // Pricing calculation
    rushOrderCheckbox.addEventListener('change', updatePricing);
    highResCheckbox.addEventListener('change', updatePricing);

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

    function updatePricing() {
        let total = 1.00; // Base price
        
        // Rush order
        if (rushOrderCheckbox.checked) {
            total += 2.00;
            rushPriceElement.style.display = 'flex';
        } else {
            rushPriceElement.style.display = 'none';
        }
        
        // High resolution
        if (highResCheckbox.checked) {
            total += 1.00;
            highresPriceElement.style.display = 'flex';
        } else {
            highresPriceElement.style.display = 'none';
        }
        
        totalPriceElement.textContent = `$${total.toFixed(2)}`;
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

        // Prepare form data
        const formData = new FormData();
        formData.append('photo', selectedFile);
        formData.append('email', email);
        formData.append('name', document.getElementById('name').value);
        formData.append('instructions', instructions);
        formData.append('rush_order', rushOrderCheckbox.checked ? 'yes' : 'no');
        formData.append('high_res', highResCheckbox.checked ? 'yes' : 'no');
        formData.append('total_price', totalPriceElement.textContent);
        formData.append('submission_date', new Date().toISOString());

        // Submit to Formspree (replace with your actual endpoint)
        submitToFormspree(formData);
    }

    function submitToFormspree(formData) {
        // Replace 'YOUR_FORM_ID' with your actual Formspree form ID
        const formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';
        
        fetch(formspreeEndpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showSuccessMessage();
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            window.PhotoEditPro.showNotification('There was an error submitting your request. Please try again.', 'error');
            resetSubmitButton();
        });
    }

    function showSuccessMessage() {
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth' });
        
        // Store submission data for admin panel (if needed)
        const submissionData = {
            id: 'req_' + Date.now(),
            email: document.getElementById('email').value,
            name: document.getElementById('name').value,
            instructions: document.getElementById('instructions').value,
            rush_order: rushOrderCheckbox.checked,
            high_res: highResCheckbox.checked,
            total_price: totalPriceElement.textContent,
            file_name: selectedFile ? selectedFile.name : '',
            file_size: selectedFile ? selectedFile.size : 0,
            submission_date: new Date().toISOString(),
            status: 'pending'
        };
        
        // Store in localStorage for demo purposes (in production, this would be handled by the backend)
        const existingSubmissions = JSON.parse(localStorage.getItem('photoEditSubmissions') || '[]');
        existingSubmissions.push(submissionData);
        localStorage.setItem('photoEditSubmissions', JSON.stringify(existingSubmissions));
    }

    function resetSubmitButton() {
        const buttonText = submitBtn.querySelector('.button-text');
        const buttonLoading = submitBtn.querySelector('.button-loading');
        
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
        submitBtn.disabled = false;
    }

    // Alternative submission methods for demo/testing
    function submitViaEmailJS(formData) {
        // EmailJS integration example
        // You would need to include EmailJS library and configure it
        /*
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            from_email: formData.get('email'),
            from_name: formData.get('name'),
            instructions: formData.get('instructions'),
            total_price: formData.get('total_price'),
            rush_order: formData.get('rush_order'),
            high_res: formData.get('high_res')
        })
        .then(function(response) {
            showSuccessMessage();
        }, function(error) {
            console.error('EmailJS error:', error);
            window.PhotoEditPro.showNotification('There was an error submitting your request. Please try again.', 'error');
            resetSubmitButton();
        });
        */
    }

    // For demo purposes - simulate successful submission after 2 seconds
    function simulateSubmission() {
        setTimeout(() => {
            showSuccessMessage();
        }, 2000);
    }

    // If no Formspree endpoint is configured, use simulation
    if (form.action.includes('YOUR_FORM_ID')) {
        // Override the submit function to use simulation
        const originalSubmit = handleFormSubmit;
        handleFormSubmit = function(e) {
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

            // Simulate submission
            simulateSubmission();
        };
        
        form.removeEventListener('submit', originalSubmit);
        form.addEventListener('submit', handleFormSubmit);
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
    
    // Reset pricing
    document.getElementById('total-price').textContent = '$1.00';
    document.getElementById('rush-price').style.display = 'none';
    document.getElementById('highres-price').style.display = 'none';
    
    // Show form, hide success message
    form.style.display = 'block';
    successMessage.style.display = 'none';
    
    // Scroll to top of form
    form.scrollIntoView({ behavior: 'smooth' });
}