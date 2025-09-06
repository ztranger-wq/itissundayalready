const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const isOffline = process.env.IS_OFFLINE;
const sesClient = new SESClient({});
const snsClient = new SNSClient({});

const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@example.com";

/**
 * Sends a welcome email to a new user.
 * @param {string} toAddress - The recipient's email address.
 * @param {string} name - The recipient's name.
 */
const sendWelcomeEmail = async (toAddress, name) => {
  const subject = "Welcome to our E-Commerce Platform!";
  const body = `Hi ${name},\n\nWelcome! We are excited to have you on board.`;

  if (isOffline) {
    console.log("--- MOCK EMAIL ---");
    console.log(`To: ${toAddress}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log("--------------------");
    return;
  }

  const command = new SendEmailCommand({
    Source: SENDER_EMAIL,
    Destination: { ToAddresses: [toAddress] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: body } },
    },
  });

  try {
    await sesClient.send(command);
    console.log(`Welcome email sent to ${toAddress}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

/**
 * Sends an order confirmation email.
 * @param {string} toAddress - The recipient's email address.
 * @param {object} order - The order details object.
 */
const sendOrderConfirmationEmail = async (toAddress, order) => {
  const subject = `Order Confirmation - #${order.orderId}`;
  const body = `Hi,\n\nThank you for your order! Your order #${order.orderId} for a total of $${order.totalPrice} has been placed successfully.`;

  if (isOffline) {
    console.log("--- MOCK EMAIL ---");
    console.log(`To: ${toAddress}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log("--------------------");
    return;
  }

  const command = new SendEmailCommand({
    Source: SENDER_EMAIL,
    Destination: { ToAddresses: [toAddress] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: body } },
    },
  });

  try {
    await sesClient.send(command);
    console.log(`Order confirmation email sent to ${toAddress}`);
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};


/**
 * Sends an order shipped SMS notification.
 * @param {string} phoneNumber - The recipient's E.164 formatted phone number.
 * @param {object} order - The order details object.
 */
const sendOrderShippedSms = async (phoneNumber, order) => {
    const message = `Your order #${order.orderId} has been shipped!`;

    if (isOffline) {
        console.log("--- MOCK SMS ---");
        console.log(`To: ${phoneNumber}`);
        console.log(`Message: ${message}`);
        console.log("--------------------");
        return;
    }

    const command = new PublishCommand({
        PhoneNumber: phoneNumber,
        Message: message,
    });

    try {
        await snsClient.send(command);
        console.log(`Order shipped SMS sent to ${phoneNumber}`);
    } catch (error) {
        console.error("Error sending order shipped SMS:", error);
    }
};


module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderShippedSms,
};
