import React, { useState } from 'react';
import Hero from './Hero';
import Features from './Features';
import Plugins from './Plugins';
import axios from 'axios';

// 整合 Docker 使用相對路徑，獨立部署使用完整 URL
const API_URL = process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setCardData(null);

    try {
      const response = await axios.get(`${API_URL}/api/cards/search?card_id=${searchQuery}`);
      setCardData(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('找不到該寶可夢卡牌');
      } else {
        setError('搜索失敗，請稍後再試');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Hero />
      <Features />
      <Plugins />
      <div className="search-section" id="search-section">
        <div className="search-box">
          <form onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="輸入寶可夢卡牌獨立編號(Input Pokémon Card No.)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                🔍 搜索(Search)
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#28a745' }}>
            搜索中(Searching)...
          </div>
        )}

        {error && (
          <div className="error-message" style={{ maxWidth: '600px', margin: '20px auto' }}>
            {error}
          </div>
        )}

        {cardData && <CardDetail card={cardData} />}
      </div>
    </div>
  );
}

function CardDetail({ card }) {
  if (!card) return null;

  return (
    <div className="card-detail">
      <div className="card-detail-header">
        <h2>卡牌詳情</h2>
      </div>

      <div className="info-item" style={{ marginBottom: '20px' }}>
        <div className="info-label">卡牌編號</div>
        <div className="info-value">{card.card_id}</div>
      </div>

      <div className="info-item" style={{ marginBottom: '20px' }}>
        <div className="info-label">卡牌名稱</div>
        <div className="info-value">{card.name}</div>
      </div>

      {card.description && (
        <div className="info-item" style={{ marginBottom: '20px' }}>
          <div className="info-label">描述</div>
          <div className="info-value">{card.description}</div>
        </div>
      )}

      {card.rating && (
        <div className="info-item" style={{ marginBottom: '20px' }}>
          <div className="info-label">評級</div>
          <div className="info-value">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
              {card.rating.grade}
            </div>
            <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>
              評分: {card.rating.score}/10
            </div>
          </div>
        </div>
      )}

      {card.market_value && (
        <div className="info-item" style={{ marginBottom: '20px' }}>
          <div className="info-label">市場價值</div>
          <div className="info-value">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00c49a' }}>
              ${card.market_value.value}
            </div>
            <div style={{ fontSize: '0.9rem', marginTop: '5px', color: '#666' }}>
              估值日期: {new Date(card.market_value.valuation_date).toLocaleDateString('zh-HK')}
            </div>
          </div>
        </div>
      )}

      {card.images && card.images.length > 0 && (
        <div className="card-images-section">
          <div className="extra-info-title">卡牌圖片</div>
          <div className="card-images">
            {card.images.map((img, index) => (
              <div key={index} className="card-image-wrapper">
                <img
                  src={img.url}
                  alt={`${card.name} - ${index}`}
                  className="card-image"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {card.rarity && (
        <div className="info-item" style={{ marginBottom: '15px' }}>
          <div className="info-label">稀有度</div>
          <div className="info-value" style={{ color: '#ff6b00', fontWeight: 'bold' }}>
            {card.rarity}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
