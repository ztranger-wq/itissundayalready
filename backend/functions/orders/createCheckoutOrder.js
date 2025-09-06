const { docClient } = require("../../src/db");
const { PutCommand, BatchGetCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");

const ORDERS_TABLE_NAME = process.env.ORDERS_TABLE_NAME;
const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;

module.exports.handler = async (event) => {
  const userId = event.requestContext.authorizer?.claims.sub;

  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, orderNotes, shippingMethod } = JSON.parse(event.body);

  if (!orderItems || orderItems.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ message: 'No order items' }) };
  }

  try {
    // 1. Populate product details
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
        price: product.price,
        name: product.name,
        brand: product.brand,
        image: product.images?.[0] || ''
      };
    });

    // 2. Create the order object
    const orderId = randomUUID();
    const order = {
      userId,
      orderId,
      orderItems: populatedItems,
      shippingAddress,
      shippingMethod,
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
      estimatedDelivery: new Date(Date.now() + (shippingMethod === 'express' ? 2 : 7) * 24 * 60 * 60 * 1000).toISOString(),
    };

    // 3. Save the order
    const putOrderCommand = new PutCommand({
      TableName: ORDERS_TABLE_NAME,
      Item: order,
    });
    await docClient.send(putOrderCommand);

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
