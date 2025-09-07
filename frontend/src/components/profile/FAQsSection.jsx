import './FAQsSection.css';

const FAQsSection = () => {
  return (
    <div className="faqs-content">
      <div className="section-header">
        <h3>Frequently Asked Questions</h3>
        <p>Find answers to common questions</p>
      </div>
      <div className="faqs-list">
        <div className="faq-item">
          <h4>How do I track my order?</h4>
          <p>You can track your order using the tracking number provided in your order confirmation email.</p>
        </div>
        <div className="faq-item">
          <h4>What is your return policy?</h4>
          <p>We offer a 30-day return policy for most items. Please check the product page for specific return conditions.</p>
        </div>
        <div className="faq-item">
          <h4>How do I change my shipping address?</h4>
          <p>You can update your shipping address in the Addresses section of your profile.</p>
        </div>
        <div className="faq-item">
          <h4>What payment methods do you accept?</h4>
          <p>We accept all major credit cards, debit cards, UPI, net banking, and wallets through our secure PineLabs payment gateway.</p>
        </div>
        <div className="faq-item">
          <h4>How long does shipping take?</h4>
          <p>Standard shipping takes 5-7 business days. Express shipping is available for faster delivery.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQsSection;
