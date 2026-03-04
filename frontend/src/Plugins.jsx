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
            <h1>
              <span className="text-zh">一鍵查詢，真偽盡在掌握</span>
              <span className="text-en">One-click lookup, authenticity at your fingertips</span>
            </h1>
            <p style={{ marginTop: '10px', lineHeight: '1.8', color: '#28a745' }}>
              輸入卡牌名稱或編號，即可快速獲得卡牌的評級。
              無論是經典系列還是最新版本，都能在這裡找到專業的數據支持，讓收藏更安心。
            </p>
            <p style={{ marginTop: '10px', lineHeight: '1.8', color: '#00c49a' }}>
              Enter a card name or number to quickly search for grading and market value.
              Whether it's a classic series or the latest release, you can find professional data support here,
              making your collection more secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Plugins;
