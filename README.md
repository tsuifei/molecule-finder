# 🌿 Molecule Finder | 芳香分子查詢系統

精油化學成分多語言對照查詢系統,支援繁體中文、英文、法文三種語言的模糊搜尋。

![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ 功能特色

### 🔐 密碼保護機制
- 訪問網站需要輸入密碼
- 授權資訊儲存於 localStorage,有效期 24 小時
- 密碼: `france2026`

### 🔍 智慧搜尋
- **多語言搜尋**: 支援法文、英文、中文的模糊搜尋
- **即時結果**: 輸入關鍵字即時顯示相關分子
- **關鍵字高亮**: 搜尋結果中的關鍵字會被高亮顯示
- **資料統計**: 顯示資料庫中的分子總數

### 🌍 多語言介面
- 繁體中文 (預設)
- English
- Français

### 📊 資料管理
- **CSV 匯入**: 上傳 CSV 檔案更新分子資料
- **JSON 下載**: 下載資料為 JSON 格式
- **資料預覽**: 即時預覽上傳的資料
- **格式檢查**: 自動驗證 CSV 格式

### 📱 響應式設計
- 完整的 RWD 設計
- 支援桌面、平板、手機
- 自然療癒風格的 UI

## 🚀 快速開始

### 本地運行

1. Clone 專案
```bash
git clone <repository-url>
cd molecule-finder
```

2. 使用任何靜態伺服器運行
```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js http-server
npx http-server

# 使用 PHP
php -S localhost:8000
```

3. 開啟瀏覽器訪問
```
http://localhost:8000
```

4. 輸入密碼 `france2026` 進入系統

### GitHub Pages 部署

1. 將專案推送到 GitHub repository

2. 進入 Repository Settings > Pages

3. 設定 Source:
   - Branch: `main` (或你的主要分支)
   - Folder: `/ (root)`

4. 點擊 Save,等待部署完成

5. 訪問你的 GitHub Pages URL:
```
https://<username>.github.io/<repository-name>/
```

## 📁 專案結構

```
molecule-finder/
├── index.html              # 主頁面 (搜尋介面)
├── admin.html              # 管理介面
├── README.md              # 說明文件
├── Spec.md                # 功能規格
├── assets/
│   ├── css/
│   │   ├── style.css      # 主要樣式
│   │   └── admin.css      # 管理介面樣式
│   └── js/
│       ├── app.js         # 主應用程式
│       └── admin.js       # 管理介面邏輯
├── data/
│   └── molecule.json      # 分子資料檔案
├── uploads/               # 上傳檔案暫存
└── 芳香化學中英對照名稱-貢.xlsx  # 原始 Excel 資料
```

## 📝 CSV 格式說明

上傳的 CSV 檔案必須符合以下格式:

### 標題行 (必須)
```csv
法文,英文,中文
```

### 資料範例
```csv
法文,英文,中文
[6]-gingérol,[6]-gingerol,[6]-薑醇
1,8-cinéole,1,8-cineole,1,8-桉油醇
10-épi-γ-eudesmol,10-epi-γ-eudesmol,10-表-γ-桉葉醇
```

### 格式要求
- 第一行必須是標題: `法文,英文,中文`
- 使用逗號 (,) 分隔欄位
- 如果內容包含逗號,請用引號 `""` 包起來
- 檔案編碼必須是 UTF-8
- 每行代表一個分子

## 🔧 使用說明

### 一般使用者

1. **首次訪問**
   - 輸入密碼 `france2026`
   - 授權有效期為 24 小時

2. **搜尋分子**
   - 在搜尋框輸入關鍵字
   - 支援法文、英文、中文搜尋
   - 即時顯示相關結果

3. **切換語言**
   - 點擊頂部的語言按鈕
   - 介面語言會立即切換

### 管理員

1. **進入管理介面**
   - 點擊右下角的「資料管理」按鈕
   - 或直接訪問 `admin.html`

2. **上傳 CSV 資料**
   - 準備符合格式的 CSV 檔案
   - 拖放或點擊選擇檔案
   - 點擊「處理 CSV」按鈕
   - 預覽處理結果

3. **下載 JSON 資料**
   - 點擊「下載 JSON」按鈕
   - 將下載的檔案重新命名為 `molecule.json`
   - 替換 `data/molecule.json` 檔案
   - 推送到 GitHub (如果使用 GitHub Pages)

## 🎨 設計風格

採用「自然療癒」風格設計:
- 主色調: 綠色系 (#7ba892, #a8c9b8)
- 輔助色: 金色系 (#d4af7a)
- 柔和的陰影和圓角
- 舒適的視覺體驗

## 🛠️ 技術棧

- **前端**: 純 HTML5, CSS3, JavaScript (ES6+)
- **樣式**: 自定義 CSS (無框架依賴)
- **儲存**: localStorage (密碼授權)
- **部署**: GitHub Pages (靜態網站)

## 📊 資料來源

原始資料來自 Excel 檔案 `芳香化學中英對照名稱-貢.xlsx`,包含:
- 388 筆芳香分子資料
- 法文、英文、中文對照
- 精油化學成分資訊

## 🔒 安全性

- 密碼保護機制 (localStorage)
- 24 小時授權有效期
- 無後端,純前端驗證
- 適合內部或小型團隊使用

**注意**: 這是前端密碼保護,不適合高安全性需求的場景。如需更強的安全性,請考慮後端驗證方案。

## 📱 瀏覽器支援

- Chrome (推薦)
- Firefox
- Safari
- Edge
- 支援所有現代瀏覽器

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request!

## 📄 授權

MIT License

## 👨‍💻 作者

VibeCoding

---

## 🆘 常見問題

### Q: 忘記密碼怎麼辦?
A: 密碼是 `france2026`,寫在 `assets/js/app.js` 中。如需修改,請編輯該檔案。

### Q: 如何更新分子資料?
A:
1. 方法一: 準備 CSV 檔案,在管理介面上傳並下載 JSON,替換 `data/molecule.json`
2. 方法二: 直接編輯 `data/molecule.json` 檔案

### Q: GitHub Pages 部署後資料沒更新?
A: 確保新的 `molecule.json` 已推送到 repository,並清除瀏覽器快取。

### Q: 可以修改密碼嗎?
A: 可以。編輯以下檔案:
- `assets/js/app.js` (第 5 行)
- `assets/js/admin.js` (第 5 行)

### Q: 搜尋不到資料?
A: 檢查 `data/molecule.json` 檔案是否存在且格式正確。開啟瀏覽器 Console 查看錯誤訊息。

## 📞 聯絡

如有問題或建議,歡迎聯絡!
