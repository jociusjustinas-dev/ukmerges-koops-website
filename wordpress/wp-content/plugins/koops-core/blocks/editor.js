(function registerKoopsSectionEditor(wp) {
  if (!wp || !wp.blocks || !wp.blockEditor || !wp.components || !wp.data || !wp.element || !wp.hooks || !wp.plugins) return;

  const { blocks, blockEditor, components, data, element, hooks, plugins } = wp;
  const el = element.createElement;
  const { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } = blockEditor;
  const { PanelBody, SelectControl, TextControl, TextareaControl, ToggleControl, Button } = components;
  const LinkControl = blockEditor.__experimentalLinkControl;
  const catalog = (window.koopsSectionEditor && window.koopsSectionEditor.catalog) || {};
  const defaults = (window.koopsSectionEditor && window.koopsSectionEditor.defaults) || {};
  const frontendUrl = ((window.koopsSectionEditor && window.koopsSectionEditor.frontendUrl) || '').replace(/\/$/, '');
  const previewVersion = (window.koopsSectionEditor && window.koopsSectionEditor.previewVersion) || '';
  const options = [{ label: 'Pasirinkite sekciją', value: '' }].concat(
    Object.entries(catalog).map(([value, item]) => ({ label: item.label, value }))
  );

  function KoopsLinkControl(props) {
    if (!LinkControl) {
      return el(TextControl, {
        label: props.label,
        value: props.value,
        onChange: props.onChange
      });
    }

    return el(
      'div',
      { className: 'koops-link-control' },
      el('span', { className: 'koops-link-control__label' }, props.label),
      el(LinkControl, {
        value: props.value ? { url: props.value } : {},
        onChange: (link) => props.onChange((link && link.url) || ''),
        onRemove: () => props.onChange(''),
        settings: []
      })
    );
  }

  function KoopsSectionEdit(props) {
    const a = props.attributes;
    const set = props.setAttributes;
    const selected = catalog[a.sectionType];
    const previewTitle = a.title || (selected ? selected.label : 'Pasirinkite sekciją');
    const blockProps = useBlockProps({
      className: 'koops-section-preview' + (a.enabled ? '' : ' is-disabled')
    });

    return el(
      element.Fragment,
      null,
      el(
        InspectorControls,
        null,
        el(
          PanelBody,
          { title: 'Sekcijos nustatymai', initialOpen: true },
          el(ToggleControl, {
            label: 'Rodyti svetainėje',
            checked: a.enabled,
            onChange: (enabled) => set({ enabled })
          }),
          el(SelectControl, {
            label: 'Sekcijos tipas',
            value: a.sectionType,
            options,
            onChange: (sectionType) => set(Object.assign({ sectionType }, defaults[sectionType] || {}))
          })
        ),
        el(
          PanelBody,
          { title: 'Turinys', initialOpen: true },
          el(TextControl, { label: 'Mažoji antraštė', value: a.eyebrow, onChange: (eyebrow) => set({ eyebrow }) }),
          el(TextareaControl, { label: 'Antraštė', help: 'Naują eilutę įrašykite Enter klavišu.', value: a.title, onChange: (title) => set({ title }) }),
          el(TextareaControl, { label: 'Aprašymas', value: a.description, onChange: (description) => set({ description }) }),
          el(TextControl, { label: 'Pagrindinio mygtuko tekstas', value: a.primaryLabel, onChange: (primaryLabel) => set({ primaryLabel }) }),
          el(KoopsLinkControl, { label: 'Pagrindinio mygtuko nuoroda', value: a.primaryUrl, onChange: (primaryUrl) => set({ primaryUrl }) }),
          el(
            MediaUploadCheck,
            null,
            el(MediaUpload, {
              allowedTypes: ['image'],
              value: a.imageId,
              onSelect: (media) => set({ imageId: media.id, imageUrl: media.url }),
              render: ({ open }) => el(Button, { variant: 'secondary', onClick: open }, a.imageUrl ? 'Keisti nuotrauką' : 'Pasirinkti nuotrauką')
            })
          ),
          a.imageUrl
            ? el(Button, { isDestructive: true, variant: 'link', onClick: () => set({ imageId: 0, imageUrl: '' }) }, 'Pašalinti pasirinktą nuotrauką')
            : null
        )
      ),
      el(
        'div',
        blockProps,
        el(
          'div',
          { className: 'koops-section-preview__meta' },
          el('span', null, selected ? selected.page.toUpperCase() : 'KOOPS'),
          el('strong', null, a.enabled ? 'Rodoma' : 'Išjungta')
        ),
        el('h3', null, previewTitle),
        a.description ? el('p', null, a.description) : el('p', null, 'Paspauskite bloką — laukai atsidarys dešinėje.')
      )
    );
  }

  blocks.registerBlockType('koops/section', {
    edit: KoopsSectionEdit,
    save: function () { return null; }
  });

  hooks.addFilter(
    'editor.BlockEdit',
    'koops/section-editor',
    function withKoopsSectionEditor(BlockEdit) {
      return function KoopsBlockEdit(props) {
        if (props.name === 'koops/section') return el(KoopsSectionEdit, props);
        return el(BlockEdit, props);
      };
    }
  );

  function KoopsSelectedSectionInspector() {
    const selectedBlock = data.useSelect(
      function selectBlock(select) {
        return select('core/block-editor').getSelectedBlock();
      },
      []
    );
    const blockEditorDispatch = data.useDispatch('core/block-editor');

    if (!selectedBlock || selectedBlock.name !== 'koops/section') return null;

    const a = selectedBlock.attributes;
    const set = function setAttributes(attributes) {
      blockEditorDispatch.updateBlockAttributes(selectedBlock.clientId, attributes);
    };

    return el(
      InspectorControls,
      { group: 'settings' },
      el(
        PanelBody,
        { title: 'Sekcijos nustatymai', initialOpen: true },
        el(ToggleControl, {
          label: 'Rodyti svetainėje',
          checked: a.enabled,
          onChange: (enabled) => set({ enabled })
        }),
        el(SelectControl, {
          label: 'Sekcijos tipas',
          value: a.sectionType,
          options,
          onChange: (sectionType) => set(Object.assign({ sectionType }, defaults[sectionType] || {}))
        })
      ),
      el(
        PanelBody,
        { title: 'Turinys', initialOpen: true },
        el(TextControl, { label: 'Mažoji antraštė', value: a.eyebrow, onChange: (eyebrow) => set({ eyebrow }) }),
        el(TextareaControl, { label: 'Antraštė', help: 'Naują eilutę įrašykite Enter klavišu.', value: a.title, onChange: (title) => set({ title }) }),
        el(TextareaControl, { label: 'Aprašymas', value: a.description, onChange: (description) => set({ description }) }),
        el(TextControl, { label: 'Pagrindinio mygtuko tekstas', value: a.primaryLabel, onChange: (primaryLabel) => set({ primaryLabel }) }),
        el(KoopsLinkControl, { label: 'Pagrindinio mygtuko nuoroda', value: a.primaryUrl, onChange: (primaryUrl) => set({ primaryUrl }) }),
        el(
          MediaUploadCheck,
          null,
          el(MediaUpload, {
            allowedTypes: ['image'],
            value: a.imageId,
            onSelect: (media) => set({ imageId: media.id, imageUrl: media.url }),
            render: ({ open }) => el(Button, { variant: 'secondary', onClick: open }, a.imageUrl ? 'Keisti nuotrauką' : 'Pasirinkti nuotrauką')
          })
        ),
        a.imageUrl
          ? el(Button, { isDestructive: true, variant: 'link', onClick: () => set({ imageId: 0, imageUrl: '' }) }, 'Pašalinti pasirinktą nuotrauką')
          : null
      )
    );
  }

  plugins.registerPlugin('koops-selected-section-inspector', {
    render: KoopsSelectedSectionInspector
  });

  // Render the real Next.js page inside Gutenberg. The public frontend remains
  // the only source of layout, fonts and animation; WordPress only selects and
  // edits the matching section block.
  let editorTimer = 0;
  let sidebarSignature = '';

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

  function updateSection(block, changes) {
    data.dispatch('core/block-editor').updateBlockAttributes(block.clientId, changes);
    postToPreview({ type: 'update-section', sectionType: block.attributes.sectionType, changes });
  }

  function ensureSidebarOpen() {
    const editPost = data.dispatch('core/edit-post');
    if (editPost && editPost.openGeneralSidebar) editPost.openGeneralSidebar('edit-post/block');
  }

  function addSidebarField(panel, block, labelText, key, tag, className) {
    const label = document.createElement('label');
    label.className = 'koops-live-field' + (className ? ' ' + className : '');
    const title = document.createElement('span');
    title.textContent = labelText;
    const input = document.createElement(tag || 'input');
    if (tag === 'textarea') input.rows = key === 'description' ? 5 : 3;
    input.value = block.attributes[key] || '';
    input.addEventListener('change', () => {
      const changes = {};
      changes[key] = input.value;
      updateSection(block, changes);
    });
    label.append(title, input);
    panel.appendChild(label);
    return input;
  }

  function addSidebarLinkField(panel, block, labelText, key) {
    const mount = document.createElement('div');
    mount.className = 'koops-live-link-control';
    panel.appendChild(mount);

    const control = el(KoopsLinkControl, {
      label: labelText,
      value: block.attributes[key] || '',
      onChange: (value) => {
        const changes = {};
        changes[key] = value;
        updateSection(block, changes);
      }
    });

    if (element.createRoot) {
      mount.__koopsRoot = element.createRoot(mount);
      mount.__koopsRoot.render(control);
    } else if (element.render) {
      element.render(control, mount);
    }
  }

  function renderSidebar(block) {
    const inspector = document.querySelector('.block-editor-block-inspector');
    if (!inspector) return;

    const previous = inspector.querySelector('.koops-live-sidebar');
    if (!block || block.name !== 'koops/section') {
      if (previous) previous.remove();
      sidebarSignature = '';
      return;
    }

    const signature = JSON.stringify([block.clientId, block.attributes]);
    if (previous && signature === sidebarSignature) return;
    if (previous) previous.remove();
    sidebarSignature = signature;

    if (!document.getElementById('koops-live-editor-style')) {
      const style = document.createElement('style');
      style.id = 'koops-live-editor-style';
      style.textContent = [
        '.koops-live-sidebar{display:grid;gap:16px;padding:20px 16px 28px;border-top:1px solid #ddd;}',
        '.koops-live-sidebar h2{margin:0;font-size:15px;line-height:1.35;}',
        '.koops-live-sidebar__toggle{display:flex;align-items:center;gap:9px;font-weight:600;}',
        '.koops-live-sidebar__toggle input{width:18px;height:18px;margin:0;}',
        '.koops-live-field{display:grid;gap:7px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.035em;}',
        '.koops-live-field input,.koops-live-field textarea{box-sizing:border-box;width:100%;padding:9px 10px;border:1px solid #949494;border-radius:4px;background:#fff;color:#1e1e1e;font:400 14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-transform:none;letter-spacing:normal;}',
        '.koops-live-field textarea{resize:vertical;}',
        '.koops-link-control{display:grid;gap:7px;}',
        '.koops-link-control__label{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.035em;}',
        '.koops-live-link-control .block-editor-link-control{min-width:0;width:100%;}',
        '.koops-live-link-control .block-editor-link-control__search-input-wrapper{margin:0;}',
        '.koops-live-link-control .block-editor-link-control__search-item{padding-left:0;padding-right:0;}',
        '.koops-live-media{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end;}',
        '.koops-live-media .button{height:38px;align-self:end;}',
        '.koops-live-sidebar__type{margin:0;color:#757575;font-size:12px;text-transform:uppercase;letter-spacing:.06em;}'
      ].join('');
      document.head.appendChild(style);
    }

    const panel = document.createElement('div');
    panel.className = 'koops-live-sidebar';
    const heading = document.createElement('h2');
    heading.textContent = catalog[block.attributes.sectionType]?.label || 'Sekcijos turinys';
    const type = document.createElement('p');
    type.className = 'koops-live-sidebar__type';
    type.textContent = block.attributes.sectionType || '';

    const toggleLabel = document.createElement('label');
    toggleLabel.className = 'koops-live-sidebar__toggle';
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.checked = block.attributes.enabled !== false;
    toggle.addEventListener('change', () => updateSection(block, { enabled: toggle.checked }));
    const toggleText = document.createElement('span');
    toggleText.textContent = 'Rodyti svetainėje';
    toggleLabel.append(toggle, toggleText);
    panel.append(heading, type, toggleLabel);

    addSidebarField(panel, block, 'Mažoji antraštė', 'eyebrow', 'input');
    addSidebarField(panel, block, 'Antraštė', 'title', 'textarea');
    addSidebarField(panel, block, 'Aprašymas', 'description', 'textarea');
    addSidebarField(panel, block, 'Mygtuko tekstas', 'primaryLabel', 'input');
    addSidebarLinkField(panel, block, 'Mygtuko nuoroda', 'primaryUrl');

    const media = document.createElement('div');
    media.className = 'koops-live-media';
    const imageInput = addSidebarField(media, block, 'Nuotraukos adresas', 'imageUrl', 'input');
    const mediaButton = document.createElement('button');
    mediaButton.type = 'button';
    mediaButton.className = 'button button-secondary';
    mediaButton.textContent = 'Pasirinkti';
    mediaButton.addEventListener('click', () => {
      if (!wp.media) return;
      const picker = wp.media({ title: 'Pasirinkite sekcijos nuotrauką', multiple: false, library: { type: 'image' } });
      picker.on('select', () => {
        const selected = picker.state().get('selection').first().toJSON();
        imageInput.value = selected.url || '';
        updateSection(block, { imageId: selected.id || 0, imageUrl: selected.url || '' });
      });
      picker.open();
    });
    media.appendChild(mediaButton);
    panel.appendChild(media);
    inspector.appendChild(panel);
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
    window.setTimeout(() => renderSidebar(block), 120);
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
    renderSidebar(selected);
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
})(window.wp);
