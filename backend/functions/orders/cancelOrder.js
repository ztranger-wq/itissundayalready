const { docClient } = require("../../src/db");
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const ORDERS_TABLE_NAME = process.env.ORDERS_TABLE_NAME;

module.exports.handler = async (event) => {
  const userId = event.requestContext.authorizer?.claims.sub;

  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  const { id: orderId } = event.pathParameters;

  const params = {
    TableName: ORDERS_TABLE_NAME,
    Key: {
      userId,
      orderId,
    },
    UpdateExpression: "SET orderStatus = :status",
    ExpressionAttributeValues: {
      ":status": "Cancelled",
      ":shipped": "Shipped",
      ":delivered": "Delivered",
    },
    // Only update if the order exists and its status is not 'Shipped' or 'Delivered'
    ConditionExpression: "attribute_exists(orderId) AND (orderStatus <> :shipped AND orderStatus <> :delivered)",
    ReturnValues: "ALL_NEW",
  };

  try {
    const command = new UpdateCommand(params);
    const { Attributes: updatedOrder } = await docClient.send(command);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(updatedOrder),
    };
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
        return {
            statusCode: 400, // Or 404 if not found, but 400 for failed logic
            body: JSON.stringify({ message: 'Order not found, or it cannot be cancelled because it has been shipped or delivered.' })
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
