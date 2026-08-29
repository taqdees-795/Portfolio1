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

function openLightboxDirect(src, alt) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    let cap = lightbox.querySelector('.lightbox-caption');
    if (!cap) {
        cap = document.createElement('div');
        cap.className = 'lightbox-caption';
        lightbox.appendChild(cap);
    }
    cap.textContent = alt;
    document.body.style.overflow = 'hidden';
    lightbox.classList.add('open');
}

// RISE internship photo slideshow (only runs on internships.html, where these elements exist)
(function() {
    const container = document.getElementById('riseSlideshow');
    const dotsWrap = document.getElementById('riseSlideshowDots');
    const emptyMsg = document.getElementById('riseSlideshowEmpty');
    const countEl = document.getElementById('riseSlideshowCount');
    if (!container || !dotsWrap) return;

    const slides = Array.from(container.querySelectorAll('.slides'));
    let current = 0;
    let erroredCount = 0;
    let timer = null;

    function visibleSlides() { return slides.filter(s => !s.classList.contains('slide-broken')); }

    function updateCount() {
        const vis = visibleSlides();
        if (!countEl) return;
        if (vis.length === 0) { countEl.style.display = 'none'; return; }
        const visIndex = vis.indexOf(slides[current]) + 1;
        countEl.textContent = (visIndex || 1) + ' / ' + vis.length;
    }

    function goToSlide(i) {
        if (slides[i].classList.contains('slide-broken')) return;
        slides[current].classList.remove('active-slide');
        dotsWrap.children[current].classList.remove('active-dot');
        current = i;
        slides[current].classList.add('active-slide');
        dotsWrap.children[current].classList.add('active-dot');
        updateCount();
    }

    window.riseSlide = function(direction) {
        if (visibleSlides().length < 2) return;
        let next = current;
        for (let step = 0; step < slides.length; step++) {
            next = (next + direction + slides.length) % slides.length;
            if (!slides[next].classList.contains('slide-broken')) break;
        }
        goToSlide(next);
        restartTimer();
    };

    function restartTimer() {
        clearInterval(timer);
        if (visibleSlides().length > 1) {
            timer = setInterval(() => riseSlide(1), 4000);
        }
    }

    slides.forEach((slide, i) => {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active-dot' : '');
        dot.addEventListener('click', () => { goToSlide(i); restartTimer(); });
        dotsWrap.appendChild(dot);

        const img = slide.querySelector('img');
        img.addEventListener('error', () => {
            erroredCount++;
            slide.classList.add('slide-broken');
            dot.style.display = 'none';
            if (erroredCount === slides.length) {
                if (emptyMsg) emptyMsg.style.display = 'flex';
                if (countEl) countEl.style.display = 'none';
                clearInterval(timer);
            } else if (i === current) {
                riseSlide(1);
            }
            updateCount();
        });
    });

    updateCount();
    restartTimer();
})();

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