// Sample discussion data
const discussions = [
    {
        title: "Organic Farming Techniques",
        author: "JohnFarmer",
        date: "2025-02-28",
        topic: "Organic Farming",
        replies: 15,
        excerpt: "Looking for advice on transitioning to organic farming methods..."
    },
    {
        title: "Best Practices for Soil Health",
        author: "SoilExpert",
        date: "2025-02-27",
        topic: "Soil Management",
        replies: 23,
        excerpt: "Let's discuss effective ways to maintain and improve soil health..."
    },
    {
        title: "Smart Irrigation Systems",
        author: "TechFarmer",
        date: "2025-02-26",
        topic: "Technology",
        replies: 8,
        excerpt: "What are your experiences with smart irrigation systems?"
    }
];

// Function to create discussion cards
function createDiscussionCards() {
    const discussionGrid = document.getElementById('discussionGrid');
    
    discussions.forEach(discussion => {
        const card = document.createElement('div');
        card.className = 'feature-card';
        
        card.innerHTML = `
            <h3>${discussion.title}</h3>
            <p class="discussion-meta">
                <span><i class="fas fa-user"></i> ${discussion.author}</span>
                <span><i class="fas fa-calendar"></i> ${discussion.date}</span>
            </p>
            <p class="discussion-topic">
                <i class="fas"></i> ${discussion.topic}
            </p>
            <p>${discussion.excerpt}</p>
            <p class="discussion-stats">
                <i class="fas fa-comments"></i> ${discussion.replies} replies
            </p>
            <a href="#" class="feature-btn">Join Discussion</a>
        `;
        
        discussionGrid.appendChild(card);
    });
}

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    createDiscussionCards();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href'))?.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add animation to feature cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Current user display
    const currentUser = 'Yagyansh02'; // Using the provided current user
    const currentDate = new Date('2025-02-28 13:48:25'); // Using the provided date

    function addUserGreeting() {
        const container = document.querySelector('.hero .container');
        const greetingDiv = document.createElement('div');
        greetingDiv.className = 'user-greeting';
        greetingDiv.innerHTML = `
            <p>Welcome back, ${currentUser}!</p>
            <p class="last-visit">Last visit: ${currentDate.toLocaleDateString()}</p>
        `;
        container.insertBefore(greetingDiv, container.querySelector('.hero-stats'));
    }

    addUserGreeting();

    // Add dynamic feature card interactions
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Simple search functionality for discussions
    function createSearchBar() {
        const discussionsSection = document.querySelector('.discussions .container');
        const searchDiv = document.createElement('div');
        searchDiv.className = 'search-container';
        searchDiv.innerHTML = `
            <input type="text" id="searchDiscussions" placeholder="Search discussions...">
            <i class="fas fa-search"></i>
        `;
        discussionsSection.insertBefore(searchDiv, discussionsSection.querySelector('.discussion-grid'));

        const searchInput = document.getElementById('searchDiscussions');
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterDiscussions(searchTerm);
        });
    }

    function filterDiscussions(searchTerm) {
        const cards = document.querySelectorAll('.discussion-grid .feature-card');
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            const isVisible = title.includes(searchTerm) || content.includes(searchTerm);
            card.style.display = isVisible ? 'block' : 'none';
        });
    }

    createSearchBar();

    // Add "Back to Top" button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    document.body.appendChild(backToTopButton);

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
});

// Add additional CSS for the new features
const style = document.createElement('style');
style.textContent = `
    .user-greeting {
        margin: 2rem 0;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
    }

    .search-container {
        margin-bottom: 2rem;
        position: relative;
    }

    .search-container input {
        width: 100%;
        padding: 1rem;
        padding-left: 3rem;
        border: none;
        border-radius: 25px;
        background: var(--white);
        box-shadow: var(--shadow);
    }

    .search-container i {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--primary-color);
    }

    .back-to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: var(--primary-color);
        color: var(--white);
        width: 45px;
        height: 45px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        z-index: 1000;
    }

    .back-to-top.show {
        display: flex;
    }

    .back-to-top:hover {
        background: var(--secondary-color);
        transform: translateY(-3px);
    }

    .fade-in {
        animation: fadeIn 0.5s ease-in forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style);