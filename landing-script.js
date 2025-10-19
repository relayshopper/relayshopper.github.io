// Landing Page Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initCountdownTimer();
    initIncomeCalculator();
    initFormValidation();
    initScrollAnimations();
    initFAQToggle();
    initSmoothScrolling();
    initPositionCounter();
    
    // Show fade-in animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all sections for animations
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
});

// Countdown Timer
function initCountdownTimer() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    // Set countdown to 24 hours from now
    const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = endTime - now;
        
        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            countdownElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            countdownElement.textContent = '00:00:00';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Income Calculator
function initIncomeCalculator() {
    const assignmentsSlider = document.getElementById('assignments');
    const assignmentCount = document.getElementById('assignment-count');
    const monthlyIncome = document.getElementById('monthly-income');
    const yearlyIncome = document.getElementById('yearly-income');
    const tiers = document.querySelectorAll('.tier');
    
    if (!assignmentsSlider) return;
    
    function calculateIncome() {
        const assignments = parseInt(assignmentsSlider.value);
        const minPay = 500;
        const maxPay = 600;
        
        const monthlyMin = assignments * minPay;
        const monthlyMax = assignments * maxPay;
        const yearlyMin = monthlyMin * 12;
        const yearlyMax = monthlyMax * 12;
        
        assignmentCount.textContent = assignments;
        monthlyIncome.textContent = `$${monthlyMin.toLocaleString()} - $${monthlyMax.toLocaleString()}`;
        yearlyIncome.textContent = `$${yearlyMin.toLocaleString()} - $${yearlyMax.toLocaleString()} annually`;
        
        // Update tier highlighting
        tiers.forEach(tier => tier.classList.remove('active'));
        
        if (assignments <= 10) {
            tiers[0]?.classList.add('active');
        } else if (assignments <= 20) {
            tiers[1]?.classList.add('active');
        } else {
            tiers[2]?.classList.add('active');
        }
    }
    
    assignmentsSlider.addEventListener('input', calculateIncome);
    calculateIncome(); // Initial calculation
}

// Make calculateIncome globally available
window.calculateIncome = function() {
    const assignmentsSlider = document.getElementById('assignments');
    const assignmentCount = document.getElementById('assignment-count');
    const monthlyIncome = document.getElementById('monthly-income');
    const yearlyIncome = document.getElementById('yearly-income');
    const tiers = document.querySelectorAll('.tier');
    
    if (!assignmentsSlider) return;
    
    const assignments = parseInt(assignmentsSlider.value);
    const minPay = 500;
    const maxPay = 600;
    
    const monthlyMin = assignments * minPay;
    const monthlyMax = assignments * maxPay;
    const yearlyMin = monthlyMin * 12;
    const yearlyMax = monthlyMax * 12;
    
    assignmentCount.textContent = assignments;
    monthlyIncome.textContent = `$${monthlyMin.toLocaleString()} - $${monthlyMax.toLocaleString()}`;
    yearlyIncome.textContent = `$${yearlyMin.toLocaleString()} - $${yearlyMax.toLocaleString()} annually`;
    
    // Update tier highlighting
    tiers.forEach(tier => tier.classList.remove('active'));
    
    if (assignments <= 10) {
        tiers[0]?.classList.add('active');
    } else if (assignments <= 20) {
        tiers[1]?.classList.add('active');
    } else {
        tiers[2]?.classList.add('active');
    }
};

// Form Validation
function initFormValidation() {
    const form = document.getElementById('mysteryShopperForm');
    if (!form) return;
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmission);
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styling
    field.classList.remove('error');
    removeFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // ZIP code validation
    if (field.name === 'zip' && value) {
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid ZIP code (12345 or 12345-6789)';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#ff6b6b';
    errorElement.style.fontSize = '0.9rem';
    errorElement.style.marginTop = '5px';
    
    // Insert after the field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

function removeFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    removeFieldError(field);
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    let isFormValid = true;
    
    // Validate all fields
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isFormValid = false;
        }
    });
    
    // Check terms checkbox
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        isFormValid = false;
        showFieldError(termsCheckbox, 'You must agree to the terms and conditions');
    }
    
    if (isFormValid) {
        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="cta-text">SUBMITTING...</span>';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            showSuccessMessage();
            
            // Reset form
            form.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Track conversion (in real implementation, this would be actual tracking)
            trackConversion(formData);
            
        }, 2000);
    } else {
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function showSuccessMessage() {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <h3>🎉 Application Submitted Successfully!</h3>
        <p><strong>Welcome to the Mystery Shopper Program!</strong></p>
        <p>You'll receive a confirmation call within 24 hours to verify your application.</p>
        <p><strong>Your first assignment packet with detailed instructions will arrive within 5-7 business days.</strong></p>
        <p>Check your email for immediate next steps and training materials.</p>
        <div style="margin-top: 15px; padding: 15px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #4CAF50;">
            <strong>📦 What to expect in your packet:</strong><br>
            • Assignment details and locations<br>
            • Evaluation forms and guidelines<br>
            • Payment processing information<br>
            • Direct contact for your success coach
        </div>
    `;
    successMessage.style.display = 'block';
    
    // Insert after form
    const form = document.getElementById('mysteryShopperForm');
    form.parentNode.insertBefore(successMessage, form.nextSibling);
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto-hide after 15 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 15000);
}

function trackConversion(formData) {
    // In a real implementation, this would send data to analytics
    console.log('Conversion tracked:', {
        timestamp: new Date().toISOString(),
        formData: Object.fromEntries(formData),
        source: 'landing-page'
    });
    
    // Update position counter
    updatePositionCounter();
}

// FAQ Toggle
function initFAQToggle() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Make toggleFAQ globally available
window.toggleFAQ = function(element) {
    const faqItem = element.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        faqItem.classList.add('active');
    }
};

// Smooth Scrolling
function initSmoothScrolling() {
    // Smooth scroll to application form
    window.scrollToApplication = function() {
        const applicationSection = document.getElementById('application');
        if (applicationSection) {
            applicationSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };
}

// Position Counter (Scarcity)
function initPositionCounter() {
    // Simulate decreasing positions
    let positions = 47;
    
    function updatePositionCounter() {
        // Randomly decrease positions occasionally
        if (Math.random() < 0.1) { // 10% chance every update
            positions = Math.max(positions - 1, 15); // Don't go below 15
            
            // Update all position displays
            const positionElements = document.querySelectorAll('#positions-remaining, #positions-status, #final-positions');
            positionElements.forEach(element => {
                if (element) {
                    element.textContent = positions;
                }
            });
            
            // Store in localStorage to persist across page reloads
            localStorage.setItem('positions-remaining', positions);
        }
    }
    
    // Load saved position count
    const savedPositions = localStorage.getItem('positions-remaining');
    if (savedPositions) {
        positions = parseInt(savedPositions);
        const positionElements = document.querySelectorAll('#positions-remaining, #positions-status, #final-positions');
        positionElements.forEach(element => {
            if (element) {
                element.textContent = positions;
            }
        });
    }
    
    // Update positions every 30 seconds
    setInterval(updatePositionCounter, 30000);
}

// Scroll Animations
function initScrollAnimations() {
    // Add scroll-triggered animations
    const animatedElements = document.querySelectorAll('.testimonial, .job-type, .benefit, .trust-item');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Stagger animations
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        animationObserver.observe(element);
    });
}

// Exit Intent Detection
function initExitIntent() {
    let exitIntentShown = false;
    
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !exitIntentShown) {
            exitIntentShown = true;
            showExitIntentPopup();
        }
    });
}

function showExitIntentPopup() {
    // Create exit intent popup
    const popup = document.createElement('div');
    popup.className = 'exit-intent-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-header">
                <h3>🚨 Wait! Don't Miss Out!</h3>
                <button class="close-popup" onclick="closeExitPopup()">&times;</button>
            </div>
            <div class="popup-body">
                <p><strong>Last chance to secure your position!</strong></p>
                <p>Only <span id="popup-positions">47</span> positions remaining.</p>
                <p>Apply now and get:</p>
                <ul>
                    <li>✅ FREE $1,200 training program</li>
                    <li>✅ Guaranteed $500+ per assignment</li>
                    <li>✅ Personal success coach</li>
                </ul>
                <button class="cta-button primary" onclick="scrollToApplication(); closeExitPopup();">
                    SECURE MY POSITION NOW
                </button>
            </div>
        </div>
    `;
    
    // Add popup styles
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(popup);
    
    // Auto-close after 10 seconds
    setTimeout(() => {
        if (document.body.contains(popup)) {
            closeExitPopup();
        }
    }, 10000);
}

window.closeExitPopup = function() {
    const popup = document.querySelector('.exit-intent-popup');
    if (popup) {
        popup.remove();
    }
};

// Initialize exit intent after 5 seconds
setTimeout(initExitIntent, 5000);

// Add CSS for exit intent popup
if (!document.getElementById('exit-intent-styles')) {
    const exitIntentStyles = document.createElement('style');
    exitIntentStyles.id = 'exit-intent-styles';
    exitIntentStyles.textContent = `
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
    document.head.appendChild(exitIntentStyles);
}

// Performance tracking
function trackPagePerformance() {
    // Track page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log('Page loaded in:', Math.round(loadTime), 'ms');
        
        // In real implementation, send to analytics
        // analytics.track('page_load_time', { duration: loadTime });
    });
    
    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', function() {
        const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            
            // Track milestone scroll depths
            if (maxScrollDepth >= 25 && !window.scrollTracked25) {
                window.scrollTracked25 = true;
                console.log('Scrolled 25%');
            }
            if (maxScrollDepth >= 50 && !window.scrollTracked50) {
                window.scrollTracked50 = true;
                console.log('Scrolled 50%');
            }
            if (maxScrollDepth >= 75 && !window.scrollTracked75) {
                window.scrollTracked75 = true;
                console.log('Scrolled 75%');
            }
            if (maxScrollDepth >= 90 && !window.scrollTracked90) {
                window.scrollTracked90 = true;
                console.log('Scrolled 90%');
            }
        }
    });
}

// Initialize performance tracking
trackPagePerformance();

// Add error handling for all functions
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, send to error tracking service
});

// Add CSS for form validation errors
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
    `;
    document.head.appendChild(validationStyles);
}