import { render, RenderOptions } from '@testing-library/react';
import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { generateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import Keyring from '@coong/keyring';
import { ThemeProvider } from '@mui/material';
import { PreloadedState } from '@reduxjs/toolkit';
import { newStore } from 'redux/store';
import light from 'themes/light';
import { Props } from 'types';
import { ALERT_TIMEOUT } from 'utils/constants';

interface WrapperProps extends Props {
  preloadedState?: PreloadedState<any>;
}

const Wrapper: FC<WrapperProps> = ({ children, preloadedState }) => {
  const store = newStore(preloadedState);

  return (
    <Provider store={store}>
      <ThemeProvider theme={light}>
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
