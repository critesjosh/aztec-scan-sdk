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
  "0x117c12386e075ffacbda87aab144e3a5e54ea81a0acac393648503fdc40afb692feed50d678b9d4dc459c2e0144ce6765aaa0cd5d21618e41abe5450300edd6b0c6f602b23b9ab6c688446a53f74e7d75ce1c9d4828c82edcefdc1fb0422d4732f332e2ea2e57adbf290297f43ebaeb4f50ec2bf39b3424a0172bdec0b508434278cbb3b8810477d23aa7dc1d6266ddc222cb03e1526d34e071e2eac11339d630e333065c42d7321db5903c680fdcfbc784c5a6248336d24a1c3ae9bb97dbe660a3cf114852ba27eabf15d7069025ba0d4029b4cc7e5463090eb2a44615a03c805d3a58bead62678d234e9ffb9f2ae76b4c2491624d43d7702fb38c09e0f8138";

// Example deployer address
const EXAMPLE_DEPLOYER =
  "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

// Example salt value
const EXAMPLE_SALT =
  "0x0000000000000000000000000000000000000000000000000000000000000001";

// Example deployer metadata
const EXAMPLE_DEPLOYER_METADATA: ContractDeployerMetadata = {
  contractIdentifier: "TokenContract",
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
      artifactObj: tokenContractArtifactJson as ArtifactObject,
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
