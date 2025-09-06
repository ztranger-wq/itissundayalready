const { docClient } = require("../../src/db");
const { QueryCommand, BatchGetCommand } = require("@aws-sdk/lib-dynamodb");

const CART_TABLE_NAME = process.env.CART_TABLE_NAME;
const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;

module.exports.handler = async (event) => {
  const userId = event.requestContext.authorizer?.claims.sub;

  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  try {
    // 1. Get the user's cart items
    const queryCommand = new QueryCommand({
      TableName: CART_TABLE_NAME,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    });
    const { Items: cartItems } = await docClient.send(queryCommand);

    if (!cartItems || cartItems.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      };
    }

    // 2. Get product details for each item in the cart
    const productKeys = cartItems.map(item => ({ productId: item.productId }));

    const batchGetCommand = new BatchGetCommand({
      RequestItems: {
        [PRODUCTS_TABLE_NAME]: {
          Keys: productKeys,
        },
      },
    });
    const { Responses } = await docClient.send(batchGetCommand);
    const products = Responses[PRODUCTS_TABLE_NAME];

    // 3. Combine cart item data with product details
    const productMap = products.reduce((map, product) => {
        map[product.productId] = product;
        return map;
    }, {});

    const populatedCart = cartItems.map(item => ({
      ...item,
      product: productMap[item.productId] || null, // Attach product details
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(populatedCart),
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
