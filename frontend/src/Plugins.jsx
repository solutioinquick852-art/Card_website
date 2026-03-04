import React from 'react';

function Plugins() {
  return (
    <div className="container">
      <div className="header">
        <h1>
          搜卡功能
          <span style={{ display: 'block', fontSize: '0.5em', fontWeight: 'normal', marginTop: '10px' }}>
            Card Search Features
          </span>
        </h1>
      </div>

      <div className="card-detail">
        <div className="info-item" style={{ marginBottom: '20px' }}>
          <div className="info-value">
            <h3>快速查詢</h3>
            <p style={{ marginTop: '10px', lineHeight: '1.8', color: '#28a745' }}>
              輸入卡牌名稱或編號，即可快速查詢卡牌的評級與市場價值。
              無論是經典系列還是最新版本，都能在這裡找到專業的數據支持，讓收藏更安心。
            </p>
            <p style={{ marginTop: '10px', lineHeight: '1.8', color: '#00c49a' }}>
              Enter a card name or number to quickly search for grading and market value.
              Whether it's a classic series or the latest release, you can find professional data support here,
              making your collection more secure.
            </p>
          </div>
        </div>

        <div className="info-item" style={{ marginBottom: '20px' }}>
          <div className="info-label">功能特點</div>
          <div className="info-value">
            <ul style={{ lineHeight: '1.8', paddingLeft: '20px', color: '#333' }}>
              <li>🔍 <strong>智能搜索：</strong>支援模糊查詢，快速定位卡牌</li>
              <li>📊 <strong>詳細評級：</strong>展示專業評級分數與評價</li>
              <li>💰 <strong>市場價值：</strong>提供當前市場參考價格</li>
              <li>🖼️ <strong>高質圖片：</strong>清晰的卡牌圖片展示</li>
            </ul>
          </div>
        </div>

        <div className="info-item" style={{ marginBottom: '15px' }}>
          <div className="info-label">使用說明</div>
          <div className="info-value">
            <ol style={{ lineHeight: '1.8', paddingLeft: '20px', color: '#333' }}>
              <li>在搜尋框中輸入卡牌編號或名稱</li>
              <li>點擊「搜索」按鈕進行查詢</li>
              <li>查看詳細的評級資訊與市場價值</li>
              <li>如需進一步了解，歡迎聯繫我們</li>
            </ol>
          </div>
        </div>

        <div className="info-item" style={{ marginBottom: '15px' }}>
          <div className="info-label">支持的系列</div>
          <div className="info-value">
            <p>我們支持以下系列的卡牌查詢：</p>
            <ul style={{ marginTop: '10px', paddingLeft: '20px', color: '#333' }}>
              <li>🌟 <strong>經典系列：</strong>初代至三代</li>
              <li>🔥 <strong>現代系列：</strong>四代至九代</li>
              <li>✨ <strong>特殊系列：</strong>特別活動、限定版本</li>
              <li>🎴 <strong>收藏品：</strong>稀有卡牌、紀念版</li>
            </ul>
          </div>
        </div>

        <div className="info-item" style={{ marginBottom: '15px' }}>
          <div className="info-label">專業保障</div>
          <div className="info-value">
            <p>所有評級數據均由專業團隊提供：</p>
            <ul style={{ marginTop: '10px', paddingLeft: '20px', color: '#333' }}>
              <li>🏆 經驗證的評級標準</li>
              <li>📋 詳細的評級報告</li>
              <li>🔐 安全的數據保護</li>
              <li>🤝 及時的客戶支持</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Plugins;
