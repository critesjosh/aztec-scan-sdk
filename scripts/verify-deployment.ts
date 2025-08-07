/* eslint-disable no-console */
import { readFileSync } from "fs";
import { join } from "path";
import {
  callExplorerApi,
  generateVerifyInstanceUrl,
  generateVerifyInstancePayload
} from "../src/api-utils";
import { config } from "../src/config";
import {
  ArtifactObject,
  VerifyInstanceArgs,
  ContractDeployerMetadata
} from "../src/types";

// Load the token contract artifact directly from the known path
const artifactPath = join(
  __dirname,
  "../easy_private_voting_contract-EasyPrivateVoting.json",
);
const artifactJson = JSON.parse(
  readFileSync(artifactPath, "utf8"),
);

// Parse command line arguments
const args = process.argv.slice(2);
const contractInstanceAddress = args[0] || ""; // Default empty string

if (!contractInstanceAddress) {
  console.error("Error: Contract instance address is required");
  console.error("Usage: npm run verify-deployment <contractInstanceAddress>");
  process.exit(1);
}

const contractLoggingName = "Easy Privte Voting Contract";

// HARDCODED EXAMPLES
// Example constructor arguments for a Token contract (must be strings)
const EXAMPLE_CONSTRUCTOR_ARGS = [
  "0x204a9adfa07d063792ce737d3164b86a016584d53cb2fede795d00659e1f94cc", // owner address
];

// Example public keys string
const EXAMPLE_PUBLIC_KEYS_STRING = "";

// Example deployer address
const EXAMPLE_DEPLOYER =
  "0x204a9adfa07d063792ce737d3164b86a016584d53cb2fede795d00659e1f94cc";

// Example salt value
const EXAMPLE_SALT =
  "0x0d50e9616a92a7ad33e0a5075d6c2ce68ee488bc0910497f427135f25a552ba7";

// Example deployer metadata
const EXAMPLE_DEPLOYER_METADATA: ContractDeployerMetadata = {
  contractIdentifier: "EasyPrivateVoting",
  details: "Standard Token Contract",
  creatorName: "Obsidion",
  creatorContact: "TBD",
  appUrl: "https://obsidion.xyz",
  repoUrl: "https://github.com/obsidionlabs",
  reviewedAt: new Date().toISOString(),
  contractType: null,
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

  // Use generateVerifyInstancePayload to create verifiedDeploymentArguments
  const payload = {
    deployerMetadata,
    verifiedDeploymentArguments: generateVerifyInstancePayload(verifyArgs),
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
      artifactObj: artifactJson as ArtifactObject,
    };

    await verifyContractInstanceDeployment(
      contractLoggingName,
      contractInstanceAddress,
      verifyArgs,
      EXAMPLE_DEPLOYER_METADATA
    );

    console.log("Verification completed successfully!");
  } catch (error) {
    console.error("Error during verification:", error);
    process.exit(1);
  }
})();
