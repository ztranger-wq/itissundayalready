const { docClient } = require("../../src/db");
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");

const ORDERS_TABLE_NAME = process.env.ORDERS_TABLE_NAME;

module.exports.handler = async (event) => {
  const userId = event.requestContext.authorizer?.claims.sub;

  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  try {
    // 1. Fetch all orders for the user.
    // Note: For users with a very large number of orders, this could be inefficient.
    // A more advanced solution would use DynamoDB Streams to maintain aggregate stats.
    // For this migration, in-code aggregation is a direct equivalent of the original logic.
    const allOrders = [];
    let lastEvaluatedKey = null;

    do {
      const params = {
        TableName: ORDERS_TABLE_NAME,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId },
        ExclusiveStartKey: lastEvaluatedKey,
      };
      const command = new QueryCommand(params);
      const { Items, LastEvaluatedKey } = await docClient.send(command);
      allOrders.push(...Items);
      lastEvaluatedKey = LastEvaluatedKey;
    } while (lastEvaluatedKey);

    // 2. Perform aggregations in code
    const statusBreakdown = allOrders.reduce((acc, order) => {
      const status = order.orderStatus;
      if (!acc[status]) {
        acc[status] = { count: 0, total: 0 };
      }
      acc[status].count += 1;
      acc[status].total += order.totalPrice;
      return acc;
    }, {});

    const totalSpent = allOrders
      .filter(order => order.isPaid)
      .reduce((sum, order) => sum + order.totalPrice, 0);

    const recentOrders = allOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    const response = {
        statusBreakdown,
        totalSpent,
        recentOrders,
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(response),
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
