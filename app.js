const GITHUB_BASE = 'https://raw.githubusercontent.com/mikewithoutthemechanics/VASKO-SYSTEM/master/';
const CONFIG_KEY = 'vasko-config';
const CACHE_KEY = 'vasko-cache-v3';
const BOOKMARKS_KEY = 'vasko-bookmarks';
const THEME_KEY = 'vasko-theme';

const DEFAULT_SECTIONS = [
  { id: '01-BRAND', name: 'Brand', icon: '🎯', desc: 'Identity, positioning, messaging' },
  { id: '02-PRICING', name: 'Pricing', icon: '💰', desc: 'Pricing sheets, terms, strategy' },
  { id: '03-SALES', name: 'Sales', icon: '🤝', desc: 'Scripts, decks, objection handling' },
  { id: '04-OUTREACH', name: 'Outreach', icon: '📣', desc: 'Cold email, LinkedIn, WhatsApp' },
  { id: '05-PROPOSALS', name: 'Proposals', icon: '📄', desc: 'Proposal templates and docs' },
  { id: '06-NURTURE', name: 'Nurture', icon: '💧', desc: 'Email sequences and nurturing' },
  { id: '07-WEBSITE', name: 'Website', icon: '🌐', desc: 'Copy, pages, and FAQs' },
  { id: '08-ONBOARDING', name: 'Onboarding', icon: '🚀', desc: 'Client onboarding workflows' },
  { id: '09-RETENTION', name: 'Retention', icon: '🔄', desc: 'Client retention and escalation' },
  { id: '10-GROWTH', name: 'Growth', icon: '📈', desc: 'Referrals, case studies, demand' },
  { id: '11-LEGAL', name: 'Legal', icon: '⚖️', desc: 'Agreements, privacy, compliance' },
  { id: '12-FINANCE', name: 'Finance', icon: '📊', desc: 'Financials, projections, unit economics' },
  { id: '13-OPERATIONS', name: 'Operations', icon: '⚙️', desc: 'Runbooks, continuity, risk' },
  { id: '14-MARKET-DATA', name: 'Market Data', icon: '📰', desc: 'Industry research and metrics' }
];

const SECTION_FILES = {
  '01-BRAND': ['brand-identity.md','category-positioning.md','messaging-hierarchy.md','voice-and-vocabulary.md','visual-identity-direction.md'],
  '02-PRICING': ['sa-pricing-sheet-zar.md','international-pricing-usd-gbp.md','roi-reference-table.md','payment-terms.md','scope-boundaries.md','pricing-premium-policy.md'],
  '03-SALES': ['sales-deck-version-a-prompt.md','sales-deck-version-b-prompt.md','discovery-call-script-version-a.md','discovery-call-script-version-b.md','objection-handling.md','urgency-mechanisms.md'],
  '04-OUTREACH': ['cold-email-sa-zar.md','cold-email-uk-gbp.md','cold-email-us-usd.md','linkedin-scripts.md','whatsapp-scripts.md','outreach-research-checklist.md'],
  '05-PROPOSALS': ['proposal-core-zar.md','proposal-pro-zar.md','proposal-core-usd.md','proposal-pro-usd.md'],
  '06-NURTURE': ['cold-nurture-sequence-8-emails.md','warm-nurture-post-discovery-4-emails.md','re-engagement-sequence.md'],
  '07-WEBSITE': ['homepage-copy.md','tier-page-prime.md','tier-page-core.md','tier-page-pro.md','tier-page-elite.md','about-page.md','faq-page.md'],
  '08-ONBOARDING': ['welcome-pack.md','onboarding-questionnaire.md','kickoff-call-agenda.md','configuration-documents.md','testing-protocol.md','go-live-protocol.md','hypercare-schedule.md','engagement-protocol.md','staff-adoption-framework.md'],
  '09-RETENTION': ['vasko-pulse-template-sa-zar.md','vasko-pulse-template-international.md','month-4-retention-protocol.md','escalation-protocol.md','cancellation-offboarding.md'],
  '10-GROWTH': ['referral-programme-vasko-network.md','case-study-template.md','linkedin-profile-copy.md','linkedin-content-calendar-90-days.md','demand-generation-plan.md','competitive-moat-strategy.md','adjacent-vertical-expansion.md'],
  '11-LEGAL': ['service-agreement-template.md','data-processing-agreement.md','privacy-policy.md','popia-registration-checklist.md','call-recording-consent.md'],
  '12-FINANCE': ['pre-launch-financial-checklist.md','cash-flow-projection.md','cash-flow-management-rules.md','unit-economics.md','12-month-ramp-plan.md'],
  '13-OPERATIONS': ['founder-incapacity-protocol.md','master-runbook-template.md','backup-operator-agreement.md','dependency-risk-mitigation.md','business-continuity-answer.md','early-adopter-positioning.md'],
  '14-MARKET-DATA': ['industry-research-verified-metrics.md']
};

const DEFAULT_CONFIG = {
  brand: {
    name: 'VASKO',
    tagline: 'Sales & Marketing System',
    productName: 'Sales System',
    accentColor: '#38bdf8',
    icon: '◆'
  },
  sections: DEFAULT_SECTIONS.map(s => s.id),
  pricing: {
    currency: 'ZAR',
    symbol: 'R',
    tiers: [
      { name: 'Core', monthly: 12500, setup: 5000 },
      { name: 'Prime', monthly: 22500, setup: 10000 },
      { name: 'Pro', monthly: 42500, setup: 20000 },
      { name: 'Elite', monthly: 85000, setup: 50000 }
    ]
  },
  repo: {
    owner: 'mikewithoutthemechanics',
    name: 'VASKO-SYSTEM',
    branch: 'master'
  },
  contact: {
    email: '',
    phone: '',
    website: ''
  }
};

let config = loadConfig();
let currentFiles = [];
let currentPath = '';
let currentFile = '';
let searchIndex = [];
let isSearching = false;
let contentEl, loadingStateEl, errorStateEl;

function $(id) { return document.getElementById(id); }

function loadConfig() {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
  } catch {}
  return { ...DEFAULT_CONFIG };
}

function saveConfig(newConfig) {
  config = { ...config, ...newConfig };
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  applyConfig();
}

function applyConfig() {
  document.querySelector('.brand-text').textContent = config.brand.name;
  document.querySelector('.brand-icon').textContent = config.brand.icon;
  document.querySelector('.tagline').textContent = config.brand.tagline;
  document.title = config.brand.name;
  document.querySelector('meta[name="theme-color"]').setAttribute('content', config.brand.accentColor);
}

function getSections() {
  return DEFAULT_SECTIONS.filter(s => config.sections.includes(s.id));
}

function getRepoBase() {
  const r = config.repo;
  return `https://raw.githubusercontent.com/${r.owner}/${r.name}/${r.branch}/`;
}

function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2500);
}

function getBookmarks() {
  try { return JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) || []; }
  catch { return []; }
}

function saveBookmarks(bookmarks) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

function isBookmarked(path) {
  return getBookmarks().includes(path);
}

function toggleBookmark(path) {
  let bookmarks = getBookmarks();
  if (bookmarks.includes(path)) {
    bookmarks = bookmarks.filter(b => b !== path);
    showToast('Bookmark removed');
  } else {
    bookmarks.push(path);
    showToast('Bookmarked');
  }
  saveBookmarks(bookmarks);
  updateBookmarkButton();
}

function updateBookmarkButton() {
  const btn = $('bookmark-btn');
  if (currentFile && isBookmarked(currentFile)) {
    btn.classList.add('bookmarked');
    btn.textContent = '★';
  } else {
    btn.classList.remove('bookmarked');
    btn.textContent = '☆';
  }
}

function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const icon = document.querySelector('.theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
}

async function buildSearchIndex() {
  const index = [];
  const sections = getSections();
  for (const section of sections) {
    const files = SECTION_FILES[section.id] || [];
    for (const file of files) {
      try {
        const url = `${getRepoBase()}${section.id}/${file}`;
        const cached = localStorage.getItem(`vasko:${section.id}/${file}`);
        let content = cached;
        if (!content) {
          const response = await fetch(url);
          if (!response.ok) continue;
          content = await response.text();
          localStorage.setItem(`vasko:${section.id}/${file}`, content);
        }
        const plainText = content
          .replace(/^#{1,6}\s+.+$/gm, '')
          .replace(/\*\*|__/g, '')
          .replace(/\*|_/g, '')
          .replace(/`/g, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/^[-*]\s+/gm, '')
          .replace(/^\d+\.\s+/gm, '')
          .replace(/^>\s+/gm, '')
          .replace(/^---$/gm, '')
          .replace(/\n{2,}/g, ' ')
          .trim();

        if (plainText.length > 10) {
          index.push({
            section: section.name,
            sectionId: section.id,
            path: `${section.id}/${file}`,
            title: file.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            content: plainText.substring(0, 500)
          });
        }
      } catch (e) { continue; }
    }
  }
  searchIndex = index;
  return index;
}

async function searchContent(query) {
  if (!query.trim()) return [];
  if (searchIndex.length === 0) {
    await buildSearchIndex();
  }
  const q = query.toLowerCase();
  return searchIndex
    .filter(item => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const contentMatch = item.content.toLowerCase().includes(q);
      return titleMatch || contentMatch;
    })
    .sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(q);
      const bTitle = b.title.toLowerCase().includes(q);
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      return 0;
    })
    .slice(0, 20);
}

async function loadFiles(sectionId) {
  currentPath = sectionId;
  const files = SECTION_FILES[sectionId] || [];
  currentFiles = files.map(f => ({
    name: f.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    path: `${sectionId}/${f}`
  }));
  renderFiles();
  updateActiveSection(sectionId);
  updateBreadcrumb(null, sectionId);
  $('file-count').textContent = currentFiles.length;
}

async function loadFile(path) {
  currentFile = path;
  const url = `${getRepoBase()}${path}`;
  try {
    loadingStateEl.style.display = 'flex';
    errorStateEl.style.display = 'none';
    contentEl.classList.remove('loaded');

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
  updateBookmarkButton();
  updateActiveFile(path);
}

function renderMarkdown(text) {
  loadingStateEl.style.display = 'none';
  const html = simpleMarkdown(text);
  contentEl.innerHTML = html;
  contentEl.classList.add('loaded');
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

  html = html.replace(/^```([\s\S]*?)```/gm, (match, code) => {
    const lang = match.match(/^```(\w*)/)?.[1] || '';
    return `<pre data-lang="${lang}"><code>${code.replace(/^\w*\n?/, '').replace(/```$/, '')}</code></pre>`;
  });

  html = html.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');

  html = html.replace(/(<li>.*?<\/li>)/gs, (match) => {
    const items = match.match(/<li>.*?<\/li>/gs) || [];
    if (items.length > 0) return `<ul>${items.join('')}</ul>`;
    return match;
  });

  html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');

  html = html.replace(/^\s*>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^---$/gm, '<hr>');

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  const lines = html.split('\n');
  const result = [];
  let inCodeBlock = false;
  let inList = false;
  let listBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('<pre>')) {
      if (listBuffer.length) { result.push(`<ul>${listBuffer.join('')}</ul>`); listBuffer = []; inList = false; }
      result.push(line);
      inCodeBlock = true;
      continue;
    }
    if (line.startsWith('</pre>')) {
      result.push(line);
      inCodeBlock = false;
      continue;
    }
    if (inCodeBlock) {
      result.push(line);
      continue;
    }

    if (line.startsWith('<li>')) {
      listBuffer.push(line);
      inList = true;
      continue;
    }
    if (inList && !line.startsWith('<li>')) {
      result.push(`<ul>${listBuffer.join('')}</ul>`);
      listBuffer = [];
      inList = false;
    }

    if (line.trim() && !line.startsWith('<') && !line.startsWith('```') && !line.startsWith('*') && !line.startsWith('-') && !line.startsWith('>') && !line.startsWith('---')) {
      result.push(`<p>${line}</p>`);
    } else if (line.trim()) {
      result.push(line);
    }
  }

  if (listBuffer.length) result.push(`<ul>${listBuffer.join('')}</ul>`);

  return result.join('\n');
}

function renderFiles(filter = '') {
  const container = $('file-list');
  const filtered = filter
    ? currentFiles.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()))
    : currentFiles;

  container.innerHTML = filtered.map(f => `
    <button class="file-item ${f.path === currentFile ? 'active' : ''}" onclick="loadFile('${f.path}')">
      <span class="file-icon">📄</span>
      <span class="file-name">${f.name}</span>
    </button>
  `).join('');
}

function showError(message) {
  loadingStateEl.style.display = 'none';
  contentEl.innerHTML = '';
  contentEl.appendChild(errorStateEl);
  $('error-message').textContent = message;
  errorStateEl.style.display = 'flex';
  contentEl.classList.add('loaded');
}

function updateActiveSection(sectionId) {
  document.querySelectorAll('.section-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionId);
  });
}

function updateActiveFile(path) {
  document.querySelectorAll('.file-item').forEach(btn => {
    const onclick = btn.getAttribute('onclick') || '';
    btn.classList.toggle('active', onclick.includes(path));
  });
}

function updateBreadcrumb(sectionId, fileName) {
  const bc = $('topbar-breadcrumb');
  const sections = getSections();
  const section = sectionId ? sections.find(s => s.id === sectionId) : sections.find(s => s.id === currentPath);
  if (!section) return;

  let html = `<span class="breadcrumb-item">${section.name}</span>`;
  if (fileName) {
    html += `<span class="breadcrumb-sep">›</span><span class="breadcrumb-item current">${fileName}</span>`;
  }
  bc.innerHTML = html;
}

function renderSidebar() {
  const container = $('section-list');
  const sections = getSections();
  container.innerHTML = sections.map(s => `
    <button class="section-item" onclick="loadFiles('${s.id}')" data-section="${s.id}" title="${s.desc}">
      <span class="section-icon">${s.icon}</span>
      <span class="section-name">${s.name}</span>
    </button>
  `).join('');
}

async function openSearch() {
  const modal = $('search-modal');
  const input = $('modal-search-input');
  modal.classList.add('open');
  input.value = '';
  $('search-results').innerHTML = '<div class="search-empty">Start typing to search...</div>';
  input.focus();

  if (searchIndex.length === 0) {
    $('search-results').innerHTML = '<div class="search-empty">Building search index...</div>';
    await buildSearchIndex();
  }
}

function closeSearch() {
  $('search-modal').classList.remove('open');
}

async function performSearch(query) {
  const resultsContainer = $('search-results');
  if (!query.trim()) {
    resultsContainer.innerHTML = '<div class="search-empty">Start typing to search...</div>';
    return;
  }

  const results = await searchContent(query);
  if (results.length === 0) {
    resultsContainer.innerHTML = '<div class="search-empty">No results found</div>';
    return;
  }

  resultsContainer.innerHTML = results.map(r => `
    <button class="search-result-item" onclick="navigateToResult('${r.sectionId}', '${r.path}')">
      <span class="search-result-title">${r.section} › ${r.title}</span>
      <span class="search-result-context">${r.content.substring(0, 120)}...</span>
    </button>
  `).join('');
}

async function navigateToResult(sectionId, path) {
  closeSearch();
  await loadFiles(sectionId);
  setTimeout(() => loadFile(path), 100);
}

function openConfig() {
  const modal = $('config-modal');
  const nameInput = $('config-brand-name');
  const taglineInput = $('config-tagline');
  const productInput = $('config-product-name');
  const accentInput = $('config-accent-color');
  const iconInput = $('config-icon');
  const currencyInput = $('config-currency');
  const symbolInput = $('config-symbol');
  const repoOwnerInput = $('config-repo-owner');
  const repoNameInput = $('config-repo-name');
  const repoBranchInput = $('config-repo-branch');
  const emailInput = $('config-email');
  const phoneInput = $('config-phone');
  const websiteInput = $('config-website');

  if (nameInput) nameInput.value = config.brand.name;
  if (taglineInput) taglineInput.value = config.brand.tagline;
  if (productInput) productInput.value = config.brand.productName;
  if (accentInput) accentInput.value = config.brand.accentColor;
  if (iconInput) iconInput.value = config.brand.icon;
  if (currencyInput) currencyInput.value = config.pricing.currency;
  if (symbolInput) symbolInput.value = config.pricing.symbol;
  if (repoOwnerInput) repoOwnerInput.value = config.repo.owner;
  if (repoNameInput) repoNameInput.value = config.repo.name;
  if (repoBranchInput) repoBranchInput.value = config.repo.branch;
  if (emailInput) emailInput.value = config.contact.email;
  if (phoneInput) phoneInput.value = config.contact.phone;
  if (websiteInput) websiteInput.value = config.contact.website;

  renderConfigSections();
  renderConfigPricing();

  modal.classList.add('open');
}

function closeConfig() {
  $('config-modal').classList.remove('open');
}

function renderConfigSections() {
  const container = $('config-sections-list');
  if (!container) return;
  container.innerHTML = DEFAULT_SECTIONS.map(s => `
    <label class="config-checkbox">
      <input type="checkbox" value="${s.id}" ${config.sections.includes(s.id) ? 'checked' : ''}>
      <span>${s.icon} ${s.name}</span>
    </label>
  `).join('');
}

function renderConfigPricing() {
  const container = $('config-pricing-list');
  if (!container) return;
  container.innerHTML = config.pricing.tiers.map((tier, i) => `
    <div class="config-pricing-tier">
      <input type="text" class="config-tier-name" data-index="${i}" value="${tier.name}" placeholder="Tier name">
      <input type="number" class="config-tier-monthly" data-index="${i}" value="${tier.monthly}" placeholder="Monthly">
      <input type="number" class="config-tier-setup" data-index="${i}" value="${tier.setup}" placeholder="Setup">
      <button class="config-remove-tier" data-index="${i}" ${config.pricing.tiers.length <= 1 ? 'disabled' : ''}>×</button>
    </div>
  `).join('');

  container.querySelectorAll('.config-remove-tier').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      if (config.pricing.tiers.length > 1) {
        config.pricing.tiers.splice(idx, 1);
        renderConfigPricing();
      }
    });
  });
}

function saveConfigFromModal() {
  const name = $('config-brand-name')?.value || config.brand.name;
  const tagline = $('config-tagline')?.value || config.brand.tagline;
  const productName = $('config-product-name')?.value || config.brand.productName;
  const accentColor = $('config-accent-color')?.value || config.brand.accentColor;
  const icon = $('config-icon')?.value || config.brand.icon;
  const currency = $('config-currency')?.value || config.pricing.currency;
  const symbol = $('config-symbol')?.value || config.pricing.symbol;
  const repoOwner = $('config-repo-owner')?.value || config.repo.owner;
  const repoName = $('config-repo-name')?.value || config.repo.name;
  const repoBranch = $('config-repo-branch')?.value || config.repo.branch;
  const email = $('config-email')?.value || config.contact.email;
  const phone = $('config-phone')?.value || config.contact.phone;
  const website = $('config-website')?.value || config.contact.website;

  const sectionCheckboxes = document.querySelectorAll('#config-sections-list input[type="checkbox"]');
  const sections = Array.from(sectionCheckboxes).filter(cb => cb.checked).map(cb => cb.value);

  const tierNames = document.querySelectorAll('.config-tier-name');
  const tierMonthlies = document.querySelectorAll('.config-tier-monthly');
  const tierSetups = document.querySelectorAll('.config-tier-setup');
  const tiers = [];
  tierNames.forEach((el, i) => {
    tiers.push({
      name: el.value || `Tier ${i+1}`,
      monthly: parseInt(tierMonthlies[i]?.value) || 0,
      setup: parseInt(tierSetups[i]?.value) || 0
    });
  });

  saveConfig({
    brand: { name, tagline, productName, accentColor, icon },
    sections: sections.length ? sections : config.sections,
    pricing: { currency, symbol, tiers },
    repo: { owner: repoOwner, name: repoName, branch: repoBranch },
    contact: { email, phone, website }
  });

  closeConfig();
  showToast('Configuration saved');
  renderSidebar();
  loadFiles(getSections()[0]?.id || '01-BRAND');
}

function addConfigTier() {
  config.pricing.tiers.push({ name: `Tier ${config.pricing.tiers.length + 1}`, monthly: 0, setup: 0 });
  renderConfigPricing();
}

function exportConfig() {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${config.brand.name.toLowerCase().replace(/\s+/g, '-')}-config.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Config exported');
}

function importConfig() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        saveConfig(imported);
        closeConfig();
        showToast('Config imported');
        renderSidebar();
        loadFiles(getSections()[0]?.id || '01-BRAND');
      } catch {
        showToast('Invalid config file');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function resetConfig() {
  if (confirm('Reset all settings to default?')) {
    saveConfig(DEFAULT_CONFIG);
    closeConfig();
    showToast('Config reset');
    renderSidebar();
    loadFiles(getSections()[0]?.id || '01-BRAND');
  }
}

function init() {
  renderSidebar();
  setTheme(getTheme());
  applyConfig();

  contentEl = $('content');
  loadingStateEl = $('loading-state');
  errorStateEl = $('error-state');

  const toggle = $('sidebar-toggle');
  const sidebar = $('sidebar');
  const overlay = $('overlay');
  const themeToggle = $('theme-toggle');
  const bookmarkBtn = $('bookmark-btn');
  const searchInput = $('search-input');
  const fileFilterInput = document.querySelector('.file-list-search input');
  const configBtn = $('config-btn');

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  });

  themeToggle.addEventListener('click', toggleTheme);

  bookmarkBtn.addEventListener('click', () => {
    if (currentFile) toggleBookmark(currentFile);
  });

  configBtn.addEventListener('click', openConfig);

  document.getElementById('config-close').addEventListener('click', closeConfig);
  document.getElementById('config-modal-backdrop').addEventListener('click', closeConfig);
  document.getElementById('config-save').addEventListener('click', saveConfigFromModal);
  document.getElementById('config-export').addEventListener('click', exportConfig);
  document.getElementById('config-import').addEventListener('click', importConfig);
  document.getElementById('config-reset').addEventListener('click', resetConfig);
  document.getElementById('config-add-tier').addEventListener('click', addConfigTier);

  searchInput.addEventListener('focus', openSearch);
  searchInput.addEventListener('click', openSearch);

  if (fileFilterInput) {
    fileFilterInput.addEventListener('input', (e) => {
      renderFiles(e.target.value);
    });
  }

  document.getElementById('search-modal-backdrop').addEventListener('click', closeSearch);

  const modalInput = $('modal-search-input');
  modalInput.addEventListener('input', (e) => performSearch(e.target.value));

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') {
      closeSearch();
      closeConfig();
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
    }
  });

  window.addEventListener('online', () => showToast('Back online'));
  window.addEventListener('offline', () => showToast('You are offline'));

  loadFiles(getSections()[0]?.id || '01-BRAND');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
