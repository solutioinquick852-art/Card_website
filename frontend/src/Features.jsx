import React from 'react';

function Features() {
  return (
    <div className="features-section" id="features-section">
      <div className="info-item" style={{ marginBottom: '20px' }}>
        <div className="info-label">專業評級標準</div>
        <div className="info-value">
          <h1>
            <span className="text-zh">收藏有價，查分無憂</span>
            <span className="text-en">Collections have value, grading brings peace of mind</span>
          </h1>
          <p style={{ marginTop: '10px', lineHeight: '1.8', color: '#333' }}>
            快速輸入 PSA 編號，即可獲取卡牌的評級、真偽驗證與詳細資訊。
            不論是新手還是資深收藏家，都能輕鬆掌握卡牌價值。
            資料來源對接 PSA 官方，確保查詢結果真實可信。
          </p>
          <p style={{ marginTop: '10px', lineHeight: '1.8', color: '#00c49a' }}>
            Quickly enter a PSA certification number to access grading, authenticity verification, and detailed card information.
            Whether you’re a beginner or a seasoned collector, easily stay on top of your card’s value.
            Data is directly connected to PSA’s official source, ensuring authentic and trustworthy results.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Features;
