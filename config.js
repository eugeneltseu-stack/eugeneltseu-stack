// Configuration file for PhotoEdit Pro
// Update these values to customize your website

window.PhotoEditConfig = {
    // Site Information
    siteName: "PhotoEdit Pro",
    tagline: "Get Your Photos Edited – $1 per image",
    supportEmail: "support@photoeditpro.com",
    
    // Pricing
    basePrice: 1.00,
    rushOrderPrice: 2.00,
    highResPrice: 1.00,
    
    // Form Configuration
    formspreeEndpoint: "https://formspree.io/f/YOUR_FORM_ID", // Replace with your Formspree form ID
    emailjsServiceId: "YOUR_SERVICE_ID", // If using EmailJS
    emailjsTemplateId: "YOUR_TEMPLATE_ID", // If using EmailJS
    
    // File Upload Settings
    maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
    allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    
    // Admin Settings
    adminPassword: "photoedit2024", // Change this to a secure password
    
    // Delivery Times
    standardDelivery: "24-48 hours",
    rushDelivery: "12 hours",
    
    // Contact Information
    contactInfo: {
        email: "support@photoeditpro.com",
        responseTime: "Within 24 hours"
    },
    
    // Social Media (optional)
    socialMedia: {
        facebook: "",
        instagram: "",
        twitter: ""
    },
    
    // Features
    features: {
        dragAndDrop: true,
        rushOrders: true,
        highResolution: true,
        emailNotifications: true
    },
    
    // Content
    faqItems: [
        {
            question: "What's the turnaround time?",
            answer: "Most edits are completed within 24-48 hours after payment confirmation."
        },
        {
            question: "What file formats do you accept?",
            answer: "We accept JPG, PNG, and most common image formats up to 10MB."
        },
        {
            question: "What types of edits do you do?",
            answer: "Color correction, background removal, retouching, filters, and basic photo enhancements."
        },
        {
            question: "Do you offer refunds?",
            answer: "If you're not satisfied with the edit, we'll revise it once for free or provide a full refund."
        },
        {
            question: "Is my data secure?",
            answer: "Yes, all images are processed securely and deleted after delivery unless you request otherwise."
        },
        {
            question: "Can I request multiple edits?",
            answer: "Each image is $1. For multiple images, please submit separate requests or contact us for bulk pricing."
        }
    ],
    
    // Steps for "How It Works" section
    steps: [
        {
            number: 1,
            title: "Upload Your Photo",
            description: "Submit your image along with detailed editing instructions"
        },
        {
            number: 2,
            title: "Add Instructions",
            description: "Tell us exactly what edits you want - be as specific as possible"
        },
        {
            number: 3,
            title: "Wait for Approval",
            description: "We'll review your request and ensure it meets our guidelines"
        },
        {
            number: 4,
            title: "Pay via Stripe",
            description: "Receive a secure payment link via email - only $1 per image"
        },
        {
            number: 5,
            title: "Get Your Edit",
            description: "Receive your professionally edited photo within 24-48 hours"
        }
    ],
    
    // Email Templates
    emailTemplates: {
        paymentRequest: `Subject: Your Photo Edit Request - Payment Link

Dear {customerName},

Thank you for submitting your photo editing request! We've reviewed your submission and are ready to proceed.

Request Details:
- Request ID: #{requestId}
- Instructions: {instructions}
- Total Amount: {totalPrice}

To proceed with your photo edit, please complete payment using the secure link below:
{stripeLink}

Once payment is confirmed, we'll begin editing your photo and deliver the final result within {deliveryTime}.

If you have any questions, please don't hesitate to contact us.

Best regards,
PhotoEdit Pro Team
{supportEmail}`,
        
        completionNotice: `Subject: Your Photo Edit is Complete!

Dear {customerName},

Great news! Your photo edit is complete and ready for download.

Request ID: #{requestId}
Completed: {completionDate}

Please find your edited photo attached to this email.

We hope you love the result! If you need any revisions, please let us know within 24 hours.

Thank you for choosing PhotoEdit Pro!

Best regards,
PhotoEdit Pro Team
{supportEmail}`
    }
};

// Apply configuration on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update site name in navigation
    const logoElements = document.querySelectorAll('.nav-logo h2, .nav-logo h3');
    logoElements.forEach(el => {
        if (el) el.textContent = window.PhotoEditConfig.siteName;
    });
    
    // Update tagline in hero section
    const taglineElement = document.querySelector('.hero-subtitle');
    if (taglineElement) {
        taglineElement.textContent = window.PhotoEditConfig.tagline;
    }
    
    // Update contact email
    const emailElements = document.querySelectorAll('[href^="mailto:"]');
    emailElements.forEach(el => {
        el.href = `mailto:${window.PhotoEditConfig.supportEmail}`;
        if (el.textContent.includes('@')) {
            el.textContent = window.PhotoEditConfig.supportEmail;
        }
    });
    
    // Update form action if Formspree endpoint is configured
    const forms = document.querySelectorAll('form[action*="formspree"]');
    forms.forEach(form => {
        if (window.PhotoEditConfig.formspreeEndpoint !== "https://formspree.io/f/YOUR_FORM_ID") {
            form.action = window.PhotoEditConfig.formspreeEndpoint;
        }
    });
});