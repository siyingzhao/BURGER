/* Independent behavior for the comparison page. No build step or server required. */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    button.querySelector('span').textContent = playing ? 'Ⅱ' : '▶';
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
    const button = video.closest('.video-frame').querySelector('.video-toggle');
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
    button.addEventListener('click', () => {
      if (video.paused) {
        userPaused.delete(video);
        play(video);
      } else {
        userPaused.add(video);
        video.pause();
      }
    });
    video.addEventListener('error', () => {
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
    button.addEventListener('click', async () => {
      const block = document.getElementById(button.dataset.copy);
      const status = button.parentElement.querySelector('.copy-status');
      try {
        if (!navigator.clipboard) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(block.textContent);
        status.textContent = 'Copied';
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(block);
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = 'Selected; use your copy shortcut.';
      }
    });
  });
})();
