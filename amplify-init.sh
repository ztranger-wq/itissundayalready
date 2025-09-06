#!/bin/bash

set -e

# Construct the JSON payloads
REACTCONFIG="{\
\"SourceDir\":\"src\",\
\"DistributionDir\":\"dist\",\
\"BuildCommand\":\"npm run build\",\
\"StartCommand\":\"npm run dev\"\
}"

# Provide the region explicitly, but not the keys.
# Let's see if Amplify can pick up keys from the env if region is set.
AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":false,\
\"region\":\"$AWS_REGION\"\
}"

AMPLIFY="{\
\"projectName\":\"frontend\",\
\"envName\":\"dev\",\
\"defaultEditor\":\"vscode\"\
}"

FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"react\",\
\"config\":$REACTCONFIG\
}"

PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"

# This script is executed from /app/frontend
# It does not need to cd.

echo "Running amplify init with explicit region..."
amplify init \
  --amplify "$AMPLIFY" \
  --frontend "$FRONTEND" \
  --providers "$PROVIDERS" \
  --yes

echo "Amplify project initialized successfully."
