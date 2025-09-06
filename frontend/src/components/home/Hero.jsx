import React from 'react';
import { Link } from 'react-router-dom';
import './NewHero.css';

const Hero = () => {
  const msImages = Array.from({ length: 50 }, (_, i) => `/ms-images/ms-image-${i + 1}.png`);
  const jakshImages = Array.from({ length: 50 }, (_, i) => `/jaksh-images/jaksh-image-${i + 1}.png`);

  // Helper to split images into columns
  const renderColumns = (images, baseKey) => {
    const columns = [[], [], [], []];
    images.forEach((src, index) => {
      columns[index % 4].push(
        <div key={`${baseKey}-${index}`} className="grid-item">
          <img src={src} alt={`${baseKey} sample ${index + 1}`} />
        </div>
      );
    });
    // Duplicate for seamless scroll
    images.forEach((src, index) => {
        columns[index % 4].push(
          <div key={`${baseKey}-duplicate-${index}`} className="grid-item">
            <img src={src} alt={`${baseKey} sample ${index + 1}`} />
          </div>
        );
      });

    return columns.map((column, i) => (
        <div key={`${baseKey}-col-${i}`} className="scrolling-column-wrapper">
            <div className="scrolling-column">
                {column}
            </div>
        </div>
    ));
  };

  return (
    <section className="new-hero-section">
      <Link to="/products" className="hero-link left">
        <div className="scrolling-grid-container up">
          {renderColumns(msImages, 'ms')}
        </div>
        <div className="hero-text-overlay">
          <div className="cloud-background"></div>
          <h2>MS Labels</h2>
        </div>
      </Link>
      <Link to="/jaksh" className="hero-link right">
        <div className="scrolling-grid-container down">
          {renderColumns(jakshImages, 'jaksh')}
        </div>
        <div className="hero-text-overlay">
          <div className="cloud-background"></div>
          <h2>Jaksh Collection</h2>
        </div>
      </Link>
    </section>
  );
};

export default Hero;