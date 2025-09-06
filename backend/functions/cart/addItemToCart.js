const { docClient } = require("../../src/db");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");

const CART_TABLE_NAME = process.env.CART_TABLE_NAME;

module.exports.handler = async (event) => {
  const userId = event.requestContext.authorizer?.claims.sub;

  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  const { productId, quantity, customizationOptions } = JSON.parse(event.body);

  if (!productId || !quantity || quantity < 1) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid product ID or quantity" }),
    };
  }

  const item = {
    userId,
    productId,
    quantity: Number(quantity),
    customizationOptions,
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: CART_TABLE_NAME,
    Item: item,
  };

  try {
    const command = new PutCommand(params);
    await docClient.send(command);

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(item),
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
