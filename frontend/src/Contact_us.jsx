import React, { useState } from 'react';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    cardCount: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 驗證必填邏輯
    if (!formData.name || !formData.cardCount) {
      setError('名字和評核卡數量必須填寫');
      return;
    }
    if (!formData.phone && !formData.email) {
      setError('電話和電郵至少填寫一個');
      return;
    }

    setError('');
    alert('表單已提交！');
    // 這裡可以加上送出到後端的邏輯
  };

  return (
    <div className="hero" id="home">
      <div className="contactus-content">
        <div className="hero-text">
          <h1>
            <span className="text-zh">聯絡我們</span>
            <span className="text-en">Contact Us</span>
          </h1>
          <p className="hero-description">
            <span className="text-zh">請填寫以下資料</span>
            <span className="text-en">Please fill in the form below</span>
          

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>名字 Name<span className="required" style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>電話 Telephone<span className="required" style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>電郵 Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>評核卡數量 Number of assessment cards<span className="required" style={{color: 'red'}}>*</span></label>
              <input
                type="number"
                name="cardCount"
                value={formData.cardCount}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="btn">提交</button>
          </form>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
