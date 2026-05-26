/* ============================================================
   Guia da Net
   Vanilla JS router + renderers.
   Loads articles.json manifest and renders home / category / article / search.
   ============================================================ */
(function () {
  'use strict';

  var scriptUrl = new URL(document.currentScript.src);
  var basePath = scriptUrl.pathname.replace(/assets\/app\.js.*$/, '');
  if (!basePath.endsWith('/')) basePath += '/';

  var app = document.querySelector('[data-app]');
  var drawer = document.querySelector('[data-drawer]');
  var drawerScrim = document.querySelector('[data-drawer-scrim]');
  var drawerNav = document.querySelector('[data-drawer-nav]');
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var backToTop = document.querySelector('[data-back-to-top]');
  var toast = document.querySelector('[data-toast]');

  var manifest = null;
  var toastTimer = null;

  // ----------------------------------------------------------
  // Utils
  // ----------------------------------------------------------
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function normalizePath(path) {
    var clean = decodeURIComponent(path || '/').split('#')[0];
    clean = clean.replace(/\/(index|404)\.html$/, '/');
    clean = clean.replace(/\/{2,}/g, '/');
    if (!clean.startsWith('/')) clean = '/' + clean;
    if (clean.length > 1 && clean.endsWith('/')) clean = clean.slice(0, -1);
    return clean;
  }

  function currentPath() {
    var params = new URLSearchParams(window.location.search);
    var redirected = params.get('p');
    if (redirected) {
      var redirectedUrl = new URL(redirected, window.location.origin);
      var internal = normalizePath(redirectedUrl.pathname);
      window.history.replaceState({}, '', hrefFor(internal) + redirectedUrl.search + redirectedUrl.hash);
      return internal;
    }
    var path = normalizePath(window.location.pathname);
    if (basePath !== '/' && path.startsWith(basePath.slice(0, -1))) {
      path = normalizePath(path.slice(basePath.length - 1));
    }
    return path;
  }

  function hrefFor(path, query) {
    var normalized = normalizePath(path);
    var prefix = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    return prefix + (normalized === '/' ? '/' : normalized) + (query || '');
  }

  function contentUrl(path) {
    return new URL('../' + path.replace(/^\/+/, ''), scriptUrl).href;
  }

  function formatDate(date) {
    if (!date) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC'
    }).format(new Date(date + 'T12:00:00Z'));
  }

  function formatDateShort(date) {
    if (!date) return '';
    var d = new Date(date + 'T12:00:00Z');
    var months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
    return d.getUTCDate() + ' de ' + months[d.getUTCMonth()];
  }

  function sortArticles(a, b) {
    return String(b.publishedAt).localeCompare(String(a.publishedAt));
  }

  function categoryBySlug(slug) {
    return manifest.categories.find(function (c) { return c.slug === slug; });
  }
  function articleByPath(category, slug) {
    return manifest.articles.find(function (a) { return a.category === category && a.slug === slug; });
  }
  function articlesByCategory(slug) {
    return manifest.articles.filter(function (a) { return a.category === slug; }).sort(sortArticles);
  }
  function iconFor(article) {
    return article.icon || (categoryBySlug(article.category) || {}).icon || 'article';
  }
  function tintFor(article) {
    return article.tint || (categoryBySlug(article.category) || {}).tint || 'sage';
  }
  function articlePath(article) {
    return '/' + article.category + '/' + article.slug;
  }

  function setDocumentMeta(title, description, path) {
    document.title = title + ' | Guia da Net';
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description || 'Guia simples sobre internet residencial.');
    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = new URL(hrefFor(path), window.location.origin).href;
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2400);
  }

  // ----------------------------------------------------------
  // Partials
  // ----------------------------------------------------------
  function searchForm(query) {
    return [
      '<form class="search" data-search-form role="search">',
        '<label class="visually-hidden" for="site-search">Buscar artigos</label>',
        '<input id="site-search" name="q" type="search" value="', esc(query || ''), '" placeholder="Buscar por Wi-Fi, IPTV, velocidade...">',
        '<button class="search-btn" type="submit" aria-label="Buscar">',
          '<i class="ph ph-magnifying-glass"></i>',
        '</button>',
      '</form>'
    ].join('');
  }

  function topicStrip(currentSlug) {
    return [
      '<div class="topic-strip" aria-label="Categorias principais">',
      manifest.categories.map(function (c) {
        return '<a href="' + hrefFor('/' + c.slug) + '" data-link' + (c.slug === currentSlug ? ' aria-current="page"' : '') + '>' + esc(c.shortName || c.name) + '</a>';
      }).join(''),
      '</div>'
    ].join('');
  }

  function featureCard(article) {
    var category = categoryBySlug(article.category);
    var tint = tintFor(article);
    var mediaHtml = article.image
      ? '<img src="' + esc(contentUrl(article.image)) + '" alt="' + esc(article.title) + '">'
      : '<i class="ph-light ph-' + iconFor(article) + '"></i>';
    return [
      '<a class="feature" href="', hrefFor(articlePath(article)), '" data-link>',
        '<div class="feature-img tint-', tint, '">',
          '<span class="cat-badge">', esc(category.shortName || category.name), '</span>',
          mediaHtml,
        '</div>',
        '<div class="feature-body">',
          '<h3>', esc(article.title), '</h3>',
          '<p>', esc(article.description), '</p>',
          '<div class="feature-meta">',
            '<span>', article.minutes || 3, ' min de leitura</span>',
            '<span class="dot"></span>',
            '<span>', formatDateShort(article.publishedAt), '</span>',
          '</div>',
        '</div>',
      '</a>'
    ].join('');
  }

  function articleCard(article) {
    var category = categoryBySlug(article.category);
    var tint = tintFor(article);
    var mediaHtml = article.image
      ? '<img src="' + esc(contentUrl(article.image)) + '" alt="' + esc(article.title) + '">'
      : '<i class="ph-light ph-' + iconFor(article) + '"></i>';
    return [
      '<a class="article-card" href="', hrefFor(articlePath(article)), '" data-link>',
        '<div class="img tint-', tint, '">',
          mediaHtml,
        '</div>',
        '<div class="body">',
          '<span class="cat">', esc(category.shortName || category.name), '</span>',
          '<h4>', esc(article.title), '</h4>',
        '</div>',
      '</a>'
    ].join('');
  }

  function recentRow(article) {
    var category = categoryBySlug(article.category);
    var tint = tintFor(article);
    var mediaHtml = article.image
      ? '<img src="' + esc(contentUrl(article.image)) + '" alt="' + esc(article.title) + '">'
      : '<i class="ph-light ph-' + iconFor(article) + '"></i>';
    return [
      '<a class="recent-row" href="', hrefFor(articlePath(article)), '" data-link>',
        '<span class="thumb tint-', tint, '">', mediaHtml, '</span>',
        '<div class="text">',
          '<span class="cat">', esc(category.shortName || category.name), '</span>',
          '<h4>', esc(article.title), '</h4>',
          '<span class="date">', formatDateShort(article.publishedAt), ' · ', article.minutes || 3, ' min</span>',
        '</div>',
      '</a>'
    ].join('');
  }

  function articleRow(article) {
    var category = categoryBySlug(article.category);
    var tint = tintFor(article);
    var mediaHtml = article.image
      ? '<img src="' + esc(contentUrl(article.image)) + '" alt="' + esc(article.title) + '">'
      : '<i class="ph-light ph-' + iconFor(article) + '"></i>';
    return [
      '<a class="article-row" href="', hrefFor(articlePath(article)), '" data-link>',
        '<div class="img tint-', tint, '">',
          mediaHtml,
        '</div>',
        '<div class="body">',
          '<span class="cat">', esc(category.shortName || category.name), '</span>',
          '<h3>', esc(article.title), '</h3>',
          '<p>', esc(article.description), '</p>',
          '<span class="meta">', formatDateShort(article.publishedAt), ' · ', article.minutes || 3, ' min de leitura</span>',
        '</div>',
      '</a>'
    ].join('');
  }

  // ----------------------------------------------------------
  // HOME
  // ----------------------------------------------------------
  function renderHome() {
    setDocumentMeta(
      'Guia simples para usar melhor sua conexão',
      'Conteúdos curtos sobre Wi-Fi, roteador, IPTV, cabo de rede e velocidade da internet residencial.',
      '/'
    );

    var quickSlugs = [
      { cat: 'wifi', slug: 'como-reiniciar-o-roteador', label: 'Como reiniciar o roteador do jeito certo' },
      { cat: 'iptv', slug: 'o-que-e-iptv', label: 'IPTV travando ou com imagem lenta?' },
      { cat: 'cabo-de-rede', slug: 'cabo-ou-wifi-quando-usar-cada-um', label: 'Cabo ou Wi-Fi: qual usar na minha TV ou game?' },
      { cat: 'velocidade', slug: 'como-fazer-teste-de-velocidade', label: 'Como fazer um teste de velocidade confiável' }
    ];

    var html = [
      '<section class="route">',
        '<div class="intro" style="padding-bottom: 12px;">',
          '<p class="kicker">suporte rápido</p>',
          '<h1 class="display">Como podemos <em>ajudar você</em> hoje?</h1>',
          '<p class="lede">Respostas rápidas e simples para fazer sua internet funcionar melhor.</p>',
          searchForm(''),
          
          '<span class="quick-links-title">Dúvidas Frequentes</span>',
          '<div class="quick-links">',
            quickSlugs.map(function(item) {
              var art = articleByPath(item.cat, item.slug);
              if (!art) return '';
              return [
                '<a class="quick-link-chip" href="', hrefFor(articlePath(art)), '" data-link>',
                  '<span class="text">', esc(item.label), '</span>',
                  '<i class="ph ph-caret-right"></i>',
                '</a>'
              ].join('');
            }).join(''),
          '</div>',
        '</div>',

        '<section class="section" style="margin-top:16px">',
          '<div class="section-head" style="padding-top:12px; padding-bottom:12px;">',
            '<h2>Navegar por <em>assunto</em></h2>',
          '</div>',
          '<nav class="cats-grid" aria-label="Categorias">',
            manifest.categories.map(function (c) {
              return [
                '<a class="cat-card" href="' + hrefFor('/' + c.slug) + '" data-link>',
                  '<span class="cat-icon tint-' + (c.tint || 'sage') + '"><i class="ph ph-' + c.icon + '"></i></span>',
                  '<strong>' + esc(c.shortName || c.name) + '</strong>',
                '</a>'
              ].join('');
            }).join(''),
          '</nav>',
        '</section>',

        '<section class="section" style="margin-top:24px">',
          '<div class="note">',
            '<span class="label">do suporte</span>',
            '<p>Antes de abrir um chamado, dê uma olhada nos guias acima. Quase todos os problemas comuns de Wi-Fi e TV têm soluções simples que você mesmo pode resolver em um minuto.</p>',
          '</div>',
        '</section>',
      '</section>'
    ].join('');

    app.innerHTML = html;
  }

  // ----------------------------------------------------------
  // CATEGORY
  // ----------------------------------------------------------
  function renderCategory(slug) {
    var category = categoryBySlug(slug);
    if (!category) return renderNotFound();

    var articles = articlesByCategory(slug);
    setDocumentMeta(category.name, category.description, '/' + slug);

    var html = [
      '<section class="route">',
        '<div class="page-title">',
          '<p class="kicker terra">categoria</p>',
          '<h1 class="display">', esc(category.name), '</h1>',
          '<p class="lede">', esc(category.description), '</p>',
          '<div class="meta-bar">',
            '<strong>', articles.length, '</strong>',
            '<span>', articles.length === 1 ? 'artigo publicado' : 'artigos publicados', '</span>',
            '<span class="dot"></span>',
            '<span>atualizado em ', formatDateShort(manifest.articles.map(function(a){return a.publishedAt;}).sort().reverse()[0]), '</span>',
          '</div>',
        '</div>',

        articles.length
          ? '<section class="section"><div class="article-list">' + articles.map(articleRow).join('') + '</div></section>'
          : '<section class="section"><div class="empty-state"><i class="ph ph-folder-simple-dashed"></i><h3>Nenhum artigo publicado ainda</h3><p>Os primeiros conteúdos desta categoria aparecem aqui assim que forem publicados.</p></div></section>',

        '<section class="section" style="margin-top:36px">',
          '<div class="section-head"><h2>Outras <em>categorias</em></h2></div>',
          '<nav class="cats" aria-label="Outras categorias">',
            manifest.categories.filter(function(c){return c.slug !== slug}).slice(0,4).map(function (c) {
              return [
                '<a class="cat-row" href="' + hrefFor('/' + c.slug) + '" data-link>',
                  '<span class="cat-icon tint-' + (c.tint || 'sage') + '"><i class="ph ph-' + c.icon + '"></i></span>',
                  '<div class="cat-text">',
                    '<strong>' + esc(c.name) + '</strong>',
                    '<small>' + esc(c.description) + '</small>',
                  '</div>',
                  '<span class="cat-chev"><i class="ph ph-caret-right"></i></span>',
                '</a>'
              ].join('');
            }).join(''),
          '</nav>',
        '</section>',
      '</section>'
    ].join('');

    app.innerHTML = html;
  }

  // ----------------------------------------------------------
  // ARTICLE
  // ----------------------------------------------------------
  async function renderArticle(categorySlug, slug) {
    var article = articleByPath(categorySlug, slug);
    if (!article) return renderNotFound();

    var category = categoryBySlug(article.category);
    var tint = tintFor(article);

    // Render shell first with loading state for content
    app.innerHTML = '<section class="route"><div class="loading"><div class="spinner"></div><p>Carregando artigo…</p></div></section>';

    var response;
    try {
      response = await fetch(contentUrl(article.contentPath));
      if (!response.ok) throw new Error('not found');
    } catch (e) {
      app.innerHTML = '<section class="route"><div class="empty-state"><i class="ph ph-warning"></i><h3>Conteúdo não encontrado</h3><p>O arquivo do artigo não pôde ser carregado.</p></div></section>';
      return;
    }

    var content = await response.text();
    var url = new URL(hrefFor(articlePath(article)), window.location.origin).href;
    setDocumentMeta(article.title, article.description, articlePath(article));

    // Related: 2 articles in same category, then fill from latest
    var related = articlesByCategory(article.category).filter(function (a) { return a.slug !== article.slug; }).slice(0, 2);
    if (related.length < 2) {
      var more = manifest.articles.filter(function (a) {
        return a.id !== article.id && !related.find(function (r) { return r.id === a.id; });
      }).sort(sortArticles);
      while (related.length < 2 && more.length) related.push(more.shift());
    }

    app.innerHTML = [
      '<article class="article-page route">',
        '<div class="article-cover tint-', tint, '">',
          '<span class="cat-badge">', esc(category.shortName || category.name), '</span>',
          article.image ? '<img src="' + esc(contentUrl(article.image)) + '" alt="' + esc(article.title) + '">' : '<i class="ph-light ph-' + iconFor(article) + '"></i>',
        '</div>',
        '<div class="article-shell">',
          '<header class="article-header">',
            '<div class="article-meta">',
              '<span class="pill"><i class="ph ph-folder-simple"></i>', esc(category.name), '</span>',
              '<span class="dot"></span>',
              '<time datetime="', esc(article.publishedAt), '">', formatDate(article.publishedAt), '</time>',
              '<span class="dot"></span>',
              '<span>', article.minutes || 3, ' min de leitura</span>',
            '</div>',
            '<h1>', esc(article.title), '</h1>',
            '<p class="lede">', esc(article.description), '</p>',
          '</header>',

          '<div class="share-bar">',
            '<a class="share-btn primary" href="https://wa.me/?text=', encodeURIComponent(article.title + ' — ' + url), '" target="_blank" rel="noopener">',
              '<i class="ph ph-whatsapp-logo"></i>WhatsApp',
            '</a>',
            '<button class="share-btn" type="button" data-copy-link="', esc(url), '">',
              '<i class="ph ph-link"></i>Copiar link',
            '</button>',
          '</div>',

          '<div class="article-content">', content, '</div>',

          related.length ? [
            '<footer class="article-footer">',
              '<div class="label">leia também</div>',
              '<div class="related">',
                related.map(function (a) {
                  return '<a href="' + hrefFor(articlePath(a)) + '" data-link>' + esc(a.title) + '<i class="ph ph-arrow-up-right"></i></a>';
                }).join(''),
              '</div>',
            '</footer>'
          ].join('') : '',

        '</div>',
      '</article>'
    ].join('');
  }

  // ----------------------------------------------------------
  // SEARCH
  // ----------------------------------------------------------
  function scoreArticle(article, query) {
    var category = categoryBySlug(article.category) || {};
    var haystack = [article.title, article.description, (article.keywords || []).join(' '), category.name].join(' ').toLowerCase();
    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return terms.reduce(function (score, term) {
      return score + (haystack.indexOf(term) >= 0 ? 1 : 0);
    }, 0);
  }

  function renderSearch() {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var results = query
      ? manifest.articles
          .map(function (a) { return { article: a, score: scoreArticle(a, query) }; })
          .filter(function (i) { return i.score > 0; })
          .sort(function (a, b) { return b.score - a.score || sortArticles(a.article, b.article); })
          .map(function (i) { return i.article; })
      : manifest.articles.slice().sort(sortArticles);

    setDocumentMeta('Busca', 'Busque artigos sobre internet residencial.', '/buscar');

    var html = [
      '<section class="route">',
        '<div class="page-title">',
          '<p class="kicker">busca</p>',
          '<h1 class="display">Encontre uma <em>explicação</em> rápida.</h1>',
          '<p class="lede">Digite uma palavra do problema, do aparelho ou do termo que apareceu no atendimento.</p>',
          searchForm(query),
          topicStrip(),
        '</div>',

        '<section class="section">',
          '<div class="section-head">',
            '<h2>', query ? 'Resultados para <em>"' + esc(query) + '"</em>' : 'Todos os <em>artigos</em>', '</h2>',
            '<span class="more">', results.length, ' ', results.length === 1 ? 'artigo' : 'artigos', '</span>',
          '</div>',
          results.length
            ? '<div class="article-list">' + results.map(articleRow).join('') + '</div>'
            : '<div class="empty-state"><i class="ph ph-magnifying-glass"></i><h3>Nada por aqui</h3><p>Tente outra palavra-chave, ou abra uma das categorias.</p></div>',
        '</section>',
      '</section>'
    ].join('');

    app.innerHTML = html;
    var input = app.querySelector('input[type="search"]');
    if (input && !query) input.focus();
  }

  // ----------------------------------------------------------
  // NOT FOUND
  // ----------------------------------------------------------
  function renderNotFound() {
    setDocumentMeta('Página não encontrada', 'O conteúdo solicitado não foi encontrado.', currentPath());
    app.innerHTML = [
      '<section class="route">',
        '<div class="page-title" style="text-align:center;padding-top:56px">',
          '<p class="kicker terra" style="justify-content:center;display:inline-flex">erro 404</p>',
          '<h1 class="display" style="font-size:46px"><em>Não</em> encontramos isso.</h1>',
          '<p class="lede">O endereço pode ter mudado, ou o artigo ainda não foi publicado.</p>',
          '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:8px">',
            '<a class="btn primary" href="' + hrefFor('/') + '" data-link><i class="ph ph-house"></i>Início</a>',
            '<a class="btn" href="' + hrefFor('/buscar') + '" data-link><i class="ph ph-magnifying-glass"></i>Buscar</a>',
          '</div>',
        '</div>',
      '</section>'
    ].join('');
  }

  // ----------------------------------------------------------
  // DRAWER
  // ----------------------------------------------------------
  function renderDrawerNav() {
    var path = currentPath();
    var items = [
      '<div class="drawer-section">Navegação</div>',
      '<a class="drawer-link' + (path === '/' ? '" aria-current="page' : '') + '" href="' + hrefFor('/') + '" data-link><span class="ico"><i class="ph ph-house"></i></span>Início</a>',
      '<a class="drawer-link' + (path === '/buscar' ? '" aria-current="page' : '') + '" href="' + hrefFor('/buscar') + '" data-link><span class="ico"><i class="ph ph-magnifying-glass"></i></span>Buscar</a>',
      '<div class="drawer-section">Categorias</div>'
    ];
    manifest.categories.forEach(function (c) {
      var isCurrent = path === '/' + c.slug;
      items.push(
        '<a class="drawer-link' + (isCurrent ? '" aria-current="page' : '') + '" href="' + hrefFor('/' + c.slug) + '" data-link>' +
          '<span class="ico"><i class="ph ph-' + c.icon + '"></i></span>' +
          esc(c.name) +
        '</a>'
      );
    });
    drawerNav.innerHTML = items.join('');
  }

  function openDrawer() {
    drawer.classList.add('is-open');
    drawerScrim.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawerScrim.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // ----------------------------------------------------------
  // ROUTER
  // ----------------------------------------------------------
  async function renderRoute() {
    try {
      var path = currentPath();
      window.scrollTo({ top: 0, behavior: 'auto' });

      if (path === '/') renderHome();
      else if (path === '/buscar') renderSearch();
      else {
        var parts = path.split('/').filter(Boolean);
        if (parts.length === 1) renderCategory(parts[0]);
        else if (parts.length >= 2) await renderArticle(parts[0], parts[1]);
        else renderNotFound();
      }
      renderDrawerNav();
    } catch (err) {
      console.error(err);
      app.innerHTML = '<section class="empty-state"><i class="ph ph-warning"></i><h3>Erro ao carregar</h3><p>Tente recarregar a página.</p></section>';
    }
  }

  function navigate(url) {
    window.history.pushState({}, '', url);
    closeDrawer();
    renderRoute();
  }

  // ----------------------------------------------------------
  // EVENTS
  // ----------------------------------------------------------
  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-menu-toggle]')) {
      drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
      return;
    }
    if (event.target.closest('[data-menu-close]') || event.target.closest('[data-drawer-scrim]')) {
      closeDrawer();
      return;
    }
    if (event.target.closest('[data-search-toggle]')) {
      navigate(hrefFor('/buscar'));
      return;
    }
    if (event.target.closest('[data-back-to-top]')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    var copy = event.target.closest('[data-copy-link]');
    if (copy) {
      var text = copy.getAttribute('data-copy-link');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () { showToast('Link copiado.'); })
          .catch(function () { showToast('Não foi possível copiar.'); });
      } else {
        showToast('Copie manualmente: ' + text);
      }
      return;
    }
    var link = event.target.closest('a[data-link]');
    if (!link) return;
    var target = new URL(link.href, window.location.origin);
    if (target.origin !== window.location.origin) return;
    event.preventDefault();
    navigate(target.pathname + target.search + target.hash);
  });

  document.addEventListener('submit', function (event) {
    var form = event.target.closest('[data-search-form]');
    if (!form) return;
    event.preventDefault();
    var data = new FormData(form);
    var query = String(data.get('q') || '').trim();
    navigate(hrefFor('/buscar', query ? '?q=' + encodeURIComponent(query) : ''));
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });

  window.addEventListener('popstate', renderRoute);

  window.addEventListener('scroll', function () {
    backToTop.classList.toggle('is-visible', window.scrollY > 560);
  }, { passive: true });

  // ----------------------------------------------------------
  // BOOT
  // ----------------------------------------------------------
  fetch(contentUrl('content/articles.json'))
    .then(function (r) {
      if (!r.ok) throw new Error('manifest missing');
      return r.json();
    })
    .then(function (data) {
      manifest = data;
      renderRoute();
    })
    .catch(function (err) {
      console.error(err);
      app.innerHTML = '<section class="empty-state"><i class="ph ph-warning"></i><h3>Conteúdo indisponível</h3><p>Não foi possível ler o manifesto de artigos.</p></section>';
    });
})();
