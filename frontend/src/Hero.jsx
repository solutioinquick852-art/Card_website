import React from 'react';

function Hero() {
  return (
    <div className="hero" >
      <div className="hero-content">
        <div className="hero-image">
          <img
            src="/assets/card1.jpg"
            alt="寶可夢卡牌"
            className="hero-pokemon"
          />
          <div className="hero-badge">
            <span className="badge-text">專業查分</span>
          </div>
        </div>
        <div className="hero-text">
          <h1>
            <span className="text-zh">專業查分，守護你的收藏價值</span>
            <span className="text-en">Professional grading, protecting your collection’s worth</span>
          </h1>
          <p className="hero-description">
            <span className="text-zh">
              我們提供專業的卡牌評級與收藏服務，讓每一張卡牌的稀有度與價值都能被準確呈現。
              透過嚴謹的檢測流程與標準化的評級系統，收藏者可以放心地展示與交易，
              確保卡牌的真實性與市場認可度。
            </span>
            <span className="text-en">
              We provide professional card grading and collection services, ensuring that the rarity and value of every card are accurately represented.
              Through a rigorous inspection process and a standardized grading system, collectors can confidently showcase and trade their cards,
              guaranteeing authenticity and market recognition.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
