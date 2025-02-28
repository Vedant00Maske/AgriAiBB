// Initialize EmailJS
(function() {
    emailjs.init("pKtZKrs6NjjS4bpX_");
})();

// Format current date and time
function getCurrentDateTime() {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' ');
}

// Newsletter form submission handler
document.getElementById('newsletterForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;

    // Prepare template parameters
    const templateParams = {
        to_name: name,
        to_email: email,        // This will be used as the recipient's email
        feedback: feedback || 'No feedback provided', // Handle empty feedback
        subscription_date: getCurrentDateTime(),
        reply_to: email,        // Allows the user to reply to their confirmation email
    };

    // Send email using EmailJS
    emailjs.send('service_rw2f60n', 'template_5okhrki', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showSuccessMessage();
            clearForm();
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            showErrorMessage();
        })
        .finally(function() {
            // Restore button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
});

function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    successMessage.style.display = 'block';
    successMessage.className = 'message success-message';
    const feedbackText = document.getElementById('feedback').value ? 
        ' Thank you for your feedback!' : '';
    successMessage.textContent = `Thank you for subscribing!${feedbackText} Please check your email for confirmation.`;

    // Hide message after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

function showErrorMessage() {
    const successMessage = document.getElementById('success-message');
    successMessage.style.display = 'block';
    successMessage.className = 'message error-message';
    successMessage.textContent = 'Failed to subscribe. Please try again later.';

    // Hide message after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

function clearForm() {
    document.getElementById('newsletterForm').reset();
}

// Add form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

document.getElementById('newsletterForm').addEventListener('input', function(e) {
    const emailInput = document.getElementById('email');
    const submitButton = this.querySelector('button[type="submit"]');
    
    if (emailInput.value && !validateEmail(emailInput.value)) {
        emailInput.setCustomValidity('Please enter a valid email address');
        submitButton.disabled = true;
    } else {
        emailInput.setCustomValidity('');
        submitButton.disabled = false;
    }
});

// Optional: Add character counter for feedback
document.getElementById('feedback').addEventListener('input', function() {
    const maxLength = 500; // Set your desired maximum length
    const remaining = maxLength - this.value.length;
    
    if (remaining < 0) {
        this.value = this.value.slice(0, maxLength);
        return;
    }
});