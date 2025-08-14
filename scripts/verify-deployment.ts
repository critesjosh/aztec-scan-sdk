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
const artifactPath = join(
  __dirname,
  "../easy_private_voting_contract-EasyPrivateVoting.json",
);
const artifactJson = JSON.parse(readFileSync(artifactPath, "utf8"));

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

const easyPrivateVotingContractPublicKeys = {
  masterNullifierPublicKey:
    "0x01498945581e0eb9f8427ad6021184c700ef091d570892c437d12c7d90364bbd170ae506787c5c43d6ca9255d571c10fa9ffa9d141666e290c347c5c9ab7e344",
  masterIncomingViewingPublicKey:
    "0x00c044b05b6ca83b9c2dbae79cc1135155956a64e136819136e9947fe5e5866c1c1f0ca244c7cd46b682552bff8ae77dea40b966a71de076ec3b7678f2bdb151",
  masterOutgoingViewingPublicKey:
    "0x1b00316144359e9a3ec8e49c1cdb7eeb0cedd190dfd9dc90eea5115aa779e287080ffc74d7a8b0bccb88ac11f45874172f3847eb8b92654aaa58a3d2b8dc7833",
  masterTaggingPublicKey:
    "0x019c111f36ad3fc1d9b7a7a14344314d2864b94f030594cd67f753ef774a1efb2039907fe37f08d10739255141bb066c506a12f7d1e8dfec21abc58494705b6f",
};

const pubkeySplit = Object.values(easyPrivateVotingContractPublicKeys).map(
  (key) => key.split("0x")[1],
);
const pubKeyString = "0x".concat(pubkeySplit.join(""));

// Example public keys string
const EXAMPLE_PUBLIC_KEYS_STRING = pubKeyString;

// Example deployer address
const EXAMPLE_DEPLOYER =
  "0x204a9adfa07d063792ce737d3164b86a016584d53cb2fede795d00659e1f94cc";

// Example salt value
const EXAMPLE_SALT =
  "0x0d50e9616a92a7ad33e0a5075d6c2ce68ee488bc0910497f427135f25a552ba7";

// Example deployer metadata
const EXAMPLE_DEPLOYER_METADATA: ContractDeployerMetadata = {
  contractIdentifier: "EasyPrivateVoting",
  details: "Easy Private Voting Contract",
  creatorName: "Josh",
  creatorContact: "TBD",
  appUrl: "test.com",
  repoUrl: "test.com",
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
      EXAMPLE_DEPLOYER_METADATA,
    );

    console.log("Verification completed successfully!");
  } catch (error) {
    console.error("Error during verification:", error);
    process.exit(1);
  }
})();
