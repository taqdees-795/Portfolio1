/* Premium layer: nav, scroll progress, reveal, 3D tilt, video, footer */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var onHome = !!document.getElementById('playground');
  var P = onHome ? '' : 'index.html';

  var links = [
    ['home', 'Home'],
    ['about', 'About'],
    ['video', 'Story'],
    ['playground', 'Skills'],
    ['international', 'International'],
    ['national', 'National'],
    ['sensecard', 'SenseCard'],
    ['internship-research', 'Internship & Research'],
    ['beyond-the-lab', 'Beyond the Lab'],
    ['contact', 'Contact']
  ];

  /* nav */
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
    f.innerHTML = '<span>© 2026 Umair Ahmed · Founder, SenseGuard &amp; SenseCard</span><span>' +
      '<a href="mailto:umairahmed00301@gmail.com">Email</a>' +
      '<a href="https://www.linkedin.com/in/umair-ahmed-2274a9356/" target="_blank" rel="noopener">LinkedIn</a></span>';
    document.body.appendChild(f);
  }

  /* reveal on scroll */
  var rev = onHome ? [] : document.querySelectorAll('.section-head, .recognition-list-item, .about-grid, .nav-card, .detail-columns');
  rev.forEach(function (el) { el.classList.add('reveal-in'); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    rev.forEach(function (el) { io.observe(el); });
  } else rev.forEach(function (el) { el.classList.add('seen'); });

  /* 3D tilt (mouse devices only) */
  if (!reduce && matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('#national .recognition-list-item, #beyond-the-lab .recognition-list-item, .video-frame, .info-card, .feature-card, .workflow-step')
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

  /* home: every screen's cards fly in (3D) each time the screen is reached */
  if (onHome) {
    var dirs = [['-170px', '50px', '0deg', '38deg'], ['0px', '130px', '-38deg', '0deg'], ['170px', '50px', '0deg', '-38deg'], ['0px', '-110px', '38deg', '0deg']];
    var secs = document.querySelectorAll('#about,#video,#playground,#international,#national,#sensecard,#internship-research,#beyond-the-lab');
    secs.forEach(function (sec) {
      sec.querySelectorAll('.section-head,.recognition-list-item,.about-content,.info-card,.video-frame,.char-canvas,.skills-world,.workflow-step,.feature-card,.sensecard-ceo,.sensecard-intro').forEach(function (el, i) {
        var d = dirs[i % 4];
        el.setAttribute('data-fly', '');
        el.style.setProperty('--i', i); el.style.setProperty('--fx', d[0]); el.style.setProperty('--fy', d[1]);
        el.style.setProperty('--rx', d[2]); el.style.setProperty('--ry', d[3]);
      });
    });
    if (reduce || !('IntersectionObserver' in window)) secs.forEach(function (s) { s.classList.add('fly-on'); });
    else {
      var fo = new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.target.classList.toggle('fly-on', e.intersectionRatio >= 0.2); });
      }, { threshold: [0, 0.2] });
      secs.forEach(function (s) { fo.observe(s); });
    }
  }

  /* hero photo: draggable, tilting frame that springs back */
  var pf = document.getElementById('photoFrame');
  if (pf && !reduce) {
    var st = { x: 0, y: 0, vx: 0, vy: 0, rx: 0, ry: 0, drag: false, ox: 0, oy: 0 }, raf = 0;
    var paint = function () {
      pf.style.transform = 'translate3d(' + st.x + 'px,' + st.y + 'px,0) perspective(900px) rotateX(' + st.rx + 'deg) rotateY(' + st.ry + 'deg) scale(' + (st.drag ? 1.03 : 1) + ')';
    };
    var spring = function () {
      if (st.drag) { raf = 0; return; }
      st.vx = (st.vx - st.x * 0.08) * 0.8; st.vy = (st.vy - st.y * 0.08) * 0.8;
      st.x += st.vx; st.y += st.vy; st.rx *= 0.85; st.ry *= 0.85; paint();
      if (Math.abs(st.x) + Math.abs(st.y) + Math.abs(st.vx) + Math.abs(st.vy) + Math.abs(st.rx) + Math.abs(st.ry) > 0.3) raf = requestAnimationFrame(spring);
      else { raf = 0; st.x = st.y = st.rx = st.ry = 0; pf.style.transform = ''; }
    };
    var kick = function () { if (!raf) raf = requestAnimationFrame(spring); };
    pf.addEventListener('pointerdown', function (e) {
      st.drag = true; st.ox = e.clientX - st.x; st.oy = e.clientY - st.y;
      pf.setPointerCapture(e.pointerId); pf.classList.add('dragging'); paint();
    });
    pf.addEventListener('pointermove', function (e) {
      var r = pf.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      st.ry = Math.max(-16, Math.min(16, px * 22)); st.rx = Math.max(-16, Math.min(16, -py * 22));
      if (st.drag) { st.x = e.clientX - st.ox; st.y = e.clientY - st.oy; }
      paint();
    });
    var release = function () { st.drag = false; pf.classList.remove('dragging'); kick(); };
    pf.addEventListener('pointerup', release); pf.addEventListener('pointercancel', release);
    pf.addEventListener('pointerleave', function () { if (!st.drag) kick(); });
  }

  /* SenseCard device: floats and tilts with the mouse, opens on hover and
     shows the exploded view automatically each time the screen is reached */
  var scBox = document.getElementById('scVisual');
  if (scBox) {
    var scStage = scBox.querySelector('.sc-device-stage'), scSec = document.getElementById('sensecard');
    var hover = false, demo = false, inside = false, seen = false, dTimer = 0, sTimer = 0, onScreen = false;
    var mx = 0, my = 0, rx = -8, ry = -24, shift = 0, t = 0;
    var sync = function () { scBox.classList.toggle('is-open', hover || demo); };

    scBox.addEventListener('pointerenter', function () { inside = true; });
    scBox.addEventListener('pointerleave', function () { inside = false; mx = my = 0; hover = false; sync(); });
    scBox.addEventListener('pointermove', function (e) {
      var r = scBox.getBoundingClientRect(), s = scStage.offsetWidth;
      mx = ((e.clientX - r.left) / r.width - .5) * 2; my = ((e.clientY - r.top) / r.height - .5) * 2;
      if (e.pointerType === 'touch') return;
      var dx = e.clientX - (r.left + r.width / 2 + shift), dy = e.clientY - (r.top + r.height / 2);
      var open = scBox.classList.contains('is-open');
      hover = Math.abs(dx) < s * (open ? .95 : .65) && Math.abs(dy) < s * .7;
      sync();
    });
    scBox.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') { hover = !hover; sync(); } });

    var stopDemo = function () { clearTimeout(sTimer); clearTimeout(dTimer); demo = false; sync(); };
    if ('IntersectionObserver' in window && scSec) {
      new IntersectionObserver(function (es) {
        var r = es[0].intersectionRatio;
        if (r >= .6 && !seen) {
          seen = true;
          sTimer = setTimeout(function () { demo = true; sync(); dTimer = setTimeout(function () { demo = false; sync(); }, 3400); }, 900);
        } else if (r < .2) { seen = false; stopDemo(); }
      }, { threshold: [0, .2, .6] }).observe(scSec);
      new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; }).observe(scBox);
    }

    var scSvg = scBox.querySelector('.sc-lines'), scLabels = scBox.querySelectorAll('.sc-callout');
    var scLines = function () {
      if (!scBox.classList.contains('is-open') && scSvg.style.opacity === '0') return;
      var br = scBox.getBoundingClientRect(), out = '';
      scLabels.forEach(function (lb) {
        var tg = scBox.querySelector(lb.getAttribute('data-t')); if (!tg) return;
        var a = tg.getBoundingClientRect(), l = lb.getBoundingClientRect();
        var tx = a.left + a.width / 2 - br.left, ty = a.top + a.height / 2 - br.top;
        var lx = l.left - br.left, ly = l.top + l.height / 2 - br.top;
        out += '<polyline points="' + tx + ',' + ty + ' ' + (lx - 26) + ',' + ly + ' ' + lx + ',' + ly + '"/><circle cx="' + tx + '" cy="' + ty + '" r="3"/>';
      });
      scSvg.innerHTML = out;
    };
    (function loop() {
      requestAnimationFrame(loop);
      if (!onScreen) return;
      t += .016;
      var tRy = inside ? -24 + mx * 24 : -24 + (reduce ? 0 : Math.sin(t * .7) * 10);
      var tRx = inside ? -8 - my * 16 : -8 + (reduce ? 0 : Math.sin(t * .5) * 6);
      var tSh = (hover || demo) ? -scStage.offsetWidth * .22 : 0;
      scLines();
      ry += (tRy - ry) * .08; rx += (tRx - rx) * .08; shift += (tSh - shift) * .08;
      var bob = reduce ? 0 : Math.sin(t * 1.4) * 6;
      scStage.style.transform = 'translate3d(' + shift + 'px,' + bob + 'px,0) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    })();
  }
})();