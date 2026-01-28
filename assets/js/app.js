// Molecule Finder - 主應用程式
// 密碼: france2026

class MoleculeFinder {
  constructor() {
    this.molecules = [];
    this.filteredResults = [];
    this.currentLanguage = 'zh'; // 預設繁體中文
    this.PASSWORD = 'france2026';
    this.AUTH_KEY = 'molecule_auth';
    this.AUTH_DURATION = 24 * 60 * 60 * 1000; // 24 小時

    this.i18n = {
      zh: {
        title: '芳香分子查詢系統',
        subtitle: '精油化學成分多語言對照查詢',
        searchPlaceholder: '搜尋分子名稱 (支援中文、英文、法文)',
        searchStats: '共 {total} 筆分子資料',
        resultsTitle: '搜尋結果',
        resultsCount: '找到 {count} 筆結果',
        noResults: '找不到符合的分子',
        noResultsHint: '請嘗試其他關鍵字',
        french: '法文',
        english: '英文',
        chinese: '中文',
        adminLink: '資料管理',
        authTitle: '🌿 訪問驗證',
        authDescription: '請輸入密碼以訪問芳香分子資料庫',
        authPlaceholder: '請輸入密碼',
        authButton: '進入系統',
        authError: '密碼錯誤，請重試'
      },
      en: {
        title: 'Molecule Finder',
        subtitle: 'Essential Oil Chemical Components Multilingual Reference',
        searchPlaceholder: 'Search molecule names (Chinese, English, French)',
        searchStats: 'Total {total} molecules',
        resultsTitle: 'Search Results',
        resultsCount: 'Found {count} results',
        noResults: 'No molecules found',
        noResultsHint: 'Please try other keywords',
        french: 'French',
        english: 'English',
        chinese: 'Chinese',
        adminLink: 'Admin',
        authTitle: '🌿 Authentication',
        authDescription: 'Please enter password to access the molecule database',
        authPlaceholder: 'Enter password',
        authButton: 'Enter',
        authError: 'Incorrect password, please try again'
      },
      fr: {
        title: 'Recherche de Molécules',
        subtitle: 'Référence Multilingue des Composants Chimiques des Huiles Essentielles',
        searchPlaceholder: 'Rechercher des noms de molécules (chinois, anglais, français)',
        searchStats: 'Total {total} molécules',
        resultsTitle: 'Résultats de Recherche',
        resultsCount: '{count} résultats trouvés',
        noResults: 'Aucune molécule trouvée',
        noResultsHint: 'Veuillez essayer d\'autres mots-clés',
        french: 'Français',
        english: 'Anglais',
        chinese: 'Chinois',
        adminLink: 'Admin',
        authTitle: '🌿 Authentification',
        authDescription: 'Veuillez entrer le mot de passe pour accéder à la base de données',
        authPlaceholder: 'Entrez le mot de passe',
        authButton: 'Entrer',
        authError: 'Mot de passe incorrect, veuillez réessayer'
      }
    };

    this.init();
  }

  async init() {
    // 檢查授權
    if (!this.checkAuth()) {
      this.showAuthModal();
      return;
    }

    // 載入分子資料
    await this.loadMolecules();

    // 初始化 UI
    this.initUI();
    this.updateLanguage();
    this.bindEvents();
  }

  // 授權檢查
  checkAuth() {
    const authData = localStorage.getItem(this.AUTH_KEY);
    if (!authData) return false;

    try {
      const { timestamp } = JSON.parse(authData);
      const now = Date.now();

      // 檢查是否過期
      if (now - timestamp > this.AUTH_DURATION) {
        localStorage.removeItem(this.AUTH_KEY);
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  // 顯示密碼輸入框
  showAuthModal() {
    const overlay = document.getElementById('authOverlay');
    const input = document.getElementById('authPassword');
    const btn = document.getElementById('authBtn');
    const error = document.getElementById('authError');

    overlay.style.display = 'flex';

    const handleAuth = () => {
      const password = input.value.trim();

      if (password === this.PASSWORD) {
        // 儲存授權資訊
        localStorage.setItem(this.AUTH_KEY, JSON.stringify({
          timestamp: Date.now()
        }));

        overlay.style.display = 'none';
        this.init();
      } else {
        error.classList.add('show');
        input.value = '';
        input.focus();

        setTimeout(() => {
          error.classList.remove('show');
        }, 3000);
      }
    };

    btn.onclick = handleAuth;
    input.onkeypress = (e) => {
      if (e.key === 'Enter') handleAuth();
    };

    input.focus();
  }

  // 載入分子資料
  async loadMolecules() {
    try {
      const response = await fetch('./data/molecule.json');
      const data = await response.json();
      this.molecules = data.molecules || [];
      this.filteredResults = [...this.molecules];

      console.log(`✓ 載入 ${this.molecules.length} 筆分子資料`);
    } catch (error) {
      console.error('載入資料失敗:', error);
      alert('無法載入分子資料，請檢查 data/molecule.json 檔案');
    }
  }

  // 初始化 UI
  initUI() {
    this.updateStats();
    this.renderResults();
  }

  // 綁定事件
  bindEvents() {
    // 搜尋輸入
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    // 語言切換
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchLanguage(e.target.dataset.lang);
      });
    });
  }

  // 搜尋處理
  handleSearch(keyword) {
    keyword = keyword.trim().toLowerCase();

    if (!keyword) {
      this.filteredResults = [...this.molecules];
    } else {
      this.filteredResults = this.molecules.filter(molecule => {
        return (
          molecule.french.toLowerCase().includes(keyword) ||
          molecule.english.toLowerCase().includes(keyword) ||
          molecule.chinese.toLowerCase().includes(keyword)
        );
      });
    }

    this.renderResults(keyword);
  }

  // 渲染結果
  renderResults(keyword = '') {
    const container = document.getElementById('resultsContainer');
    const header = document.getElementById('resultsHeader');
    const t = this.i18n[this.currentLanguage];

    // 更新標題
    if (this.filteredResults.length > 0) {
      header.innerHTML = `
        <h3>${t.resultsTitle}</h3>
        <p>${t.resultsCount.replace('{count}', this.filteredResults.length)}</p>
      `;
    }

    // 渲染結果
    if (this.filteredResults.length === 0) {
      container.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>${t.noResults}</h3>
          <p>${t.noResultsHint}</p>
        </div>
      `;
      return;
    }

    const html = this.filteredResults.map(molecule => {
      return `
        <div class="result-item" data-id="${molecule.id}">
          <div class="molecule-id">#${molecule.id}</div>
          <div class="molecule-names">
            <div class="molecule-name">
              <strong>${t.french}:</strong> ${this.highlightText(molecule.french, keyword)}
            </div>
            <div class="molecule-name">
              <strong>${t.english}:</strong> ${this.highlightText(molecule.english, keyword)}
            </div>
            <div class="molecule-name">
              <strong>${t.chinese}:</strong> ${this.highlightText(molecule.chinese, keyword)}
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = html;
  }

  // 高亮關鍵字
  highlightText(text, keyword) {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  // 更新統計資訊
  updateStats() {
    const stats = document.getElementById('searchStats');
    const t = this.i18n[this.currentLanguage];
    stats.textContent = t.searchStats.replace('{total}', this.molecules.length);
  }

  // 切換語言
  switchLanguage(lang) {
    this.currentLanguage = lang;

    // 更新按鈕狀態
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    this.updateLanguage();
    this.renderResults();
  }

  // 更新語言文字
  updateLanguage() {
    const t = this.i18n[this.currentLanguage];

    document.getElementById('pageTitle').textContent = t.title;
    document.getElementById('pageSubtitle').textContent = t.subtitle;
    document.getElementById('searchInput').placeholder = t.searchPlaceholder;
    document.getElementById('adminLink').textContent = t.adminLink;

    // 更新授權介面
    document.getElementById('authTitle').textContent = t.authTitle;
    document.getElementById('authDescription').textContent = t.authDescription;
    document.getElementById('authPassword').placeholder = t.authPlaceholder;
    document.getElementById('authBtn').textContent = t.authButton;
    document.getElementById('authError').textContent = t.authError;

    this.updateStats();
  }
}

// 初始化應用
document.addEventListener('DOMContentLoaded', () => {
  window.moleculeFinder = new MoleculeFinder();
});
