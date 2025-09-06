import './About.css';
import { useScrollAnimate } from '../../hooks/useScrollAnimate';

const About = () => {
  const [imageRef, imageClasses] = useScrollAnimate();
  const [contentRef, contentClasses] = useScrollAnimate({ threshold: 0.3 });

  return (
    <section id="about" className="about-section">
      <div className="container about-container">
        <div ref={imageRef} className={`about-image-container image-reveal-container ${imageClasses}`}>
          <img src="https://placehold.co/600x400/e50000/white?text=Mr.+Deepak+Singla" alt="CEO Deepak Singla" className="about-image" />
        </div>
        <div ref={contentRef} className={`about-content ${contentClasses}`}>
          <h2 className="scroll-animate">About MS Enterprises</h2>
          <p>Established in 2009, M. S. Enterprises is a leading manufacturer, wholesaler, retailer, and exporter of a wide range of products including Garment Labels, Shirt Labels, Brand Labels, Printed Labels, Woven Labels, and Security Uniforms Labels.</p>
          <p>Our products are known for their unique attributes like long-lasting quality, light weight, and high strength, all achieved by using the best quality materials and advanced techniques.</p>
          <div className="ceo-message">
            <h3 className="ceo-message-title">Message from the CEO</h3>
            <p className="ceo-message-text">"With over 25 years of expertise in the label industry, I lead MS Enterprises with a vision of excellence and innovation. We continuously strive to exceed customer expectations, offering customized solutions to meet every unique need."</p>
            <p className="ceo-message-signature">- Mr. Deepak Singla</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
