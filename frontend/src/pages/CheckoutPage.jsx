import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { clearCart } = useContext(CartContext);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = () => {
    // This is a mock payment simulation
    console.log("Processing payment...");
    setTimeout(() => {
      clearCart();
      setPaymentSuccess(true);
      console.log("Payment successful!");
    }, 2000);
  };

  return (
    <div className="container checkout-page">
      {paymentSuccess ? (
        <h1>Thank you for your order!</h1>
      ) : (
        <>
          <h1>Checkout & Payment</h1>
          <p>This is a mock payment page. No real transaction will occur.</p>
          <button onClick={handlePayment} className="button-primary" style={{ marginTop: '2rem' }}>Pay Now</button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
