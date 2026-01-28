// Admin 管理介面

class AdminPanel {
  constructor() {
    this.currentData = null;
    this.uploadedFile = null;
    this.PASSWORD = 'france2026';
    this.AUTH_KEY = 'molecule_auth';

    this.init();
  }

  async init() {
    // 檢查授權
    if (!this.checkAuth()) {
      alert('請先從首頁登入系統');
      window.location.href = './index.html';
      return;
    }

    // 載入現有資料
    await this.loadCurrentData();

    // 綁定事件
    this.bindEvents();

    // 更新統計
    this.updateStats();
  }

  // 檢查授權
  checkAuth() {
    const authData = localStorage.getItem(this.AUTH_KEY);
    if (!authData) return false;

    try {
      const { timestamp } = JSON.parse(authData);
      const now = Date.now();
      const duration = 24 * 60 * 60 * 1000; // 24 小時

      if (now - timestamp > duration) {
        localStorage.removeItem(this.AUTH_KEY);
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  // 載入現有資料
  async loadCurrentData() {
    try {
      const response = await fetch('./data/molecule.json');
      this.currentData = await response.json();
      console.log(`✓ 載入 ${this.currentData.molecules.length} 筆資料`);
    } catch (error) {
      console.error('載入資料失敗:', error);
      this.showMessage('無法載入現有資料', 'warning');
    }
  }

  // 綁定事件
  bindEvents() {
    // 檔案上傳區域
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('csvFile');

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFileSelect(files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFileSelect(e.target.files[0]);
      }
    });

    // 處理 CSV 按鈕
    document.getElementById('processBtn').addEventListener('click', () => {
      this.processCSV();
    });

    // 下載 JSON 按鈕
    document.getElementById('downloadBtn').addEventListener('click', () => {
      this.downloadJSON();
    });

    // 清除按鈕
    document.getElementById('clearBtn').addEventListener('click', () => {
      this.clearUpload();
    });
  }

  // 處理檔案選擇
  handleFileSelect(file) {
    // 檢查檔案類型
    const validTypes = ['.csv', '.txt'];
    const fileName = file.name.toLowerCase();
    const isValid = validTypes.some(type => fileName.endsWith(type));

    if (!isValid) {
      this.showMessage('請選擇 CSV 或 TXT 檔案', 'error');
      return;
    }

    this.uploadedFile = file;

    // 顯示檔案資訊
    const fileInfo = document.getElementById('fileInfo');
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = this.formatFileSize(file.size);
    fileInfo.classList.add('show');

    // 啟用處理按鈕
    document.getElementById('processBtn').disabled = false;

    this.showMessage(`檔案已選擇: ${file.name}`, 'success');
  }

  // 處理 CSV
  async processCSV() {
    if (!this.uploadedFile) {
      this.showMessage('請先選擇檔案', 'warning');
      return;
    }

    const processBtn = document.getElementById('processBtn');
    processBtn.disabled = true;
    processBtn.textContent = '處理中...';

    try {
      // 讀取檔案內容
      const text = await this.readFileAsText(this.uploadedFile);

      // 解析 CSV
      const molecules = this.parseCSV(text);

      if (molecules.length === 0) {
        throw new Error('CSV 檔案中沒有有效的資料');
      }

      // 建立新的資料結構
      this.currentData = {
        molecules: molecules,
        total: molecules.length,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      // 更新預覽
      this.updatePreview(molecules);

      // 更新統計
      this.updateStats();

      // 啟用下載按鈕
      document.getElementById('downloadBtn').disabled = false;

      this.showMessage(`成功處理 ${molecules.length} 筆資料`, 'success');

    } catch (error) {
      console.error('處理失敗:', error);
      this.showMessage(`處理失敗: ${error.message}`, 'error');
    } finally {
      processBtn.disabled = false;
      processBtn.textContent = '🔄 處理 CSV';
    }
  }

  // 讀取檔案為文字
  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file, 'UTF-8');
    });
  }

  // 解析 CSV
  parseCSV(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    if (lines.length < 2) {
      throw new Error('CSV 檔案格式錯誤');
    }

    // 解析標題行
    const headers = this.parseCSVLine(lines[0]);

    // 檢查必要欄位
    const requiredFields = ['法文', '英文', '中文'];
    const hasAllFields = requiredFields.every(field => headers.includes(field));

    if (!hasAllFields) {
      throw new Error(`CSV 必須包含以下欄位: ${requiredFields.join(', ')}`);
    }

    // 解析資料行
    const molecules = [];
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);

      if (values.length !== headers.length) {
        console.warn(`第 ${i + 1} 行資料格式錯誤，跳過`);
        continue;
      }

      const molecule = {
        id: molecules.length + 1,
        french: values[headers.indexOf('法文')] || '',
        english: values[headers.indexOf('英文')] || '',
        chinese: values[headers.indexOf('中文')] || ''
      };

      // 過濾空資料
      if (molecule.french || molecule.english || molecule.chinese) {
        molecules.push(molecule);
      }
    }

    return molecules;
  }

  // 解析 CSV 行 (處理引號)
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  // 更新預覽
  updatePreview(molecules) {
    const previewSection = document.getElementById('previewSection');
    const tbody = document.getElementById('previewBody');

    // 顯示前 50 筆
    const displayData = molecules.slice(0, 50);

    const html = displayData.map(molecule => `
      <tr>
        <td>${molecule.id}</td>
        <td>${molecule.french}</td>
        <td>${molecule.english}</td>
        <td>${molecule.chinese}</td>
      </tr>
    `).join('');

    tbody.innerHTML = html;
    previewSection.style.display = 'block';
  }

  // 下載 JSON
  downloadJSON() {
    if (!this.currentData) {
      this.showMessage('沒有資料可供下載', 'warning');
      return;
    }

    try {
      // 建立 JSON 字串
      const jsonStr = JSON.stringify(this.currentData, null, 2);

      // 建立下載連結
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `molecule_${new Date().getTime()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showMessage('JSON 檔案已下載', 'success');

    } catch (error) {
      console.error('下載失敗:', error);
      this.showMessage('下載失敗', 'error');
    }
  }

  // 清除上傳
  clearUpload() {
    this.uploadedFile = null;
    document.getElementById('csvFile').value = '';
    document.getElementById('fileInfo').classList.remove('show');
    document.getElementById('processBtn').disabled = true;
    document.getElementById('previewSection').style.display = 'none';

    this.showMessage('已清除', 'success');
  }

  // 更新統計
  updateStats() {
    if (!this.currentData) return;

    document.getElementById('totalMolecules').textContent = this.currentData.total || 0;
    document.getElementById('lastUpdated').textContent = this.currentData.lastUpdated || '-';
  }

  // 顯示訊息
  showMessage(text, type = 'success') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type} show`;

    setTimeout(() => {
      messageEl.classList.remove('show');
    }, 5000);
  }

  // 格式化檔案大小
  formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}

// 初始化管理介面
document.addEventListener('DOMContentLoaded', () => {
  window.adminPanel = new AdminPanel();
});
