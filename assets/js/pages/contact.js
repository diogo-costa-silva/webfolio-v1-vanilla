// Contact Module

import { getCurrentLanguage } from '../core/language.js';

let translations = {};

export function initContact() {
    loadTranslationsAndInit();

    // Listen for language changes and reload translations
    window.addEventListener('languageChanged', async () => {
        await loadTranslations();
    });
}

async function loadTranslations() {
    try {
        const response = await fetch('data/translations.json');
        const data = await response.json();
        const currentLang = getCurrentLanguage();
        translations = data[currentLang] || data['en'];
    } catch (error) {
        console.error('Error loading translations:', error);
        translations = {};
    }
}

async function loadTranslationsAndInit() {
    await loadTranslations();

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        initFormValidation(contactForm);
        initFormSubmission(contactForm);
    }
}

function initFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    field.classList.remove('error');
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = translations['validation.required'] || 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = translations['validation.email'] || 'Please enter a valid email address';
        }
    }

    // Show error if invalid
    if (!isValid) {
        field.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        errorElement.style.color = 'var(--error)';
        errorElement.style.fontSize = 'var(--text-sm)';
        errorElement.style.marginTop = 'var(--space-xs)';
        errorElement.style.display = 'block';
        field.parentElement.appendChild(errorElement);
    }

    return isValid;
}

function initFormSubmission(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea, select');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            return;
        }

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = translations['validation.sending'] || 'Sending...';

        try {
            // Here you would integrate with EmailJS or your backend
            // For now, we'll simulate a successful submission
            await simulateFormSubmission(data);

            // Show success message
            const successMessage = translations['feedback.success'] || 'Message sent successfully!';
            showNotification(successMessage, 'success');
            form.reset();
        } catch (error) {
            // Show error message
            const errorMessage = translations['feedback.error'] || 'Failed to send message. Please try again.';
            showNotification(errorMessage, 'error');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        console.log('Form data:', data);
        setTimeout(resolve, 1500);
    });
}

function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: calc(var(--header-height) + var(--space-lg));
        right: var(--space-lg);
        padding: var(--space-md) var(--space-lg);
        background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
        color: white;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: var(--z-notification);
        animation: slideInRight var(--transition-base) ease-out;
    `;

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight var(--transition-base) ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add styles for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
        border-color: var(--error);
    }
`;
document.head.appendChild(style);