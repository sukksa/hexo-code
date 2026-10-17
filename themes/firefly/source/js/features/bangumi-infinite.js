(function () {
  'use strict';

  var GRID_SELECTOR = '[data-bangumi-infinite]';

  function init() {
    var grid = document.querySelector(GRID_SELECTOR);
    if (!grid || grid.getAttribute('data-bangumi-init') === '1') return;
    grid.setAttribute('data-bangumi-init', '1');

    var chunkBase = grid.getAttribute('data-chunk-base') || '';
    var totalChunks = parseInt(grid.getAttribute('data-total-chunks'), 10) || 0;
    var nextChunk = parseInt(grid.getAttribute('data-next-chunk'), 10) || 2;
    var sentinel = document.getElementById('bangumi-sentinel');
    var loader = document.getElementById('bangumi-loader');

    if (!chunkBase || !sentinel || nextChunk > totalChunks) return;

    var loading = false;
    var finished = false;
    var observer = null;

    function finish() {
      finished = true;
      if (loader) loader.hidden = true;
      if (sentinel && sentinel.parentNode) sentinel.parentNode.removeChild(sentinel);
      if (observer) observer.disconnect();
    }

    function appendChunk(html) {
      var holder = document.createElement('div');
      holder.innerHTML = html;
      var fragment = document.createDocumentFragment();
      while (holder.firstChild) fragment.appendChild(holder.firstChild);
      grid.appendChild(fragment);
    }

    function load() {
      if (loading || finished || nextChunk > totalChunks) return;
      loading = true;
      if (loader) loader.hidden = false;

      var url = chunkBase + nextChunk + '.html';

      fetch(url, { credentials: 'same-origin' })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.text();
        })
        .then(function (html) {
          appendChunk(html);
          nextChunk += 1;
          loading = false;
          if (loader) loader.hidden = true;
          if (nextChunk > totalChunks) {
            finish();
          } else {
            check();
          }
        })
        .catch(function (err) {
          loading = false;
          if (loader) loader.hidden = true;
          console.warn('[bangumi] 加载更多失败：', err);
        });
    }

    function check() {
      if (finished || !sentinel) return;
      if (sentinel.getBoundingClientRect().top < window.innerHeight + 600) load();
    }

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        function (entries) {
          for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
              load();
              break;
            }
          }
        },
        { rootMargin: '600px 0px' }
      );
      observer.observe(sentinel);
    } else {
      window.addEventListener('scroll', check, { passive: true });
    }

    check();
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('pjax:complete', init);
  if (document.readyState !== 'loading') init();
})();
