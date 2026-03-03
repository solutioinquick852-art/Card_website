import React, { useState } from 'react';
import CardDetail from './CardDetail';
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
      <div className="header">
        <h1>
          寶可夢卡牌查詢
          <span style={{ display: 'block', fontSize: '0.5em', fontWeight: 'normal', marginTop: '10px' }}>
            Pokémon Card Query
          </span>
        </h1>
        <p>
          您可以輸入一張寶可夢卡牌獨立編號以查詢資料庫中的描述和評級等級。
          <br />
          <span style={{ fontSize: '0.9em', opacity: 0.8 }}>
            Enter a Pokémon card ID to query the description and rating in the database.
          </span>
        </p>
      </div>

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
        <div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
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
  );
}

export default Home;
