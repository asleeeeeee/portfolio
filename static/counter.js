// Counter animation for stats
function animateCounter(element, target, duration = 1500) {
    const isPercentage = target.includes('%');
    const targetNumber = parseInt(target);
    let current = 0;
    const increment = targetNumber / (duration / 16); // 16ms per frame
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = isPercentage 
                ? Math.floor(current) + '%' 
                : Math.floor(current) + '+';
        }
    }, 16);
}

// Start counters when page loads
document.addEventListener('DOMContentLoaded', function() {
    const statsHeadings = document.querySelectorAll('.stats h2');
    
    statsHeadings.forEach((heading, index) => {
        const target = heading.textContent.trim();
        // Stagger the animation start
        setTimeout(() => {
            animateCounter(heading, target, 1200);
        }, index * 200);
    });
});

// Alternative: Use Intersection Observer for when stats come into view
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const statsHeadings = entry.target.querySelectorAll('.stats h2');
            
            statsHeadings.forEach((heading, index) => {
                const target = heading.textContent.trim();
                setTimeout(() => {
                    animateCounter(heading, target, 1200);
                }, index * 200);
            });
        }
    });
}, observerOptions);

// Observe the stats section
document.addEventListener('DOMContentLoaded', function() {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// Projects page filters
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card-full');

    if (!filterButtons.length || !projectCards.length) {
        return;
    }

    const applyFilter = (filterValue) => {
        projectCards.forEach((card) => {
            const cardCategory = card.getAttribute('data-category');
            const shouldShow = filterValue === 'all' || cardCategory === filterValue;
            card.classList.toggle('hidden', !shouldShow);
        });
    };

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');

            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');

            applyFilter(filterValue);
        });
    });

    applyFilter('all');
});

// Experience page filters
document.addEventListener('DOMContentLoaded', function() {
    const experienceButtons = document.querySelectorAll('.filter-chip');
    const experienceItems = document.querySelectorAll('.experience-detail-list li');

    if (!experienceButtons.length || !experienceItems.length) {
        return;
    }

    const applyExperienceFilter = (filterValue) => {
        experienceItems.forEach((item) => {
            const itemCategory = item.getAttribute('data-category');
            const shouldShow = filterValue === 'All' || itemCategory === filterValue;
            item.classList.toggle('hidden', !shouldShow);
        });
    };

    experienceButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filterValue = button.textContent.trim();

            experienceButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');

            applyExperienceFilter(filterValue);
        });
    });

    applyExperienceFilter('All');
});

// Project details modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('project-modal');
    if (!modal) {
        return;
    }

    const modalImage = document.getElementById('project-modal-image');
    const modalCategory = document.getElementById('project-modal-category');
    const modalTitle = document.getElementById('project-modal-title');
    const modalDescription = document.getElementById('project-modal-description');
    const modalTech = document.getElementById('project-modal-tech');
    const modalRole = document.getElementById('project-modal-role');
    const modalOutcome = document.getElementById('project-modal-outcome');
    const closeButton = document.querySelector('.project-modal-close');

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    };

    const openModal = (card) => {
        modalCategory.textContent = card.dataset.category || 'Project';
        modalTitle.textContent = card.dataset.title || 'Project Details';
        modalDescription.textContent = card.dataset.description || 'More information coming soon.';
        modalImage.src = card.dataset.image || '';
        modalImage.alt = card.dataset.title ? `${card.dataset.title} preview` : 'Project preview';
        modalRole.textContent = card.dataset.role || 'N/A';
        modalOutcome.textContent = card.dataset.outcome || 'N/A';

        modalTech.innerHTML = '';
        const techItems = (card.dataset.tech || '').split(',');
        techItems.forEach((tech) => {
            const badge = document.createElement('span');
            badge.className = 'tech-badge';
            badge.textContent = tech.trim();
            if (tech.trim()) {
                modalTech.appendChild(badge);
            }
        });

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    };

    document.querySelectorAll('.project-card-full').forEach((card) => {
        card.addEventListener('click', () => {
            openModal(card);
        });
    });

    modal.addEventListener('click', (event) => {
        if (event.target.matches('[data-close-modal]') || event.target === modal) {
            closeModal();
        }
    });

    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
