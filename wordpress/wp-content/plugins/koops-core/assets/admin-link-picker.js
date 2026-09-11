(function (window, $) {
  if (!$) return;

  var dummyId = 'koops-wplink-dummy';
  var submitHandler = null;

  function frontendOrigin() {
    var url = (window.koopsLinkPicker && window.koopsLinkPicker.frontendUrl) || '';
    return String(url).replace(/\/$/, '');
  }

  function toAbsolute(value) {
    if (!value) return '';
    if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
    if (value.charAt(0) === '#') return (frontendOrigin() || window.location.origin) + '/' + value;
    if (value.charAt(0) === '/') return (frontendOrigin() || window.location.origin) + value;
    return value;
  }

  function toStored(href) {
    if (!href) return '';
    if (href.charAt(0) === '#' || href.charAt(0) === '/') return href;
    try {
      var url = new URL(href, window.location.origin);
      var hosts = {};
      hosts[window.location.host] = true;
      try {
        hosts[new URL(frontendOrigin()).host] = true;
      } catch (error) {}
      if (hosts[url.host]) {
        var path = url.pathname.replace(/\/$/, '') || '/';
        if (path === '/' && (url.hash || url.search)) return url.search + url.hash;
        return path + url.search + url.hash;
      }
    } catch (error) {}
    return href;
  }

  function ensureDummy() {
    var dummy = document.getElementById(dummyId);
    if (!dummy) {
      dummy = document.createElement('input');
      dummy.type = 'hidden';
      dummy.id = dummyId;
      dummy.style.display = 'none';
      document.body.appendChild(dummy);
    }
    return dummy;
  }

  function cleanup() {
    document.body.classList.remove('koops-wplink-open', 'koops-wplink-url-only');
    var submit = document.getElementById('wp-link-submit');
    if (submit && submitHandler) submit.removeEventListener('click', submitHandler, true);
    submitHandler = null;
  }

  window.koopsOpenWpLink = function (currentUrl, onSelect) {
    if (!window.wpLink) return false;

    ensureDummy().value = toAbsolute(currentUrl);
    document.body.classList.add('koops-wplink-open', 'koops-wplink-url-only');
    window.wpLink.open(dummyId);
    var urlInput = document.getElementById('wp-link-url');
    if (urlInput) urlInput.value = toAbsolute(currentUrl);
    var textInput = document.getElementById('wp-link-text');
    if (textInput) textInput.value = '';

    var submit = document.getElementById('wp-link-submit');
    if (submitHandler && submit) submit.removeEventListener('click', submitHandler, true);
    submitHandler = function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      var attrs = window.wpLink.getAttrs ? window.wpLink.getAttrs() : { href: urlInput ? urlInput.value : '' };
      if (typeof onSelect === 'function') onSelect(toStored(attrs.href || ''));
      window.wpLink.close();
      cleanup();
    };
    if (submit) submit.addEventListener('click', submitHandler, true);

    $('#wp-link-cancel, #wp-link-close, #wp-link-backdrop').off('.koopsLink').on('click.koopsLink', function () {
      window.setTimeout(cleanup, 0);
    });
    return true;
  };

  $(document).on('click', '.koops-open-wplink', function (event) {
    event.preventDefault();
    var $button = $(this);
    var target = $button.attr('data-target');
    var $input = target ? $(target) : $button.closest('.koops-url-picker').find('input').first();
    window.koopsOpenWpLink($input.val(), function (url) {
      $input.val(url).trigger('change');
    });
  });
})(window, window.jQuery);
