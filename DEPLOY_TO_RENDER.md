# 部署到 Render 指南

本指南將幫助你將卡牌倉庫管理系統一鍵部署到 Render 平台。

## 🎯 已完成的修改

我已為你的項目準備好 Render 部署所需的所有文件：

### ✅ 新增文件
1. **`Dockerfile.render`** - 針對 Render 優化的 Dockerfile
   - 動態端口支持（Render 分配端口）
   - 自動數據庫初始化
   - 整合前端和後端在同一容器中

2. **`render.yaml`** - Render Blueprint 配置文件
   - 定義服務和數據庫
   - 自動設置環境變量
   - 一鍵部署配置

3. **`nginx-render.conf.template`** - Nginx 配置模板
   - 支持動態端口
   - API 代理配置

### ✅ 修改的文件
1. **`backend/index.js`** - 後端服務
   - 添加 `/api/health` 健康檢查端點（Render 必需）
   - 添加自動數據庫表初始化
   - 保持現有 API 功能

2. **`Dockerfile`** - 更新以支持動態端口

## 🚀 一鍵部署步驟

### 方法 1：使用 Render Blueprint（推薦）

1. **推送代碼到 GitHub**
   ```bash
   git add .
   git commit -m "準備 Render 部署"
   git push origin main
   ```

2. **訪問 Render Dashboard**
   - 打開 https://dashboard.render.com
   - 點擊 **New +** → **Blueprints**

3. **連接 GitHub 倉庫**
   - 選擇你的倉庫 `solutioinquick852-art/Card_website`
   - Render 會自動檢測 `render.yaml`

4. **配置部署**
   - 服務名稱：`card-inventory`（或自定義）
   - 區域：`Singapore`（或離你最近的）
   - 計劃：`Free`

5. **點擊 Apply**
   - Render 會自動創建：
     - Web Service（應用）
     - PostgreSQL 數據庫
     - 所有環境變量

### 方法 2：手動部署

1. **在 Render 創建 PostgreSQL 數據庫**
   - 點擊 **New +** → **PostgreSQL**
   - 名稱：`card-inventory-db`
   - 數據庫：`card_inventory`
   - 用戶：`admin`
   - 區域：`Singapore`

2. **記錄數據庫連接信息**
   - 保存 External Database URL
   - 保存用戶名和密碼

3. **創建 Web Service**
   - 點擊 **New +** → **Web Service**
   - 連接 GitHub 倉庫
   - 配置：
     - **名稱**：`card-inventory`
     - **根目錄**：`.` 
     - **運行時**：`Docker`
     - **Dockerfile 名稱**：`Dockerfile.render`
     - **計劃**：`Free`

4. **設置環境變量**
   ```
   DB_HOST=<從數據庫URL解析的主機>
   DB_PORT=5432
   DB_NAME=card_inventory
   DB_USER=<數據庫用戶名>
   DB_PASSWORD=<數據庫密碼>
   STATIC_KEY=admin1
   ```

5. **點擊 Create Web Service**
   - 等待構建完成（約 5-10 分鐘）

## 🔧 環境變量說明

| 變量 | 描述 | 默認值 |
|------|------|--------|
| `DB_HOST` | PostgreSQL 主機地址 | （從 Render 數據庫獲取） |
| `DB_PORT` | PostgreSQL 端口 | 5432 |
| `DB_NAME` | 數據庫名稱 | card_inventory |
| `DB_USER` | 數據庫用戶名 | （從 Render 數據庫獲取） |
| `DB_PASSWORD` | 數據庫密碼 | （從 Render 數據庫獲取） |
| `STATIC_KEY` | 管理員密碼重置金輪 | admin1 |

## 🌐 訪問應用

部署完成後：
- **網站 URL**：`https://card-inventory.onrender.com`
- **管理面板**：`https://card-inventory.onrender.com/card_admin`
- **API 健康檢查**：`https://card-inventory.onrender.com/api/health`

### 默認登入憑證
- **用戶名**：`admin`
- **密碼**：`admin123`

⚠️ **重要**：首次登入後請立即修改密碼！

## 📊 功能檢查清單

部署後請測試：

### 基本功能
- [ ] 訪問主頁顯示正常
- [ ] 搜索卡牌功能正常
- [ ] 卡牌詳情頁顯示正常

### 管理功能
- [ ] 登入管理面板 (`/card_admin`)
- [ ] 添加新卡牌
- [ ] 編輯現有卡牌
- [ ] 刪除卡牌
- [ ] 修改管理員密碼

### 數據庫功能
- [ ] 數據庫表自動創建
- [ ] 默認管理員帳戶存在
- [ ] 卡牌數據可以保存

## 🐛 故障排除

### 構建失敗
1. **檢查 Dockerfile.render** 語法
2. **查看 Render 構建日誌**
3. **確認 GitHub 倉庫權限**

### 應用啟動失敗
1. **檢查環境變量** 是否正確
2. **查看運行時日誌**
3. **確認數據庫連接**

### 數據庫連接錯誤
1. **驗證數據庫主機和端口**
2. **檢查用戶名和密碼**
3. **確認數據庫已運行**

### 前端無法訪問 API
1. **檢查 Nginx 配置**
2. **確認後端服務運行**（端口 3000）
3. **查看瀏覽器開發者工具**

## 🔄 更新部署

當你需要更新代碼時：

1. **本地修改代碼**
2. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "更新描述"
   git push origin main
   ```
3. **Render 會自動重新部署**

## 📝 項目結構說明

```
card_website/
├── backend/              # Node.js 後端
│   ├── index.js         # 主服務器文件（已修改）
│   ├── db.js           # 數據庫連接
│   └── package.json    # 依賴
├── frontend/            # React 前端
│   ├── src/            # 源代碼
│   └── package.json    # 依賴
├── Dockerfile.render    # Render 專用 Dockerfile
├── render.yaml          # Render Blueprint
├── nginx-render.conf.template  # Nginx 模板
└── DEPLOY_TO_RENDER.md  # 本文件
```

## 💡 優化建議

### 性能優化
1. **啟用 CDN**：Render 免費計劃不帶 CDN
2. **圖片優化**：壓縮卡牌圖片
3. **數據庫索引**：已自動創建

### 安全建議
1. **修改默認密碼**：`admin123` → 強密碼
2. **更換 STATIC_KEY**：`admin1` → 隨機字符串
3. **啟用 HTTPS**：Render 自動提供

### 監控建議
1. **設置警報**：在 Render Dashboard
2. **定期備份**：數據庫自動備份
3. **日誌分析**：查看訪問日誌

## 📞 支持

### Render 資源
- [Render 文檔](https://render.com/docs)
- [Render 社區](https://community.render.com)
- [狀態頁面](https://status.render.com)

### 項目文檔
- `README.md` - 項目完整文檔
- `RENDER_DEPLOYMENT.md` - 詳細部署指南
- `QUICKSTART.md` - 快速開始

## 🎉 完成！

你的卡牌倉庫管理系統現在已經準備好部署到 Render。按照上述步驟操作，幾分鐘內即可擁有在線可用的應用。

**部署成功後請測試所有功能並及時修改默認密碼！**

---
**修改時間**：2026-03-02  
**修改者**：OpenClaw Assistant  
**版本**：1.0