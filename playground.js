/* Interactive playground: 3D character (Three.js) + physics skills (Matter.js) */
(function () {
  var mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  /* ---------- 3D CHARACTER ---------- */
  (function () {
    var host = document.getElementById('charCanvas');
    if (!host || !window.THREE) return;
    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    cam.position.set(0, 0.4, 7);
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    host.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    var key = new THREE.PointLight(0xd99a4e, 1.4, 30); key.position.set(3, 3, 5); scene.add(key);
    var rim = new THREE.PointLight(0xb5a493, 0.8, 30); rim.position.set(-4, 1, -2); scene.add(rim);

    function mat(c, m, r) { return new THREE.MeshStandardMaterial({ color: c, metalness: m, roughness: r }); }
    var bot = new THREE.Group(); scene.add(bot);

    var body = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.15, 1.6, 32), mat(0x292929, 0.6, 0.35));
    body.position.y = -1.6; bot.add(body);
    var chest = new THREE.Mesh(new THREE.CircleGeometry(0.28, 32), new THREE.MeshBasicMaterial({ color: 0xd99a4e }));
    chest.position.set(0, -1.5, 1.01); bot.add(chest);

    var head = new THREE.Group(); head.position.y = 0.3; bot.add(head);
    var skull = new THREE.Mesh(new THREE.SphereGeometry(1.3, 48, 48), mat(0xf5f2ee, 0.25, 0.3));
    skull.scale.set(1, 0.92, 0.95); head.add(skull);
    var visor = new THREE.Mesh(new THREE.SphereGeometry(1.0, 48, 48), mat(0x0d1117, 0.9, 0.1));
    visor.scale.set(1.05, 0.62, 0.55); visor.position.set(0, 0.05, 0.85); head.add(visor);
    var eyeMat = new THREE.MeshBasicMaterial({ color: 0xd99a4e });
    var eyes = [-0.38, 0.38].map(function (x) {
      var e = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 24), eyeMat);
      e.position.set(x, 0.05, 1.28); e.scale.z = 0.4; head.add(e); return e;
    });
    var ant = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 12), mat(0x292929, 0.6, 0.3));
    ant.position.y = 1.55; head.add(ant);
    var tip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), eyeMat);
    tip.position.y = 1.95; head.add(tip);
    [-1, 1].forEach(function (s) {
      var ear = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 24), mat(0x292929, 0.6, 0.3));
      ear.rotation.z = Math.PI / 2; ear.position.set(1.3 * s, 0, 0); head.add(ear);
    });

    function size() {
      var w = host.clientWidth, h = host.clientHeight;
      renderer.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix();
    }
    size(); window.addEventListener('resize', size);

    var vis = true;
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(host);
    var t = 0, blink = 0;
    (function loop() {
      requestAnimationFrame(loop);
      t += 0.02;
      head.rotation.y += (mouse.x * 0.8 - head.rotation.y) * 0.08;
      head.rotation.x += (mouse.y * 0.45 - head.rotation.x) * 0.08;
      bot.rotation.y += (mouse.x * 0.25 - bot.rotation.y) * 0.05;
      bot.position.y = Math.sin(t) * 0.08;
      tip.scale.setScalar(1 + Math.sin(t * 4) * 0.25);
      /* lighting follows the cursor and shifts colour with horizontal position */
      key.position.set(mouse.x * 6, -mouse.y * 4 + 1, 5);
      key.color.setHSL(0.12 + mouse.x * 0.08, 0.8, 0.55);
      /* blink */
      blink = (Math.sin(t * 1.3) > 0.985) ? 0.1 : 1;
      eyes.forEach(function (e) { e.scale.y += (blink - e.scale.y) * 0.4; });
      renderer.render(scene, cam);
    })();
  })();

  /* ---------- PHYSICS SKILLS ---------- */
  (function () {
    var world = document.getElementById('skillsWorld');
    if (!world || !window.Matter) return;
    var M = Matter;
    var skills = ['Robotics', 'Embedded Systems', 'Machine Learning', 'IoT', 'CAD', 'Programming',
      'Python', 'C / C++', 'Arduino', 'ESP32', 'Research', 'Public Speaking', 'SenseGuard'];
    var engine = M.Engine.create(), started = false, items = [], pv = true;
    new IntersectionObserver(function (e) { pv = e[0].isIntersecting; }).observe(world);
    var W = world.clientWidth, H = world.clientHeight;

    function wall(x, y, w, h) { return M.Bodies.rectangle(x, y, w, h, { isStatic: true }); }
    var walls = [wall(W / 2, H + 30, W + 200, 60), wall(-30, H / 2, 60, H * 3), wall(W + 30, H / 2, 60, H * 3)];
    M.World.add(engine.world, walls);

    skills.forEach(function (name, i) {
      var el = document.createElement('div');
      el.className = 'skill-pill'; el.textContent = name; world.appendChild(el);
      var w = el.offsetWidth, h = el.offsetHeight;
      var b = M.Bodies.rectangle(60 + Math.random() * (W - 120), -60 - i * 55, w, h,
        { chamfer: { radius: h / 2 }, restitution: 0.45, friction: 0.2, angle: Math.random() - 0.5 });
      items.push({ el: el, b: b, w: w, h: h });
    });

    var mc = M.MouseConstraint.create(engine, {
      mouse: M.Mouse.create(world), constraint: { stiffness: 0.2, render: { visible: false } }
    });
    mc.mouse.element.removeEventListener('mousewheel', mc.mouse.mousewheel);
    mc.mouse.element.removeEventListener('DOMMouseScroll', mc.mouse.mousewheel);
    M.World.add(engine.world, mc);

    /* cursor gently pushes pills away */
    world.addEventListener('mousemove', function (e) {
      var r = world.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
      items.forEach(function (it) {
        var dx = it.b.position.x - mx, dy = it.b.position.y - my, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 90 && d > 0) M.Body.applyForce(it.b, it.b.position, { x: dx / d * 0.004, y: dy / d * 0.004 });
      });
    });

    function start() {
      if (started) return; started = true;
      items.forEach(function (it) { M.World.add(engine.world, it.b); });
      (function loop() {
        requestAnimationFrame(loop);
        M.Engine.update(engine, 1000 / 60);
        items.forEach(function (it) {
          it.el.style.transform = 'translate(' + (it.b.position.x - it.w / 2) + 'px,' +
            (it.b.position.y - it.h / 2) + 'px) rotate(' + it.b.angle + 'rad)';
        });
      })();
    }
    new IntersectionObserver(function (en) { if (en[0].isIntersecting) start(); }, { threshold: 0.3 }).observe(world);
  })();
})();