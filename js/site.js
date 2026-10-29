/* Playback, navigation, and scroll focus for the BURGER website. */
(() => {
  'use strict';
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reducedMotion = motionPreference.matches;
  const videos = [...document.querySelectorAll('video[data-src]')];
  const visibility = new WeakMap();
  const userPaused = new WeakSet();

  function attach(video) {
    if (!video.getAttribute('src') && video.dataset.src) {
      video.src = video.dataset.src;
      video.load();
    }
  }

  function play(video) {
    attach(video);
    if (video.error) video.load();
    const result = video.play();
    if (result && result.catch) result.catch(() => {});
  }

  function syncButton(video) {
    const frame = video.closest('.video-frame');
    const button = frame && frame.querySelector('.video-toggle');
    if (!button) return;
    const playing = !video.paused && !video.ended;
    const icon = button.querySelector('span');
    if (icon) icon.textContent = playing ? 'Ⅱ' : '▶';
    button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${button.dataset.name}`);
    if (playing) button.removeAttribute('title');
  }

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target;
      visibility.set(video, entry.isIntersecting);
      if (!entry.isIntersecting) {
        video.pause();
      } else if (!document.hidden && !reducedMotion && !userPaused.has(video) && video.hasAttribute('data-autoplay')) {
        play(video);
      }
    });
  }, { threshold: 0.15 }) : null;

  videos.forEach(video => {
    const button = video.closest('.video-frame')?.querySelector('.video-toggle');
    video.addEventListener('play', () => syncButton(video));
    video.addEventListener('pause', () => syncButton(video));
    video.addEventListener('ended', () => syncButton(video));
    const resumeVisible = () => {
      if (visibility.get(video) && !document.hidden && !reducedMotion && !userPaused.has(video) && video.hasAttribute('data-autoplay')) play(video);
    };
    video.addEventListener('sourcechange', () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
      resumeVisible();
    });
    video.addEventListener('resumevisible', resumeVisible);
    button?.addEventListener('click', () => {
      if (video.paused) {
        userPaused.delete(video);
        play(video);
      } else {
        userPaused.add(video);
        video.pause();
      }
    });
    video.addEventListener('error', () => {
      if (!button) return;
      button.setAttribute('aria-label', `Retry ${button.dataset.name}`);
      button.title = 'Video could not load. Click to retry.';
    });
    if (observer) observer.observe(video);
  });

  document.addEventListener('visibilitychange', () => {
    videos.forEach(video => {
      if (document.hidden) video.pause();
      else if (visibility.get(video) && !reducedMotion && !userPaused.has(video) && video.hasAttribute('data-autoplay')) play(video);
    });
  });

  // Keep each explanation, comparison, and caption in one focus group.
  // Group existing siblings without wrappers so their layout and widths stay intact.
  // Later chapters stay clear as a whole while readers browse their examples.
  // The title and authors stay clear even when a tall viewport focuses the introduction.
  const focusGroups = [
    '#why', '#comparison',
    '#circle > :is(.section-heading, .circle-grid, .caption, .finding-pair, .study-finding)',
    '#circle > .evidence-block', '#diversity', '#composition',
    '#scaling > :not(.evidence-block)', '#scaling > .evidence-block',
    '#real', '#dataset', '#overview',
  ].map(selector => ({
    elements: [...document.querySelectorAll(selector)],
  })).filter(group => group.elements.length);
  if ('IntersectionObserver' in window && focusGroups.length) {
    const focusCards = focusGroups.flatMap(group => group.elements);
    const visibleCards = new Set();
    const nav = document.querySelector('.site-nav');
    let focusedGroup = null;
    let focusFrame = 0;
    focusCards.forEach(card => card.classList.add('scroll-focus-card'));

    const setFocusedGroup = nextGroup => {
      if (nextGroup === focusedGroup) return;
      focusedGroup?.elements.forEach(card => card.classList.remove('is-scroll-focused'));
      nextGroup?.elements.forEach(card => card.classList.add('is-scroll-focused'));
      focusedGroup = nextGroup;
    };
    const updateScrollFocus = () => {
      focusFrame = 0;
      if (motionPreference.matches) return;
      const viewportTop = nav?.getBoundingClientRect().bottom || 0;
      const readingLine = viewportTop + (window.innerHeight - viewportTop) * .45;
      const keyboardTarget = document.activeElement?.matches(':focus-visible') ? document.activeElement : null;
      let nextGroup = null;
      let nearestDistance = Infinity;
      focusGroups.forEach(group => {
        if (!group.elements.some(card => visibleCards.has(card))) return;
        const rects = group.elements.map(card => card.getBoundingClientRect()).filter(rect => rect.height);
        const top = Math.min(...rects.map(rect => rect.top));
        const bottom = Math.max(...rects.map(rect => rect.bottom));
        if (bottom <= viewportTop || top >= window.innerHeight) return;
        // A tall passage stays clear until the reading line reaches the next one.
        let distance = Math.max(top - readingLine, readingLine - bottom, 0);
        if (group === focusedGroup) distance -= 24; // Prevent flicker near a boundary.
        if (keyboardTarget && group.elements.some(card => card.contains(keyboardTarget))) distance = -Infinity;
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nextGroup = group;
        }
      });
      setFocusedGroup(nextGroup);
    };
    const scheduleScrollFocus = () => {
      if (!motionPreference.matches && !focusFrame) focusFrame = requestAnimationFrame(updateScrollFocus);
    };
    const focusObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visibleCards.add(entry.target);
        else visibleCards.delete(entry.target);
      });
      scheduleScrollFocus();
    });
    focusCards.forEach(card => focusObserver.observe(card));
    const syncMotionPreference = () => {
      document.body.classList.toggle('scroll-focus-enabled', !motionPreference.matches);
      if (motionPreference.matches) {
        cancelAnimationFrame(focusFrame);
        focusFrame = 0;
        setFocusedGroup(null);
      } else {
        scheduleScrollFocus();
      }
    };
    window.addEventListener('scroll', scheduleScrollFocus, { passive: true });
    window.addEventListener('resize', scheduleScrollFocus);
    window.addEventListener('load', scheduleScrollFocus);
    window.addEventListener('hashchange', scheduleScrollFocus);
    document.addEventListener('focusin', scheduleScrollFocus);
    document.addEventListener('focusout', scheduleScrollFocus);
    if ('ResizeObserver' in window) {
      const focusResizeObserver = new ResizeObserver(scheduleScrollFocus);
      focusCards.forEach(card => focusResizeObserver.observe(card));
    }
    motionPreference.addEventListener('change', syncMotionPreference);
    syncMotionPreference();
  }

  // The two recordings keep their own timing; the range controls only the reveal.
  const comparison = document.querySelector('.video-compare');
  if (comparison) {
    const pair = [...comparison.querySelectorAll('video[data-compare-src]')];
    const range = comparison.querySelector('.compare-range');
    const button = comparison.querySelector('.compare-play');
    let visible = false;
    let pausedByUser = false;
    let wantedPlaying = false;
    let revealFrame = 0;
    let revealed = false;
    let interacted = false;

    const updateSplit = value => {
      if (!range) return;
      const split = Math.max(0, Math.min(100, Number(value)));
      range.value = String(split);
      comparison.style.setProperty('--split', `${split}%`);
      range.setAttribute('aria-valuetext', `${Math.round(split)}% simulation, ${Math.round(100 - split)}% real robot`);
    };
    const stopReveal = () => {
      cancelAnimationFrame(revealFrame);
      revealFrame = 0;
    };
    const takeControl = () => {
      interacted = true;
      stopReveal();
    };
    const syncPairButton = () => {
      if (!button) return;
      const playing = pair.some(video => !video.paused && !video.ended);
      const icon = button.querySelector('span');
      if (icon) icon.textContent = playing ? 'Ⅱ' : '▶';
      button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} simulation and real-robot videos`);
    };
    const pausePair = () => {
      wantedPlaying = false;
      pair.forEach(video => video.pause());
      syncPairButton();
    };
    const playPair = () => {
      if (document.hidden || !visible || !pair.length) return;
      wantedPlaying = true;
      button?.removeAttribute('title');
      pair.forEach(video => {
        if (!video.getAttribute('src')) {
          video.src = video.dataset.compareSrc;
          video.load();
        } else if (video.error) {
          video.load();
        }
        video.play().catch(() => syncPairButton());
      });
    };
    const animateReveal = () => {
      if (!range || revealed || interacted || reducedMotion) return;
      revealed = true;
      const started = performance.now();
      const animate = now => {
        const progress = Math.min(1, (now - started) / 1800);
        // A small sweep returns to the neutral split, without implying alignment.
        updateSplit(50 + 12 * Math.sin(progress * Math.PI * 2) * Math.sin(progress * Math.PI));
        if (progress < 1 && visible && !document.hidden && !interacted) {
          revealFrame = requestAnimationFrame(animate);
        } else {
          revealFrame = 0;
        }
      };
      revealFrame = requestAnimationFrame(animate);
    };

    if (range) {
      // Handle dragging on the whole surface, without relying on a mobile
      // browser's native range thumb. Keep the range for keyboard and AT input.
      let drag = null;
      const splitAtPointer = event => {
        const bounds = comparison.getBoundingClientRect();
        if (bounds.width) updateSplit((event.clientX - bounds.left) / bounds.width * 100);
      };
      const endDrag = event => {
        if (!drag || event.pointerId !== drag.id) return;
        drag = null;
        if (comparison.hasPointerCapture(event.pointerId)) comparison.releasePointerCapture(event.pointerId);
      };
      comparison.addEventListener('pointerdown', event => {
        if (!event.isPrimary || event.button !== 0 || event.target.closest('button')) return;
        takeControl();
        event.preventDefault();
        range.focus({ preventScroll: true });
        drag = { id: event.pointerId, x: event.clientX, y: event.clientY, horizontal: event.pointerType === 'mouse' };
        comparison.setPointerCapture(event.pointerId);
        if (drag.horizontal) splitAtPointer(event);
      });
      comparison.addEventListener('pointermove', event => {
        if (!drag || event.pointerId !== drag.id) return;
        if (!drag.horizontal) {
          const dx = Math.abs(event.clientX - drag.x);
          const dy = Math.abs(event.clientY - drag.y);
          if (Math.max(dx, dy) < 6) return;
          // Let a vertical swipe scroll the page without moving the divider.
          if (dy > dx) {
            endDrag(event);
            return;
          }
          drag.horizontal = true;
        }
        splitAtPointer(event);
      });
      comparison.addEventListener('pointerup', event => {
        if (!drag || event.pointerId !== drag.id) return;
        splitAtPointer(event);
        endDrag(event);
      });
      comparison.addEventListener('pointercancel', endDrag);
      comparison.addEventListener('lostpointercapture', endDrag);

      updateSplit(range.value || 50);
      range.addEventListener('focus', takeControl);
      range.addEventListener('keydown', takeControl);
      range.addEventListener('input', () => {
        takeControl();
        updateSplit(range.value);
      });
    }
    pair.forEach(video => {
      video.addEventListener('play', () => {
        if (!wantedPlaying || !visible || document.hidden) video.pause();
        syncPairButton();
      });
      video.addEventListener('pause', syncPairButton);
      video.addEventListener('ended', syncPairButton);
      video.addEventListener('error', () => {
        pausePair();
        if (!button) return;
        button.setAttribute('aria-label', 'Retry simulation and real-robot videos');
        button.title = 'A video could not load. Click to retry.';
      });
    });
    button?.addEventListener('click', () => {
      takeControl();
      if (pair.some(video => !video.paused && !video.ended)) {
        pausedByUser = true;
        pausePair();
      } else {
        pausedByUser = false;
        playPair();
      }
    });
    const updateComparisonVisibility = nextVisible => {
      visible = nextVisible;
      if (!visible) {
        pausePair();
        stopReveal();
      } else if (!document.hidden && !pausedByUser && !reducedMotion) {
        playPair();
        animateReveal();
      }
    };
    if ('IntersectionObserver' in window) {
      const compareObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => updateComparisonVisibility(entry.isIntersecting && entry.intersectionRatio >= 0.15));
      }, { threshold: [0, 0.15] });
      compareObserver.observe(comparison);
    } else {
      updateComparisonVisibility(true);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pausePair();
        stopReveal();
      } else if (visible && !pausedByUser && !reducedMotion) {
        playPair();
      }
    });
  }

  const sectionNav = document.querySelector('.section-nav');
  if (sectionNav) {
    const links = [...sectionNav.querySelectorAll('a[href^="#"]')];
    const targets = links.map(link => document.getElementById(link.hash.slice(1)));
    let activeIndex = 0;
    let pointerIndex = -1;
    let focusIndex = -1;
    let navFrame = 0;
    const updateProximity = () => {
      const center = pointerIndex >= 0 ? pointerIndex : focusIndex >= 0 ? focusIndex : activeIndex;
      links.forEach((link, index) => {
        link.style.setProperty('--proximity', String(Math.max(0, 1 - Math.abs(index - center) / 3)));
      });
    };
    const updateActiveSection = () => {
      navFrame = 0;
      const readingLine = Math.min(window.innerHeight * 0.3, (document.querySelector('.site-nav')?.offsetHeight || 60) + 100);
      let next = 0;
      targets.forEach((target, index) => {
        if (target && target.getBoundingClientRect().top <= readingLine) next = index;
      });
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        const lastTarget = targets.findLastIndex(target => target);
        if (lastTarget >= 0) next = lastTarget;
      }
      activeIndex = next;
      links.forEach((link, index) => {
        if (index === activeIndex) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      updateProximity();
    };
    const scheduleNav = () => {
      if (!navFrame) navFrame = requestAnimationFrame(updateActiveSection);
    };
    links.forEach((link, index) => {
      link.addEventListener('pointerenter', () => {
        pointerIndex = index;
        updateProximity();
      });
      link.addEventListener('focus', () => {
        focusIndex = index;
        updateProximity();
      });
      link.addEventListener('blur', () => {
        focusIndex = -1;
        updateProximity();
      });
    });
    sectionNav.addEventListener('pointerleave', () => {
      pointerIndex = -1;
      updateProximity();
    });
    window.addEventListener('scroll', scheduleNav, { passive: true });
    window.addEventListener('resize', scheduleNav);
    window.addEventListener('load', scheduleNav);
    window.addEventListener('hashchange', scheduleNav);
    updateActiveSection();
  }

  const singleGallery = document.querySelector('.single-gallery');
  if (singleGallery) {
    const previous = document.querySelector('[data-gallery-prev]');
    const next = document.querySelector('[data-gallery-next]');
    const updateGalleryControls = () => {
      if (previous) previous.disabled = singleGallery.scrollLeft <= 2;
      if (next) next.disabled = singleGallery.scrollLeft + singleGallery.clientWidth >= singleGallery.scrollWidth - 2;
    };
    const scrollGallery = direction => singleGallery.scrollBy({
      left: direction * Math.max(200, singleGallery.clientWidth * 0.8),
      behavior: reducedMotion ? 'instant' : 'smooth',
    });
    previous?.addEventListener('click', () => scrollGallery(-1));
    next?.addEventListener('click', () => scrollGallery(1));
    singleGallery.addEventListener('scroll', updateGalleryControls, { passive: true });
    window.addEventListener('resize', updateGalleryControls);
    window.addEventListener('load', updateGalleryControls);
    if ('ResizeObserver' in window) new ResizeObserver(updateGalleryControls).observe(singleGallery);
    updateGalleryControls();
  }

  const pipeline = document.querySelector('[data-pipeline]');
  if (pipeline) {
    const speed = { bicycle: '8.3×', cat: '6.9×', owl: '7.2×', sailboat: '6.0×', birthday_cake: '7.7×', elephant: '8.6×', guitar: '6.5×', house: '9.5×' };
    const video = pipeline.querySelector('video');
    pipeline.querySelectorAll('[data-object]').forEach(button => {
      button.addEventListener('click', () => {
        const object = button.dataset.object;
        const name = object.replaceAll('_', ' ');
        pipeline.querySelectorAll('[data-object]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        const sketch = document.getElementById('input-sketch');
        const strokes = document.getElementById('extracted-strokes');
        sketch.src = `assets/images/sketch/${object}.webp`;
        sketch.alt = `Generated line sketch: ${name}`;
        strokes.src = `assets/images/skeleton/${object}.webp`;
        strokes.alt = `Skeleton extracted from the ${name} sketch`;
        video.pause();
        video.removeAttribute('src');
        video.dataset.src = `assets/videos/g_${object}.mp4`;
        video.poster = `assets/posters/g_${object}.jpg`;
        video.setAttribute('aria-label', `Generated ${name} trajectory replayed in simulation`);
        document.getElementById('pipeline-speed').textContent = speed[object];
        video.load();
        if (visibility.get(video) && !reducedMotion && !userPaused.has(video)) play(video);
      });
    });
  }

  document.querySelectorAll('[data-copy]').forEach(button => {
    const label = button.querySelector('[data-copy-label]');
    const defaultLabel = label?.textContent;
    let labelReset;
    button.addEventListener('click', async () => {
      const block = document.getElementById(button.dataset.copy);
      const status = button.parentElement?.querySelector('.copy-status');
      if (!block) return;
      try {
        if (!navigator.clipboard) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(block.textContent);
        if (status) status.textContent = 'Copied';
        if (label) {
          clearTimeout(labelReset);
          label.textContent = 'Copied';
          labelReset = setTimeout(() => { label.textContent = defaultLabel; }, 2000);
        }
      } catch {
        if (document.hidden) return;
        const selection = window.getSelection();
        if (!selection) {
          if (status) status.textContent = 'Copy unavailable; the citation is at the end of the page.';
          return;
        }
        const range = document.createRange();
        range.selectNodeContents(block);
        selection.removeAllRanges();
        selection.addRange(range);
        block.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'instant' : 'smooth' });
        if (status) status.textContent = 'Selected; use your copy shortcut.';
      }
    });
  });
})();
