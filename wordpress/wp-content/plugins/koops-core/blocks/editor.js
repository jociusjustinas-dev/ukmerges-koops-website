(function registerKoopsSectionEditor(wp) {
  if (!wp || !wp.blocks || !wp.blockEditor || !wp.components || !wp.data || !wp.element || !wp.hooks || !wp.plugins) return;

  const { blocks, blockEditor, components, data, element, hooks, plugins } = wp;
  const el = element.createElement;
  const { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } = blockEditor;
  const { PanelBody, SelectControl, TextControl, TextareaControl, ToggleControl, Button } = components;
  const catalog = (window.koopsSectionEditor && window.koopsSectionEditor.catalog) || {};
  const defaults = (window.koopsSectionEditor && window.koopsSectionEditor.defaults) || {};
  const previewBase = (window.koopsSectionEditor && window.koopsSectionEditor.previewBase) || '';
  const previewVersion = (window.koopsSectionEditor && window.koopsSectionEditor.previewVersion) || '';
  const options = [{ label: 'Pasirinkite sekciją', value: '' }].concat(
    Object.entries(catalog).map(([value, item]) => ({ label: item.label, value }))
  );

  function KoopsSectionEdit(props) {
    const a = props.attributes;
    const set = props.setAttributes;
    const selected = catalog[a.sectionType];
    const previewTitle = a.title || (selected ? selected.label : 'Pasirinkite sekciją');
    const previewUrl = a.sectionType ? previewBase + a.sectionType + '.jpg?ver=' + encodeURIComponent(previewVersion) : '';
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
          el(TextControl, { label: 'Pagrindinio mygtuko nuoroda', value: a.primaryUrl, onChange: (primaryUrl) => set({ primaryUrl }) }),
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
        previewUrl ? el('img', { className: 'koops-section-preview__screenshot', src: previewUrl, alt: (selected ? selected.label : 'KOOPS sekcija') + ' peržiūra' }) : null,
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
        el(TextControl, { label: 'Pagrindinio mygtuko nuoroda', value: a.primaryUrl, onChange: (primaryUrl) => set({ primaryUrl }) }),
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

  // WordPress 7.1 isolates the canvas in an iframe and server-registered dynamic
  // blocks may not render their editor component there. Keep the Gutenberg
  // workspace useful by mounting a visual, clickable view of the same blocks.
  let visualCanvasTimer = 0;
  function renderVisualCanvas() {
    const iframe = document.querySelector('iframe[name="editor-canvas"]');
    const doc = iframe && iframe.contentDocument;
    const blockStore = data.select('core/block-editor');
    if (!doc || !doc.body || !blockStore) return;

    const sectionBlocks = blockStore.getBlocks().filter((block) => block.name === 'koops/section');
    if (!sectionBlocks.length) return;

    const nativeCards = doc.querySelectorAll('.koops-section-preview:not(.koops-visual-card)');
    if (nativeCards.length) {
      const staleCanvas = doc.getElementById('koops-gutenberg-canvas');
      if (staleCanvas) staleCanvas.remove();
      return;
    }

    let style = doc.getElementById('koops-gutenberg-canvas-style');
    if (!style) {
      style = doc.createElement('style');
      style.id = 'koops-gutenberg-canvas-style';
      style.textContent = [
        'body{background:#f1f1ef!important;}',
        '#koops-gutenberg-canvas{box-sizing:border-box;max-width:980px;margin:40px auto;padding:0 24px 80px;display:grid;gap:18px;}',
        '.koops-visual-card{display:block;overflow:hidden;width:100%;padding:0;text-align:left;color:#f8f7f1;background:#10170b;border:2px solid #56604f;border-radius:24px;box-shadow:0 10px 30px rgba(16,23,11,.08);cursor:pointer;}',
        '.koops-visual-card:hover,.koops-visual-card.is-selected{border-color:#f8dc83;box-shadow:0 0 0 3px rgba(248,220,131,.22);}',
        '.koops-visual-card.is-disabled{opacity:.48;}',
        '.koops-visual-card img{display:block;width:100%;height:280px;object-fit:cover;object-position:center;border:0;}',
        '.koops-visual-card__copy{display:grid;grid-template-columns:1fr auto;gap:10px 24px;padding:22px 24px 26px;}',
        '.koops-visual-card__meta{color:#adb3a8;font:600 12px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.08em;text-transform:uppercase;}',
        '.koops-visual-card__state{color:#f8dc83;text-align:right;}',
        '.koops-visual-card h3{grid-column:1/-1;margin:18px 0 0;color:#fff;font:400 clamp(30px,5vw,54px)/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}',
        '.koops-visual-card p{grid-column:1/-1;max-width:680px;margin:4px 0 0;color:#c9cec5;font:400 16px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}',
        '.koops-visual-fields{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:24px;background:#fff;color:#10170b;border-top:1px solid #d7d9d4;cursor:default;}',
        '.koops-visual-field{display:grid;gap:7px;font:600 13px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}',
        '.koops-visual-field.is-wide{grid-column:1/-1;}',
        '.koops-visual-field input,.koops-visual-field textarea,.koops-visual-field select{box-sizing:border-box;width:100%;padding:10px 12px;color:#10170b;background:#fff;border:1px solid #8b9087;border-radius:8px;font:400 15px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}',
        '.koops-visual-toggle{grid-column:1/-1;display:flex;align-items:center;gap:9px;font:600 14px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}',
        '.koops-visual-toggle input{width:18px;height:18px;}',
        '.koops-visual-help{grid-column:1/-1;margin:0!important;padding:12px 14px;color:#475044!important;background:#edf3ea;border-radius:10px;font-size:13px!important;}',
        '@media(max-width:600px){#koops-gutenberg-canvas{padding-inline:14px}.koops-visual-card img{height:220px}.koops-visual-card__copy{padding:18px}.koops-visual-card h3{font-size:30px}.koops-visual-fields{grid-template-columns:1fr;padding:18px}.koops-visual-field.is-wide{grid-column:auto}}'
      ].join('');
      doc.head.appendChild(style);
    }

    let canvas = doc.getElementById('koops-gutenberg-canvas');
    if (!canvas) {
      canvas = doc.createElement('div');
      canvas.id = 'koops-gutenberg-canvas';
      doc.body.appendChild(canvas);
    }

    const selectedId = blockStore.getSelectedBlockClientId();
    const signature = JSON.stringify(sectionBlocks.map((block) => [block.clientId, block.attributes, block.clientId === selectedId]));
    if (canvas.dataset.signature === signature) return;
    canvas.dataset.signature = signature;
    canvas.replaceChildren();

    sectionBlocks.forEach((block) => {
      const attributes = block.attributes || {};
      const type = attributes.sectionType || '';
      const section = catalog[type] || {};
      const card = doc.createElement('div');
      card.className = 'koops-section-preview koops-visual-card'
        + (attributes.enabled === false ? ' is-disabled' : '')
        + (block.clientId === selectedId ? ' is-selected' : '');
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', (section.label || type || 'KOOPS sekcija') + ' — redaguoti');

      if (type) {
        const image = doc.createElement('img');
        image.src = previewBase + type + '.jpg?ver=' + encodeURIComponent(previewVersion);
        image.alt = (section.label || type) + ' peržiūra';
        card.appendChild(image);
      }

      const copy = doc.createElement('span');
      copy.className = 'koops-visual-card__copy';
      const meta = doc.createElement('span');
      meta.className = 'koops-visual-card__meta';
      meta.textContent = section.label || type || 'KOOPS sekcija';
      const state = doc.createElement('strong');
      state.className = 'koops-visual-card__meta koops-visual-card__state';
      state.textContent = attributes.enabled === false ? 'Išjungta' : 'Rodoma';
      const heading = doc.createElement('h3');
      heading.textContent = attributes.title || section.label || 'KOOPS sekcija';
      const description = doc.createElement('p');
      description.textContent = attributes.description || 'Paspauskite sekciją — turinio laukai atsidarys dešinėje.';
      copy.append(meta, state, heading, description);
      card.appendChild(copy);

      if (block.clientId === selectedId) {
        const fields = doc.createElement('div');
        fields.className = 'koops-visual-fields';
        fields.addEventListener('click', (event) => event.stopPropagation());

        const help = doc.createElement('p');
        help.className = 'koops-visual-help';
        help.textContent = 'Keiskite tik reikalingus laukus. Išsaugokite puslapį viršuje esančiu mygtuku.';
        fields.appendChild(help);

        const toggleLabel = doc.createElement('label');
        toggleLabel.className = 'koops-visual-toggle';
        const toggle = doc.createElement('input');
        toggle.type = 'checkbox';
        toggle.checked = attributes.enabled !== false;
        toggle.addEventListener('change', () => data.dispatch('core/block-editor').updateBlockAttributes(block.clientId, { enabled: toggle.checked }));
        const toggleText = doc.createElement('span');
        toggleText.textContent = 'Rodyti svetainėje';
        toggleLabel.append(toggle, toggleText);
        fields.appendChild(toggleLabel);

        function addField(labelText, key, tag, wide) {
          const label = doc.createElement('label');
          label.className = 'koops-visual-field' + (wide ? ' is-wide' : '');
          const labelTitle = doc.createElement('span');
          labelTitle.textContent = labelText;
          const input = doc.createElement(tag || 'input');
          if (tag === 'textarea') input.rows = key === 'description' ? 4 : 3;
          input.value = attributes[key] || '';
          input.addEventListener('change', () => {
            const update = {};
            update[key] = input.value;
            data.dispatch('core/block-editor').updateBlockAttributes(block.clientId, update);
          });
          label.append(labelTitle, input);
          fields.appendChild(label);
        }

        const typeLabel = doc.createElement('label');
        typeLabel.className = 'koops-visual-field is-wide';
        const typeTitle = doc.createElement('span');
        typeTitle.textContent = 'Sekcijos tipas';
        const typeSelect = doc.createElement('select');
        Object.entries(catalog).forEach(([value, item]) => {
          const option = doc.createElement('option');
          option.value = value;
          option.textContent = item.label;
          option.selected = value === type;
          typeSelect.appendChild(option);
        });
        typeSelect.addEventListener('change', () => {
          data.dispatch('core/block-editor').updateBlockAttributes(
            block.clientId,
            Object.assign({ sectionType: typeSelect.value }, defaults[typeSelect.value] || {})
          );
        });
        typeLabel.append(typeTitle, typeSelect);
        fields.appendChild(typeLabel);

        addField('Mažoji antraštė', 'eyebrow', 'input', false);
        addField('Antraštė', 'title', 'textarea', true);
        addField('Aprašymas', 'description', 'textarea', true);
        addField('Mygtuko tekstas', 'primaryLabel', 'input', false);
        addField('Mygtuko nuoroda', 'primaryUrl', 'input', false);
        addField('Nuotraukos adresas', 'imageUrl', 'input', true);
        card.appendChild(fields);
      }

      function selectCard(event) {
        if (event.target.closest('.koops-visual-fields')) return;
        data.dispatch('core/block-editor').selectBlock(block.clientId);
        const editPost = data.dispatch('core/edit-post');
        if (editPost && editPost.openGeneralSidebar) editPost.openGeneralSidebar('edit-post/block');
      }
      card.addEventListener('click', selectCard);
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') selectCard(event);
      });
      canvas.appendChild(card);
    });
  }

  function scheduleVisualCanvas() {
    window.clearTimeout(visualCanvasTimer);
    visualCanvasTimer = window.setTimeout(renderVisualCanvas, 80);
  }

  data.subscribe(scheduleVisualCanvas);
  window.setInterval(scheduleVisualCanvas, 1000);
  scheduleVisualCanvas();
})(window.wp);
