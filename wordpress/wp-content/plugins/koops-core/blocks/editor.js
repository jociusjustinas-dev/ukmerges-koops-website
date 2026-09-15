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
  const fieldSchemas = (window.koopsSectionEditor && window.koopsSectionEditor.fieldSchemas) || {};
  const itemSchemas = (window.koopsSectionEditor && window.koopsSectionEditor.itemSchemas) || {};
  const frontendUrl = ((window.koopsSectionEditor && window.koopsSectionEditor.frontendUrl) || '').replace(/\/$/, '');
  const previewBase = (window.koopsSectionEditor && window.koopsSectionEditor.previewBase) || '';
  const previewVersion = (window.koopsSectionEditor && window.koopsSectionEditor.previewVersion) || '';

  function sectionAllowsField(sectionType, field) {
    const schema = fieldSchemas[sectionType];
    if (!schema) {
      // Unknown type: keep legacy full form until schema is defined.
      return true;
    }
    return schema.indexOf(field) !== -1;
  }
  function sectionTypeOptions() {
    return [{ label: 'Pasirinkite sekciją', value: '' }].concat(
      Object.entries(catalog).map(function ([value, item]) {
        return { label: item.label, value };
      })
    );
  }

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

  function cloneItem(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }

  function KoopsItemsControl(props) {
    const schema = itemSchemas[props.sectionType];
    if (!schema || !schema.fields || !schema.fields.length) return null;

    const fallback = (defaults[props.sectionType] && defaults[props.sectionType].items) || [];
    const items = Array.isArray(props.items) && props.items.length ? props.items.map(cloneItem) : fallback.map(cloneItem);

    function commit(next) {
      props.onChange(next);
    }

    function updateItem(index, key, value) {
      const next = items.map(cloneItem);
      next[index] = Object.assign({}, next[index], { [key]: value });
      commit(next);
    }

    function updateItemMedia(index, media) {
      const next = items.map(cloneItem);
      const selected = Array.isArray(media) ? media[0] : media;
      next[index] = Object.assign({}, next[index], {
        imageUrl: selected && selected.url ? selected.url : '',
        imageId: selected && selected.id ? selected.id : 0
      });
      commit(next);
    }

    function moveItem(index, delta) {
      const target = index + delta;
      if (target < 0 || target >= items.length) return;
      const next = items.map(cloneItem);
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      commit(next);
    }

    function removeItem(index) {
      commit(items.filter(function (_item, itemIndex) {
        return itemIndex !== index;
      }));
    }

    function addItem() {
      commit(items.concat([cloneItem(schema.empty || {})]));
    }

    return el(
      'div',
      { className: 'koops-items-control' },
      el('span', { className: 'koops-items-control__label' }, schema.label || 'Sąrašas'),
      items.map(function (item, index) {
        return el(
          'div',
          { className: 'koops-items-control__item', key: 'item-' + index },
          el(
            'div',
            { className: 'koops-items-control__item-head' },
            el('strong', null, (schema.label || 'Įrašas') + ' ' + (index + 1)),
            el(
              'div',
              { className: 'koops-items-control__item-actions' },
              el(Button, {
                variant: 'tertiary',
                size: 'small',
                disabled: index === 0,
                onClick: function () {
                  moveItem(index, -1);
                },
                label: 'Aukštyn'
              }, '↑'),
              el(Button, {
                variant: 'tertiary',
                size: 'small',
                disabled: index === items.length - 1,
                onClick: function () {
                  moveItem(index, 1);
                },
                label: 'Žemyn'
              }, '↓'),
              el(Button, {
                isDestructive: true,
                variant: 'link',
                onClick: function () {
                  removeItem(index);
                }
              }, 'Šalinti')
            )
          ),
          schema.fields.map(function (field) {
            const key = field.key;
            const value = item[key] || '';
            if (field.type === 'textarea') {
              return el(TextareaControl, {
                key: key,
                label: field.label,
                value: value,
                onChange: function (next) {
                  updateItem(index, key, next);
                }
              });
            }
            if (field.type === 'url') {
              return el(KoopsLinkControl, {
                key: key,
                label: field.label,
                value: value,
                onChange: function (next) {
                  updateItem(index, key, next);
                }
              });
            }
            if (field.type === 'image') {
              const idKey = field.idKey || 'imageId';
              const preview = resolvePreviewUrl(item.imageUrl || '');
              return el(
                'div',
                { className: 'koops-items-control__image', key: key },
                el('span', { className: 'koops-media-control__label' }, field.label),
                preview
                  ? el('img', { src: preview, alt: '' })
                  : el('div', { className: 'koops-media-control__empty' }, 'Nuotrauka nepasirinkta'),
                el(
                  'div',
                  { className: 'koops-media-control__actions' },
                  el(
                    MediaUploadCheck,
                    null,
                    el(MediaUpload, {
                      allowedTypes: ['image'],
                      value: item[idKey] || 0,
                      onSelect: function (media) {
                        updateItemMedia(index, media);
                      },
                      render: function (args) {
                        return el(
                          Button,
                          { variant: 'secondary', onClick: args.open },
                          preview ? 'Keisti nuotrauką' : 'Pasirinkti nuotrauką'
                        );
                      }
                    })
                  ),
                  preview
                    ? el(Button, {
                        isDestructive: true,
                        variant: 'link',
                        onClick: function () {
                          updateItemMedia(index, null);
                        }
                      }, 'Pašalinti')
                    : null
                )
              );
            }
            return el(TextControl, {
              key: key,
              label: field.label,
              value: value,
              onChange: function (next) {
                updateItem(index, key, next);
              }
            });
          })
        );
      }),
      el(Button, { variant: 'secondary', onClick: addItem }, schema.addLabel || 'Pridėti')
    );
  }

  function KoopsSectionFields(props) {
    const a = props.attributes;
    const set = props.setAttributes;
    const anchorFallback = defaultAnchor(a.sectionType);
    const allows = function (field) {
      return sectionAllowsField(a.sectionType, field);
    };

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
        options: sectionTypeOptions(),
        onChange: (sectionType) => {
          const next = defaults[sectionType] || {};
          set(Object.assign({
            sectionType,
            imageId: 0,
            galleryIds: [],
            galleryUrls: [],
            items: next.items || []
          }, next));
        }
      }),
      el(TextControl, {
        label: 'Sekcijos ID',
        help: 'Nuorodoms, pvz. /restoranas#uzklausa. Jei tuščia — naudojamas numatytasis ID' + (anchorFallback ? ' (#' + anchorFallback + ').' : '.'),
        value: a.anchor || '',
        placeholder: anchorFallback,
        onChange: (anchor) => set({ anchor })
      }),
      allows('eyebrow')
        ? el(TextControl, { label: 'Mažoji antraštė', value: a.eyebrow, onChange: (eyebrow) => set({ eyebrow }) })
        : null,
      allows('title')
        ? el(TextareaControl, { label: 'Antraštė', help: 'Naują eilutę įrašykite Enter klavišu.', value: a.title, onChange: (title) => set({ title }) })
        : null,
      allows('description')
        ? el(TextareaControl, { label: 'Aprašymas', value: a.description, onChange: (description) => set({ description }) })
        : null,
      allows('primary')
        ? el(TextControl, { label: 'Pagrindinio mygtuko tekstas', value: a.primaryLabel, onChange: (primaryLabel) => set({ primaryLabel }) })
        : null,
      allows('primary')
        ? el(KoopsLinkControl, { label: 'Pagrindinio mygtuko nuoroda', value: a.primaryUrl, onChange: (primaryUrl) => set({ primaryUrl }) })
        : null,
      mediaControlFor(a, set),
      el(KoopsItemsControl, {
        sectionType: a.sectionType,
        items: a.items,
        onChange: function (items) {
          set({ items });
        }
      })
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
    element.useEffect(function () {
      if (!props.isPreview && props.attributes.isPreview) {
        props.setAttributes({ isPreview: false });
      }
    }, [props.isPreview, props.attributes.isPreview]);

    if (props.isPreview) {
      return el(KoopsSectionPreviewImage, props);
    }
    return el(KoopsSectionCanvas, props);
  }

  blocks.registerBlockType('koops/section', {
    supports: { inserter: true },
    example: {
      attributes: {
        sectionType: 'home-hero',
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
        description: 'Galima įterpti į bet kurį puslapį',
        category: 'koops',
        attributes: Object.assign({ sectionType: type, enabled: true }, fallback),
        example: {
          attributes: {
            sectionType: type,
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

  function usedSectionTypes() {
    return new Set(sectionBlocks().map((block) => block.attributes.sectionType).filter(Boolean));
  }

  if (wp.hooks && wp.hooks.addFilter) {
    wp.hooks.addFilter(
      'blocks.getBlockVariations',
      'koops/page-section-variations',
      function (variations, blockName) {
        if (blockName !== 'koops/section') return variations;
        const used = usedSectionTypes();
        return (variations || []).filter(function (variation) {
          const item = catalog[variation.name];
          return Boolean(item) && !used.has(variation.name);
        });
      }
    );
  }

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
      syncPreviewSections('', true);
      const selected = data.select('core/block-editor').getSelectedBlock();
      if (selected && selected.name === 'koops/section') {
        postToPreview({ type: 'select-section', sectionType: selected.attributes.sectionType, scroll: true });
      }
    }
  });

  function editorSectionsPayload() {
    return sectionBlocks().map(function (block) {
      const a = block.attributes || {};
      return {
        type: a.sectionType,
        enabled: a.enabled !== false,
        label: (catalog[a.sectionType] && catalog[a.sectionType].label) || a.sectionType,
        anchor: a.anchor,
        eyebrow: a.eyebrow,
        title: a.title,
        description: a.description,
        primaryLabel: a.primaryLabel,
        primaryUrl: a.primaryUrl,
        imageUrl: a.imageUrl,
        galleryUrls: a.galleryUrls,
        items: a.items,
        overrides: ['eyebrow', 'title', 'description', 'primaryLabel', 'primaryUrl', 'imageUrl', 'galleryUrls', 'items']
      };
    }).filter(function (section) { return Boolean(section.type); });
  }

  let lastSync = '';
  function syncPreviewSections(selectType, force) {
    if (!liveFrame()) return;
    const payload = editorSectionsPayload();
    const encoded = JSON.stringify(payload);
    if (!force && encoded === lastSync && !selectType) return;
    lastSync = encoded;
    postToPreview({
      type: 'sync-sections',
      sections: payload,
      sectionType: selectType || '',
      scroll: Boolean(selectType)
    });
  }

  function dedupeSectionBlocks() {
    const seen = new Map();
    const duplicates = [];
    let lastDuplicateType = '';
    sectionBlocks().forEach(function (block) {
      const type = block.attributes.sectionType;
      if (!type) return;
      if (seen.has(type)) {
        duplicates.push(block.clientId);
        lastDuplicateType = type;
      } else {
        seen.set(type, block.clientId);
      }
    });
    if (!duplicates.length) return '';
    data.dispatch('core/block-editor').removeBlocks(duplicates, false);
    const keepId = seen.get(lastDuplicateType);
    if (keepId) data.dispatch('core/block-editor').selectBlock(keepId);
    return lastDuplicateType;
  }

  function refreshEditor() {
    const insertedType = dedupeSectionBlocks();
    renderLiveCanvas();
    syncPreviewSections(insertedType);
    const selected = data.select('core/block-editor')?.getSelectedBlock();
    if (selected && selected.name === 'koops/section') {
      postToPreview({ type: 'select-section', sectionType: selected.attributes.sectionType, scroll: Boolean(insertedType) });
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
