(function bindKoopsFlyerMetabox(wp) {
  if (!wp || !wp.media) return;

  function bindPdf(button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const wrap = button.closest('label');
      const input = wrap && wrap.querySelector('.koops-media-id');
      const name = wrap && wrap.querySelector('.koops-media-filename');
      if (!input) return;
      const frame = wp.media({
        title: 'Pasirinkti PDF',
        library: { type: 'application/pdf' },
        button: { text: 'Naudoti PDF' },
        multiple: false
      });
      frame.on('select', function () {
        const file = frame.state().get('selection').first().toJSON();
        input.value = file.id || 0;
        if (name) name.textContent = file.filename || file.title || 'PDF';
        button.textContent = 'Keisti PDF';
      });
      frame.open();
    });
  }

  function bindPages(button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const wrap = button.closest('label');
      const input = wrap && wrap.querySelector('.koops-gallery-ids');
      if (!input) return;
      const ids = String(input.value || '')
        .split(',')
        .map(function (id) { return parseInt(id, 10) || 0; })
        .filter(Boolean);

      function save(selection) {
        const items = typeof selection.toJSON === 'function'
          ? selection.toJSON()
          : selection.map(function (model) { return model.toJSON ? model.toJSON() : model; });
        input.value = items.map(function (item) { return item.id; }).filter(Boolean).join(',');
      }

      if (ids.length && wp.media.gallery && typeof wp.media.gallery.edit === 'function') {
        wp.media.gallery.edit('[gallery ids="' + ids.join(',') + '"]').state('gallery-edit').on('update', save);
        return;
      }
      const frame = wp.media({
        frame: 'post',
        state: 'gallery-library',
        title: 'Puslapių nuotraukos',
        multiple: true,
        library: { type: 'image' }
      });
      frame.on('update', save);
      frame.open();
    });
  }

  document.querySelectorAll('.koops-pick-pdf').forEach(bindPdf);
  document.querySelectorAll('.koops-pick-pages').forEach(bindPages);
})(window.wp);
