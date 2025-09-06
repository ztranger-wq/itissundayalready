const FRONTEND_URL = process.env.FRONTEND_URL;

module.exports.handler = async (event) => {
  const { order_id, status } = event.queryStringParameters || {};

  if (!order_id || !status) {
    return {
      statusCode: 400,
      body: "Missing required query parameters: order_id, status",
    };
  }

  let redirectUrl;

  if (status.toLowerCase() === 'success') {
    redirectUrl = `${FRONTEND_URL}/checkout/success?orderId=${order_id}`;
  } else {
    redirectUrl = `${FRONTEND_URL}/checkout/payment?orderId=${order_id}&error=payment_failed`;
  }

  return {
    statusCode: 302,
    headers: {
      Location: redirectUrl,
    },
  };
};
