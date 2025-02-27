document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const langButton = document.getElementById('langButton');
    const langPanel = document.getElementById('langPanel');
    const closeBtn = document.querySelector('.close-btn');

    // Toggle language panel
    langButton.addEventListener('click', function() {
        langPanel.classList.toggle('show');
    });

    // Close panel with close button
    closeBtn.addEventListener('click', function() {
        langPanel.classList.remove('show');
    });

    // Close panel when clicking outside
    document.addEventListener('click', function(event) {
        if (!langPanel.contains(event.target) && !langButton.contains(event.target)) {
            langPanel.classList.remove('show');
        }
    });

    // Handle language change
    function handleLanguageChange() {
        const translateSelect = document.querySelector('.goog-te-combo');
        if (translateSelect) {
            translateSelect.addEventListener('change', function() {
                // Close panel after selection
                setTimeout(() => {
                    langPanel.classList.remove('show');
                }, 500);
            });
        }
    }

    // Wait for Google Translate to load
    function waitForGoogleTranslate() {
        if (document.querySelector('.goog-te-combo')) {
            handleLanguageChange();
        } else {
            setTimeout(waitForGoogleTranslate, 100);
        }
    }

    waitForGoogleTranslate();
});