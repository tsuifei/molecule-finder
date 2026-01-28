# 🚀 部署指南

## GitHub Pages 部署步驟

### 1. 初始化 Git Repository (如果尚未初始化)

```bash
cd molecule-finder
git init
git add .
git commit -m "Initial commit: Molecule Finder v1.0"
```

### 2. 建立 GitHub Repository

1. 登入 GitHub
2. 點擊右上角的 `+` > `New repository`
3. 輸入 Repository 名稱,例如: `molecule-finder`
4. 選擇 `Public` (GitHub Pages 需要)
5. 不要勾選 "Initialize this repository with a README"
6. 點擊 `Create repository`

### 3. 連結本地與遠端 Repository

```bash
# 替換成你的 GitHub username 和 repository 名稱
git remote add origin https://github.com/<your-username>/molecule-finder.git
git branch -M main
git push -u origin main
```

### 4. 啟用 GitHub Pages

1. 進入你的 GitHub Repository 頁面
2. 點擊 `Settings` (設定)
3. 在左側選單找到 `Pages`
4. 在 **Source** 部分:
   - Branch: 選擇 `main`
   - Folder: 選擇 `/ (root)`
5. 點擊 `Save`
6. 等待 1-2 分鐘,頁面會顯示網站 URL

### 5. 訪問你的網站

網站 URL 格式:
```
https://<your-username>.github.io/molecule-finder/
```

### 6. 後續更新

當你修改程式碼或更新資料後:

```bash
git add .
git commit -m "Update: 描述你的修改"
git push
```

GitHub Pages 會自動重新部署,約 1-2 分鐘後生效。

---

## 本地測試

部署前建議先在本地測試:

### 使用 Python

```bash
cd molecule-finder
python3 -m http.server 8000
```

訪問: http://localhost:8000

### 使用 Node.js

```bash
npx http-server
```

### 使用 PHP

```bash
php -S localhost:8000
```

---

## 常見問題

### Q: 部署後出現 404 錯誤?

**可能原因與解決方案:**

1. **路徑問題**: 確保所有資源路徑都是相對路徑
   - ✅ `./assets/css/style.css`
   - ❌ `/assets/css/style.css`

2. **GitHub Pages 尚未生效**: 等待 1-2 分鐘再刷新

3. **檔案未推送**: 確認所有檔案都已推送到 GitHub
   ```bash
   git status  # 檢查是否有未提交的檔案
   ```

### Q: CSS 或 JS 沒有載入?

1. 開啟瀏覽器開發者工具 (F12)
2. 查看 Console 是否有錯誤
3. 檢查 Network 標籤,確認檔案是否載入失敗
4. 確保路徑正確且檔案已推送到 GitHub

### Q: 資料更新後沒有反應?

1. 清除瀏覽器快取 (Ctrl+Shift+R 或 Cmd+Shift+R)
2. 確認新的 `molecule.json` 已推送到 GitHub
3. 等待 GitHub Pages 重新部署完成

### Q: 密碼不正確?

確認密碼是 `france2026`

如需修改密碼,編輯以下檔案:
- `assets/js/app.js` (第 5 行)
- `assets/js/admin.js` (第 5 行)

---

## 使用自訂網域 (選用)

如果你有自己的網域:

1. 在 Repository 根目錄建立 `CNAME` 檔案:
   ```
   yourdomain.com
   ```

2. 在你的網域提供商設定 DNS:
   ```
   Type: CNAME
   Name: @ (或 www)
   Value: <your-username>.github.io
   ```

3. 在 GitHub Pages 設定中輸入自訂網域

詳細說明: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

---

## 安全性提醒

⚠️ **重要**: 此系統使用前端密碼驗證,不適合高安全性需求的場景。

- 密碼儲存在 JavaScript 程式碼中 (可被檢視)
- 使用 localStorage 儲存授權 (可被清除)
- 適合內部使用或小型團隊

如需更高安全性,請考慮:
- 使用後端 API 進行驗證
- 使用 OAuth 或其他身份驗證服務
- 將網站設為 Private (需要 GitHub Pro)

---

## 效能優化建議

1. **壓縮圖片**: 如果有圖片資源,使用壓縮工具減少大小
2. **啟用快取**: GitHub Pages 已自動啟用
3. **CDN 加速**: 可考慮使用 Cloudflare 等 CDN 服務

---

## 備份建議

定期備份重要資料:
- `data/molecule.json` - 分子資料
- `芳香化學中英對照名稱-貢.xlsx` - 原始 Excel 資料

建議將備份存放在:
- 另一個 Git branch
- Google Drive / Dropbox
- 本地電腦

---

## 需要協助?

- 查看 [README.md](./README.md) 完整說明文件
- 查看 [GitHub Pages 官方文件](https://docs.github.com/en/pages)
- 檢查瀏覽器 Console 的錯誤訊息

---

祝你部署順利! 🎉
