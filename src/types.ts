import { NoirCompiledContract } from "@aztec/aztec.js";

/**
 * Duplicated types from @chicmoz-pkg/types
 */

// Contract deployer metadata
export interface ContractDeployerMetadata {
  name: string;
  description: string;
  version: string;
  license: string;
  author: string;
  repository: string;
  [key: string]: string;
}

// Represents artifact object type
export type ArtifactObject =
  | { default: NoirCompiledContract }
  | NoirCompiledContract;

// Arguments for verify instance payload
export interface VerifyInstanceArgs {
  publicKeysString: string;
  deployer: string;
  salt: string;
  constructorArgs: string[];
  artifactObj?: ArtifactObject;
}

// HTTP Response type
export interface HttpResponse {
  statusCode: number | undefined;
  statusMessage: string | undefined;
  data: string;
}

// API Request options
export interface ApiRequestOptions {
  urlStr: string;
  method: string;
  postData: string;
  loggingString: string;
}
