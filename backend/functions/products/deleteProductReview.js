const { docClient } = require("../../src/db");
const { GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;

module.exports.handler = async (event) => {
  const { id: productId, reviewId } = event.pathParameters;

  const userId = event.requestContext.authorizer?.claims.sub;

  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  try {
    // 1. Get the product
    const getCommand = new GetCommand({
      TableName: PRODUCTS_TABLE_NAME,
      Key: { productId },
    });
    const { Item: product } = await docClient.send(getCommand);

    if (!product || !product.reviews) {
      return { statusCode: 404, body: JSON.stringify({ message: "Product or reviews not found" }) };
    }

    // 2. Find the review and check ownership
    const reviewIndex = product.reviews.findIndex((r) => r._id === reviewId);

    if (reviewIndex === -1) {
      return { statusCode: 404, body: JSON.stringify({ message: "Review not found" }) };
    }

    if (product.reviews[reviewIndex].user !== userId) {
        return { statusCode: 401, body: JSON.stringify({ message: "Not authorized to delete this review" }) };
    }

    // 3. Remove the review
    product.reviews.splice(reviewIndex, 1);

    // 4. Recalculate stats
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.length > 0
        ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
        : 0;

    // 5. Save the updated product
    const putCommand = new PutCommand({
        TableName: PRODUCTS_TABLE_NAME,
        Item: product,
    });
    await docClient.send(putCommand);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Review deleted" }),
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
