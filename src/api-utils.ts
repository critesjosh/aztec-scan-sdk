import http from "http";
import https from "https";
import { config } from "./config";
import { ApiRequestOptions, HttpResponse } from "./types";

/**
 * Makes an HTTP request to the explorer API
 *
 * @param options Request options
 * @returns Promise resolving to HTTP response
 */
export const callExplorerApi = async (
  options: ApiRequestOptions,
): Promise<HttpResponse> => {
  const { urlStr, method, postData, loggingString } = options;
  const url = new URL(urlStr);
  const request = url.protocol === "https:" ? https.request : http.request;

  const sizeInMB = Buffer.byteLength(postData) / 1000 ** 2;
  console.info(
    `📲📡 "${loggingString}" CALLING EXPLORER API (byte length: ${sizeInMB} MB)`,
  );

  const res: HttpResponse = await new Promise((resolve, reject) => {
    const req = request(
      url,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            data,
          });
        });
      },
    );
    req.on("error", (error) => {
      console.error(`📲❌ "${loggingString}" REQUEST FAILED! rejecting...`);
      reject(error);
    });

    req.setTimeout(5000, () => {
      reject(new Error("Request timed out"));
    });

    req.write(postData);
    req.end();
  });

  if (res.statusCode === 200 || res.statusCode === 201) {
    console.info(
      `📲✅ "${loggingString}" SUCCESS! ${JSON.stringify({
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
      })}`,
    );
  } else {
    console.error(
      `📲🚨 "${loggingString}" FAILED! ${JSON.stringify({
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        data: res.data,
      })}`,
    );
  }
  return res;
};

/**
 * Generate URL for verifying contract artifacts
 *
 * @param explorerApiUrl Base API URL
 * @param contractClassId Contract class ID
 * @param version Version number
 * @returns Full URL for the API endpoint
 */
export const generateVerifyArtifactUrl = (
  explorerApiUrl: string = config.explorerApi.url,
  contractClassId: string,
  version: number,
): string => {
  return `${explorerApiUrl}/${config.explorerApi.apiKey}/l2/contract-classes/${contractClassId}/versions/${version}`;
};

/**
 * Generate payload for verifying contract artifacts
 *
 * @param artifactObj Contract artifact object
 * @returns Payload for the API request
 */
export const generateVerifyArtifactPayload = (
  artifactObj: any,
): { stringifiedArtifactJson: string } => {
  return {
    stringifiedArtifactJson: JSON.stringify(artifactObj),
  };
};

/**
 * Generate URL for verifying contract instance deployment
 *
 * @param explorerApiUrl Base API URL
 * @param contractInstanceAddress Contract instance address
 * @returns Full URL for the API endpoint
 */
export const generateVerifyInstanceUrl = (
  explorerApiUrl: string = config.explorerApi.url,
  contractInstanceAddress: string,
): string => {
  return `${explorerApiUrl}/${config.explorerApi.apiKey}/l2/contract-instances/${contractInstanceAddress}`;
};

/**
 * Generate payload for verifying contract instance deployment
 *
 * @param args Verification arguments
 * @returns Payload for the API request
 */
export const generateVerifyInstancePayload = (args: any): any => {
  return {
    salt: args.salt,
    deployer: args.deployer,
    publicKeysString: args.publicKeysString,
    constructorArgs: args.constructorArgs,
    stringifiedArtifactJson: JSON.stringify(args.artifactObj),
  };
};
