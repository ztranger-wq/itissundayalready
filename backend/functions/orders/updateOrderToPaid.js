const { docClient } = require("../../src/db");
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { sendOrderShippedSms } = require("../../src/notifications");

const ORDERS_TABLE_NAME = process.env.ORDERS_TABLE_NAME;

module.exports.handler = async (event) => {
  const claims = event.requestContext.authorizer?.claims;
  const userId = claims?.sub;
  const phoneNumber = claims?.phone_number;

  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  const { id: orderId } = event.pathParameters;
  const paymentResult = JSON.parse(event.body);

  const params = {
    TableName: ORDERS_TABLE_NAME,
    Key: {
      userId,
      orderId,
    },
    UpdateExpression: "SET isPaid = :isPaid, paidAt = :paidAt, orderStatus = :orderStatus, paymentResult = :paymentResult",
    ExpressionAttributeValues: {
      ":isPaid": true,
      ":paidAt": new Date().toISOString(),
      ":orderStatus": "Processing",
      ":paymentResult": paymentResult,
    },
    ConditionExpression: "attribute_exists(orderId)", // Ensures the item exists before updating
    ReturnValues: "ALL_NEW",
  };

  try {
    const command = new UpdateCommand(params);
    const { Attributes: updatedOrder } = await docClient.send(command);

    // TODO: This is a placeholder. In a real app, this would be triggered
    // by a separate "ship order" event, not immediately on payment.
    if (phoneNumber) {
      await sendOrderShippedSms(phoneNumber, updatedOrder);
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(updatedOrder),
    };
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Order not found or you do not have permission to update it' })
        };
    }
    console.error(error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Server Error", error: error.message }),
    };
  }
};
