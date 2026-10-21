/* Premium layer: nav, scroll progress, reveal, 3D tilt, video, footer */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var onHome = !!document.getElementById('playground');
  var P = onHome ? '' : 'index.html';
  var links = [['home', 'Home'], ['video', 'Intro'], ['international', 'International'], ['national', 'National'],
    ['internships', 'Internships'], ['research', 'Research'], ['beyond-the-lab', 'Beyond the Lab'],
    ['projects', 'Projects'], ['activity', 'Activity'], ['contact', 'Contact']];

  /* nav (same on every page) */
  var nav = document.createElement('header');
  nav.className = 'site-nav';
  nav.innerHTML = '<a class="brand" href="' + (P || '#home') + '">Umair <b>Ahmed</b></a>' +
    '<button class="nav-toggle" aria-label="Menu" aria-expanded="false"><i class="fas fa-bars"></i></button>' +
    '<ul class="nav-links">' + links.map(function (l) {
      return '<li><a href="' + P + '#' + l[0] + '" data-s="' + l[0] + '">' + l[1] + '</a></li>';
    }).join('') + '</ul>';
  document.body.prepend(nav);
  var bar = document.createElement('div'); bar.className = 'scroll-bar'; document.body.prepend(bar);
  var ul = nav.querySelector('.nav-links'), tg = nav.querySelector('.nav-toggle');
  tg.addEventListener('click', function () { var o = ul.classList.toggle('open'); tg.setAttribute('aria-expanded', o); });
  ul.addEventListener('click', function () { ul.classList.remove('open'); });

  function onScroll() {
    var h = document.documentElement;
    bar.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%';
    if (!onHome) return;
    var cur = 'home', mid = innerHeight / 2;
    links.forEach(function (l) { var el = document.getElementById(l[0]); if (el && el.getBoundingClientRect().top <= mid) cur = l[0]; });
    nav.querySelectorAll('a[data-s]').forEach(function (a) { a.classList.toggle('active', a.dataset.s === cur); });
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* footer where none exists */
  if (!document.querySelector('footer')) {
    var f = document.createElement('footer'); f.className = 'site-footer';
    f.innerHTML = '<span>© 2026 Umair Ahmed · Founder, SenseGuard</span><span>' +
      '<a href="mailto:umairahmed00301@gmail.com">Email</a>' +
      '<a href="https://www.linkedin.com/in/umair-ahmed-2274a9356/" target="_blank" rel="noopener">LinkedIn</a></span>';
    document.body.appendChild(f);
  }

  /* reveal on scroll */
  var rev = document.querySelectorAll('.section-head, .recognition-list-item, .about-grid, .nav-card, .detail-columns');
  rev.forEach(function (el) { el.classList.add('reveal-in'); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    rev.forEach(function (el) { io.observe(el); });
  } else rev.forEach(function (el) { el.classList.add('seen'); });

  /* 3D tilt (mouse devices only) */
  if (!reduce && matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('#international .recognition-list-item, #national .recognition-list-item, #beyond-the-lab .recognition-list-item, .video-frame, .info-card')
      .forEach(function (el) {
        el.setAttribute('data-tilt', '');
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
          el.style.transform = 'perspective(900px) rotateY(' + x * 9 + 'deg) rotateX(' + -y * 9 + 'deg) translateY(-4px)';
        });
        el.addEventListener('mouseleave', function () { el.style.transform = ''; });
      });
  }

  /* hero parallax */
  var ph = document.querySelector('.hero-photo-wrap');
  if (ph && !reduce) addEventListener('mousemove', function (e) {
    ph.style.transform = 'translate(' + (e.clientX / innerWidth - .5) * 16 + 'px,' + (e.clientY / innerHeight - .5) * 12 + 'px)';
  });

  /* video: custom play button, no autoplay */
  var fr = document.querySelector('.video-frame');
  if (fr) {
    var v = fr.querySelector('video'), b = fr.querySelector('.video-play');
    b.addEventListener('click', function () { v.play(); });
    v.addEventListener('play', function () { fr.classList.add('playing'); v.controls = true; });
    v.addEventListener('pause', function () { if (!v.ended) { fr.classList.remove('playing'); } });
    v.addEventListener('ended', function () { fr.classList.remove('playing'); v.controls = false; });
  }
})();