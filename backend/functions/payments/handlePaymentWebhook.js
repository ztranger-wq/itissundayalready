const { docClient } = require("../../src/db");
const { QueryCommand, UpdateCommand, BatchWriteCommand } = require("@aws-sdk/lib-dynamodb");

const ORDERS_TABLE_NAME = process.env.ORDERS_TABLE_NAME;
const CART_TABLE_NAME = process.env.CART_TABLE_NAME;

module.exports.handler = async (event) => {
  // Assuming the webhook payload has a structure like the PineLabs one.
  const { order_id, transaction_id, status, payment_method, amount, currency } = JSON.parse(event.body);

  if (!order_id) {
    return { statusCode: 400, body: JSON.stringify({ message: "Order ID is required" }) };
  }

  try {
    // 1. Find the order using the GSI
    const queryCmd = new QueryCommand({
      TableName: ORDERS_TABLE_NAME,
      IndexName: "OrderIdIndex",
      KeyConditionExpression: "orderId = :orderId",
      ExpressionAttributeValues: { ":orderId": order_id },
    });
    const { Items } = await docClient.send(queryCmd);
    if (!Items || Items.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ message: "Order not found" }) };
    }
    const order = Items[0];
    const { userId } = order;

    // 2. Determine new status and payment result
    let updateExpression = "SET paymentResult = :paymentResult";
    let expressionValues = {
        ":paymentResult": { transactionId: transaction_id, paymentStatus: status, paymentMethod: payment_method, amount, currency, gateway: 'Webhook' }
    };

    if (status === 'success' || status === 'SUCCESS') {
        updateExpression += ", isPaid = :isPaid, paidAt = :paidAt, orderStatus = :orderStatus";
        expressionValues[":isPaid"] = true;
        expressionValues[":paidAt"] = new Date().toISOString();
        expressionValues[":orderStatus"] = "Processing";
    } else if (status === 'failed' || status === 'FAILED') {
        updateExpression += ", orderStatus = :orderStatus";
        expressionValues[":orderStatus"] = "Payment Failed";
    }

    // 3. Update the order
    const updateCmd = new UpdateCommand({
      TableName: ORDERS_TABLE_NAME,
      Key: { userId, orderId: order_id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionValues,
    });
    await docClient.send(updateCmd);

    // 4. If payment was successful, clear the user's cart
    if (expressionValues[":isPaid"]) {
        const cartQueryCmd = new QueryCommand({
            TableName: CART_TABLE_NAME,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: { ":userId": userId },
        });
        const { Items: cartItems } = await docClient.send(cartQueryCmd);

        if (cartItems && cartItems.length > 0) {
            const deleteRequests = cartItems.map(item => ({ DeleteRequest: { Key: { userId, productId: item.productId } } }));
            const batchWriteCmd = new BatchWriteCommand({ RequestItems: { [CART_TABLE_NAME]: deleteRequests } });
            await docClient.send(batchWriteCmd);
        }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook processed successfully' }),
    };
  } catch (error) {
    console.error("Webhook processing error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Webhook processing failed", error: error.message }),
    };
  }
};
