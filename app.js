const GITHUB_BASE = 'https://raw.githubusercontent.com/mikewithoutthemechanics/VASKO-SYSTEM/main/';
const CACHE_KEY = 'vasko-cache-v1';

const SECTIONS = [
  { id: '01-BRAND', name: 'Brand', icon: '🎯' },
  { id: '02-PRICING', name: 'Pricing', icon: '💰' },
  { id: '03-SALES', name: 'Sales', icon: '🤝' },
  { id: '04-OUTREACH', name: 'Outreach', icon: '📣' },
  { id: '05-PROPOSALS', name: 'Proposals', icon: '📄' },
  { id: '06-NURTURE', name: 'Nurture', icon: '💧' },
  { id: '07-WEBSITE', name: 'Website', icon: '🌐' },
  { id: '08-ONBOARDING', name: 'Onboarding', icon: '🚀' },
  { id: '09-RETENTION', name: 'Retention', icon: '🔄' },
  { id: '10-GROWTH', name: 'Growth', icon: '📈' },
  { id: '11-LEGAL', name: 'Legal', icon: '⚖️' },
  { id: '12-FINANCE', name: 'Finance', icon: '📊' },
  { id: '13-OPERATIONS', name: 'Operations', icon: '⚙️' },
  { id: '14-MARKET-DATA', name: 'Market Data', icon: '📰' }
];

let currentFiles = [];
let currentPath = '';

async function loadFiles(sectionId) {
  currentPath = sectionId;
  const url = `${GITHUB_BASE}${sectionId}/`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load section');
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const links = Array.from(doc.querySelectorAll('a'))
      .map(a => a.getAttribute('href'))
      .filter(href => href && href.endsWith('.md') && !href.includes('../'));
    currentFiles = links.map(href => ({
      name: href.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      path: href
    }));
    renderFiles();
  } catch (err) {
    showError(err.message);
  }
}

async function loadFile(path) {
  const url = `${GITHUB_BASE}${path}`;
  try {
    const cached = localStorage.getItem(`vasko:${path}`);
    if (cached) {
      renderMarkdown(cached);
      return;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load file');
    const text = await response.text();
    localStorage.setItem(`vasko:${path}`, text);
    renderMarkdown(text);
  } catch (err) {
    showError(err.message);
  }
}

function renderMarkdown(text) {
  const html = simpleMarkdown(text);
  document.getElementById('content').innerHTML = html;
  document.getElementById('content').classList.add('loaded');
}

function simpleMarkdown(text) {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html.replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>');

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  html = html.replace(/^```[\s\S]*?```/gm, (match) => {
    const code = match.replace(/^```\w*\n?/, '').replace(/```$/, '');
    return `<pre><code>${code}</code></pre>`;
  });

  html = html.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');

  html = html.replace(/^\s*>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^---$/gm, '<hr>');

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  html = html.split('\n\n').map(p => {
    if (p.trim() && !p.startsWith('<') && !p.startsWith('```') && !p.startsWith('*') && !p.startsWith('-') && !p.startsWith('>') && !p.startsWith('---')) {
      return `<p>${p}</p>`;
    }
    return p;
  }).join('\n\n');

  return html;
}

function renderFiles() {
  const container = document.getElementById('file-list');
  container.innerHTML = currentFiles.map(f => `
    <button class="file-item" onclick="loadFile('${f.path}')">
      <span class="file-icon">📄</span>
      <span class="file-name">${f.name}</span>
    </button>
  `).join('');
}

function showError(message) {
  document.getElementById('content').innerHTML = `<div class="error"><h2>Error</h2><p>${message}</p></div>`;
}

function renderSidebar() {
  const container = document.getElementById('section-list');
  container.innerHTML = SECTIONS.map(s => `
    <button class="section-item" onclick="loadFiles('${s.id}')" data-section="${s.id}">
      <span class="section-icon">${s.icon}</span>
      <span class="section-name">${s.name}</span>
    </button>
  `).join('');
}

function init() {
  renderSidebar();
  loadFiles(SECTIONS[0].id);

  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const topbarTitle = document.getElementById('topbar-title');
  const fileListHeader = document.getElementById('file-list-header');

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  });

  document.getElementById('content').addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
    }
  });

  const originalLoadFiles = loadFiles;
  window.loadFiles = async function(sectionId) {
    const section = SECTIONS.find(s => s.id === sectionId);
    if (section) {
      topbarTitle.textContent = section.name;
      fileListHeader.textContent = `${section.name} Files`;
    }
    await originalLoadFiles(sectionId);
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
