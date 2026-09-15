(function registerKoopsEntrySidebar(wp) {
  if (!wp || !wp.plugins || !wp.element || !wp.components || !wp.data) return;

  const Panel =
    (wp.editor && wp.editor.PluginDocumentSettingPanel) ||
    (wp.editPost && wp.editPost.PluginDocumentSettingPanel);
  if (!Panel) return;

  const el = wp.element.createElement;
  const { Button, CheckboxControl, SelectControl, TextControl, TextareaControl } = wp.components;
  const { useDispatch, useSelect } = wp.data;
  const MediaUpload = wp.blockEditor && wp.blockEditor.MediaUpload;
  const MediaUploadCheck = wp.blockEditor && wp.blockEditor.MediaUploadCheck;
  const config = window.koopsEntrySidebar || {};
  const schema = config.schema || {};
  const taxonomies = config.taxonomies || {};
  const titles = config.titles || {};

  function boolValue(value) {
    return value === true || value === 1 || value === '1';
  }

  const fieldBox = {
    display: 'block',
    boxSizing: 'border-box',
    width: '100%',
    margin: '0 0 22px',
    padding: '0 0 22px',
    borderBottom: '1px solid #dcdcde',
    fontFamily: 'Arial, Helvetica, sans-serif',
    letterSpacing: '0',
    wordSpacing: '0.16em'
  };

  function wrapField(key, child) {
    return el('div', { key: key, className: 'koops-entry-field', style: fieldBox }, child);
  }

  function ensureSidebarStyles() {
    if (document.getElementById('koops-entry-field-gap')) return;
    const style = document.createElement('style');
    style.id = 'koops-entry-field-gap';
    style.textContent = [
      '.koops-entry-sidebar{display:flex!important;flex-direction:column!important;gap:0!important;}',
      '.koops-entry-field{display:block!important;margin:0 0 22px!important;padding:0 0 22px!important;border-bottom:1px solid #dcdcde!important;}',
      '.koops-entry-sidebar,.koops-entry-sidebar *,.koops-entry-field,.koops-entry-field *{font-family:Arial,Helvetica,sans-serif!important;letter-spacing:0!important;word-spacing:.16em!important;}'
    ].join('');
    document.head.appendChild(style);
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

  function KoopsUrlField(props) {
    const openPicker = function openPicker() {
      if (window.koopsOpenWpLink) {
        window.koopsOpenWpLink(props.value || '', props.onChange);
        return;
      }
      const next = window.prompt(props.label, props.value || '');
      if (next !== null) props.onChange(next);
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
          props.value
            ? el('a', {
                href: props.value,
                title: props.value,
                onClick: function (event) {
                  event.preventDefault();
                }
              }, previewLinkLabel(props.value))
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

  function KoopsFeaturedImage(props) {
    const featuredId = useSelect(function (select) {
      return select('core/editor').getEditedPostAttribute('featured_media') || 0;
    }, []);
    const media = useSelect(
      function (select) {
        return featuredId ? select('core').getMedia(featuredId) : null;
      },
      [featuredId]
    );
    const { editPost } = useDispatch('core/editor');
    const preview =
      (media &&
        media.media_details &&
        media.media_details.sizes &&
        (media.media_details.sizes.medium || media.media_details.sizes.thumbnail) &&
        (media.media_details.sizes.medium || media.media_details.sizes.thumbnail).source_url) ||
      (media && media.source_url) ||
      '';

    if (!MediaUpload || !MediaUploadCheck) return null;

    return el(
      MediaUploadCheck,
      null,
      el(MediaUpload, {
        onSelect: function (item) {
          editPost({ featured_media: item && item.id ? item.id : 0 });
        },
        allowedTypes: ['image'],
        value: featuredId,
        render: function (args) {
          return el(
            'div',
            { className: 'koops-media-control' },
            el('span', { className: 'koops-media-control__label' }, props.label || 'Nuotrauka'),
            preview
              ? el('div', { className: 'koops-media-control__previews' }, el('img', { src: preview, alt: '' }))
              : el('div', { className: 'koops-media-control__empty' }, 'Nuotrauka nepasirinkta'),
            el(
              'div',
              { className: 'koops-media-control__actions' },
              el(Button, { variant: 'secondary', onClick: args.open }, featuredId ? 'Keisti nuotrauką' : 'Įkelti nuotrauką'),
              featuredId
                ? el(
                    Button,
                    {
                      variant: 'tertiary',
                      isDestructive: true,
                      onClick: function () {
                        editPost({ featured_media: 0 });
                      }
                    },
                    'Pašalinti'
                  )
                : null
            )
          );
        }
      })
    );
  }

  function KoopsTaxonomyField(props) {
    const terms = useSelect(
      function (select) {
        return select('core').getEntityRecords('taxonomy', props.taxonomy, { per_page: -1 }) || [];
      },
      [props.taxonomy]
    );
    const selected = useSelect(
      function (select) {
        return select('core/editor').getEditedPostAttribute(props.taxonomy) || [];
      },
      [props.taxonomy]
    );
    const { editPost } = useDispatch('core/editor');
    const current = Array.isArray(selected) && selected.length ? String(selected[0]) : '';

    return el(SelectControl, {
      label: props.label,
      value: current,
      options: [{ label: 'Pasirinkite', value: '' }].concat(
        terms.map(function (term) {
          return { label: term.name, value: String(term.id) };
        })
      ),
      onChange: function (value) {
        editPost({ [props.taxonomy]: value ? [parseInt(value, 10)] : [] });
      }
    });
  }

  function KoopsEntryFields() {
    const postType = useSelect(function (select) {
      return select('core/editor').getCurrentPostType();
    }, []);
    const fields = schema[postType] || {};
    const meta = useSelect(function (select) {
      const current = select('core/editor').getEditedPostAttribute('meta') || {};
      const pdfId = parseInt(current.koops_pdf_id, 10) || 0;
      if (pdfId) select('core').getMedia(pdfId);
      String(current.koops_page_ids || '').split(',').forEach(function (id) {
        const num = parseInt(id, 10);
        if (num) select('core').getMedia(num);
      });
      return current;
    }, []);
    const { editPost } = useDispatch('core/editor');
    const taxonomy = taxonomies[postType];

    wp.element.useEffect(
      function () {
        ensureSidebarStyles();
        const editor = wp.data.dispatch('core/edit-post');
        if (!editor || !editor.removeEditorPanel) return;
        [
          'featured-image',
          'taxonomy-panel-koops_store_area',
          'taxonomy-panel-koops_classified_category',
          'taxonomy-panel-category',
          'discussion-panel',
          'meta-panel'
        ].forEach(function (panel) {
          try {
            editor.removeEditorPanel(panel);
          } catch (error) {}
        });
        if (postType === 'koops_store') {
          try {
            editor.removeEditorPanel('post-excerpt');
          } catch (error) {}
        }
      },
      [postType]
    );

    function updateMeta(key, value) {
      editPost({ meta: Object.assign({}, meta, { [key]: value }) });
    }

    return el(
      'div',
      {
        className: 'koops-entry-sidebar',
        style: {
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Arial, Helvetica, sans-serif'
        }
      },
      postType === 'koops_store'
        ? wrapField('hint', el('p', { className: 'koops-entry-sidebar__hint', style: { margin: 0 } }, 'Nuotrauka, teritorija ir kontaktai — visi šiame skydelyje.'))
        : null,
      postType === 'koops_flyer'
        ? wrapField('hint', el('p', { className: 'koops-entry-sidebar__hint', style: { margin: 0 } }, 'Įkelkite PDF ir išsaugokite — puslapiai taps nuotraukomis. Tada galerijoje galite išimti nereikalingus puslapius arba pakeisti eiliškumą.'))
        : null,
      wrapField('photo', el(KoopsFeaturedImage, { label: postType === 'koops_flyer' ? 'Viršelis' : 'Nuotrauka' })),
      taxonomy
        ? wrapField('taxonomy', el(KoopsTaxonomyField, { taxonomy: taxonomy.name, label: taxonomy.label }))
        : null,
      Object.keys(fields).map(function (key) {
        const field = fields[key];
        const value = meta[key];
        if (field.type === 'checkbox') {
          return wrapField(key, el(CheckboxControl, {
            label: field.label,
            checked: boolValue(value),
            onChange: function (next) {
              updateMeta(key, next);
            }
          }));
        }
        if (field.type === 'textarea') {
          return wrapField(key, el(TextareaControl, {
            label: field.label,
            value: value == null ? '' : String(value),
            rows: 3,
            onChange: function (next) {
              updateMeta(key, next);
            }
          }));
        }
        if (field.type === 'select') {
          return wrapField(key, el(SelectControl, {
            label: field.label,
            value: value == null ? '' : String(value),
            options: Object.keys(field.options || {}).map(function (option) {
              return { label: field.options[option], value: option };
            }),
            onChange: function (next) {
              updateMeta(key, next);
            }
          }));
        }
        if (field.type === 'url') {
          return wrapField(key, el(KoopsUrlField, {
            label: field.label,
            value: value == null ? '' : String(value),
            onChange: function (next) {
              updateMeta(key, next);
            }
          }));
        }
        if (field.type === 'file') {
          const fileId = parseInt(value, 10) || 0;
          const fileMedia = fileId ? wp.data.select('core').getMedia(fileId) : null;
          return wrapField(key, el(
            'div',
            { className: 'koops-media-control' },
            el('span', { className: 'koops-media-control__label' }, field.label),
            fileMedia
              ? el('p', { className: 'koops-media-filename' }, fileMedia.title || fileMedia.source_url || 'PDF')
              : el('div', { className: 'koops-media-control__empty' }, 'PDF nepasirinktas'),
            el(
              'div',
              { className: 'koops-media-control__actions' },
              el(Button, {
                variant: 'secondary',
                onClick: function () {
                  if (!wp.media) return;
                  const frame = wp.media({
                    title: 'Pasirinkti PDF',
                    library: { type: 'application/pdf' },
                    button: { text: 'Naudoti PDF' },
                    multiple: false
                  });
                  frame.on('select', function () {
                    const file = frame.state().get('selection').first().toJSON();
                    updateMeta(key, file && file.id ? file.id : 0);
                  });
                  frame.open();
                }
              }, fileId ? 'Keisti PDF' : 'Įkelti PDF'),
              fileId
                ? el(Button, {
                    variant: 'link',
                    isDestructive: true,
                    onClick: function () {
                      updateMeta(key, 0);
                    }
                  }, 'Pašalinti')
                : null
            )
          ));
        }
        if (field.type === 'gallery_ids') {
          const ids = String(value || '')
            .split(',')
            .map(function (id) { return parseInt(id, 10) || 0; })
            .filter(Boolean);
          const thumbs = ids.map(function (id) {
            const media = wp.data.select('core').getMedia(id);
            const sizes = media && media.media_details && media.media_details.sizes;
            return (sizes && sizes.thumbnail && sizes.thumbnail.source_url) || (media && media.source_url) || '';
          }).filter(Boolean);
          return wrapField(key, el(
            'div',
            { className: 'koops-media-control' },
            el('span', { className: 'koops-media-control__label' }, 'Puslapiai svetainėje'),
            thumbs.length
              ? el(
                  'div',
                  { className: 'koops-media-control__previews is-gallery' },
                  thumbs.slice(0, 8).map(function (url, index) {
                    return el('img', { src: url, alt: '', key: url + '-' + index });
                  })
                )
              : el('div', { className: 'koops-media-control__empty' }, 'Įkėlus PDF ir išsaugojus, puslapiai atsiras čia.'),
            el('p', { className: 'koops-entry-sidebar__hint' }, ids.length ? ids.length + ' puslapiai. Galite pašalinti nereikalingus arba pakeisti eiliškumą.' : 'Jei PDF nesugeneruoja puslapių, įkelkite nuotraukas rankiniu būdu.'),
            el(
              'div',
              { className: 'koops-media-control__actions' },
              el(Button, {
                variant: 'secondary',
                onClick: function () {
                  if (!wp.media) return;
                  function save(selection) {
                    const items = typeof selection.toJSON === 'function'
                      ? selection.toJSON()
                      : selection.map(function (model) { return model.toJSON ? model.toJSON() : model; });
                    updateMeta(key, items.map(function (item) { return item.id; }).filter(Boolean).join(','));
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
                }
              }, ids.length ? 'Redaguoti puslapius' : 'Įkelti puslapius rankiniu būdu')
            )
          ));
        }
        return wrapField(key, el(TextControl, {
          label: field.label,
          type: field.type === 'number' ? 'number' : field.type === 'email' || field.type === 'date' ? field.type : 'text',
          step: field.step || undefined,
          value: value == null ? '' : String(value),
          onChange: function (next) {
            updateMeta(key, field.type === 'number' ? (next === '' ? '' : Number(next)) : next);
          }
        }));
      })
    );
  }

  wp.plugins.registerPlugin('koops-entry-sidebar', {
    render: function renderKoopsEntrySidebar() {
      const postType = wp.data.select('core/editor').getCurrentPostType();
      if (!schema[postType]) return null;
      return el(
        Panel,
        {
          name: 'koops-entry-fields',
          className: 'koops-entry-sidebar-panel',
          title: titles[postType] || 'KOOPS duomenys'
        },
        el(KoopsEntryFields)
      );
    }
  });

  function FlyerCanvasGuide() {
    const postType = useSelect(function (select) {
      return select('core/editor').getCurrentPostType();
    }, []);

    wp.element.useEffect(function () {
      if (postType !== 'koops_flyer') return undefined;
      const card = document.createElement('div');
      card.className = 'koops-flyer-guide';
      card.innerHTML = '<h2>Kaip įkelti leidinį</h2><ol><li>Dešinėje <strong>Leidinio duomenys</strong> įkelkite PDF.</li><li>Nustatykite datas ir viršelį.</li><li>Išsaugokite — puslapiai taps nuotraukomis.</li><li>Jei reikia, „Puslapiai“ galerijoje išimkite nereikalingus arba pakeiskite eiliškumą.</li></ol>';
      const host = document.querySelector('.editor-visual-editor, .edit-post-visual-editor');
      if (host) host.prepend(card);
      return function () {
        card.remove();
      };
    }, [postType]);

    return null;
  }

  wp.plugins.registerPlugin('koops-flyer-guide', {
    render: function () {
      return el(FlyerCanvasGuide);
    }
  });
})(window.wp);
