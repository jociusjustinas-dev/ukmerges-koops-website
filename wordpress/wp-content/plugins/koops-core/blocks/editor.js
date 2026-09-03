(function registerKoopsSectionEditor(wp) {
  if (!wp || !wp.blocks || !wp.blockEditor || !wp.components || !wp.data || !wp.element || !wp.hooks || !wp.plugins) return;

  const { blocks, blockEditor, components, data, element, hooks, plugins } = wp;
  const el = element.createElement;
  const { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } = blockEditor;
  const { PanelBody, SelectControl, TextControl, TextareaControl, ToggleControl, Button, Notice } = components;
  const catalog = (window.koopsSectionEditor && window.koopsSectionEditor.catalog) || {};
  const options = [{ label: 'Pasirinkite sekciją', value: '' }].concat(
    Object.entries(catalog).map(([value, item]) => ({ label: item.label, value }))
  );

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
            onChange: (sectionType) => set({ sectionType })
          })
        ),
        el(
          PanelBody,
          { title: 'Turinys', initialOpen: true },
          el(Notice, { status: 'info', isDismissible: false }, 'Tuščias laukas palieka dabartinį dizaino tekstą.'),
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
        a.imageUrl ? el('img', { src: a.imageUrl, alt: '' }) : null,
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
          onChange: (sectionType) => set({ sectionType })
        })
      ),
      el(
        PanelBody,
        { title: 'Turinys', initialOpen: true },
        el(Notice, { status: 'info', isDismissible: false }, 'Tuščias laukas palieka dabartinį dizaino tekstą.'),
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
})(window.wp);
