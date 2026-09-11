(function registerKoopsSectionEditor(wp) {
  if (!wp || !wp.blocks || !wp.blockEditor || !wp.components || !wp.data || !wp.element) return;

  if (wp.hooks && wp.hooks.addFilter) {
    wp.hooks.addFilter(
      'blocks.getBlockMenuDefaultClassName',
      'koops/section-menu-class',
      function (className, blockName) {
        if (blockName && String(blockName).indexOf('koops/section') === 0) {
          return 'editor-block-list-item-' + String(blockName).replace(/\//g, '-');
        }
        return className;
      }
    );
  }

  const { blocks, blockEditor, components, data, element } = wp;
  const el = element.createElement;
  const { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } = blockEditor;
  const { PanelBody, SelectControl, TextControl, TextareaControl, ToggleControl, Button } = components;
  const catalog = (window.koopsSectionEditor && window.koopsSectionEditor.catalog) || {};
  const defaults = (window.koopsSectionEditor && window.koopsSectionEditor.defaults) || {};
  const frontendUrl = ((window.koopsSectionEditor && window.koopsSectionEditor.frontendUrl) || '').replace(/\/$/, '');
  const previewBase = (window.koopsSectionEditor && window.koopsSectionEditor.previewBase) || '';
  const previewVersion = (window.koopsSectionEditor && window.koopsSectionEditor.previewVersion) || '';
  const options = [{ label: 'Pasirinkite sekciją', value: '' }].concat(
    Object.entries(catalog).map(([value, item]) => ({ label: item.label, value }))
  );

  function previewLinkLabel(value) {
    if (!value) return '';
    if (value.charAt(0) === '/' || value.charAt(0) === '#') return value;
    try {
      const url = new URL(value, window.location.origin);
      const host = url.hostname.replace(/^www\./, '');
      if (host.indexOf('google.') !== -1 && url.pathname.indexOf('/maps') === 0) {
        const query = url.searchParams.get('query') || url.searchParams.get('q') || '';
        return query ? 'Google Maps · ' + query : 'Google Maps';
      }
      if (url.protocol === 'mailto:') return value.replace(/^mailto:/, '');
      if (url.protocol === 'tel:') return value.replace(/^tel:/, '');
      return host + (url.pathname === '/' ? '' : url.pathname);
    } catch (error) {
      return value;
    }
  }

  function KoopsLinkControl(props) {
    const value = props.value || '';
    const openPicker = function openPicker() {
      if (!window.koopsOpenWpLink) {
        const next = window.prompt(props.label, value);
        if (next !== null) props.onChange(next);
        return;
      }
      window.koopsOpenWpLink(value, props.onChange);
    };

    return el(
      'div',
      { className: 'koops-link-control' },
      el('span', { className: 'koops-link-control__label' }, props.label),
      el(
        'div',
        { className: 'koops-link-control__row' },
        el('span', { className: 'koops-link-control__icon dashicons dashicons-admin-links', 'aria-hidden': 'true' }),
        el(
          'div',
          { className: 'koops-link-control__preview' },
          value
            ? el('a', {
                href: value,
                title: value,
                onClick: (event) => event.preventDefault()
              }, previewLinkLabel(value))
            : el('span', { className: 'koops-link-control__empty' }, 'Nuoroda nepasirinkta')
        ),
        el(Button, {
          icon: 'edit',
          label: 'Keisti nuorodą',
          variant: 'tertiary',
          onClick: openPicker
        })
      )
    );
  }

  function resolvePreviewUrl(url) {
    if (!url) return '';
    if (/^(https?:)?\/\//.test(url) || url.indexOf('data:') === 0) return url;
    if (url.charAt(0) === '/') return frontendUrl + url;
    return url;
  }

  function mediaKind(sectionType) {
    return (catalog[sectionType] && catalog[sectionType].media) || '';
  }

  function applyMediaItems(onChange, media) {
    const raw = Array.isArray(media) ? media : media && media.images ? media.images : media ? [media] : [];
    const items = raw.filter(Boolean);
    onChange({
      imageId: items[0] ? items[0].id : 0,
      imageUrl: items[0] ? items[0].url : '',
      galleryIds: items.map((item) => item.id).filter(Boolean),
      galleryUrls: items.map((item) => item.url).filter(Boolean)
    });
  }

  function ensureMediaItems(urls, ids) {
    const cleanIds = (ids || []).map(Number).filter(Boolean);
    if (cleanIds.length && (!urls || !urls.length || cleanIds.length === urls.length)) {
      return Promise.resolve(cleanIds);
    }
    const rest = window.koopsSectionEditor || {};
    if (!rest.ensureMediaUrl || !urls || !urls.length) {
      return Promise.resolve(cleanIds);
    }
    return fetch(rest.ensureMediaUrl, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': rest.restNonce || ''
      },
      body: JSON.stringify({ urls })
    })
      .then((response) => (response.ok ? response.json() : []))
      .then((items) => (Array.isArray(items) ? items.map((item) => item.id).filter(Boolean) : cleanIds))
      .catch(() => cleanIds);
  }

  function openNativeGallery(ids, onChange) {
    if (!wp.media) return;

    function saveSelection(selection) {
      if (!selection) return;
      const items = typeof selection.toJSON === 'function'
        ? selection.toJSON()
        : selection.map((model) => (model.toJSON ? model.toJSON() : model));
      applyMediaItems(onChange, items);
    }

    if (ids.length && wp.media.gallery && typeof wp.media.gallery.edit === 'function') {
      const frame = wp.media.gallery.edit('[gallery ids="' + ids.join(',') + '"]');
      frame.state('gallery-edit').on('update', saveSelection);
      return;
    }

    const frame = wp.media({
      frame: 'post',
      state: 'gallery-library',
      title: (wp.media.view && wp.media.view.l10n && wp.media.view.l10n.createGalleryTitle) || 'Sukurti galeriją',
      multiple: true,
      library: { type: 'image' }
    });
    frame.on('update', saveSelection);
    frame.open();
  }

  function KoopsMediaControl(props) {
    const kind = props.kind;
    if (!kind) return null;
    const gallery = kind === 'gallery';
    const previewUrls = (props.urls || []).map(resolvePreviewUrl).filter(Boolean);
    const ids = props.ids || [];
    const busyState = element.useState(false);
    const isBusy = busyState[0];
    const setIsBusy = busyState[1];

    function applySelection(media) {
      applyMediaItems(props.onChange, media);
    }

    function resetMedia() {
      const fallback = defaults[props.sectionType] || {};
      props.onChange({
        imageId: 0,
        imageUrl: fallback.imageUrl || '',
        galleryIds: [],
        galleryUrls: fallback.galleryUrls || []
      });
    }

    function openGallery() {
      if (isBusy) return;
      setIsBusy(true);
      ensureMediaItems(props.urls || [], ids)
        .then((resolvedIds) => openNativeGallery(resolvedIds, props.onChange))
        .finally(() => setIsBusy(false));
    }

    return el(
      'div',
      { className: 'koops-media-control' },
      el('span', { className: 'koops-media-control__label' }, gallery ? 'Galerija' : 'Nuotrauka'),
      previewUrls.length
        ? el(
            'div',
            { className: 'koops-media-control__previews' + (gallery ? ' is-gallery' : '') },
            previewUrls.map((url, index) => el('img', { src: url, alt: '', key: url + '-' + index }))
          )
        : el('div', { className: 'koops-media-control__empty' }, gallery ? 'Galerija nepasirinkta' : 'Nuotrauka nepasirinkta'),
      el(
        'div',
        { className: 'koops-media-control__actions' },
        gallery
          ? el(
              MediaUploadCheck,
              null,
              el(
                Button,
                { variant: 'secondary', onClick: openGallery, disabled: isBusy },
                isBusy ? 'Ruošiama galerija…' : previewUrls.length ? 'Redaguoti galeriją' : 'Sukurti galeriją'
              )
            )
          : el(
              MediaUploadCheck,
              null,
              el(MediaUpload, {
                allowedTypes: ['image'],
                value: ids[0] || 0,
                onSelect: applySelection,
                render: ({ open }) =>
                  el(Button, { variant: 'secondary', onClick: open }, previewUrls.length ? 'Keisti nuotrauką' : 'Pasirinkti nuotrauką')
              })
            ),
        previewUrls.length
          ? el(Button, { isDestructive: true, variant: 'link', onClick: resetMedia }, 'Atkurti numatytąją')
          : null
      )
    );
  }

  function mediaControlFor(a, set) {
    const kind = mediaKind(a.sectionType);
    if (!kind) return null;
    const fallback = defaults[a.sectionType] || {};
    const urls =
      kind === 'gallery'
        ? a.galleryUrls && a.galleryUrls.length
          ? a.galleryUrls
          : fallback.galleryUrls || []
        : [a.imageUrl || fallback.imageUrl || ''].filter(Boolean);
    const ids =
      kind === 'gallery'
        ? a.galleryIds && a.galleryIds.length
          ? a.galleryIds
          : fallback.galleryIds || []
        : a.imageId
          ? [a.imageId]
          : [];
    return el(KoopsMediaControl, {
      kind,
      sectionType: a.sectionType,
      urls,
      ids,
      onChange: set
    });
  }

  function defaultAnchor(sectionType) {
    return (defaults[sectionType] && defaults[sectionType].anchor) || sectionType || '';
  }

  function sectionPreviewSrc(type) {
    if (!type) return '';
    if (catalog[type] && catalog[type].preview) return catalog[type].preview;
    if (!previewBase) return '';
    return previewBase + type + '.jpg?ver=' + encodeURIComponent(previewVersion);
  }

  function sectionPreviewIcon(src) {
    if (!src) return 'layout';
    return {
      src: el(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 320 180',
          className: 'koops-section-variation-icon',
          'aria-hidden': 'true'
        },
        el('image', {
          href: src,
          xlinkHref: src,
          width: 320,
          height: 180,
          preserveAspectRatio: 'xMidYMid slice'
        })
      )
    };
  }

  function KoopsSectionFields(props) {
    const a = props.attributes;
    const set = props.setAttributes;
    const anchorFallback = defaultAnchor(a.sectionType);

    return el(
      PanelBody,
      { title: 'Sekcija', initialOpen: true },
      el(ToggleControl, {
        label: 'Rodyti svetainėje',
        checked: a.enabled,
        onChange: (enabled) => set({ enabled })
      }),
      el(SelectControl, {
        label: 'Sekcijos tipas',
        value: a.sectionType,
        options,
        onChange: (sectionType) => set(Object.assign({ sectionType, imageId: 0, galleryIds: [], galleryUrls: [] }, defaults[sectionType] || {}))
      }),
      el(TextControl, {
        label: 'Sekcijos ID',
        help: 'Nuorodoms, pvz. /restoranas#uzklausa. Jei tuščia — naudojamas numatytasis ID' + (anchorFallback ? ' (#' + anchorFallback + ').' : '.'),
        value: a.anchor || '',
        placeholder: anchorFallback,
        onChange: (anchor) => set({ anchor })
      }),
      el(TextControl, { label: 'Mažoji antraštė', value: a.eyebrow, onChange: (eyebrow) => set({ eyebrow }) }),
      el(TextareaControl, { label: 'Antraštė', help: 'Naują eilutę įrašykite Enter klavišu.', value: a.title, onChange: (title) => set({ title }) }),
      el(TextareaControl, { label: 'Aprašymas', value: a.description, onChange: (description) => set({ description }) }),
      el(TextControl, { label: 'Pagrindinio mygtuko tekstas', value: a.primaryLabel, onChange: (primaryLabel) => set({ primaryLabel }) }),
      el(KoopsLinkControl, { label: 'Pagrindinio mygtuko nuoroda', value: a.primaryUrl, onChange: (primaryUrl) => set({ primaryUrl }) }),
      mediaControlFor(a, set)
    );
  }

  function KoopsSectionPreviewImage(props) {
    const a = props.attributes;
    const selected = catalog[a.sectionType];
    const screenshot = a.imageUrl || sectionPreviewSrc(a.sectionType);
    return el(
      'figure',
      { className: 'koops-section-inserter-preview-wrap' },
      screenshot
        ? el('img', {
            className: 'koops-section-inserter-preview',
            src: screenshot,
            alt: selected ? selected.label : 'KOOPS sekcija'
          })
        : el('span', null, 'Nėra sekcijos nuotraukos')
    );
  }

  function KoopsSectionCanvas(props) {
    const a = props.attributes;
    const selected = catalog[a.sectionType];
    const previewTitle = a.title || (selected ? selected.label : 'Pasirinkite sekciją');
    const blockProps = useBlockProps({
      className: 'koops-section-preview' + (a.enabled ? '' : ' is-disabled')
    });
    const set = function setAttributes(changes) {
      props.setAttributes(changes);
      postToPreview({
        type: 'update-section',
        sectionType: changes.sectionType || a.sectionType,
        changes
      });
    };

    return el(
      element.Fragment,
      null,
      el(InspectorControls, null, el(KoopsSectionFields, { attributes: a, setAttributes: set })),
      el(
        'div',
        blockProps,
        el(
          'div',
          { className: 'koops-section-preview__meta' },
          el('span', null, selected ? selected.page.toUpperCase() : 'KOOPS'),
          el('span', null, '#' + (a.anchor || defaultAnchor(a.sectionType) || 'sekcija')),
          el('strong', null, a.enabled ? 'Rodoma' : 'Išjungta')
        ),
        el('h3', null, previewTitle),
        a.description ? el('p', null, a.description) : el('p', null, 'Paspauskite bloką — laukai atsidarys dešinėje.')
      )
    );
  }

  function KoopsSectionEdit(props) {
    if (props.attributes.isPreview) {
      return el(KoopsSectionPreviewImage, props);
    }
    return el(KoopsSectionCanvas, props);
  }

  blocks.registerBlockType('koops/section', {
    supports: { inserter: true },
    example: {
      attributes: {
        sectionType: 'home-hero',
        isPreview: true,
        imageUrl: sectionPreviewSrc('home-hero')
      },
      viewportWidth: 1280
    },
    edit: KoopsSectionEdit,
    save: function () { return null; }
  });

  function registerSectionVariations() {
    if (!blocks.registerBlockVariation) return;
    Object.entries(catalog).forEach(function ([type, item]) {
      const preview = item.preview || sectionPreviewSrc(type);
      const fallback = defaults[type] || {};
      blocks.registerBlockVariation('koops/section', {
        name: type,
        title: item.label,
        description: item.page === 'global' ? 'Naudojama visuose puslapiuose' : 'Puslapis: ' + item.page,
        category: 'koops',
        attributes: Object.assign({ sectionType: type, enabled: true }, fallback),
        example: {
          attributes: {
            sectionType: type,
            isPreview: true,
            imageUrl: preview
          },
          viewportWidth: 1280
        },
        isActive: function (blockAttributes) {
          return blockAttributes.sectionType === type;
        },
        scope: ['inserter', 'transform'],
        icon: sectionPreviewIcon(preview)
      });
    });
  }
  registerSectionVariations();

  // Render the real Next.js page inside Gutenberg. The public frontend remains
  // the only source of layout, fonts and animation; WordPress only selects and
  // edits the matching section block.
  let editorTimer = 0;

  function sectionBlocks() {
    const store = data.select('core/block-editor');
    return store ? store.getBlocks().filter((block) => block.name === 'koops/section') : [];
  }

  function currentSlug() {
    const editor = data.select('core/editor');
    const slug = editor && editor.getEditedPostAttribute ? editor.getEditedPostAttribute('slug') : '';
    if (slug) return slug;
    const title = document.querySelector('.editor-post-title__input');
    return title && title.value ? title.value : 'pradinis';
  }

  function previewUrl() {
    const slug = currentSlug();
    const path = !slug || slug === 'pradinis' ? '/' : '/' + encodeURIComponent(slug);
    return frontendUrl + path + '?koops-editor=1&ver=' + encodeURIComponent(previewVersion);
  }

  function liveFrame() {
    const canvasFrame = document.querySelector('iframe[name="editor-canvas"]');
    const doc = canvasFrame && canvasFrame.contentDocument;
    return doc ? doc.getElementById('koops-live-page') : null;
  }

  function postToPreview(message) {
    const frame = liveFrame();
    if (!frame || !frame.contentWindow || !frontendUrl) return;
    let origin = '*';
    try { origin = new URL(frontendUrl).origin; } catch { /* use wildcard for a malformed legacy option */ }
    frame.contentWindow.postMessage(Object.assign({ source: 'koops-gutenberg-editor' }, message), origin);
  }

  function ensureSidebarOpen() {
    const editPost = data.dispatch('core/edit-post');
    if (editPost && editPost.openGeneralSidebar) editPost.openGeneralSidebar('edit-post/block');
  }

  function renderLiveCanvas() {
    if (!frontendUrl) return;
    const canvasFrame = document.querySelector('iframe[name="editor-canvas"]');
    const doc = canvasFrame && canvasFrame.contentDocument;
    if (!doc || !doc.body || !sectionBlocks().length) return;

    if (!doc.getElementById('koops-live-canvas-style')) {
      const style = doc.createElement('style');
      style.id = 'koops-live-canvas-style';
      style.textContent = [
        'html,body{height:100%;min-height:100%;margin:0!important;padding:0!important;background:#dfe1dc!important;overflow:hidden!important;}',
        '.block-editor-block-list__layout,.is-root-container{display:none!important;}',
        '#koops-gutenberg-canvas{position:fixed;inset:0;z-index:9999;background:#dfe1dc;}',
        '#koops-live-page{display:block;width:100%;height:100%;border:0;background:#fff;}'
      ].join('');
      doc.head.appendChild(style);
    }

    let canvas = doc.getElementById('koops-gutenberg-canvas');
    if (!canvas) {
      canvas = doc.createElement('div');
      canvas.id = 'koops-gutenberg-canvas';
      doc.body.appendChild(canvas);
    }

    let frame = doc.getElementById('koops-live-page');
    const url = previewUrl();
    if (!frame) {
      frame = doc.createElement('iframe');
      frame.id = 'koops-live-page';
      frame.title = 'Tikra puslapio peržiūra';
      frame.setAttribute('allow', 'fullscreen');
      canvas.replaceChildren(frame);
    }
    if (frame.dataset.previewUrl !== url) {
      frame.dataset.previewUrl = url;
      frame.src = url;
    }
  }

  function selectPreviewSection(sectionType) {
    const block = sectionBlocks().find((item) => item.attributes.sectionType === sectionType);
    if (!block) return;
    data.dispatch('core/block-editor').selectBlock(block.clientId);
    ensureSidebarOpen();
    postToPreview({ type: 'select-section', sectionType });
  }

  window.addEventListener('message', (event) => {
    const message = event.data;
    if (!message || message.source !== 'koops-cms-preview') return;
    let expectedOrigin = '';
    try { expectedOrigin = new URL(frontendUrl).origin; } catch { return; }
    if (event.origin !== expectedOrigin) return;
    if (message.type === 'select-section' && message.sectionType) selectPreviewSection(message.sectionType);
    if (message.type === 'ready') {
      const selected = data.select('core/block-editor').getSelectedBlock();
      if (selected && selected.name === 'koops/section') {
        postToPreview({ type: 'select-section', sectionType: selected.attributes.sectionType });
      }
    }
  });

  function refreshEditor() {
    renderLiveCanvas();
    const selected = data.select('core/block-editor')?.getSelectedBlock();
    if (selected && selected.name === 'koops/section') {
      postToPreview({ type: 'select-section', sectionType: selected.attributes.sectionType });
    }
  }

  function scheduleEditor() {
    window.clearTimeout(editorTimer);
    editorTimer = window.setTimeout(refreshEditor, 100);
  }

  data.subscribe(scheduleEditor);
  window.setInterval(scheduleEditor, 1200);
  scheduleEditor();

  function findCatalogEntry(text) {
    const value = String(text || '').replace(/\s+/g, ' ').trim();
    if (!value) return null;
    return Object.entries(catalog).find(function ([, item]) {
      return item.label && value.indexOf(item.label) !== -1;
    }) || null;
  }

  function paintSectionThumb(node, type, item) {
    if (!node || node.querySelector('img.koops-section-inserter-thumb')) return;
    const src = item.preview || sectionPreviewSrc(type);
    if (!src) return;
    const icon = node.querySelector('.block-editor-block-icon, .block-editor-block-types-list-item__icon, .block-editor-block-types-list__item-icon') || node;
    const img = document.createElement('img');
    img.className = 'koops-section-inserter-thumb';
    img.src = src;
    img.alt = item.label || type;
    icon.appendChild(img);
  }

  function enhanceInserterPreviews() {
    document.querySelectorAll(
      '[class*="editor-block-list-item-koops-section"], .block-editor-block-types-list__item, .block-editor-block-types-list-item'
    ).forEach(function (node) {
      const className = node.className || '';
      const fromClass = Object.entries(catalog).find(function ([type]) {
        return className.indexOf('koops-section/' + type) !== -1 || className.indexOf('koops-section-' + type) !== -1;
      });
      const found = fromClass || findCatalogEntry(node.textContent);
      if (found) paintSectionThumb(node, found[0], found[1]);
    });

    const missing = document.querySelector('.block-editor-inserter__preview-content-missing');
    if (missing && !missing.querySelector('img')) {
      const titleNode = document.querySelector('.block-editor-inserter__preview-container .block-editor-block-card__title');
      const found = findCatalogEntry(titleNode && titleNode.textContent);
      if (!found) return;
      const src = found[1].preview || sectionPreviewSrc(found[0]);
      if (!src) return;
      const img = document.createElement('img');
      img.className = 'koops-section-inserter-preview';
      img.src = src;
      img.alt = found[1].label || found[0];
      missing.textContent = '';
      missing.appendChild(img);
    }
  }

  if (document.body) {
    const inserterObserver = new MutationObserver(function () {
      window.requestAnimationFrame(enhanceInserterPreviews);
    });
    inserterObserver.observe(document.body, { childList: true, subtree: true });
    enhanceInserterPreviews();
  }
})(window.wp);
