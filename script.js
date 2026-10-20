/* =========================================================
   PORTFOLIO - COMPLETE SCRIPT.JS
   ========================================================= */

/* =========================================================
   0. CINEMATIC 4-IMAGE INTRO
   Sequence: 1 -> 2 -> 3 -> 4 -> final 2x2 collage -> hero
   ========================================================= */
(function () {
    const intro = document.getElementById('cinematicIntro');

    if (!intro) {
        document.body.classList.add('intro-done');
        return;
    }

    const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) {
        intro.classList.add('finished');
        document.body.classList.add('intro-done');
        return;
    }

    document.body.classList.add('intro-active');

    /*
       Each image gets its own moment on screen.
       The timings deliberately overlap slightly so the change feels
       smooth and premium rather than like a slideshow widget.
    */
    const sequence = [
        { at: 250,  className: 'show-1' },
        { at: 1450, className: 'show-2' },
        { at: 2650, className: 'show-3' },
        { at: 3850, className: 'show-4' },
        { at: 5050, className: 'merging' }
    ];

    sequence.forEach(function (step) {
        window.setTimeout(function () {
            intro.classList.add(step.className);
        }, step.at);
    });

    /*
       Give the visitor enough time to actually see the final collage,
       then fade it away and reveal the portfolio hero.
    */
    window.setTimeout(function () {
        intro.classList.add('finished');
        document.body.classList.remove('intro-active');
        document.body.classList.add('intro-done');
    }, 7600);

    /*
       Asset safety: a missing intro image must NEVER create a black
       locked screen. Failed backgrounds simply become transparent.
    */
    intro.querySelectorAll('.intro-card').forEach(function (card) {
        const bg = card.style.backgroundImage || '';
        const match = bg.match(/url\(["']?(.*?)["']?\)/);

        if (!match || !match[1]) return;

        const testImage = new Image();
        testImage.src = match[1];

        testImage.addEventListener('error', function () {
            card.style.backgroundImage = 'none';
            card.classList.add('asset-missing');
        });
    });

    /* Absolute safety fallback in case a browser blocks a timer. */
    window.setTimeout(function () {
        document.body.classList.remove('intro-active');
        document.body.classList.add('intro-done');
    }, 9000);
})();


/* =========================================================
   1. RIGHT SIDE NAVIGATION DOTS
   ========================================================= */

(function () {
    const currentPage =
        location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.right-dot').forEach(dot => {
        const href = dot.getAttribute('href');

        if (!href) return;

        /*
         * Remove query strings / hashes so comparison remains clean
         */
        const page = href.split('?')[0].split('#')[0];

        if (page === currentPage) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
})();


/* =========================================================
   2. DIRECT LIGHTBOX
   ========================================================= */

function openLightboxDirect(src, alt = '') {

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    if (!lightbox || !lightboxImg || !src) return;

    lightboxImg.src = src;
    lightboxImg.alt = alt;

    /*
     * Create caption if it doesn't already exist
     */
    let caption = lightbox.querySelector('.lightbox-caption');

    if (!caption) {
        caption = document.createElement('div');
        caption.className = 'lightbox-caption';
        lightbox.appendChild(caption);
    }

    caption.textContent = alt || '';

    document.body.style.overflow = 'hidden';

    lightbox.classList.add('open');
}


/* =========================================================
   3. CARD PHOTO LIGHTBOX
   ========================================================= */

function openLightbox(container) {

    if (!container) return;

    const img = container.querySelector('img');

    /*
     * If there is no image, don't open lightbox
     */
    if (!img) return;

    /*
     * If image has been intentionally hidden,
     * don't open the lightbox.
     */
    if (img.style.display === 'none') return;

    /*
     * Don't open if image source is empty
     */
    if (!img.src || img.src === window.location.href) return;

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';

    /*
     * Get caption from card
     */
    const captionEl = container.querySelector('.photo-caption');

    let caption = lightbox.querySelector('.lightbox-caption');

    if (!caption) {
        caption = document.createElement('div');
        caption.className = 'lightbox-caption';
        lightbox.appendChild(caption);
    }

    caption.textContent =
        captionEl && captionEl.textContent.trim()
            ? captionEl.textContent.trim()
            : (img.alt || '');

    document.body.style.overflow = 'hidden';

    lightbox.classList.add('open');
}


/* =========================================================
   4. CLOSE LIGHTBOX
   ========================================================= */

function closeLightbox(event) {

    if (event) {
        event.stopPropagation();
    }

    const lightbox = document.getElementById('lightbox');

    if (!lightbox) return;

    lightbox.classList.remove('open');

    document.body.style.overflow = '';

    /*
     * Small delay before clearing image
     * to avoid visual flickering
     */
    setTimeout(() => {

        if (!lightbox.classList.contains('open')) {

            const lightboxImg =
                document.getElementById('lightboxImg');

            if (lightboxImg) {
                lightboxImg.src = '';
            }
        }

    }, 200);
}


/* =========================================================
   5. LIGHTBOX EVENTS
   ========================================================= */

(function () {

    const lightbox = document.getElementById('lightbox');

    if (!lightbox) return;

    /*
     * Clicking the dark background closes lightbox
     */
    lightbox.addEventListener('click', function (event) {

        if (event.target === lightbox) {
            closeLightbox(event);
        }

    });

})();


/*
 * Escape key closes lightbox
 */

document.addEventListener('keydown', function (event) {

    if (event.key === 'Escape') {
        closeLightbox();
    }

});


/* =========================================================
   6. RISE INTERNSHIP PHOTO SLIDESHOW
   ========================================================= */

(function () {

    const container =
        document.getElementById('riseSlideshow');

    const dotsWrap =
        document.getElementById('riseSlideshowDots');

    const emptyMsg =
        document.getElementById('riseSlideshowEmpty');

    const countEl =
        document.getElementById('riseSlideshowCount');

    /*
     * Slideshow only exists on internships page.
     * If elements don't exist, simply stop.
     */
    if (!container || !dotsWrap) return;


    const slides =
        Array.from(
            container.querySelectorAll('.slides')
        );


    /*
     * If there are no slides, stop safely.
     */
    if (slides.length === 0) {

        if (emptyMsg) {
            emptyMsg.style.display = 'flex';
        }

        if (countEl) {
            countEl.style.display = 'none';
        }

        return;
    }


    let current = 0;

    let erroredCount = 0;

    let timer = null;


    /* -----------------------------------------------------
       Get only working slides
       ----------------------------------------------------- */

    function visibleSlides() {

        return slides.filter(
            slide =>
                !slide.classList.contains('slide-broken')
        );

    }


    /* -----------------------------------------------------
       Update slide counter
       ----------------------------------------------------- */

    function updateCount() {

        const visible = visibleSlides();

        if (!countEl) return;


        /*
         * No working images
         */
        if (visible.length === 0) {

            countEl.style.display = 'none';

            return;
        }


        countEl.style.display = 'block';


        const currentVisibleIndex =
            visible.indexOf(slides[current]);


        countEl.textContent =
            (currentVisibleIndex >= 0
                ? currentVisibleIndex + 1
                : 1)
            + ' / '
            + visible.length;
    }


    /* -----------------------------------------------------
       Set active slide
       ----------------------------------------------------- */

    function goToSlide(index) {

        /*
         * Invalid index
         */
        if (
            index < 0 ||
            index >= slides.length
        ) {
            return;
        }


        /*
         * Broken slide cannot become active
         */
        if (
            slides[index].classList.contains(
                'slide-broken'
            )
        ) {
            return;
        }


        /*
         * Remove current active class
         */
        if (slides[current]) {

            slides[current]
                .classList
                .remove('active-slide');

        }


        /*
         * Remove active dot
         */
        if (
            dotsWrap.children[current]
        ) {

            dotsWrap.children[current]
                .classList
                .remove('active-dot');

        }


        /*
         * Update current
         */
        current = index;


        /*
         * Add active slide
         */
        slides[current]
            .classList
            .add('active-slide');


        /*
         * Add active dot
         */
        if (
            dotsWrap.children[current]
        ) {

            dotsWrap.children[current]
                .classList
                .add('active-dot');

        }


        updateCount();
    }


    /* -----------------------------------------------------
       Next / Previous slideshow function
       ----------------------------------------------------- */

    window.riseSlide = function (direction) {

        const visible = visibleSlides();


        /*
         * Nothing to slide
         */
        if (visible.length <= 1) {
            return;
        }


        let next = current;


        /*
         * Find next working slide
         */
        for (
            let step = 0;
            step < slides.length;
            step++
        ) {

            next =
                (
                    next +
                    direction +
                    slides.length
                ) % slides.length;


            if (
                !slides[next]
                    .classList
                    .contains('slide-broken')
            ) {
                break;
            }
        }


        /*
         * Move to slide
         */
        goToSlide(next);


        /*
         * Restart automatic slideshow
         */
        restartTimer();
    };


    /* -----------------------------------------------------
       Automatic slideshow timer
       ----------------------------------------------------- */

    function restartTimer() {

        /*
         * Clear old timer
         */
        if (timer) {
            clearInterval(timer);
            timer = null;
        }


        /*
         * Only autoplay if there are
         * at least two working slides
         */
        if (visibleSlides().length > 1) {

            timer = setInterval(
                function () {

                    window.riseSlide(1);

                },
                4000
            );
        }
    }


    /* -----------------------------------------------------
       Create dots + image error handling
       ----------------------------------------------------- */

    slides.forEach(function (slide, index) {

        /*
         * Create navigation dot
         */
        const dot =
            document.createElement('span');

        dot.className =
            'dot' +
            (
                index === 0
                    ? ' active-dot'
                    : ''
            );


        /*
         * Dot click
         */
        dot.addEventListener(
            'click',
            function () {

                goToSlide(index);

                restartTimer();

            }
        );


        /*
         * Add dot to wrapper
         */
        dotsWrap.appendChild(dot);


        /*
         * Find image
         */
        const img =
            slide.querySelector('img');


        if (!img) {

            slide.classList.add(
                'slide-broken'
            );

            dot.style.display = 'none';

            erroredCount++;

            return;
        }


        /*
         * Handle broken image
         */
        img.addEventListener(
            'error',
            function () {

                /*
                 * Prevent duplicate error handling
                 */
                if (
                    slide.classList.contains(
                        'slide-broken'
                    )
                ) {
                    return;
                }


                erroredCount++;


                slide.classList.add(
                    'slide-broken'
                );


                /*
                 * Hide corresponding dot
                 */
                dot.style.display = 'none';


                /*
                 * If ALL images are broken
                 */
                if (
                    erroredCount === slides.length
                ) {

                    if (emptyMsg) {
                        emptyMsg.style.display =
                            'flex';
                    }


                    if (countEl) {
                        countEl.style.display =
                            'none';
                    }


                    clearInterval(timer);

                    timer = null;

                    return;
                }


                /*
                 * If broken image was currently active,
                 * move to next working slide
                 */
                if (index === current) {

                    const nextVisible =
                        visibleSlides();


                    if (nextVisible.length > 0) {

                        const nextIndex =
                            slides.indexOf(
                                nextVisible[0]
                            );


                        goToSlide(nextIndex);

                    }
                }


                updateCount();

                restartTimer();

            }
        );

    });


    /* -----------------------------------------------------
       Make first valid slide active
       ----------------------------------------------------- */

    const firstVisible =
        visibleSlides();


    if (firstVisible.length > 0) {

        const firstIndex =
            slides.indexOf(
                firstVisible[0]
            );


        /*
         * Remove active from all slides
         */
        slides.forEach(
            slide =>
                slide.classList.remove(
                    'active-slide'
                )
        );


        /*
         * Remove active from all dots
         */
        Array.from(
            dotsWrap.children
        ).forEach(
            dot =>
                dot.classList.remove(
                    'active-dot'
                )
        );


        /*
         * Set first valid slide active
         */
        current = firstIndex;


        slides[current]
            .classList
            .add('active-slide');


        if (
            dotsWrap.children[current]
        ) {

            dotsWrap.children[current]
                .classList
                .add('active-dot');

        }

    }


    updateCount();

    restartTimer();


    /* -----------------------------------------------------
       Pause slideshow when mouse is over it
       ----------------------------------------------------- */

    container.addEventListener(
        'mouseenter',
        function () {

            if (timer) {
                clearInterval(timer);
                timer = null;
            }

        }
    );


    /* -----------------------------------------------------
       Resume slideshow when mouse leaves
       ----------------------------------------------------- */

    container.addEventListener(
        'mouseleave',
        function () {

            restartTimer();

        }
    );


    /* -----------------------------------------------------
       Touch / swipe support
       ----------------------------------------------------- */

    let touchStartX = 0;

    let touchEndX = 0;


    container.addEventListener(
        'touchstart',
        function (event) {

            if (
                !event.touches ||
                !event.touches.length
            ) {
                return;
            }

            touchStartX =
                event.touches[0].clientX;

        },
        { passive: true }
    );


    container.addEventListener(
        'touchend',
        function (event) {

            if (
                !event.changedTouches ||
                !event.changedTouches.length
            ) {
                return;
            }


            touchEndX =
                event.changedTouches[0].clientX;


            const difference =
                touchStartX - touchEndX;


            /*
             * Minimum swipe distance
             */
            if (Math.abs(difference) < 50) {
                return;
            }


            if (difference > 0) {

                /*
                 * Swipe left = next
                 */
                window.riseSlide(1);

            } else {

                /*
                 * Swipe right = previous
                 */
                window.riseSlide(-1);

            }

        },
        { passive: true }
    );

})();


/* =========================================================
   7. SCROLL REVEAL ANIMATION
   ========================================================= */

(function () {

    const revealEls =
        document.querySelectorAll('.reveal');


    /*
     * If browser doesn't support IntersectionObserver,
     * simply show everything.
     */
    if (
        !('IntersectionObserver' in window)
    ) {

        revealEls.forEach(
            el =>
                el.classList.add('in')
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList
                                .add('in');


                            /*
                             * Once visible,
                             * no need to observe again.
                             */
                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    revealEls.forEach(
        function (element) {

            observer.observe(element);

        }
    );

})();


/* =========================================================
   8. SMOOTH SCROLL FOR INTERNAL LINKS
   ========================================================= */

(function () {

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(
        function (link) {

            link.addEventListener(
                'click',
                function (event) {

                    const targetId =
                        link.getAttribute('href');


                    if (
                        !targetId ||
                        targetId === '#'
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                }
            );

        }
    );

})();


/* =========================================================
   9. ACTIVE SECTION DETECTION
   ========================================================= */

(function () {

    const sections =
        document.querySelectorAll(
            'section[id]'
        );


    const dots =
        document.querySelectorAll(
            '.right-dot'
        );


    if (
        !sections.length ||
        !dots.length
    ) {
        return;
    }


    if (
        !('IntersectionObserver' in window)
    ) {
        return;
    }


    const sectionObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        const id =
                            entry.target.id;


                        dots.forEach(
                            function (dot) {

                                const href =
                                    dot.getAttribute(
                                        'href'
                                    );


                                if (
                                    href &&
                                    href.includes(
                                        '#' + id
                                    )
                                ) {

                                    dot.classList.add(
                                        'active'
                                    );

                                } else {

                                    dot.classList.remove(
                                        'active'
                                    );

                                }

                            }
                        );

                    }
                );

            },
            {
                threshold: 0.45
            }
        );


    sections.forEach(
        function (section) {

            sectionObserver.observe(section);

        }
    );

})();


/* =========================================================
   10. IMAGE LAZY LOADING FALLBACK
   ========================================================= */

(function () {

    document.querySelectorAll(
        'img'
    ).forEach(
        function (img) {

            /*
             * Don't modify images that already
             * have an explicit loading value.
             */
            if (
                !img.hasAttribute('loading')
            ) {

                img.setAttribute(
                    'loading',
                    'lazy'
                );

            }

        }
    );

})();


/* =========================================================
   11. PREVENT BROKEN IMAGE ICONS
   ========================================================= */

(function () {

    document.querySelectorAll(
        'img'
    ).forEach(
        function (img) {

            img.addEventListener(
                'error',
                function () {

                    /*
                     * Don't hide slideshow images here.
                     * The slideshow has its own error handler.
                     */
                    if (
                        img.closest(
                            '#riseSlideshow'
                        )
                    ) {
                        return;
                    }


                    img.classList.add(
                        'image-broken'
                    );

                }
            );

        }
    );

})();


/* =========================================================
   12. PAGE LOADED
   ========================================================= */

window.addEventListener(
    'load',
    function () {

        document.body.classList.add(
            'page-loaded'
        );

    }
);