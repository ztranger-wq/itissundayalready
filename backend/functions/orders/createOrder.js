const { docClient } = require("../../src/db");
const { PutCommand, QueryCommand, BatchWriteCommand, BatchGetCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");
const { sendOrderConfirmationEmail } = require("../../src/notifications");

const ORDERS_TABLE_NAME = process.env.ORDERS_TABLE_NAME;
const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;
const CART_TABLE_NAME = process.env.CART_TABLE_NAME;

module.exports.handler = async (event) => {
  const claims = event.requestContext.authorizer?.claims;
  const userId = claims?.sub;
  const userEmail = claims?.email;

  if (!userId || !userEmail) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, orderNotes } = JSON.parse(event.body);

  if (!orderItems || orderItems.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ message: 'No order items' }) };
  }

  try {
    // 1. Populate product details for order items
    const productKeys = orderItems.map(item => ({ productId: item.productId }));
    const batchGetCommand = new BatchGetCommand({
      RequestItems: { [PRODUCTS_TABLE_NAME]: { Keys: productKeys } },
    });
    const { Responses } = await docClient.send(batchGetCommand);
    const products = Responses[PRODUCTS_TABLE_NAME];
    const productMap = products.reduce((map, p) => { map[p.productId] = p; return map; }, {});

    const populatedItems = orderItems.map(item => {
      const product = productMap[item.productId];
      if (!product) throw new Error(`Product with ID ${item.productId} not found.`);
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price, // Price at time of order
        name: product.name,
        brand: product.brand,
        image: product.images?.[0] || ''
      };
    });

    // 2. Create the order
    const orderId = randomUUID();
    const order = {
      userId,
      orderId,
      orderItems: populatedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      orderNotes,
      orderStatus: 'Pending',
      isPaid: false,
      isDelivered: false,
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const putOrderCommand = new PutCommand({
      TableName: ORDERS_TABLE_NAME,
      Item: order,
    });
    await docClient.send(putOrderCommand);

    // 3. Clear the user's cart
    const queryCartCommand = new QueryCommand({
      TableName: CART_TABLE_NAME,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { ":userId": userId },
    });
    const { Items: cartItems } = await docClient.send(queryCartCommand);

    if (cartItems && cartItems.length > 0) {
      const deleteRequests = cartItems.map(item => ({
        DeleteRequest: {
          Key: { userId: item.userId, productId: item.productId },
        },
      }));
      const batchWriteCommand = new BatchWriteCommand({
        RequestItems: { [CART_TABLE_NAME]: deleteRequests },
      });
      await docClient.send(batchWriteCommand);
    }

    // 4. Send confirmation email (fire and forget)
    await sendOrderConfirmationEmail(userEmail, order);

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(order),
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
