/* eslint-disable no-console */
import { readFileSync } from "fs";
import { join } from "path";
import {
  callExplorerApi,
  generateVerifyInstancePayload,
  generateVerifyInstanceUrl,
} from "../src/api-utils";
import { config } from "../src/config";
import {
  ArtifactObject,
  ContractDeployerMetadata,
  VerifyInstanceArgs,
} from "../src/types";

// Load the token contract artifact directly from the known path
const tokenContractArtifactPath = join(
  __dirname,
  "../node_modules/@aztec/noir-contracts.js/artifacts/token_contract-Token.json",
);
const tokenContractArtifactJson = JSON.parse(
  readFileSync(tokenContractArtifactPath, "utf8"),
);

// Parse command line arguments
const args = process.argv.slice(2);
const contractInstanceAddress = args[0] || ""; // Default empty string

if (!contractInstanceAddress) {
  console.error("Error: Contract instance address is required");
  console.error("Usage: npm run verify-deployment <contractInstanceAddress>");
  process.exit(1);
}

const contractLoggingName = "Token Contract";

// HARDCODED EXAMPLES
// Example constructor arguments for a Token contract (must be strings)
const EXAMPLE_CONSTRUCTOR_ARGS = [
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", // owner address
  "TokenName", // token name
  "TKN", // token symbol
  "18", // decimals (as string)
];

// Example public keys string
const EXAMPLE_PUBLIC_KEYS_STRING =
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

// Example deployer address
const EXAMPLE_DEPLOYER =
  "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

// Example salt value
const EXAMPLE_SALT =
  "0x0000000000000000000000000000000000000000000000000000000000000001";

// Example deployer metadata
const EXAMPLE_DEPLOYER_METADATA: ContractDeployerMetadata = {
  name: "Token Contract",
  description: "Standard ERC20-compatible token implementation",
  version: "1.0.0",
  license: "Apache-2.0",
  author: "Your Name",
  repository: "https://github.com/your-username/your-repo",
};

const verifyContractInstanceDeployment = async (
  contractLoggingName: string,
  contractInstanceAddress: string,
  verifyArgs: VerifyInstanceArgs,
  deployerMetadata: ContractDeployerMetadata,
): Promise<void> => {
  const url = generateVerifyInstanceUrl(
    config.explorerApi.url,
    contractInstanceAddress,
  );

  const payload = {
    verifiedDeploymentArguments: generateVerifyInstancePayload(verifyArgs),
    deployerMetadata,
  };

  console.log(`Generated URL: ${url}`);
  console.log(`Payload structure: ${JSON.stringify(Object.keys(payload))}`);
  console.log(
    `Constructor args: ${JSON.stringify(verifyArgs.constructorArgs)}`,
  );
  console.log(`Deployer metadata: ${JSON.stringify(deployerMetadata)}`);

  const postData = JSON.stringify(payload);

  await callExplorerApi({
    loggingString: `🧐 verifyContractInstanceDeployment ${contractLoggingName}`,
    urlStr: url,
    postData,
    method: "POST",
  });
};

// Main function
void (async (): Promise<void> => {
  console.log(
    `Verifying deployment for contract instance address: ${contractInstanceAddress}`,
  );

  try {
    // Using hardcoded example values with the correct parameter structure
    const verifyArgs: VerifyInstanceArgs = {
      publicKeysString: EXAMPLE_PUBLIC_KEYS_STRING,
      deployer: EXAMPLE_DEPLOYER,
      salt: EXAMPLE_SALT,
      constructorArgs: EXAMPLE_CONSTRUCTOR_ARGS,
      artifactObj: tokenContractArtifactJson as ArtifactObject,
    };

    await verifyContractInstanceDeployment(
      contractLoggingName,
      contractInstanceAddress,
      verifyArgs,
      EXAMPLE_DEPLOYER_METADATA,
    );
    console.log("Verification completed successfully!");
  } catch (error) {
    console.error("Error during verification:", error);
    process.exit(1);
  }
})();
