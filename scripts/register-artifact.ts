/* eslint-disable no-console */
import { readFileSync } from "fs";
import { join } from "path";
import {
  callExplorerApi,
  generateVerifyArtifactPayload,
  generateVerifyArtifactUrl,
} from "../src/api-utils";
import { config } from "../src/config";
import { ArtifactObject } from "../src/types";

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
const contractClassId = args[0] || ""; // Default empty string
const version = parseInt(args[1] || "1", 10); // Default version 1

if (!contractClassId) {
  console.error("Error: Contract class ID is required");
  console.error("Usage: npm run register-artifact <contractClassId> [version]");
  process.exit(1);
}

const contractLoggingName = "Easy Private Voting Contract";

const registerContractClassArtifact = async (
  contractLoggingName: string,
  artifactObj: ArtifactObject,
  contractClassId: string,
  version: number,
): Promise<void> => {
  const url = generateVerifyArtifactUrl(
    config.explorerApi.url,
    contractClassId,
    version,
  );
  const payload = generateVerifyArtifactPayload(artifactObj);
  console.log(`Generated URL: ${url}`);
  console.log(`Payload structure: ${JSON.stringify(Object.keys(payload))}`);

  const postData = JSON.stringify(payload);

  await callExplorerApi({
    loggingString: `📜 registerContractClassArtifact ${contractLoggingName}`,
    urlStr: url,
    postData,
    method: "POST",
  });
};

// Main function
void (async (): Promise<void> => {
  console.log(
    `Registering ${contractLoggingName} with class ID: ${contractClassId}, version: ${version}`,
  );
  try {
    await registerContractClassArtifact(
      contractLoggingName,
      artifactJson as ArtifactObject,
      contractClassId,
      version,
    );
    console.log("Registration completed successfully!");
  } catch (error) {
    console.error("Error during registration:", error);
    process.exit(1);
  }
})();
