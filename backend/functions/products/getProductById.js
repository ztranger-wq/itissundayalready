const { docClient } = require("../../src/db");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");

const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;

module.exports.handler = async (event) => {
  const { id } = event.pathParameters;

  const params = {
    TableName: PRODUCTS_TABLE_NAME,
    Key: {
      productId: id,
    },
  };

  try {
    const command = new GetCommand(params);
    const { Item: product } = await docClient.send(command);

    if (product) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(product),
      };
    } else {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Product not found" }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Server Error" }),
    };
  }
};
