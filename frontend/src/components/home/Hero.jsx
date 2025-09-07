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
          <img
            className="grid-img"
            src={src}
            alt={`${baseKey} sample ${index + 1}`}
            loading="lazy"
            decoding="async"
          />
        </div>
      );
    });

    // Duplicate each column's items for seamless repeat
    const duplicatedColumns = columns.map((col, colIndex) => {
      // create shallow clones with unique keys for duplicates
      const duplicates = col.map((child, idx) =>
        React.cloneElement(child, { key: `${baseKey}-dup-${colIndex}-${idx}` })
      );

      return (
        <div key={`${baseKey}-col-${colIndex}`} className="scrolling-column-wrapper">
          <div className="scrolling-column">
            {/* original content */}
            {col}
            {/* duplicate content immediately after for seamless loop */}
            {duplicates}
          </div>
        </div>
      );
    });

    return duplicatedColumns;
  };

  return (
    <section className="new-hero-section">
      {/* LEFT */}
      <Link to="/products" className="hero-link left hero-split">
        <div className="scrolling-grid-container up">
          {renderColumns(msImages, 'ms')}
        </div>

        <div className="hero-text-overlay">
          <div className="cloud-background"></div>
          <h2>MS Enterprises</h2>
        </div>
      </Link>

      {/* RIGHT */}
      <Link to="/jaksh" className="hero-link right hero-split">
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
