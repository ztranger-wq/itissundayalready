const { docClient } = require("../../src/db");
const { GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");

const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;

module.exports.handler = async (event) => {
  const { id: productId } = event.pathParameters;
  const { rating, comment } = JSON.parse(event.body);

  const claims = event.requestContext.authorizer?.claims;
  const user = {
    _id: claims?.sub,
    name: claims?.email, // Using email as name, can be changed to a custom 'name' claim
  };

  if (!user._id) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  if (!rating || !comment) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Rating and comment are required" }),
    };
  }

  try {
    // 1. Get the product
    const getCommand = new GetCommand({
      TableName: PRODUCTS_TABLE_NAME,
      Key: { productId },
    });
    const { Item: product } = await docClient.send(getCommand);

    if (!product) {
      return { statusCode: 404, body: JSON.stringify({ message: "Product not found" }) };
    }

    // 2. Check if user already reviewed
    const alreadyReviewed = product.reviews?.find((r) => r.user === user._id);
    if (alreadyReviewed) {
      return { statusCode: 400, body: JSON.stringify({ message: "Product already reviewed" }) };
    }

    // 3. Create and add the new review
    const review = {
      _id: randomUUID(),
      user: user._id,
      name: user.name,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
    };

    product.reviews = product.reviews ? [...product.reviews, review] : [review];
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    // 4. Save the updated product
    const putCommand = new PutCommand({
        TableName: PRODUCTS_TABLE_NAME,
        Item: product,
    });
    await docClient.send(putCommand);

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Review added" }),
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
