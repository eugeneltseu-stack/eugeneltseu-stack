// Admin panel JavaScript functionality

// Configuration
const STRIPE_DASHBOARD_URL = 'https://dashboard.stripe.com'; // Your Stripe dashboard

// Secure password hashing function
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Check if admin credentials exist
function adminCredentialsExist() {
    return localStorage.getItem('adminCredentials') !== null;
}

// Store admin credentials securely
async function storeAdminCredentials(username, password) {
    const hashedPassword = await hashPassword(password);
    const credentials = {
        username: username,
        passwordHash: hashedPassword,
        createdAt: new Date().toISOString()
    };
    localStorage.setItem('adminCredentials', JSON.stringify(credentials));
}

// Verify admin credentials
async function verifyAdminCredentials(username, password) {
    const storedCredentials = JSON.parse(localStorage.getItem('adminCredentials'));
    if (!storedCredentials) return false;
    
    const hashedPassword = await hashPassword(password);
    return storedCredentials.username === username && storedCredentials.passwordHash === hashedPassword;
}

document.addEventListener('DOMContentLoaded', function() {
    // Setup form handling
    const setupForm = document.getElementById('setup-form');
    if (setupForm) {
        setupForm.addEventListener('submit', handleSetup);
    }

    // Login form handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Check if admin credentials exist
    if (!adminCredentialsExist()) {
        // Show setup screen for first-time setup
        showSetupScreen();
    } else {
        // Check if already logged in
        if (localStorage.getItem('adminLoggedIn') === 'true') {
            showAdminPanel();
        } else {
            showLoginScreen();
        }
    }

    // Load initial data
    loadDashboardData();
    
    // Auto-refresh every 30 seconds
    setInterval(loadDashboardData, 30000);
});

function showSetupScreen() {
    document.getElementById('setup-screen').style.display = 'block';
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'none';
}

function showLoginScreen() {
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
}

async function handleSetup(e) {
    e.preventDefault();
    
    const username = document.getElementById('setup-username').value.trim();
    const password = document.getElementById('setup-password').value;
    const confirmPassword = document.getElementById('setup-password-confirm').value;
    const errorDiv = document.getElementById('setup-error');
    
    // Clear previous errors
    errorDiv.style.display = 'none';
    
    // Validation
    if (username.length < 3) {
        errorDiv.textContent = 'Username must be at least 3 characters long.';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters long.';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match.';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        // Store credentials securely
        await storeAdminCredentials(username, password);
        
        // Auto-login after setup
        localStorage.setItem('adminLoggedIn', 'true');
        
        // Clear form
        document.getElementById('setup-form').reset();
        errorDiv.style.display = 'none';
        
        // Show success message
        alert('✅ Admin account created successfully! You are now logged in.');
        
        // Show admin panel
        showAdminPanel();
        
    } catch (error) {
        errorDiv.textContent = 'Error creating admin account. Please try again.';
        errorDiv.style.display = 'block';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value;
    const errorDiv = document.getElementById('login-error');
    
    try {
        const isValid = await verifyAdminCredentials(username, password);
        
        if (isValid) {
            localStorage.setItem('adminLoggedIn', 'true');
            showAdminPanel();
            errorDiv.style.display = 'none';
            
            // Clear form
            document.getElementById('login-form').reset();
        } else {
            errorDiv.style.display = 'block';
            document.getElementById('admin-password').value = '';
        }
    } catch (error) {
        errorDiv.textContent = 'Login error. Please try again.';
        errorDiv.style.display = 'block';
    }
}

function showAdminPanel() {
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    loadDashboardData();
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    showLoginScreen();
    
    // Clear login form
    document.getElementById('admin-username').value = '';
    document.getElementById('admin-password').value = '';
}



function loadDashboardData() {
    // Load submissions from localStorage (in production, this would be from your backend)
    const submissions = JSON.parse(localStorage.getItem('photoEditSubmissions') || '[]');
    
    // Update stats
    updateStats(submissions);
    
    // Load requests into different tabs
    loadPendingRequests(submissions);
    loadInProgressRequests(submissions);
    loadCompletedRequests(submissions);
}

function updateStats(submissions) {
    const pending = submissions.filter(s => s.status === 'pending').length;
    const completedToday = submissions.filter(s => {
        const today = new Date().toDateString();
        const submissionDate = new Date(s.submission_date).toDateString();
        return s.status === 'completed' && submissionDate === today;
    }).length;
    
    const totalRevenue = submissions
        .filter(s => s.status === 'completed')
        .reduce((sum, s) => sum + parseFloat(s.total_price.replace('$', '')), 0);

    document.getElementById('pending-count').textContent = pending;
    document.getElementById('completed-count').textContent = completedToday;
    document.getElementById('revenue-count').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('rating-count').textContent = '5.0'; // Static for demo
}

function loadPendingRequests(submissions) {
    const pendingRequests = submissions.filter(s => s.status === 'pending');
    const container = document.getElementById('pending-requests');
    const noRequestsDiv = document.getElementById('no-pending');
    
    if (pendingRequests.length === 0) {
        container.innerHTML = '';
        noRequestsDiv.style.display = 'block';
        return;
    }
    
    noRequestsDiv.style.display = 'none';
    container.innerHTML = pendingRequests.map(request => createRequestCard(request, 'pending')).join('');
}

function loadInProgressRequests(submissions) {
    const inProgressRequests = submissions.filter(s => s.status === 'in-progress');
    const container = document.getElementById('in-progress-requests');
    const noRequestsDiv = document.getElementById('no-progress');
    
    if (inProgressRequests.length === 0) {
        container.innerHTML = '';
        noRequestsDiv.style.display = 'block';
        return;
    }
    
    noRequestsDiv.style.display = 'none';
    container.innerHTML = inProgressRequests.map(request => createRequestCard(request, 'in-progress')).join('');
}

function loadCompletedRequests(submissions) {
    const completedRequests = submissions.filter(s => s.status === 'completed');
    const container = document.getElementById('completed-requests');
    const noRequestsDiv = document.getElementById('no-completed');
    
    if (completedRequests.length === 0) {
        container.innerHTML = '';
        noRequestsDiv.style.display = 'block';
        return;
    }
    
    noRequestsDiv.style.display = 'none';
    container.innerHTML = completedRequests.map(request => createRequestCard(request, 'completed')).join('');
}

function createRequestCard(request, status) {
    const date = new Date(request.submission_date).toLocaleDateString();
    const options = [];
    
    if (request.rush_order) options.push('Rush Order');
    if (request.high_res) options.push('High Resolution');
    
    const optionsText = options.length > 0 ? options.join(', ') : 'Standard';
    
    let actions = '';
    if (status === 'pending') {
        actions = `
            <div class="request-actions">
                <button class="approve-button" onclick="approveRequest('${request.id}')">
                    Send Stripe Link
                </button>
                <button class="reject-button" onclick="rejectRequest('${request.id}')">
                    Reject
                </button>
            </div>
        `;
    } else if (status === 'in-progress') {
        actions = `
            <div class="request-actions">
                <button class="approve-button" onclick="markCompleted('${request.id}')">
                    Mark as Completed
                </button>
                <button class="secondary-button" onclick="contactCustomer('${request.id}')">
                    Contact Customer
                </button>
            </div>
        `;
    } else {
        actions = `
            <div class="request-actions">
                <button class="secondary-button" onclick="viewDetails('${request.id}')">
                    View Details
                </button>
            </div>
        `;
    }
    
    return `
        <div class="request-card" data-id="${request.id}">
            <div class="request-image">
                <div class="image-placeholder">
                    <span>${request.file_name || 'No Image'}</span>
                </div>
            </div>
            <div class="request-details">
                <div class="request-header">
                    <h4>Request #${request.id.split('_')[1]}</h4>
                    <span class="request-date">${date}</span>
                </div>
                <div class="request-info">
                    <p><strong>Email:</strong> ${request.email}</p>
                    <p><strong>Name:</strong> ${request.name || 'Not provided'}</p>
                    <p><strong>Instructions:</strong> ${request.instructions}</p>
                    <p><strong>Options:</strong> ${optionsText}</p>
                    <p><strong>Total:</strong> ${request.total_price}</p>
                    ${request.file_name ? `<p><strong>File:</strong> ${request.file_name} (${formatFileSize(request.file_size)})</p>` : ''}
                </div>
                ${actions}
            </div>
        </div>
    `;
}

function approveRequest(requestId) {
    const submissions = JSON.parse(localStorage.getItem('photoEditSubmissions') || '[]');
    const request = submissions.find(s => s.id === requestId);
    
    if (!request) return;
    
    // Show Stripe modal
    showStripeModal(request);
}

function rejectRequest(requestId) {
    if (!confirm('Are you sure you want to reject this request?')) return;
    
    const submissions = JSON.parse(localStorage.getItem('photoEditSubmissions') || '[]');
    const updatedSubmissions = submissions.filter(s => s.id !== requestId);
    
    localStorage.setItem('photoEditSubmissions', JSON.stringify(updatedSubmissions));
    loadDashboardData();
    
    showNotification('Request rejected and removed', 'error');
}

function markCompleted(requestId) {
    const submissions = JSON.parse(localStorage.getItem('photoEditSubmissions') || '[]');
    const request = submissions.find(s => s.id === requestId);
    
    if (!request) return;
    
    request.status = 'completed';
    request.completed_date = new Date().toISOString();
    
    localStorage.setItem('photoEditSubmissions', JSON.stringify(submissions));
    loadDashboardData();
    
    showNotification('Request marked as completed!');
}

function showStripeModal(request) {
    const modal = document.getElementById('stripe-modal');
    const customerSpan = document.getElementById('stripe-customer');
    const amountSpan = document.getElementById('stripe-amount');
    
    customerSpan.textContent = `${request.name || 'Customer'} (${request.email})`;
    amountSpan.textContent = request.total_price;
    
    modal.style.display = 'flex';
    modal.dataset.requestId = request.id;
}

function closeStripeModal() {
    document.getElementById('stripe-modal').style.display = 'none';
    document.getElementById('stripe-link').value = '';
}

function sendStripeLink() {
    const modal = document.getElementById('stripe-modal');
    const stripeLink = document.getElementById('stripe-link').value;
    const requestId = modal.dataset.requestId;
    
    if (!stripeLink || !stripeLink.startsWith('https://')) {
        alert('Please enter a valid Stripe payment link');
        return;
    }
    
    // Update request status
    const submissions = JSON.parse(localStorage.getItem('photoEditSubmissions') || '[]');
    const request = submissions.find(s => s.id === requestId);
    
    if (request) {
        request.status = 'in-progress';
        request.stripe_link = stripeLink;
        request.approved_date = new Date().toISOString();
        
        localStorage.setItem('photoEditSubmissions', JSON.stringify(submissions));
        
        // Show email template
        showEmailTemplate(request, stripeLink);
        
        closeStripeModal();
        loadDashboardData();
        
        showNotification('Stripe link saved! Email template is ready to send.');
    }
}

function showEmailTemplate(request, stripeLink) {
    const modal = document.getElementById('email-modal');
    const template = document.getElementById('email-template');
    
    const emailContent = `Subject: Your Photo Edit Request - Payment Link

Dear ${request.name || 'Customer'},

Thank you for submitting your photo editing request! We've reviewed your submission and are ready to proceed.

Request Details:
- Request ID: #${request.id.split('_')[1]}
- Instructions: ${request.instructions}
- Total Amount: ${request.total_price}

To proceed with your photo edit, please complete payment using the secure link below:
${stripeLink}

Once payment is confirmed, we'll begin editing your photo and deliver the final result within ${request.rush_order ? '12 hours' : '24-48 hours'}.

If you have any questions, please don't hesitate to contact us.

Best regards,
PhotoEdit Pro Team
support@photoeditpro.com`;
    
    template.value = emailContent;
    modal.style.display = 'flex';
}

function closeEmailModal() {
    document.getElementById('email-modal').style.display = 'none';
}

function copyEmailTemplate() {
    const template = document.getElementById('email-template');
    template.select();
    document.execCommand('copy');
    showNotification('Email template copied to clipboard!');
}

function contactCustomer(requestId) {
    const submissions = JSON.parse(localStorage.getItem('photoEditSubmissions') || '[]');
    const request = submissions.find(s => s.id === requestId);
    
    if (request) {
        const subject = `Photo Edit Request #${request.id.split('_')[1]} - Update`;
        const body = `Dear ${request.name || 'Customer'},\n\nRegarding your photo editing request...\n\nBest regards,\nPhotoEdit Pro Team`;
        
        window.open(`mailto:${request.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
}

function viewDetails(requestId) {
    const submissions = JSON.parse(localStorage.getItem('photoEditSubmissions') || '[]');
    const request = submissions.find(s => s.id === requestId);
    
    if (request) {
        alert(`Request Details:\n\nID: ${request.id}\nEmail: ${request.email}\nName: ${request.name || 'Not provided'}\nInstructions: ${request.instructions}\nTotal: ${request.total_price}\nSubmitted: ${new Date(request.submission_date).toLocaleString()}\nStatus: ${request.status}`);
    }
}

function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

function refreshRequests() {
    loadDashboardData();
    showNotification('Dashboard refreshed!');
}

function formatFileSize(bytes) {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: #059669;' : 'background: #ef4444;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Demo data for testing (remove in production)
function addDemoData() {
    const demoSubmissions = [
        {
            id: 'req_' + (Date.now() - 86400000),
            email: 'john.doe@example.com',
            name: 'John Doe',
            instructions: 'Remove background and make it white, brighten the image and increase contrast',
            rush_order: true,
            high_res: false,
            total_price: '$3.00',
            file_name: 'portrait.jpg',
            file_size: 2048576,
            submission_date: new Date(Date.now() - 86400000).toISOString(),
            status: 'pending'
        },
        {
            id: 'req_' + (Date.now() - 172800000),
            email: 'jane.smith@example.com',
            name: 'Jane Smith',
            instructions: 'Add vintage filter and crop to square format',
            rush_order: false,
            high_res: true,
            total_price: '$2.00',
            file_name: 'landscape.png',
            file_size: 5242880,
            submission_date: new Date(Date.now() - 172800000).toISOString(),
            status: 'in-progress'
        }
    ];
    
    localStorage.setItem('photoEditSubmissions', JSON.stringify(demoSubmissions));
}