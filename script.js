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

// Lightbox: click a card photo to view it full size
function openLightbox(container) {
    const img = container.querySelector('img');
    if (!img || img.style.display === 'none') return; // no real photo uploaded yet
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;

    const captionEl = container.querySelector('.photo-caption');
    let existingCaption = lightbox.querySelector('.lightbox-caption');
    if (!existingCaption) {
        existingCaption = document.createElement('div');
        existingCaption.className = 'lightbox-caption';
        lightbox.appendChild(existingCaption);
    }
    existingCaption.textContent = captionEl ? captionEl.textContent : img.alt;

    document.body.style.overflow = 'hidden';
    lightbox.classList.add('open');
}
function closeLightbox(event) {
    if (event) event.stopPropagation();
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('open');
    document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
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