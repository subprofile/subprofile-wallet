import { render, RenderOptions } from '@testing-library/react';
import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { generateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { AUTHORIZED_ACCOUNTS_KEY, AuthorizedApps } from '@coong/base/requests/WalletState';
import Keyring from '@coong/keyring';
import { PreloadedState } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import { Options } from '@testing-library/user-event/options';
import { WalletStateProvider } from 'contexts/WalletStateContext';
import ThemeProvider from 'providers/ThemeProvider';
import { newStore } from 'redux/store';
import { Props } from 'types';
import { ALERT_TIMEOUT } from 'utils/constants';

interface WrapperProps extends Props {
  preloadedState?: PreloadedState<any>;
}

const Wrapper: FC<WrapperProps> = ({ children, preloadedState }) => {
  const store = newStore(preloadedState);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <WalletStateProvider>
          {children}
          <ToastContainer
            position='top-center'
            closeOnClick
            pauseOnHover
            theme='colored'
            autoClose={ALERT_TIMEOUT}
            hideProgressBar
            limit={2}
          />
        </WalletStateProvider>
      </ThemeProvider>
    </Provider>
  );
};

interface CustomRenderOptions extends RenderOptions {
  preloadedState?: PreloadedState<any>;
}

const customRender = (ui: React.ReactElement, options?: CustomRenderOptions) => {
  return render(ui, {
    wrapper: ({ children }) => <Wrapper preloadedState={options?.preloadedState}>{children}</Wrapper>,
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render };

export const PASSWORD = 'supersecretpassword';
export const MNEMONIC = generateMnemonic(12);

export const initializeKeyring = async () => {
  const keyring = new Keyring();
  while (await keyring.initialized()) {
    await keyring.reset();
    localStorage.clear();
  }
  await keyring.initialize(MNEMONIC, PASSWORD);

  return keyring;
};

export type { UserEvent } from '@testing-library/user-event/setup/setup';
export const newUser = (options?: Options) => {
  return userEvent.setup(options);
};

interface RouterWrapperProps extends Props {
  path: string;
  currentUrl?: string;
}

export const RouterWrapper: FC<RouterWrapperProps> = ({ children, path, currentUrl }: Props) => {
  const router = createMemoryRouter(
    [
      {
        element: children,
        index: true,
        path,
      },
    ],
    { initialEntries: [currentUrl || path] },
  );

  return <RouterProvider router={router} />;
};

export const setupAuthorizedApps = (authorizedAccounts: string[] = [], appUrl?: string) => {
  const randomAppUrl = appUrl || 'https://random-app.com';
  const randomAppId = randomAppUrl.split('//')[1];

  const randomAppInfo = {
    name: 'Random App',
    url: randomAppUrl,
    authorizedAccounts: authorizedAccounts,
  };

  const authorizedApps: AuthorizedApps = {
    [randomAppId]: randomAppInfo,
  };

  localStorage.setItem(AUTHORIZED_ACCOUNTS_KEY, JSON.stringify(authorizedApps));

  return { randomAppUrl, randomAppInfo, authorizedApps };
};
