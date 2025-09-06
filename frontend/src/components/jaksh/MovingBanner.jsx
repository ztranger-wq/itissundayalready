import './MovingBanner.css';

const MovingBanner = () => {
  const offers = [
    "🎉 Big Offer: 30% OFF on selected corporate merchandise",
    "🚀 Free shipping on orders above ₹2000",
    "⭐ New arrival: Premium badge collection now available",
    "💼 Bulk orders? Contact us for special pricing"
  ];

  const [currentOffer, setCurrentOffer] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [offers.length]);

  return (
    <div className="moving-banner">
      <div className="banner-content">
        <span className="moving-banner-text">{offers[currentOffer]}</span>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';

export default MovingBanner;