# GitHub Repository 創建完成！

✅ **Repository URL**: https://github.com/solutioinquick852-art/Card_website

## 📊 項目

### 已完成
- ✅ Git repository 初始化
- ✅ 所有文件已添加到暫存區
- ✅ 創建初始 commit
- ✅ GitHub public repository 創建
- ✅ 遠程 origin 已配置
- ✅ 代碼已推送到 GitHub

### Repository 信息
- **倉庫名稱**: Card_website
- **所有者**: solutioinquick852-art
- **可見性**: Public
- **默認分支**: main
- **創建時間**: 2026-03-02

### 推送的文件結構
```
card-inventory/
├── backend/
│   ├── Dockerfile
│   ├── db.js
│   ├── index.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.jsx
│       ├── components/
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminLogin.jsx
│       │   ├── CardDetail.jsx
│       │   ├── CardModal.jsx
│       │   ├── Home.jsx
│       ├── index.css
│       └── index.js
├── database/
│   ├── init.sql          ⭐ 完整初始化脚本（表結構 + 索引 + 測試數據 + 預設管理員）
│   ├── schema.sql        📋 基礎表結構定義
│   └── migration.sql    🔄 遷移腳本（ALTER TABLE）
├── docker-compose.yml     🐳 Docker 配置
├── DEPLOYMENT_INFO.md   📖 部署信息
├── RENDER_DEPLOYMENT.md 🚀 Render 部署指南
├── GITHUB_SETUP.md       📝 GitHub 設置指南（本文件）
├── README.md            📖 完整文檔
└── setup.sh
```

## ⭐ init.sql - 完整初始化脚本

**位置**: `database/init.sql`

**功能**：
1. ✅ 刪除舊表（如果存在）
2. ✅ 創建完整表結構（cards + admins）
3. ✅ 創建所有必要索引
4. ✅ 插入預設管理員
5. ✅ 插入 15 張測試卡牌
6. ✅ 創建統計視圖（card_type_stats, card_level_stats）
7. ✅ 添加詳細註釋說明
8. ✅ 配置權限（GRANT）
9. ✅ 包含使用說明

**支持的數據類型**：
- 卡牌編號：VARCHAR(30) - 最多 30 位數字
- 卡牌名稱：VARCHAR(2000) - 最多 2000 字符
- 卡牌分數：NUMERIC(4,1) - 支持 1 位小數
- 卡牌數量：INTEGER
- 圖片 URL：TEXT（最多 3 個）
- 卡牌類型：VARCHAR(50)
- 管理員密碼：TEXT（bcrypt 哈希）

**預設測試數據**：
- 11 張皮卡丘（電系，分數 5.0-10.0）
- 2 張噴火龍（火系）
- 1 張水箭龜（水系）
- 1 張妙蛙種子（草系）
- 1 張超夢（超能力系）
- 1 張耿鬼（幽靈系）
- 1 張快龍（龍系）
- 3 張雷丘（電系）

**統計視圖**：
- card_type_stats：按卡牌類型統計（總數量、平均分數、最高分數、最低分數）
- card_level_stats：按卡牌等級統計（每個等級的數量）

**預設管理員**：
- 用戶名：admin
- 密碼：admin123
- 密碼哈希：$2a$10$xw.zVJTGyUA.FKWmG9SNx.oWX9DCOonFoy4oRDvhNRkm60TANon7e

**使用方法**：

### 方法 1：本地部署（Docker）

```bash
# 啟動 Docker 容器
docker compose up -d

# 執行初始化腳本
docker compose exec -T postgres psql -U postgres card_inventory < database/init.sql

# 或者直接進入 psql
docker compose exec postgres psql -U postgres card_inventory
```

### 方法 2：Render 部署

**步驟 1：在 Render PostgreSQL 控制台執行**

1. 打開 Render Dashboard
2. 找到你的 PostgreSQL 服務
3. 點擊 "Query" 或 "psql shell"
4. 複製下面的 SQL 並執行

**步驟 2：驗證初始化**

執行以下查詢驗證：

```sql
-- 檢查表是否創建
SELECT * FROM cards LIMIT 5;

-- 檢查管理員是否創建
SELECT * FROM admins;

-- 檢查統計視圖
SELECT * FROM card_type_stats;
SELECT * FROM card_level_stats;
```

**步驟 3：配置後端環境變量**

在後端服務中設置以下環境變量：

```
DB_HOST=你的數據庫主機
DB_PORT=5432
DB_NAME=card_inventory
DB_USER=你的數據庫用戶名
DB_PASSWORD=你的數據庫密碼
PORT=3000
STATIC_KEY=admin1
```

**步驟 4：初始化數據庫（重要！）**

⚠️ **數據庫密碼只顯示一次！**

首次部署後：
1. 立即修改管理員密碼（使用管理面板的「修改密碼」功能）
2. 金輪：`admin1`
3. 新密碼和確認密碼必須相同
4. 修改後，舊密碼將失效

## 📋 表結構詳解

### cards 表
```sql
欄位名稱           | 類型              | 說明
------------------|-------------------|--------
id                 | SERIAL PRIMARY KEY  | 主鍵
card_id            | VARCHAR(30) UNIQUE   | 卡牌編號（唯一，1-30位數字）
card_name           | VARCHAR(2000)       | 卡牌名稱（最多2000字符）
card_level          | VARCHAR(50)         | 卡牌等級（UR, SSR, SR, R等）
card_score          | NUMERIC(4,1)     | 卡牌分數（支持1位小數）
card_quantity       | INTEGER             | 卡牌數量
image_url1          | TEXT                | 第一張圖片URL
image_url2          | TEXT                | 第二張圖片URL
image_url3          | TEXT                | 第三張圖片URL
card_type           | VARCHAR(50)         | 卡牌類型/種類（電、火、水等）
created_at          | TIMESTAMP           | 創建時間
updated_at          | TIMESTAMP           | 更新時間
```

### admins 表
```sql
欄位名稱           | 類型              | 說明
------------------|-------------------|--------
id                 | SERIAL PRIMARY KEY  | 主鍵
username            | VARCHAR(100) UNIQUE   | 管理員用戶名（唯一）
password_hash       | TEXT                | 密碼哈希（bcrypt加密）
created_at          | TIMESTAMP           | 創建時間
updated_at          | TIMESTAMP           | 更新時間
```

### 索引

```sql
idx_cards_card_id    - 卡牌編號索引（加速查詢）
idx_cards_type      - 卡牌類型索引（統計查詢）
idx_cards_score     - 卡牌分數索引（範圍查詢）
```

### 統計視圖

```sql
card_type_stats  - 卡牌類型統計視圖
  ├─ card_type      VARCHAR(50)     - 卡牌類型
  ├─ total_count     INTEGER          - 總數量
  ├─ avg_score       NUMERIC(5,2)    - 平均分數
  ├─ max_score       NUMERIC(4,1)    - 最高分數
  └─ min_score       NUMERIC(4,1)    - 最低分數

card_level_stats  - 卡牌等級統計視圖
  ├─ card_level      VARCHAR(50)     - 卡牌等級
  └─ total_count     INTEGER          - 總數量
```

## 🔧 權限配置

```sql
-- 授予 postgres 用戶所有權限
GRANT SELECT, INSERT, UPDATE, DELETE ON cards TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON admins TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON card_type_stats TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON card_level_stats TO postgres;
GRANT USAGE ON SCHEMA public TO postgres;
```

## 📝 文檔說明

### database/schema.sql
包含基本的表結構定義，用於參考。

### database/migration.sql
包含 ALTER TABLE 語句，用於遷移或更新表結構。

### database/init.sql
完整的初始化脚本，包含：
- 刪除舊表
- 創建所有表和索引
- 插入預設管理員
- 插入測試數據
- 創建統計視圖
- 配置權限
- 添加詳細註釋

## 🔄 schema.sql vs init.sql vs migration.sql

| 腳本 | 用途 | 內容 |
|--------|------|------|
| schema.sql | 基礎定義 | CREATE TABLE 語句 |
| init.sql | 完整初始化 | DROP + CREATE + INDEX + INSERT + GRANT |
| migration.sql | 結構遷移 | ALTER TABLE 語句 |

## 🚀 重要提示

1. **首次部署**
   - init.sql 會創建所有表和數據
   - 只需執行一次即可
   - 不要重複執行

2. **數據庫密碼**
   - 只在首次創建時顯示
   - 請務必記錄！
   - 使用管理面板修改密碼功能

3. **權限配置**
   - 已配置 GRANT 權限
   - 允許 postgres 用戶完全訪問

4. **測試數據**
   - 包含 15 張卡牌
   - 覆蓋多種類型和等級
   - 可用於測試各種功能

5. **統計視圖**
   - card_type_stats：實時統計各類型卡牌
   - card_level_stats：統計各等級卡牌數量
   - 可用於管理面板的統計功能

6. **表名約定**
   - cards：卡牌表
   - admins：管理員表
   - card_type_stats：類型統計
   - card_level_stats：等級統計

## 📊 項目總結

**總文件數**：10 個
**代碼行數**：約 4000+ 行
**數據庫表數**：4 個主表 + 2 個統計視圖
**測試數據**：15 張卡牌
**功能覆蓋**：搜索、CRUD、統計、認證、密碼管理

## 📝 更新歷史

### 版本 1.0 (2026-03-02)
- ✅ 初始項目設置
- ✅ 完整功能開發
- ✅ 前後端分離架構
- ✅ Docker 部署支持
- ✅ Render 雲部署準備

## 📖 相關文檔

- `RENDER_DEPLOYMENT.md` - Render 平台部署指南
- `DEPLOYMENT_INFO.md` - 本地部署信息
- `README.md` - 完整項目文檔

## 🔍 查詢示例

### 測試數據
```sql
-- 查詢所有電系卡牌
SELECT * FROM cards WHERE card_type = '電';

-- 查詢高分數卡牌（>9.0）
SELECT * FROM cards WHERE card_score > 9.0 ORDER BY card_score DESC;

-- 查詢統計
SELECT
    card_type,
    COUNT(*) as total,
    AVG(card_score) as avg_score,
    MAX(card_score) as max_score,
    MIN(card_score) as min_score
FROM cards
GROUP BY card_type
ORDER BY avg_score DESC;
```

---

**下次部署時，只需要在 Render PostgreSQL 控制台執行一次 init.sql 即可完成所有初始化工作！**

**版本**: 1.0
**更新時間**: 2026-03-02
