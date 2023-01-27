import { injectExtension } from '@polkadot/extension-inject';
import { Injected } from '@polkadot/extension-inject/types';
import { isMessageId, newMessageId, newWalletRequest } from '@coong/base';
import { MessageType, RequestName, WalletRequest, WalletResponse, WalletResponseEvent } from '@coong/base/types';
import { assert } from '@coong/utils';
import CoongSdk from 'CoongSdk';
import SubstrateInjected from 'injection/Injected';
import { Handlers } from 'types';

const handlers: Handlers = {};

export const setupWalletMessageHandler = (walletUrl?: string) => {
  walletUrl = walletUrl || '*';

  window.addEventListener('message', (event: MessageEvent<WalletResponseEvent>) => {
    const { origin, data } = event;
    if (origin !== walletUrl) {
      return;
    }

    const { id, error, response, type } = data;

    if (!isMessageId(id) || type !== MessageType.RESPONSE) {
      return;
    }

    const handler = handlers[id];

    if (!handler) {
      console.error('Unknown response ', data);
      return;
    }

    const { resolve, reject } = handler;

    if (!handler.subscriber) {
      delete handlers[id];
    }

    // TODO handle subscriptions

    if (error) {
      reject(new Error(error));
    } else {
      resolve(response);
    }
  });
};

export function sendMessage<TRequestName extends RequestName>(
  request: WalletRequest<TRequestName>,
): Promise<WalletResponse<TRequestName>> {
  return new Promise<WalletResponse<TRequestName>>((resolve, reject) => {
    assert(CoongSdk.instance().initialized, 'CoongSdk has not been initialized!');

    const id = newMessageId();
    handlers[id] = {
      resolve,
      reject,
    };

    const messageBody = newWalletRequest(request, id);

    CoongSdk.instance()
      .sendMessageToWallet(messageBody)
      .catch((error) => {
        console.error(error);
        delete handlers[id];

        reject();
      });
  });
}

export const enable = async (appName: string): Promise<Injected> => {
  try {
    await sendMessage({ name: 'embed/accessAuthorized', body: { appName } });
  } catch (e: any) {
    await sendMessage({ name: 'tab/requestAccess', body: { appName } });
  }

  return new SubstrateInjected(sendMessage);
};

export const injectWalletAPI = () => {
  injectExtension(enable, {
    name: 'coong',
    version: '0.0.1', // TODO get package version
  });
};
