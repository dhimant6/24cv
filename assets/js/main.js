// Portfolio interactions: nav, typewriter, reveals, counters, 3D tilt
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav: glass on scroll ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('nav-burger');
  var links = document.getElementById('nav-links');
  burger.addEventListener('click', function () {
    burger.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      burger.classList.remove('open');
      links.classList.remove('open');
    }
  });

  /* ---------- scrollspy ---------- */
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = links.querySelectorAll('a[href^="#"]');
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navAnchors.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(function (s) { spy.observe(s); });

  /* ---------- typewriter ---------- */
  var roles = [
    'Senior Unified Communications Engineer',
    'AI-Powered UCC Architect',
    'Microsoft Teams Rooms & VoIP Expert',
    'Full-Stack Builder — React · Python',
  ];
  var typedEl = document.getElementById('typed');
  if (reduceMotion) {
    typedEl.textContent = roles[0];
  } else {
    var roleIdx = 0, charIdx = 0, deleting = false;
    (function tick() {
      var word = roles[roleIdx];
      typedEl.textContent = word.slice(0, charIdx);
      var delay;
      if (!deleting) {
        charIdx++;
        delay = 45;
        if (charIdx > word.length) { deleting = true; delay = 2200; }
      } else {
        charIdx--;
        delay = 22;
        if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 350; }
      }
      setTimeout(tick, delay);
    })();
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduceMotion) {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { ro.observe(el); });

    // Fallback sweep: if the page loaded in a 0×0/hidden viewport the observer
    // never fires, so also reveal anything already inside the viewport.
    var sweepPending = false;
    function revealSweep() {
      sweepPending = false;
      if (window.innerHeight === 0) return;
      reveals = reveals.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
          el.classList.add('visible');
          ro.unobserve(el);
          return false;
        }
        return true;
      });
    }
    function queueSweep() {
      if (!sweepPending) {
        sweepPending = true;
        // setTimeout (not rAF): still runs in hidden/background documents
        setTimeout(revealSweep, 40);
      }
    }
    window.addEventListener('scroll', queueSweep, { passive: true });
    window.addEventListener('resize', queueSweep);
    document.addEventListener('visibilitychange', queueSweep);
    queueSweep();
    setTimeout(queueSweep, 600);
  }

  /* ---------- animated counters ---------- */
  var counters = document.querySelectorAll('.stat__num');
  var co = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      co.unobserve(entry.target);
      var el = entry.target;
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || '';
      var decimals = parseInt(el.dataset.decimals || '0', 10);
      if (reduceMotion) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
      }
      var start = null;
      var dur = 1400;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  counters.forEach(function (el) { co.observe(el); });

  /* ---------- 3D tilt on cards ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt').forEach(function (card) {
      var raf = null;
      card.addEventListener('pointermove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            'perspective(900px) rotateX(' + (-py * 7).toFixed(2) + 'deg) rotateY(' + (px * 7).toFixed(2) + 'deg) translateZ(4px)';
        });
      });
      card.addEventListener('pointerleave', function () {
        card.style.transition = 'transform 0.45s ease';
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
        setTimeout(function () { card.style.transition = ''; }, 460);
      });
    });
  }
})();
