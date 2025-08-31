import React, { useEffect, useState } from 'react';
import './ImageSlider.css';

const images = [
  '/login1.png',
  '/login2.png',
  '/login3.png',
  '/login4.png',
  '/login5.png',
  // 👉 Thêm nhiều ảnh khác tại đây nếu cần
];

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []); // ✅ Đảm bảo luôn dùng đúng số lượng ảnh

  return (
    <div className="image-slider">
      <img
        src={images[current]}
        alt={`Slide ${current + 1}`}
        className="slider-image"
      />
      <div className="slider-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)} // ✅ Click dot để chuyển ảnh
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;