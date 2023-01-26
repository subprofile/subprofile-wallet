import type { InjectedAccount } from '@polkadot/extension-inject/types';
import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';

export type MessageId = string;

export interface RequestAccessAuthorized {
  appName: string;
}

export interface RequestAppRequestAccess {
  appName: string;
}

export interface RequestAuthorizedAccounts {
  anyType?: boolean;
}

export enum AccessStatus {
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
}

export interface ResponseSigning {
  id: string;
  signature: HexString;
}

export interface ResponseAppRequestAccess {
  result: AccessStatus;
  authorizedAccounts: string[];
}

export interface RequestSignatures {
  'tab/requestAccess': [RequestAppRequestAccess, ResponseAppRequestAccess];
  'tab/signRaw': [SignerPayloadRaw, ResponseSigning];
  'tab/signExtrinsic': [SignerPayloadJSON, ResponseSigning];

  'embed/accessAuthorized': [RequestAccessAuthorized, boolean];
  'embed/authorizedAccounts': [RequestAuthorizedAccounts, InjectedAccount[]];
}

export type RequestName = keyof RequestSignatures;

export interface WalletRequest<TRequestName extends RequestName> {
  name: TRequestName;
  body: RequestSignatures[TRequestName][0];
}

export type WalletResponse<TRequestName extends RequestName> = RequestSignatures[TRequestName][1];
