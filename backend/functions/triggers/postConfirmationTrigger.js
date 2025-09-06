const { sendWelcomeEmail } = require("../../src/notifications");

/**
 * This function is triggered by Cognito after a user confirms their sign-up.
 * It sends a welcome email to the new user.
 */
module.exports.handler = async (event) => {
  console.log("PostConfirmation trigger event:", JSON.stringify(event, null, 2));

  const { email, name } = event.request.userAttributes;

  if (email) {
    try {
      await sendWelcomeEmail(email, name || 'there');
    } catch (error) {
      console.error(`Failed to send welcome email to ${email}`, error);
      // Don't re-throw, as we don't want to fail the user's sign-in process.
    }
  }

  // Return the event to Cognito
  return event;
};
