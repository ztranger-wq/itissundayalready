# Serverless E-Commerce Application

This project is a full-stack e-commerce application that has been migrated from a traditional Node.js/Express/MongoDB monolith to a modern serverless architecture using AWS SAM, Lambda, API Gateway, DynamoDB, and Cognito.

## Architecture Overview

*   **Backend**: A set of AWS Lambda functions managed by AWS SAM. Each function corresponds to a single API endpoint.
*   **API**: An Amazon API Gateway sits in front of the Lambda functions, routing HTTP requests.
*   **Database**: Amazon DynamoDB is used as the primary database, with a local instance for development.
*   **Authentication**: AWS Cognito handles user authentication, supporting both email/password and Google Sign-In.
*   **Notifications**: AWS SES and SNS are used for email and SMS notifications (stubbed for local development).
*   **Frontend**: A React application built with Vite.

## Prerequisites

Make sure you have the following tools installed on your system:
*   [AWS CLI](https://aws.amazon.com/cli/)
*   [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
*   [Docker](https://www.docker.com/products/docker-desktop/)
*   [Node.js](https://nodejs.org/en/) (v18 or later)

## Local Development Setup

Follow these steps to run the entire application stack on your local machine.

### 1. Backend Setup

First, set up and run the serverless backend and the local database.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the local DynamoDB database in the background
# (Requires Docker to be running)
docker-compose up -d

# Create the necessary tables in the local DynamoDB instance
npm run db:setup

# Build the SAM application
sam build

# Start the local API Gateway, which will hot-reload your Lambda functions
sam local start-api
```
Your backend API should now be running at `http://127.0.0.1:3000`.

### 2. Frontend Setup

In a separate terminal, set up and run the React frontend.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create a local environment file from the example
cp .env.example .env
```

**Manual Amplify Setup:**

This project uses AWS Amplify for frontend authentication. Because the setup is environment-dependent, you need to initialize it manually.

```bash
# 1. Initialize an Amplify project. Follow the interactive prompts.
amplify init

# 2. Add the authentication category.
# Choose "Default configuration" and include "Google" as a social provider when prompted.
amplify add auth

# 3. (Optional but recommended) Run the local mock authentication server.
# This allows you to test login/signup flows without a deployed backend.
amplify mock auth
```

Finally, start the frontend development server:
```bash
# Start the React app
npm run dev
```
Your frontend should now be accessible at `http://localhost:5173`. It will connect to the local backend API running at `http://127.0.0.1:3000`.

## Deploying to AWS

To deploy the entire backend to your AWS account, run the following command from the **root** of the project:

```bash
# Build the application for deployment
sam build

# Deploy the stack using a guided process
sam deploy --guided
```

SAM will prompt you for several parameters during the first deployment, including:
*   `Stack Name`: A unique name for this application stack (e.g., `my-ecommerce-app`).
*   `AWS Region`: The region to deploy to.
*   `GoogleClientId` and `GoogleClientSecret`: You will need to provide these from your Google Cloud Console credentials for the Cognito integration to work.
*   Confirm changes before deploy: It's recommended to say `y` to review the changes.

After the deployment is complete, SAM will output the real API endpoint URL, Cognito User Pool ID, and other resource names. You will need to use these outputs to configure your frontend for the deployed environment. This is typically done by creating a production `aws-exports.js` file or configuring environment variables in your CI/CD pipeline.
