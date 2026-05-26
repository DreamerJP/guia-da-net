/* ============================================================
   Editor JS — Guia da Net
   Ported from B with manifest schema updates (icon/tint/minutes).
   ============================================================ */
(function () {
  'use strict';

  var categories = {
    'wifi': { name: 'Wi-Fi e Roteador', icon: 'wifi-high', tint: 'sage' },
    'cabo-de-rede': { name: 'Cabo de Rede', icon: 'plugs-connected', tint: 'terra' },
    'iptv': { name: 'IPTV', icon: 'television-simple', tint: 'cream' },
    'velocidade': { name: 'Velocidade e Qualidade', icon: 'gauge', tint: 'stone' },
    'dispositivos': { name: 'Dispositivos', icon: 'devices', tint: 'sage' },
    'glossario': { name: 'Glossário', icon: 'book-open-text', tint: 'cream' }
  };

  var state = {
    articleHandle: null,
    manifestHandle: null,
    manifest: null,
    articleFileName: ''
  };

  var $ = function (sel) { return document.querySelector(sel); };
  var titleInput = $('#article-title');
  var categoryInput = $('#article-category');
  var dateInput = $('#article-date');
  var slugInput = $('#article-slug');
  var descriptionInput = $('#article-description');
  var minutesInput = $('#article-minutes');
  var iconInput = $('#article-icon');
  var keywordsInput = $('#article-keywords');
  var editor = $('#article-content');
  var articleFileInput = $('#article-file');
  var manifestFileInput = $('#manifest-file');
  var articleStatus = $('[data-article-status]');
  var manifestStatus = $('[data-manifest-status]');
  var manifestList = $('[data-manifest-list]');
  var toast = $('[data-toast]');

  var toastTimer = null;

  function setArticleStatus(msg) { articleStatus.textContent = msg || ''; }
  function setManifestStatus(msg) { manifestStatus.textContent = msg || ''; }
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2200);
  }

  function today() { return new Date().toISOString().slice(0, 10); }

  function slugify(value) {
    return String(value || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function downloadFile(name, content, type) {
    var blob = new Blob([content], { type: type || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  async function writeHandle(handle, content) {
    var writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
  }
  async function pickOpenFile(desc, accept) {
    if (!window.showOpenFilePicker) return null;
    var handles = await window.showOpenFilePicker({ multiple: false, types: [{ description: desc, accept: accept }] });
    return handles[0] || null;
  }
  async function pickSaveFile(suggestedName, desc, accept) {
    if (!window.showSaveFilePicker) return null;
    return await window.showSaveFilePicker({ suggestedName: suggestedName, types: [{ description: desc, accept: accept }] });
  }

  function readFile(input) {
    return new Promise(function (resolve, reject) {
      var file = input.files && input.files[0];
      if (!file) return resolve(null);
      var reader = new FileReader();
      reader.onload = function () { resolve({ name: file.name, text: String(reader.result || '') }); };
      reader.onerror = reject;
      reader.readAsText(file, 'utf-8');
    });
  }

  function extractEditableHtml(text) {
    var doc = new DOMParser().parseFromString(text, 'text/html');
    var content = doc.querySelector('.article-content') || doc.querySelector('article') || doc.body;
    return content ? content.innerHTML.trim() : text.trim();
  }

  function getArticleHtml() {
    var clone = editor.cloneNode(true);
    clone.querySelectorAll('[contenteditable]').forEach(function (n) { n.removeAttribute('contenteditable'); });
    clone.querySelectorAll('[style]').forEach(function (n) { n.removeAttribute('style'); });
    return clone.innerHTML.trim() + '\n';
  }

  function buildArticleEntry() {
    var category = categoryInput.value;
    var slug = slugify(slugInput.value || titleInput.value);
    var cat = categories[category] || {};
    return {
      id: category + '-' + slug,
      category: category,
      slug: slug,
      title: titleInput.value.trim() || 'Novo artigo',
      description: descriptionInput.value.trim(),
      publishedAt: dateInput.value || today(),
      minutes: parseInt(minutesInput.value, 10) || 3,
      keywords: keywordsInput.value.split(',').map(function (i) { return i.trim(); }).filter(Boolean),
      featured: false,
      featuredRank: 99,
      icon: (iconInput.value || '').trim() || cat.icon,
      tint: cat.tint || 'sage',
      contentPath: 'content/articles/' + category + '/' + slug + '.html'
    };
  }

  function applyEntry(entry) {
    titleInput.value = entry.title || '';
    categoryInput.value = entry.category || 'wifi';
    dateInput.value = entry.publishedAt || today();
    slugInput.value = entry.slug || '';
    descriptionInput.value = entry.description || '';
    minutesInput.value = entry.minutes || '';
    iconInput.value = entry.icon || '';
    keywordsInput.value = (entry.keywords || []).join(', ');
  }

  function newArticle() {
    state.articleHandle = null;
    state.articleFileName = '';
    titleInput.value = '';
    categoryInput.value = 'wifi';
    dateInput.value = today();
    slugInput.value = '';
    descriptionInput.value = '';
    minutesInput.value = 3;
    iconInput.value = categories.wifi.icon;
    keywordsInput.value = '';
    editor.innerHTML = '<h2>Escreva o título da primeira seção aqui</h2><p>Use a barra acima para formatar.</p>';
    setArticleStatus('Novo artigo iniciado.');
  }

  async function openArticleWithHandle(handle) {
    var file = await handle.getFile();
    var text = await file.text();
    state.articleHandle = handle;
    state.articleFileName = file.name;
    editor.innerHTML = extractEditableHtml(text);
    if (!slugInput.value) slugInput.value = slugify(file.name.replace(/\.html?$/i, ''));
    setArticleStatus('Arquivo aberto: ' + file.name);
  }

  async function openArticle() {
    try {
      var handle = await pickOpenFile('Artigo HTML', { 'text/html': ['.html'] });
      if (handle) return await openArticleWithHandle(handle);
      articleFileInput.value = '';
      articleFileInput.click();
    } catch (err) {
      if (err && err.name !== 'AbortError') setArticleStatus('Não foi possível abrir o artigo.');
    }
  }

  async function saveArticle(useExisting) {
    var entry = buildArticleEntry();
    var html = getArticleHtml();
    var fileName = entry.slug + '.html';
    slugInput.value = entry.slug;
    try {
      if (useExisting && state.articleHandle) {
        await writeHandle(state.articleHandle, html);
        setArticleStatus('Artigo salvo no arquivo aberto.');
        showToast('Salvo.');
        return;
      }
      var handle = await pickSaveFile(fileName, 'Artigo HTML', { 'text/html': ['.html'] });
      if (handle) {
        await writeHandle(handle, html);
        state.articleHandle = handle;
        state.articleFileName = fileName;
        setArticleStatus('Artigo salvo.');
        showToast('Salvo.');
        return;
      }
      downloadFile(fileName, html, 'text/html;charset=utf-8');
      setArticleStatus('Arquivo baixado: ' + fileName + '. Coloque em content/articles/' + entry.category + '/');
      showToast('Arquivo baixado.');
    } catch (err) {
      if (err && err.name !== 'AbortError') setArticleStatus('Não foi possível salvar o artigo.');
    }
  }

  // FORMATTING
  function applyBlockFormat(tagName) {
    document.execCommand('formatBlock', false, tagName);
  }
  function insertHtml(html) {
    editor.focus();
    document.execCommand('insertHTML', false, html);
  }
  function youtubeId(value) {
    var match = String(value || '').match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/);
    return match ? match[1] : String(value || '').trim();
  }
  function handleInsert(kind) {
    if (kind === 'callout') {
      insertHtml('<div class="callout"><div class="icon"><i class="ph ph-lightbulb"></i></div><div class="content"><strong>Destaque</strong><p>Escreva aqui a informação principal.</p></div></div><p><br></p>');
    } else if (kind === 'attention') {
      insertHtml('<div class="attention"><div class="icon"><i class="ph ph-warning"></i></div><div class="content"><strong>Atenção</strong><p>Escreva aqui o cuidado importante.</p></div></div><p><br></p>');
    } else if (kind === 'steps') {
      insertHtml('<ol class="steps"><li><strong>Primeiro passo.</strong> Detalhe do que fazer.</li><li><strong>Segundo passo.</strong></li><li><strong>Terceiro passo.</strong></li></ol><p><br></p>');
    } else if (kind === 'image') {
      var path = window.prompt('Caminho da imagem dentro do projeto:', 'assets/illustration-wifi.svg');
      if (!path) return;
      var alt = window.prompt('Texto alternativo da imagem:', '');
      insertHtml('<figure><img src="' + path.replace(/"/g, '&quot;') + '" alt="' + String(alt || '').replace(/"/g, '&quot;') + '"></figure>');
    } else if (kind === 'youtube') {
      var url = window.prompt('URL ou ID do vídeo no YouTube:');
      var id = youtubeId(url);
      if (!id) return;
      insertHtml('<div class="video-embed"><iframe src="https://www.youtube.com/embed/' + id + '" title="Vídeo incorporado" allow="autoplay; encrypted-media" allowfullscreen></iframe></div><p><br></p>');
    } else if (kind === 'hr') {
      insertHtml('<hr><p><br></p>');
    }
  }

  // MANIFEST
  function ensureManifest() {
    if (state.manifest) return state.manifest;
    state.manifest = {
      site: { name: 'Guia da Net', description: 'Conteúdo claro e gratuito para dúvidas comuns de internet residencial.' },
      categories: Object.keys(categories).map(function (slug) {
        return { slug: slug, name: categories[slug].name, description: '', icon: categories[slug].icon, tint: categories[slug].tint };
      }),
      articles: []
    };
    return state.manifest;
  }

  function renderManifest() {
    var data = ensureManifest();
    if (!data.articles.length) {
      manifestList.innerHTML = '<p class="empty-editor-state"><i class="ph ph-folder-simple-dashed"></i>O índice está carregado, mas ainda não tem artigos.</p>';
      return;
    }
    manifestList.innerHTML = data.articles.map(function (article, index) {
      var categoryName = (categories[article.category] || {}).name || article.category;
      return [
        '<div class="manifest-row" data-index="' + index + '">',
          '<div class="manifest-row-title">',
            '<strong>' + escapeHtml(article.title) + '</strong>',
            '<span>' + escapeHtml(categoryName) + ' / ' + escapeHtml(article.slug) + '</span>',
          '</div>',
          '<div class="manifest-controls">',
            '<label><input type="checkbox" data-manifest-field="featured" ' + (article.featured ? 'checked' : '') + '> Destaque</label>',
            '<label>Ordem <input type="number" min="1" step="1" value="' + Number(article.featuredRank || 99) + '" data-manifest-field="featuredRank"></label>',
          '</div>',
        '</div>'
      ].join('');
    }).join('');
  }

  async function openManifestWithHandle(handle) {
    var file = await handle.getFile();
    var text = await file.text();
    try {
      state.manifest = JSON.parse(text);
      state.manifestHandle = handle;
      setManifestStatus('Índice aberto: ' + file.name);
      renderManifest();
    } catch (err) {
      setManifestStatus('Arquivo de índice inválido.');
    }
  }

  async function openManifest() {
    try {
      var handle = await pickOpenFile('Índice JSON', { 'application/json': ['.json'] });
      if (handle) return await openManifestWithHandle(handle);
      manifestFileInput.value = '';
      manifestFileInput.click();
    } catch (err) {
      if (err && err.name !== 'AbortError') setManifestStatus('Não foi possível abrir o índice.');
    }
  }

  function upsertCurrentArticle() {
    var manifest = ensureManifest();
    var entry = buildArticleEntry();
    var idx = manifest.articles.findIndex(function (a) { return a.id === entry.id; });
    if (idx >= 0) {
      // Preserve featured + featuredRank from existing
      entry.featured = manifest.articles[idx].featured;
      entry.featuredRank = manifest.articles[idx].featuredRank;
      manifest.articles[idx] = entry;
      setManifestStatus('Artigo atualizado no índice: ' + entry.title);
    } else {
      manifest.articles.push(entry);
      setManifestStatus('Artigo adicionado ao índice: ' + entry.title);
    }
    renderManifest();
  }

  async function saveManifest() {
    var manifest = ensureManifest();
    syncManifestFromUI();
    var content = JSON.stringify(manifest, null, 2) + '\n';
    try {
      if (state.manifestHandle) {
        await writeHandle(state.manifestHandle, content);
        setManifestStatus('Índice salvo.');
        showToast('Índice salvo.');
        return;
      }
      var handle = await pickSaveFile('articles.json', 'Índice JSON', { 'application/json': ['.json'] });
      if (handle) {
        await writeHandle(handle, content);
        state.manifestHandle = handle;
        setManifestStatus('Índice salvo como articles.json.');
        showToast('Índice salvo.');
        return;
      }
      downloadFile('articles.json', content, 'application/json;charset=utf-8');
      setManifestStatus('Índice baixado. Substitua o arquivo em content/.');
    } catch (err) {
      if (err && err.name !== 'AbortError') setManifestStatus('Não foi possível salvar o índice.');
    }
  }

  function downloadManifest() {
    var manifest = ensureManifest();
    syncManifestFromUI();
    downloadFile('articles.json', JSON.stringify(manifest, null, 2) + '\n', 'application/json;charset=utf-8');
    setManifestStatus('Índice baixado.');
  }

  function syncManifestFromUI() {
    var manifest = ensureManifest();
    manifestList.querySelectorAll('.manifest-row').forEach(function (row) {
      var idx = parseInt(row.getAttribute('data-index'), 10);
      var article = manifest.articles[idx];
      if (!article) return;
      var featured = row.querySelector('[data-manifest-field="featured"]');
      var rank = row.querySelector('[data-manifest-field="featuredRank"]');
      if (featured) article.featured = featured.checked;
      if (rank) article.featuredRank = parseInt(rank.value, 10) || 99;
    });
  }

  // EVENTS
  // Tabs
  document.querySelectorAll('.editor-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var name = tab.getAttribute('data-tab');
      document.querySelectorAll('.editor-tab').forEach(function (t) {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      document.querySelectorAll('.editor-panel').forEach(function (p) {
        var active = p.id === 'panel-' + name;
        p.classList.toggle('is-active', active);
        if (active) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
      });
    });
  });

  // Title -> slug autofill
  titleInput.addEventListener('input', function () {
    if (!slugInput.value || slugInput.dataset.auto) {
      slugInput.value = slugify(titleInput.value);
      slugInput.dataset.auto = '1';
    }
  });
  slugInput.addEventListener('input', function () { delete slugInput.dataset.auto; });

  // Category change -> update default icon
  categoryInput.addEventListener('change', function () {
    var cat = categories[categoryInput.value];
    if (cat && (!iconInput.value || iconInput.dataset.auto)) {
      iconInput.value = cat.icon;
      iconInput.dataset.auto = '1';
    }
  });
  iconInput.addEventListener('input', function () { delete iconInput.dataset.auto; });

  // Toolbar
  document.querySelectorAll('.ed-toolbar button').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      editor.focus();
      var format = btn.getAttribute('data-format');
      var command = btn.getAttribute('data-command');
      var insert = btn.getAttribute('data-insert');
      if (format) {
        if (format === 'blockquote') applyBlockFormat('blockquote');
        else applyBlockFormat(format);
      } else if (command === 'link') {
        var url = window.prompt('URL do link:');
        if (url) document.execCommand('createLink', false, url);
      } else if (command) {
        document.execCommand(command, false, null);
      } else if (insert) {
        handleInsert(insert);
      }
    });
  });

  // Action buttons
  document.querySelector('[data-new-article]').addEventListener('click', newArticle);
  document.querySelector('[data-open-article]').addEventListener('click', openArticle);
  document.querySelector('[data-save-article]').addEventListener('click', function () { saveArticle(true); });
  document.querySelector('[data-save-article-as]').addEventListener('click', function () { saveArticle(false); });
  document.querySelector('[data-open-manifest]').addEventListener('click', openManifest);
  document.querySelector('[data-upsert-current]').addEventListener('click', upsertCurrentArticle);
  document.querySelector('[data-save-manifest]').addEventListener('click', saveManifest);
  document.querySelector('[data-download-manifest]').addEventListener('click', downloadManifest);

  // File inputs fallback
  articleFileInput.addEventListener('change', async function () {
    var result = await readFile(articleFileInput);
    if (!result) return;
    state.articleHandle = null;
    state.articleFileName = result.name;
    editor.innerHTML = extractEditableHtml(result.text);
    if (!slugInput.value) slugInput.value = slugify(result.name.replace(/\.html?$/i, ''));
    setArticleStatus('Arquivo aberto: ' + result.name);
  });
  manifestFileInput.addEventListener('change', async function () {
    var result = await readFile(manifestFileInput);
    if (!result) return;
    try {
      state.manifest = JSON.parse(result.text);
      state.manifestHandle = null;
      setManifestStatus('Índice aberto: ' + result.name);
      renderManifest();
    } catch (err) {
      setManifestStatus('Arquivo inválido.');
    }
  });

  // Boot
  newArticle();
})();
