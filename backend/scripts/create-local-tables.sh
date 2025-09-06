#!/bin/bash

# This script creates the DynamoDB tables for local development.
# It requires the AWS CLI to be installed and configured.

set -e

ENDPOINT_URL=http://localhost:8000
REGION=localhost
PROFILE=local

# Function to check if a table exists
table_exists() {
  aws dynamodb describe-table --table-name $1 --endpoint-url $ENDPOINT_URL --region $REGION --profile $PROFILE > /dev/null 2>&1
}

# Create Products table
if table_exists Products; then
  echo "Table 'Products' already exists. Skipping."
else
  echo "Creating table 'Products'..."
  aws dynamodb create-table --cli-input-json file://scripts/tables/products-table.json --endpoint-url $ENDPOINT_URL --region $REGION --profile $PROFILE
fi

# Create Users table
if table_exists Users; then
  echo "Table 'Users' already exists. Skipping."
else
  echo "Creating table 'Users'..."
  aws dynamodb create-table --cli-input-json file://scripts/tables/users-table.json --endpoint-url $ENDPOINT_URL --region $REGION --profile $PROFILE
fi

# Create Orders table
if table_exists Orders; then
  echo "Table 'Orders' already exists. Skipping."
else
  echo "Creating table 'Orders'..."
  aws dynamodb create-table --cli-input-json file://scripts/tables/orders-table.json --endpoint-url $ENDPOINT_URL --region $REGION --profile $PROFILE
fi

# Create Cart table
if table_exists Cart; then
  echo "Table 'Cart' already exists. Skipping."
else
  echo "Creating table 'Cart'..."
  aws dynamodb create-table --cli-input-json file://scripts/tables/cart-table.json --endpoint-url $ENDPOINT_URL --region $REGION --profile $PROFILE
fi

echo "All local tables created successfully."
