// Form Handler for Waitlist Form
// Handles form submission, validation, and Supabase integration

document.addEventListener('DOMContentLoaded', function() {
    // Phone number formatting: 04XX XXX XXX (moved from inline script for CSP)
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            value = value.replace(/\D/g, '');
            if (value.length > 0 && !value.startsWith('04')) {
                if (value.startsWith('4')) {
                    value = '0' + value;
                } else {
                    value = '04' + value.replace(/^0*/, '');
                }
            }
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
            let formatted = '';
            if (value.length > 0) {
                formatted = value.substring(0, 4);
                if (value.length > 4) formatted += ' ' + value.substring(4, 7);
                if (value.length > 7) formatted += ' ' + value.substring(7, 10);
            }
            e.target.value = formatted;
        });
        phoneInput.addEventListener('blur', function(e) {
            const value = e.target.value.replace(/\s/g, '');
            const phoneError = document.getElementById('phoneError');
            if (value.length > 0 && value.length !== 10) {
                phoneError.textContent = 'Phone number must be in format 04XX XXX XXX';
            } else if (value.length > 0 && !value.startsWith('04')) {
                phoneError.textContent = 'Phone number must start with 04';
            } else {
                phoneError.textContent = '';
            }
        });
        phoneInput.addEventListener('input', function() {
            const phoneError = document.getElementById('phoneError');
            const value = this.value.replace(/\s/g, '');
            if (value.length === 10 && value.startsWith('04')) {
                phoneError.textContent = '';
            }
        });
    }

    const form = document.getElementById('personDetailsForm');
    const submitButton = document.getElementById('submitButton');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoader = document.getElementById('buttonLoader');
    const formMessage = document.getElementById('formMessage');

    // Initialize Supabase client
    // Wait for Supabase to be initialized (loaded by supabase-config.js)
    let supabase = window.supabaseClient;
    let supabaseInitialized = false;
    let waitForSupabaseInterval = null;
    
    // Wait for Supabase client to be ready
    waitForSupabaseInterval = setInterval(() => {
        const client = window.supabaseClient;
        if (client) {
            supabase = client;
            clearInterval(waitForSupabaseInterval);
            supabaseInitialized = true;
            waitForSupabaseInterval = null;
            console.log('Supabase client ready');
        }
    }, 100);
    
    // Timeout after 5 seconds
    setTimeout(() => {
        if (!supabaseInitialized && waitForSupabaseInterval) {
            clearInterval(waitForSupabaseInterval);
            waitForSupabaseInterval = null;
            console.error('Supabase client not initialized. Make sure supabase-config.js is loaded.');
            showMessage('Configuration error. Please refresh the page.', 'error');
            // Disable form inputs when initialization fails
            submitButton.disabled = true;
            const formInputs = form.querySelectorAll('input, select, button[type="submit"], button[type="reset"]');
            formInputs.forEach(input => {
                input.disabled = true;
            });
        }
    }, 5000);

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Check if Supabase is initialized
        if (!supabaseInitialized || !supabase) {
            showMessage('Configuration error. Please refresh the page and try again.', 'error');
            return;
        }
        
        // Clear previous messages
        clearMessages();
        
        // Validate form
        if (!validateForm()) {
            return;
        }

        // Disable submit button and show loading state
        setLoadingState(true);

        try {
            // Get form data
            const formData = getFormData();
            
            // Verify Supabase client before submitting
            if (!supabase || typeof supabase.from !== 'function') {
                throw new Error('Supabase client is not properly initialized');
            }
            
            // Submit to Supabase
            // Note: Using .select() requires a SELECT policy in addition to INSERT policy
            const { data, error } = await supabase
                .from('customer')
                .insert([formData])
                .select();

            if (error) {
                throw error;
            }

            // Success
            showMessage('Thank you! Your information has been submitted successfully.', 'success');
            form.reset();
            
            // Clear any error messages
            clearErrorMessages();

        } catch (error) {
            console.error('Form submission error:', error);
            handleSubmissionError(error);
        } finally {
            setLoadingState(false);
        }
    });

    // Get and format form data
    function getFormData() {
        const formData = {
            email: document.getElementById('email').value.trim(),
            first_name: document.getElementById('firstName').value.trim(),
            last_name: document.getElementById('lastName').value.trim(),
            mobile: formatMobileNumber(document.getElementById('phone').value),
            date_of_birth: document.getElementById('dateOfBirth').value || null,
            street_address: document.getElementById('streetAddress').value.trim() || null,
            city: document.getElementById('city').value.trim() || null,
            state: document.getElementById('state').value || null,
            postcode: document.getElementById('zipCode').value.trim() || null,
            source: 'waitlist_form',
            marketing_opt_in: true
        };

        // Convert empty strings to null for optional fields (RLS policy expects NULL, not empty strings)
        Object.keys(formData).forEach(key => {
            if (formData[key] === '') {
                // Convert empty strings to null for optional fields
                // Required fields (email, first_name, last_name, mobile) should never be empty due to validation
                if (key !== 'email' && key !== 'first_name' && key !== 'last_name' && key !== 'mobile') {
                    formData[key] = null;
                }
            }
        });

        return formData;
    }

    // Format mobile number to database format (remove spaces)
    function formatMobileNumber(mobile) {
        if (!mobile) return null;
        // Remove all spaces and return
        return mobile.replace(/\s/g, '');
    }

    // Validate form fields
    function validateForm() {
        let isValid = true;

        // Clear previous error messages
        clearErrorMessages();

        // Validate First Name
        const firstName = document.getElementById('firstName').value.trim();
        if (!firstName) {
            showFieldError('firstName', 'First name is required');
            isValid = false;
        }

        // Validate Last Name
        const lastName = document.getElementById('lastName').value.trim();
        if (!lastName) {
            showFieldError('lastName', 'Last name is required');
            isValid = false;
        }

        // Validate Email
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showFieldError('email', 'Email address is required');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate Mobile
        const mobile = document.getElementById('phone').value.trim();
        const mobileFormatted = mobile.replace(/\s/g, '');
        const mobileRegex = /^04[0-9]{8}$/;
        if (!mobile) {
            showFieldError('phone', 'Mobile number is required');
            isValid = false;
        } else if (!mobileRegex.test(mobileFormatted)) {
            showFieldError('phone', 'Mobile must be in format 04XX XXX XXX');
            isValid = false;
        }

        // Validate State (if provided)
        const state = document.getElementById('state').value;
        const validStates = ['NSW', 'VIC', 'QLD', 'ACT', 'NT', 'WA', 'TAS', 'SA'];
        if (state && !validStates.includes(state)) {
            showFieldError('state', 'Please select a valid Australian state');
            isValid = false;
        }

        // Validate Postcode (if provided)
        const postcode = document.getElementById('zipCode').value.trim();
        if (postcode && !/^[0-9]{4}$/.test(postcode)) {
            showFieldError('zipCode', 'Postcode must be 4 digits');
            isValid = false;
        }

        // Length limits (align with DB and prevent oversized payloads)
        const maxLengths = {
            firstName: 100,
            lastName: 100,
            email: 255,
            streetAddress: 500,
            city: 100,
            zipCode: 10
        };
        const firstNameEl = document.getElementById('firstName');
        const lastNameEl = document.getElementById('lastName');
        const emailEl = document.getElementById('email');
        const streetEl = document.getElementById('streetAddress');
        const cityEl = document.getElementById('city');
        const zipEl = document.getElementById('zipCode');
        if (firstNameEl && firstNameEl.value.length > maxLengths.firstName) {
            showFieldError('firstName', 'First name is too long');
            isValid = false;
        }
        if (lastNameEl && lastNameEl.value.length > maxLengths.lastName) {
            showFieldError('lastName', 'Last name is too long');
            isValid = false;
        }
        if (emailEl && emailEl.value.length > maxLengths.email) {
            showFieldError('email', 'Email address is too long');
            isValid = false;
        }
        if (streetEl && streetEl.value.length > maxLengths.streetAddress) {
            showFieldError('streetAddress', 'Street address is too long');
            isValid = false;
        }
        if (cityEl && cityEl.value.length > maxLengths.city) {
            showFieldError('city', 'City is too long');
            isValid = false;
        }
        if (zipEl && zipEl.value.length > maxLengths.zipCode) {
            showFieldError('zipCode', 'Postcode is too long');
            isValid = false;
        }

        // Validate Date of Birth (if provided)
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        if (dateOfBirth) {
            const dob = new Date(dateOfBirth);
            const today = new Date();
            const minDate = new Date('1900-01-01');
            
            if (dob > today) {
                showFieldError('dateOfBirth', 'Date of birth cannot be in the future');
                isValid = false;
            } else if (dob < minDate) {
                showFieldError('dateOfBirth', 'Please enter a valid date of birth');
                isValid = false;
            }
        }

        return isValid;
    }

    // Show field-specific error message
    function showFieldError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
        }
        
        // Highlight the field
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = '#e74c3c';
        }
    }

    // Clear all error messages
    function clearErrorMessages() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => {
            el.textContent = '';
        });

        // Reset field borders
        const fields = document.querySelectorAll('input, select');
        fields.forEach(field => {
            field.style.borderColor = '';
        });
    }

    // Show form-level message
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Clear messages
    function clearMessages() {
        formMessage.style.display = 'none';
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }

    // Handle submission errors
    function handleSubmissionError(error) {
        let errorMessage = 'An error occurred while submitting your form. Please try again.';

        // Handle specific Supabase errors (do not expose raw error.message to users)
        if (error.code === '23505') {
            errorMessage = 'This email address is already registered. Please use a different email.';
            showFieldError('email', 'This email is already registered');
        } else if (error.code === '23514') {
            errorMessage = 'Please check your form data. Some fields may be invalid.';
        } else if (error.message && error.message.includes('row-level security')) {
            errorMessage = 'Validation error: Please check that all required fields are filled correctly. ' +
                          'Mobile number must be in format 04XX XXX XXX, and other fields must be valid.';
            console.error('RLS Policy Error:', error);
        }
        // For any other error, keep generic message; log full details only to console
        if (error && error.message) {
            console.error('Form submission error details:', error);
        }
        showMessage(errorMessage, 'error');
    }

    // Set loading state
    function setLoadingState(loading) {
        submitButton.disabled = loading;
        if (loading) {
            buttonText.style.display = 'none';
            buttonLoader.style.display = 'inline-block';
        } else {
            buttonText.style.display = 'inline';
            buttonLoader.style.display = 'none';
        }
    }

    // Real-time validation on blur
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                if (this.value.trim()) {
                    const errorElement = document.getElementById(fieldId + 'Error');
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                    this.style.borderColor = '';
                }
            });
        }
    });
});
