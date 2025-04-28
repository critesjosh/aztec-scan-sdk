export interface ContractDeployerMetadata {
  contractIdentifier: string;
  details: string;
  creatorName: string;
  creatorContact: string;
  appUrl: string;
  repoUrl: string;
  reviewedAt: string;
  contractType: null | string;
}

export interface VerifyInstanceArgs {
  publicKeysString: string;
  deployer: string;
  salt: string;
  constructorArgs: string[];
  artifactObj: ArtifactObject;
}

export interface ArtifactObject {
  // Contract artifact properties
  [key: string]: any;
}

// Add missing interfaces for API utilities
export interface ApiRequestOptions {
  urlStr: string;
  method: string;
  postData: string;
  loggingString: string;
}

export interface HttpResponse {
  statusCode: number | undefined;
  statusMessage: string | undefined;
  data: string;
}

// Keep any other existing interfaces/types
