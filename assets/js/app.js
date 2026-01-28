// Molecule Finder - 主應用程式
// 密碼: france2026

class MoleculeFinder {
  constructor() {
    this.molecules = [];
    this.filteredResults = [];
    this.currentLanguage = 'zh'; // 預設繁體中文
    this.PASSWORD = 'france2026';
    this.AUTH_KEY = 'molecule_auth';
    this.HISTORY_KEY = 'search_history';
    this.AUTH_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 天
    this.searchHistory = [];

    this.i18n = {
      zh: {
        title: '芳香分子查詢系統',
        subtitle: '精油化學成分多語言對照查詢',
        searchPlaceholder: '搜尋分子名稱 (支援中文、英文、法文)',
        searchStats: '共 {total} 筆分子資料',
        initialTitle: '開始搜尋分子',
        initialHint: '在上方輸入分子名稱以開始查詢',
        noResults: '找不到符合的分子',
        noResultsHint: '請嘗試其他關鍵字',
        french: '法文',
        english: '英文',
        chinese: '中文',
        authTitle: '🌿 訪問驗證',
        authDescription: '請輸入密碼以訪問芳香分子資料庫',
        authPlaceholder: '請輸入密碼',
        authButton: '進入系統',
        authError: '密碼錯誤，請重試',
        historyTitle: '最近搜尋',
        clearHistory: '清除'
      },
      en: {
        title: 'Molecule Finder',
        subtitle: 'Essential Oil Chemical Components Multilingual Reference',
        searchPlaceholder: 'Search molecule names (Chinese, English, French)',
        searchStats: 'Total {total} molecules',
        initialTitle: 'Start Searching',
        initialHint: 'Enter a molecule name above to begin your search',
        noResults: 'No molecules found',
        noResultsHint: 'Please try other keywords',
        french: 'French',
        english: 'English',
        chinese: 'Chinese',
        authTitle: '🌿 Authentication',
        authDescription: 'Please enter password to access the molecule database',
        authPlaceholder: 'Enter password',
        authButton: 'Enter',
        authError: 'Incorrect password, please try again',
        historyTitle: 'Recent Searches',
        clearHistory: 'Clear'
      },
      fr: {
        title: 'Recherche de Molécules',
        subtitle: 'Référence Multilingue des Composants Chimiques des Huiles Essentielles',
        searchPlaceholder: 'Rechercher des noms de molécules (chinois, anglais, français)',
        searchStats: 'Total {total} molécules',
        initialTitle: 'Commencer la Recherche',
        initialHint: 'Entrez un nom de molécule ci-dessus pour commencer',
        noResults: 'Aucune molécule trouvée',
        noResultsHint: 'Veuillez essayer d\'autres mots-clés',
        french: 'Français',
        english: 'Anglais',
        chinese: 'Chinois',
        authTitle: '🌿 Authentification',
        authDescription: 'Veuillez entrer le mot de passe pour accéder à la base de données',
        authPlaceholder: 'Entrez le mot de passe',
        authButton: 'Entrer',
        authError: 'Mot de passe incorrect, veuillez réessayer',
        historyTitle: 'Recherches Récentes',
        clearHistory: 'Effacer'
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

    // 載入搜尋歷史
    this.loadSearchHistory();

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

    let isProcessing = false; // 防止重複點擊

    const handleAuth = () => {
      // 防止重複點擊
      if (isProcessing) return;

      const password = input.value.trim();

      // 檢查密碼是否為空
      if (!password) {
        error.textContent = this.i18n[this.currentLanguage].authError;
        error.classList.add('show');
        input.focus();

        setTimeout(() => {
          error.classList.remove('show');
        }, 3000);
        return;
      }

      // 設置處理中狀態
      isProcessing = true;
      btn.disabled = true;
      btn.textContent = '⏳';

      if (password === this.PASSWORD) {
        // 儲存授權資訊
        localStorage.setItem(this.AUTH_KEY, JSON.stringify({
          timestamp: Date.now()
        }));

        // 短暫延遲以顯示成功狀態
        btn.textContent = '✓';
        setTimeout(() => {
          overlay.style.display = 'none';
          this.init();
        }, 300);
      } else {
        // 密碼錯誤
        error.classList.add('show');
        input.value = '';
        input.focus();

        // 恢復按鈕狀態
        setTimeout(() => {
          isProcessing = false;
          btn.disabled = false;
          btn.textContent = this.i18n[this.currentLanguage].authButton;
          error.classList.remove('show');
        }, 2000);
      }
    };

    // 使用 addEventListener 並移除舊的事件
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', handleAuth);

    // Enter 鍵處理
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAuth();
      }
    };

    input.addEventListener('keypress', handleKeyPress);

    // 清空並聚焦
    input.value = '';
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

  // 載入搜尋歷史
  loadSearchHistory() {
    try {
      const history = localStorage.getItem(this.HISTORY_KEY);
      this.searchHistory = history ? JSON.parse(history) : [];

      // 過濾掉無效的歷史記錄
      this.searchHistory = this.searchHistory.filter(item => {
        if (typeof item === 'string') return true; // 相容舊格式
        return item.moleculeId && item.displayText;
      });
    } catch (e) {
      this.searchHistory = [];
    }
  }

  // 儲存搜尋歷史
  saveSearchHistory(keyword) {
    if (!keyword || keyword.length < 2) return;

    // 找到第一個匹配的分子
    const matchedMolecule = this.molecules.find(molecule => {
      const k = keyword.toLowerCase();
      return (
        molecule.french.toLowerCase().includes(k) ||
        molecule.english.toLowerCase().includes(k) ||
        molecule.chinese.toLowerCase().includes(k)
      );
    });

    if (!matchedMolecule) return;

    // 移除重複的分子 ID
    this.searchHistory = this.searchHistory.filter(
      item => item.moleculeId !== matchedMolecule.id
    );

    // 新增到最前面，儲存關鍵字和分子資料
    this.searchHistory.unshift({
      keyword: keyword,
      moleculeId: matchedMolecule.id,
      displayText: this.getDisplayText(matchedMolecule, keyword)
    });

    // 最多保留 10 筆
    this.searchHistory = this.searchHistory.slice(0, 10);

    // 儲存到 localStorage
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(this.searchHistory));

    // 更新 UI
    this.renderSearchHistory();
  }

  // 取得顯示文字（用戶輸入的語言版本）
  getDisplayText(molecule, keyword) {
    const k = keyword.toLowerCase();

    if (molecule.chinese.toLowerCase().includes(k)) {
      return molecule.chinese;
    } else if (molecule.english.toLowerCase().includes(k)) {
      return molecule.english;
    } else if (molecule.french.toLowerCase().includes(k)) {
      return molecule.french;
    }

    return molecule.chinese; // 預設顯示中文
  }

  // 清除搜尋歷史
  clearSearchHistory() {
    this.searchHistory = [];
    localStorage.removeItem(this.HISTORY_KEY);
    this.renderSearchHistory();
  }

  // 渲染搜尋歷史
  renderSearchHistory() {
    const container = document.getElementById('searchHistory');
    const t = this.i18n[this.currentLanguage];

    if (this.searchHistory.length === 0) {
      container.classList.remove('show');
      return;
    }

    const html = `
      <div class="history-title">
        <span>📝 ${t.historyTitle}</span>
        <button class="clear-history" onclick="moleculeFinder.clearSearchHistory()">
          ${t.clearHistory}
        </button>
      </div>
      <div class="history-tags">
        ${this.searchHistory.map((item, index) => `
          <span class="history-tag" onclick="moleculeFinder.showHistoryMolecule(${index})">
            ${item.displayText || item}
          </span>
        `).join('')}
      </div>
    `;

    container.innerHTML = html;
    container.classList.add('show');
  }

  // 顯示歷史分子的完整資訊
  showHistoryMolecule(index) {
    const historyItem = this.searchHistory[index];

    // 相容舊格式（純字串）
    if (typeof historyItem === 'string') {
      const searchInput = document.getElementById('searchInput');
      searchInput.value = historyItem;
      this.handleSearch(historyItem);
      return;
    }

    // 找到該分子
    const molecule = this.molecules.find(m => m.id === historyItem.moleculeId);

    if (!molecule) {
      // 如果找不到分子，移除該歷史記錄
      this.searchHistory.splice(index, 1);
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(this.searchHistory));
      this.renderSearchHistory();
      return;
    }

    // 清空搜尋框
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';

    // 顯示該分子的完整資訊
    this.showMoleculeDetail(molecule);
  }

  // 顯示單個分子的完整資訊
  showMoleculeDetail(molecule) {
    const container = document.getElementById('resultsContainer');
    const t = this.i18n[this.currentLanguage];

    const html = `
      <div class="result-item" data-id="${molecule.id}">
        <div class="molecule-id">#${molecule.id}</div>
        <div class="molecule-names">
          <div class="molecule-name">
            <strong>${t.french}:</strong> ${this.escapeHtml(molecule.french)}
          </div>
          <div class="molecule-name">
            <strong>${t.english}:</strong> ${this.escapeHtml(molecule.english)}
          </div>
          <div class="molecule-name">
            <strong>${t.chinese}:</strong> ${this.escapeHtml(molecule.chinese)}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  // 初始化 UI
  initUI() {
    this.updateStats();
    this.showInitialState();
    this.renderSearchHistory();
  }

  // 顯示初始空狀態
  showInitialState() {
    const container = document.getElementById('resultsContainer');
    const t = this.i18n[this.currentLanguage];

    container.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🌿</div>
        <h3>${t.initialTitle}</h3>
        <p>${t.initialHint}</p>
      </div>
    `;
  }

  // 綁定事件
  bindEvents() {
    const searchInput = document.getElementById('searchInput');
    const suggestionsBox = document.getElementById('searchSuggestions');

    // 搜尋輸入
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value;

      // 清除之前的定時器
      clearTimeout(searchTimeout);

      // 延遲搜尋以改善性能
      searchTimeout = setTimeout(() => {
        this.handleSearch(keyword);

        // 顯示建議
        if (keyword.trim().length > 0) {
          this.showSuggestions(keyword);
        } else {
          suggestionsBox.classList.remove('show');
        }
      }, 300);
    });

    // 點擊外部關閉建議
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.classList.remove('show');
      }
    });

    // Enter 鍵儲存搜尋歷史
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const keyword = searchInput.value.trim();
        if (keyword) {
          this.saveSearchHistory(keyword);
          suggestionsBox.classList.remove('show');
        }
      }
    });

    // 語言切換
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchLanguage(e.target.dataset.lang);
      });
    });
  }

  // 顯示搜尋建議
  showSuggestions(keyword) {
    const suggestionsBox = document.getElementById('searchSuggestions');
    keyword = keyword.trim().toLowerCase();

    if (!keyword) {
      suggestionsBox.classList.remove('show');
      return;
    }

    // 取得建議（最多 8 筆）
    const suggestions = this.molecules
      .filter(molecule => {
        return (
          molecule.french.toLowerCase().includes(keyword) ||
          molecule.english.toLowerCase().includes(keyword) ||
          molecule.chinese.toLowerCase().includes(keyword)
        );
      })
      .slice(0, 8);

    if (suggestions.length === 0) {
      suggestionsBox.classList.remove('show');
      return;
    }

    // 渲染建議
    const html = suggestions.map(molecule => {
      const displayText = this.getSuggestionText(molecule, keyword);
      return `
        <div class="suggestion-item" onclick="moleculeFinder.applySuggestion('${this.escapeHtml(displayText)}')">
          ${this.highlightText(displayText, keyword)}
        </div>
      `;
    }).join('');

    suggestionsBox.innerHTML = html;
    suggestionsBox.classList.add('show');
  }

  // 取得建議顯示文字
  getSuggestionText(molecule, keyword) {
    keyword = keyword.toLowerCase();

    if (molecule.french.toLowerCase().includes(keyword)) {
      return molecule.french;
    } else if (molecule.english.toLowerCase().includes(keyword)) {
      return molecule.english;
    } else if (molecule.chinese.toLowerCase().includes(keyword)) {
      return molecule.chinese;
    }

    return molecule.french;
  }

  // 應用建議
  applySuggestion(text) {
    const searchInput = document.getElementById('searchInput');
    const suggestionsBox = document.getElementById('searchSuggestions');

    searchInput.value = text;
    this.handleSearch(text);
    this.saveSearchHistory(text);
    suggestionsBox.classList.remove('show');
  }

  // 搜尋處理
  handleSearch(keyword) {
    keyword = keyword.trim().toLowerCase();

    if (!keyword) {
      // 清空搜尋時顯示初始狀態
      this.showInitialState();
      return;
    }

    this.filteredResults = this.molecules.filter(molecule => {
      return (
        molecule.french.toLowerCase().includes(keyword) ||
        molecule.english.toLowerCase().includes(keyword) ||
        molecule.chinese.toLowerCase().includes(keyword)
      );
    });

    this.renderResults(keyword);
  }

  // 渲染結果
  renderResults(keyword = '') {
    const container = document.getElementById('resultsContainer');
    const t = this.i18n[this.currentLanguage];

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
    if (!keyword) return this.escapeHtml(text);

    const regex = new RegExp(`(${this.escapeRegex(keyword)})`, 'gi');
    return this.escapeHtml(text).replace(regex, '<span class="highlight">$1</span>');
  }

  // 轉義 HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 轉義正則表達式
  escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

    // 檢查搜尋框是否有內容
    const searchInput = document.getElementById('searchInput');
    const keyword = searchInput.value.trim();

    if (!keyword) {
      this.showInitialState();
    } else {
      this.renderResults(keyword);
    }

    this.renderSearchHistory();
  }

  // 更新語言文字
  updateLanguage() {
    const t = this.i18n[this.currentLanguage];

    document.getElementById('pageTitle').textContent = t.title;
    document.getElementById('pageSubtitle').textContent = t.subtitle;
    document.getElementById('searchInput').placeholder = t.searchPlaceholder;

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
