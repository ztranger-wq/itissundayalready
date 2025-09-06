const { docClient } = require("../../src/db");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");

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
  };

  try {
    const command = new GetCommand(params);
    const { Item: order } = await docClient.send(command);

    if (order) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(order),
      };
    } else {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Order not found or you do not have permission to view it" }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Server Error", error: error.message }),
    };
  }
};
