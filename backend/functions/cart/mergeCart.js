const { docClient } = require("../../src/db");
const { BatchWriteCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const CART_TABLE_NAME = process.env.CART_TABLE_NAME;

module.exports.handler = async (event) => {
  const userId = event.requestContext.authorizer?.claims.sub;

  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  const { guestCart } = JSON.parse(event.body);

  if (!guestCart || !Array.isArray(guestCart) || guestCart.length === 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "No guest cart to merge." }),
    };
  }

  try {
    // 1. Fetch user's existing cart
    const queryCommand = new QueryCommand({
        TableName: CART_TABLE_NAME,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId },
    });
    const { Items: existingCartItems } = await docClient.send(queryCommand);

    // 2. Merge guest cart with existing cart
    const mergedCart = existingCartItems.reduce((map, item) => {
        map[item.productId] = item;
        return map;
    }, {});

    guestCart.forEach(guestItem => {
        const productId = guestItem.productId || guestItem.product?._id; // Handle different guest cart structures
        if (!productId) return;

        if (mergedCart[productId]) {
            // Item exists, update quantity
            mergedCart[productId].quantity += guestItem.quantity;
        } else {
            // New item
            mergedCart[productId] = {
                userId,
                productId,
                quantity: guestItem.quantity,
                customizationOptions: guestItem.customizationOptions,
                createdAt: new Date().toISOString(),
            };
        }
    });

    // 3. Prepare items for BatchWrite
    const putRequests = Object.values(mergedCart).map(item => ({
        PutRequest: {
            Item: item,
        },
    }));

    if (putRequests.length === 0) {
      return { statusCode: 200, body: JSON.stringify({ message: "Cart merge resulted in no items." }) };
    }

    // 4. Execute BatchWrite
    const batchWriteCommand = new BatchWriteCommand({
        RequestItems: {
            [CART_TABLE_NAME]: putRequests,
        },
    });
    await docClient.send(batchWriteCommand);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Cart merged successfully" }),
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
