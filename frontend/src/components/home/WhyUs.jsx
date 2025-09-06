import './WhyUs.css';

const features = [
    { title: "Quality Above All", description: "We use the best materials and advanced techniques to create durable, lightweight, and strong labels." },
    { title: "Customised Fit", description: "Every detail, from size and color to design and material, is tailored to reflect your brand's unique identity." },
    { title: "Feedback & Iteration", description: "We involve you in every step, making iterations based on your feedback to ensure complete satisfaction." },
    { title: "Affordable Pricing", description: "We offer premium quality labels at attractive prices, providing the best value for your money." }
];

const WhyUs = () => {
  return (
    <section id="why-us" className="why-us-section">
      <div className="container">
        <h2>Why Choose Us?</h2>
        <div className="why-us-grid">
          {features.map((feature, index) => (
            <div key={index} className="why-us-card">
              <h3 className="text-xl font-semibold mb-3 text-main-red">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
