// Right side dots active logic
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.right-dot').forEach(dot => {
    const page = dot.getAttribute('href');
    if (page === currentPage) {
        dot.classList.add('active');
    } else {
        dot.classList.remove('active');
    }
});

// Scroll reveal (agar koi baqi page par ho)
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));