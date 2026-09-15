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
      return select('core/editor').getEditedPostAttribute('meta') || {};
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
          'discussion-panel'
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
        if (field.type === 'file' && MediaUpload && MediaUploadCheck) {
          const fileId = parseInt(value, 10) || 0;
          const fileMedia = wp.data.select('core').getMedia(fileId);
          return wrapField(key, el(MediaUploadCheck, null, el(MediaUpload, {
            allowedTypes: ['application/pdf'],
            value: fileId,
            onSelect: function (item) {
              updateMeta(key, item && item.id ? item.id : 0);
            },
            render: function (args) {
              return el(
                'div',
                { className: 'koops-media-control' },
                el('span', { className: 'koops-media-control__label' }, field.label),
                fileMedia
                  ? el('p', { style: { margin: '8px 0' } }, fileMedia.title || fileMedia.source_url || 'PDF')
                  : el('div', { className: 'koops-media-control__empty' }, 'PDF nepasirinktas'),
                el(
                  'div',
                  { className: 'koops-media-control__actions' },
                  el(Button, { variant: 'secondary', onClick: args.open }, fileId ? 'Keisti PDF' : 'Įkelti PDF'),
                  fileId
                    ? el(Button, {
                        variant: 'tertiary',
                        isDestructive: true,
                        onClick: function () {
                          updateMeta(key, 0);
                        }
                      }, 'Pašalinti')
                    : null
                )
              );
            }
          })));
        }
        if (field.type === 'gallery_ids' && MediaUpload && MediaUploadCheck) {
          const ids = String(value || '')
            .split(',')
            .map(function (id) { return parseInt(id, 10) || 0; })
            .filter(Boolean);
          return wrapField(key, el(MediaUploadCheck, null, el(MediaUpload, {
            allowedTypes: ['image'],
            multiple: true,
            gallery: true,
            value: ids,
            onSelect: function (items) {
              const next = (Array.isArray(items) ? items : [items])
                .map(function (item) { return item && item.id ? item.id : 0; })
                .filter(Boolean);
              updateMeta(key, next.join(','));
            },
            render: function (args) {
              return el(
                'div',
                { className: 'koops-media-control' },
                el('span', { className: 'koops-media-control__label' }, field.label),
                el('p', { style: { margin: '8px 0' } }, ids.length ? ids.length + ' puslapiai' : 'Puslapiai nepasirinkti — įkėlus PDF jie sugeneruojami automatiškai, jei serveryje yra Imagick.'),
                el(
                  'div',
                  { className: 'koops-media-control__actions' },
                  el(Button, { variant: 'secondary', onClick: args.open }, ids.length ? 'Keisti puslapius' : 'Įkelti puslapius')
                )
              );
            }
          })));
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
})(window.wp);
