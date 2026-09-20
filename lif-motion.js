/* LIF motion helpers — scroll reveal, gentle parallax, sequenced steps.
   Elements opt in with data attributes; nothing animates continuously. */
(function () {
  var prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reduce = prefersReduce;

  function show(el, delay) {
    setTimeout(function () {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    }, delay || 0);
  }

  function init(root, opts) {
    root = root || document;
    reduce = prefersReduce || !!(opts && opts.still);

    var reveals = root.querySelectorAll('[data-r]:not([data-r-done])');
    if (reduce) {
      Array.prototype.forEach.call(reveals, function (el) { el.setAttribute('data-r-done', '1'); show(el, 0); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          io.unobserve(el);
          el.setAttribute('data-r-done', '1');
          show(el, parseInt(el.getAttribute('data-r-delay') || '0', 10));
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
      // safety net: a fast flick or anchor jump can skip the observer entirely,
      // so keep sweeping anything scrolled past or into view.
      var sweep = function () {
        var left = root.querySelectorAll('[data-r]:not([data-r-done])');
        Array.prototype.forEach.call(left, function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight * 1.05) {
            io.unobserve(el);
            el.setAttribute('data-r-done', '1');
            show(el, 0);
          }
        });
        var seqLeft = root.querySelectorAll('[data-seq]:not([data-seq-done])');
        Array.prototype.forEach.call(seqLeft, function (seq) {
          var r = seq.getBoundingClientRect();
          if (r.top < window.innerHeight * 1.05) {
            seq.setAttribute('data-seq-done', '1');
            Array.prototype.forEach.call(seq.querySelectorAll('[data-step]'), function (it) {
              show(it, r.bottom < 0 ? 0 : parseInt(it.getAttribute('data-step'), 10) || 0);
            });
          }
        });
      };
      var sweepTick = false;
      var onSweep = function () {
        if (sweepTick) return;
        sweepTick = true;
        requestAnimationFrame(function () { sweepTick = false; sweep(); });
      };
      window.addEventListener('scroll', onSweep, { passive: true });
      document.addEventListener('scroll', onSweep, { passive: true, capture: true });
      window.addEventListener('resize', onSweep);
      setTimeout(sweep, 1200);
    }

    // sequenced steps: children with [data-step] reveal one after another
    var seqs = root.querySelectorAll('[data-seq]:not([data-seq-done])');
    // (the scroll sweep above also force-completes any sequence that gets skipped)
    Array.prototype.forEach.call(seqs, function (seq) {
      var items = seq.querySelectorAll('[data-step]');
      var run = function () {
        seq.setAttribute('data-seq-done', '1');
        Array.prototype.forEach.call(items, function (it) {
          show(it, reduce ? 0 : parseInt(it.getAttribute('data-step'), 10) || 0);
        });
      };
      if (reduce) return run();
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { sio.disconnect(); run(); } });
      }, { threshold: 0.4 });
      sio.observe(seq);
    });

    if (reduce) return;

    // gentle parallax / drift on scroll
    var pars = Array.prototype.slice.call(root.querySelectorAll('[data-par]'));
    if (!pars.length) return;

    // Anchor in document space, measured WITHOUT the element's own transform.
    // Reading getBoundingClientRect() here would include translateY(--py) and
    // feed the element's own displacement back in on every tick.
    var anchor = function (el) {
      var top = 0, n = el;
      while (n && n.offsetParent) { top += n.offsetTop; n = n.offsetParent; }
      return top + el.offsetHeight / 2;
    };
    var measureAll = function () {
      pars.forEach(function (el) { el.__lifMid = anchor(el); });
    };
    measureAll();

    var ticking = false;
    var apply = function () {
      var vh = window.innerHeight, sy = window.scrollY || document.documentElement.scrollTop || 0;
      pars.forEach(function (el) {
        var f = parseFloat(el.getAttribute('data-par')) || 0;
        if (el.__lifMid == null) el.__lifMid = anchor(el);
        var off = (el.__lifMid - sy - vh / 2) / vh;
        var py = Math.max(-260, Math.min(260, -off * f));
        el.style.setProperty('--py', py.toFixed(2) + 'px');
      });
      ticking = false;
    };
    window.addEventListener('load', measureAll);
    window.addEventListener('resize', measureAll);
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onScroll);
    apply();
  }

  window.LIFMotion = { init: init };
  if (document.readyState !== 'loading') setTimeout(function () { init(document); }, 0);
  else document.addEventListener('DOMContentLoaded', function () { init(document); });
})();
