import { useState } from 'react';
import './QuotePage.css';

const QuotePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    productType: 'Badges & Recognition',
    quantity: '',
    description: '',
    file: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Quote Request:', formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="quote-page container">
        <div className="quote-thank-you">
          <h2>Thank You!</h2>
          <p>Your quote request has been received. Our team will get back to you within 24-48 hours with a personalized quote.</p>
          <p>We appreciate your interest in Jaksh products.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quote-page container">
      <div className="quote-header">
        <h1>Request a Custom Quote</h1>
        <p>Tell us about your project, and we'll provide a personalized quote tailored to your needs.</p>
      </div>
      <form onSubmit={handleSubmit} className="quote-form">
        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="company">Company Name</label>
              <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Project Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="productType">Product Type *</label>
              <select id="productType" name="productType" value={formData.productType} onChange={handleChange} required>
                <option>Badges & Recognition</option>
                <option>Corporate & Promotional Merchandise</option>
                <option>Event & Branding Solutions</option>
                <option>School & Institutional Solutions</option>
                <option>Packaging & Gifting</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Estimated Quantity *</label>
              <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} required min="1" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description">Project Description *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="5" required placeholder="Describe your requirements, including materials, sizes, colors, and any specific details."></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="file">Upload a File (Logo, Design, etc.)</label>
            <input type="file" id="file" name="file" onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="button-primary submit-quote-btn">Submit Request</button>
      </form>
    </div>
  );
};

export default QuotePage;