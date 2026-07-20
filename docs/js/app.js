/**
 * DemonLord docs — markdown loader, TOC, mermaid, scroll spy
 */
(function () {
  'use strict';

  const BASE = document.body.dataset.base || '.';

  /* ── Mobile sidebar ── */
  const toggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  function closeSidebar() {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('open');
  }

  toggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
    overlay?.classList.toggle('open');
  });

  overlay?.addEventListener('click', closeSidebar);

  /* ── Slug helper ── */
  function slugify(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  /* ── Build TOC from headings ── */
  function buildToc(container, tocEl) {
    if (!container || !tocEl) return;

    const headings = container.querySelectorAll('h2, h3');
    if (!headings.length) return;

    const ul = document.createElement('ul');
    ul.className = 'toc';

    headings.forEach((h) => {
      if (!h.id) h.id = slugify(h.textContent);
      const li = document.createElement('li');
      if (h.tagName === 'H3') li.className = 'toc-h3';

      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent.replace(/^[\d.]+\s*/, '');
      a.addEventListener('click', () => {
        if (window.innerWidth <= 900) closeSidebar();
      });

      li.appendChild(a);
      ul.appendChild(li);
    });

    tocEl.appendChild(ul);
    initScrollSpy(ul);
  }

  /* ── Scroll spy ── */
  function initScrollSpy(toc) {
    const links = toc.querySelectorAll('a');
    const ids = Array.from(links).map((a) => a.getAttribute('href').slice(1));
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove('active'));
            const active = toc.querySelector(`a[href="#${entry.target.id}"]`);
            active?.classList.add('active');
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ── Configure marked ── */
  function setupMarked() {
    if (typeof marked === 'undefined') return;

    marked.setOptions({ gfm: true, breaks: false });

    marked.use({
      renderer: {
        code({ text, lang }) {
          if (lang === 'mermaid') {
            return `<div class="mermaid">${escapeHtml(text)}</div>`;
          }
          return `<pre><code class="language-${lang || ''}">${escapeHtml(text)}</code></pre>`;
        },
      },
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Load markdown page ── */
  async function loadDoc(mdPath, contentEl, tocEl) {
    if (!contentEl) return;

    try {
      const res = await fetch(mdPath);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let md = await res.text();

      // Strip first H1 (page title rendered separately)
      md = md.replace(/^#\s+.+\n+/, '');

      setupMarked();
      contentEl.innerHTML = marked.parse(md);
      contentEl.classList.remove('loading');

      buildToc(contentEl, tocEl);

      if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#161412',
            primaryTextColor: '#ece8e1',
            primaryBorderColor: '#c4674a',
            lineColor: '#7a746a',
            secondaryColor: '#1a1814',
            tertiaryColor: '#0c0b0a',
            fontFamily: 'DM Sans, sans-serif',
          },
        });
        await mermaid.run({ nodes: contentEl.querySelectorAll('.mermaid') });
      }
    } catch (err) {
      contentEl.innerHTML = `
        <div class="example-box">
          <p><strong>Erro ao carregar o documento.</strong></p>
          <p>${escapeHtml(err.message)}</p>
          <p>Abra via servidor local ou GitHub Pages.</p>
        </div>`;
      contentEl.classList.remove('loading');
    }
  }

  /* ── Init doc pages ── */
  const docType = document.body.dataset.doc;
  if (docType) {
    const contentEl = document.getElementById('doc-content');
    const tocEl = document.getElementById('toc');
    const mdFile = docType === 'gdd' ? 'content/gdd.md' : 'content/rulebook.md';
    loadDoc(`${BASE}/${mdFile}`.replace(/\/\.\//, '/'), contentEl, tocEl);
  }

  /* ── Highlight active nav ── */
  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll('.nav-main a').forEach((a) => {
      if (a.dataset.page === page) a.classList.add('active');
    });
  }
})();
