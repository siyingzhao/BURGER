/* Browse recorded dataset demonstrations. Playback is shared with site.js. */
(() => {
  'use strict';
  const gallery = document.querySelector('[data-dataset-relations]');
  if (!gallery) return;
  const panels = [...gallery.querySelectorAll('[data-relation-panel]')];
  const filters = [...gallery.querySelectorAll('[data-relation]')];
  const variants = [...gallery.querySelectorAll('[data-variant]')];
  const selections = Object.fromEntries(panels.map(panel => [panel.dataset.relationPanel, 0]));
  const samples = new WeakMap();
  gallery.querySelectorAll('[data-sample]').forEach(card => samples.set(card, JSON.parse(card.dataset.variants)));
  let relation = 'horizontal';

  function render() {
    const selected = selections[relation];
    const panel = panels.find(item => item.dataset.relationPanel === relation);
    panels.forEach(item => {
      item.hidden = item !== panel;
      if (item.hidden) item.querySelectorAll('video').forEach(video => video.pause());
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.relation === relation)));
    variants.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.variant) === selected)));
    gallery.querySelector('[data-relation-description]').textContent = panel.dataset.description;
    panel.querySelectorAll('[data-sample]').forEach(card => {
      const sample = samples.get(card)[selected];
      const video = card.querySelector('video');
      if (video.dataset.src !== sample.video) {
        video.dataset.src = sample.video;
        video.poster = sample.poster;
        video.dispatchEvent(new Event('sourcechange'));
      }
      card.querySelector('[data-enlarge]').href = sample.video;
      card.querySelector('[data-sample-label]').textContent = 'Demonstration ' + String(selected + 1).padStart(2, '0');
      card.dataset.episode = sample.episode;
    });
    gallery.querySelector('[data-relation-status]').textContent = '6 tasks · 18 demonstrations · set ' + String(selected + 1).padStart(2, '0') + ' of 03';
  }

  filters.forEach(button => button.addEventListener('click', () => {
    relation = button.dataset.relation;
    render();
  }));
  variants.forEach(button => button.addEventListener('click', () => {
    selections[relation] = Number(button.dataset.variant);
    render();
  }));

  const dialog = gallery.querySelector('dialog');
  const enlarged = dialog.querySelector('video');
  let opener;
  let resume = [];
  if (typeof dialog.showModal === 'function') {
    gallery.querySelectorAll('[data-enlarge]').forEach(link => link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const card = link.closest('[data-sample]');
      const source = card.querySelector('video');
      enlarged.src = source.dataset.src;
      enlarged.poster = source.poster;
      enlarged.setAttribute('aria-label', source.getAttribute('aria-label'));
      dialog.querySelector('#relation-lightbox-title').textContent = card.querySelector('figcaption > span').textContent;
      dialog.querySelector('[data-lightbox-prompt]').textContent = 'Dataset instruction: “' + card.dataset.prompt + '”';
      dialog.querySelector('[data-lightbox-detail]').textContent = 'Generated demonstration · episode ' + card.dataset.episode + ' · 6× playback';
      dialog.querySelector('[data-lightbox-source]').href = link.href;
      resume = [...gallery.querySelectorAll('.relation-card video')].filter(video => !video.paused);
      resume.forEach(video => video.pause());
      opener = link;
      dialog.showModal();
      enlarged.play().catch(() => {});
    }));
    dialog.querySelector('[data-close-lightbox]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      enlarged.pause();
      enlarged.removeAttribute('src');
      enlarged.load();
      resume.forEach(video => video.dispatchEvent(new Event('resumevisible')));
      if (opener) opener.focus();
    });
  }
  gallery.classList.add('gallery-enhanced');
  render();
})();
