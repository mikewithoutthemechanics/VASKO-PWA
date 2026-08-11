const GITHUB_BASE = 'https://raw.githubusercontent.com/mikewithoutthemechanics/VASKO-SYSTEM/master/';
const CONFIG_KEY = 'vasko-config';
const CACHE_KEY = 'vasko-cache-v4';
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

  const chatBtn = $('chat-btn');
  if (chatBtn) chatBtn.addEventListener('click', openCoach);

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
      closeCoach();
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
    }
  });

  window.addEventListener('online', () => showToast('Back online'));
  window.addEventListener('offline', () => showToast('You are offline'));

  initCoach();

  loadFiles(getSections()[0]?.id || '01-BRAND');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

const COACH_NOTES_KEY = 'vasko-coach-notes';
const COACH_STATE_KEY = 'vasko-coach-state';

const SCENARIOS = {
  discovery: {
    id: 'discovery',
    name: 'Discovery Call',
    icon: '🤝',
    steps: [
      {
        title: 'Opening',
        content: `<strong>You:</strong> "Hi [Name], thanks for making time. Before we dive in, is this still a good time for 30 minutes?"<br><br><strong>Goal:</strong> Confirm they have time and set the agenda.`,
        tips: ['Keep it under 30 seconds', 'If they are rushed, offer to reschedule', 'Set expectation that you will respect their time']
      },
      {
        title: 'Context Setting',
        content: `<strong>You:</strong> "The goal today is to understand where you are losing revenue in your sales process, and whether VASKO is the right fix. If it is not, I will tell you and point you somewhere else. Does that sound fair?"<br><br><strong>Goal:</strong> Establish credibility and set the agenda.`,
        tips: ['Be direct about your purpose', 'Give them an out if it is not a fit', 'Build trust through transparency']
      },
      {
        title: 'Qualification - Metrics',
        content: `<strong>You:</strong> "What does success look like for you this quarter?"<br><br><strong>Goal:</strong> Understand their goals and measure of success.`,
        tips: ['Listen for specific numbers', 'Ask follow-up: "How would you know you achieved that?"', 'Note their exact words']
      },
      {
        title: 'Qualification - Pain',
        content: `<strong>You:</strong> "Tell me about the last deal you lost. What happened?"<br><br><strong>Goal:</strong> Uncover real pain points and emotional drivers.`,
        tips: ['Silence is okay - let them fill it', 'Follow up: "How long has that been a problem?"', 'Follow up: "What have you tried to fix it?"', 'Follow up: "If you fixed it, what would change for you?"']
      },
      {
        title: 'Pain Deep-Dive',
        content: `<strong>You:</strong> "You mentioned [pain point]. Tell me more about that."<br><br><strong>Goal:</strong> Quantify the cost of the problem.`,
        tips: ['Ask: "How much is that costing you per month?"', 'Ask: "Who else is affected by this?"', 'Get specific numbers - revenue, time, headcount']
      },
      {
        title: 'Demo / Solution',
        content: `<strong>You:</strong> "Based on what you have shared, I think the [Core/Prime/Pro] tier would be the right fit. Let me show you exactly how it would solve [specific pain]."<br><br><strong>Goal:</strong> Connect your solution directly to their pain.`,
        tips: ['Reference their exact words from earlier', 'Show 2-3 specific features that map to their pain', 'Keep it under 5 minutes']
      },
      {
        title: 'Investment',
        content: `<strong>You:</strong> "For a team your size, the system typically sits at [Core/Prime/Pro]. The setup is [X], and the monthly engagement is [Y]. The way to think about it is: if this gets you one extra deal per month, it pays for itself 5x over."<br><br><strong>Goal:</strong> Frame investment as ROI, not cost.`,
        tips: ['Use their industry benchmarks', 'Compare to cost of inaction', 'Pause after giving numbers - let them react']
      },
      {
        title: 'Close',
        content: `<strong>You:</strong> "Here is where I think we are. [Summarise pain + solution + investment]. Does that make sense?"<br><br><strong>Next step options:</strong><br>1. "I can have the full proposal to you by Thursday."<br>2. "Let us schedule a follow-up with your CFO."<br>3. "I will send you the Core tier pricing and we can go from there."<br><br><strong>You:</strong> "Which of those makes the most sense for you?"`,
        tips: ['Always ask for a specific next step', 'Give 2-3 options, not an open-ended "what do you want?"', 'If they hesitate, use the urgency mechanism']
      }
    ]
  },
  'cold-email': {
    id: 'cold-email',
    name: 'Cold Outreach',
    icon: '📣',
    steps: [
      {
        title: 'Research',
        content: `<strong>Before you call:</strong><br>• Review their LinkedIn profile<br>• Check company website for recent news<br>• Identify their role and reporting line<br>• Prepare one personalised insight<br><br><strong>Time:</strong> 5 minutes`,
        tips: ['Look for recent hiring, funding, or expansion signals', 'Find a mutual connection if possible', 'Note any pain signals from their posts']
      },
      {
        title: 'Opening',
        content: `<strong>Pattern Interrupt:</strong><br>"Hi [Name], I am not going to sell you anything. I am going to tell you something uncomfortable. I looked at [Company]'s website. Your product is solid. But your sales process is leaking."<br><br><strong>Goal:</strong> Break through the generic pitch filter.`,
        tips: ['Be bold but not rude', 'Reference something specific about them', 'Keep it under 20 seconds']
      },
      {
        title: 'The Problem',
        content: `<strong>You:</strong> "Most B2B companies lose 30-40% of their pipeline to inconsistent messaging, bad proposals, and slow follow-up. Not because the product is bad. Because the system is missing."<br><br><strong>Goal:</strong> Agitate the pain without attacking them personally.`,
        tips: ['Use "most" not "you"', 'Make it about the category, not their failure', 'Stay curious, not judgmental']
      },
      {
        title: 'The Solution',
        content: `<strong>You:</strong> "I built VASKO for companies like yours. It is a complete sales system—brand, pricing, outreach, discovery scripts, proposals, onboarding. Everything you need to stop losing deals to the status quo."<br><br><strong>Goal:</strong> Position as the solution to their specific pain.`,
        tips: ['Keep it to one sentence', 'Do not list every feature', 'Pause and let them respond']
      },
      {
        title: 'The Ask',
        content: `<strong>You:</strong> "I am not asking you to buy anything. I am asking for 15 minutes to show you exactly where you are leaking. Are you free [day] at [time]?"<br><br><strong>Goal:</strong> Get a meeting, not a sale.`,
        tips: ['Specific time, not "when are you free?"', 'One option only - do not offer 5 times', 'If they say no, ask for a better time']
      }
    ]
  },
  objection: {
    id: 'objection',
    name: 'Objection Handling',
    icon: '🛡️',
    steps: [
      {
        title: 'Framework',
        content: `<strong>Acknowledge → Reframe → Resolve</strong><br><br>1. <strong>Acknowledge</strong>: Validate the concern without being defensive.<br>2. <strong>Reframe</strong>: Shift context from cost to investment, or risk to control.<br>3. <strong>Resolve</strong>: Provide a specific next step or proof point.`,
        tips: ['Never argue with the objection', 'Their objection is probably true - validate it', 'Your job is to reframe, not to win']
      },
      {
        title: '"It is too expensive"',
        content: `<strong>Acknowledge:</strong> "I hear you. R22,500/month is not a small commitment."<br><br><strong>Reframe:</strong> "What I want you to consider is the cost of not having a system. If your reps are wasting 10 hours a week on bad outreach, that is 40 hours of selling time lost. At R2,500/hour in deal value, that is R100,000/month in opportunity cost."<br><br><strong>Resolve:</strong> "Let us run the numbers together in the ROI calculator. If the math does not work, I will be the first to tell you."`,
        tips: ['Never discount without asking for something in return', 'Use their numbers, not yours', 'Pivot to ROI, not features']
      },
      {
        title: '"We have tried this before"',
        content: `<strong>Acknowledge:</strong> "That is frustrating. And you are right—most sales systems fail."<br><br><strong>Reframe:</strong> "The difference here is that VASKO is not a tool you configure. It is a playbook we hand you, built from 500+ real sales conversations. You are not buying software. You are buying the process."<br><br><strong>Resolve:</strong> "Show me what you tried. I will show you why this is different."`,
        tips: ['Ask what they tried - do not assume', 'Differentiate on implementation speed', 'Offer a pilot if trust is low']
      },
      {
        title: '"We need to think about it"',
        content: `<strong>Acknowledge:</strong> "Absolutely. This is a decision that affects your whole revenue operation."<br><br><strong>Reframe:</strong> "Thinking is good. But thinking without a deadline usually leads to doing nothing. What specifically do you need to think about?"<br><br><strong>Resolve:</strong> "Let us set a decision date. I will send you the full system preview by Thursday. If you have not decided by next Tuesday, I will follow up once—and then we both move on."`,
        tips: ['Uncover the real objection behind "thinking"', 'Set a specific follow-up date', 'Do not chase indefinitely']
      },
      {
        title: '"We do not have the bandwidth"',
        content: `<strong>Acknowledge:</strong> "That is the most common concern I hear."<br><br><strong>Reframe:</strong> "The beauty of VASKO is that we do the heavy lifting. You do not need a project team. You need a champion who gives us 2 hours a week for 3 weeks. After that, we run the system for you."<br><br><strong>Resolve:</strong> "Who on your team could be that champion?"`,
        tips: ['Minimise the time commitment', 'Offer to handle the heavy lifting', 'Identify the champion']
      },
      {
        title: '"Your competitor is cheaper"',
        content: `<strong>Acknowledge:</strong> "They might be. And that is fine."<br><br><strong>Reframe:</strong> "Cheaper usually means either less scope or lower quality. We do not compete on price. We compete on implementation speed and playbook depth."<br><br><strong>Resolve:</strong> "Let me show you what they are not giving you. [Show comparison chart]"`,
        tips: ['Do not badmouth competitors', 'Focus on value, not price', 'Show the gaps in their offering']
      }
    ]
  },
  closing: {
    id: 'closing',
    name: 'Closing',
    icon: '🎯',
    steps: [
      {
        title: 'Recognising Buying Signals',
        content: `<strong>Buying signals to watch for:</strong><br>• "What is the implementation timeline?"<br>• "Can we get started next week?"<br>• "Do you have a contract I can review?"<br>• "I need to check with my CFO"<br>• "What happens after we sign?"<br><br><strong>Action:</strong> When you hear these, move to close immediately. Do not keep selling.`,
        tips: ['Buying signals are requests for logistics', 'The more specific the question, the hotter the lead', 'Do not answer logistics questions until you have committed']
      },
      {
        title: 'The Assumptive Close',
        content: `<strong>You:</strong> "Based on everything we have discussed, the Prime tier makes the most sense. I will have the proposal to you by Thursday. Does that work?"<br><br><strong>Goal:</strong> Move past "if" and into "when".`,
        tips: ['Speak as if the decision is already made', 'If they push back, you can adjust', 'Confidence sells']
      },
      {
        title: 'The Summary Close',
        content: `<strong>You:</strong> "Let me summarise what we have agreed on. [Recap pain + solution + investment + next steps]. Are we aligned?"<br><br><strong>Goal:</strong> Confirm agreement before sending proposal.`,
        tips: ['Use their exact words from earlier', 'Make it a confirmation, not a question', 'Write it down - send it in writing']
      },
      {
        title: 'The Alternative Close',
        content: `<strong>You:</strong> "Would you prefer to start with the Core tier and upgrade later, or go straight to Prime for the full system?"<br><br><strong>Goal:</strong> Give two yeses, not a yes/no.`,
        tips: ['Both options should be good for you', 'Make the preferred option obvious', 'If they pick the lesser option, accept it']
      },
      {
        title: 'Urgency Close',
        content: `<strong>You:</strong> "Here is the honest truth: if you are not going to make a decision in the next 2 weeks, I should not take up more of your time. Not because I am pushy, but because I respect your calendar and my own."<br><br><strong>Goal:</strong> Create a decision deadline without fake scarcity.`,
        tips: ['Only use real deadlines', 'Mean it - walk away if they delay', 'This separates serious buyers from tyre-kickers']
      }
    ]
  },
  onboarding: {
    id: 'onboarding',
    name: 'Client Onboarding',
    icon: '🚀',
    steps: [
      {
        title: 'Welcome Call',
        content: `<strong>Agenda:</strong><br>1. Welcome and introductions<br>2. Review project timeline<br>3. Confirm stakeholder contacts<br>4. Set up shared workspace<br>5. Schedule weekly check-ins<br><br><strong>Duration:</strong> 30 minutes`,
        tips: ['Send calendar invite within 1 hour', 'Share welcome pack before the call', 'Record the call for notes']
      },
      {
        title: 'Discovery Session',
        content: `<strong>Objective:</strong> Understand their business, market, and pain points.<br><br><strong>Key questions:</strong><br>• Walk me through your current sales process<br>• Where do you lose the most deals?<br>• What have you tried to fix this?<br>• What does success look like in 90 days?`,
        tips: ['Record with permission', 'Ask for access to current materials', 'Identify the champion']
      },
      {
        title: 'Build Phase',
        content: `<strong>Your role:</strong><br>• Weekly check-ins (30 mins every Friday)<br>• Review drafts within 48 hours<br>• Provide feedback and approvals<br><br><strong>Our role:</strong><br>• Build the system<br>• Share drafts for review<br>• Incorporate feedback`,
        tips: ['Set clear expectations for response times', 'Use shared docs for collaboration', 'Flag blockers immediately']
      },
      {
        title: 'Review & Iterate',
        content: `<strong>Process:</strong><br>1. We share the full draft<br>2. You review and add comments<br>3. We revise within 48 hours<br>4. Final approval required before go-live<br><br><strong>Rule:</strong> No more than 3 revision rounds per deliverable.`,
        tips: ['Batch feedback - do not send piecemeal', 'Use specific examples when giving feedback', 'Approve or reject - do not leave it in limbo']
      },
      {
        title: 'Go-Live',
        content: `<strong>Launch day:</strong><br>• Team training session (1-2 hours)<br>• Load all assets into CRM/tools<br>• First sequence goes live<br>• Monitoring dashboard active<br><br><strong>Week 1:</strong> Daily standups, issue resolution, process refinement.`,
        tips: ['Launch on a Tuesday or Wednesday', 'Have rollback plan ready', 'Celebrate the launch with the team']
      }
    ]
  },
  retention: {
    id: 'retention',
    name: 'Retention',
    icon: '🔄',
    steps: [
      {
        title: 'The Pulse Check',
        content: `<strong>VASKO Pulse Survey (Month 1, 3, 6, 9, 12):</strong><br><br>1. On a scale of 1-10, how satisfied are you?<br>2. On a scale of 1-10, how likely are you to recommend us?<br>3. What is the one thing we could improve?<br>4. Which modules are you using? Which are you not?<br>5. Has your close rate changed since deploying VASKO?`,
        tips: ['Send on the 1st of the month', 'Follow up within 7 days if no response', 'Score every response']
      },
      {
        title: 'Promoter Action',
        content: `<strong>NPS 9-10:</strong><br>• Ask for case study or testimonial<br>• Offer referral incentive<br>• Propose expansion (new modules, new markets)<br><br><strong>Script:</strong> "We are doing a case study on [Company]. Would you be open to a 20-minute chat about your experience?"`,
        tips: ['Act within 48 hours while enthusiasm is high', 'Make the ask specific and time-bound', 'Offer value in return']
      },
      {
        title: 'Passive Action',
        content: `<strong>NPS 7-8:</strong><br>• Identify the one thing that would make them a 9<br>• Deliver that thing within 14 days<br>• Follow up with a satisfaction check<br><br><strong>Script:</strong> "You gave us a 7. What would it take to get you to a 9? I want to earn that."`,
        tips: ['Do not ignore passives - they are one bad experience from churning', 'Be specific about the improvement', 'Follow through on the promise']
      },
      {
        title: 'Detractor Rescue',
        content: `<strong>NPS 0-6:</strong><br>• Schedule executive escalation call within 48 hours<br>• Conduct root cause analysis<br>• Present recovery plan within 7 days<br>• Weekly follow-up until score improves<br><br><strong>Script:</strong> "I see that you are not happy. I want to fix this. Can we schedule a call with our managing director to discuss what went wrong?"`,
        tips: ['Move fast - detractors spread negative word-of-mouth', 'Do not make excuses - own the problem', 'Over-deliver on the recovery']
      },
      {
        title: 'Expansion',
        content: `<strong>When to expand:</strong><br>• Month 4: Review usage and identify gaps<br>• Month 6: Propose additional modules<br>• Month 9: Discuss new markets or verticals<br><br><strong>Script:</strong> "You are getting great results from the Core system. Based on your growth, I think Prime would unlock [specific value]. Want to see what that looks like?"`,
        tips: ['Expand only after delivering value', 'Tie expansion to their success metrics', 'Offer a smooth upgrade path']
      }
    ]
  }
};

let coachState = {
  scenario: '',
  step: 0,
  notes: ''
};

function loadCoachState() {
  try {
    const saved = localStorage.getItem(COACH_STATE_KEY);
    if (saved) coachState = { ...coachState, ...JSON.parse(saved) };
  } catch {}
}

function saveCoachState() {
  localStorage.setItem(COACH_STATE_KEY, JSON.stringify(coachState));
}

function loadCoachNotes() {
  const notes = localStorage.getItem(COACH_NOTES_KEY);
  if (notes) {
    const notesEl = $('coach-notes');
    if (notesEl) notesEl.value = notes;
    coachState.notes = notes;
  }
}

function saveCoachNotes() {
  const notesEl = $('coach-notes');
  if (notesEl) {
    coachState.notes = notesEl.value;
    localStorage.setItem(COACH_NOTES_KEY, notesEl.value);
    showToast('Notes saved');
  }
}

function openCoach() {
  $('coach-panel').classList.add('open');
  loadCoachState();
  loadCoachNotes();
  if (coachState.scenario) {
    $('coach-scenario').value = coachState.scenario;
    loadScenario(coachState.scenario);
    goToStep(coachState.step);
  }
}

function closeCoach() {
  $('coach-panel').classList.remove('open');
}

function loadScenario(scenarioId) {
  coachState.scenario = scenarioId;
  coachState.step = 0;
  saveCoachState();
  renderCoachStep();
}

function goToStep(stepIndex) {
  coachState.step = stepIndex;
  saveCoachState();
  renderCoachStep();
}

function renderCoachStep() {
  const scenario = SCENARIOS[coachState.scenario];
  const stepEl = $('coach-step');
  const contentEl = $('coach-step-content');
  const prevBtn = $('coach-prev');
  const nextBtn = $('coach-next');

  if (!scenario || !stepEl) return;

  const step = scenario.steps[coachState.step];
  if (!step) return;

  stepEl.querySelector('.coach-step-number').textContent = `Step ${coachState.step + 1} of ${scenario.steps.length}`;
  stepEl.querySelector('.coach-step-title').textContent = step.title;
  contentEl.innerHTML = step.content + (step.tips ? `<div class="coach-tips"><strong>Tips:</strong><ul>${step.tips.map(t => `<li>${t}</li>`).join('')}</ul></div>` : '');

  prevBtn.disabled = coachState.step === 0;
  nextBtn.disabled = coachState.step >= scenario.steps.length - 1;
  nextBtn.textContent = coachState.step >= scenario.steps.length - 1 ? 'Finish' : 'Next →';
}

function switchCoachTab(tabId) {
  document.querySelectorAll('.coach-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  document.querySelectorAll('.coach-tab-content').forEach(c => c.classList.toggle('active', c.id === `tab-${tabId}`));
}

function addCoachMessage(text, sender) {
  const content = $('coach-step-content');
  if (!content) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = 'coach-message';
  msgDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : 'Coach'}:</strong> ${text}`;
  content.appendChild(msgDiv);
  content.scrollTop = content.scrollHeight;
}

let coachTimerInterval = null;
let coachTimerSeconds = 0;

function startCoachTimer() {
  if (coachTimerInterval) return;
  coachTimerInterval = setInterval(() => {
    coachTimerSeconds++;
    const mins = Math.floor(coachTimerSeconds / 60).toString().padStart(2, '0');
    const secs = (coachTimerSeconds % 60).toString().padStart(2, '0');
    const display = $('coach-timer');
    if (display) display.textContent = `${mins}:${secs}`;
  }, 1000);
}

function pauseCoachTimer() {
  clearInterval(coachTimerInterval);
  coachTimerInterval = null;
}

function resetCoachTimer() {
  pauseCoachTimer();
  coachTimerSeconds = 0;
  const display = $('coach-timer');
  if (display) display.textContent = '00:00';
}

function initCoach() {
  const chatBtn = $('chat-btn');
  const closeBtn = $('coach-close');
  const scenarioSelect = $('coach-scenario');
  const prevBtn = $('coach-prev');
  const nextBtn = $('coach-next');
  const saveNotesBtn = $('coach-save-notes');
  const timerStart = $('coach-timer-start');
  const timerPause = $('coach-timer-pause');
  const timerReset = $('coach-timer-reset');

  if (chatBtn) chatBtn.addEventListener('click', openCoach);
  if (closeBtn) closeBtn.addEventListener('click', closeCoach);

  if (scenarioSelect) {
    scenarioSelect.addEventListener('change', (e) => {
      if (e.target.value) loadScenario(e.target.value);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => {
    if (coachState.step > 0) goToStep(coachState.step - 1);
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    const scenario = SCENARIOS[coachState.scenario];
    if (!scenario) return;
    if (coachState.step < scenario.steps.length - 1) {
      goToStep(coachState.step + 1);
    } else {
      showToast('Scenario complete! Great job.');
    }
  });

  document.querySelectorAll('.coach-tab').forEach(tab => {
    tab.addEventListener('click', () => switchCoachTab(tab.dataset.tab));
  });

  document.querySelectorAll('.coach-quick-reply').forEach(btn => {
    btn.addEventListener('click', () => {
      const reply = btn.dataset.reply;
      copySuggestion(reply);
      addCoachMessage(reply, 'user');
      showToast('Copied to clipboard');
    });
  });

  document.querySelectorAll('.coach-objection').forEach(btn => {
    btn.addEventListener('click', () => {
      const objectionId = btn.dataset.objection;
      const scenario = SCENARIOS.objection;
      const step = scenario.steps.find(s => s.title.toLowerCase().includes(objectionId.replace(/-/g, ' ')));
      if (step) {
        copySuggestion(step.content.replace(/<[^>]*>/g, '').substring(0, 200));
        addCoachMessage(step.title, 'coach');
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = step.content;
        const contentEl = $('coach-step-content');
        if (contentEl) contentEl.appendChild(contentDiv);
      }
    });
  });

  if (saveNotesBtn) saveNotesBtn.addEventListener('click', saveCoachNotes);

  if (timerStart) timerStart.addEventListener('click', startCoachTimer);
  if (timerPause) timerPause.addEventListener('click', pauseCoachTimer);
  if (timerReset) timerReset.addEventListener('click', resetCoachTimer);

  initLiveCall();
}

/* Live Call Mode */
const LIVE_KEYWORDS = {
  'expensive|cost|price|budget|afford|too much': {
    title: '💰 Pricing Objection',
    insight: 'They are anchoring on cost, not value.',
    response: '"I hear you. What I want you to consider is the cost of not fixing this. If your reps waste 10 hours a week on bad outreach, that is 40 hours of selling time lost. At your deal size, that is roughly [X] in opportunity cost per month. The way to think about VASKO is: if it gets you one extra deal, it pays for itself 5x over."',
    followUp: 'Ask: "What would an extra deal per month be worth to you?"'
  },
  'think about|think it over|need to think|let me think|not sure': {
    title: '⏳ Stall Tactic',
    insight: 'They are not convinced or they are not the decision maker.',
    response: '"Absolutely. This is a decision that affects your whole revenue operation. But thinking without a deadline usually leads to doing nothing. What specifically do you need to think about? Is it the investment, the implementation, or the outcome?"',
    followUp: 'Set a specific follow-up: "Let us reconnect on [day] at [time] with an answer."'
  },
  'happy|current|satisfied|working fine|no problem|okay for now': {
    title: '😐 Status Quo Bias',
    insight: 'They do not feel the pain enough to change.',
    response: '"That is great to hear. Can I ask: what would it take for you to go from good to great? Most teams we work with were doing fine too—until they saw what consistent messaging and a real system could do. What does success look like for you this quarter?"',
    followUp: 'Ask: "If you could change one thing about your current process, what would it be?"'
  },
  'no budget|not in budget|cant afford|cannot afford|tight budget': {
    title: '💸 Budget Constraint',
    insight: 'Either they truly cannot afford it, or you have not demonstrated enough value.',
    response: '"I understand budget is real. Let us look at it differently: what is the cost of staying where you are? If you are losing deals to inconsistent messaging, that is not a budget problem—that is a revenue problem. We can structure the engagement to match your cash flow."',
    followUp: 'Offer: "Would a Core tier at [lower price] be a better fit to get started?"'
  },
  'wrong time|bad timing|not now|busy|next quarter': {
    title: '📅 Timing Objection',
    insight: 'They are interested but not urgent.',
    response: '"I respect that. Timing matters. But here is what I would ask: if we do not start now, what changes in [next quarter]? If the pain is real, waiting only costs you more in lost revenue. Let us agree on a specific date to revisit this."',
    followUp: 'Set calendar invite now for their "ready" date.'
  },
  'competitor|other vendor|already using|alternatives|comparing': {
    title: '🆚 Competitor Mention',
    insight: 'They are shopping. This is a buying signal.',
    response: '"That is smart. Who else are you looking at? What I can tell you is that most competitors sell you software or advice. We sell you the actual playbook—tested across 500+ sales conversations. The difference is speed: you get a working system in 14 days, not 14 weeks."',
    followUp: 'Ask: "What matters most to you in a partner—speed, depth, or cost?"'
  },
  'not sure|dont know|who decides|decision maker|need to ask': {
    title: '🤔 Decision Process',
    insight: 'You are talking to an influencer, not the decision maker.',
    response: '"That is helpful to know. Who else would need to be involved in this decision? And what would they need to see to feel confident moving forward?"',
    followUp: 'Map the decision process: "Walk me through how a decision like this typically gets made."'
  },
  'contract|terms|agreement|legal|paperwork|sign': {
    title: '📝 Commercial Discussion',
    insight: 'They are ready to buy. Do not keep selling.',
    response: '"Great. Let us move to a proposal. I will send over the [Core/Prime/Pro] tier breakdown by [day]. The proposal is valid for 14 days. What questions do you have before we finalise?"',
    followUp: 'Send proposal immediately. Schedule follow-up for 48 hours later.'
  },
  'demo|show me|how does it work|walk me|example': {
    title: '🎬 Demo Request',
    insight: 'They want to see value in action.',
    response: '"Absolutely. Based on what you have shared, I think the [Core/Prime/Pro] tier would be the right fit. Let me show you exactly how it would solve [specific pain they mentioned]. This will take about 5 minutes."',
    followUp: 'Focus on 2-3 specific features that map to their pain. Do not show everything.'
  },
  'team|reps|hiring|ramp|training|onboard': {
    title: '👥 Team Enablement',
    insight: 'They care about adoption and scalability.',
    response: '"That is exactly what VASKO is built for. We give your team a complete playbook so new reps reach quota in 6 weeks, not 6 months. The onboarding is included—we train your team and hand over the system."',
    followUp: 'Share the staff adoption framework and time-to-productivity metrics.'
  }
};

const COACH_RESPONSES = {
  'opening': {
    title: 'Opening',
    script: '"Hi [Name], thanks for making time. The goal today is to understand where you are losing revenue in your sales process, and whether VASKO is the right fix. If it is not, I will tell you. Does that sound fair?"'
  },
  'qualification': {
    title: 'Qualification',
    script: '"What does success look like for you this quarter? And tell me about the last deal you lost—what happened?"'
  },
  'pain': {
    title: 'Pain Deep-Dive',
    script: '"You mentioned [pain point]. Tell me more about that. How long has that been a problem? What have you tried to fix it? And if you fixed it, what would change for you personally?"'
  },
  'investment': {
    title: 'Investment Framing',
    script: '"For a team your size, the system typically sits at [Core/Prime/Pro]. The setup is [X], and the monthly engagement is [Y]. The way to think about it is: if this gets you one extra deal per month, it pays for itself 5x over."'
  },
  'close': {
    title: 'Closing',
    script: '"Here is where I think we are. [Summarise pain + solution + investment]. Does that make sense? Which next step works best for you: proposal by Thursday, or a follow-up with your CFO?"'
  }
};

let liveState = {
  listening: false,
  transcript: [],
  lastUserText: '',
  recognition: null
};

function initLiveCall() {
  const liveStart = $('live-start');
  const liveStop = $('live-stop');
  const liveCopy = $('live-copy');
  const livePip = $('live-pip');
  const liveMiniStart = $('live-mini-start');
  const liveMiniStop = $('live-mini-stop');
  const liveMiniCopy = $('live-mini-copy');
  const liveWidgetToggle = $('live-widget-toggle');
  const liveWidget = $('live-widget');

  if (liveStart) liveStart.addEventListener('click', startListening);
  if (liveStop) liveStop.addEventListener('click', stopListening);
  if (liveCopy) liveCopy.addEventListener('click', copyLastTranscriptLine);
  if (livePip) livePip.addEventListener('click', requestPiP);

  const liveSuggest = $('live-suggest');
  if (liveSuggest) {
    liveSuggest.addEventListener('click', () => {
      suggestNextMove();
      showToast('Analyzing conversation...');
    });
  }

  if (liveMiniStart) liveMiniStart.addEventListener('click', startListening);
  if (liveMiniStop) liveMiniStop.addEventListener('click', stopListening);
  if (liveMiniCopy) liveMiniCopy.addEventListener('click', copyLastTranscriptLine);

  if (liveWidgetToggle) {
    liveWidgetToggle.addEventListener('click', () => {
      liveWidget.classList.toggle('collapsed');
      liveWidgetToggle.textContent = liveWidget.classList.contains('collapsed') ? '+' : '−';
    });
  }

  const chatBtn = $('chat-btn');
  if (chatBtn) {
    chatBtn.addEventListener('click', () => {
      openCoach();
      setTimeout(() => switchCoachTab('live'), 100);
    });
  }
}

function startListening() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showToast('Speech recognition not supported in this browser');
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  liveState.recognition = new SpeechRecognition();
  liveState.recognition.continuous = true;
  liveState.recognition.interimResults = true;
  liveState.recognition.lang = 'en-US';

  liveState.recognition.onstart = () => {
    liveState.listening = true;
    updateLiveUI(true);
    showToast('Listening...');
  };

  liveState.recognition.onresult = (event) => {
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }

    if (finalTranscript) {
      addLiveMessage(finalTranscript.trim(), 'user');
      liveState.lastUserText = finalTranscript.trim();
      detectKeywords(finalTranscript.trim());
      suggestNextMove();
    }

    if (interimTranscript) {
      updateLiveInterim(interimTranscript);
    }
  };

  liveState.recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    if (event.error === 'not-allowed') {
      showToast('Microphone access denied. Please allow microphone access.');
    } else {
      showToast('Listening error: ' + event.error);
    }
    stopListening();
  };

  liveState.recognition.onend = () => {
    liveState.listening = false;
    updateLiveUI(false);
  };

  liveState.recognition.start();
}

function stopListening() {
  if (liveState.recognition) {
    liveState.recognition.stop();
    liveState.recognition = null;
  }
  liveState.listening = false;
  updateLiveUI(false);
}

function updateLiveUI(isListening) {
  const liveStart = $('live-start');
  const liveStop = $('live-stop');
  const liveMiniStart = $('live-mini-start');
  const liveMiniStop = $('live-mini-stop');
  const liveStatus = $('live-status');
  const liveDot = liveStatus?.querySelector('.live-dot');
  const liveText = liveStatus?.querySelector('.live-text');

  if (liveStart) liveStart.disabled = isListening;
  if (liveStop) liveStop.disabled = !isListening;
  if (liveMiniStart) liveMiniStart.disabled = isListening;
  if (liveMiniStop) liveMiniStop.disabled = !isListening;

  if (liveStatus) {
    liveStatus.classList.toggle('listening', isListening);
    liveStatus.classList.toggle('processing', false);
  }
  if (liveDot) {
    liveDot.style.background = isListening ? '#f87171' : 'var(--text-muted)';
  }
  if (liveText) {
    liveText.textContent = isListening ? 'Listening...' : 'Ready to listen';
  }
}

function addLiveMessage(text, type) {
  const transcriptEl = $('live-transcript');
  const transcriptMiniEl = $('live-transcript-mini');
  const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const msgHtml = `<div class="live-message ${type}">
    <div class="live-time">${time}</div>
    <div class="live-text-content">${escapeHtml(text)}</div>
  </div>`;

  if (transcriptEl) {
    transcriptEl.insertAdjacentHTML('beforeend', msgHtml);
    transcriptEl.scrollTop = transcriptEl.scrollHeight;
  }

  if (transcriptMiniEl) {
    const miniMsg = document.createElement('div');
    miniMsg.className = `live-message ${type}`;
    miniMsg.innerHTML = `<div class="live-time">${time}</div><div class="live-text-content">${escapeHtml(text)}</div>`;
    transcriptMiniEl.appendChild(miniMsg);
    transcriptMiniEl.scrollTop = transcriptMiniEl.scrollHeight;
  }

  liveState.transcript.push({ text, type, time: Date.now() });
}

function updateLiveInterim(text) {
  const transcriptEl = $('live-transcript');
  const transcriptMiniEl = $('live-transcript-mini');

  const interimHtml = `<div class="live-message user" id="live-interim">
    <div class="live-time">${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
    <div class="live-text-content"><interim>${escapeHtml(text)}</interim></div>
  </div>`;

  const existingInterim = document.getElementById('live-interim');
  if (existingInterim) existingInterim.remove();

  if (transcriptEl) {
    transcriptEl.insertAdjacentHTML('beforeend', interimHtml);
    transcriptEl.scrollTop = transcriptEl.scrollHeight;
  }

  if (transcriptMiniEl) {
    const miniInterim = document.createElement('div');
    miniInterim.id = 'live-interim-mini';
    miniInterim.className = 'live-message user';
    miniInterim.innerHTML = `<div class="live-time">${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div><div class="live-text-content"><interim>${escapeHtml(text)}</interim></div>`;
    transcriptMiniEl.appendChild(miniInterim);
    transcriptMiniEl.scrollTop = transcriptMiniEl.scrollHeight;
  }
}

function detectKeywords(text) {
  const lower = text.toLowerCase();
  const matched = [];

  for (const [pattern, suggestion] of Object.entries(LIVE_KEYWORDS)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(lower)) {
      matched.push(suggestion);
    }
  }

  const suggestionsEl = $('live-suggestions');
  const suggestionsMiniEl = $('live-suggestions-mini');

  if (matched.length > 0) {
    const html = matched.map(s => `
      <div class="live-suggestion" onclick="copySuggestion('${escapeHtml(s.response)}')">
        <div class="live-suggestion-title">${escapeHtml(s.title)}</div>
        <div class="live-suggestion-content">${escapeHtml(s.insight)}</div>
        <div class="live-suggestion-response">${escapeHtml(s.response.substring(0, 180))}${s.response.length > 180 ? '...' : ''}</div>
        <div class="live-suggestion-followup">${escapeHtml(s.followUp)}</div>
      </div>
    `).join('');

    const miniHtml = matched.map(s => `
      <div class="live-suggestion-mini" onclick="copySuggestion('${escapeHtml(s.response)}')">
        ${escapeHtml(s.title)}: ${escapeHtml(s.insight)}
      </div>
    `).join('');

    if (suggestionsEl) suggestionsEl.innerHTML = html;
    if (suggestionsMiniEl) suggestionsMiniEl.innerHTML = miniHtml;
  }
}

function suggestNextMove() {
  const transcript = liveState.transcript.map(t => t.text).join(' ').toLowerCase();
  const suggestions = [];

  if (transcript.includes('hello') || transcript.includes('hi') || transcript.includes('good morning')) {
    suggestions.push(COACH_RESPONSES.opening);
  }
  if (transcript.includes('problem') || transcript.includes('challenge') || transcript.includes('issue') || transcript.includes('pain')) {
    suggestions.push(COACH_RESPONSES.pain);
  }
  if (transcript.includes('budget') || transcript.includes('cost') || transcript.includes('price') || transcript.includes('invest')) {
    suggestions.push(COACH_RESPONSES.investment);
  }
  if (transcript.includes('next step') || transcript.includes('move forward') || transcript.includes('ready to')) {
    suggestions.push(COACH_RESPONSES.close);
  }
  if (transcript.includes('who') || transcript.includes('team') || transcript.includes('company') || transcript.includes('business')) {
    suggestions.push(COACH_RESPONSES.qualification);
  }

  if (suggestions.length > 0) {
    const latest = suggestions[suggestions.length - 1];
    addLiveMessage(`💡 Suggested: ${latest.script}`, 'system');
  }
}

function copySuggestion(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard');
  }).catch(() => {
    showToast('Failed to copy');
  });
}

function copyLastTranscriptLine() {
  if (liveState.transcript.length === 0) {
    showToast('No transcript to copy');
    return;
  }
  const last = liveState.transcript[liveState.transcript.length - 1];
  copySuggestion(last.text);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function requestPiP() {
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      showToast('Exited Picture-in-Picture');
      return;
    }

    const video = document.createElement('video');
    video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
    video.play();

    const stream = video.srcObject;
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');

    function drawFrame() {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
      ctx.fillStyle = '#fff';
      ctx.font = '12px sans-serif';
      ctx.fillText('🎯 VASKO Live Coach', 10, canvas.height - 15);
      requestAnimationFrame(drawFrame);
    }
    drawFrame();

    const streamCanvas = canvas.captureStream(10);
    const pipVideo = document.createElement('video');
    pipVideo.srcObject = streamCanvas;
    pipVideo.muted = true;
    await pipVideo.play();

    await pipVideo.requestPictureInPicture();
    showToast('Picture-in-Picture mode enabled');

    pipVideo.addEventListener('leavepictureinpicture', () => {
      stream.getTracks().forEach(t => t.stop());
      video.srcObject.getTracks().forEach(t => t.stop());
    });
  } catch (err) {
    console.error('PiP error:', err);
    showToast('Picture-in-Picture not supported or permission denied');
  }
}

/* Coach Tab Switching */
function switchCoachTab(tabId) {
  document.querySelectorAll('.coach-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  document.querySelectorAll('.coach-tab-content').forEach(c => c.classList.toggle('active', c.id === `tab-${tabId}`));

  if (tabId === 'live') {
    const liveWidget = $('live-widget');
    if (liveWidget) {
      liveWidget.classList.add('open');
    }
  }
}
