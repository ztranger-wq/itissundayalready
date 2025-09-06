import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './JakshHero.css';

const JakshHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Premium Corporate Solutions",
      subtitle: "Elevate your brand with our custom badges, promotional merchandise, and corporate gifts",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200",
      cta: "Explore Corporate Collection",
      category: "Corporate & Promotional Merchandise"
    },
    {
      title: "Event & Branding Excellence",
      subtitle: "Make your events memorable with custom passes, wristbands, and branding solutions",
      image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1200",
      cta: "View Event Solutions",
      category: "Event & Branding Solutions"
    },
    {
      title: "Educational Institution Partners",
      subtitle: "Complete solutions for schools and institutions - ID cards, awards, and recognition items",
      image: "https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=1200",
      cta: "School Solutions",
      category: "School & Institutional Solutions"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="jaksh-hero">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-overlay" />
            <div className="container hero-content">
              <div className="hero-text">
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                <div className="hero-actions">
                  <Link 
                    to="/jaksh" 
                    className="hero-cta-primary"
                    onClick={() => {
                      setTimeout(() => {
                        document.querySelector('.products-section')?.scrollIntoView({ 
                          behavior: 'smooth' 
                        });
                      }, 100);
                    }}
                  >
                    {slide.cta}
                  </Link>
                  <Link to="/quote" className="hero-cta-secondary">
                    Get Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="hero-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
      
      <button 
        className="hero-nav prev"
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        className="hero-nav next"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
};

export default JakshHero;