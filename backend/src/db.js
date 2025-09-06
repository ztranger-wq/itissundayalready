const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const isOffline = process.env.IS_OFFLINE;

let client;

if (isOffline) {
  client = new DynamoDBClient({
    region: "localhost",
    endpoint: "http://localhost:8000",
    credentials: {
      accessKeyId: "MockAccessKeyId",
      secretAccessKey: "MockSecretAccessKey",
    },
  });
} else {
  client = new DynamoDBClient({});
}

const docClient = DynamoDBDocumentClient.from(client);

module.exports = { docClient };
