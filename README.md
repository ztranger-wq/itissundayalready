# MSJAKSH

## AWS Serverless Deployment

This project has been configured to be deployed to AWS using the Serverless Framework. The backend will be deployed as an AWS Lambda function with an API Gateway trigger, and the frontend will be hosted on an S3 bucket.

### Prerequisites

1.  **Install Node.js and npm:** Make sure you have Node.js and npm installed on your machine.
2.  **Install Serverless CLI:**
    ```bash
    npm install -g serverless
    ```
3.  **Configure AWS Credentials:**
    Make sure you have your AWS credentials configured on your machine. The Serverless Framework uses the AWS SDK for JavaScript, which looks for credentials in the following order:
    - Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).
    - The shared credentials file (`~/.aws/credentials`).
    - IAM roles for EC2 instances.

    For more information, see the [AWS documentation](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html).

### Backend Deployment

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file:**
    Create a `.env` file in the `backend` directory with the following environment variables:
    ```
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```
4.  **Deploy the service:**
    ```bash
    npm run deploy
    ```
    This command will deploy the backend service to AWS. After the deployment is complete, it will output the API Gateway endpoint URL. It will look something like this: `https://xxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev`.

### Frontend Deployment

1.  **Update the API endpoint:**
    Open `frontend/src/utils/api.js` and replace the placeholder URL with the actual API Gateway endpoint URL from the previous step.

2.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Build the frontend:**
    ```bash
    npm run build
    ```
    This will create a `dist` directory with the static files for the frontend.

5.  **Deploy to S3:**
    The `serverless deploy` command in the backend created an S3 bucket for the frontend. The bucket name is `mern-ecommerce-frontend-bucket-dev`. You need to upload the contents of the `frontend/dist` directory to this S3 bucket. You can do this using the AWS Management Console or the AWS CLI.

    **Using AWS CLI:**
    ```bash
    aws s3 sync frontend/dist s3://mern-ecommerce-frontend-bucket-dev --delete
    ```
