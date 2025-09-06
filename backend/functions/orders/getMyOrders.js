const { docClient } = require("../../src/db");
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");

const ORDERS_TABLE_NAME = process.env.ORDERS_TABLE_NAME;

module.exports.handler = async (event) => {
  const userId = event.requestContext.authorizer?.claims.sub;

  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  const { limit, exclusiveStartKey } = event.queryStringParameters || {};
  const queryLimit = limit ? parseInt(limit) : 10;

  const params = {
    TableName: ORDERS_TABLE_NAME,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
    Limit: queryLimit,
    // ScanIndexForward: false would sort by orderId descending, not createdAt.
    // Sorting will be done in code.
  };

  if (exclusiveStartKey) {
    try {
      // The key is a base64 encoded string from the previous response
      params.ExclusiveStartKey = JSON.parse(Buffer.from(exclusiveStartKey, 'base64').toString('utf8'));
    } catch(e) {
        return { statusCode: 400, body: JSON.stringify({ message: "Invalid exclusiveStartKey" })};
    }
  }

  try {
    const command = new QueryCommand(params);
    const { Items: orders, LastEvaluatedKey } = await docClient.send(command);

    // Sort in-memory
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const response = {
      orders,
      lastEvaluatedKey: LastEvaluatedKey ? Buffer.from(JSON.stringify(LastEvaluatedKey)).toString('base64') : null,
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
