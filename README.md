# Aztec Scan SDK

This SDK provides utilities for interacting with the Aztec Scan API. Specifically for registering contract metadata. [Our full API documentation is available here](https://docs.aztecscan.xyz).

## Features

✅ - Register contract artifacts
✅ - Verify contract deployments
✅ - Deployer contact information
⚠️ - To be shown on [Aztec Scan's Ecosystem page](https://aztecscan.xyz/ecosystem) you'll need to have AztecScanNotes registered. [Currently this is done by creating a PR to this file.](https://github.com/aztec-scan/chicmoz/blob/main/services/explorer-api/src/constants.ts).

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd aztec-scan-sdk

# Install dependencies
npm install
```

## Configuration

The SDK uses environment variables for configuration. You can either:

1. Modify the `.env` file directly
2. Create a `.env.local` file to override the default values
3. Set environment variables in your system

Available configuration options:

| Variable              | Description                     | Default                      |
| --------------------- | ------------------------------- | ---------------------------- |
| EXPLORER_API_URL      | Base URL for the Aztec Scan API | https://api.aztecscan.xyz/v1 |
| API_KEY               | API key for authorization       | temporary-api-key            |
| DEFAULT_CONTRACT_TYPE | Default contract type           | Token                        |

## Usage

### Register a Contract Artifact

This script registers a contract artifact (Token contract) with the Explorer API:

```bash
npm run register-artifact <contractClassId> [version]
```

Parameters:

- `contractClassId` (required): The contract class ID to register
- `version` (optional): The version number of the contract (defaults to 1)

Example:

```bash
npm run register-artifact 0x07cec63fc8993153bfd64b5a9005af4e80414788c5d25763474db5f516f97d06 1
```

### Verify a Contract Deployment

This script verifies a deployed contract instance:

```bash
npm run verify-deployment <contractInstanceAddress>
```

Parameters:

- `contractInstanceAddress` (required): The address of the deployed contract instance

Example:

```bash
npm run verify-deployment 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

Note: The script uses hardcoded example values for constructor arguments, deployer information, and other verification parameters. You may need to modify these in the script (`scripts/verify-deployment.ts`) to match your actual contract deployment.

## Using the SDK in Your Code

```typescript
import {
  generateVerifyArtifactUrl,
  generateVerifyArtifactPayload,
  generateVerifyInstanceUrl,
  generateVerifyInstancePayload,
  callExplorerApi,
  initialize,
} from "aztec-scan-sdk";

// Optional: Initialize with custom settings
initialize({
  apiUrl: "https://your-api-url.com",
  apiKey: "your-api-key",
});

// Register a contract artifact
const registerArtifact = async (contractClassId, version, artifactObj) => {
  const url = generateVerifyArtifactUrl(undefined, contractClassId, version);
  const payload = generateVerifyArtifactPayload(artifactObj);

  await callExplorerApi({
    urlStr: url,
    method: "POST",
    postData: JSON.stringify(payload),
    loggingString: "Register Artifact",
  });
};

// Verify a contract deployment
const verifyDeployment = async (
  contractInstanceAddress,
  verifyArgs,
  deployerMetadata,
) => {
  const url = generateVerifyInstanceUrl(undefined, contractInstanceAddress);
  const payload = {
    verifiedDeploymentArguments: generateVerifyInstancePayload(verifyArgs),
    deployerMetadata,
  };

  await callExplorerApi({
    urlStr: url,
    method: "POST",
    postData: JSON.stringify(payload),
    loggingString: "Verify Deployment",
  });
};
```

## Building the SDK

```bash
npm run build
```

This will generate the compiled JavaScript files in the `dist` directory.

## License

This project is licensed under the Apache-2.0 License.
