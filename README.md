# PhotoEdit Pro - Photo Editing Service Website

A clean, modern static website for a $1 photo editing service. Built with HTML, CSS, and JavaScript, designed to be hosted on GitHub Pages.

## Features

- **Clean, Modern Design**: Blue and white color scheme with smooth animations
- **Mobile Responsive**: Works perfectly on all devices
- **Photo Upload**: Drag & drop or click to upload images
- **Form Handling**: Integration with Formspree for form submissions
- **Admin Panel**: Password-protected admin interface for managing requests
- **Pricing Calculator**: Dynamic pricing with add-on options
- **Email Templates**: Pre-built email templates for customer communication

## Pages

1. **Home Page** (`index.html`)
   - Hero section with clear value proposition
   - How it works section
   - FAQ section
   - Contact form

2. **Request Page** (`request.html`)
   - Photo upload with validation
   - Detailed instruction form
   - Pricing calculator
   - Success confirmation

3. **Admin Panel** (`admin.html`)
   - Password-protected access
   - Dashboard with statistics
   - Request management (pending, in-progress, completed)
   - Stripe payment link integration
   - Email template generator

## Setup Instructions

### 1. Basic Setup

1. Clone or download this repository
2. Upload all files to your GitHub Pages repository
3. Enable GitHub Pages in your repository settings

### 2. Form Integration

#### Option A: Formspree (Recommended)
1. Sign up at [Formspree.io](https://formspree.io)
2. Create a new form and get your form ID
3. Replace `YOUR_FORM_ID` in the following files:
   - `index.html` (contact form)
   - `request.html` (photo request form)

#### Option B: EmailJS
1. Sign up at [EmailJS.com](https://www.emailjs.com)
2. Set up your email service and template
3. Include EmailJS library in your HTML
4. Update the JavaScript to use EmailJS instead of Formspree

### 3. Admin Panel Configuration

1. Open `admin.js`
2. Change the `ADMIN_PASSWORD` to a secure password
3. Update the Stripe dashboard URL if needed

### 4. Customization

#### Colors and Branding
- Edit `styles.css` to change colors, fonts, and styling
- Replace "PhotoEdit Pro" with your brand name in all HTML files
- Update contact information and email addresses

#### Pricing
- Modify pricing in `request.js` and `request.html`
- Update the pricing display and calculation logic

#### Content
- Edit the FAQ section in `index.html`
- Update the "How it Works" steps
- Modify email templates in `admin.js`

## File Structure

```
├── index.html          # Home page
├── request.html        # Photo request form
├── admin.html          # Admin panel
├── styles.css          # All CSS styles
├── script.js           # Main JavaScript functionality
├── request.js          # Request form functionality
├── admin.js            # Admin panel functionality
└── README.md           # This file
```

## Workflow

1. **Customer submits request** via the request form
2. **Form data is sent** to Formspree/EmailJS
3. **Admin receives notification** and reviews the request
4. **Admin approves** and sends Stripe payment link
5. **Customer pays** via Stripe
6. **Admin edits photo** and marks as completed
7. **Customer receives** edited photo via email

## Technical Details

### Form Handling
- Uses Formspree for form submissions (no backend required)
- File uploads are handled via FormData API
- Client-side validation for email and file types

### Admin Panel
- Simple password protection (client-side for demo)
- LocalStorage for demo data persistence
- Real implementation would use a backend database

### Payment Processing
- Manual Stripe payment link generation
- Admin sends payment links via email
- No direct Stripe integration (keeps it simple)

### File Upload
- Supports drag & drop and click to upload
- File type validation (images only)
- File size limit (10MB)
- Preview and file information display

## Security Considerations

### For Production Use:
1. **Admin Authentication**: Implement proper server-side authentication
2. **Form Validation**: Add server-side validation
3. **File Storage**: Use secure cloud storage for uploaded files
4. **HTTPS**: Ensure all pages are served over HTTPS
5. **Content Policy**: Implement automated content filtering

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized images and CSS
- Minimal JavaScript dependencies
- Fast loading times
- Mobile-first responsive design

## Deployment

### GitHub Pages
1. Push all files to your GitHub repository
2. Go to Settings > Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://yourusername.github.io/repository-name`

### Custom Domain
1. Add a `CNAME` file with your domain name
2. Configure DNS settings with your domain provider
3. Enable HTTPS in GitHub Pages settings

## Support

For questions or issues:
- Check the FAQ section on the website
- Review the code comments for implementation details
- Test the admin panel with demo data

## License

This project is open source and available under the MIT License.

## Future Enhancements

- Backend integration for proper data persistence
- Automated email sending
- Payment webhook integration
- Advanced admin features
- Customer account system
- Bulk upload support
- API integration for automated editing