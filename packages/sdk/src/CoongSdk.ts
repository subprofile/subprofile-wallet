import { injectWalletAPI, setupWalletMessageHandler } from 'message';
import TabInstance from 'wallet/TabInstance';
import EmbedInstance from 'wallet/EmbedInstance';
import { assert, assertFalse, ErrorCode } from '@coong/utils';
import { MessageType, WalletEvent, WalletRequestEvent } from '@coong/base/types';
import { StandardCoongError } from '@coong/utils/errors';

const DEFAULT_WALLET_URL = 'https://coongwallet.io';

export default class CoongSdk {
  static #instance: CoongSdk;
  #embedInstance?: EmbedInstance;
  #walletUrl: string;
  #initialized: boolean;

  private constructor() {
    this.#initialized = false;
    this.#walletUrl = DEFAULT_WALLET_URL;
  }

  static instance() {
    if (!this.#instance) {
      this.#instance = new CoongSdk();
    }

    return this.#instance;
  }

  async initialize(walletUrl?: string) {
    assert(typeof window !== 'undefined', 'Coong SDK only works in browser environment!');
    assertFalse(this.#initialized, 'Coong Sdk is already initialized!');

    // TODO validate url format
    if (walletUrl) {
      this.#walletUrl = walletUrl;
    }

    this.#embedInstance = new EmbedInstance(this.#walletUrl);
    await this.#embedInstance!.initialize();

    setupWalletMessageHandler(this.#walletUrl);

    injectWalletAPI();

    this.#initialized = true;

    console.log('Coong SDK initialized!');
  }

  destroy() {
    // TODO clean up
  }

  async openWalletWindow(path = ''): Promise<Window> {
    return new TabInstance(this.#walletUrl).openWalletWindow(path);
  }

  async sendMessageToEmbedInstance(walletMessage: WalletEvent) {
    this.ensureSdkInitialized();

    this.#embedInstance!.walletWindow!.postMessage(walletMessage, this.#walletUrl || '*');
  }

  async sendMessageToTabInstance(walletMessage: WalletEvent) {
    this.ensureSdkInitialized();

    const params = new URLSearchParams({
      data: JSON.stringify({ origin: window.location.origin, data: walletMessage }),
    });

    await this.openWalletWindow(`/request?${params.toString()}`);
  }

  async sendMessageToWallet(walletMessage: WalletRequestEvent) {
    const { type, request } = walletMessage;
    assert(type === MessageType.REQUEST && request, 'Invalid message format');

    const { name } = request;

    if (name.startsWith('tab/')) {
      await this.sendMessageToTabInstance(walletMessage);
    } else if (name.startsWith('embed/')) {
      await this.sendMessageToEmbedInstance(walletMessage);
    } else {
      throw new StandardCoongError(ErrorCode.InvalidWalletRequest);
    }
  }

  ensureSdkInitialized() {
    assert(this.#initialized, 'CoongSdk has not been initialized!');
  }

  get initialized() {
    return this.#initialized;
  }
}
