const { docClient } = require("../../src/db");
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");

const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;

module.exports.handler = async (event) => {
  const { brand, category, search, limit, sort } = event.queryStringParameters || {};

  const params = {
    TableName: PRODUCTS_TABLE_NAME,
    FilterExpression: "",
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  };

  const filters = [];

  if (brand) {
    filters.push("#brand = :brand");
    params.ExpressionAttributeNames["#brand"] = "brand";
    params.ExpressionAttributeValues[":brand"] = brand;
  }

  if (category) {
    filters.push("#category = :category");
    params.ExpressionAttributeNames["#category"] = "category";
    params.ExpressionAttributeValues[":category"] = category;
  }

  if (search) {
    filters.push("contains(#name, :search)");
    params.ExpressionAttributeNames["#name"] = "name";
    params.ExpressionAttributeValues[":search"] = search;
  }

  if (filters.length > 0) {
    params.FilterExpression = filters.join(" AND ");
  } else {
    // No filters, so remove filter-related keys from params
    delete params.FilterExpression;
    delete params.ExpressionAttributeNames;
    delete params.ExpressionAttributeValues;
  }

  try {
    const command = new ScanCommand(params);
    let { Items: products } = await docClient.send(command);

    // In-memory sorting after scanning
    if (sort) {
      products.sort((a, b) => {
        if (sort === 'price-asc') return a.price - b.price;
        if (sort === 'price-desc') return b.price - a.price;
        if (sort === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
    } else {
      // Default sort by createdAt (assuming it exists)
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // In-memory limit after sorting
    if (limit) {
      products = products.slice(0, parseInt(limit));
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(products),
    };
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
