const { docClient } = require("../../src/db");
const { DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const CART_TABLE_NAME = process.env.CART_TABLE_NAME;

module.exports.handler = async (event) => {
  const userId = event.requestContext.authorizer?.claims.sub;

  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  const { productId } = event.pathParameters;

  if (!productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Product ID is required" }),
    };
  }

  const params = {
    TableName: CART_TABLE_NAME,
    Key: {
      userId,
      productId,
    },
  };

  try {
    const command = new DeleteCommand(params);
    await docClient.send(command);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Item removed from cart" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Server Error", error: error.message }),
    };
  }
};
