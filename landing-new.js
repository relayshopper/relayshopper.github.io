// Landing Page JavaScript - Mystery Shopper Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initCountdownTimer();
    initIncomeCalculator();
    initPositionCounter();
    initCurrentMonthDeadline();
    initFormValidation();
    initFAQToggle();
    initSmoothScrolling();
    initScrollAnimations();
    
    // Initialize exit intent after delay
    setTimeout(initExitIntent, 5000);
    
    // Track page performance
    trackPagePerformance();
    
    // Animate sections on scroll
    const sections = document.querySelectorAll('.hero, .benefits, .income-calculator, .testimonials, .faq, .cta');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Global variables
let remainingPositions = 47;

// Countdown Timer
function initCountdownTimer() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    // Set deadline to end of current month
    const now = new Date();
    const deadline = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = deadline.getTime() - now;
        
        if (distance < 0) {
            countdownElement.innerHTML = "EXPIRED";
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Income Calculator
function initIncomeCalculator() {
    const slider = document.getElementById('assignments');
    const assignmentDisplay = document.getElementById('assignment-count');
    const monthlyIncomeDisplay = document.getElementById('monthly-income');
    const yearlyIncomeDisplay = document.getElementById('yearly-income');
    
    if (!slider || !assignmentDisplay || !monthlyIncomeDisplay) return;
    
    function updateIncome() {
        const assignments = parseInt(slider.value);
        assignmentDisplay.textContent = assignments;
        
        // Calculate income based on assignments (realistic rates per assignment)
        let ratePerAssignment;
        if (assignments <= 8) ratePerAssignment = 500; // Part-time rate
        else if (assignments <= 15) ratePerAssignment = 550; // Standard rate
        else if (assignments <= 25) ratePerAssignment = 600; // Full-time rate
        else ratePerAssignment = 650; // Premium rate
        
        const monthlyIncome = assignments * ratePerAssignment;
        const yearlyIncome = monthlyIncome * 12;
        
        // Format with range for realism
        const lowerBound = Math.round(monthlyIncome * 0.9);
        const upperBound = Math.round(monthlyIncome * 1.1);
        
        monthlyIncomeDisplay.textContent = `$${lowerBound.toLocaleString()} - $${upperBound.toLocaleString()}`;
        
        if (yearlyIncomeDisplay) {
            const yearlyLower = lowerBound * 12;
            const yearlyUpper = upperBound * 12;
            yearlyIncomeDisplay.textContent = `$${yearlyLower.toLocaleString()} - $${yearlyUpper.toLocaleString()} annually`;
        }
        
        // Update tier selection based on assignments
        updateTierSelection(assignments);
    }
    
    slider.addEventListener('input', updateIncome);
    updateIncome(); // Initial calculation
}

// Function to update tier selection based on assignments
function updateTierSelection(assignments) {
    const tiers = document.querySelectorAll('.tier');
    
    // Remove active class from all tiers
    tiers.forEach(tier => tier.classList.remove('active'));
    
    // Determine which tier should be active based on assignments
    let activeTierIndex = 1; // Default to Standard (index 1)
    
    if (assignments <= 8) {
        activeTierIndex = 0; // Part-Time
    } else if (assignments <= 15) {
        activeTierIndex = 1; // Standard
    } else {
        activeTierIndex = 2; // Full-Time
    }
    
    // Add active class to the appropriate tier
    if (tiers[activeTierIndex]) {
        tiers[activeTierIndex].classList.add('active');
    }
}

// Global function for external access
window.calculateIncome = function() {
    const slider = document.getElementById('assignments');
    const assignmentDisplay = document.getElementById('assignment-count');
    const monthlyIncomeDisplay = document.getElementById('monthly-income');
    const yearlyIncomeDisplay = document.getElementById('yearly-income');
    
    if (!slider || !assignmentDisplay || !monthlyIncomeDisplay) return;
    
    const assignments = parseInt(slider.value);
    assignmentDisplay.textContent = assignments;
    
    // Calculate income based on assignments (realistic rates per assignment)
    let ratePerAssignment;
    if (assignments <= 8) ratePerAssignment = 500; // Part-time rate
    else if (assignments <= 15) ratePerAssignment = 550; // Standard rate
    else if (assignments <= 25) ratePerAssignment = 600; // Full-time rate
    else ratePerAssignment = 650; // Premium rate
    
    const monthlyIncome = assignments * ratePerAssignment;
    
    // Format with range for realism
    const lowerBound = Math.round(monthlyIncome * 0.9);
    const upperBound = Math.round(monthlyIncome * 1.1);
    
    monthlyIncomeDisplay.textContent = `$${lowerBound.toLocaleString()} - $${upperBound.toLocaleString()}`;
    
    if (yearlyIncomeDisplay) {
        const yearlyLower = lowerBound * 12;
        const yearlyUpper = upperBound * 12;
        yearlyIncomeDisplay.textContent = `$${yearlyLower.toLocaleString()} - $${yearlyUpper.toLocaleString()} annually`;
    }
    
    // Update tier selection based on assignments
    updateTierSelection(assignments);
};

// Position Counter (Scarcity)
function updatePositionCounter() {
    if (Math.random() < 0.3) {
        remainingPositions = Math.max(remainingPositions - 1, 15);
    }
    
    const positionElements = document.querySelectorAll('#positions-remaining, #positions-status, #final-positions');
    positionElements.forEach(element => {
        if (element) {
            element.textContent = remainingPositions;
        }
    });
    
    localStorage.setItem('positions-remaining', remainingPositions);
}

function initPositionCounter() {
    const savedPositions = localStorage.getItem('positions-remaining');
    if (savedPositions) {
        remainingPositions = parseInt(savedPositions);
        const positionElements = document.querySelectorAll('#positions-remaining, #positions-status, #final-positions');
        positionElements.forEach(element => {
            if (element) {
                element.textContent = remainingPositions;
            }
        });
    }
    
    setInterval(updatePositionCounter, 30000);
}

// Current Month Deadline
function initCurrentMonthDeadline() {
    const deadlineElement = document.getElementById('current-month-deadline');
    if (!deadlineElement) return;
    
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
    const day = lastDayOfMonth.getDate();
    
    // Format: "March 31st, 2024"
    let dayWithSuffix = day;
    if (day === 1 || day === 21 || day === 31) dayWithSuffix += 'st';
    else if (day === 2 || day === 22) dayWithSuffix += 'nd';
    else if (day === 3 || day === 23) dayWithSuffix += 'rd';
    else dayWithSuffix += 'th';
    
    deadlineElement.textContent = `${monthName} ${dayWithSuffix}, ${year}`;
}

// Form Validation
function initFormValidation() {
    console.log('Initializing form validation...');
    const form = document.getElementById('application-form');
    if (!form) {
        console.error('Form with ID "application-form" not found!');
        return;
    }
    
    console.log('Form found:', form);
    form.addEventListener('submit', handleFormSubmission);
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    console.log('Found', inputs.length, 'form inputs');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    console.log('Form validation initialized successfully');
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    removeFieldError(field);
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function removeFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function clearFieldError(event) {
    const field = event.target;
    removeFieldError(field);
}

async function submitToGoogleSheets(formData) {
    // Replace this URL with your actual Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw-E6Ha6EXxtDQxc4eMfLRJjSKHVP8N3a02mELEpVwAttbtHjzQ62ra45ZqpJFDUxaIAg/exec';
    
    console.log('Submitting to Google Sheets...');
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData)
        });
        
        console.log('Google Sheets submission completed');
        return { success: true };
        
    } catch (error) {
        console.error('Google Sheets submission error:', error);
        throw error;
    }
}

async function handleFormSubmission(event) {
    console.log('Form submission handler called');
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    console.log('Form data:', Object.fromEntries(formData));
    
    // Validate all fields
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    console.log('Form validation result:', isValid);
    
    if (!isValid) {
        showErrorMessage('Please correct the errors above and try again.');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    console.log('Starting form submission...');
    
    try {
        // Submit to Google Sheets
        await submitToGoogleSheets(formData);
        
        // Track conversion
        trackConversion(formData);
        
        console.log('Form submitted successfully');
        
        // Redirect to success page
        window.location.href = 'success.html';
        
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage('There was an error submitting your application. Please try again.');
        
        // Reset button on error
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

function showErrorMessage(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div style="background: #ff6b6b; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <strong>Error:</strong> ${message}
        </div>
    `;
    
    const form = document.getElementById('application-form');
    if (form) {
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

function showSuccessMessage() {
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="background: #4CAF50; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="margin: 0 0 10px 0;">Application Submitted Successfully!</h3>
            <p style="margin: 0;">Thank you for your interest! We'll review your application and contact you within 24-48 hours with next steps.</p>
        </div>
    `;
    
    const form = document.getElementById('application-form');
    if (form) {
        form.insertBefore(successDiv, form.firstChild);
        form.style.display = 'none';
    }
}

function trackConversion(formData) {
    // Track conversion event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL'
        });
    }
}

// FAQ Toggle
function initFAQToggle() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => toggleFAQ(question));
        }
    });
}

window.toggleFAQ = function(element) {
    const faqItem = element.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const isOpen = faqItem.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-answer').style.display = 'none';
    });
    
    // Toggle current item
    if (!isOpen) {
        faqItem.classList.add('active');
        answer.style.display = 'block';
    }
};

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.benefit-card, .testimonial-card, .step-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Exit Intent
function initExitIntent() {
    let hasShownPopup = false;
    
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !hasShownPopup) {
            showExitIntentPopup();
            hasShownPopup = true;
        }
    });
}

function showExitIntentPopup() {
    const popup = document.createElement('div');
    popup.className = 'exit-intent-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-header">
                <h3>Wait! Don't Miss Out!</h3>
                <button class="close-popup" onclick="closeExitPopup()">&times;</button>
            </div>
            <p><strong>Before you go...</strong></p>
            <ul>
                <li>✓ Free training provided</li>
                <li>✓ Flexible schedule</li>
                <li>✓ $25-35/hour potential</li>
                <li>✓ No experience required</li>
            </ul>
            <p>Only <span id="popup-positions">47</span> positions remaining.</p>
            <button class="cta-button" onclick="document.getElementById('application-form').scrollIntoView({behavior: 'smooth'}); closeExitPopup();">
                Apply Now - It's Free!
            </button>
        </div>
    `;
    
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(popup);
    
    // Update popup positions count
    const popupPositions = popup.querySelector('#popup-positions');
    if (popupPositions) {
        popupPositions.textContent = remainingPositions;
    }
}

window.closeExitPopup = function() {
    const popup = document.querySelector('.exit-intent-popup');
    if (popup) {
        popup.remove();
    }
};

// Performance Tracking
function trackPagePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log('Page load time:', loadTime + 'ms');
            }, 0);
        });
    }
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Add CSS for validation and popup
if (!document.getElementById('validation-styles')) {
    const validationStyles = document.createElement('style');
    validationStyles.id = 'validation-styles';
    validationStyles.textContent = `
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #ff6b6b !important;
            background: rgba(255, 107, 107, 0.1) !important;
        }
        
        .field-error {
            color: #ff6b6b;
            font-size: 0.9rem;
            margin-top: 5px;
            display: block;
        }
        
        .exit-intent-popup .popup-content {
            background: white;
            padding: 40px;
            border-radius: 20px;
            max-width: 500px;
            margin: 20px;
            text-align: center;
            position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        .exit-intent-popup .popup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .exit-intent-popup .close-popup {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #999;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .exit-intent-popup .close-popup:hover {
            color: #333;
        }
        
        .exit-intent-popup h3 {
            color: #ff6b35;
            font-size: 1.5rem;
            margin: 0;
        }
        
        .exit-intent-popup ul {
            text-align: left;
            margin: 20px 0;
            padding-left: 0;
            list-style: none;
        }
        
        .exit-intent-popup li {
            padding: 5px 0;
            color: #333;
        }
        
        .exit-intent-popup .cta-button {
            margin-top: 20px;
            width: 100%;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(validationStyles);
}

// Global function for smooth scrolling to application form
window.scrollToApplication = function() {
    console.log('scrollToApplication called');
    const applicationSection = document.getElementById('application');
    if (applicationSection) {
        applicationSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        console.log('Scrolled to application section');
    } else {
        console.error('Application section not found');
    }
};