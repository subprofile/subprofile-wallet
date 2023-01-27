import { Injected } from '@polkadot/extension-inject/types';
import CoongSigner from 'injection/CoongSigner';
import Accounts from 'injection/Accounts';
import { SendMessage } from 'types';

export default class SubstrateInjected implements Injected {
  public readonly accounts: Accounts;
  public readonly signer: CoongSigner;

  constructor(sendMessage: SendMessage) {
    this.accounts = new Accounts(sendMessage);
    this.signer = new CoongSigner(sendMessage);
  }
}
