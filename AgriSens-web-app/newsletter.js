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
    const phone = document.getElementById('phone').value;

    // Prepare template parameters
    const templateParams = {
        to_name: name,
        to_email: email,        // This will be used as the recipient's email
        phone_number: phone,
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
    successMessage.textContent = 'Thank you for subscribing! Please check your email for confirmation.';

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

// Phone number validation
document.getElementById('phone').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
});